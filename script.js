// --- THREE.JS SETUP ---
let scene, camera, renderer;
let gridTiles = [];
const GRID_SIZE = 10;
const TILE_SIZE = 1.2; // Spacing between tiles
let pathTiles = [];
let hoveredTile = null;
let hoveredTileOriginalColor = null;

function initThree() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // Camera (top-down, slightly tilted)
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(GRID_SIZE / 2, GRID_SIZE * 1.5, GRID_SIZE * 1.5);
    camera.lookAt(GRID_SIZE / 2, 0, GRID_SIZE / 2);

    // Renderer
    const canvas = document.getElementById('gameCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Create 3D grid
    create3DGrid();

    // Simplified animation loop (no hover-specific animation)
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Mouse interactivity
    canvas.addEventListener('mousemove', onMouseMove, true);
    canvas.addEventListener('click', onMouseClick, true);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    console.log("onMouseMove triggered"); // 1. Is the event firing?

    const rect = renderer.domElement.getBoundingClientRect();
    const rawMouseX = event.clientX - rect.left;
    const rawMouseY = event.clientY - rect.top;
    // console.log("Raw mouse (in canvas):", rawMouseX, rawMouseY); // 2. Raw mouse coords

    mouse.x = (rawMouseX / rect.width) * 2 - 1;
    mouse.y = -(rawMouseY / rect.height) * 2 + 1;
    // console.log("Normalized mouse:", mouse.x, mouse.y); // 3. Normalized coords

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(gridTiles.flat());
    // console.log("Raycaster intersections:", intersects.length); // 4. Intersections found

    // Reset previous hovered tile
    if (hoveredTile) {
        if (hoveredTileOriginalColor !== null) {
             hoveredTile.material.color.setHex(hoveredTileOriginalColor);
        }
    }
    
    hoveredTile = null;
    hoveredTileOriginalColor = null;

    if (intersects.length > 0) {
        const tile = intersects[0].object;
        // console.log("Intersected tile object:", tile); // 5. First intersected object
        // console.log("Intersected tile userData:", tile.userData); // 6. Its userData

        const { gridX, gridZ } = tile.userData;
        
        const isPathTile = pathTiles.some(pt => pt.x === gridX && pt.z === gridZ);
        const isTowerTile = towers.some(t => t.x === gridX && t.z === gridZ);
        // console.log("Is path?", isPathTile, "Is tower?", isTowerTile); // 7. Tile status

        if (!isPathTile && !isTowerTile) {
            // console.log("Valid hover target - setting red"); // 8. Valid target found
            hoveredTile = tile;
            hoveredTileOriginalColor = tile.material.color.getHex();
            tile.material.color.set(0xff0000); // Set to RED for testing
        } else {
            // console.log("Invalid hover target (path or tower tile)");
        }
    } else {
        // console.log("No intersections with grid tiles.");
    }
}

function placeTower(x, z) {
    // Prevent placing on path or on a tile that already has a tower
    if (pathTiles.some(pt => pt.x === x && pt.z === z)) return;
    if (towers.some(t => t.x === x && t.z === z)) return;

    // Create a tower (cylinder)
    const geometry = new THREE.CylinderGeometry(0.35, 0.35, 1, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green
    const tower = new THREE.Mesh(geometry, material);
    tower.position.set(x * TILE_SIZE, 0.55, z * TILE_SIZE); // Slightly above the tile
    scene.add(tower);
    towers.push({ x, z, mesh: tower });
}

function onMouseClick(event) {
    if (hoveredTile) {
        const { gridX, gridZ } = hoveredTile.userData;
        placeTower(gridX, gridZ);
    }
}

function createSimplePath() {
    // Simple zig-zag path from (0,0) to (9,9)
    pathTiles = [];
    let x = 0, z = 0;
    let direction = 1; // 1 for right, -1 for left
    while (z < GRID_SIZE) {
        pathTiles.push({ x, z });
        if ((direction === 1 && x === GRID_SIZE - 1) || (direction === -1 && x === 0)) {
            z++;
            if (z < GRID_SIZE) pathTiles.push({ x, z });
            direction *= -1;
        } else {
            x += direction;
        }
    }
}

function highlightPathTiles() {
    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 }); // gold
    pathTiles.forEach(({ x, z }) => {
        if (gridTiles[x] && gridTiles[x][z]) {
            gridTiles[x][z].material = pathMaterial;
        }
    });
}

function create3DGrid() {
    // Remove old tiles if any
    gridTiles.forEach(row => row.forEach(tile => scene.remove(tile)));
    gridTiles = [];
    const tileGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    const tileMaterial = new THREE.MeshStandardMaterial({ color: 0x444488 });
    for (let x = 0; x < GRID_SIZE; x++) {
        let row = [];
        for (let z = 0; z < GRID_SIZE; z++) {
            const tile = new THREE.Mesh(tileGeometry, tileMaterial.clone());
            tile.position.set(x * TILE_SIZE, 0, z * TILE_SIZE);
            tile.userData = { gridX: x, gridZ: z };
            scene.add(tile);
            row.push(tile);
        }
        gridTiles.push(row);
    }
    createSimplePath();
    highlightPathTiles();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize Three.js scene
initThree();

// --- EXISTING GAME LOGIC (WRAPPED) ---
function initOldGameLogic() {
    // ... existing code ...
    // --- CYBERSECURITY CONFIGS ---
    const CYBER_TOWERS = [
        // ... existing code ...
    ];

    // ... existing code ...
}

// Call the old game logic (for now)
// initOldGameLogic(); // We'll call this later or integrate parts of it

// Make sure to comment out or adapt parts of initOldGameLogic that try to manipulate the DOM directly
// until they are properly integrated with the 3D scene or a separate HTML UI overlay.

// --- CYBERSECURITY CONFIGS ---
const CYBER_TOWERS = [
  {
    key: 'firewall',
    name: 'Firewall',
    range: 2,
    damage: 25,
    price: 50,
    description: 'Blocks basic malware and unauthorized access.'
  },
  {
    key: 'antivirus',
    name: 'Antivirus',
    range: 2,
    damage: 35,
    price: 75,
    description: 'Detects and removes viruses and trojans.'
  },
  {
    key: 'ids',
    name: 'IDS',
    range: 3,
    damage: 15,
    price: 60,
    description: 'Intrusion Detection System. Alerts and slows threats.'
  },
  {
    key: 'encryption',
    name: 'Encryption',
    range: 1,
    damage: 10,
    price: 90,
    description: 'Encrypts data, reducing damage from ransomware.'
  },
  {
    key: 'honeypot',
    name: 'Honeypot',
    range: 1,
    damage: 0,
    price: 40,
    description: 'Distracts threats, slowing them down.'
  }
];

const CYBER_THREATS = [
  {
    key: 'virus',
    name: 'Virus',
    speed: 1,
    hp: 50,
    damage: 100,
    description: 'A basic self-replicating malware.'
  },
  {
    key: 'worm',
    name: 'Worm',
    speed: 2,
    hp: 40,
    damage: 80,
    description: 'Spreads quickly through the network.'
  },
  {
    key: 'trojan',
    name: 'Trojan',
    speed: 1,
    hp: 60,
    damage: 120,
    description: 'Disguised as legitimate software.'
  },
  {
    key: 'ransomware',
    name: 'Ransomware',
    speed: 1,
    hp: 80,
    damage: 200,
    description: 'Encrypts files and demands ransom.'
  },
  {
    key: 'phishing',
    name: 'Phishing',
    speed: 2,
    hp: 30,
    damage: 60,
    description: 'Tricks users into giving up credentials.'
  },
  {
    key: 'ddos',
    name: 'DDoS',
    speed: 3,
    hp: 100,
    damage: 150,
    description: 'Overwhelms the server with traffic.'
  },
  {
    key: 'rootkit',
    name: 'Rootkit',
    speed: 1,
    hp: 120,
    damage: 180,
    description: 'Hides deep in the system.'
  },
  {
    key: 'spyware',
    name: 'Spyware',
    speed: 2,
    hp: 35,
    damage: 70,
    description: 'Steals sensitive information.'
  },
  {
    key: 'zero_day',
    name: 'Zero-Day',
    speed: 2,
    hp: 150,
    damage: 250,
    description: 'Unknown, unpatched vulnerability.'
  }
];

// --- TOWER CLASS ---
class Tower {
  constructor(typeKey, name) {
    const towerConfig = CYBER_TOWERS.find(t => t.key === typeKey);
    this.key = towerConfig.key;
    this.name = name || towerConfig.name;
    this.range = towerConfig.range;
    this.damage = towerConfig.damage;
    this.price = towerConfig.price;
    this.description = towerConfig.description;
    this.location = null;
        this.inRangePathTiles = [];
    }
  giveInRangePathTiles(tileArr) {
        this.inRangePathTiles = tileArr;
    }
  getLocation(gridIndex) {
        this.location = gridIndex;
  }
}

// --- ENEMY CLASS ---
class Enemy {
  constructor(typeKey, index) {
    const threatConfig = CYBER_THREATS.find(e => e.key === typeKey);
    this.key = threatConfig.key;
    this.name = `${threatConfig.name} #${index+1}`;
    this.domId = this.name.replace(/\s|#/g, '_'); // Consistent DOM id
    this.speed = threatConfig.speed;
    this.hp = threatConfig.hp;
    this.damage = threatConfig.damage;
    this.description = threatConfig.description;
    this.location = null;
        this.index = index;
        }
  getLocation(location) {
        this.location = location;
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
        this.credits = 200;
        this.levelsEnd = true;
        this.levelStart = false;
        this.lastKillerEnemy = null; // Track the last enemy to hit the server
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
        // Remove path and possibleTowerSpot classes
        while(document.querySelector(".path") != undefined){
            let el = document.querySelector(".path");
            if (!el) break;
            el.classList.remove("path");
        }
        while(document.querySelector(".possibleTowerSpot") != undefined){
            let el = document.querySelector(".possibleTowerSpot");
            if (!el) break;
            el.classList.remove("possibleTowerSpot");
        }
        // Remove all tower and threat classes from tiles
        (document.querySelectorAll("td")).forEach(tile => {
            CYBER_TOWERS.forEach(tower => {
                tile.classList.remove(tower.key);
            });
            CYBER_THREATS.forEach(threat => {
                tile.classList.remove(threat.key);
            });
        });
        this.pathArray = [];
    }
    levelStartButton(){
        let startButton = document.createElement("button");
        startButton.id = "startButton";
        startButton.appendChild(document.createTextNode("Start Attack Wave"));
        document.querySelector("#centeredDiv").appendChild(startButton);
        document.querySelector("#startButton").addEventListener("click", () => {this.startLevel()}, {once: true});
    }
    startLevel() {
        this.removeAllEnemiesFromDOM();
        let numberOfEnemies = 10 + this.currentLevel * 2;
        this.lastWaveEnemyCount = numberOfEnemies;
        this.lastWaveBandwidth = 0;
        this.defeatedEnemies = 0;
        this.enemiesArray = [];
        
        // Create all enemies at the start
        const allEnemies = [];
        for (let index = 0; index < numberOfEnemies; index++) {
            let threatType = CYBER_THREATS[index % CYBER_THREATS.length].key;
            let enemyObj = new Enemy(threatType, index);
            this.enemiesArray.push(enemyObj);
            allEnemies.push(enemyObj); // Copy to our spawning queue
            const threatConfig = CYBER_THREATS.find(t => t.key === threatType);
            this.lastWaveBandwidth += threatConfig && threatConfig.reward ? threatConfig.reward : 10;
        }
        
        this.getInRangePathTiles();
        this.pathArray.push("base");
        this.levelStart = true;
        this.updateEnemiesLeftUI();
        
        // Use a queue-based approach for spawning
        const spawnNextEnemy = () => {
            if (allEnemies.length > 0) {
                const enemy = allEnemies.shift();
                if (enemy && this.enemiesArray.includes(enemy)) {
                    this.moveEnemy(enemy);
                }
                setTimeout(spawnNextEnemy, this.tick);
            } else {
                console.log("All enemies spawned");
            }
        };
        
        // Start spawning
        spawnNextEnemy();
    }

    moveEnemy(enemy) {
    try {    
        // Safety check - don't process undefined or deleted enemies
        if (!enemy || !this.enemiesArray.includes(enemy)) {
            console.log("Attempted to move non-existent enemy");
            return;
        }
        
        let i = 0;
        let currentTile = "";
        let moveInterval = setInterval(() => {
            // More robust checks
            if (!enemy || !this.enemiesArray.includes(enemy) || this.enemiesArray.length <= 0) {
                clearInterval(moveInterval);
                return;
            }

            const nextTileId = this.pathArray[i];
            if (!nextTileId) {
                clearInterval(moveInterval);
                return;
            }
            // If the next tile is 'base', do NOT render the enemy there. Instead, trigger damage and remove enemy.
            if (nextTileId === "base") {
                // Remove from previous cell
                if (currentTile && document.getElementById(currentTile)) {
                  const prevTd = document.getElementById(currentTile);
                  if (prevTd && prevTd.querySelector(`#${enemy.domId}`)) {
                    prevTd.removeChild(prevTd.querySelector(`#${enemy.domId}`));
                  }
                }
                document.querySelectorAll(`#${enemy.domId}`).forEach(el => el.remove());
                // Apply damage effect to server icon
                const serverIcon = document.querySelector('.server-end-of-path');
                if (serverIcon) {
                    serverIcon.classList.add('server-damaged');
                    setTimeout(() => {
                        serverIcon.classList.remove('server-damaged');
                    }, 600);
                }
                this.baseHP = this.baseHP - enemy.damage;
                this.lastKillerEnemy = enemy; // Track the last enemy to hit the server
                this.removeObject(enemy,this.enemiesArray);
                clearInterval(moveInterval);
                this.defeatedEnemies = (this.defeatedEnemies || 0) + 1;
                this.updateEnemiesLeftUI();
                this.checkWaveEnd();
                return;
            }
            this.towerArray.forEach(towerObject => {
                if((towerObject.inRangePathTiles).includes(enemy.location)){
                    enemy.hp = enemy.hp - towerObject.damage;
                }
            });
            if(enemy.hp <= 0){
                const prevTd = document.getElementById(currentTile);
                if (prevTd && prevTd.querySelector(`#${enemy.domId}`)) {
                  prevTd.removeChild(prevTd.querySelector(`#${enemy.domId}`));
                }
                document.querySelectorAll(`#${enemy.domId}`).forEach(el => el.remove());
                // Bandwidth reward for defeating enemy
                const threatConfig = CYBER_THREATS.find(t => t.key === enemy.key);
                this.credits += threatConfig && threatConfig.reward ? threatConfig.reward : 10;
                document.getElementById("credits").textContent = "Bandwidth: " + this.credits;
                this.removeObject(enemy,this.enemiesArray);
                clearInterval(moveInterval);
                this.defeatedEnemies = (this.defeatedEnemies || 0) + 1;
                this.updateEnemiesLeftUI();
                this.checkWaveEnd();
                return;
            }
            // Remove from previous cell
            if (currentTile && document.getElementById(currentTile)) {
              const prevTd = document.getElementById(currentTile);
              if (prevTd && prevTd.querySelector(`#${enemy.domId}`)) {
                prevTd.removeChild(prevTd.querySelector(`#${enemy.domId}`));
              }
            }
            // Add to new cell
            const td = document.getElementById(nextTileId);
            if (td) {
              let enemyDiv = document.createElement('div');
              enemyDiv.className = 'enemy';
              enemyDiv.id = enemy.domId;
              enemyDiv.innerHTML = getImageFor(enemy.key, true);
              td.appendChild(enemyDiv);
            }
            currentTile = nextTileId;
            enemy.location = currentTile;
            i++;
        }, this.tick);
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
        // Remove previous listeners by cloning nodes
        document.querySelectorAll(".possibleTowerSpot").forEach(tile => {
            let newTile = tile.cloneNode(true);
            tile.parentNode.replaceChild(newTile, tile);
        });
        document.querySelectorAll(".possibleTowerSpot").forEach(tile => {
            tile.addEventListener("mouseover", event => {
                tile.addEventListener("mouseout", e => {
                    event.target.classList.remove("highlightCircle");
                });
                event.target.classList.add("highlightCircle");
                event.target.addEventListener("click", tileSection => {
                    // Remove any existing menu first
                    document.querySelectorAll("#towerSeletionMenu, #towerSellMenu").forEach(menu => menu.remove());
                    // Check if a tower is already built here
                    const existingTower = this.towerArray.find(t => t.location === event.target.id);
                    if (existingTower) {
                        // Show custom sell menu
                        const towerConfig = CYBER_TOWERS.find(t => t.key === existingTower.key);
                        const sellValue = Math.floor(towerConfig.price / 2);
                        let sellMenu = document.createElement("menu");
                        sellMenu.id = "towerSellMenu";
                        sellMenu.innerHTML = `<button class='close-btn' title='Close'>&#10006;</button>`;
                        let info = document.createElement("div");
                        info.style.margin = '8px 0';
                        info.innerHTML = `${getImageFor(towerConfig.key, false)} <b>${towerConfig.name}</b><br>Range: ${towerConfig.range} | Damage: ${towerConfig.damage}<br><span style='color:#00fff7'>Sell for ${sellValue} Bandwidth?</span>`;
                        sellMenu.appendChild(info);
                        let sellBtn = document.createElement("button");
                        sellBtn.textContent = `Sell`;
                        sellBtn.style.background = '#181828';
                        sellBtn.style.color = '#00fff7';
                        sellBtn.style.border = '2px solid #00fff7';
                        sellBtn.style.borderRadius = '6px';
                        sellBtn.style.fontSize = '1.1em';
                        sellBtn.style.margin = '8px 0';
                        sellBtn.style.padding = '6px 18px';
                        sellBtn.style.cursor = 'pointer';
                        sellBtn.addEventListener('click', () => {
                            // Remove tower from array
                            this.towerArray = this.towerArray.filter(t => t !== existingTower);
                            event.target.classList.remove(existingTower.key);
                            this.credits += sellValue;
                            document.getElementById("credits").textContent = "Bandwidth: " + this.credits;
                            sellMenu.remove();
                        });
                        sellMenu.appendChild(sellBtn);
                        document.querySelector("#centeredDiv").appendChild(sellMenu);
                        // Position menu near the tile
                        let rect = event.target.getBoundingClientRect();
                        sellMenu.style.position = "absolute";
                        sellMenu.style.left = `${rect.right + 10 + window.scrollX}px`;
                        sellMenu.style.top = `${rect.top + window.scrollY}px`;
                        // Close button
                        sellMenu.querySelector('.close-btn').addEventListener('click', e => {
                            sellMenu.remove();
                            e.stopPropagation();
                        });
                        // Dismiss menu when clicking outside
                        setTimeout(() => {
                          const outsideClick = (e) => {
                            if (!sellMenu.contains(e.target)) {
                              sellMenu.remove();
                              document.removeEventListener('mousedown', outsideClick);
                            }
                          };
                          document.addEventListener('mousedown', outsideClick);
                        }, 0);
                        return;
                    }
                    let towerSeletionMenu = document.createElement("menu");
                    towerSeletionMenu.id = "towerSeletionMenu";
                    towerSeletionMenu.innerHTML = `<button class='close-btn' title='Close'>&#10006;</button>`;
                    towerSeletionMenu.appendChild(document.createTextNode("Select your cybersecurity tool:"));
                    CYBER_TOWERS.forEach(tower => {
                        let towerType = document.createElement("li");
                        towerType.innerHTML = getImageFor(tower.key, false) + ` ${tower.name} (${tower.price} Bandwidth)`;
                        towerType.title = tower.description;
                        towerSeletionMenu.appendChild(towerType);
                        towerType.addEventListener("click", purchaseClick => {
                            // Prevent building if already a tower here
                            if (this.towerArray.find(t => t.location === event.target.id)) {
                                towerSeletionMenu.remove();
                                return;
                            }
                            if ((this.credits - tower.price) >= 0) {
                                this.credits = this.credits - tower.price;
                                let towerName = `${tower.key}_${this.towerArray.length + 1}`;
                                this.towerArray.push(new Tower(tower.key, towerName));
                                event.target.classList.add(tower.key);
                                this.towerArray[this.towerArray.length - 1].location = event.target.id;
                                towerSeletionMenu.remove();
                                document.getElementById("credits").textContent = "Bandwidth: " + this.credits;
                            } else {
                                towerType.style.color = "red";
                            }
                        }, { once: true });
                    });
                    document.querySelector("#centeredDiv").appendChild(towerSeletionMenu);
                    // Position menu near the tile
                    let rect = event.target.getBoundingClientRect();
                    towerSeletionMenu.style.position = "absolute";
                    towerSeletionMenu.style.left = `${rect.right + 10 + window.scrollX}px`;
                    towerSeletionMenu.style.top = `${rect.top + window.scrollY}px`;
                    // Close button
                    towerSeletionMenu.querySelector('.close-btn').addEventListener('click', e => {
                        towerSeletionMenu.remove();
                        e.stopPropagation();
                    });
                    // Dismiss menu when clicking outside
                    setTimeout(() => {
                      const outsideClick = (e) => {
                        if (!towerSeletionMenu.contains(e.target)) {
                          towerSeletionMenu.remove();
                          document.removeEventListener('mousedown', outsideClick);
                        }
                      };
                      document.addEventListener('mousedown', outsideClick);
                    }, 0);
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
        let introText = `
        <h1>WELCOME.</h1>
        <div class='welcome-highlight'>YOU ARE THE NEW CYBER DEFENSE AI.</div>
        <div class='welcome-highlight' style='margin-bottom:1.5em;'>DEPLOY CYBERSECURITY TOOLS TO DEFEND YOUR MAIN SERVER FROM WAVES OF CYBER THREATS.</div>
        <div class='welcome-highlight' style='margin-bottom:0.5em;'>INSTRUCTIONS:</div>
        <ul>
          <li>CLICK BLUE TILES TO BUILD CYBERSECURITY TOWERS (FIREWALL, ANTIVIRUS, IDS, ETC).</li>
          <li>EACH TOWER HAS UNIQUE ABILITIES AND COSTS BANDWIDTH TO DEPLOY.</li>
          <li>CLICK A TOWER TO SELL IT FOR HALF ITS COST.</li>
          <li>CLICK "START ATTACK WAVE" TO BEGIN THE NEXT WAVE OF THREATS.</li>
          <li>DEFEAT ALL ENEMIES BEFORE THEY REACH YOUR MAIN SERVER.</li>
          <li>IF YOUR MAIN SERVER HP REACHES 0, YOU LOSE!</li>
        </ul>
        <span class='welcome-tip'>TIP: HOVER OVER TOWERS AND ENEMIES FOR DESCRIPTIONS.</span>
        <div class='welcome-highlight' style='margin-top:1.5em;'>DO YOU ACCEPT?</div>
        <button id="nextButton" class="welcome-accept-btn">ACCEPT ></button>`;
        let introBox = document.createElement("dialog");
        introBox.id = "welcomeDialog";
        introBox.className = "intro-dialog";
        introBox.innerHTML = introText;
        document.body.appendChild(introBox);
        introBox.open = true;
        document.getElementById("nextButton").addEventListener("click", (e) => {
            introBox.remove(); // Remove the welcome dialog
            this.mainGame();
        });
    }
    LevelsStart(){
        if(document.querySelectorAll("#centeredDiv > *").length > 0){
            document.querySelectorAll("#centeredDiv > *").forEach(element => {
                element.remove();
            });
        }
        this.tileArray = []; // Reset tile array for new grid
        let stats = document.createElement("div");
        stats.id = "stats";
        let health = document.createElement("a");
        let credits = document.createElement("a");
        let enemiesLeft = document.createElement("a");
        health.id = "health";
        credits.id = "credits";
        enemiesLeft.id = "enemiesLeft";
        health.textContent = "Main Server HP: " + this.baseHP;
        credits.textContent = "Bandwidth: " + this.credits;
        enemiesLeft.textContent = "Enemies Remaining: 0";
        stats.appendChild(health);
        stats.appendChild(credits);
        stats.appendChild(enemiesLeft);
        document.querySelector("#centeredDiv").appendChild(stats);
        let gameBoardContainer = document.createElement("div");
        gameBoardContainer.style.display = "flex";
        gameBoardContainer.style.flexDirection = "row";
        gameBoardContainer.style.justifyContent = "center";
        gameBoardContainer.style.alignItems = "flex-start";
        // Create game board
        let gameBoard = document.createElement("table");
        gameBoard.id = "gameBoard";
        gameBoardContainer.appendChild(gameBoard);
        // Create enemy info panel
        let enemyPanel = document.createElement("div");
        enemyPanel.id = "enemyInfoPanel";
        enemyPanel.style.background = "rgba(24,24,40,0.95)";
        enemyPanel.style.border = "2px solid #00fff7";
        enemyPanel.style.borderRadius = "10px";
        enemyPanel.style.marginLeft = "32px";
        enemyPanel.style.padding = "18px 18px 8px 18px";
        enemyPanel.style.minWidth = "220px";
        enemyPanel.style.color = "#00fff7";
        enemyPanel.style.boxShadow = "0 0 16px #00fff7, 0 0 4px #ff00ea";
        enemyPanel.innerHTML = `<div style='font-size:1.2em; font-weight:bold; margin-bottom:10px;'>Incoming Threats</div><div id='enemyListPanel'></div>`;
        gameBoardContainer.appendChild(enemyPanel);
        document.querySelector("#centeredDiv").appendChild(gameBoardContainer);
        for (let firstDimensionIndex = 0; firstDimensionIndex < this.gridSize; firstDimensionIndex++) {
            this.tileArray.push([]);
            let tr = document.createElement("tr");
            gameBoard.appendChild(tr);
            for (let secondDimensionItem = 0; secondDimensionItem < this.gridSize; secondDimensionItem++) {
                this.tileArray[firstDimensionIndex][secondDimensionItem] = firstDimensionIndex+1 + (String.fromCharCode(secondDimensionItem+97));
                let element = document.createElement("td")
                element.id = (this.tileArray[firstDimensionIndex][secondDimensionItem]);
                tr.appendChild(element);
            }
        }
        // Now generate the path after grid is created
        this.generateLevel();
        this.buildTowers(); // Re-attach listeners after grid is built
        this.updateEnemiesLeftUI();
        // Place the server icon at the end of the path
        setTimeout(() => {
            const lastPathCellId = this.pathArray && this.pathArray.length ? this.pathArray[this.pathArray.length - 1] : null;
            if (lastPathCellId) {
                const td = document.getElementById(lastPathCellId);
                if (td && !td.querySelector('.server-end-of-path-container')) { // Check for new container
                    // Create a container for the icon and text
                    let serverContainer = document.createElement('div');
                    serverContainer.className = 'server-end-of-path-container';
                    
                    let icon = document.createElement('span');
                    icon.className = 'server-end-of-path';
                    icon.innerHTML = '🖥️';
                    serverContainer.appendChild(icon);

                    let serverText = document.createElement('div');
                    serverText.className = 'server-end-of-path-text';
                    serverText.textContent = 'MAIN SERVER';
                    serverContainer.appendChild(serverText);
                    
                    td.appendChild(serverContainer);
                }
            }
            // Populate enemy info panel for the next wave
            this.updateEnemyInfoPanel();
        }, 120);
    }
    updateEnemiesLeftUI() {
        const enemiesLeft = document.getElementById("enemiesLeft");
        if (enemiesLeft) {
            enemiesLeft.textContent = "Enemies Remaining: " + this.enemiesArray.length;
        }
            }
    winnerScreen(){
        alert("ALL THREATS BLOCKED! YOU WIN!");
    }
    loserScreen(){
        // Remove any existing game over screens
        document.querySelectorAll('#gameOverScreen').forEach(el => el.remove());
        let dialog = document.createElement('div');
        dialog.id = 'gameOverScreen';
        dialog.style.position = 'fixed';
        dialog.style.left = '50%';
        dialog.style.top = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.background = '#181828';
        dialog.style.color = '#ff0033';
        dialog.style.border = '2px solid #ff0033';
        dialog.style.borderRadius = '12px';
        dialog.style.padding = '40px 60px';
        dialog.style.zIndex = '3000';
        dialog.style.textAlign = 'center';
        dialog.style.boxShadow = '0 0 32px #ff0033, 0 0 8px #ff00ea';
        // Custom message based on lastKillerEnemy
        let customMsg = "Main Server Compromised";
        if (this.lastKillerEnemy) {
            const type = this.lastKillerEnemy.key;
            const name = this.lastKillerEnemy.name.split(' #')[0];
            switch(type) {
                case 'virus': customMsg = 'A Virus overwhelmed your defenses!'; break;
                case 'worm': customMsg = 'A Worm slipped through and spread everywhere!'; break;
                case 'trojan': customMsg = 'A Trojan tricked your system!'; break;
                case 'ransomware': customMsg = 'Ransomware encrypted your server!'; break;
                case 'phishing': customMsg = 'Phishing stole your credentials!'; break;
                case 'ddos': customMsg = 'A DDoS attack brought your server down!'; break;
                case 'rootkit': customMsg = 'A Rootkit hid and took control!'; break;
                case 'spyware': customMsg = 'Spyware stole all your secrets!'; break;
                case 'zero_day': customMsg = 'A Zero-Day exploit bypassed all defenses!'; break;
                default: customMsg = name + ' compromised your server!';
            }
        }
        dialog.innerHTML = `
          <h1 style='font-size:3em; margin-bottom: 0.5em; color:#ff0033; text-shadow:0 0 8px #ff00ea;'>GAME OVER</h1>
          <div style='font-size:1.5em; margin-bottom: 1.5em; color:#fff;'>${customMsg}</div>
          <button id='restartBtn' style='margin-top:18px; background:#181828; color:#ff0033; border:2px solid #ff0033; border-radius:6px; font-size:1.2em; padding:8px 32px; cursor:pointer; box-shadow:0 0 8px #ff0033;'>Restart</button>`;
        document.body.appendChild(dialog);
        document.getElementById('restartBtn').onclick = () => {
          window.location.reload();
        };
    }
    mainGame(){
        this.LevelsStart();
        this.levelStartButton();
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
            document.getElementById("health").textContent = "Main Server HP: " + this.baseHP;
            document.getElementById("credits").textContent = "Bandwidth: " + this.credits;
            if(this.enemiesArray.every(ele => ele.hp <= 0)){
                this.enemiesArray.length = 0;
            }
        }, this.tick);
    }

    levelComplete() {
        this.clearGameBoard(); // needs work
        this.removeAllEnemiesFromDOM(); // Remove any stray enemies/icons
        this.currentLevel++;
        this.generateLevel();
        this.buildTowers(); // Re-attach listeners after grid is rebuilt
        this.baseHP = 900;
        this.credits = +(this.currentLevel * 100);
        this.levelsEnd = false;
        this.levelStart = false;
        console.log("new level");
    }
    // Utility: remove all stray .enemy and .default-img elements from DOM
    removeAllEnemiesFromDOM() {
      document.querySelectorAll('.enemy').forEach(el => el.remove());
      document.querySelectorAll('.default-img').forEach(el => el.remove());
    }
    // Show level complete screen with stats
    showLevelCompleteScreen(stats) {
      document.querySelectorAll('#levelCompleteScreen').forEach(el => el.remove());
      let dialog = document.createElement('div');
      dialog.id = 'levelCompleteScreen';
      dialog.style.position = 'fixed';
      dialog.style.left = '50%';
      dialog.style.top = '50%';
      dialog.style.transform = 'translate(-50%, -50%)';
      dialog.style.background = '#181828';
      dialog.style.color = '#00fff7';
      dialog.style.border = '2px solid #00fff7';
      dialog.style.borderRadius = '12px';
      dialog.style.padding = '32px 48px';
      dialog.style.zIndex = '2000';
      dialog.style.textAlign = 'center';
      dialog.style.boxShadow = '0 0 32px #00fff7, 0 0 8px #ff00ea';
      dialog.innerHTML = `<h2>Level ${stats.level} Complete!</h2>
        <div style='margin: 12px 0;'>Enemies Defeated: <b>${stats.enemiesDefeated}</b></div>
        <div style='margin: 12px 0;'>Enemies Remaining: <b>${stats.enemiesRemaining}</b></div>
        <div style='margin: 12px 0;'>Bandwidth Earned: <b>${stats.bandwidthEarned}</b></div>
        <button id='nextLevelBtn' style='margin-top:18px; background:#181828; color:#00fff7; border:2px solid #00fff7; border-radius:6px; font-size:1.2em; padding:8px 24px; cursor:pointer;'>Next Level</button>`;
      document.body.appendChild(dialog);
      document.getElementById('nextLevelBtn').onclick = () => {
        dialog.remove();
        this.levelComplete();
      };
    }
    // Check if wave is over and show success screen
    checkWaveEnd() {
      // Only end the level if there are truly no .enemy elements left in the grid and the array is empty
      const enemiesInDOM = document.querySelectorAll('.enemy').length;
      if (this.enemiesArray.length === 0 && enemiesInDOM === 0 && this.levelStart) {
        const stats = {
          level: this.currentLevel + 1,
          enemiesDefeated: this.defeatedEnemies || 0,
          enemiesRemaining: 0,
          bandwidthEarned: this.lastWaveBandwidth || 0
        };
        this.showLevelCompleteScreen(stats);
        this.levelStart = false;
        this.defeatedEnemies = 0;
      } else if (this.levelStart) {
        // Show remaining enemies if not all are gone
        const stats = {
          level: this.currentLevel + 1,
          enemiesDefeated: this.defeatedEnemies || 0,
          enemiesRemaining: this.enemiesArray.length,
          bandwidthEarned: this.lastWaveBandwidth || 0
        };
        // Optionally update a UI element for enemies remaining here
      }
    }
    updateEnemyInfoPanel() {
        // Show the types of enemies in the next wave
        const panel = document.getElementById('enemyListPanel');
        if (!panel) return;
        // Count enemies for the next wave
        let numberOfEnemies = 10 + this.currentLevel * 2;
        let enemyCounts = {};
        for (let i = 0; i < numberOfEnemies; i++) {
            let threatType = CYBER_THREATS[i % CYBER_THREATS.length].key;
            enemyCounts[threatType] = (enemyCounts[threatType] || 0) + 1;
        }
        let html = '';
        Object.keys(enemyCounts).forEach(type => {
            const threat = CYBER_THREATS.find(t => t.key === type);
            html += `<div class='enemy-panel-row'>` +
                `<span class='enemy-panel-icon'>${getImageFor(type, true)}</span>` +
                `<div class='enemy-panel-details'><span class='enemy-panel-name'>${threat.name}</span><span class='enemy-panel-count'>x${enemyCounts[type]}</span><br><span class='enemy-panel-desc'>${threat.description}</span></div>` +
                `</div>`;
        });
        panel.innerHTML = html;
    }
}

// Utility: get image for enemy/tower or fallback
function getImageFor(type, isEnemy = false) {
  // You can map keys to image filenames here
  const images = {
    // Tower Images with correct casing and extensions
    firewall: 'Firewall.webp', 
    antivirus: 'antivirus.webp',
    ids: 'IDS.webp',
    encryption: 'encyption.webp', // Note: fixing the typo in the mapping, but using the actual filename
    honeypot: 'HoneyPot.webp',
    
    // Enemy Images (using fallbacks since we don't have specific images)
    virus: 'enemy1.jpg',
    // No specific image files for other enemies
  };
  if (images[type]) {
    return `<img class="${isEnemy ? 'enemy-img' : 'tower-img'}" src="${images[type]}" alt="${type}">`;
  } else {
    // fallback: emoji or SVG
    const emoji = isEnemy ? '👾' : '🛡️'; // Default enemy and tower emojis
    // Specific fallback emojis if needed
    const fallbackEmojis = {
        firewall: '🧱',
        antivirus: '🔬',
        ids: '📡',
        encryption: '🔒',
        honeypot: '🍯', 
        virus: '🦠',
        worm: '🐛',
        trojan: '🐴',
        ransomware: '💰',
        phishing: '🎣',
        ddos: '💥',
        rootkit: '💀',
        spyware: '👀',
        zero_day: '🚨'
    };
    return `<span class="default-img">${fallbackEmojis[type] || emoji}</span>`;
  }
}

let game1 = new GameSesion();
game1.gameStart();
console.log("script loaded");