const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const APP_ID = "YOUR_APP_ID";
const SECRET_KEY = "YOUR_SECRET_KEY";

app.post("/create-payment", async (req, res) => {
    try {
        const { amount, order_id, name, email, phone } = req.body;

        const response = await axios.post(
            "https://api.allypay.io/payin/create",
            {
                amount,
                order_id,
                name,
                email,
                phone,
                callback_url: "https://your-app.onrender.com/webhook"
            },
            {
                headers: {
                    app_id: APP_ID,
                    secret_key: SECRET_KEY
                }
            }
        );

        res.json({ payment_url: response.data.payment_url });

    } catch (err) {
        res.status(500).send("Error");
    }
});

app.post("/webhook", (req, res) => {
    console.log("Webhook:", req.body);
    res.send({ ok: true });
});

app.get("/", (req, res) => {
    res.send("Backend Running ✅");
});

app.listen(3000);
