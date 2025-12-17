const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require("./config/db");


dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://craftman-dusky.vercel.app"
  ],
  credentials: true
}));
app.use(express.json()); 

app.use("/uploads", express.static("uploads"));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const artisanRoutes = require("./routes/artisanroute");
app.use("/api/artisan", artisanRoutes);

const adminRoutes = require("./routes/adminroute");
app.use("/api/admin", adminRoutes);

const subscriptionRoutes = require("./routes/subscriptionroute");
app.use("/api/subscription", subscriptionRoutes);

const reviewRoutes = require("./routes/reviewroute");
app.use("/api/reviews", reviewRoutes);

const unlockedContactRoutes = require("./routes/unlockedcontactroute");
app.use("/api/unlocked-contacts", unlockedContactRoutes);

const profilePictureRoutes = require("./routes/profilepictureroute");
app.use("/api/profile-picture", profilePictureRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Craftsmen Backend API is running!' });
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
