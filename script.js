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
    getAdjacentTile(tileIndex, direction){
        //return either the tile location if given both variables
        //or returns all directions of a tile if just given first variable, will include space you came from
        //
        let rowIndex = "";
        let columnIndex = "";
        try{
        if(tileIndex.length === 3){
        rowIndex = tileIndex.slice(0,2) -1;
        columnIndex = (tileIndex.charAt(3)).charCodeAt(0) - 97;
        }else{
        rowIndex = tileIndex.charAt(0) -1;
        columnIndex = (tileIndex.charAt(1)).charCodeAt(0) - 97;
        }
        switch (direction) {
            case "up":
                if(rowIndex == 0) throw "No tile there";
                return ((rowIndex) + tileIndex.charAt(1));
                break;
            case "down":
                if(rowIndex == this.quadrantArray.length-1) throw "No tile there";
                return ((rowIndex+2) + tileIndex.charAt(1));
                break;
            case "left":
                if(columnIndex == 0) throw "No tile there";
                return (tileIndex.charAt(0) + String.fromCharCode(columnIndex+96));
                break;
            case "right":
                if(columnIndex == this.quadrantArray[rowIndex].length-1) throw "No tile there";
                return (tileIndex.charAt(0) + String.fromCharCode(columnIndex+98));
                break;
            
            default:
            let arrOfPossibleTiles = [];
            if (rowIndex != 0) {//up
                arrOfPossibleTiles.push("up");
            }
            if (rowIndex != this.quadrantArray.length-1) {//down
                arrOfPossibleTiles.push("down");
            }
            if (columnIndex != 0) { //left
                arrOfPossibleTiles.push("left");
            }
            if (columnIndex != this.quadrantArray[rowIndex].length-1) {//right
                arrOfPossibleTiles.push("right");
            }
            return arrOfPossibleTiles;
            //code that excutes without variables
                break;
        }//code that excutes with variables
        }catch(err){
            console.log(err);
            
        }

    }
    generateLevel(level){
            //minium of 8x8 grid
        let startTile = "";
        let moves = [];
        let lastTile = "";
        let nextTile = ""
        switch (level) {
            case 1:
                startTile = "1d"
                moves = ["down", "down", "left", "left", "down", "down", "down", "down", "down"]
                
                break;
            case 2:
                startTile = "1a"
                moves = ["down", "right", "right", "right", "down", "right", "right", "down", "down"]
                
                break;
            
            case 3:
                startTile = "1c"
                moves = ["down", "down", "down", "left", "down", "down", "right", "right", "right", "down"]
                break;
            
            case 4:
                startTile = "1g"
                moves = ["down", "left", "left", "left", "down", "down", "right", "down", "down"]
                break;
        
            case 5:
                startTile = "1d"
                moves = ["down", "down", "left", "left", "down", "down", "right", "right", "right", "down"]
                break;

            default: throw "reached default switch case on generateLevel"
                break;
        }
        document.getElementById(startTile).classList.add("path");
        lastTile = startTile;
        moves.forEach(move => {
            nextTile = this.getAdjacentTile(lastTile, move);
            document.getElementById(nextTile).classList.add("path");
            lastTile = nextTile;
        })
        while(this.getAdjacentTile(lastTile).includes("down")) {
            console.log(this.getAdjacentTile(lastTile).includes("down"));
            nextTile = this.getAdjacentTile(lastTile, "down");
            console.log(nextTile);
            document.getElementById(nextTile).classList.add("path");
            lastTile = nextTile;
            
        }
    }
    clearGameBoard(){
        while(document.querySelector(".path") != undefined){
            document.querySelector(".path").classList.remove("path")
        }
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
        this.generateLevel(1);
        // this.startLevel();
        // this.tutorial(); //hopefully will come back to this
        
        // if(this.levelWins[0] === true){
        //     this.generateLevel(2);
        // }else{
            
        // }
            }
    winnerScreen(){
    }
    mainGame(){
    this.LevelsStart();
    }
}
let game1 = new GameSesion();
//  game1.gameStart();
game1.LevelsStart();
console.log("script loaded");