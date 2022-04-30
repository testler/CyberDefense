class Towers{
    Constructor(){
        
    }

}
class Enemies{
    constructor(){

    }
}
class GameSesion{
    constructor(){
        this.username = "";
        this.levelWins = [false, false, false, false, false]; //each level is index +1  so level 1 is at index 0
        this.quadrantArray = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        //2D array 15x15
    }
    generateLevel(level){
        
        console.log("getting here");
    }
    gameStart(){
        let introText = "To be written text";
        let introBox = document.createElement("dialog");
        let nextButton = document.createElement("button");
        nextButton.id = "nextButton";
        introBox.appendChild(document.createTextNode(introText));
        nextButton.appendChild(document.createTextNode("NEXT >"));
        document.querySelector("#centeredDiv").appendChild(introBox);
        document.querySelector("#centeredDiv").appendChild(nextButton);
        introBox.open = true;
        // need to work on css for button location
        nextButton.addEventListener("click", (e) => this.mainGame());
        
    }
    LevelsStart(){
        if(document.querySelectorAll("#centeredDiv > *").length > 0){
            document.querySelectorAll("#centeredDiv > *").forEach(element => {
                element.remove();
            });
        }
        let gameBoard = document.createElement("table");
        gameBoard.id = "gameBoard";
        this.quadrantArray.forEach(firstDimensionItem => {
            firstDimensionItem[i].forEach(secondDimensionItem => {
                secondDimensionItem = i + (String.fromCharCode(a+97));
                document.querySelector("#gameBoard").appendChild(document.createElement("td").innerText = secondDimensionItem);
            },a);
        },i)

        document.querySelector("#centeredDiv").appendChild(gameBoard);
        this.generateLevel(1);
        // this.startLevel();
        // this.tutorial(); //hopefully will come back to this

        if(this.levelWins[0] === true){
            this.generateLevel(2);
        }else{
            
        }
    }
    winnerScreen(){
    }
    mainGame(){
    this.gameLevelsStart();
    }
}
let game1 = new GameSesion();
// game1.gameStart();
game1.LevelsStart();
console.log("script loaded");