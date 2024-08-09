
import { Router } from "express";
import prisma from "../config/prismaClient";
import axios from "axios";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get('/', (req, res) => {
  res.json("gm from user routes");
})

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

    const github_data = await axios.get(`https://api.github.com/users/${user.github_username}`);
    const user_data = {
      name: github_data.data.name,
      avatar_url: github_data.data.avatar_url,
      url: github_data.data.html_url,
      ...user,
    }

    return res.status(200).json({
      message: 'user details fetched successfully',
      data: user_data,
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
  const { address } = req.body;
  const userId = req.body.user.userId;
  console.log("userId: ", userId);
  console.log("address: ", address);
  if(!userId || !address) {
    return res.status(400).json({
      error: 'userId or address is missing'
    });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: parseInt(userId)
      },
      data: {
        account_addr: address
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

// TODO: show all the users who have won bounties



export default router;