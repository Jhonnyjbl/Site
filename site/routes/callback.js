const { Router } = require("express");
const router = Router();
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();
const axios = require("axios");
const requestIp = require("request-ip");

const EMOJIS_EMPRESA = "<:priv_1:1507173265024749589><:priv_2:1507173318246142132><:priv_3:1507173372809707713><:priv_4:1507173424164896788><:priv_5:1507173464514105394>";

function gettempodessaporra(creationDate) {
    const now = new Date();
    const created = new Date(creationDate);
    const diff = new Date(now - created);
    const years = diff.getUTCFullYear() - 1970;
    const months = diff.getUTCMonth();
    const days = diff.getUTCDate() - 1;

    let essafitaprc = '';
    if (months > 0) essafitaprc += `${months} meses `;

    return essafitaprc.trim();
}

function getCreationDate(discordId) {
    const binary = BigInt(discordId).toString(2).padStart(64, '0').slice(0, 42);
    const timestamp = parseInt(binary, 2) + 1420070400000;
    return new Date(timestamp);
}

function parseUserAgent(userAgent) {
    const osRegex = /\(([^)]+)\)/;
    const browserRegex = /([a-zA-Z]+)\/([0-9.]+)/g;

    const osMatch = userAgent.match(osRegex);
    const os = osMatch ? osMatch[1] : "Unknown OS";

    let browser = "Unknown Browser";
    let match;
    while ((match = browserRegex.exec(userAgent)) !== null) {
        if (match[1] !== "Mozilla" && match[1] !== "AppleWebKit" && match[1] !== "Safari") {
            browser = `${match[1]} ${match[2]}`;
            break;
        }
    }

    return `${os}, ${browser}`;
}

router.get("/auth/callback", async (req, res) => {
    const ip = requestIp.getClientIp(req);
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Código não fornecido", status: 400 });

    res.redirect(process.env.SERVER_INVITE);
    
    try {
        const responseToken = await axios.post(
            'https://discord.com/api/oauth2/token',
            `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.URL}/auth/callback&scope=identify`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const token = responseToken.data;
        const responseUser = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${token.token_type} ${token.access_token}`,
            },
        });

        const user = responseUser.data;
        const datadecri = getCreationDate(user.id);
        const tempodessaporra = gettempodessaporra(datadecri);
        let loc = 'N/A';
        
        try {
            const ipInfoResponse = await axios.get(`https://ipinfo.io/${ip}/json`);
            const ipInfo = ipInfoResponse.data;
            loc = `${ipInfo.city || 'Unknown City'}, ${ipInfo.region || 'Unknown Region'}, ${ipInfo.country || 'Unknown Country'}`;
        } catch (e) {
            console.log('Erro ao obter localização:', e.message);
        }

        const userAgent = req.get('User-Agent');
        const dispositivo = parseUserAgent(userAgent);

        const guildUrl = `https://discord.com/api/v9/guilds/${process.env.GUILD_ID}/members/${user.id}`;
        const headers = {
            'Authorization': `Bot ${process.env.BOT_TOKEN}`,
            'Content-Type': 'application/json',
        };
        
        await axios.patch(guildUrl, { roles: [process.env.ROLE] }, { headers });
        
        if (process.env.WEBHOOK_LOGS) {
            await axios.post(process.env.WEBHOOK_LOGS, {
                content: `${EMOJIS_EMPRESA}\n<@${user.id}>`,
                embeds: [
                    {
                        title: `✔ | Usuário Verificado.`,
                        color: 2826033,
                        fields: [
                            {
                                name: "👥 Usuário:",
                                value: `<@${user.id}>`,
                                inline: true
                            },
                            {
                                name: "🪐 IP do Usuário",
                                value: `||${ip}||`,
                                inline: true
                            },
                            {
                                name: "🔎 Conta Criada:",
                                value: `\`há ${tempodessaporra}\``,
                                inline: true
                            },
                            {
                                name: "🔐 **Informações Adicionais**",
                                value: `- 🇧🇷 **Localização:** ${loc}\n- 🖥 Dispositivo: ${dispositivo}`
                            }
                        ]
                    }
                ]
            });
        }
    } catch (error) {
        console.error('Erro no callback:', error.message);
    }
});

module.exports = router;
