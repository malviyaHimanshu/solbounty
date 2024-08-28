
import { Router, Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";
import jwt from "jsonwebtoken";
import passport, { session } from "passport";
import { User } from "../config/types";
import { Strategy as GitHubStrategy } from 'passport-github2';
import { FRONTEND_URL, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "../config/environment";
import axios from "axios";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

const router = Router();

// serialise user
passport.serializeUser((user: User, done) => {
  done(null, user);
});

// deserialise user
passport.deserializeUser((obj: User, done) => {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: GITHUB_CALLBACK_URL
}, (accessToken: string, refreshToken: string, profile: any, done: any) => {
  console.log('accessToken: ', accessToken);
  console.log('refreshToken: ', refreshToken);
  console.log('profile: ', profile);

  const user: User = {
    id: profile.id,
    username: profile.username,
    accessToken: accessToken,
  }
  return done(null, user);
}));

// github auth route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// github callback route
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), async (req, res) => {

  // check for the user in the database
  const username = req.user?.username;
  if(!username) {
    return res.status(400).json({
      error: 'username is missing'
    });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        github_username: username
      }
    });

    if(existingUser) {
      const token = jwt.sign({
        userId: existingUser.id
      }, JWT_SECRET, {
        expiresIn: '7d'
      });

      // Set token as an HTTP-only cookie
      res.cookie('auth_token', token, {
        httpOnly: true, // Prevents client-side access via JavaScript
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration set to 7 days
        sameSite: 'strict', // CSRF protection
      });

      return res.redirect(`${FRONTEND_URL}/dashboard`);
    } else {
      return res.redirect(`${FRONTEND_URL}/login`);
    }
  } catch (error) {
    console.error("error signing in: ", error);
    return res.status(500).json({
      error: 'error occurred while signing in'
    });
  }
});

// logout route
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  // clear cookie
  res.clearCookie('auth_token');
  // req.logout by passport removes the req.user property and clears the login session (if any).
  req.logout((err) => {
    if(err) return next(err);
    // destroy session
    req.session.destroy((err) => {
      if(err) return next(err);
    })
    // redirect after successful logout
    res.redirect('/');
  })
})

router.get('/status', (req: Request, res: Response) => {
  const token = req.cookies?.auth_token;
  console.log("token: ", req.cookies);
  if(!token) {
    console.log("no token found");
    return res.status(401).json({
      isAuthenticated: false
    });
  }
  
  try {
    console.log("we here");
    const decoded = jwt.verify(token, JWT_SECRET);
    
    console.log("decoded: ", decoded);
    console.log("isAuthenticated: ", req.isAuthenticated());

    if(!decoded || !req.isAuthenticated()) {
      console.log("omg we are here");
      return res.status(401).json({
        isAuthenticated: false
      });
    }
    
    console.log("we fucked");
    return res.status(200).json({
      isAuthenticated: true,
      userId: decoded
    });
  } catch (error) {
    console.log("error checking status", error);
    return res.status(401).json({
      isAuthenticated: false
    });
  }
})

router.post('/register', async (req, res) => {
  const { pubKey, signature, message } = req.body;
  if(!pubKey || !signature || !message) {
    return res.status(400).json({
      error: 'pubKey, signature and message are required'
    });
  }

  if(!req.user || !req.isAuthenticated()) {
    return res.status(401).json({
      error: 'unauthorized user'
    });
  }

  const githubUsername = req.user.username;

  try {
    const publicKeyObj = new PublicKey(pubKey);
    const signatureBuffer = Buffer.from(signature, 'base64');
    const messageBuffer = Buffer.from(message, 'utf8');

    const isValidSignature = nacl.sign.detached.verify(
      messageBuffer,
      signatureBuffer,
      publicKeyObj.toBytes()
    );

    if(!isValidSignature) {
      return res.status(400).json({
        error: 'could not verify signature!'
      });
    }

    const github_data = await axios.get(`https://api.github.com/users/${githubUsername}`);
    const userGitHubInfo = {
      name: github_data.data.name,
      avatar_url: github_data.data.avatar_url
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        account_addr: pubKey,
        github_username: githubUsername,
      }
    });

    let user, token;
    if(existingUser) {
      user = existingUser;
    } else {
      user = await prisma.user.create({
        data: {
          account_addr: pubKey,
          github_username: githubUsername,
          name: userGitHubInfo.name,
          avatar_url: userGitHubInfo.avatar_url
        }
      });
    }

    token = jwt.sign({
      userId: user.id,
    }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('auth_token', token, {
      httpOnly: true, // Prevents client-side access via JavaScript
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration set to 7 days
      sameSite: 'strict', // CSRF protection
    });

    return res.status(200).json({
      message: 'user registered successfully',
    });

  } catch (error) {
    console.error("error signing in: ", error);
    return res.status(500).json({
      error: 'error occurred while signing in'
    });
  }
})

export default router;