import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import PayOS from '@payos/node';

dotenv.config();

const app = express();

// Khởi tạo PayOS với các biến môi trường
const payOS = new PayOS(
  process.env.YOUR_CLIENT_ID,
  process.env.YOUR_API_KEY,
  process.env.YOUR_CHECKSUM_KEY
);

// Cấu hình server như bình thường
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/create-payment-link", async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:5173`;
  const { coins } = req.body;

  if (!coins || isNaN(coins) || coins <= 0) {
    return res.status(400).json({ error: "Invalid coin amount" });
  }

  const conversionRate = 100 / 100;
  const amount = coins * conversionRate;

  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: amount,
    description: `Thanh toán ${coins} xu`,
    items: [
      {
        name: `${coins} xu`,
        quantity: 1,
        price: amount,
      },
    ],
    returnUrl: `${YOUR_DOMAIN}/payment-success`,
    cancelUrl: `${YOUR_DOMAIN}/payment-failed`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    res.json({ url: paymentLinkResponse.checkoutUrl });
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
