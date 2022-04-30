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
        this.quadrantArray = [];
        this.gridSize = 10;
        }
    generateLevel(level){
        
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
        document.querySelector("#centeredDiv").appendChild(gameBoard);
        for (let firstDimensionIndex = 0; firstDimensionIndex < this.gridSize; firstDimensionIndex++) {
            this.quadrantArray.push([]);
            document.querySelector("#gameBoard").appendChild(document.createElement("tr"));
            for (let secondDimensionItem = 0; secondDimensionItem < this.gridSize; secondDimensionItem++) {
                this.quadrantArray[firstDimensionIndex][secondDimensionItem] = firstDimensionIndex+1 + (String.fromCharCode(secondDimensionItem+97));
                let element = document.createElement("td")
                element.id = (this.quadrantArray[firstDimensionIndex][secondDimensionItem]);
                element.textContent = (this.quadrantArray[firstDimensionIndex][secondDimensionItem]);
                document.querySelector("tr:last-child").appendChild(element);
            }
        }
        console.log(this.quadrantArray);

                this.generateLevel(1);
                // this.startLevel();
                // this.tutorial(); //hopefully will come back to this
                
                if(this.levelWins[0] === true){
                    this.generateLevel(2);
                }else{
                    
                }
                console.log("getting here");
            }
    winnerScreen(){
    }
    mainGame(){
    this.LevelsStart();
    }
}
let game1 = new GameSesion();
 game1.gameStart();
// game1.LevelsStart();
console.log("script loaded");