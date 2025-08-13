require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: "pln",
          product_data: {
            name: item.title,
          },
          unit_amount: item.priceCents, // w groszach
        },
        quantity: item.qty,
      })),
      success_url: "http://localhost:5173/sukces", // tu zmienimy na Twój Netlify URL
      cancel_url: "http://localhost:5173/anulowano",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log("Server działa na porcie 4242"));
