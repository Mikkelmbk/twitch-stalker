const puppeteer = require("puppeteer");
require("dotenv").config();
const DiscordJS = require("discord.js");
const client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
    ]
});
const prefix = "!ts";
let twitchURL = "";
let userToStalk = "";
let staticUsers = [
    { name: "mbk_official", watching: false },
    { name: "yarrgen", watching: false },
    { name: "cptbendy", watching: false },
    { name: "benbin0", watching: false },
    { name: "eggdoodle", watching: false },
    { name: "twistedjosh", watching: false },
];
client.on("ready", () => {
    console.log("Bot is ready");
});

client.on("messageCreate", async (message) => {
    if (message.content.split(" ")[0] === prefix) {
        twitchURL = `https://www.twitch.tv/${message.content.split(" ")[1]}`;
        userToStalk = message.content.split(" ")[2];

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width: 1800,
            height: 1000,
            deviceScaleFactor: 1,
        });
        await page.goto(twitchURL, { waitUntil: 'networkidle2' });
        await page.waitForSelector("div.chat-line__status");
        await page.waitForSelector("div.stream-chat-header button.fNzXyu");
        await page.click("div.stream-chat-header button.fNzXyu");
        await page.waitForSelector("input.bCTkss");

        page.waitForTimeout(500)
            .then(async () => {
                await page.focus("input.bCTkss");
                await page.keyboard.type(userToStalk);
                console.log("typing done");
            }).then(async () => {
                setTimeout(async () => {
                    await page.waitForSelector("div.chat-shell__expanded");
                    const viewers = await page.$$eval('button.chat-viewers-list__button', (divs) => divs.map(div => div.textContent));
                    await browser.close();



                    viewers.forEach((viewer) => {
                        staticUsers.forEach((user) => {
                            if (viewer.trim() === user.name.trim()) {
                                user.watching = true;
                            }
                        })
                    })

                    // staticUsers.some((user) => user.name === userToStalk.toLowerCase());

                    if (staticUsers.some((user) => user.name === userToStalk.toLowerCase())) {
                        staticUsers.forEach((user) => {
                            if (user.name === userToStalk.toLowerCase() && user.watching === true) {
                                message.reply({
                                    content: `${user.name} is watching ${message.content.split(" ")[1]}`,
                                });
                            }
                            else if (user.name === userToStalk.toLowerCase() && user.watching === false) {
                                message.reply({
                                    content: `${user.name} is not watching ${message.content.split(" ")[1]}`,
                                });
                            }
                        })
                    }
                    else {
                        message.reply({
                            content: `"${userToStalk}" is not a king, try again`,
                        })
                    }

                }, 500);
            });



    }
})

client.login(process.env.DISCORDJS_BOT_TOKEN);

