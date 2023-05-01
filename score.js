// const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/chennai-super-kings-vs-kolkata-knight-riders-1st-match-1304047/full-scorecard";

const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

function processEachMatchLinks(url){
    request(url , cb);
}


function cb(err,response, html){
    if(err){
        console.log(`ERROR`);
    }
    else{
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html)
{
    let $ = cheerio.load(html);

    let descEle = $(".ds-grow>.ds-text-tight-m.ds-font-regular.ds-text-typo-mid3");
    let resultEle = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo")

    let descArr = descEle.text().split(",");

    let venue = descArr[1].trim();
    let date = descArr[2].trim() + " " + descArr[3].trim();
    let result = resultEle.text();

    // console.log(venue);
    // console.log(date);
    // console.log(result);


    let innings = $(".ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line.ds-mb-4");  //1st and 2nd kaam ke hai, bas batting ki innings batayega for both teams

    //abhi hum ye dono innings ki html nikalege, takki acche se iiterate kar sake and data scrap kar sake

    let teamName;
    let oppTeamName;
    for(i = 0; i < 2; i++)
    {
        teamName = $(innings[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text(); 
        let oppIndex = i==0?1:0;
        oppTeamName = $(innings[oppIndex]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();

        console.log(`Match at ${venue} on ${date} and its ${teamName} vs ${oppTeamName} ${result}`);

        let currInnings = $(innings[i]);

        let allRows = currInnings.find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tbody tr"); //saare rows dega for both innings for batting waala part
        // console.log(allRows.length);

        for(j = 0; j < allRows.length; j++)
        {
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("ds-w-0");

            if(isWorthy == true)
            {
                // console.log($(allCols).text());

                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();

                console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);

                processPlayer(teamName , playerName, runs, balls, fours, sixes, sr, oppTeamName, venue, date, result);
                
            }
        }
    }

    console.log();

}


function processPlayer(teamName , playerName, runs, balls, fours, sixes, sr, oppTeamName, venue, date, result)
{
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreater(teamPath);

    let filePath = path.join(teamPath, playerName + ".xlsx");

    let content = excelReader(filePath, playerName);

    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        oppTeamName,
        venue,
        date,
        result
    }

    content.push(playerObj);

    excelWriter(filePath , content, playerName)

}

function dirCreater(filePath)
{

    if(fs.existsSync(filePath) == false)
    {
        fs.mkdirSync(filePath);
    }
}

function excelWriter(filePath , json, sheetName)
{
    let newWB = xlsx.utils.book_new();  //--> new worksheet create hoti hai hai
    let newWS = xlsx.utils.json_to_sheet(json);  //--> json data ko excel form me convert karta hai
    xlsx.utils.book_append_sheet(newWB , newWS, sheetName);
    xlsx.writeFile(newWB , filePath);
}

function excelReader(filePath, sheetName)
{
    
    if(fs.existsSync(filePath) == false)
    {
        return [];
    }

    let wb = xlsx.readFile(filePath);   //workbook get karne ke liye
    let excelData = wb.Sheets[sheetName];  //worksheet get karne ke liye
    let ans = xlsx.utils.sheet_to_json(excelData);  //sheet ke andr ka data get karne ke liye
    return ans;
}


module.exports = {
    processEachScorecard: processEachMatchLinks
}