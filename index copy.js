 
const {chromium} = require('playwright-chromium');
const express = require('express');
var cors = require('cors')
const { getBaseUrl } = require("get-base-url");
const { createProxyMiddleware } = require('http-proxy-middleware');


const axios = require("axios");
const fs = require("fs");

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
app.use(function (req, res, next) {
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

   app.get('/api/', async (req, res, next) => {

    const browser = await chromium.launch({ headless: true, chromiumSandbox: false });

	// let pages;
	try {
		const url = req.query.url || 'https://essent.nl';
        const baseUrl = getBaseUrl(url)
        console.log('BaseUrl =', baseUrl)
        
        
        let hostNameElement = parse(url)
        console.log('HostnameElement =', hostNameElement)

        let hostname = hostNameElement.hostname

        const u = new URL(url)
        // u.protocol = 'https';
        console.log('BaseHref incl Protocol',u);
        const origin = u.origin

        // const context = await browser.newContext({ deviceScaleFactor: 1 });
        const context = await browser.newContext({bypassCSP: true});
        const page = await context.newPage();


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

          const metas = await page.$$('meta')

          for( i = 0; i < metas.length; i++){
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

          // "meta":"meta","metaElement":null,"metaElementContent":"https://socialsharepreview.com/images/social-share-preview-og.jpg","metaElementProperty":"og:image"}

          // result = []

          /// OP BASIS van 1 element wat hierboven opgehaald wordt (og image) onderstaande actie verder uitgevoerd. Volgorde kan niet andersom.

          let result = metaData.filter(obj => {
            return obj.metaElementProperty === 'og:image'
          })

          if (result.length > 0){
           
            // OG image gefilerd:
            console.log('Dit is de OGimage array', result)
            // console.log(JSON.stringify(result))
            // const result2 = JSON.stringify(result)
            // console.log(result2)
            
            const user = result
            const [{  metaElement, metaElementContent, metaElementProperty}] = user;
            // const [{ meta, metaElement, metaElementContent, metaElementProperty}] = user;
            
            console.log('String image url:', metaElementContent)


            if(metaElementContent === ''){ 
              // String image url is empty / null
               // Niet ideaal. fake OG image als er geen echte OG image gevonden wordt.
                          console.log('No open grapgh image found')
                          metaData.push({
                            'ogi': 'ogi', 
                            openGraphImageDetails: { width:  0,
                            height: 0,
                            type: ' Not found',
                            mime: '',
                            wUnits: ' Not found',
                            hUnits: ' Not found',
                            length: 0,
                            url: 'https://via.placeholder.com/1'}
                          })

            }
            else {
              // 
          
                                  let openGraphImageDetails = await probe(metaElementContent);
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


          }
          else{
            // Niet ideaal. fake OG image als er geen echte OG image gevonden wordt.
            console.log('No open grapgh image found')
            metaData.push({
              'ogi': 'ogi', 
              openGraphImageDetails: { width:  0,
              height: 0,
              type: ' Not found',
              mime: '',
              wUnits: ' Not found',
              hUnits: ' Not found',
              length: 0,
              url: 'https://via.placeholder.com/1'}
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

        for (i = 0; i < images.length; i++){
          const href = await images[i].getAttribute('src');
          console.log('HREF = ', href)

          /// Lege HREF dan fake image. -OF- Geen hostname in url van image (voor ads etc) dan klein image gebruiken. 
          // relatieve afbeelding bevat geen hostname.

          // const hostnameImg = parse(href)
          // const hostnameImgdomain = hostnameImg.domain 
          // console.log('HostnameImg = ', hostnameImg)
          // console.log('Host name image domain = ', hostnameImgdomain)
          // console.log('hostname van query-url', hostName)

          // if(href === null && href.toLowerCase().indexOf(hostName) === -1){
            // if(hostnameImgdomain === null || hostnameImg.toLowerCase().indexOf(hostName) === -1){
              if(href === null){
                console.log('HREF NOT FOUND OR FILLED')
                var href2 = 'https://via.placeholder.com/1'
              }
              else {
    
             
    // Href starts With //website.com/pffff.html
    var RegExSlash = new RegExp('^//');
    href2 = ''
    if(RegExSlash.test(href)) {
    
      console.log('HREF starts with //')
      var href2 = 'https://=' + href
    }
    else {
    
    
              /// Lege HREF dan fake image. -OF- Geen hostname in url van image (voor ads etc) dan klein image gebruiken. 
              // relatieve afbeelding bevat geen hostname.
    
              // const hostnameImg = parse(href)
              // const hostnameImgdomain = hostnameImg.domain 
              // console.log('HostnameImg = ', hostnameImg)
              // console.log('Host name image domain = ', hostnameImgdomain)
              // console.log('hostname van query-url', hostName)
    
              // if(href === null && href.toLowerCase().indexOf(hostName) === -1){
                // if(hostnameImgdomain === null || hostnameImg.toLowerCase().indexOf(hostName) === -1){
                if(href.includes(".svg")){
              
    
                console.log('HREF IS SVG - remove...')
                var href2 = 'https://via.placeholder.com/1'
              }
                  else{
    
                            // if HREF begint met data:image dan leeg image neerplotten
                            var RegEx = new RegExp('^data:image');
                            href2 = ''
                            if (RegEx.test(href)) {
                              // console.log('DATA image gevonden')
                              var href2 = 'https://via.placeholder.com/1'
                            }
                            else {
                                  
                                  // else Dan nieuwe Regex die checkt of url absoluut of relatief is.
                                            
                                            var RgExp = new RegExp('^(?:[a-z]+:)?//', 'i');
    
                                            // href2 = ''
                                            if (RgExp.test(href)) {
                                            // If dat het een ABsolute url is.
    
                                              console.log ( "This is Absolute URL.")
                                              var href2 = href
                                              console.log('Absolute Url', href2)
                                       
                                            } 
                                            else 
                                              {
                                                // ELSE = RELATIEVE URL
                                              console.log(  "This is Relative URL.")
                                                  // TEST IF urlstring met een SLASH of NIET.
    
                                                                  var RegexS = new RegExp('^\/');
                                                                  // var RegexS = new RegExp('/^\//i');
                                                                  // var RegexS = new RegExp('/^\/[a-z0-9]+$/i');
                                                      
                                                          if (RegexS.test(href)){                                                   
                                                                  console.log(  "This is Relative URL. String starts with slash")
    
                                                                  // Need to check if image is on www or on non-www
                                                                  // var href2 = 'https://www.' + baseUrl  + href
                                                                  var href2 = origin + href
                                                                  console.log('image url start with slash BOVEN', href2)
                                                        
                                                        
                                                          } else {
                                                                  console.log(  "This is Relative URL. String starts without Slash")
    
                                                                  // var href2 = 'https://www.' + baseUrl + '/' + href
                                                                  // var href2 = u + '/' + href
                                                                  var href2 = origin + '/' + href
                                                                  console.log('image url start with slash ONDER', href2)
                                                        
                                                                }
    
                              }
                              
                            }   // DICHT ELSE DATA:url
    
                          }  // DICHT ELSE VAN SVG   
    
                        } // DICHT ELSE van StartsWithSlashSlash
    
                      } // DICHT ELSE VAN NoHREF     


                      // https://www.google.nl/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png
                      // https://google.nl/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png

          // probe(src [, options|keepOpen]) -> Promise
          // probe('', {})

          // let imagedetails2 = await probe(href2, { rejectUnauthorized: false });
          // https://github.com/nodeca/probe-image-size/issues/7
          // async method (with callback or promise) if you need to get image info by url.

          let imagedetails2 = await probe(href2, { rejectUnauthorized: true })
          .then((res) => {
            console.log("...succeded");
            return res;
          })
          .catch((err) => {
            console.log("...failed");
            console.error(err);
            return 0;
          });
          //   let imagedetails2 = await probe(href2, function(err, result) {
          //   // console.log(result);
          //   if(err) reject(err);
          // });
          console.log(imagedetails2);
          let type = 'image'

          metaData.push({
            'type': type,
            'imgsrc': href2,
            'imgDetails': imagedetails2,
          })

        }
          

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

// // const headIngs = await page.$$('h[1-6]>','ig');
// const headIngs = await page.$$("h1, h2, h3, h4, h5, h6, p");
// headingDetails = []

//   for (let i = 0; i < headIngs.length; i++) {
//     // Query for the next title element on the page
//     // const title = await entries[i].$('td.title > a');
//     // const type = await headIngs[i].tagName;
//     // const typeSort = type('tagName');

//     const headingTxt = await headIngs[i].textContent();
//     const headingTxtR = headingTxt.replace(/\s/g,' ').trim()
//     // const type = await headIngs[i].getProperty('tagName').jsonValue();
//        const type = await headIngs[i].evaluate(e => e.tagName);
//     // const type = headingTxtR.tagName;

// // if (headIngs[i].tagName ='p') { 
// //     var type = 'paragraaf'
// // }
// // if (headIngs[i].tagName = 'h1')  { 
// //     var type = 'Heading 1'
// // }


//     // Write the entry to the console
//     // console.log(`${i + 1}: ${await title.innerText()}`);
//      console.log(`${i + 1}: ${await headingTxtR} `);
//     // testExport.push(`${i + 1} {alt: ${await title}} {src: ${await href}}`)
//     // testExport.push(`{alt: ${await title}, src: ${await href}}`)
// //   let allElements = (`${i + 1}: ${await title} ${await href}`);
// headingDetails.push({
//             headingId: i,
//             type: type,
//             headingTxt: headingTxtR,
//             // linkUrl: href
//         });
//   }
// //   console.log(headingDetails)
// // END HEADINGS

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

console.log(metaData)

res.send(metaData);
  // res.send('jsonnn');
  res.end();

  await page.close();
  await browser.close();

    } catch (error) {

		// Output an error if it occurred
		console.error(error.message);


    }
    // }     /////end van Async 

    
    });
      
    app.listen(PORT);
    console.log(`Running on :${PORT}`);
    