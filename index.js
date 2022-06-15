 const { chromium } = require('playwright-chromium');
 const express = require('express');
 var cors = require('cors')
 const { aspecter } = require('aspecter')
 var urlExists = require('url-exists');

 /// Added PlaywrightBlocker and Fetch - for hopefully bypass cookiescripts
 const { PlaywrightBlocker } = require('@cliqz/adblocker-playwright');
 const fetch = require('cross-fetch')


 // get-base-url is depricated. use whatwg { URL} line....
 //  const { getBaseUrl } = require("get-base-url");
 // voor host name opzoeken, maar die heb ik al een 'parse'
 const { URL } = require('url');


 //  const { createProxyMiddleware } = require('http-proxy-middleware');


 //  const axios = require("axios");
 //  const fs = require("fs");

 const probe = require('probe-image-size');

 // voor Hostname opzoeken
 const { parse } = require('tldts');


 // https://www.npmjs.com/package/pass-cors

 const PORT = process.env.PORT || 8080;


 // ProxyMiddleware
 // const jsonPlaceholderProxy = createProxyMiddleware({
 //   target: 'http://jsonplaceholder.typicode.com/users',
 //   changeOrigin: true, // for vhosted sites, changes host header to match to target's host
 //   logger: console,
 // });

 const app = express();

 app.use(express.static('public'))
 app.use(cors())
 app.use(function(req, res, next) {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
     res.setHeader('X-Powered-By', 'JWW');
     next();
 });




 let browser;

 app.get('/', (req, res) => {
     res.send('Hello World is this Live ??');
     console.log('what is this running on... ')
         // console.log(JSON.stringify(req.headers));

 });

 //  app.use((err, req, res, next) => {
 //      console.error(err.stack)
 //      res.status(500).send('Something broke!')
 //  })

 app.get('/api/', async(req, res, next) => {

     const browser = await chromium.launch({ headless: true, chromiumSandbox: false });

     // let pages;
     try {
         const url = req.query.url || 'https://essent.nl';

         // 2 lines NEEDS TO BE REMOVED IF { URL } works.. done
         //  const baseUrl = getBaseUrl(url)
         const baseUrl = new URL(url);
         //  console.log('BaseUrl =', baseUrl)


         let hostNameElement = parse(url)
         console.log('HostnameElement =', hostNameElement)

         let hostname = hostNameElement.hostname
         let originNew = hostNameElement.domain
         let domain = hostNameElement.domain
         let subdomain = hostNameElement.subdomain
         const subWww = subdomain
         if (subWww === '') {
             var pffwwww = ''
         } else {
             var pffwwww = subdomain + '.'
         }


         const u = new URL(url)
             // u.protocol = 'https';
         console.log('BaseHref incl Protocol', u);
         const origin = u.origin

         // const context = await browser.newContext({ deviceScaleFactor: 1 });
         const context = await browser.newContext({ bypassCSP: true, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36' });
         const page = await context.newPage();

         ///// Added with AddBloker for Playwright
         PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
             blocker.enableBlockingInPage(page);
         });


         //   page.on('response', resp => {
         //     console.log(resp.request().allHeaders());
         // });


         // page.route('**/*', (route, request) => {
         //   const images = route.request().resourceType() === 'image'
         // //  console.log(request.url())
         //  console.log(images)
         //  return route.continue();
         // });

         // Log and continue all network requests


         // await page.route('**', route => {
         //   const request = route.request()
         //   request.resourceType() === 'image'
         //   console.log(request.url());
         //   return route.continue();
         // });

         // page.route.continue();

         //       def handle_response(response):
         // if (response.ok and response.request.resource_type == "image"):
         // print("<<", response.status, response.url)



         // const imageRoutes = await page.route('**/*.{png,jpg,jpeg}', route => route.fulfill())
         // console.log(imageRoutes)

         await page.goto(url, {
             waitUntil: "networkidle"
         });


         res.setHeader('Content-Type', 'application/json');
         metaData = []


         const htmlTitle = await (await page.$('title')).textContent()
             // console.log('htmltitleelement = ', htmlTitle)
         metaData.push({
             'paginatitel': htmlTitle
         })

         if (await page.$("link[rel='canonical']")) {

             const kanon = await (await page.$("link[rel='canonical']")).getAttribute('href')
             console.log(kanon)
             metaData.push({
                 'canonurl': kanon
             })
         } else {
             const canonempty = 'there is no canonical url in the html'
             metaData.push({
                 'canonurl': canonempty
             })
         }

         const metas = await page.$$('meta')

         for (i = 0; i < metas.length; i++) {
             // console.log(i)

             // const meta = 'meta'
             const metaType = await metas[i].getAttribute('name');
             const metaContent = await metas[i].getAttribute('content');
             const metaProp = await metas[i].getAttribute('property');
             // const metaPropImage = metaProp.getAttribute('og:image');


             // console.log('Type:',metaType, 'Content:', metaContent, 'OG:type', metaProp)
             // console.log('URL ',url)
             // console.log('OG Image',metaPropImage)

             metaData.push({
                     // 'meta': meta,
                     'metaElement': metaType,
                     'metaElementContent': metaContent,
                     'metaElementProperty': metaProp
                 })
                 // const tweetData = await page.$$()     
         }

         ///// Get Icons from html....
         // const icons = await page.$$("link[rel='icon'], link[rel='apple-touch-icon'], link[rel='mask-icon'], link[rel='shortcut icon']")
         const icons = await page.$$("link[sizes='180x180']")

         const iType = 'icon'
         for (i = 0; i < icons.length; i++) {
             //  console.log(i)

             // const meta = 'meta'
             //  const itempropSource = await icons[i].getAttribute('content')
             const linkhref = await icons[i].getAttribute('href');

             //  const linkhref = await icons[i].getAttribute('href');
             //  console.log(typeof linkhref)

             //  const linkhref = linkhrefBots.concat(itempropSource);
             //  const linkhref = {...linkhrefBots, ...itempropSource }
             //  const linkhref = Object.assign({}, linkhrefBots, itempropSource);
             //  console.log(linkhref)
             //  const linkhref = itempropSource + linkhrefBots
             const linksize = await icons[i].getAttribute('sizes');
             const linktype = await icons[i].getAttribute('type');

             //  if (linkhref === null || itempropSource.length === 0) {
             if (linkhref === null) {
                 console.log('linkhref NOT FOUND OR FILLED')
                 var linkhref2 = 'https://via.placeholder.com/1'
             } else {

                 // Href starts With //website.com/pffff.html   
                 var RegExStartWithDoubleSlash = new RegExp('^\/\/');
                 linkhref2 = ''
                 if (RegExStartWithDoubleSlash.test(linkhref)) {
                     /// VOOR KPN.com -- xs4all.nl??
                     var linkhref2 = 'https:' + linkhref
                     console.log('HREF starts with //', linkhref2)
                 } else {

                     var RegexSingleSlash = new RegExp('^\/');

                     if (RegexSingleSlash.test(linkhref)) {
                         console.log("This is Relative URL. String starts with single slash")

                         // Need to check if image is on www or on non-www
                         // var href2 = 'https://www.' + baseUrl  + href
                         //  var linkhref2 = origin + linkhref
                         // For Google. Site is without www, images are with www.
                         var linkhref2 = 'https://' + pffwwww + domain + linkhref
                         console.log('image url start with slash BOVEN', linkhref2)

                         //  urlExists(linkhref2, function(err, exists) {
                         //      console.log(exists); // false
                         //  });

                     } else {
                         console.log("This is absolute URL. String starts without single Slash")

                         // var href2 = 'https://www.' + baseUrl + '/' + href
                         // var href2 = u + '/' + href
                         //  var linkhref2 = origin + '/' + linkhref
                         //  var linkhref2 = 'https://www.' + baseUrl + '/' + linkhref
                         var linkhref2 = linkhref
                         console.log('image url start with slash ONDER', linkhref2)

                     }


                     // var linkhref2 = linkhref
                 }

             }

             metaData.push({
                 'type': iType,
                 'linkhref': linkhref2,
                 'linksize': linksize,
                 'linktype': linktype
             })

         }

         // Push meta image itemProps in json
         const metaIcons = await page.$$("meta[itemprop='image']")
             // const iType = 'icon'
         for (i = 0; i < metaIcons.length; i++) {
             //  console.log(i)

             // const meta = 'meta'
             const linkhref = await metaIcons[i].getAttribute('content')
             const linksize = null
             const linktype = null
             console.log('ICON LINK', linkhref)
             if (linkhref === null) {
                 console.log('linkhref NOT FOUND OR FILLED')
                 const linkhref2 = 'https://via.placeholder.com/1'
             } else {
                 // Href starts With //website.com/pffff.html   
                 var RegExStartWithDoubleSlash = new RegExp('^\/\/');
                 linkhref2 = ''
                 if (RegExStartWithDoubleSlash.test(linkhref)) {
                     const linkhref2 = 'https:' + linkhref
                     console.log('ICON LINK itemprop HREF starts with //', linkhref2)
                 } else {
                     const RegexSingleSlash = new RegExp('^\/');
                     if (RegexSingleSlash.test(linkhref)) {
                         console.log("ICON LINK  This is Relative itemProp URL. String starts with single slash")
                             //  var linkhref2 = origin + linkhref


                         if (linkhref.includes('//www.')) {
                             const linkhref2 = 'https://' + pffwwww + domain + linkhref
                             console.log('ICON LINK relatieve IconHref-met-//www. leave as be https://www ', linkhref2)
                         } else {
                             const linkhref2 = 'https://' + pffwwww + domain + linkhref
                             console.log('ICON LINK relatieve IconHref-zonder-//www maak er https://www van', linkhref2)


                             urlExists(linkhref2, function(err, exists) {
                                 console.log(exists); // true
                                 console.log('ICON link 1', linkhref2)
                                 if (exists === false) {
                                     const linkhref2 = 'https://wwwwwwwwwwwwwwwwww.' + domain + linkhref
                                     console.log('ICON LINK NEW : In de if urlExists module', linkhref2);
                                     return;
                                 }
                             });

                             console.log('ICON link 2', linkhref2)

                         }


                         //  var linkhref2 = 'https://www.' + baseUrl + linkhref


                     } else {
                         console.log("This is Relative itemprop URL. String starts without single Slash")
                             //  var linkhref2 = origin + '/' + linkhref
                         const linkhref2 = 'https://www.' + pffwwww + domain + '/' + linkhref
                         console.log('image url start with slash ONDER', linkhref2)

                     }

                     console.log('ICON link 3', linkhref2)

                     // var linkhref2 = linkhref
                 }

             }



             metaData.push({
                 'type': iType,
                 'linkhref': linkhref2,
                 'linksize': linksize,
                 'linktype': linktype
             })

         }


         // "meta":"meta","metaElement":null,"metaElementContent":"https://socialsharepreview.com/images/social-share-preview-og.jpg","metaElementProperty":"og:image"}

         // result = []

         /// OP BASIS van 1 element wat hierboven opgehaald wordt (og image) onderstaande actie verder uitgevoerd. Volgorde kan niet andersom.

         var result = metaData.filter(obj => {
             return obj.metaElementProperty === 'og:image'
         })
         console.log('RESULT', result)
         console.log('RESULT.lenght', result.length)
         if (result.length === 0) {
             var result = metaData.filter(obj => {
                 return obj.metaElement === 'og:image'
             })
         }
         console.log('RESULT', result)
         console.log('RESULT.lenght', result.length)


         if (result.length > 0) {

             // OG image gefilerd:
             console.log('Dit is de OGimage array', result)
                 // console.log(JSON.stringify(result))
                 // const result2 = JSON.stringify(result)
                 // console.log(result2)

             const user = result
             const [{ metaElement, metaElementContent, metaElementProperty }] = user;
             // const [{ meta, metaElement, metaElementContent, metaElementProperty}] = user;

             console.log('String image url:', metaElementContent)


             if (metaElementContent === '') {
                 // String image url is empty / null
                 // Niet ideaal. fake OG image als er geen echte OG image gevonden wordt.
                 console.log('No open grapgh image found')
                 metaData.push({
                     'ogi': 'ogi',
                     openGraphImageDetails: {
                         width: 0,
                         height: 0,
                         type: ' Not found',
                         mime: '',
                         wUnits: ' Not found',
                         hUnits: ' Not found',
                         length: 0,
                         url: 'https://via.placeholder.com/1'
                     }
                 })

             } else {
                 // 

                 // let openGraphImageDetails = await probe(metaElementContent, { rejectUnauthorized: true })
                 let openGraphImageDetails = await probe(metaElementContent, {
                         headers: {
                             accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                             "accept-encoding": "gzip, deflate, br",
                             referer: "",
                             "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,it;q=0.7",
                             "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50",
                         },
                     })
                     .then((res) => {
                         console.log("...succeded");
                         return res;
                     })
                     .catch((err) => {
                         console.log("...failed");
                         console.error(err);
                         return 0;
                     });


                 console.log(openGraphImageDetails);

                 metaData.push({
                     'ogi': 'ogi',
                     openGraphImageDetails
                     // width: 1200,
                     // height: 630,
                     // type: 'jpg',
                     // mime: 'image/jpeg',
                     // wUnits: 'px',
                     // hUnits: 'px',
                     // length: 428769,
                     // url: 'https://social
                 })

             }


         } else {
             // Niet ideaal. fake OG image als er geen echte OG image gevonden wordt.
             console.log('No open grapgh image found')
             metaData.push({
                 'ogi': 'ogi',
                 openGraphImageDetails: {
                     width: 0,
                     height: 0,
                     type: ' Not found',
                     mime: '',
                     wUnits: ' Not found',
                     hUnits: ' Not found',
                     length: 0,
                     url: 'https://via.placeholder.com/1'
                 }
             })
         }


         // sizeOf(result, function (err, dimensions) {
         //   console.log(dimensions.width, dimensions.height)
         // })

         // Log and continue all network requests

         const images = await page.$$('img')
             // console.log(images)



         allImages = []

         //  const srcs = images.getAttribute = 'src'
         // console.log('Alle sources',srcs)

         for (i = 0; i < images.length; i++) {
             const href = await images[i].getAttribute('src');
             // console.log('HREF = ', href)

             /// Lege HREF dan fake image. -OF- Geen hostname in url van image (voor ads etc) dan klein image gebruiken. 
             // relatieve afbeelding bevat geen hostname.

             // const hostnameImg = parse(href)
             // const hostnameImgdomain = hostnameImg.domain 
             // console.log('HostnameImg = ', hostnameImg)
             // console.log('Host name image domain = ', hostnameImgdomain)
             // console.log('hostname van query-url', hostName)

             // if(href === null && href.toLowerCase().indexOf(hostName) === -1){
             // if(hostnameImgdomain === null || hostnameImg.toLowerCase().indexOf(hostName) === -1){
             if (href === null) {
                 console.log('HREF NOT FOUND OR FILLED')
                 var href2 = 'https://via.placeholder.com/1'
             } else {


                 // Href starts With //website.com/pffff.html
                 var RegExSlash = new RegExp('^//');
                 href2 = ''
                 if (RegExSlash.test(href)) {
                     /// VOOR KPN.com -- xs4all.nl??
                     var href2 = 'https:' + href
                     console.log('HREF starts with //', href2)
                 } else {


                     // https://www.essent.nl/content/index.html
                     // //
                     // /


                     /// Lege HREF dan fake image. -OF- Geen hostname in url van image (voor ads etc) dan klein image gebruiken. 
                     // relatieve afbeelding bevat geen hostname.

                     // const hostnameImg = parse(href)
                     // const hostnameImgdomain = hostnameImg.domain 
                     // console.log('HostnameImg = ', hostnameImg)
                     // console.log('Host name image domain = ', hostnameImgdomain)
                     // console.log('hostname van query-url', hostName)

                     // if(href === null && href.toLowerCase().indexOf(hostName) === -1){
                     // if(hostnameImgdomain === null || hostnameImg.toLowerCase().indexOf(hostName) === -1){
                     if (href.includes(".svg")) {


                         console.log('HREF IS SVG - remove...')
                             // uitgezet omdat logo kpn een svg is. zal wel vaker geval zijn.
                             // var href2 = 'https://via.placeholder.com/1'
                     } else {

                         // if HREF begint met data:image dan leeg image neerplotten
                         var RegEx = new RegExp('^data:image');
                         href2 = ''
                         if (RegEx.test(href)) {
                             // console.log('DATA image gevonden')
                             var href2 = 'https://via.placeholder.com/1'
                         } else {

                             // else Dan nieuwe Regex die checkt of url absoluut of relatief is.

                             var RgExp = new RegExp('^(?:[a-z]+:)?//', 'i');

                             // href2 = ''
                             if (RgExp.test(href)) {
                                 // If dat het een ABsolute url is.

                                 console.log("This is Absolute URL.", href)
                                 var href2 = href
                                 console.log('Absolute Url', href2)

                             } else {
                                 // ELSE = RELATIEVE URL
                                 // console.log(  "This is Relative URL.")
                                 // TEST IF urlstring met een SLASH of NIET.

                                 var RegexS = new RegExp('^\/');
                                 // var RegexS = new RegExp('/^\//i');
                                 // var RegexS = new RegExp('/^\/[a-z0-9]+$/i');

                                 if (RegexS.test(href)) {
                                     console.log("This is Relative URL. String starts with slash", href)

                                     // Need to check if image is on www or on non-www
                                     //  if (href.includes('//www.')) {
                                     var href2 = 'https://' + pffwwww + domain + href
                                     console.log('relatieve href-met-//www. leave as be https://www ', href2)
                                         //  } else {
                                         //      var href2 = 'https://www.' + pffwwww + domain + href
                                         //      console.log('relatieve href-zonder-www maak er https://www van', href2)
                                         //  }


                                     //  var href2 = 'https://www.' + baseUrl + href
                                     //      //  var href2 = origin + href
                                     //  console.log('Wat is deze?? een relatieve url die niet met slash begint, image url start with slash BOVEN', href2)


                                 } else {
                                     console.log("This is Relative URL. String starts without Slash", href)
                                         // --> THIS WORKS for google.nl  (might be http... or folder/  Zou dan toch gewoon href moeten zijn... als absolute url??)




                                     var href2 = 'https://' + pffwwww + domain + '/' + href
                                         // var href2 = u + '/' + href
                                         //  var href2 = origin + '/' + href
                                     console.log('image url start without slash ONDER', href2)

                                 }

                             }

                         } // DICHT ELSE DATA:url

                     } // DICHT ELSE VAN SVG   

                 } // DICHT ELSE van StartsWithSlashSlash

             } // DICHT ELSE VAN NoHREF     


             // https://www.google.nl/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png
             // https://google.nl/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png

             // probe(src [, options|keepOpen]) -> Promise
             // probe('', {})

             // let imagedetails2 = await probe(href2, { rejectUnauthorized: false });
             // https://github.com/nodeca/probe-image-size/issues/7
             // async method (with callback or promise) if you need to get image info by url.

             // let imagedetails2 = await probe(href2, { rejectUnauthorized: true })
             let imagedetails2 = await probe(href2, {
                 headers: {
                     accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                     "accept-encoding": "gzip, deflate, br",
                     referer: "",
                     "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,it;q=0.7",
                     "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50",
                 },

             })

             .then((resolve) => {
                     console.log("...succeded");

                     return resolve;
                 })
                 // .then((res) => {
                 //   console.log("...succeded");
                 //   // console.log(res);
                 //   console.log('WIDTH', res.width);
                 //   console.log('HEIGHT',res.height);

             //   // aspectImg.forEach(res => {
             //     function gcd2 (a2, b2) {
             //       return (b2 == 0) ? a2 : gcd2 (b2, a2%b2);
             //     }
             //     var w2 = (Number(res.width));
             //     var h2 = (Number(res.height));
             //     var r2 = gcd2 (w2, h2);
             //     var left2 =  w2/r2
             //     var right2 = h2/r2
             //     // console.log('ASPECT MFFCKKRR ', left2)
             //     console.log('ASPECT MFFCKKRR', left2, right2)
             //     // })
             //     // var aspectratio = left2 + ':' + right2
             //     return res.right2;                       

             //   // return res;
             // })

             .catch((err) => {
                 console.log("...failed");
                 // console.error(err);
                 return 0;
             });
             //   let imagedetails2 = await probe(href2, function(err, result) {
             //   // console.log(result);
             //   if(err) reject(err);
             // });

             // console.log(imagedetails2);
             let type = 'image'

             metaData.push({
                 'type': type,
                 'imgsrc': href2,
                 'imgDetails': imagedetails2,
                 // 'aspectratio':   res.right2,
             })


         } // end van For Loop








         metaData.push({
             'baseUrl': baseUrl,
             'base2': u,
             'hostname': hostname,
             'hostnameElement': hostNameElement,
             'originBase': origin,
             'realBase': originNew
         })



         //           ////////////////////////OLD OLD OLD 
         // const entries = await page.$$('img');
         // imgDetails = []

         //   for (let i = 0; i < entries.length; i++) {
         //     // Query for the next title element on the page
         //     // const title = await entries[i].$('td.title > a');
         //     const href = await entries[i].getAttribute('src');
         //                 var RgExp = new RegExp('^(?:[a-z]+:)?//', 'i');
         //                 href2 = ''
         //                 if (RgExp.test(href)) {
         //                     console.log ( "This is Absolute URL.")
         //                 var href2 = href
         //                 } else {
         //                     console.log(  "This is Relative URL.")
         //                 var href2 = 'https://' + baseUrl + href
         //                 }
         //     const title = await entries[i].getAttribute('alt');
         //     // Write the entry to the console
         //     // console.log(`${i + 1}: ${await title.innerText()}`);
         //      console.log(`${i + 1}: ${await title} ${await href2}`);
         //     // testExport.push(`${i + 1} {alt: ${await title}} {src: ${await href}}`)
         //     // testExport.push(`{alt: ${await title}, src: ${await href}}`)
         // //   let allElements = (`${i + 1}: ${await title} ${await href}`);
         //         imgDetails.push({
         //             imgId: i,
         //             alt: title,
         //             src: href2
         //         });
         //   }
         // // END IMAGES 
         // // START HEADINGS
         // const urlHrefs = await page.$$('a, button');
         // linkDetails = []

         //   for (let i = 0; i < urlHrefs.length; i++) {
         //     const href = await urlHrefs[i].getAttribute('href');

         //     const linkTxt = await urlHrefs[i].textContent();
         //     const linkTxtR = linkTxt.replace(/\s/g,' ').trim()
         //     // console.log(`${i + 1}: ${await title.innerText()}`);
         //      console.log(`${i + 1}: ${await linkTxtR} ${await href}`);
         //     // testExport.push(`${i + 1} {alt: ${await title}} {src: ${await href}}`)
         //     // testExport.push(`{alt: ${await title}, src: ${await href}}`)
         // //   let allElements = (`${i + 1}: ${await title} ${await href}`);
         // linkDetails.push({
         //             linkId: i,
         //             linkTxt: linkTxtR,
         //             linkUrl: href
         //         });
         //   }
         // // END HEADINGS



         // // START HEADINGS
         // // var regex = new RegExp('<\/?h[1-6]>','ig');

         // // (?i)<h([1-6].*?)>(.*?)</h([1-6])>

         // const headIngs = await page.$$('h[1-6]>','ig');
         const headIngs = await page.$$("h1, h2, h3, h4, h5, h6, p");
         headingDetails = []

         for (let i = 0; i < headIngs.length; i++) {
             // Query for the next title element on the page
             // const title = await entries[i].$('td.title > a');
             // const type = await headIngs[i].tagName;
             // const typeSort = type('tagName');

             const headingTxt = await headIngs[i].textContent();
             const headingTxtR = headingTxt.replace(/\s/g, ' ').trim()
                 // const type = await headIngs[i].getProperty('tagName').jsonValue();
             const type = await headIngs[i].evaluate(e => e.tagName);
             // const type = headingTxtR.tagName;

             // if (headIngs[i].tagName ='p') { 
             //     var type = 'paragraaf'
             // }
             // if (headIngs[i].tagName = 'h1')  { 
             //     var type = 'Heading 1'
             // }


             // Write the entry to the console
             // console.log(`${i + 1}: ${await title.innerText()}`);

             // deze outcommented:
             // console.log(`${i + 1}: ${await headingTxtR} `);


             // testExport.push(`${i + 1} {alt: ${await title}} {src: ${await href}}`)
             // testExport.push(`{alt: ${await title}, src: ${await href}}`)
             //   let allElements = (`${i + 1}: ${await title} ${await href}`);
             metaData.push({
                 headingId: i,
                 typeElement: type,
                 headingTxt: headingTxtR,
                 // linkUrl: href
             });
         }
         //   console.log(headingDetails)
         // END HEADINGS

         // // FORMS START

         // const formhtml = await page.$$('form');
         // formDetails = []

         //   for (let i = 0; i < formhtml.length; i++) {
         //     // const formcode = await formhtml[i].getAttribute('href');
         //     const formcode = await formhtml[i].innerHTML();

         //     // const linkTxt = await formhtml[i].textContent();
         //     // const linkTxtR = linkTxt.replace(/\s/g,' ').trim()

         //     // console.log(`${i + 1}: ${await title.innerText()}`);
         //      console.log(`${i + 1}: ${await formcode} `);
         //     // testExport.push(`${i + 1} {alt: ${await title}} {src: ${await href}}`)
         //     // testExport.push(`{alt: ${await title}, src: ${await href}}`)
         // //   let allElements = (`${i + 1}: ${await title} ${await href}`);
         // formDetails.push({
         //             formId: i,
         //             formHtmlCode: formcode
         //             // linkUrl: href
         //         });
         //   }
         // // FORMS END

         // // FORMS START

         // const tablehtml = await page.$$('table');
         // tableDetails = []

         //   for (let i = 0; i < formhtml.length; i++) {
         //     // const formcode = await formhtml[i].getAttribute('href');
         //     const tablecode = await tablehtml[i].innerHTML();

         //     // const linkTxt = await formhtml[i].textContent();
         //     // const linkTxtR = linkTxt.replace(/\s/g,' ').trim()

         //     // console.log(`${i + 1}: ${await title.innerText()}`);
         //      console.log(`${i + 1}: ${await tablecode} `);
         //     // testExport.push(`${i + 1} {alt: ${await title}} {src: ${await href}}`)
         //     // testExport.push(`{alt: ${await title}, src: ${await href}}`)
         // //   let allElements = (`${i + 1}: ${await title} ${await href}`);
         // tableDetails.push({
         //             tableId: i,
         //             tableHtmlCode: tablecode
         //             // linkUrl: href
         //         });
         //   }
         // // FORMS END

         // //   res.send({testExport});


         // // totalArray = linkDetails + imgDetails
         // //   res.send(JSON.stringify({totalArray}));




         // totalArray= linkDetails.concat(imgDetails).concat(headingDetails).concat(formDetails).concat(tableDetails);
         // ///////////////////////////////////OLD OLD OLD

         //outgezet
         // console.log(metaData)

         res.send(metaData);
         // res.send('jsonnn');
         res.end();

         await page.close();
         await browser.close();

     } catch (error) {

         // Output an error if it occurred
         console.error('Faal', error.message);


     }
     // }     /////end van Async 


 });

 app.listen(PORT);
 console.log(`Running on :${PORT}`);