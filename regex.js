
const href = 'test.jpg'

const baseUrl = 'wwwwwwww.test.nl'

const href1 = 'sadasdasd'


var RegexS = new RegExp('^\/');
// var RegexS = new RegExp('/^\//i');
// var RegexS = new RegExp('/^\/[a-z0-9]+$/i');

if (RegexS.test(href)){
  // if(href2.indexOf("/") > -1) {
    
    console.log(  "This is Relative URL. String starts with slash")
    var href2 = 'https://' + baseUrl  + href
    console.log('image url start with slash BOVEN', href2)
  } else {
        console.log(  "This is Relative URL. String starts without Slash")
        var href2 = 'https://' + baseUrl + '/' + href
        console.log('image url start with slash ONDER', href2)
        

      }