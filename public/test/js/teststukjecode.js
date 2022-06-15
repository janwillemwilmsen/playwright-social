const twitterShow = document.getElementById('twitter-show')
twitterShow.style = `                                           width: 506px; height:340px;  
                                                                background-size: cover;
                                                                background-position: center;
                                                                background-repeat: no-repeat;
                                                                padding: 12px 12px 8px 54px;
                                                                margin: 0 auto;
                                                                text-align: left;
                                                                border: 1px solid #dbdbdb;
                                                                border-radius: 12px;`

const summContainer = document.createElement('div')
summContainer.style = `display: flex; flex-direction: row; width:455px; border-radius: 5px; height:125px; padding:0px; border: 1px solid #dbdbdb; background:;`





const leftImage = document.createElement('div')

console.log('Twitter Image Lenght for summary',twitterValueImage.length)
if(twitterValueImage.length === 1){
    const [{metaElement, metaElementContent, metaElementProperty}] = twitterValueImage
    console.log('metaElementContent IF IF OF', metaElementContent)
    // var metaElementContentContent = metaElementContent
    leftImage.style = `
                    // url('${metaElementContent}');
                    width:125px;
                    height:125px;
                    // border: 1px solid #dbdbdb;
                    border-right: 1px solid #dbdbdb;
                    border-radius: 5px 0px 0px 5px; 
                    background: url('${metaElementContent}');
                    background-size: cover;
                    // background-color: pink;
                    background-position: center;
                    background-repeat: no-repeat;
                    // padding: 12px 12px 8px 54px;
                    margin: 0 auto;')`
    // leftImage.style = `background-image: url(${metaElementContent});`
}
else{
     

  
    // dan fallback image
    // First Check if there is an og:image
    console.log('og-image-fallback for twitter summaru',ogImageElement)
    
    
    if(ogImageElement.length === 1) {

         {
                    const [{metaElement, metaElementContent, metaElementProperty}] = ogImageElement;
                    console.log('DESTRUCTURED Array OG IMG - twitter image fallback to OG', metaElementContent )
                    console.log('Checking If OG image is there .... metaElementContent === "some url"  - twitter image fallback to OG')
                    
                    
                    leftImage.style = ` width:125px;
                                        height:125px;
                                        // border: 1px solid #dbdbdb;
                                        border-right: 1px solid #dbdbdb;
                                        border-radius: 5px 0px 0px 5px; 
                                        background: url('${metaElementContent}');
                                        background-size: cover;
                                        // background-color: pink;
                                        background-position: center;
                                        background-repeat: no-repeat;
                                        // padding: 12px 12px 8px 54px;
                                        margin: 0 auto;')`
                    
                
            }
    }
    else{
        console.log('OG image fallback for twitter not available')

        leftImage.style = `
                    // url('${metaElementContent}');
                    width:125px;
                    height:125px;
                    // border: 1px solid #dbdbdb;
                    border-right: 1px solid #dbdbdb;
                    border-radius: 5px 0px 0px 5px; 
                    background: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22%238899A6%22%20viewBox%3D%220%200%2024%2024%22%3E%0A%20%20%20%20%3Cpath%20id%3D%22bounds%22%20opacity%3D%220%22%20d%3D%22M0%200h24v24H0z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M14%2011.25H6c-.414%200-.75.336-.75.75s.336.75.75.75h8c.414%200%20.75-.336.75-.75s-.336-.75-.75-.75zM14%207.25H6c-.414%200-.75.336-.75.75s.336.75.75.75h8c.414%200%20.75-.336.75-.75s-.336-.75-.75-.75zM10.75%2015.25H6c-.414%200-.75.336-.75.75s.336.75.75.75h4.75c.414%200%20.75-.336.75-.75s-.336-.75-.75-.75z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M21.5%2011.25h-3.25v-7C18.25%203.01%2017.24%202%2016%202H4C2.76%202%201.75%203.01%201.75%204.25v15.5C1.75%2020.99%202.76%2022%204%2022h15.5c1.517%200%202.75-1.233%202.75-2.75V12c0-.414-.336-.75-.75-.75zm-18.25%208.5V4.25c0-.413.337-.75.75-.75h12c.413%200%20.75.337.75.75v15c0%20.452.12.873.315%201.25H4c-.413%200-.75-.337-.75-.75zm16.25.75c-.69%200-1.25-.56-1.25-1.25v-6.5h2.5v6.5c0%20.69-.56%201.25-1.25%201.25z%22%2F%3E%0A%3C%2Fsvg%3E%0A');
                    // background-size: cover;
                    background-color: #e1e8ed;
                    background-position: center;
                    background-repeat: no-repeat;
                    // padding: 0px 12px 8px 54px;
                    margin: 0 auto;')`

    }




}

// leftImage.style = ` `




console.log('Twitter Title for SHOW', twitterTitleForTwitterCard)
console.log('Twitter Title FallBack for SHOW = og-title', waarde)
console.log('twitter:description = ', twitterDescriptionForTwitterCard)
console.log('Base url For Twitter = ', baseUrlecht)



const rightText = document.createElement('div')
rightText.style = `width:310px; height:105px; background:;border-radius: 0px 5px 5px 0px;padding:10px; `
rightText.style.animation = 'background: #F5F8FA;'

const twitSumTitle = document.createElement('h2')
twitSumTitle.style = `  font-size: 0.95em;
                        font-weight:700;
                        max-height: 1.3em;
                        white-space: nowrap;
                        overflow: hidden;
                        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
                        margin: 0 0 0.15em;
                        text-overflow: ellipsis;
                        `
twitSumTitle.innerText = twitterTitleForTwitterCard
const twitSumDesc = document.createElement('p')
twitSumDesc.style = `max-height: 3.9em;
                    color: #292F33;
                    margin-top: 0.32333em;
                    font-size: 15px;
                    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
                    line-height: 1.3em;
                    overflow:hidden;
                    text-decoration-thickness:auto;
                    text-size-adjust: 100%;
                    margin-bottom: 0px;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical; `

twitSumDesc.innerText = twitterDescriptionForTwitterCard
const twitSumUrl = document.createElement('span')
twitSumUrl.style = `text-transform: lowercase;
                    color: #8899A6;
                    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
                    font-size: 14px;
                    max-height: 1.3em;
                    margin-bottom: 0px;
                    white-space: nowrap;
                    margin-top: 0.32333em;
                    overflow: hidden;
                    display: block!important;
                    text-overflow: ellipsis;`
twitSumUrl.innerText = baseUrlecht






summContainer.appendChild(leftImage)
rightText.appendChild(twitSumTitle)
rightText.appendChild(twitSumDesc)
rightText.appendChild(twitSumUrl)

summContainer.appendChild(rightText)
twitterShow.append(summContainer)


