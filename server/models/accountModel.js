import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "vendor", "admin"],
        default: "user",
    },
    balance: {
        type: Number,
        default: 0,
    },
    profilePic: {
        type: String,
        default: "",
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
    }, 
    resetPasswordExpiry: {
        type: Date,
    },
},{
    timestamps: true
});

accountSchema.pre("save", function (next) {
    if (this.isNew && this.role === "user") {
        this.balance = 10000;
    }
    next();
})

const Account = mongoose.model("Account", accountSchema)
export default Account;