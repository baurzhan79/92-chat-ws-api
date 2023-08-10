const express = require("express");

const User = require("./models/User");
const auth = require("./middleware/auth");

const router = express.Router();

const createRouterMongoose = () => {
    router.post('/', async (req, res) => {
        try {
            const user = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });

            user.generateToken();

            await user.save();
            return res.send(user);
        }
        catch (error) {
            return res.status(400).send(error);
        }
    });

    router.get("/", async (req, res) => {
        try {
            const users = await User.find();
            res.send(users);
        }
        catch (e) {
            res.sendStatus(500);
        }
    });

    router.post('/sessions', async (req, res) => {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(400).send({ error: 'Username not found' });
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            return res.status(400).send({ error: 'Password is wrong' });
        }

        user.generateToken();
        await user.save({ validateBeforeSave: false });

        return res.send({ message: 'Username and password correct!', user });
    });

    router.delete('/sessions', auth, async (req, res) => {
        const success = { message: 'Success' };
        const user = req.user;
        user.token = '';
        user.save({ validateBeforeSave: false });
        return res.send(success);
    });

    return router;
}

module.exports = createRouterMongoose;
