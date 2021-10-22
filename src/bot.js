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
let staticUsers = [
    { name: "mbk_official", watching: false },
    { name: "yarrgen", watching: false },
    { name: "cptbendy", watching: false },
    { name: "benbin0", watching: false },
    { name: "eggdoodle", watching: false },
    { name: "twistedjosh", watching: false },
    { name: "yaromiss", watching: false },
    { name: "yaromisss", watching: false },
];


let predefinedStreams = [
    {
        url: "https://www.twitch.tv/sooflower",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/az9403",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/vera_zzang",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/sunha_cos",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/kkoduengeo",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/haena_0714",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/cherria7",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/akajian",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/maesiri",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/berry0314",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/velvet_7",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/parkhael",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/gilyoung8",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/luna_ddd",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/woohankyung",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/haxxnini",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/admiralbulldog",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/gksmf0f0",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/singsing",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/pinkholic93",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/wowyoming",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/jinnytty",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/kingtooth96",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/radada_",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/wjl9908",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/quin69",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/yeopu",
        user: "",
        watching: false
    },
    {
        url: "https://www.twitch.tv/saddummy",
        user: "",
        watching: false
    },
];
let running = false;
// let interval;
// let min = 60;
client.on("ready", () => {
    console.log("Bot is ready");
    let msg = "!ts status yarrgen".split(" ");
    // interval = setInterval(()=>{ multiStreamChecker(client, msg, "automatic") }, 1000 * 60 * min);
    setInterval(() => {
        console.log("Hourly interval has started");
        multiStreamChecker(client, msg, "automatic");
    }, 1000 * 60 * 60);
});



client.on("messageCreate", async (message) => {
    let msg = message.content.split(" ");
    try {
        if (!message.author.bot && msg[0] === prefix && msg[1] === "stalk" && msg[2] && msg[3]) {
            let twitchURL = `https://www.twitch.tv/${msg[2]}`;
            let userToStalk = msg[3];

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

            page.waitForTimeout(1250)
                .then(async () => {
                    await page.focus("input.bCTkss");
                    await page.keyboard.type(userToStalk);
                    console.log("typing done");
                }).then(async () => {
                    setTimeout(async () => {
                        await page.waitForSelector("div.chat-shell__expanded");
                        let viewers = await page.$$eval('button.chat-viewers-list__button', (divs) => divs.map(div => div.textContent));
                        await browser.close();


                        console.log("Viewers: ", viewers);
                        if (viewers.length > 0) {
                            console.log(`The length of the viewers array was ${viewers.length}, so we are comparing with the staticUser array to see if someone is watching ${msg[2]}.`);
                            viewers.forEach((viewer) => {
                                staticUsers.forEach((user) => {
                                    if (viewer.trim() === user.name.trim()) {
                                        user.watching = true;
                                    }
                                    else {
                                        user.watching = false;
                                    }
                                })
                            })
                        }
                        else {
                            console.log(`The length of the viewers array was ${viewers.length}, so no user was found.`);
                            staticUsers.forEach((user) => {
                                user.watching = false;
                            })
                        }


                        if (staticUsers.some((user) => user.name === userToStalk.toLowerCase())) {
                            staticUsers.forEach((user) => {
                                if (user.name === userToStalk.toLowerCase() && user.watching === true) {
                                    message.reply({
                                        content: `${user.name} is watching ${twitchURL}`,
                                    });
                                }
                                else if (user.name === userToStalk.toLowerCase() && user.watching === false) {
                                    message.reply({
                                        content: `${user.name} is not watching ${msg[2]}`,
                                    });
                                }
                            })
                        }
                        else {
                            message.reply({
                                content: `"${userToStalk}" is not a recognized username, add the user by typing "!ts add ${userToStalk}"`,
                            })
                        }
                    }, 500);
                });

        }

    } catch (error) {
        message.reply({
            content: `https://www.twitch.tv/${msg[2]} does not exist, try again.`
        })
    }
    if (!message.author.bot && msg[0] === prefix && msg[1] === "add" && msg[2]) {
        staticUsers.push({
            name: msg[2].toLowerCase(),
            watching: false,
        });
    }

    if (!message.author.bot && msg[0] === prefix && msg[1] === "status" && msg[2]) {

        if (running) {
            message.reply({
                content: "Bot is currently busy try again in a few minutes",
            })
        }
        else {
            multiStreamChecker(message, msg, "manual");
        }

    }

    if (!message.author.bot && msg[0] === prefix && msg[1] === "addStream" && msg[2]) {
        let urlFormatted = msg[2].toLowerCase().split("/").pop();
        if (predefinedStreams.every(stream => stream.url !== `https://www.twitch.tv/${urlFormatted}`)) {
            predefinedStreams.push({
                url: `https://www.twitch.tv/${urlFormatted}`,
                user: "",
                watching: false
            });
            message.reply({
                content: "Stream successfully added to the observer list."
            })
        }
        else {
            message.reply({
                content: "That stream is already being observed"
            });
        }
        console.log(predefinedStreams);
    }

    if (!message.author.bot && msg[0] === prefix && msg[1] === "help") {
        message.reply({
            content: "!ts stalk <streamname> <username> | !ts status <username> | !ts add <username> | !ts addStream <streamname>"
        })
    }

    // if(!message.author.bot && msg[0] === prefix && msg[1] === "interval" && msg[2]){
    //     if(isNaN(parseInt(msg[2]))){
    //         message.reply({
    //             content: `Wrong syntax, here is an example: "!ts interval 75" for the bot to run every 75 minutes`,
    //         });
    //     }
    //     else{
    //         min = msg[2];
    //         if(min < 45){
    //             message.reply({
    //                 content:"The bot can not run more often than every 45 minutes." 
    //             })
    //         }
    //         else{
    //             clearInterval(interval);
    //             interval = setInterval(()=>{ multiStreamChecker(message, msg, "automatic") }, 1000 * 60 * min);
    //             message.reply({
    //                 content:`Bot is running every ${min} minutes from now`,
    //             })
    //         }
    //     }

    // }
})

async function multiStreamChecker(message, msg, trigger) {
    running = true;
    predefinedStreams.forEach((stream) => {
        stream.user = msg[2];
    })

    for (let i = 0; i < predefinedStreams.length; i++) { // for begins
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

        await page.goto(predefinedStreams[i].url, { waitUntil: 'networkidle2' });
        await page.waitForSelector("div.chat-line__status");
        await page.waitForSelector("div.stream-chat-header button.fNzXyu");
        await page.click("div.stream-chat-header button.fNzXyu");
        await page.waitForSelector("input.bCTkss");

        page.waitForTimeout(1250)
            .then(async () => {
                await page.focus("input.bCTkss");
                await page.keyboard.type(msg[2]);
                // console.log("typing done");
            }).then(async () => {
                setTimeout(async () => {
                    await page.waitForSelector("div.chat-shell__expanded");
                    let viewers = await page.$$eval('button.chat-viewers-list__button', (divs) => divs.map(div => div.textContent));
                    let predefUser = predefinedStreams[i].user.trim()
                    if (viewers.some((user) => user.toLowerCase() === predefUser.toLowerCase())) {
                        // console.log(`atleast one viewer is the same as ${predefUser}`);
                        predefinedStreams[i].watching = true;
                    }
                    else {
                        // console.log(`no viewers are the same as ${predefUser}`);
                        predefinedStreams[i].watching = false;
                    }
                    await browser.close();
                    // console.log(viewers);
                    console.log(viewers, `Stream number ${i + 1} out of ${predefinedStreams.length} is ${predefinedStreams[i].url.split("/").pop()}`);
                    if (i == predefinedStreams.length - 1) {
                        console.log(predefinedStreams);
                        let statusToPrint = "";
                        if (predefinedStreams.some((stream) => stream.watching === true)) {
                            statusToPrint = `${predefUser} is currently watching the following streams: `;
                            predefinedStreams.forEach((item) => {
                                if (item.watching) {
                                    statusToPrint += `${item.url}, `;
                                }
                            })
                            if (trigger === "manual") {
                                message.reply({
                                    content: statusToPrint,
                                })
                            }
                            else if (trigger === "automatic") {
                                message.channels.cache.get("750832521838592061").send(statusToPrint);
                            }
                        }
                        else {
                            statusToPrint = `${predefUser} is currently not watching any streams`;
                            if (trigger === "manual") {
                                message.reply({
                                    content: statusToPrint,
                                })
                            }
                        }
                        running = false;
                    };
                }, 500);
            });

    } // for ends
}

client.login(process.env.DISCORDJS_BOT_TOKEN);


