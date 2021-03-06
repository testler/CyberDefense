class Tower{
    constructor(typeName, name){

        this.nameArray = this.getTowers("names");
        this.typeName = typeName;
        this.name = name;
        this.range = this.getRange();
        this.damage = this.getDamage();
        this.location;
        this.inRangePathTiles = [];
    }
    giveInRangePathTiles(tileArr){
        this.inRangePathTiles = tileArr;
    }
    getLocation(gridIndex){
        this.location = gridIndex;
    }
    getTowers(level){
        let nameArray = ["pawn"];
        switch (level) {
            case 1:
                return [nameArray[0]];
                break;
            case 2:
                return [nameArray[0]]; 
                break;        
            case 3:
                return [nameArray[0]] ;
                break;
            case 4:
                return [nameArray[0]] ;
                break;
            case 5:
                return [nameArray[0]] ; 
                break;
            case "names":
                return nameArray;
                break;                
            default:
                break;
        }
    }
    getRange(){
        switch (this.typeName) {
            case this.nameArray[0]:
                return 2;
                break;
            case this.nameArray[1]:
                return ; 
                break;        
            case this.nameArray[2]:
                return ; 
                break;
            case this.nameArray[3]:
                return ; 
                break;
            case this.nameArray[4]:
                return ;
                break;
                
            default:
                break;
        }
    }
    getDamage(){
        switch (this.typeName) {
            case this.nameArray[0]:
                return 25;
                break;
            case this.nameArray[1]:
                return ; 
                break;        
            case this.nameArray[2]:
                return ; 
                break;
            case this.nameArray[3]:
                return ; 
                break;
            case this.nameArray[4]:
                return ;
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
    constructor(name, type, index){
        // name, speed, levels can appears
        this.nameArray = this.getEnemyNames("names");
        this.type = type;
        this.name = name;
        this.speed = this.getSpeed();
        this.hp = this.getHP();
        this.damage = this.getDamage();
        this.location;
        this.index = index;
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
                return 1;
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
                return nameArray[1]; 
                break;        
            case 3:
                return nameArray[1]; 
                break;
            case 4:
                return nameArray[1]; 
                break;
            case 5:
                return nameArray[1]; 
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
        this.currentLevel = 0;
        this.tileArray = [];
        this.gridSize = 10;
        this.pathArray = [];
        this.enemiesArray = [];
        this.towerArray = [];
        this.tick = 1000;
        this.baseHP = 900;
        this.credits = 0;
        this.levelsEnd = true;// this is false when it should be true;
        this.levelStart == false;
        }
    getAdjacentTile(tileIndex, direction){
        //return either the tile location if given both variables
        //or returns all directions of a tile if just given first variable, will include space you came from
        //
        let rowIndex = "";
        let columnIndex = "";
        try{
        if(tileIndex.length === 3){
        rowIndex = ((tileIndex.slice(0,2)) -1);
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
        let rand = Math.floor(Math.random()*4)+1;
        console.log(rand);
        switch (rand) {
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
            let nextTile = this.getAdjacentTile(lastTile, move);
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
        let towerNameArr = Tower.prototype.getTowers(this.currentLevel);
        (document.querySelectorAll("td")).forEach(tile => {
            towerNameArr.forEach(towerName => {
                document.getElementById(tile.id).classList.remove(towerName);
            });
        });
    }
    levelStartButton(){
        let startButton = document.createElement("button");
        startButton.id = "startButton";
        startButton.appendChild(document.createTextNode("Start"));
        document.querySelector("#centeredDiv").appendChild(startButton);
        
        document.querySelector("#startButton").addEventListener("click", () => {this.startLevel()}, {once: true});
    }
    startLevel() {
        let numberOfEnemies = 10;
        for (let index = 0; index < numberOfEnemies; index++) {
            let enemy = Enemy.prototype.getEnemyNames(this.currentLevel);
            let enemySprite = document.createElement("section");
            let enemyName = (enemy + index);
            this.enemiesArray.push(new Enemy(enemyName, enemy, index));
            enemySprite.id = enemyName;
            enemySprite.classList.add("enemy");
            document.querySelector("#centeredDiv").appendChild(enemySprite);
        }
        this.getInRangePathTiles();
        this.pathArray.push("base");
        let index = 0;
        let count = this.enemiesArray.length;
        this.levelStart = true;
        let intervalSendOutEnemies = setInterval(() => {
            if (index >= count) {
                clearInterval(intervalSendOutEnemies);
            }
            let enemy = this.enemiesArray[index];
            this.moveEnemy(enemy);
            index++;
            this.levelStart == true;
        }, this.tick);
    }

    moveEnemy(enemy) {
    try {    
        let i = 0;
        let currentTile = "";
        let enemySprite = document.getElementById(enemy.name);
        let moveInterval = setInterval(() => {
            if(enemy == null || enemy == undefined){
                clearInterval(moveInterval);
            }
            if(this.enemiesArray.length <= 0){

                clearInterval(moveInterval);
            }
            if(enemy.location === "base"){
                this.baseHP = this.baseHP - enemy.damage;
                enemySprite.remove();
                this.removeObject(enemy,this.enemiesArray);
                clearInterval(moveInterval);
            }
            this.towerArray.forEach(towerObject => {
                if((towerObject.inRangePathTiles).includes(enemy.location)){
                    console.log(enemy.hp);
                    console.log(towerObject);
                    console.log(enemy);
                    enemy.hp = enemy.hp - towerObject.damage;
                    console.log("hit");
                    console.log(enemy.hp);
                }
            });
            if(enemy.hp <= 0){
                enemySprite.remove();
                console.log(this.enemiesArray);
                document.getElementById(currentTile).removeChild(enemySprite);
                this.removeObject(enemy,this.enemiesArray);
                console.log(this.enemiesArray);
                clearInterval(moveInterval);
            }
            document.getElementById(this.pathArray[i]).appendChild(enemySprite);
            currentTile = this.pathArray[i];
            enemy.location = currentTile;
            i++;
            // towerFire
        }, this.tick);//this needs to change
    }catch (error) {
        console.log(error);
    }
}
    removeObject(arrObject, arr){
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if(arr[index] === arrObject){
                arr.splice(index, 1);
            }
        }
    }

    buildTowers(){
        document.querySelectorAll(".possibleTowerSpot").forEach(tile => {
            tile.addEventListener("mouseover", event => {
                tile.addEventListener("mouseout", e => {
                    event.target.classList.remove("highlightCircle");
                });
                event.target.classList.add("highlightCircle");
                event.target.addEventListener("click", tileSection => {
                    let towerArr = Tower.prototype.getTowers(this.currentLevel);
                    let towerSeletionMenu = document.createElement("menu");
                    towerSeletionMenu.id = "towerSeletionMenu";
                    towerSeletionMenu.appendChild(document.createTextNode("Select your tower"));
                    towerArr.forEach(tower => {
                        let towerType = document.createElement("li");
                        towerType.textContent = tower + " " + Tower.prototype.getPrice(tower) + " credits";
                        towerSeletionMenu.appendChild(towerType);
                        towerType.addEventListener("click", purchaseClick => {
                            if ((this.credits - Tower.prototype.getPrice(tower)) >= 0) {
                                this.credits = this.credits - Tower.prototype.getPrice(tower);
                                let towerName = "tower" + (this.towerArray.length + 1);
                                this.towerArray.push((new Tower(tower, towerName))); //i thick something is wrong here
                                console.log(tower);
                                console.log(this.towerArray);
                                event.target.classList.add(tower);
                                this.towerArray[this.towerArray.length - 1].location = event.target.id;
                                towerSeletionMenu.removeChild(towerSeletionMenu.firstChild);
                                towerSeletionMenu.removeChild(towerType);
                                towerSeletionMenu.remove();
                                document.querySelectorAll("#towerSeletionMenu").forEach((menu) => menu.removeChild(menu.firstChild));
                                document.querySelectorAll("#towerSeletionMenu").forEach((menu) => menu.remove());
                            } else {
                                towerType.style.color = "red";
                            }
                        }, { once: true });
                    });
                        document.querySelector("#gameBoard").appendChild(towerSeletionMenu);
                }, { once: true });
            
            })
    })
    }
    getInRangePathTiles(){
        this.towerArray.forEach(tower =>{
            let location = document.getElementById(tower.location).id;
            let inRangeTiles = [];
            this.getAdjacentTile(location).forEach((direction) => {inRangeTiles.push(this.getAdjacentTile(location, direction))})
            for (let i = 0; i < tower.range - 1; i++) {
            inRangeTiles.forEach(tile => this.getAdjacentTile(tile).forEach(direction => inRangeTiles.push(this.getAdjacentTile(tile, direction))))
            }
            let inRangePathTiles = inRangeTiles.filter(tile => this.pathArray.includes(tile));
            tower.giveInRangePathTiles(inRangePathTiles);
        })
        

    }
    gameStart(){
        let introText = "Welcome.\n\nYou have been selected to be the new cyber defense program.\n\nUsing your intellect, you will design and build the best defense to protect your computer against threats that wish it harm.\n\nDo you accept?";
        let introBox = document.createElement("dialog");
        let nextButton = document.createElement("button");
        nextButton.id = "nextButton";
        introBox.innerText = introText;
        nextButton.appendChild(document.createTextNode("ACCEPT >"));
        document.querySelector("#centeredDiv").appendChild(introBox);
        document.querySelector("#centeredDiv").appendChild(nextButton);
        introBox.open = true;
        // need to work on css for button location
        nextButton.addEventListener("click", (e) => {this.mainGame()});
    }
    LevelsStart(){
        if(document.querySelectorAll("#centeredDiv > *").length > 0){
            document.querySelectorAll("#centeredDiv > *").forEach(element => {
                element.remove();
            });
        }
        let stats = document.createElement("div");
        stats.id = "stats";
        let health = document.createElement("a");
        let credits = document.createElement("a");
        health.id = "health";
        credits.id = "credits";
        health.textContent = "HP: " + this.baseHP;
        credits.textContent = "Credits: " + this.credits;
        stats.appendChild(health);
        stats.appendChild(credits);
        document.querySelector("#centeredDiv").appendChild(stats);
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
                document.querySelector("tr:last-child").appendChild(element);
            }
        }
        let base = document.createElement("div");
        base.id = "base";
        base.textContent = "COMPUTER";
        document.querySelector("#centeredDiv").appendChild(base);
            }
    winnerScreen(){
        alert("YOU WIN!");

    }
    loserScreen(){
        alert("You lost");

    }
    mainGame(){
        this.LevelsStart();
        this.levelStartButton();
        this.levelComplete();
        this.buildTowers();
        this.tickEvents();
        
    }
    tickEvents() {
        let tickInterval = setInterval(() => {
            if(this.currentLevel >= 2){
                this.winnerScreen();
                clearInterval(tickInterval);
            }
            if(this.baseHP <= 0){
                this.loserScreen();
                clearInterval(tickInterval);
            }
            document.getElementById("health").textContent = "HP: " + this.baseHP;
            document.getElementById("credits").textContent = "Credits: " + this.credits;
            //level complete
            if((this.enemiesArray.length <= 0) && (this.levelStart == true)){
                this.levelComplete();
                this.buildTowers();
            }
            if(this.enemiesArray.every(ele => ele.hp <= 0)){
                this.enemiesArray.length = 0;
            }
        }, this.tick);
    }

    levelComplete() {
        this.currentLevel++;
        this.clearGameBoard(); // needs work
        this.generateLevel();
        this.baseHP = 900;
        this.credits = +(this.currentLevel * 100);
        this.levelsEnd = false;
        this.levelStart = false;
        console.log("new level");
    }
}
let game1 = new GameSesion();
game1.gameStart();
console.log("script loaded");