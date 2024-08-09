
import { Router } from "express";
import prisma from "../config/prismaClient";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environment";

const router = Router();

router.post('/login', async (req, res) => {
  const { pubKey, githubUsername } = req.body;
  if(!pubKey || !githubUsername) {
    return res.status(400).json({
      error: 'pubKey and githubUsername are required'
    });
  }

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