const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Name is required!'], trim: true },
        email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
        password: { type: String, required: [true, 'Password is required'], minlength: 6 },
        avatar: { type: String, default: "" },
        isOnline: { type: Boolean, default: false },
        lastSeen: { type: Date, default: Date.now },
        socketId: { type: String, default: null }
    },
    { timestamps: true }
);

// Pre-save hook to hash password (async, no next)
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
