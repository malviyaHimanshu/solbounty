
import express from 'express';
import { EXPRESS_SESSION_SECRET, FRONTEND_URL, PORT } from './config/environment';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import bountyRoutes from './routes/bounty.routes';
import transactionRoutes from './routes/transaction.routes';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

// cors middleware
app.use(cors({
  origin: FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}))

// session middleware
app.use(session({
  secret: EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    secure: false, // TODO: set to true in production
  }
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/v1/auth', authRoutes);
app.use('/v1/user', userRoutes); 
app.use('/v1/bounty', bountyRoutes);
app.use('/v1/transaction', transactionRoutes);

app.get('/', (req, res) => {
  return res.send('only possible on solana');
})

app.listen(PORT, () => {
  console.log(`[${PORT}] we listening...`);
})
