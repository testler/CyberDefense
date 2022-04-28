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
    }
    generateLevel(level){
        let gameBoard = document.createElement("table");
        let nextButton = document.createElement("button");
        nextButton.id = "nextButton";
        introBox.appendChild(document.createTextNode(introText));
        nextButton.appendChild(document.createTextNode("NEXT >"));
        document.querySelector("#centeredDiv").appendChild(introBox);
        document.querySelector("#centeredDiv").appendChild(nextButton);
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
    }
    gameLevelsStart(){
        if(document.querySelectorAll("#centeredDiv > *").length > 0){
            document.querySelectorAll("#centeredDiv > *").forEach(element => {
                element.remove();
            });
        }
        this.generateLevel(1);
        // this.playLevel();
        // this.tutorial(); //hopefully will come back to this

        if(this.levelWins[0] === true){
            this.generateLevel(2);
        }else{
            
        }
    }
    winnerScreen(){

    }
}
let game1 = new GameSesion();
game1.gameStart();
game1.gameLevelsStart();
console.log("script loaded");