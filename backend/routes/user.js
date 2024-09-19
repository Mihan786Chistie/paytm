const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User, Account } = require("../db");
const JWT_SECRET = require("../config");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware");

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string(),
    lastName: zod.string(),
});


router.post("/signup", async (req, res) => {
    try {
        const { success } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        const { username, password, firstName, lastName } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const dbUser = await User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            transactions: []
        });

        await Account.create({
            userId: dbUser._id,
            balance: 1 + Math.random() * 10000,
        });

        const token = jwt.sign({ userId: dbUser._id }, JWT_SECRET);

        res.json({
            message: "User created successfully",
            token,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

router.post("/login", async (req, res) => {
    try {
        const { success } = signinSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({
            message: "User signed in successfully",
            token,
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const updateSchema = zod.object({
    password: zod.string().min(6),
    firstName: zod.string(),
    lastName: zod.string(),
});

router.put("/", authMiddleware, async (req, res) => {
    try {
        const { success } = updateSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        let updateData = { ...req.body };
        if (req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, 10);
        }

        await User.updateOne({ _id: req.userId }, updateData);

        res.json({
            message: "User updated successfully",
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/bulk", async (req, res) => {
    try {
        const filter = req.query.filter || "";

        const users = await User.find({
            $or: [
                { firstName: { $regex: filter, $options: "i" } },
                { lastName: { $regex: filter, $options: "i" } },
                { username: { $regex: filter, $options: "i" } },
            ],
        });

        res.json({
            users: users.map(user => ({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                transactions: user.transactions,
            })),
        });
    } catch (error) {
        console.error("Bulk get error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        res.json({
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                transactions: user.transactions,
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                transactions: user.transactions,
            },
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
