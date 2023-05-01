const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./score");

function getAllMatchesLink(fullLink){
    request(fullLink, function (err , response , html){
        if(err){
            console.log(`Error`);
        }
        else{
            extractAllMatchLink(html);
        }
    })
}

function extractAllMatchLink(html){
    let $ = cheerio.load(html);
    let matchLinkElem = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent>a");
    // console.log(matchLinkElem.length);  -->total 74 matches so the length is 74

    for(i =0; i < matchLinkElem.length; i++){
        let scoreCardLink = $(matchLinkElem[i]).attr("href");
        // console.log(scoreCardLink);
        let fullScoreCardLink = "https://www.espncricinfo.com" + scoreCardLink;
        console.log(fullScoreCardLink);

        scoreCardObj.processEachScorecard(fullScoreCardLink);
    }
}

module.exports = {
    gAllMatchesL: getAllMatchesLink
}