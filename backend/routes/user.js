const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {User} = require("../db");
const JWT_SECRET = require("../config");
const authMiddleware = require("../middleware");

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});
router.post("/signup", async(req, res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if(!success) {
        res.status(400).json({message: "Invalid request body"});
        return;
    }

    const user = User.findOne({
        username: body.username,
    });

    if(user._id){
        res.status(400).json({message: "User already exists"});
        return;
    }
    const dbUser = await User.create(body);
    const token = jwt.sign({
        userId: dbUser._id,
    }, JWT_SECRET);
    res.json({
        message: "User created successfully",
        token
    })

});

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

router.post("/signin", async(req, res) => {
    const {success} = signinSchema.safeParse(req.body);
    if(!success) {
        res.status(400).json({message: "Invalid request body"});
        return;
    }

    const body = req.body;
    const user = await User.findOne({
        username: body.username,
        password: body.password,
    });

    if(!user) {
        res.status(400).json({message: "Invalid username or password"});
        return;
    }

    const token = jwt.sign({
        userId: user._id,
    }, JWT_SECRET);
    res.json({
        message: "User signed in successfully",
        token
    })
});

const updateSchema = zod.object({
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});

router.put("/", async(req, res) => {
    const {success} = updateSchema.safeParse(req.body);
    if(!success) {
        res.status(400).json({message: "Invalid request body"});
        return;
    }

    await User.updateOne({
        _id: req.userId,
    }, req.body);

    res.json({
        message: "User updated successfully",
    });
})


router.get("/bulk", async(req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            {firstName: {$regex: filter}},
            {lastName: {$regex: filter}},
            {username: {$regex: filter}},
        ]
    });

    res.json({
        user: users.map(user => ({
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        }))
    })
});

module.exports = router;