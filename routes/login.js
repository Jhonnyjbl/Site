const { Router } = require("express");
const router = Router();
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();

router.get("/auth/login", async(req, res) => {
    try {
        res.redirect(oauth.generateAuthUrl({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            scope: ["identify", "guilds.join"],
            redirectUri: `${process.env.URL}/auth/callback`
        }));
    } catch(err) {
        res.status(500).json({
            message: `${err.message}`,
            status: 500
        });
    }
});

module.exports = router;
