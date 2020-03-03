const puppeteer = require('puppeteer');
const fs = require('fs');
//import '@babel/polyfill'

//require('@babel/polyfill')
require("dotenv").config();

async function scraping() {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/login');
    //await page.setViewport({ width: 5120, height: 2880 })

    const username = '#username';
    const password = '#password';
    const button = '.btn__primary--large';
    await page.waitForSelector(username);
    await page.type(username, process.env.ID);
    await page.waitForSelector(password);
    await page.type(password, process.env.PASS);
    await page.waitForSelector(button);
    await page.click(button);

    await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/', { waitUntil: 'networkidle2' });
    /*     const autoScroll = page =>
            page.evaluate(
                async () =>
                    await new Promise((resolve, reject) => {
                        let totalHeight = 0;
                        let distance = 500;
                        let timer = setInterval(() => {
                            let scrollHeight = document.body.scrollHeight;
                            window.scrollBy(0, distance);
                            window.scrollBy(0, -100);
                            totalHeight = 4537
                            if (totalHeight >= scrollHeight) {
                                clearInterval(timer);
                                resolve();
                            }
                        }, 400);
                    })
            ) */


    //autoScroll(page)
    /*   const scrolling = await page.evaluate(() => {
          // window.scrollBy(0, document.body.scrollHeight);
          return new Promise((resolve, reject) => {
              let totalHeight = 0
              let distance = 500
              let timer = setInterval(() => {
                  //let scrollHeight = document.body.scrollHeight
                  window.scrollBy(0, distance)
                  window.scrollBy(0, -100)
                  // window.scrollBy(0, -200)
                  // totalHeight += distance
                  // totalHeight = 22760
                  totalHeight = 14710
  
                  //3600, 3555        
                  //7200 ,6869
                  if (totalHeight <= scrollHeight) {
                      clearInterval(timer)
                      resolve(totalHeight)
                  }
              }, 400)
          })
      }); */

    const autoScroll = async (page) => {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                let totalHeight = 0
                let distance = 100
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight
                    window.scrollBy(0, distance)
                    totalHeight += distance
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer)
                        resolve()
                    }
                }, 100)
            })
        })
    }
    console.log(autoScroll)

    let data = await page.evaluate(() =>

        [...document.querySelectorAll('.mn-connection-card')].map(e => {
            let nombre = e.querySelector('span[class="mn-connection-card__name t-16 t-black t-bold"]').innerText
            let urlImage = e.querySelector('div[class="presence-entity presence-entity--size-5 ember-view"] > img').src
            let ocupacion = e.querySelector('span[class="mn-connection-card__occupation t-14 t-black--light t-normal"]').innerText
            return {
                nombre,
                urlImage,
                ocupacion
            }

        })

    );
    console.log(data)
    let convert = JSON.stringify(data, null, 2);
    //console.log(`conver => ${convert}`)
    console.log('faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    fs.writeFile('scrapingContacts.txt', convert, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    //await browser.close();

    //console.log(convert)
    return data;

};

module.exports = scraping