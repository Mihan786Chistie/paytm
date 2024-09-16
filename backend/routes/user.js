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
    password: zod.string().min(6), // Enforcing a minimum password length
    firstName: zod.string(),
    lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
    try {
        // Validate the request body
        const { success } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        const { username, password, firstName, lastName } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const dbUser = await User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
        });

        // Create an account for the user
        await Account.create({
            userId: dbUser._id,
            balance: 1 + Math.random() * 10000,
        });

        // Generate a JWT token
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

router.post("/signin", async (req, res) => {
    try {
        // Validate the request body
        const { success } = signinSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Check if the provided password matches the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generate a JWT token
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
        // Validate the request body
        const { success } = updateSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        // Hash the new password if provided
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
            })),
        });
    } catch (error) {
        console.error("Bulk get error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
