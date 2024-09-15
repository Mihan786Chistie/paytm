const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

mongo_url = process.env.MONGODB_URL;

mongoose.connect(mongo_url);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
});

userSchema.methods.createHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;