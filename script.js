// Script: CyberDefense game logic (pure DOM, no frameworks)
'use strict';

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
    reward: 12,
    description: 'A basic self-replicating malware.'
  },
  {
    key: 'worm',
    name: 'Worm',
    speed: 2,
    hp: 40,
    damage: 80,
    reward: 10,
    description: 'Spreads quickly through the network.'
  },
  {
    key: 'trojan',
    name: 'Trojan',
    speed: 1,
    hp: 60,
    damage: 120,
    reward: 14,
    description: 'Disguised as legitimate software.'
  },
  {
    key: 'ransomware',
    name: 'Ransomware',
    speed: 1,
    hp: 80,
    damage: 200,
    reward: 18,
    description: 'Encrypts files and demands ransom.'
  },
  {
    key: 'phishing',
    name: 'Phishing',
    speed: 2,
    hp: 30,
    damage: 60,
    reward: 8,
    description: 'Tricks users into giving up credentials.'
  },
  {
    key: 'ddos',
    name: 'DDoS',
    speed: 3,
    hp: 100,
    damage: 150,
    reward: 20,
    description: 'Overwhelms the server with traffic.'
  },
  {
    key: 'rootkit',
    name: 'Rootkit',
    speed: 1,
    hp: 120,
    damage: 180,
    reward: 22,
    description: 'Hides deep in the system.'
  },
  {
    key: 'spyware',
    name: 'Spyware',
    speed: 2,
    hp: 35,
    damage: 70,
    reward: 9,
    description: 'Steals sensitive information.'
  },
  {
    key: 'zero_day',
    name: 'Zero-Day',
    speed: 2,
    hp: 150,
    damage: 250,
    reward: 30,
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
        this.level = 1;
        // Structure health for firewall and honeypot
        if (this.key === 'firewall') {
            this.maxHp = 250;
            this.hp = this.maxHp;
        } else if (this.key === 'honeypot') {
            this.maxHp = 180;
            this.hp = this.maxHp;
        } else {
            this.maxHp = null;
            this.hp = null;
        }
    }
  giveInRangePathTiles(tileArr) {
        this.inRangePathTiles = tileArr;
    }
  getLocation(gridIndex) {
        this.location = gridIndex;
  }
  getUpgradeCost() {
        // cost grows by 75% each level
        return Math.round(this.price * (this.level + 1) * 0.75);
  }
  applyUpgrade() {
        this.level += 1;
        // simple scaling: +1 range every 2 levels, +30% damage each level
        if (this.level % 2 === 0) this.range += 1;
        this.damage = Math.round(this.damage * 1.3);
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
    this.maxHp = threatConfig.hp;
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
        this.tick = 1000; // base tick in ms
        this.speedMultiplier = 1; // affected by UI speed select
        this.paused = false; // pause/resume
        this.difficulty = 'normal'; // easy|normal|hard
        this.baseHP = 900;
        this.credits = 200;
        this.levelsEnd = true;
        this.levelStart = false;
        this.lastKillerEnemy = null; // Track the last enemy to hit the server
        this.mute = false;
        this.showRanges = false;
        this.lastMenuOpenAt = 0; // debounce for tile/menu clicks
        this.undoStack = []; // stack of {tileId, towerKey, price}
        this.stepOnce = false; // when paused, allow advancing one tick
    }
    getEffectiveTick(){
        // Ensure a minimum delay to avoid starving UI
        return Math.max(120, Math.round(this.tick / (this.speedMultiplier || 1)));
    }
    getAdjacentTile(tileIndex, direction){
        //return either the tile location if given both variables
        //or returns all directions of a tile if just given first variable, will include space you came from
        //
        let rowIndex = '';
        let columnIndex = '';
        try{
        if (tileIndex.length === 3) {
            rowIndex = ((tileIndex.slice(0,2)) - 1);
            columnIndex = ((tileIndex.charAt(2)).charCodeAt(0) - 97);
        } else {
            rowIndex = tileIndex.charAt(0) - 1;
            columnIndex = (tileIndex.charAt(1)).charCodeAt(0) - 97;
        }
        switch (direction) {
            case 'up':
                if (rowIndex === 0) throw 'No tile there';
                return (rowIndex + String.fromCharCode(columnIndex + 97));
            case 'down':
                if (rowIndex === this.tileArray.length - 1) throw 'No tile there';
                return ((rowIndex + 2) + String.fromCharCode(columnIndex + 97));
            case 'left':
                if (columnIndex === 0) throw 'No tile there';
                return (tileIndex.charAt(0) + String.fromCharCode(columnIndex + 96));
            case 'right':
                if (columnIndex === this.tileArray[rowIndex].length - 1) throw 'No tile there';
                return (tileIndex.charAt(0) + String.fromCharCode(columnIndex + 98));
            default:
                let arrOfPossibleTiles = [];
                if (rowIndex !== 0) { // up
                    arrOfPossibleTiles.push('up');
                }
                if (rowIndex !== this.tileArray.length - 1) { // down
                    arrOfPossibleTiles.push('down');
                }
                if (columnIndex !== 0) { // left
                    arrOfPossibleTiles.push('left');
                }
                if (columnIndex !== this.tileArray[rowIndex].length - 1) { // right
                    arrOfPossibleTiles.push('right');
                }
                return arrOfPossibleTiles;
            //code that excutes without variables
        }//code that excutes with variables
        } catch(err) {
            console.log(err);
            
        }

    }
    //getAdjencent(turrent location).forEach(direction => PossibleInRangeSpots.push(getAdjecent(turentlocation, direction)))
    generateLevel(){
            //minium of 8x8 grid
        let startTile = '';
        let moves = [];
        let lastTile = '';
        let nextTile = '';
        let rand = Math.floor(Math.random()*4)+1;
        console.log(rand);
        switch (rand) {
            case 1:
                startTile = '1d';
                moves = ['down', 'down', 'left', 'left', 'down', 'down', 'down', 'down', 'down'];
                
                break;
            case 2:
                startTile = '1a';
                moves = ['down', 'right', 'right', 'right', 'down', 'right', 'right', 'down', 'down'];
                
                break;
            
            case 3:
                startTile = '1c';
                moves = ['down', 'down', 'down', 'left', 'down', 'down', 'right', 'right', 'right', 'down'];
                break;
            
            case 4:
                startTile = '1g';
                moves = ['down', 'left', 'left', 'left', 'down', 'down', 'right', 'down', 'down'];
                break;
        
            case 5:
                startTile = '1d';
                moves = ['down', 'down', 'left', 'left', 'down', 'down', 'right', 'right', 'right', 'down'];
                break;

            default: throw 'reached default switch case on generateLevel'
        }
        //creating enemy path
        document.getElementById(startTile).classList.add('path');
        lastTile = startTile;
        this.pathArray.push(startTile);
        moves.forEach(move => {
            let nextTile = this.getAdjacentTile(lastTile, move);
            document.getElementById(nextTile).classList.add('path');
            lastTile = nextTile;
            this.pathArray.push(nextTile);
        });
        while (this.getAdjacentTile(lastTile).includes('down')) {
            nextTile = this.getAdjacentTile(lastTile, 'down');
            document.getElementById(nextTile).classList.add('path');
            lastTile = nextTile;
            this.pathArray.push(nextTile);
        }
        // Mark the end of the path with a visible server/computer icon and label
        try {
            const endTileEl = document.getElementById(lastTile);
            if (endTileEl && !endTileEl.querySelector('.server-end-of-path')) {
                const container = document.createElement('div');
                container.className = 'server-end-of-path-container';
                const icon = document.createElement('div');
                icon.className = 'server-end-of-path';
                icon.textContent = '💻';
                const label = document.createElement('div');
                label.className = 'server-end-of-path-text';
                label.textContent = 'SERVER';
                container.appendChild(icon);
                container.appendChild(label);
                endTileEl.appendChild(container);
            }
        } catch(e) { console.log(e); }
        //generating the possible tower locations
        this.tileArray.forEach(arr => {
            arr.forEach(testTile => {
                if (document.getElementById(testTile).className.includes('path')) {}
                else{
                document.getElementById(testTile).classList.add('possibleTowerSpot');
                }
            });
        });


    }
    clearGameBoard(){
        // Remove path and possibleTowerSpot classes
        while (document.querySelector('.path')) {
            let el = document.querySelector('.path');
            if (!el) { break; }
            el.classList.remove('path');
        }
        while (document.querySelector('.possibleTowerSpot')) {
            let el = document.querySelector('.possibleTowerSpot');
            if (!el) { break; }
            el.classList.remove('possibleTowerSpot');
        }
        // Remove all tower and threat classes from tiles
        (document.querySelectorAll('td')).forEach(tile => {
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
        let startButton = document.createElement('button');
        startButton.id = 'startButton';
        startButton.appendChild(document.createTextNode('Start Attack Wave'));
        document.querySelector('#centeredDiv').appendChild(startButton);
        document.querySelector('#startButton').addEventListener('click', () => { this.startLevel(); }, { once: true });
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
            // Difficulty modifiers
            if (this.difficulty === 'easy') { enemyObj.hp = Math.round(enemyObj.hp * 0.85); }
            if (this.difficulty === 'hard') { enemyObj.hp = Math.round(enemyObj.hp * 1.25); }
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
            if (this.paused && !this.stepOnce) { setTimeout(spawnNextEnemy, 200); return; }
            if (allEnemies.length > 0) {
                const enemy = allEnemies.shift();
                if (enemy && this.enemiesArray.includes(enemy)) {
                    this.moveEnemy(enemy);
                }
                if (this.paused) { this.stepOnce = false; setTimeout(spawnNextEnemy, 200); }
                else { setTimeout(spawnNextEnemy, this.getEffectiveTick()); }
            } else {
                console.log('All enemies spawned');
            }
        };
        
        // Start spawning
        spawnNextEnemy();
    }

    moveEnemy(enemy) {
        try {
            if (!enemy || !this.enemiesArray.includes(enemy)) { return; }
            let i = 0;
            let currentTile = '';
            const step = () => {
                // If paused or enemy removed, reschedule or stop
                if (!enemy || !this.enemiesArray.includes(enemy)) { return; }
                if (this.paused && !this.stepOnce) { setTimeout(step, 200); return; }

                const nextTileId = this.pathArray[i];
                if (!nextTileId) { return; }

                // Check honeypot stall: if any honeypot has this enemy in range, stall and attack honeypot
                const activeHoneypot = this.towerArray.find(t => t.key === 'honeypot' && t.hp > 0 && (t.inRangePathTiles || []).includes(enemy.location));
                if (activeHoneypot) {
                    // Enemy attacks honeypot instead of moving
                    const dmg = Math.max(5, Math.round(enemy.damage * 0.35));
                    activeHoneypot.hp = Math.max(0, activeHoneypot.hp - dmg);
                    const honeypotTile = document.getElementById(activeHoneypot.location);
                    if (honeypotTile) {
                        this.showDamageIndicator(honeypotTile, dmg, true);
                        this.updateStructureHpUI(honeypotTile, activeHoneypot);
                        if (activeHoneypot.hp <= 0) {
                            // Remove structure
                            honeypotTile.classList.remove(activeHoneypot.key);
                            honeypotTile.querySelectorAll('.tower-img, .default-img, .structure-hp').forEach(el => el.remove());
                            this.removeObject(activeHoneypot, this.towerArray);
                        }
                    }
                    if (this.paused) { this.stepOnce = false; setTimeout(step, 200); }
                    else { setTimeout(step, this.getEffectiveTick()); }
                    return;
                }

                // Check firewall block: if next tile has a firewall with hp, attack it and don't move
                const firewallOnNext = this.towerArray.find(t => t.key === 'firewall' && t.location === nextTileId && t.hp > 0);
                if (firewallOnNext) {
                    const dmg = Math.max(5, Math.round(enemy.damage * 0.4));
                    firewallOnNext.hp = Math.max(0, firewallOnNext.hp - dmg);
                    const fwTile = document.getElementById(firewallOnNext.location);
                    if (fwTile) {
                        this.showDamageIndicator(fwTile, dmg, true);
                        this.updateStructureHpUI(fwTile, firewallOnNext);
                        if (firewallOnNext.hp <= 0) {
                            fwTile.classList.remove('firewall');
                            fwTile.querySelectorAll('.tower-img, .default-img, .structure-hp').forEach(el => el.remove());
                            this.removeObject(firewallOnNext, this.towerArray);
                        }
                    }
                    setTimeout(step, this.getEffectiveTick());
                    return;
                }

                if (nextTileId === 'base') {
                    if (currentTile && document.getElementById(currentTile)) {
                        const prevTd = document.getElementById(currentTile);
                        if (prevTd && prevTd.querySelector(`#${enemy.domId}`)) {
                            prevTd.removeChild(prevTd.querySelector(`#${enemy.domId}`));
                        }
                    }
                    document.querySelectorAll(`#${enemy.domId}`).forEach(el => el.remove());
                    const serverIcon = document.querySelector('.server-end-of-path');
                    if (serverIcon) {
                        serverIcon.classList.add('server-damaged');
                        setTimeout(() => serverIcon.classList.remove('server-damaged'), 600);
                    }
                    this.baseHP = this.baseHP - enemy.damage;
                    this.lastKillerEnemy = enemy;
                    this.removeObject(enemy, this.enemiesArray);
                    this.defeatedEnemies = (this.defeatedEnemies || 0) + 1;
                    this.updateEnemiesLeftUI();
                    this.checkWaveEnd();
                    return;
                }

                // Enemy HP check and UI update handled during towersAct()
                if (enemy.hp <= 0) {
                    const prevTd = document.getElementById(currentTile);
                    if (prevTd && prevTd.querySelector(`#${enemy.domId}`)) {
                        prevTd.removeChild(prevTd.querySelector(`#${enemy.domId}`));
                    }
                    document.querySelectorAll(`#${enemy.domId}`).forEach(el => el.remove());
                    const threatConfig = CYBER_THREATS.find(t => t.key === enemy.key);
                    this.credits += threatConfig && threatConfig.reward ? threatConfig.reward : 10;
                    const credEl = document.getElementById('credits');
                    if (credEl) credEl.textContent = 'Bandwidth: ' + this.credits;
                    this.removeObject(enemy, this.enemiesArray);
                    this.defeatedEnemies = (this.defeatedEnemies || 0) + 1;
                    this.updateEnemiesLeftUI();
                    this.checkWaveEnd();
                    return;
                }

                // Move visual
                if (currentTile && document.getElementById(currentTile)) {
                    const prevTd = document.getElementById(currentTile);
                    if (prevTd && prevTd.querySelector(`#${enemy.domId}`)) {
                        prevTd.removeChild(prevTd.querySelector(`#${enemy.domId}`));
                    }
                }
                const td = document.getElementById(nextTileId);
                if (td) {
                    let enemyDiv = document.createElement('div');
                    enemyDiv.className = 'enemy';
                    enemyDiv.id = enemy.domId;
                    enemyDiv.innerHTML = getImageFor(enemy.key, true);
                    // add HP bar
                    const hpBar = document.createElement('div');
                    hpBar.className = 'hp-bar';
                    const hpFill = document.createElement('div');
                    hpFill.className = 'hp-fill';
                    if (enemy.maxHp) {
                        const pct = Math.max(0, Math.round((enemy.hp / enemy.maxHp) * 100));
                        hpFill.style.width = pct + '%';
                    } else {
                        hpFill.style.width = '100%';
                    }
                    hpBar.appendChild(hpFill);
                    enemyDiv.appendChild(hpBar);
                    td.appendChild(enemyDiv);
                }
                currentTile = nextTileId;
                enemy.location = currentTile;
                i++;
                if (this.paused) { this.stepOnce = false; setTimeout(step, 200); }
                else { setTimeout(step, this.getEffectiveTick()); }
            };
            setTimeout(step, this.getEffectiveTick());
        } catch (e) { console.error(e); }
    }

    // Helpers to support targeting modes
    tileIdToRC(id){
        // id like "r3c5" or numeric; adapt if needed
        try {
            if (typeof id === 'string') {
                const m = id.match(/r(\d+)c(\d+)/);
                if (m) return { r: parseInt(m[1],10), c: parseInt(m[2],10) };
            }
        } catch(e){}
        return { r:0, c:0 };
    }
    manhattanTo(a,b){ return Math.abs(a.r - b.r) + Math.abs(a.c - b.c); }

    // Undo last tower placement
    undoLastPlacement(){
        try {
            const last = this.undoStack.pop();
            if (!last) { showToast('Nothing to undo', 'warn'); return; }
            const idx = this.towerArray.findIndex(t => t.location === last.tileId && t.key === last.towerKey);
            if (idx === -1) { showToast('Nothing to undo', 'warn'); return; }
            const tower = this.towerArray[idx];
            // Remove tower model and visuals
            const td = document.getElementById(tower.location);
            if (td) {
                td.classList.remove(tower.key);
                td.querySelectorAll('.tower-img, .default-img, .structure-hp').forEach(el => el.remove());
            }
            this.towerArray.splice(idx,1);
            this.credits += Math.floor((last.price || 0)); // refund full price for undo
            this.updateHUD();
            this.getInRangePathTiles();
            this.updateAllRangeHighlights(this.showRanges);
            showToast('Undid last placement', 'success');
        } catch(e){ console.log(e); }
    }

    // Continuous loop to let towers fire based on the current tick/speed
    startTowersLoop() {
        const loop = () => {
            try {
                this.towersAct();
            } catch(e) { console.log(e); }
            setTimeout(loop, this.getEffectiveTick());
        };
        setTimeout(loop, this.getEffectiveTick());
    }

    // Settings modal for colorblind toggle
    openSettingsModal(){
        // Remove existing
        document.getElementById('settingsModal')?.remove();
        const modal = document.createElement('dialog');
        modal.id = 'settingsModal';
        modal.style.background = '#0f0f1e';
        modal.style.border = '2px solid var(--border)';
        modal.style.color = 'var(--text)';
        modal.style.padding = '16px 18px';
        modal.style.borderRadius = 'var(--radius-m)';
        modal.innerHTML = `
            <h3 style="margin-top:0">Settings</h3>
            <label style="display:block; margin:8px 0;">
                <input type="checkbox" id="cbColorblind"> Colorblind-friendly palette
            </label>
            <div style="margin-top:14px; display:flex; gap:10px;">
                <button id="settingsClose">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
        const cb = modal.querySelector('#cbColorblind');
        cb.checked = document.body.classList.contains('colorblind');
        cb.onchange = () => {
            const on = cb.checked;
            document.body.classList.toggle('colorblind', on);
            try { localStorage.setItem('cd_colorblind', String(on)); } catch(e){}
        };
        modal.querySelector('#settingsClose').onclick = () => modal.close();
        if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open','');
    }

    buildTowers(){
        // Remove previous listeners by cloning nodes on both buildable and path tiles
        document.querySelectorAll(".possibleTowerSpot, .path").forEach(tile => {
            let newTile = tile.cloneNode(true);
            tile.parentNode.replaceChild(newTile, tile);
        });
        // Attach listeners to both non-path buildable tiles and path tiles
        document.querySelectorAll(".possibleTowerSpot, .path").forEach(tile => {
            tile.addEventListener("mouseover", event => {
                // Do not apply hover highlight if tile is part of a persistent range highlight
                if (!event.target.classList.contains('range-in-path')) {
                    event.target.classList.add("highlightCircle");
                }
                // Placement preview: valid/invalid glow
                const hasTower = this.towerArray.some(t => t.location === event.target.id);
                const isPath = this.pathArray.includes(event.target.id);
                if (!hasTower && !isPath) {
                    event.target.classList.add('valid-spot');
                    event.target.classList.remove('invalid-spot');
                } else {
                    event.target.classList.add('invalid-spot');
                    event.target.classList.remove('valid-spot');
                }
                tile.addEventListener("mouseout", e => {
                    // Only remove hover highlight; keep persistent range highlight intact
                    if (!e.target.classList.contains('range-in-path')) {
                        e.target.classList.remove("highlightCircle");
                    } else {
                        // Ensure no hover class lingers even if added previously
                        e.target.classList.remove("highlightCircle");
                    }
                    e.target.classList.remove('valid-spot');
                    e.target.classList.remove('invalid-spot');
                }, { once: true });
                event.target.addEventListener("click", tileSection => {
                    // Input debounce to prevent double opens
                    const now = Date.now();
                    if (now - this.lastMenuOpenAt < 150) { return; }
                    this.lastMenuOpenAt = now;
                    // Remove any existing menu first
                    document.querySelectorAll("#towerSeletionMenu, #towerSellMenu").forEach(menu => menu.remove());
                    // Check if a tower is already built here
                    const existingTower = this.towerArray.find(t => t.location === event.target.id);
                    if (existingTower) {
                        // Show custom upgrade/sell menu
                        const towerConfig = CYBER_TOWERS.find(t => t.key === existingTower.key);
                        const sellValue = Math.floor(towerConfig.price / 2);
                        let sellMenu = document.createElement("menu");
                        sellMenu.id = "towerSellMenu";
                        sellMenu.style.background = '#0f0f1e';
                        sellMenu.innerHTML = "<button class='close-btn' title='Close'>&#10006;</button>";
                        let info = document.createElement("div");
                        info.style.margin = '8px 0';
                        info.innerHTML = getImageFor(towerConfig.key, false) + ' <b>' + towerConfig.name + '</b><br>' +
                                         'Level: ' + existingTower.level + ' | Range: ' + existingTower.range + ' | Damage: ' + existingTower.damage;
                        sellMenu.appendChild(info);
                        // Show range highlights on path tiles
                        this.highlightTowerRange(existingTower, true);
                        // Also show a circular overlay to visualize range around the selected tower
                        this.showRangeCircle(existingTower, true);
                        // Targeting mode selector
                        const modeWrap = document.createElement('div');
                        modeWrap.style.marginTop = '6px';
                        const modeLabel = document.createElement('label');
                        modeLabel.textContent = 'Targeting: ';
                        const modeSelect = document.createElement('select');
                        ['first','last','strongest','closest'].forEach(m => {
                            const opt = document.createElement('option');
                            opt.value = m; opt.textContent = m;
                            modeSelect.appendChild(opt);
                        });
                        modeSelect.value = existingTower.targetingMode || 'first';
                        modeSelect.onchange = () => { existingTower.targetingMode = modeSelect.value; showToast('Targeting: ' + modeSelect.value); };
                        modeWrap.appendChild(modeLabel);
                        modeWrap.appendChild(modeSelect);
                        sellMenu.appendChild(modeWrap);

                        // Upgrade button
                        let upBtn = document.createElement("button");
                        upBtn.textContent = `Upgrade (+30% dmg${(existingTower.level+1)%2===0?', +1 range':''}) - ${existingTower.getUpgradeCost()}`;
                        upBtn.style.background = '#181828';
                        upBtn.style.color = '#00fff7';
                        upBtn.style.border = '2px solid #00fff7';
                        upBtn.style.borderRadius = '6px';
                        upBtn.style.fontSize = '1.1em';
                        upBtn.style.margin = '8px 0';
                        upBtn.style.padding = '6px 18px';
                        upBtn.style.cursor = 'pointer';
                        upBtn.addEventListener('click', () => {
                            if (game1.credits >= existingTower.getUpgradeCost()) {
                                game1.credits -= existingTower.getUpgradeCost();
                                existingTower.applyUpgrade();
                                // Recompute in-range tiles after range change
                                game1.getInRangePathTiles();
                                game1.updateHUD();
                                // Refresh menu info
                                info.innerHTML = getImageFor(towerConfig.key, false) + ' <b>' + towerConfig.name + '</b><br>' +
                                                 'Level: ' + existingTower.level + ' | Range: ' + existingTower.range + ' | Damage: ' + existingTower.damage;
                                const newCost = existingTower.getUpgradeCost();
                                upBtn.textContent = `Upgrade (+30% dmg${(existingTower.level+1)%2===0?', +1 range':''}) - ${newCost}`;
                                // Refresh global range highlights if enabled
                                game1.updateAllRangeHighlights(game1.showRanges);
                                showToast('Upgraded');
                            } else {
                                upBtn.style.color = 'red';
                            }
                        });
                        sellMenu.appendChild(upBtn);
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
                            // Remove tower from array and its image from the tile
                            this.towerArray = this.towerArray.filter(t => t !== existingTower);
                            event.target.classList.remove(existingTower.key);
                            // Remove any tower visuals
                            event.target.querySelectorAll('.tower-img, .default-img, .structure-hp').forEach(el => el.remove());
                            this.credits += sellValue;
                            this.updateHUD();
                            sellMenu.remove();
                            // Refresh global range highlights if enabled
                            this.updateAllRangeHighlights(this.showRanges);
                            showToast('Sold');
                        });
                        sellMenu.appendChild(sellBtn);
                        document.querySelector('#centeredDiv').appendChild(sellMenu);
                        // Position menu near the tile
                        let rect = event.target.getBoundingClientRect();
                        sellMenu.style.position = "absolute";
                        sellMenu.style.left = (rect.right + 10 + window.scrollX) + 'px';
                        sellMenu.style.top = (rect.top + window.scrollY) + 'px';
                        // Close button
                        sellMenu.querySelector('.close-btn').addEventListener('click', e => {
                            sellMenu.remove();
                            this.highlightTowerRange(existingTower, false);
                            this.showRangeCircle(existingTower, false);
                            e.stopPropagation();
                        });
                        // Dismiss menu when clicking outside
                        setTimeout(() => {
                          const outsideClick = (e) => {
                            if (!sellMenu.contains(e.target)) {
                              sellMenu.remove();
                              this.highlightTowerRange(existingTower, false);
                              this.showRangeCircle(existingTower, false);
                              document.removeEventListener('mousedown', outsideClick);
                            }
                          };
                          document.addEventListener('mousedown', outsideClick);
                        }, 0);
                        return;
                    }
                    let towerSeletionMenu = document.createElement('menu');
                    towerSeletionMenu.id = "towerSeletionMenu";
                    towerSeletionMenu.style.background = '#0f0f1e';
                    towerSeletionMenu.innerHTML = "<button class='close-btn' title='Close'>&#10006;</button>";
                    towerSeletionMenu.appendChild(document.createTextNode("Select your cybersecurity tool:"));
                    // Determine allowed towers based on tile type
                    const isPathTile = event.target.classList.contains('path');
                    const allowedTowers = CYBER_TOWERS.filter(tw => isPathTile ? (tw.key === 'firewall') : (tw.key !== 'firewall'));
                    allowedTowers.forEach(tower => {
                        let towerType = document.createElement("button");
                        towerType.innerHTML = `<b>${tower.name}</b> — ${tower.price}<br><small>Range: ${tower.range} | Damage: ${tower.damage}</small>`;
                        towerType.title = tower.name + "\nRange: " + tower.range + "  Damage: " + tower.damage + "\nSpecial: " + (tower.special || '-');
                        towerType.style.background = '#181828';
                        towerType.style.color = '#00fff7';
                        towerType.style.border = '2px solid #00fff7';
                        towerType.style.borderRadius = '6px';
                        towerType.style.fontSize = '1.1em';
                        towerType.style.margin = '8px 0';
                        towerType.style.padding = '6px 18px';
                        towerType.style.cursor = 'pointer';
                        // Preview the range circle for this tower on hover (using the clicked tile position)
                        towerType.addEventListener('mouseenter', () => {
                            this.showRangeCircle({ location: event.target.id, range: tower.range }, true);
                        });
                        towerType.addEventListener('mouseleave', () => {
                            this.showRangeCircle(null, false);
                        });
                        towerType.addEventListener("click", purchaseClick => {
                            // Prevent building if already a tower here
                            if (this.towerArray.find(t => t.location === event.target.id)) {
                                towerSeletionMenu.remove();
                                return;
                            }
                            // Safety guard: enforce placement rules
                            const pathTileNow = event.target.classList.contains('path');
                            if ((tower.key === 'firewall' && !pathTileNow) || (tower.key !== 'firewall' && pathTileNow)) {
                                towerSeletionMenu.remove();
                                return;
                            }
                            if ((this.credits - tower.price) >= 0) {
                                this.credits = this.credits - tower.price;
                                let towerName = `${tower.key}_${this.towerArray.length + 1}`;
                                this.towerArray.push(new Tower(tower.key, towerName));
                                event.target.classList.add(tower.key);
                                this.towerArray[this.towerArray.length - 1].location = event.target.id;
                                this.towerArray[this.towerArray.length - 1].targetingMode = 'first';
                                // Inject visual for the tower
                                event.target.insertAdjacentHTML('beforeend', getImageFor(tower.key, false));
                                // For structures: add HP bar UI
                                if (tower.key === 'firewall' || tower.key === 'honeypot') {
                                    const structure = this.towerArray[this.towerArray.length - 1];
                                    this.updateStructureHpUI(event.target, structure, true);
                                }
                                towerSeletionMenu.remove();
                                this.updateHUD();
                                this.getInRangePathTiles(); // recalc after build
                                // Refresh global range highlights if enabled
                                this.updateAllRangeHighlights(this.showRanges);
                                showToast(`${tower.name} deployed`);
                                // Push to undo stack
                                try { this.undoStack.push({ tileId: event.target.id, towerKey: tower.key, price: tower.price }); } catch(e){}
                            } else {
                                towerType.style.color = "red";
                            }
                        }, { once: true });
                        towerSeletionMenu.appendChild(towerType);
                    });
                    document.querySelector('#centeredDiv').appendChild(towerSeletionMenu);
                    // Position menu near the tile
                    let rect = event.target.getBoundingClientRect();
                    towerSeletionMenu.style.position = "absolute";
                    towerSeletionMenu.style.left = (rect.right + 10 + window.scrollX) + 'px';
                    towerSeletionMenu.style.top = (rect.top + window.scrollY) + 'px';
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
            }); // end mouseover listener
        }); // end forEach over tiles
    }

    towersAct() {
        try {
            // When paused, only act if stepping once
            if (this.paused && !this.stepOnce) { return; }
            // For each offensive tower (exclude structures)
            const offensiveTowers = this.towerArray.filter(t => t.key !== 'firewall' && t.key !== 'honeypot');
            offensiveTowers.forEach(tower => {
                if (!tower.inRangePathTiles || tower.inRangePathTiles.length === 0) { return; }
                const inRangeEnemies = this.enemiesArray.filter(e => e && e.hp > 0 && tower.inRangePathTiles.includes(e.location));
                if (inRangeEnemies.length === 0) { return; }
                const mode = tower.targetingMode || 'first';
                let target = null;
                if (mode === 'first') {
                    // Smallest path index
                    target = inRangeEnemies.reduce((a,b)=> (this.pathArray.indexOf(a.location) <= this.pathArray.indexOf(b.location) ? a : b));
                } else if (mode === 'last') {
                    target = inRangeEnemies.reduce((a,b)=> (this.pathArray.indexOf(a.location) >= this.pathArray.indexOf(b.location) ? a : b));
                } else if (mode === 'strongest') {
                    target = inRangeEnemies.reduce((a,b)=> (a.hp >= b.hp ? a : b));
                } else if (mode === 'closest') {
                    // Closest to this tower by Manhattan distance on grid
                    const towerPos = this.tileIdToRC(tower.location);
                    target = inRangeEnemies.reduce((a,b)=>{
                        const da = this.manhattanTo(towerPos, this.tileIdToRC(a.location));
                        const db = this.manhattanTo(towerPos, this.tileIdToRC(b.location));
                        return da <= db ? a : b;
                    });
                }
                if (!target) { return; }
                // Visual: draw a quick beam line from tower tile to target tile (non-blocking)
                try { this.showBeam(tower.location, target.location); } catch(e) { /* ignore visual errors */ }

                // Apply damage
                const dmg = Math.max(1, tower.damage);
                target.hp = Math.max(0, target.hp - dmg);

                // Update enemy HP bar if present
                const targetTile = document.getElementById(target.location);
                const enemyEl = targetTile ? targetTile.querySelector(`#${target.domId}`) : null;
                if (enemyEl) {
                    const hpFill = enemyEl.querySelector('.hp-fill');
                    if (hpFill && target.maxHp) {
                        hpFill.style.width = Math.max(0, Math.round((target.hp / target.maxHp) * 100)) + '%';
                    }
                    // Floating damage
                    this.showDamageIndicator(targetTile, dmg, false);
                    // On death, mark for cleanup (moveEnemy will finalize on next step); also remove from DOM now
                    if (target.hp <= 0) {
                        enemyEl.remove();
                    }
                }
            });
            // Consume the single step when paused
            if (this.paused) { this.stepOnce = false; }
        } catch(e){ console.log(e); }
    }

    // Pause helpers
    togglePause(){
        this.paused = !this.paused;
        showToast(this.paused ? 'Paused' : 'Resumed');
    }
    stepForward(){
        if (!this.paused) { return; }
        this.stepOnce = true;
        try { this.towersAct(); } catch(e){}
    }

    // Floating damage numbers; isStructure toggles color/style
    showDamageIndicator(tileEl, amount, isStructure = false) {
        if (!tileEl) { return; }
        const dmgEl = document.createElement('div');
        dmgEl.className = 'damage-indicator';
        dmgEl.textContent = `-${amount}`;
        dmgEl.style.position = 'absolute';
        dmgEl.style.left = '50%';
        dmgEl.style.top = '20%';
        dmgEl.style.transform = 'translate(-50%, -50%)';
        dmgEl.style.color = isStructure ? '#ff5a5a' : '#ffd400';
        dmgEl.style.fontWeight = 'bold';
        dmgEl.style.textShadow = '0 0 6px rgba(0,0,0,0.6)';
        dmgEl.style.pointerEvents = 'none';
        tileEl.appendChild(dmgEl);
        // simple rise/fade
        setTimeout(() => { dmgEl.style.top = '5%'; dmgEl.style.opacity = '0.2'; }, 10);
        setTimeout(() => dmgEl.remove(), 500);
    }

    // Create/update structure HP UI on a tile for firewall/honeypot
    updateStructureHpUI(tileEl, structure, createIfMissing = false) {
        if (!tileEl || !structure) { return; }
        let wrap = tileEl.querySelector('.structure-hp');
        if (!wrap && !createIfMissing) { return; }
        if (!wrap) {
            wrap = document.createElement('div');
            wrap.className = 'structure-hp';
            wrap.style.position = 'absolute';
            wrap.style.left = '8%';
            wrap.style.right = '8%';
            wrap.style.bottom = '6%';
            wrap.style.height = '6px';
            wrap.style.background = 'rgba(255,255,255,0.15)';
            wrap.style.border = '1px solid rgba(255,255,255,0.25)';
            wrap.style.borderRadius = '4px';
            const fill = document.createElement('div');
            fill.className = 'structure-hp-fill';
            fill.style.height = '100%';
            fill.style.width = '100%';
            fill.style.background = structure.key === 'firewall' ? '#ff3b3b' : '#ffa500';
            fill.style.borderRadius = '3px';
            wrap.appendChild(fill);
            tileEl.appendChild(wrap);
        }
        const fillEl = wrap.querySelector('.structure-hp-fill');
        if (fillEl && structure.maxHp) {
            const pct = Math.max(0, Math.round((structure.hp / structure.maxHp) * 100));
            fillEl.style.width = `${pct}%`;
        }
    }

    // Toggle range highlight on path tiles for a given tower
    highlightTowerRange(tower, on = true) {
        if (!tower || !tower.inRangePathTiles) { return; }
        tower.inRangePathTiles.forEach(id => {
            const td = document.getElementById(id);
            if (!td) { return; }
            if (on) {
                td.classList.add('range-in-path');
            } else {
                td.classList.remove('range-in-path');
                td.classList.remove('highlightCircle');
            }
        });
    }

    // Toggle ranges for all towers at once
    updateAllRangeHighlights(show = true) {
        if (!this.towerArray) { return; }
        this.getInRangePathTiles();
        this.towerArray.forEach(t => this.highlightTowerRange(t, show));
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
        console.log('new level');
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
        const panel = document.getElementById('enemyInfoPanel');
        if (!panel) { return; }
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

    // Build the grid and wire UI
    gameStart(){
        try {
            const root = document.getElementById('centeredDiv');
            if (!root) return;
            // HUD row (credits, hp, enemies left)
            let hud = document.getElementById('hudBar');
            if (!hud) {
                hud = document.createElement('div');
                hud.id = 'hudBar';
                hud.style.display = 'flex';
                hud.style.gap = '16px';
                hud.style.alignItems = 'center';
                hud.style.margin = '10px 0';
                hud.innerHTML = "<span id='credits'></span><span id='baseHP'></span><span id='enemiesLeft'></span>";
                root.appendChild(hud);
            }
            // Ensure a side-by-side container exists for the grid and the enemy legend
            let container = document.getElementById('gameBoardContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'gameBoardContainer';
                root.appendChild(container);
            }
            // Board
            if (!document.getElementById('gameBoard')){
                const table = document.createElement('table');
                table.id = 'gameBoard';
                table.style.margin = '10px auto';
                const letters = 'abcdefghij'.split('');
                this.tileArray = [];
                for (let r = 1; r <= this.gridSize; r++){
                    const tr = document.createElement('tr');
                    const rowIds = [];
                    for (let c = 0; c < this.gridSize; c++){
                        const id = `${r}${letters[c]}`;
                        const td = document.createElement('td');
                        td.id = id;
                        tr.appendChild(td);
                        rowIds.push(id);
                    }
                    table.appendChild(tr);
                    this.tileArray.push(rowIds);
                }
                container.appendChild(table);
            }
            // Enemy info panel (legend) placed beside the board
            if (!document.getElementById('enemyInfoPanel')){
                const panel = document.createElement('div');
                panel.id = 'enemyInfoPanel';
                panel.style.margin = '0';
                container.appendChild(panel);
            }
            // Controls wiring
            const speedSel = document.getElementById('speedSelect');
            if (speedSel) speedSel.onchange = () => { this.speedMultiplier = parseFloat(speedSel.value || '1') || 1; };
            const pauseBtn = document.getElementById('pauseBtn');
            if (pauseBtn) pauseBtn.onclick = () => this.togglePause();
            const muteTgl = document.getElementById('muteToggle');
            if (muteTgl) muteTgl.onchange = () => { this.mute = !!muteTgl.checked; };
            const rangesTgl = document.getElementById('showRangesToggle');
            if (rangesTgl) rangesTgl.onchange = () => { this.showRanges = !!rangesTgl.checked; this.updateAllRangeHighlights(this.showRanges); };
            const settingsBtn = document.getElementById('settingsBtn');
            if (settingsBtn) settingsBtn.onclick = () => this.openSettingsModal();

            // Initial state
            this.updateHUD();
            this.generateLevel();
            this.buildTowers();
            this.updateEnemyInfoPanel();
            this.levelStartButton();
            // Start towers firing loop
            this.startTowersLoop();
        } catch(e){ console.log(e); }
    }

    // Update HUD labels
    updateHUD(){
        try {
            const credEl = document.getElementById('credits');
            if (credEl) credEl.textContent = 'Bandwidth: ' + this.credits;
            const hpEl = document.getElementById('baseHP');
            if (hpEl) hpEl.textContent = 'Server HP: ' + this.baseHP;
        } catch(e){ console.log(e); }
    }

    updateEnemiesLeftUI(){
        try {
            const el = document.getElementById('enemiesLeft');
            if (!el) return;
            const left = Math.max(0, (this.lastWaveEnemyCount || 0) - (this.defeatedEnemies || 0));
            el.textContent = 'Enemies Left: ' + left;
        } catch(e){ console.log(e); }
    }

    // Compute in-range path tiles for each tower
    getInRangePathTiles(){
        const toRC = (id) => {
            // id format like '1a', '10j'
            try{
                const row = parseInt(id.replace(/[^0-9].*$/,'') || '0', 10);
                const letter = id.replace(/^\d+/,'').charAt(0);
                const col = letter ? (letter.charCodeAt(0) - 96) : 0; // a=>1
                return { r: row, c: col };
            } catch{ return { r:0, c:0 }; }
        };
        const dist = (a,b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
        this.towerArray.forEach(t => {
            if (!t.location) { t.giveInRangePathTiles([]); return; }
            const tRC = toRC(t.location);
            const tiles = [];
            this.pathArray.forEach(pid => {
                if (pid === 'base') return;
                const pRC = toRC(pid);
                if (dist(tRC, pRC) <= (t.range || 1)) tiles.push(pid);
            });
            t.giveInRangePathTiles(tiles);
        });
    }

    // Draw/clear a circular overlay representing a tower's range
    showRangeCircle(tower, on = true) {
        try {
            const existing = document.getElementById('rangeCircleOverlay');
            if (!on) { existing?.remove(); return; }
            if (!tower || !tower.location) { return; }
            const tile = document.getElementById(tower.location);
            const container = document.getElementById('gameBoardContainer') || document.getElementById('centeredDiv');
            if (!tile || !container) { return; }
            const tileRect = tile.getBoundingClientRect();
            const contRect = container.getBoundingClientRect();
            const tileSize = tileRect.width; // ~64px
            const radiusPx = Math.max(20, (tower.range + 0.5) * tileSize);
            const circle = existing || document.createElement('div');
            circle.id = 'rangeCircleOverlay';
            circle.className = 'range-circle-overlay';
            circle.style.position = 'absolute';
            circle.style.pointerEvents = 'none';
            const centerX = tileRect.left - contRect.left + (tileRect.width / 2) + window.scrollX;
            const centerY = tileRect.top - contRect.top + (tileRect.height / 2) + window.scrollY;
            circle.style.left = (centerX - radiusPx) + 'px';
            circle.style.top = (centerY - radiusPx) + 'px';
            circle.style.width = (radiusPx * 2) + 'px';
            circle.style.height = (radiusPx * 2) + 'px';
            container.style.position = container.style.position || 'relative';
            if (!existing) container.appendChild(circle);
        } catch(e) { console.log(e); }
    }

    // Draw a quick neon beam from one tile to another
    showBeam(fromTileId, toTileId) {
        try {
            const from = document.getElementById(fromTileId);
            const to = document.getElementById(toTileId);
            const container = document.getElementById('gameBoardContainer') || document.getElementById('centeredDiv');
            if (!from || !to || !container) return;
            const fr = from.getBoundingClientRect();
            const tr = to.getBoundingClientRect();
            const cx1 = fr.left + fr.width/2 + window.scrollX;
            const cy1 = fr.top + fr.height/2 + window.scrollY;
            const cx2 = tr.left + tr.width/2 + window.scrollX;
            const cy2 = tr.top + tr.height/2 + window.scrollY;
            const cont = container.getBoundingClientRect();
            const dx = cx2 - cx1;
            const dy = cy2 - cy1;
            const len = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            const beam = document.createElement('div');
            beam.className = 'beam-line';
            beam.style.position = 'absolute';
            beam.style.left = (cx1 - cont.left) + 'px';
            beam.style.top = (cy1 - cont.top) + 'px';
            beam.style.width = len + 'px';
            beam.style.transformOrigin = '0 50%';
            beam.style.transform = `rotate(${angle}deg)`;
            container.style.position = container.style.position || 'relative';
            container.appendChild(beam);
            setTimeout(() => beam.remove(), Math.max(120, Math.min(220, this.getEffectiveTick() * 0.7)));
        } catch(e) { console.log(e); }
    }

    // Helper to remove object from an array by identity
    removeObject(obj, arr){
        if (!arr) return;
        const i = arr.indexOf(obj);
        if (i >= 0) arr.splice(i,1);
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
    
    // Enemy Images (intentionally minimal; use emoji fallbacks for consistency)
    // No specific image files for other enemies
  };
  if (images[type]) {
    return `<img class='${isEnemy ? 'enemy-img' : 'tower-img'}' src='${images[type]}' alt='${type}'>`;
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
    return `<span class='default-img'>${fallbackEmojis[type] || emoji}</span>`;
  }
}

// --- UI Utilities ---
function ensureToastContainer(){
  let c = document.querySelector('.toast-container');
  if (!c) {
    c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}
function showToast(message, kind = 'info', timeout = 1600){
  try {
    const c = ensureToastContainer();
    const t = document.createElement('div');
    t.className = 'toast' + (kind && kind !== 'info' ? ` ${kind}` : '');
    t.textContent = String(message || '');
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0.85'; }, 10);
    setTimeout(() => { t.style.opacity = '0.4'; }, Math.max(600, timeout - 400));
    setTimeout(() => t.remove(), Math.max(800, timeout));
  } catch(e){ console.log(e); }
}
function closeOpenMenus(){
  document.querySelectorAll('#towerSeletionMenu, #towerSellMenu').forEach(el => el.remove());
  // If global range display is off, clear residual highlights
  if (!game1 || !game1.showRanges) {
    document.querySelectorAll('.range-in-path').forEach(td => td.classList.remove('range-in-path'));
  }
}

let game1 = new GameSesion();
game1.gameStart();
console.log('script loaded');

// Global keyboard shortcuts
// Space: pause/resume, .: single-step while paused, U/Ctrl+Z: undo last placement
document.addEventListener('keydown', (e) => {
  try {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') { 
      return; 
    } 
    if (!game1) { 
      return; 
    }
    if (e.key === ' ') {
      e.preventDefault();
      game1.togglePause();
    } else if (e.key === '.') {
      if (game1.paused) {
        e.preventDefault();
        game1.stepForward();
      }
    } else if (e.key === 'u' || e.key === 'U' || (e.ctrlKey && (e.key === 'z' || e.key === 'Z'))) {
      e.preventDefault();
      game1.undoLastPlacement();
    }
  } catch (err) { 
    console.log(err); 
  }
});