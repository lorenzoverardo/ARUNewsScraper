const puppeteer = require('puppeteer');
const url = "https://aru.ac.uk/news";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});

    await page.waitFor('body');

    const title = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop=url]'), element => element.textContent));
    const description = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--listing__description]'), element => element.textContent));
    const date = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--date]'), element => element.textContent));
    const dateFormat = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--date]'), element => element.getAttribute('content')));
    const href = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop=url]'), element => element.getAttribute('href')));

    var firstNewsMonth = dateFormat[0].substring(5,7);

    for (i = 0; i < 10; i++)
    {
        if(dateFormat[i].substring(5,7) != firstNewsMonth)
            break;
        else if(dateFormat[9].substring(5,7) === firstNewsMonth)
        {
            await page.click('[class="pagination__next-button"]');
            await NextPage(page);
            break;
        }
            
        description[i] = description[i].replace("\n                        ", "");
        description[i] = description[i].replace("\n", "");

        console.log(date[i]);
        console.log(title[i]+" - "+url.slice(0,17)+href[i]);
        console.log(description[i]);
        console.log();
    }
    await browser.close();
})();

async function NextPage(page) {
    
    await page.waitFor('body');

    const title = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop=url]'), element => element.textContent));
    const description = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--listing__description]'), element => element.textContent));
    const date = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--date]'), element => element.textContent));
    const dateFormat = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--date]'), element => element.getAttribute('content')));
    const href = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop=url]'), element => element.getAttribute('href')));
    
    var firstNewsMonth = dateFormat[0].substring(5,7);

    for (i = 0; i < 10; i++)
    {
        if(dateFormat[i].substring(5,7) != firstNewsMonth)
            break;
        else if(dateFormat[9].substring(5,7) === firstNewsMonth)
        {
            await page.click('[class="pagination__next-button"]');
            await NextPage(page);
            break;
        }

        description[i] = description[i].replace("\n                        ", "");
        description[i] = description[i].replace("\n", "");

        console.log(date[i]);
        console.log(title[i]+" - "+url.slice(0,17)+href[i]);
        console.log(description[i]);
        console.log();
    }
}