import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import { createServer } from 'http';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import productRoutes from './routes/productRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import crypto from 'crypto'

dotenv.config();
const PORT = process.env.PORT; 
const app = express();
const server = createServer(app);

//initializeSocket(server);

// Connect to mongodb
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then((result) => console.log('Connected to db'))
    .catch((err) => console.log(err));

const allowedOrigins = [
'http://localhost:5173',
'http://localhost:5174',
'exp://192.168.1.3:8081',
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
app.use('/api/auth', authRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/product', productRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/payment', paymentRoutes);

// Middleware to parse raw request body
app.use(express.raw({type: 'application/json'}));

app.post('/webhook/paymongo', (req, res) => {
  const payload = req.body;
  const signature = req.headers['paymongo-signature'];

  // Verify the webhook signature
  const isValid = verifyWebhookSignature(payload, signature);

  if (isValid) {
    // payload.data.attributes.data.attributes.payments - For refund
    res.sendStatus(200);
  } else {
    console.error('Invalid webhook signature');
    res.sendStatus(400);
  }
});

function verifyWebhookSignature(payload, signature) {
  const webhookSecret = process.env.WEBHOOK_SECRET_KEY;
  
  if (!signature) {
    console.error('Missing Paymongo-Signature header');
    return false;
  }

  const components = signature.split(',');
  const timestamp = components[0].split('=')[1];
  const testSignature = components[1].split('=')[1];

  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('hex');

  const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');
  const receivedSignatureBuffer = Buffer.from(testSignature, 'hex');

  return crypto.timingSafeEqual(expectedSignatureBuffer, receivedSignatureBuffer);
}

// Start the server and connect to the database
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});