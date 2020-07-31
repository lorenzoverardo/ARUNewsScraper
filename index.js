const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const data = require('./data.json');

const url = "https://aru.ac.uk/news";

var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: data.email,
      pass: data.password
    }
});

var date = new Date();
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var monthName = month[date.getMonth()];

var mailOptions = {
    from: data.sender,
    to: data.receiver,
    subject: `What's been going on - `+ monthName,
    html: ''
};

var html = fs.readFileSync('base.html','utf8')
mailOptions.html += html;
mailOptions.html += `<h1>Read ` + monthName + ` stories</h1><article class="clearfix">`;
mailOptions.html += `<table style="width: 100%; border-collapse: collapse; border-bottom: rgb(7, 41, 115); padding: 0px;" data-ogsb="rgb(255, 255, 255)"><tbody><tr><td style="width: 100%; border-bottom: 2px solid rgb(7, 41, 115); padding-bottom: 10px;" data-ogsb="rgb(255, 255, 255)"></td></tr></tbody></table>`;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});

    await page.waitFor('body');

    const title = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop=url]'), element => element.textContent));
    const description = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--listing__description]'), element => element.textContent));
    const date = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--date]'), element => element.textContent)); // 31 July 2020
    const dateFormat = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--date]'), element => element.getAttribute('content'))); // 31-07-2020
    const href = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop=url]'), element => element.getAttribute('href')));
    const imgLink = await page.evaluate(() => Array.from(document.querySelectorAll('img[class=image--float-right]'), element => element.getAttribute('src')));

    var firstNewsMonth = dateFormat[0].substring(5,7);

    for (i = 0; i < 10; i++)
    {
        if(dateFormat[i].substring(5,7) != firstNewsMonth) break;

        description[i] = description[i].replace("\n                        ", "");
        description[i] = description[i].replace("\n", "");
        description[i] = description[i].trim();

        console.log(date[i]);
        console.log(title[i]);
        console.log(description[i]);
        
        mailOptions.html += `<p class="news--date" itemprop="startDate" content="2020-07-31">${date[i]}</p>`
        mailOptions.html += `<h2 itemprop="name">${title[i]}</h2>`
        mailOptions.html += `<img src="${url.slice(0,17)}${imgLink[i]}" class="image--float-right" itemprop="image">`
        mailOptions.html += `<p class="news--listing__description" itemprop="articleBody">${description[i]}. <a href="${url.slice(0,17)}${href[i]}" itemprop="url">Read more...</a></p></article>`

        if (i != 9 && dateFormat[i+1].substring(5,7) === firstNewsMonth)
        {
            console.log();
            mailOptions.html += `<table style="width: 100%; border-collapse: collapse; border-bottom: rgb(7, 41, 115); padding: 0px;" data-ogsb="rgb(255, 255, 255)"><tbody><tr><td style="width: 100%; border-bottom: 2px solid rgb(7, 41, 115); padding-bottom: 10px;" data-ogsb="rgb(255, 255, 255)"></td></tr></tbody></table>`;
        }
    }

    if(dateFormat[9].substring(5,7) === firstNewsMonth)
    {
        await page.click('[class="pagination__next-button"]');
        await NextPage(page, firstNewsMonth);
    }
    
    await browser.close();
    console.log();
    mailOptions.html += `</section></div></body>`;
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
})();
  
async function NextPage(page, firstNewsMonth) {
    
    await page.waitFor('body');

    const title = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop=url]'), element => element.textContent));
    const description = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--listing__description]'), element => element.textContent));
    const date = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--date]'), element => element.textContent));
    const dateFormat = await page.evaluate(() => Array.from(document.querySelectorAll('p[class=news--date]'), element => element.getAttribute('content')));
    const href = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop=url]'), element => element.getAttribute('href')));
    
    for (i = 0; i < 10; i++)
    {
        if(dateFormat[i].substring(5,7) != firstNewsMonth) break;

        description[i] = description[i].replace("\n                        ", "");
        description[i] = description[i].replace("\n", "");
        description[i] = description[i].trim();

        console.log(date[i]);
        console.log(title[i]);
        console.log(description[i]);
        
        mailOptions.html += `<p class="news--date" itemprop="startDate" content="2020-07-31">${date[i]}</p>`
        mailOptions.html += `<h2 itemprop="name">${title[i]}</h2>`
        mailOptions.html += `<img src="${url.slice(0,17)}${imgLink[i]}" class="image--float-right" itemprop="image">`
        mailOptions.html += `<p class="news--listing__description" itemprop="articleBody">${description[i]}. <a href="${url.slice(0,17)}${href[i]}" itemprop="url">Read more...</a></p></article>`

        if (i != 9 && dateFormat[i+1].substring(5,7) === firstNewsMonth)
        {
            console.log();
            mailOptions.html += `<table style="width: 100%; border-collapse: collapse; border-bottom: rgb(7, 41, 115); padding: 0px;" data-ogsb="rgb(255, 255, 255)"><tbody><tr><td style="width: 100%; border-bottom: 2px solid rgb(7, 41, 115); padding-bottom: 10px;" data-ogsb="rgb(255, 255, 255)"></td></tr></tbody></table>`;
        }
    }

    if(dateFormat[9].substring(5,7) === firstNewsMonth)
    {
        await page.click('[class="pagination__next-button"]');
        await NextPage(page, firstNewsMonth);
    }
}