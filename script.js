class Tower{
    Constructor(){
        // name, range, levels can be used
        this.typeName;
        this.range;
        this.levels;
    }
    getAvailable(level){

    }

}
class Enemy{
    constructor(name){
        // name, speed, levels can appears
        this.nameArray = ["adware"]
        this.name = name;
        this.speed = this.getSpeed();
        this.hp = this.getHP;
        this.damage = getDamage();
        }
    getDamage(){
        switch (this.name) {
            case this.nameArray[1]:
                return 100;
                break;
            case this.nameArray[2]:
                return 
                break;        
            case this.nameArray[3]:
                return 
                break;
            case this.nameArray[4]:
                return 
                break;
            case this.nameArray[5]:
                return 
                break;
            case this.nameArray[6]:
                return 
                break;
            case this.nameArray[7]:
                return 
                break;
            case this.nameArray[8]:
                return 
                break;
            case this.nameArray[9]:
                return 
                break;
            case this.nameArray[10]:
                return 
                break;
            case this.nameArray[11]:
                return 
                break;
            case this.nameArray[12]:
                return 
                break;
            default: return "error";
                break;
        }
    }
    getSpeed(){
        switch (this.name) {
            case this.nameArray[1]:
                return 10;
                break;
            case this.nameArray[2]:
                return 
                break;        
            case this.nameArray[3]:
                return 
                break;
            case this.nameArray[4]:
                return 
                break;
            case this.nameArray[5]:
                return 
                break;
            case this.nameArray[6]:
                return 
                break;
            case this.nameArray[7]:
                return 
                break;
            case this.nameArray[8]:
                return 
                break;
            case this.nameArray[9]:
                return 
                break;
            case this.nameArray[10]:
                return 
                break;
            case this.nameArray[11]:
                return 
                break;
            case this.nameArray[12]:
                return 
                break;
            default: return "error";
                break;
        }
    }
    getHP(){
        switch (this.name) {
            case this.nameArray[1]:
                return 50;
                break;
            case this.nameArray[2]:
                return 
                break;        
            case this.nameArray[3]:
                return 
                break;
            case this.nameArray[4]:
                return 
                break;
            case this.nameArray[5]:
                return 
                break;
            case this.nameArray[6]:
                return 
                break;
            case this.nameArray[7]:
                return 
                break;
            case this.nameArray[8]:
                return 
                break;
            case this.nameArray[9]:
                return 
                break;
            case this.nameArray[10]:
                return 
                break;
            case this.nameArray[11]:
                return 
                break;
            case this.nameArray[12]:
                return 
                break;
            default: return "error";
                break;
        }
    }
    getEnemyNames(level){
        
        switch (level) {
            case 1:
                return this.nameArray[1];
                break;
            case 2:
                return this.nameArray[1]; //Math.floor(Math.random * 3)
                break;        
            case 3:
                return this.nameArray[1]; //Math.floor(Math.random * 6)
                break;
            case 4:
                return this.nameArray[1]; //Math.floor(Math.random * 8)
                break;
            case 5:
                return this.nameArray[1]; //Math.floor(Math.random * 10)
                break;

                
            default:
                break;
        }
    }
}
class GameSesion{
    constructor(){
        this.currentLevel = 1;
        this.tileArray = [];
        this.gridSize = 10;
        this.pathArray = [];
        this.enemiesArray = [];
        this.tick = 10000;
        this.baseHP = 100000;
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
        columnIndex = ((tileIndex.charAt(2)).charCodeAt(0) - 97);
        }else{
        rowIndex = tileIndex.charAt(0) -1;
        columnIndex = (tileIndex.charAt(1)).charCodeAt(0) - 97;
        }
        switch (direction) {
            case "up":
                if(rowIndex == 0) throw "No tile there";
                return ((rowIndex) + String.fromCharCode(columnIndex + 97));
                break;
            case "down":
                if(rowIndex == this.tileArray.length-1) throw "No tile there";
                return ((rowIndex+2) + String.fromCharCode(columnIndex + 97));
                break;
            case "left":
                if(columnIndex == 0) throw "No tile there";
                return (tileIndex.charAt(0) + String.fromCharCode(columnIndex+96));
                break;
            case "right":
                if(columnIndex == this.tileArray[rowIndex].length-1) throw "No tile there";
                return (tileIndex.charAt(0) + String.fromCharCode(columnIndex+98));
                break;
            
            default:
            let arrOfPossibleTiles = [];
            if (rowIndex != 0) {//up
                arrOfPossibleTiles.push("up");
            }
            if (rowIndex != this.tileArray.length-1) {//down
                arrOfPossibleTiles.push("down");
            }
            if (columnIndex != 0) { //left
                arrOfPossibleTiles.push("left");
            }
            if (columnIndex != this.tileArray[rowIndex].length-1) {//right
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
        //creating enemy path
        document.getElementById(startTile).classList.add("path");
        lastTile = startTile;
        this.pathArray.push(startTile);
        moves.forEach(move => {
            nextTile = this.getAdjacentTile(lastTile, move);
            document.getElementById(nextTile).classList.add("path");
            lastTile = nextTile;
            this.pathArray.push(nextTile);
        })
        while(this.getAdjacentTile(lastTile).includes("down")) {
            nextTile = this.getAdjacentTile(lastTile, "down");
            document.getElementById(nextTile).classList.add("path");
            lastTile = nextTile;
            this.pathArray.push(nextTile);
        }
        //generating the possible tower locations
        this.tileArray.forEach(arr => {
            arr.forEach(testTile => {
                if(document.getElementById(testTile).className.includes("path")){}
                else{
                document.getElementById(testTile).classList.add("possibleTowerSpot")
                }
            })
        })


    }
    clearGameBoard(){
        while(document.querySelector(".path") != undefined){
            document.querySelector(".path").classList.remove("path")
        }
        while(document.querySelector(".possibleTowerSpot") != undefined){
            document.querySelector(".possibleTowerSpot").classList.remove("possibleTowerSpot")
        }
        this.pathArray = [];
    }
    startLevel(){
        let startButton = document.createElement("button");
        startButton.id = "startButton";
        startButton.appendChild(document.createTextNode("Start"));
        document.querySelector("#centeredDiv").appendChild(startButton);
        // need to work on css for button location
        
        startButton.addEventListener("click", (e) => {
            let numberOfEnemies = 10;
            for (let index = 0; index < numberOfEnemies; index++) {
                let enemy = Enemy.prototype.getEnemyNames(this.currentLevel);
                let enemySprite = document.createElement("section");
                let enemyName = (enemy + index);
                this.enemiesArray.push(new Enemy(enemyName));
                console.log(this.enemiesArray);
                enemySprite.id = enemy + index;
                enemySprite.classList.add("enemy");
                document.querySelector("#centeredDiv").appendChild(enemySprite);
            }
            this.enemiesArray.forEach(enemy =>{
                setTimeout(tick/enemy.speed);
                let enemySprite = document.getElementById(enemy.name);
                this.pathArray.push("base");
                let currentTile = "";
                for (let i = 0; ((enemy.hp > 0) && (this.pathArray[i] != "base")); i++) {
                        document.getElementById(this.pathArray[i]).appendChild(enemySprite);
                        document.getElementById(this.pathArray[i-1]).remove(enemySprite);
                        currentTile = this.pathArray[i];
                }
                if(currentTile === "base"){
                    this.baseHP =- enemy.damage;
                    document.getElementById("base").remove(enemySprite);
                }
                if(enemy.hp <= 0){
                    document.getElementById(currentTile).remove(enemySprite);
                }
            })
            // moving enemies
        });
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
            this.tileArray.push([]);
            document.querySelector("#gameBoard").appendChild(document.createElement("tr"));
            for (let secondDimensionItem = 0; secondDimensionItem < this.gridSize; secondDimensionItem++) {
                this.tileArray[firstDimensionIndex][secondDimensionItem] = firstDimensionIndex+1 + (String.fromCharCode(secondDimensionItem+97));
                let element = document.createElement("td")
                element.id = (this.tileArray[firstDimensionIndex][secondDimensionItem]);
                element.textContent = (this.tileArray[firstDimensionIndex][secondDimensionItem]);
                document.querySelector("tr:last-child").appendChild(element);
            }
        }
        let base = document.createElement("div");
        base.id = "base";
        document.querySelector("#centeredDiv").appendChild(base);

        this.generateLevel(1);
        this.startLevel();
        // this.tutorial(); //hopefully will come back to this

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