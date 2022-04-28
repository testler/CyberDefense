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
        

        console.log("getting here");

    }
    gameLevelsStart(){

    }
    winnerScreen(){

    }
}
let game1 = new GameSesion();
game1.gameStart();
console.log("script loaded");