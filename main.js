const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";
const fs = require("fs");
const path = require("path");

const iplPath = path.join(__dirname , "ipl");
dirCreater(iplPath);

//venue date opponent result runs balls fours six SR

const request = require("request");
const cheerio = require("cheerio");

const gAllMatchLObj = require("./allMatches");

//for home page
request(url , cb);
function cb(err,response, html){
    if(err){
        console.log(`ERROR`);
    }
    else{
        extractLink(html);
    }
}

//for extracting the complete fixtures link
function extractLink(html){
    let $ = cheerio.load(html);
    let anchorEle = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2>a");
    let link = anchorEle.attr("href");
    // console.log(link);
    let fullLink = "https://www.espncricinfo.com/" + link;
    // console.log(fullLink);

    gAllMatchLObj.gAllMatchesL(fullLink);
}

function dirCreater(filePath){

    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}























// function getAllMatchesLink(fullLink){
//     request(fullLink, function (err , response , html){
//         if(err){
//             console.log(`Error`);
//         }
//         else{
//             extractAllMatchLink(html);
//         }
//     })
// }

// function extractAllMatchLink(html){
//     let $ = cheerio.load(html);
//     let matchLinkElem = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent>a");
//     // console.log(matchLinkElem.length);  -->total 74 matches so the length is 74

//     for(i =0; i < matchLinkElem.length; i++){
//         let scoreCardLink = $(matchLinkElem[i]).attr("href");
//         // console.log(scoreCardLink);
//         let fullScoreCardLink = "https://www.espncricinfo.com" + scoreCardLink;
//         console.log(fullScoreCardLink);
//     }
// }