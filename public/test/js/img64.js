const imageToBase64 = require('image-to-base64');
// const url = 'https://example.com/test.jpg';
const url = 'https://www.essent.nl/-/media/images/001-particulier/kennisbank/zonnepanelen/salderingsregeling-zonnepanelen.ashx?la=nl-nl&hash=AC5CC4664F650EDFC660D4B374518CD1';

imageToBase64(url) // insert image url here. 
    .then( (response) => {
          console.log(response);  // the response will be the string base64.
      }
    )
    .catch(
        (error) => {
            console.log(error);
        }
    )