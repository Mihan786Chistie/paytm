const express = require("express");
const { Account, User } = require("../db");
const authMiddleware = require("../middleware");
const { mongoose } = require("mongoose");
const router = express.Router();

router.get("/balance", authMiddleware, async(req, res) => {
    const account = await Account.findOne({
        userId: req.userId,
    });

    res.json({
        balance: account.balance,
    });
});

router.post("/transfer", authMiddleware, async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const {to, amount} = req.body;

    const account = await Account.findOne({
        userId: req.userId,
    }).session(session);

    if(!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({message: "Insufficient balance"});
    }

    const toAccount = await Account.findOne({
        userId: to,
    }).session(session);

    if(!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({message: "Invalid recipient"});
    }

    await Account.updateOne({
        userId: req.userId,
    }, {
        $inc: {balance: -amount},
    }).session(session);

    await Account.updateOne({
        userId: to,
    }, {
        $inc: {balance: amount},
    }).session(session);

    await User.updateOne({
        _id: req.userId,
    }, {
        $push: {
            transactions: {
                to: to,
                amount: amount,
                timestamp: new Date(),
                sign: "-"
            }
        }
    }).session(session);

    await User.updateOne({
        _id: to
    }, {
        $push: {
            transactions: {
                to: req.userId,
                amount: amount,
                timestamp: new Date(),
                sign: "+"
            }
        }
    }).session(session);

    await session.commitTransaction();

    res.json({message: "Transfer successful"});

    session.endSession();
});

module.exports = router;

