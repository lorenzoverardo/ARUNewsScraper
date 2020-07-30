const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://aru.ac.uk/news', {waitUntil: 'networkidle2'});

    await page.waitFor('body');

    // await page.screenshot({path: 'screenshot.png'}); debug
    const title = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop=url]'), element => element.textContent));
    const description = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--listing__description]'), element => element.textContent));

    for (i = 0; i < 10; i++){
        description[i] = description[i].replace("\n                        ", "");
        description[i] = description[i].replace("\n", "");

        console.log(title[i]);
        console.log(description[i]);

        if (i < 9)
            console.log();
    }

    await browser.close();
})();