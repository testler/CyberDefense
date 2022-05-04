class Tower{
    Constructor(){
        // name, range, levels can be used
        this.typeName;
        this.range = this.getRange();
        this.damage = this.getDamage();
        this.nameArray = this.getTowers("names");
        this.location;
        this.inRangePathTiles = [];
    }
    getInRangePathTiles(tileArr){
        this.getInRangePathTiles = tileArr;
    }
    getLocation(gridIndex){
        this.location = gridIndex;
    }
    getTowers(level){
        let nameArray = ["pawn"]
        switch (level) {
            case 1:
                console.log(nameArray[0]);
                return [nameArray[0]];
                break;
            case 2:
                return [this.nameArray[0], this.nameArray[1]]; //Math.floor(Math.random * 3)
                break;        
            case 3:
                return [this.nameArray[0], this.nameArray[1],this.nameArray[2]] ; //Math.floor(Math.random * 6)
                break;
            case 4:
                return [this.nameArray[0], this.nameArray[1],this.nameArray[2],this.nameArray[3]] ; //Math.floor(Math.random * 8)
                break;
            case 5:
                return [this.nameArray[0], this.nameArray[1],this.nameArray[2],this.nameArray[3],this.nameArray[4]] ; //Math.floor(Math.random * 10)
                break;
            case "names":
                return nameArray; //Math.floor(Math.random * 10)
                break;                
            default:
                break;
        }
    }
    getRange(){
        switch (this.towerType) {
            case this.nameArray[0]:
                return 5;
                break;
            case this.nameArray[1]:
                return ; //Math.floor(Math.random * 3)
                break;        
            case this.nameArray[2]:
                return ; //Math.floor(Math.random * 6)
                break;
            case this.nameArray[3]:
                return ; //Math.floor(Math.random * 8)
                break;
            case this.nameArray[4]:
                return ;//Math.floor(Math.random * 10)
                break;
                
            default:
                break;
        }
    }
    getDamage(){
        switch (this.towerType) {
            case this.nameArray[0]:
                return 50;
                break;
            case this.nameArray[1]:
                return ; //Math.floor(Math.random * 3)
                break;        
            case this.nameArray[2]:
                return ; //Math.floor(Math.random * 6)
                break;
            case this.nameArray[3]:
                return ; //Math.floor(Math.random * 8)
                break;
            case this.nameArray[4]:
                return ;//Math.floor(Math.random * 10)
                break;
                
            default:
                break;
        }
    }
    getPrice(tower){
        switch (tower) {
            case "pawn":
                return 50;
                break;
        
            default:
                break;
        }
    }



}
class Enemy{
    constructor(name, type){
        // name, speed, levels can appears
        this.nameArray = this.getEnemyNames("names");
        this.type = type;
        this.name = name;
        this.speed = this.getSpeed();
        this.hp = this.getHP();
        this.damage = this.getDamage();
        this.location;
        }
    getLocation(location){
        this.location = location;
    }
    getDamage(){
        switch (this.type) {
            case this.nameArray[0]:
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
        switch (this.type) {
            case this.nameArray[0]:
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
        switch (this.type) {
            case this.nameArray[0]:
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
        let nameArray = ["adware"];
        switch (level) {
            case 1:
                return nameArray[0];
                break;
            case 2:
                return nameArray[1]; //Math.floor(Math.random * 3)
                break;        
            case 3:
                return nameArray[1]; //Math.floor(Math.random * 6)
                break;
            case 4:
                return nameArray[1]; //Math.floor(Math.random * 8)
                break;
            case 5:
                return nameArray[1]; //Math.floor(Math.random * 10)
                break;
            case "names":
                return nameArray;
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
        this.towerArray = [];
        this.tick = 10000;
        this.baseHP = 100000;
        this.credits = 100;
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
    //getAdjencent(turrent location).forEach(direction => PossibleInRangeSpots.push(getAdjecent(turentlocation, direction)))
    generateLevel(){
            //minium of 8x8 grid
        let startTile = "";
        let moves = [];
        let lastTile = "";
        let nextTile = ""
        switch (this.currentLevel) {
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
    levelStartButton(){
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
                this.enemiesArray.push(new Enemy(enemyName, enemy));
                console.log(this.enemiesArray);
                enemySprite.id = enemy + index;
                enemySprite.classList.add("enemy");
                document.querySelector("#centeredDiv").appendChild(enemySprite);
            }
            this.pathArray.push("base");
            let index = 0;
            setInterval(() => {
                let enemy = this.enemiesArray[index];
                this.moveEnemy(enemy)
                index++;
                if(index < this.enemiesArray.length){
                    clearInterval();
                }
                
            }, this.tick);
            
            // moving enemies
            // towerFire
            setInterval(() => {
                enemyLocations = this.enemiesArray.map(enemy => enemy.location);
                this.towerArray.forEach((tower =>{
                    enemyLocations.forEach((enemyloaction, index) => {
                        if(tower.inRangePathTiles.includes(enemyloaction)){
                            this.enemiesArray[index].hp =- tower.damage;
                        }
                    })
                }))
            }, this.tick)

        }, {once: true});
    }
    moveEnemy(enemy) {
        let i = 0;
        let currentTile = "";
        setInterval(() => {
            console.log(enemy.name);
            let enemySprite = document.getElementById(enemy.name);
            document.getElementById(this.pathArray[i]).appendChild(enemySprite);
            // document.getElementById(this.pathArray[i-1]).remove(enemySprite);
            currentTile = this.pathArray[i];
            enemy.location = currentTile;
            i++;
            if ((currentTile !== "base") && (enemy.hp > 0) && (this.baseHP > 0)) {
                clearInterval();
            }
            if (currentTile === "base") {
                this.baseHP = -enemy.damage;
                enemySprite.remove();
                this.enemiesArray.splice(this.enemiesArray.indexOf(enemy.name));
            }
            if (enemy.hp <= 0) {
                enemySprite.remove();
                this.enemiesArray.splice(this.enemiesArray.indexOf(enemy));
            }
            if (this.baseHP <= 0) {
                alert("You lose");
            }
        }, this.tick/enemy.speed);
    }

    buildTowers(){
        document.querySelectorAll(".possibleTowerSpot").forEach(tile => {
        tile.addEventListener("mouseover", event => {
        tile.addEventListener("mouseout", e => {
            event.target.classList.remove("highlightCircle");
        })
            event.target.classList.add("highlightCircle");
            event.target.addEventListener("click", clickEvent =>{
                let towerArr = Tower.prototype.getTowers(this.currentLevel);
                console.log(towerArr);
                let towerSeletionMenu = document.createElement("menu");
                towerSeletionMenu.id = "towerSeletionMenu";
                towerSeletionMenu.appendChild(document.createTextNode("Select your tower"));
                towerArr.forEach(tower => {
                    let towerType = document.createElement("li");
                    towerType.textContent = tower + " " + Tower.prototype.getPrice(tower) + " credits";
                    towerSeletionMenu.appendChild(towerType);
                    towerType.addEventListener("click", towerTypeClick => {
                        if((this.credits-Tower.prototype.getPrice(tower)) > 0) {
                            let towerName = "tower" + (this.towerArray.length + 1);
                            this.towerArray.push(new Tower(tower));
                            event.target.classList.add(tower);
                            this.towerArray[this.towerArray.length-1].location = event.target.id;
                        }else{
                            towerType.style.color = "red";
                        }
                    })
                })
                document.querySelector("#gameBoard").appendChild(towerSeletionMenu);
            });

        })
    })
    }
    getInRangePathTiles(){
        this.towerArray.forEach(tower =>{
            let location = document.getElementById(tower.location);
            let inRangeTiles = [];
            this.getAdjacentTile(location).forEach(direction => inRangeTiles.push(this.getAdjacentTile(location, direction)))
            for (let i = 0; i < tower.range - 1; i++) {
            inRangeTiles.forEach(tile => this.getAdjacentTile(tile).forEach(direction => inRangeTiles.push(this.getAdjacentTile(tile, direction))))
            }
            let inRangePathTiles = inRangeTiles.filter(tile => this.pathArray.includes(tile));
            tower.getInRangePathTiles(inRangePathTiles);
        })
        

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

        this.generateLevel();
        this.buildTowers();
        this.getInRangePathTiles();
        this.levelStartButton();
        


        // this.tutorial(); //hopefully will come back to this

            }
    winnerScreen(){
    }
    mainGame(){
    this.LevelsStart();
    }
}
let game1 = new GameSesion();
 game1.gameStart();
console.log("script loaded");