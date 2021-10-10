const puppeteer = require("puppeteer");
let twitchURL = "https://www.twitch.tv/esfandtv";
let userToStalk = "A";
(async () => {
     
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
                console.log(`Viewers found when searching for "${userToStalk}": `,viewers);
            }, 500);
        });
})();