
import { Router } from "express";
import prisma from "../config/prismaClient";
import axios from "axios";
import { authMiddleware, gitAuthMiddleware } from "../middleware/authMiddleware";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

const router = Router();

// get current user details
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.body.user.userId;
  if(!userId) {
    return res.status(400).json({
      error: 'userId is missing'
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      }
    });

    console.log("user: ", user);
    

    return res.status(200).json({
      message: 'user details fetched successfully',
      data: user,
    });
  } catch (error) {
    console.error("error fetching user details: ", error);
    return res.status(500).json({
      error: 'error fetching user details'
    });
  }
});

router.get('/profile', gitAuthMiddleware, async (req, res) => {
  const accessToken = req.user?.accessToken;
  if(!accessToken) {
    return res.status(400).json({
      error: 'accessToken is missing'
    });
  }
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log("userProfile: ", response.data);
  
    res.status(200).json({
      message: 'user profile fetched successfully',
      data: response.data,
    });
  } catch (error) {
    console.error("error fetching user profile: ", error);
    return res.status(500).json({
      error: 'error fetching user profile'
    });
  }
});

// get user profile details
router.get('/:userId', authMiddleware, async (req, res) => {
  const userId = req.params.userId;
  if(!userId) {
    return res.status(400).json({
      error: 'userId is missing'
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      }
    });

    if(!user) {
      return res.status(404).json({
        error: 'user not found'
      });
    }

    return res.status(200).json({
      message: 'user details fetched successfully',
      data: user,
    });
  } catch (error) {
    console.error("error fetching user details: ", error);
    return res.status(500).json({
      error: 'error fetching user details'
    });
  }
})

// update account address
router.post('/update', authMiddleware, async (req, res) => {
  const { pubKey, signature, message } = req.body;
  const userId = req.body.user.userId;
  console.log("userId: ", userId);
  console.log("address: ", pubKey);
  if(!userId || !pubKey) {
    return res.status(400).json({
      error: 'userId or address is missing'
    });
  }

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

    const user = await prisma.user.update({
      where: {
        id: parseInt(userId)
      },
      data: {
        account_addr: pubKey
      }
    });
    console.log("user: ", user);

    return res.status(200).json({
      message: 'account address updated successfully',
      data: user,
    });
  } catch (error) {
    console.error("error updating address: ", error);
    return res.status(500).json({
      error: 'error updating address'
    });
  }
})


// TODO: get all the attemptted bounties by a user


// TODO: show all the users who have won bounties



export default router;