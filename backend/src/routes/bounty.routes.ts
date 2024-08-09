
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import prisma from "../config/prismaClient";

const router = Router();

// get all bounties present in the system
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bounties = await prisma.bounty.findMany();
    return res.status(200).json({
      message: 'bounties fetched successfully',
      data: bounties,
    });
  } catch (error) {
    console.error("error fetching bounties: ", error);
    return res.status(500).json({
      error: 'error fetching bounties'
    });
  }
})

// create a new bounty
router.post('/', authMiddleware, async (req, res) => {
  const { issue_url, amount, token } = req.body;
  const userId = req.body.user.userId;
  if (!issue_url || !amount || !token) {
    return res.status(400).json({
      error: 'issue_url, amount and token are required'
    });
  }

  try {
    const bounty = await prisma.bounty.create({
      data: {
        issue_url,
        amount,
        token,
        created_by_id: userId
      }
    });

    return res.status(200).json({
      message: 'bounty created successfully',
      data: bounty
    });

  } catch (error) {
    console.error("error creating bounty: ", error);
    return res.status(500).json({
      error: 'error creating bounty'
    });
  }
})

// update bounty winner to a bounty
router.post('/winner', authMiddleware, async (req, res) => {
  const { bountyId, winnerId } = req.body;
  if (!bountyId || !winnerId) {
    return res.status(400).json({
      error: 'bountyId and winnerId are required'
    });
  }

  try {
    const bounty = await prisma.bounty.update({
      where: {
        id: bountyId
      },
      data: {
        won_by_id: winnerId
      }
    });

    return res.status(200).json({
      message: 'bounty winner updated successfully',
      data: bounty
    });

  } catch (error) {
    console.error("error updating bounty winner: ", error);
    return res.status(500).json({
      error: 'error updating bounty winner'
    });
  }
});

// get a bounty detail by id
router.get('/detail/:bountyId', authMiddleware, async (req, res) => {
  const bountyId = req.params.bountyId;
  if (!bountyId) {
    return res.status(400).json({
      error: 'bountyId is required'
    });
  }

  try {
    const bounty = await prisma.bounty.findUnique({
      where: {
        id: Number(bountyId)
      }
    });

    return res.status(200).json({
      message: 'bounty fetched successfully',
      data: bounty
    });

  } catch (error) {
    console.error("error fetching bounty: ", error);
    return res.status(500).json({
      error: 'error fetching bounty'
    });
  }

});

// get bounties created by a user
router.get('/created_by', authMiddleware, async (req, res) => {
  const userId = req.body.user.userId;
  if (!userId) {
    return res.status(400).json({
      error: 'userId is required'
    });
  }

  console.log("userId: ", userId);

  try {
    const bounties = await prisma.bounty.findMany({
      where: {
        created_by_id: Number(userId)
      }
    });

    return res.status(200).json({
      message: 'bounties fetched successfully',
      data: bounties
    });

  } catch (error) {
    console.error("error fetching bounties: ", error);
    return res.status(500).json({
      error: 'error fetching bounties'
    });
  }
});

// get bounties won by a user
router.get('/won_by/:userId', authMiddleware, async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({
      error: 'userId is required'
    });
  }

  try {
    const bounties = await prisma.bounty.findMany({
      where: {
        won_by_id: Number(userId)
      }
    });

    return res.status(200).json({
      message: 'bounties fetched successfully',
      data: bounties
    });

  } catch (error) {
    console.error("error fetching bounties: ", error);
    return res.status(500).json({
      error: 'error fetching bounties'
    });
  }
});

// TODO: get bounties based on the organisation / project


export default router;