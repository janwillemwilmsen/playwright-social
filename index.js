 
const {chromium} = require('playwright-chromium');
const express = require('express');
const cors = require('cors')
const { getBaseUrl } = require("get-base-url");

const probe = require('probe-image-size');

const proxy = require('pass-cors')

// https://www.npmjs.com/package/pass-cors

const PORT = process.env.PORT || 8080;


const app = express();

app.use(express.static('public'))
app.use(cors())
app.use('/proxy', proxy);
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
   });

   app.get('/api/', async (req, res, next) => {

    const browser = await chromium.launch({ headless: true, chromiumSandbox: false });

	// let pages;
	try {
		const url = req.query.url || 'https://essent.nl';
        const baseUrl = getBaseUrl(url)

        const context = await browser.newContext({ deviceScaleFactor: 1 });
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


          const htmlTitle = await (await page.$('title')).innerText()
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
            
            // const data = result
            // const [{metaElementContent}] = data;
            // console.log('String image url:', data)
            // const ogimagedetails = result
            
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
          else{
            console.log('No open grapgh image found')
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


          // if HREF begint met data:image dan negeren
          var RegEx = new RegExp('^data:image');
          href2 = ''
          if (RegEx.test(href)) {
            console.log('DATA image gevonden')
            var href2 = 'https://via.placeholder.com/1'
          }

          else {

            // else Dan nieuwe Regex die checkt of url absoluut of relatief is.
            var RgExp = new RegExp('^(?:[a-z]+:)?//', 'i');
            href2 = ''
            if (RgExp.test(href)) {
              console.log ( "This is Absolute URL.")
              var href2 = href
            } else {
              console.log(  "This is Relative URL.")

              var RegexS = new RegExp(/^\/[a-z0-9]+$/i);

              if (RegexS.test(href)){
                console.log('image url start with slash BOVEN')
                var href2 = 'https://' + baseUrl + href
              } else {
                console.log('image url start with slash ONDER')
                var href2 = 'https://' + baseUrl + '/' + href

              }

            }
            
          }
          // probe(src [, options|keepOpen]) -> Promise
          // probe('', {})

          // let imagedetails2 = await probe(href2, { rejectUnauthorized: false });
          // https://github.com/nodeca/probe-image-size/issues/7
          // async method (with callback or promise) if you need to get image info by url.

          let imagedetails2 = await probe(href2);
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
    ///// test wat
    
    });
      
    app.listen(PORT);
    console.log(`Running on :${PORT}`);
    