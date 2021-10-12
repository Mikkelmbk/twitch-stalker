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
    if (message.content.split(" ")[0] === prefix && message.content.split(" ")[1] === "stalk" && message.content.split(" ")[2] && message.content.split(" ")[3]) {
        twitchURL = `https://www.twitch.tv/${message.content.split(" ")[2]}`;
        userToStalk = message.content.split(" ")[3];

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
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
                    let viewers = await page.$$eval('button.chat-viewers-list__button', (divs) => divs.map(div => div.textContent));
                    await browser.close();


                    console.log(viewers);
                    if(viewers.length > 0){
                        console.log(`The length of the viewers array was ${viewers.length}, so we are comparing with the staticUser array to see if someone is watching ${message.content.split(" ")[2]}.`);
                        viewers.forEach((viewer) => {
                            staticUsers.forEach((user) => {
                                if (viewer.trim() === user.name.trim()) {
                                    user.watching = true;
                                }
                                else{
                                    user.watching = false;
                                }
                            })
                        })
                    }
                    else{
                        console.log(`The length of the viewers array was ${viewers.length}, so no user was found.`);
                        staticUsers.forEach((user)=>{
                            user.watching = false;
                        })
                    }
                    
                    // staticUsers.some((user) => user.name === userToStalk.toLowerCase());

                    if (staticUsers.some((user) => user.name === userToStalk.toLowerCase())) {
                        staticUsers.forEach((user) => {
                            if (user.name === userToStalk.toLowerCase() && user.watching === true) {
                                message.reply({
                                    content: `${user.name} is watching ${message.content.split(" ")[2]}`,
                                });
                            }
                            else if (user.name === userToStalk.toLowerCase() && user.watching === false) {
                                message.reply({
                                    content: `${user.name} is not watching ${message.content.split(" ")[2]}`,
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

    if (message.content.split(" ")[0] === prefix && message.content.split(" ")[1] === "add" && message.content.split(" ")[2]) {
        staticUsers.push({
            name: message.content.split(" ")[2].toLowerCase(),
            watching: false,
        })
    }
})

client.login(process.env.DISCORDJS_BOT_TOKEN);


