const {chromium} = require('playwright-chromium');
const axios = require("axios");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://www.essent.nl/kennisbank/zonnepanelen/wat-zijn-de-voordelen-van-zonnepanelen/salderingsregeling-zonnepanelen");
  
  const url = await page.$eval("img", (el) => el.src);
//   const url = await page.$$('img', (el) => el.src);


//   for (i = 0; i < url.length; i++){


                    console.log(url)
                    let filename = '';
                    try {
                    filename = new URL(url).pathname.split('/').pop();
                    } catch (e) {
                    console.error(e);
                    }
                    console.log(`filename: ${filename}`);

                    const response = await axios.get(url);
                    fs.writeFileSync('public/test/img/'+ filename, response.data);



  await browser.close();

// }   // Close for


})();