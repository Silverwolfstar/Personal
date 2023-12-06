/**
 * Programmer: Jessie Kuo
 * Date: 12/3/23
 * Title: js file for TermProject.html
 */

//Game variables
var currColor = '', //current selected color
    prevGuesses = [], //array of previous guesses (string format)
    currColorImg = ""; //corresponding image for currColor
    possibleColors = ['Blue', 'White', 'Red', 'Purple', 'Green', 'Yellow'], //array of possible colors
    imageList = ["BlueRectangle.GIF", "WhiteRectangle.GIF", "RedRectangle.GIF", 
        "PurpleRectangle.GIF", "GreenRectangle.GIF", "YellowRectangle.GIF"], //array of images corresponding to each item in possibleColors
    ansColors = [], //to store the 4-color answer combo
    currGuess = ["", "", "", ""], //current guess
    currClue = "", //clue string
    numGuesses = 1, //total number of guesses this game
    gameOver = false; //bool

/**
 * Initializes new game: 
 * If there is game data to restore, then restore it.
 * Else, sets new colors for the answer and resets variables.
 */
function initialize(){
    if (restoreGame()){
        console.log(ansColors);
        return true;
    }
    //reset relevant variables
    currColor = '';
    prevGuesses = [];
    currColorImg = "";
    ansColors = [];
    currGuess = ["", "", "", ""];
    currClue = "";
    numGuesses = 1;
    gameOver = false;
    //sets 4 new colors for the answer
    for (var i = 0; i < 4; i++){
        ansColors.push(possibleColors[Math.floor(Math.random() * 6)].charAt(0)); //random integer 0-5, index of possibleColors
    }
    //clear Guesses/Clues table
    for (var i = 1; i < 11; i++){
        document.getElementsByName("Data" + i)[0].value = "?";
        document.getElementsByName("Clue" + i)[0].value = "?";
    }
    console.log(ansColors);
}

/**
 * Updates currColor variable and displays selected color in the info box
 * @param myColor - color to put into currColor
 */
function selectedColor(myColor){
    if (gameOver){
        return false; //disable if gameOver
    }
    currColor = myColor;
    //setting currColorImg
    for (var i = 0; i < 6; i++){
        if (currColor == possibleColors[i]){
            currColorImg = imageList[i];
        }
    }
    document.getElementsByName("sInfo")[0].value = "Selected: " + currColor;
    return true;
}

/**
 * Puts the correct color into the answer box and updates currGuess
 * If no selected color, do nothing
 * @param boxNum - an integer 1-4, corresponding to an answer box.
 */
function pasteColor(boxNum){
    if (gameOver){
        return false; //disable if gameOver
    }
    //currGuess contains the first letter of currColor
    if (currColor != ''){
        if (boxNum == '1'){
            document.getElementById("Ans1").src = currColorImg;
            currGuess[0] = currColor.charAt(0);
        }
        else if (boxNum == '2'){
            document.getElementById("Ans2").src = currColorImg;
            currGuess[1] = currColor.charAt(0);
        }
        else if (boxNum == '3'){
            document.getElementById("Ans3").src = currColorImg;
            currGuess[2] = currColor.charAt(0);
        }
        else{
            document.getElementById("Ans4").src = currColorImg;
            currGuess[3] = currColor.charAt(0);
        }
    }
}

/**
 * Calculates and displays Guesses and Clues, returns false if colors aren't filled out
 * If won, show win/turn message with correct answer
 * If numTries is 10, show loss message with correct answer
 */
function checkAnswer(){
    if (gameOver){
        //NOTE: I really prefer this as an alert instead of an info box text because I don't want to overwrite win/loss message.
        alert("Game Over. Must hit Restart to start a new game!");
        //document.getElementsByName("sInfo")[0].value = "Game Over. Must hit Restart to start a new game!";
        //^This is what it would be if it needed to be in the info box. Can be easily swapped out if necessary.
        return false;
    }
    //Alert if all 4 boxes aren't filled out, don't run
    if (currGuess[0] == "" || currGuess[1] == "" || currGuess[2] == "" || currGuess[3] == ""){
        alert("All Answer Boxes must be filled with a color prior to Check Answer");
        return false;
    }
    //calculate and display Guesses
    if (numGuesses < 11 && !gameOver){
        var guessString = "";
        var clueString = "";
        var ansColorsCopy = ansColors.slice();
        var currGuessCopy = currGuess.slice();
        //calculate guessString and all the X's in clueString (remove if found)
        for (i in currGuessCopy){
            guessString = guessString.concat(currGuess[i]);
            if (currGuessCopy[i] == ansColorsCopy[i]){
                clueString = clueString.concat("X");
                currGuessCopy[i] = ".";
                ansColorsCopy[i] = ".";
            }
        }
        //check if repeat guess
        if (prevGuesses.includes(guessString)){
            document.getElementsByName("sInfo")[0].value = "You have already made this guess. Please try again.";
            return false;
        }
        prevGuesses.push(guessString);
        //calculate all the O's in clueString (remove if found)
        for (i in currGuessCopy){
            if ((currGuessCopy[i] != ".") && (ansColorsCopy.includes(currGuessCopy[i]))){
                clueString = clueString.concat("O");
                ansColorsCopy[ansColorsCopy.indexOf(currGuessCopy[i])] = ".";
                currGuessCopy[i] = ".";
            }
        }
        document.getElementsByName("Data" + numGuesses)[0].value = guessString;
        document.getElementsByName("Clue" + numGuesses)[0].value = clueString;

        if (numGuesses == 10 && !gameOver){
            showLoss();
        }

        if (clueString == "XXXX"){
            //game won
            showWin();
        }

        //increment numGuesses after display
        numGuesses++;
    }
    return true;
}

/**
 * Displays win/turn message with correct answer
 */
function showWin(){
    switch (numGuesses){
        case 1:
            document.getElementsByName("sInfo")[0].value = 
                "You won: WOW! You are lucky. Take me to Las Vegas when you go. Answer was " + ansColors + ".";
            break;
        case 2:
            document.getElementsByName("sInfo")[0].value = 
                "You won: Excellent! You are extremely lucky. Answer was " + ansColors + ".";
            break;
        case 3:
            document.getElementsByName("sInfo")[0].value = 
                "You won: Superior! You are very lucky. Answer was " + ansColors + ".";
            break;
        case 4:
            document.getElementsByName("sInfo")[0].value = 
                "You won: Extremely Good! Your logic skills are great. Answer was " + ansColors + ".";
            break;
        case 5:
            document.getElementsByName("sInfo")[0].value = 
                "You won: Very Good! Your logic skills are very good. Answer was " + ansColors + ".";
            break;
        case 6:
            document.getElementsByName("sInfo")[0].value = 
                "You won: Good! Your logic skills are good. Answer was " + ansColors + ".";
            break;
        case 7:
            document.getElementsByName("sInfo")[0].value = 
                "You won: Nicely Done! Your logic skills are developing very well. Answer was " + ansColors + ".";
            break;
        case 8:
            document.getElementsByName("sInfo")[0].value = 
                "You won: :D! Your logic skills are doing well. Answer was " + ansColors + ".";
            break;
        case 9:
            document.getElementsByName("sInfo")[0].value = 
                "You won: Got it! Your logic skills are starting to show up. Answer was " + ansColors + ".";
            break;
        case 10:
            document.getElementsByName("sInfo")[0].value = 
                "You won: Right! Your logic skills are adequate. Answer was " + ansColors + ".";
            break;
        default:
            document.getElementsByName("sInfo")[0].value = 
                "[default switch in showWin] How did you get here? You're not supposed to be here.";
            break;
    }
    gameOver = true;
}

/**
 * Displays loss message with correct message
 */
function showLoss(){
    document.getElementsByName("sInfo")[0].value = 
        "You Lost. Your logic skills need practice. Keep playing the game. Answer was " + ansColors + ".";
    gameOver = true;
}

/**
 * Shows help menu in a new window 300x400
 */
function showHelp(){
    var filePath = 'UserHelp.htm'
    var newWindow = window.open(filePath, "_blank", 'width=300, height=400, scrollbars=yes');
}

/**
 * Calls initialize to reset variables and pick new answer colors
 * Also resets Answer Box colors, clears Guesses/Clues table, and clears info box.
 */
function newGame(){
    initialize(); //reset variables, pick new answer set
    //resets Answer Boxes
    document.getElementById("Ans1").src = "QuestionRectangle.GIF";
    document.getElementById("Ans2").src = "QuestionRectangle.GIF";
    document.getElementById("Ans3").src = "QuestionRectangle.GIF";
    document.getElementById("Ans4").src = "QuestionRectangle.GIF";
    //clear Guesses/Clues table
    for (var i = 1; i < 11; i++){
        document.getElementsByName("Data" + i)[0].value = "?";
        document.getElementsByName("Clue" + i)[0].value = "?";
    }
    //clear info box
    document.getElementsByName("sInfo")[0].value = "";
}

/**
 * Updates info box if images doesn't load
 * (Assumes that if the first image doesn't properly load, browser doesn't support images.)
 * (May not be fully accurate, but hopefully good enough for the purposes of this project.)
 */
function noImgSupp(){
    document.getElementsByName("sInfo")[0].value = "This browser doesn't support images. Page will not work properly. Upgrade your browser.";
}

/**
 * Saves game variables
 */
function saveGame(){
    //Make a guesses and clues array for easier storage.
    var guesses = [];
    var clues = [];
    for (var i = 1; i < 11; i++){
        guesses.push(document.getElementsByName("Data" + i)[0].value);
        clues.push(document.getElementsByName("Clue" + i)[0].value);
    }

    var gameData = {
        answer:ansColors, 
        colortopaste:currColor, 
        colortopasteImg:currColorImg,
        turnno:numGuesses,
        infoStr:document.getElementsByName("sInfo")[0].value,
        curcolor1:document.getElementById("Ans1").src, 
        curcolor2:document.getElementById("Ans2").src, 
        curcolor3:document.getElementById("Ans3").src, 
        curcolor4:document.getElementById("Ans4").src, 
        myGuess:currGuess,//["", "", "", ""]
        myPrevGuesses:prevGuesses, //[""]
        guesses:guesses,
        clues:clues,
        gover:gameOver
    };
    //Store saveGame
    localStorage.setItem("savedGameData", JSON.stringify(gameData));
}


/**
 * Restores game variables from json_data.js
 */
function restoreGame(){
    //get savedData from localStorage
    var savedData = localStorage.getItem("savedGameData");
    if (savedData){ //if exists
        var gameData = JSON.parse(savedData);
        //restore state
        ansColors = gameData.answer;
        currColor = gameData.colortopaste;
        currColorImg = gameData.colortopasteImg;
        numGuesses = gameData.turnno;
        currGuess = gameData.myGuess;
        prevGuesses = gameData.myPrevGuesses;
        document.getElementById("Ans1").src = gameData.curcolor1;
        document.getElementById("Ans2").src = gameData.curcolor2;
        document.getElementById("Ans3").src = gameData.curcolor3;
        document.getElementById("Ans4").src = gameData.curcolor4;
        document.getElementsByName("sInfo")[0].value = gameData.infoStr;
        gameOver = gameData.gover;

        //update guesses and clues table
        for (var i = 1; i < 11; i++){
            document.getElementsByName("Data" + i)[0].value = gameData.guesses[i-1];
            document.getElementsByName("Clue" + i)[0].value = gameData.clues[i-1];
        }
        //clear savedGameData item from localStorage
        localStorage.removeItem("savedGameData");
        return true;
    }
    return false;
}
//May or may not implement cookies.
// // --- Following modified from prjs13_2.js ---
// /**
//  * Helper function to make adding any future cookies easy
//  * Adds in new cookie, separated by "&".
//  * @param myCookie - old cookie string
//  * @param newCookie - new cookie to add to myCookie
//  * @returns (myCookies + "&" + newCookie)
//  */
// function addCookie(myCookie, newCookie){
//     return (myCookie + "&" + newCookie);
// }

// /**
//  * Set a cookie w/name and future expiration date.
//  */
// function setIt(){
//     var myName = "gameOver",
//         myVal = gameOver;
//     document.cookie = name;
//     expDate = "expires=Wed, 06 Nov 2024 05:08:00 UTC",
//     newText = addCookie(newText, encodeURIComponent(expDate));
//     document.cookie = newText;
// }

// /**
//  * Checks whether cookie exists.
//  * If so, read it and write the name on the page.
//  */
// function readIt(){
//     if (document.cookie){
//         var myCookie = document.cookie,
//             decodedCookie = decodeURIComponent(myCookie),
//             pairs = decodedCookie.split("&"),
//             myName = pairs[0],
//             expDate = pairs[1],
//             nameVal = myName.split("="), //[1] is value
//             expDateVal = expDate.split("="); //[1] is value
//         document.write("Welcome, " + nameVal[1] + "!");
//     }
// }

// if (document.cookie){
//     readIt();
// }
// else{
//     setIt();
//     readIt();
// }