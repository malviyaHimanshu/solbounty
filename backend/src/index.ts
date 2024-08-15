
import express from 'express';
import { EXPRESS_SESSION_SECRET, PORT } from './config/environment';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import bountyRoutes from './routes/bounty.routes';
import passport from 'passport';
import session from 'express-session';

const app = express();
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`[${PORT}] we listening...`);
})
