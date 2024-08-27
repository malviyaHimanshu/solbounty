import { Router } from "express";
import prisma from "../config/prismaClient";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// get all transactions for a user
router.get('/', authMiddleware, async (req, res) => {
  const user = req.user;
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            from: {
              id: Number(user?.id)
            }
          },
          {
            to: {
              id: Number(user?.id)
            }
          }
        ]
      },
      include: {
        from: true,
        to: true
      }
    });

    return res.status(200).json({
      message: 'Transactions fetched successfully',
      transactions
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
  console.log('fetching all transactions');
  
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        from: true,
        to: true
      }
    });

    return res.status(200).json({
      message: 'Transactions fetched successfully',
      transactions
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
  
  if(!payer || !recipient || !amount || !tokenType || !pr_url || !signature) {
    return res.status(400).json({ 
      error: 'Invalid request' 
    });
  }
  
  try {
    // TODO: verify signature

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