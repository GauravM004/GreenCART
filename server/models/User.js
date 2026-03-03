import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    provider: { 
        type: String, 
        enum: ["local", "google"], 
        default: "local" 
    },
    cartItems: { type: Object, default: {} },
    phone: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
}, { minimize: false });

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
