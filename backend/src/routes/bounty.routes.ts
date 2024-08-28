
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import prisma from "../config/prismaClient";
import axios from "axios";

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
  const accessToken = req.user?.accessToken;
  if (!issue_url || !amount || !token) {
    return res.status(400).json({
      error: 'issue_url, amount and token are required'
    });
  }

  const regex = /^https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/issues\/[0-9]+$/;
  if (!issue_url.match(regex)) {
    return res.status(400).json({
      error: 'issue_url is not a valid github issue url'
    });
  }

  const issue_owner = issue_url.split('/')[3];
  const issue_repo = issue_url.split('/')[4];
  const issue_number = issue_url.split('/')[6];
  const apiUrl = `https://api.github.com/repos/${issue_owner}/${issue_repo}/issues/${issue_number}`

  try {
    // get issue details from github api
    const issueResponse = await axios.get(apiUrl, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const bounty = await prisma.bounty.create({
      data: {
        issue_url,
        issue_owner,
        issue_repo,
        issue_number: Number(issue_number),
        issue_title: issueResponse.data.title,
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

// TODO: add auth middleware
// get a bounty detail by issue url
router.post('/detail/issue_url', authMiddleware, async (req, res) => {
  const issueUrl = req.body.issueUrl;
  if (!issueUrl) {
    return res.status(400).json({
      error: 'issueUrl is required'
    });
  }

  const regex = /^https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/issues\/[0-9]+$/;
  if (!issueUrl.match(regex)) {
    return res.status(400).json({
      error: 'issue_url is not a valid github issue url'
    });
  }

  try {
    const bounty = await prisma.bounty.findUnique({
      where: {
        issue_url: issueUrl
      }
    });

    console.log("bounty: ", bounty);
    

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

router.post('/detail/pr_url', authMiddleware, async (req, res) => {
  const prUrl = req.body.prUrl;
  const username = req.user?.username;
  const accessToken = req.user?.accessToken;
  console.log("this is the username: ", username);
  
  if (!prUrl) {
    return res.status(400).json({
      error: 'prUrl is required'
    });
  }

  const regex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)$/;
  const match = prUrl.match(regex);
  if (!match) {
    return res.status(400).json({
      error: 'prUrl is not a valid github pr url'
    });
  }

  const owner = match[1];
  const repo = match[2];
  const prNumber = match[3];
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

  try {
    const prResponse = await axios.get(apiUrl, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    // console.log("prResponse: ", prResponse.data);

    const user = await prisma.user.findUnique({
      where: {
        github_username: prResponse.data.user.login
      }
    });

    if(!user) {
      return res.status(400).json({
        error: 'user is not authorized to claim this bounty'
      });
    } else if(user && user.github_username !== username) {
      return res.status(200).json({
        message: 'user fetched successfully',
        data: user,
        isAuthorized: false   // user can not attempt an issue
      })
    }

    if(user && user.github_username === username) {
      return res.status(200).json({
        message: 'user fetched successfully',
        data: user,
        isAuthorized: true   // user can attempt an issue
      });
    }
  } catch (error) {
    console.error("error fetching bounty: ", error);
    return res.status(500).json({
      error: 'error fetching bounty'
    });
  }
});

// TODO: add auth middleware
// get all bounties by owner and repo
router.post('/by_owner_repo', authMiddleware, async (req, res) => {
  const { owner, repo } = req.body;
  if (!owner || !repo) {
    return res.status(400).json({
      error: 'owner and repo are required'
    });
  }

  try {
    const bounties = await prisma.bounty.findMany({
      where: {
        issue_owner: owner,
        issue_repo: repo
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
})

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


// TODO: create an attempt for a bounty
// TODO: add auth middleware
// TODO: add pr detail or pr link to the attempt as well
router.post('/attempt', authMiddleware, async (req, res) => {
  const { bountyId, signature } = req.body;
  const userId = req.body.user.userId;
  if (!bountyId || !signature) {
    return res.status(400).json({
      error: 'bountyId and signature are required'
    });
  }

  try {
    // check whether user has already attempted this bounty
    const existingAttempt = await prisma.attempt.findFirst({
      where: {
        bounty_id: Number(bountyId),
        user_id: Number(userId)
      }
    });

    if(existingAttempt) {
      return res.status(400).json({
        error: 'User has already attempted this bounty'
      });
    }

    const attempt = await prisma.attempt.create({
      data: {
        bounty: {
          connect: {
            id: Number(bountyId)
          }
        },
        user: {
          connect: {
            id: Number(userId)
          }
        },
        status: 'IN_PROGRESS',
        signature: signature
      }
    })

    return res.status(200).json({
      message: 'attempt created successfully',
      data: attempt
    });

  } catch (error) {
    console.error("error creating attempt: ", error);
    return res.status(500).json({
      error: 'error creating attempt'
    });
  }
});

// TODO: approve a bounty claim
router.post('/approve', authMiddleware, async (req, res) => {
  const { attemptId, signature } = req.body;

  try {
    const attempt = await prisma.attempt.findUnique({
      where: {
        id: Number(attemptId)
      },
      include: {
        bounty: true
      }
    });

    if(!attempt) {
      return res.status(404).json({
        error: 'attempt not found'
      });
    }

    const updatedAttempt = await prisma.attempt.update({
      where: {
        id: Number(attemptId)
      },
      data: {
        status: 'COMPLETED',
        signature: signature
      }
    })

    const updatedBounty = await prisma.bounty.update({
      where: {
        id: attempt.bounty.id
      },
      data: {
        won_by_id: attempt.user_id
      }
    });

    return res.status(200).json({
      message: 'bounty claim approved successfully',
      data: updatedAttempt
    });

  } catch (error) {
    console.error("error approving bounty claim: ", error);
    return res.status(500).json({
      error: 'error approving bounty claim'
    });
  }
});


// TODO: get all the attemps for a bounty



export default router;





/**
 * some things to note:
 * - adding issue_owner, issue_repo, issue_number to bounty table
 * - now making the bounty detail api work to get the bounty details such as issue_owner, issue_repo, issue_number, amount, token etc.
 * - need to add api for claiming a bounty
 * - need to add api for approving a bounty claim
 * - also need to fix the auth_token cookie expiring instantly
 */