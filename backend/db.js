const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
require('dotenv').config();

mongo_url = process.env.MONGODB_URL;

mongoose.connect(mongo_url);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    transactions: [
        {
            to: { type: String, required: true },
            amount: { type: Number, required: true },
            timestamp: { type: Date, default: Date.now },
            sign: { type: String, required: true }
        }
    ]
});

userSchema.methods.createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    balance: {
        type: Number,
        required: true,
    }
});

const Account = mongoose.model("Account", accountSchema);

module.exports = { User, Account };
