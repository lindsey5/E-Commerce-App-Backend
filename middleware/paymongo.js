import crypto from 'crypto'
import { socketInstance } from './socket.js';

export const paymongoWebhook = (req, res) => {
  const payload = req.body;
  const signature = req.headers['paymongo-signature'];

  // Verify the webhook signature
  const isValid = verifyWebhookSignature(payload, signature);
  if (isValid && payload.data.attributes.type === 'payment.paid') {
    const paymentIntentId = payload.data.attributes.data.attributes.payment_intent_id
    const { items, address, user } = payload.data.attributes.data.attributes.metadata

    socketInstance.emit('order-placed', { items: JSON.parse(items), address: JSON.parse(address), user: JSON.parse(user), paymentIntentId })  

    // payload.data.attributes.data.attributes.payments - For refund
    res.sendStatus(200);
  }else if(isValid && payload.data.attributes.type === 'payment.failed'){
    socketInstance.emit('failed');
  } else {
    console.error('Invalid webhook signature');
    res.sendStatus(400);
  }
}

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