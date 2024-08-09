import express from 'express';
import { PORT } from './config/environment';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import bountyRoutes from './routes/bounty.routes';

const app = express();
app.use(express.json());

app.use('/v1/auth', authRoutes);
app.use('/v1/user', userRoutes); 
app.use('/v1/bounty', bountyRoutes);

app.listen(PORT, () => {
  console.log(`[${PORT}] we listening...`);
})
