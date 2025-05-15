import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import { createServer } from 'http';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import productRoutes from './routes/productRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cartRoutes from './routes/cartRoute.js';
import orderRoutes from './routes/orderRoutes.js';
import { paymongoWebhook } from './middleware/paymongo.js';
import { initializeSocket } from './middleware/socket.js';

dotenv.config();
const PORT = process.env.PORT; 
const app = express();
const server = createServer(app);

initializeSocket(server);

// Connect to mongodb
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then((result) => console.log('Connected to db'))
    .catch((err) => console.log(err));

const allowedOrigins = [
'http://localhost:5173',
'http://localhost:5174',
'http://localhost:8081'
];

app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));
  
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/product', productRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/order', orderRoutes);

app.post('/webhook/paymongo', paymongoWebhook);

// Start the server and connect to the database
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});