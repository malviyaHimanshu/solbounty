
import { Router, Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";
import jwt from "jsonwebtoken";
import passport, { session } from "passport";
import { User } from "../config/types";
import { Strategy as GitHubStrategy } from 'passport-github2';
import { DASHBOARD_URL, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "../config/environment";

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
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect(DASHBOARD_URL);
});

// logout route
router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
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

router.post('/login', async (req, res) => {
  const { pubKey } = req.body;
  if(!pubKey) {
    return res.status(400).json({
      error: 'pubKey is required'
    });
  }

  if(!req.user || req.isAuthenticated()) {
    return res.status(401).json({
      error: 'unauthorized user'
    });
  }

  const githubUsername = req.user.username;

  try {
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
        }
      });
    }

    token = jwt.sign({
      userId: user.id,
    }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(200).json({
      token,
    })

  } catch (error) {
    console.error("error signing in: ", error);
    return res.status(500).json({
      error: 'error occurred while signing in'
    });
  }
})

export default router;