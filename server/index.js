import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import { connectNodemailer } from "./config/mail.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
await connectCloudinary();
connectNodemailer();
const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
})) 

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});