import { Router } from "express";
import prisma from "../config/prismaClient";
import { authMiddleware } from "../middleware/authMiddleware";
import axios from "axios";

const router = Router();

// get all transactions for a user
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.body.user.userId;
  
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            from: {
              id: Number(userId)
            }
          },
          {
            to: {
              id: Number(userId)
            }
          }
        ]
      },
      include: {
        from: true,
        to: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const updateTransactions = transactions.map((transaction) => {
      const baseTransaction = {
        id: transaction.id,
        amount: transaction.amount,
        token: transaction.token,
        pr_detail: {
          title: transaction.pr_title,
          number: transaction.pr_number,
          url: transaction.pr_url,
          avatar: transaction.org_avatar_url
        },
        signature: transaction.signature,
        from: transaction.from,
        to: transaction.to,
        created_at: transaction.created_at
      }

      if(transaction.from.id === Number(userId)) {
        return {
          ...baseTransaction,
          type: 'sent',
          profile: transaction.from,
          other_party: transaction.to,
        }
      } else if(transaction.to.id === Number(userId)) {
        return {
          ...baseTransaction,
          type: 'received',
          profile: transaction.to,
          other_party: transaction.from,
        }
      }
    });

    return res.status(200).json({
      message: 'Transactions fetched successfully',
      data: updateTransactions
    });

  } catch (error) {
    console.error('error fetching transactions: ', error);
    return res.status(500).json({ 
      error: 'Error fetching transactions' 
    });
  }
});

// get all transactions present in the system
router.get('/all', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        from: true,
        to: true
      }
    });

    const updateResponse = transactions.map((transaction) => {
      return {
        id: transaction.id,
        amount: transaction.amount,
        token: transaction.token,
        pr_detail: {
          title: transaction.pr_title,
          number: transaction.pr_number,
          url: transaction.pr_url,
          avatar: transaction.org_avatar_url
        },
        signature: transaction.signature,
        to: transaction.to,
        created_at: transaction.created_at,
      }
    });

    return res.status(200).json({
      message: 'Transactions fetched successfully',
      data: updateResponse
    });

  } catch (error) {
    console.error('error fetching transactions: ', error);
    return res.status(500).json({ 
      error: 'Error fetching transactions' 
    });
  }
});

// register transaction
router.post('/', authMiddleware, async (req, res) => {
  const { payer, recipient, amount, tokenType, pr_url, signature } = req.body;
  const userId = req.body.user.userId;
  const accessToken = req.user?.accessToken;
  
  if(!payer || !recipient || !amount || !tokenType || !pr_url || !signature) {
    return res.status(400).json({ 
      error: 'Invalid request' 
    });
  }

  const regex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)$/;
  const match = pr_url.match(regex);
  if (!match) {
    return res.status(400).json({
      error: 'Invalid PR URL'
    });
  }

  const owner = match[1];
  const repo = match[2];
  const prNumber = match[3];
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
  
  try {
    // TODO: verify signature


    // get PR details
    const prResponse = await axios.get(apiUrl, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const prTitle = prResponse.data.title;
    const orgAvatar = prResponse.data.base.user.avatar_url;

    // get recipient id
    const exisitingUser = await prisma.user.findFirst({
      where: {
        account_addr: recipient
      }
    });

    if(!exisitingUser) {
      return res.status(400).json({
        message: 'Recipient not found!' 
      });
    }

    // register transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: amount,
        token: tokenType,
        pr_url: pr_url,
        pr_title: prTitle,
        pr_number: Number(prNumber),
        org_avatar_url: orgAvatar,
        signature: signature,
        from: {
          connect: {
            id: Number(userId)
          }
        },
        to: {
          connect: {
            id: exisitingUser.id
          }
        }
      }
    });

    return res.status(200).json({
      message: 'Transaction registered successfully',
      transaction
    });

  } catch (error) {
    console.error('error registering transaction: ', error);
    return res.status(500).json({ 
      error: 'Error registering transaction' 
    });
  }
});

export default router;