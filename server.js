const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 Apne credentials daalo
const APP_ID = "YOUR_APP_ID";
const SECRET_KEY = "YOUR_SECRET_KEY";

// 🟢 Create Payment (Correct API)
app.post("/create-payment", async (req, res) => {
    try {
        const { amount, order_id, name, email, phone } = req.body;

        const response = await axios.post(
            "https://api.allypay.io/api/payin",
            {
                userAppId: APP_ID,
                userSecret: SECRET_KEY,
                orderNo: order_id,

                userNotifyUrl: "https://payment-backend-84zi.onrender.com/webhook",
                userReturnUrl: "https://your-site.com/success",

                currency: "INR",
                amount: amount,

                name: name,
                email: email,
                mobile: phone
            }
        );

        res.json({
            payment_url: response.data.payurl
        });

    } catch (err) {
        console.log(err.response?.data || err.message);
        res.status(500).send("Payment Error");
    }
});

// 🔔 Webhook (UPDATED)
app.post("/webhook", (req, res) => {
    const data = req.body;

    console.log("Webhook:", data);

    const status = data.status;
    const order_id = data.merOrderNo;

    if (status == 2 || status == 3) {
        console.log("✅ Payment Success:", order_id);

        // 👉 Yahan future me Firebase update karenge

    } else {
        console.log("❌ Payment Failed:", order_id);
    }

    res.send({ ok: true });
});

app.get("/", (req, res) => {
    res.send("Backend Running ✅");
});

app.listen(3000, () => console.log("Server started"));
