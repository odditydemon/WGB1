<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>World's Gate</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; background-color: #111; color: #eee; }
header, footer { background: #900; color: #fff; text-align: center; padding: 1rem 0; }
nav { background: #222; display: flex; justify-content: center; flex-wrap: wrap; }
nav a { color: #fff; padding: 1rem; text-decoration: none; cursor: pointer; }
nav a:hover { background: #444; }
.hero { background: #444; color: white; padding: 2rem; text-align: center; }
.container { max-width: 800px; margin: auto; padding: 1rem; }
.section { background: #1a1a1a; padding: 1rem; border-radius: 5px; box-shadow: 0 0 10px rgba(255,0,0,0.3); margin-bottom: 1rem; }
#inventoryPanel, #characterPanel, #questPanel { display: none; background: #222; padding: 1rem; border: 1px solid #555; border-radius: 5px; margin: 1rem 0; max-height: 200px; overflow-y: auto; }
#characterImageContainer {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 96px;
  height: 96px;
  z-index: 999;
  overflow: hidden;
}

#characterImage {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

#log { background: #000; padding: 0.5rem; height: 150px; overflow-y: auto; border: 1px solid #555; margin-top: 1rem; }
button { margin: 0.25rem; padding: 0.5rem 1rem; background-color: #900; border: none; color: white; border-radius: 4px; cursor: pointer; }
button:hover:enabled { background-color: #c00; }
button:disabled { background-color: #600; cursor: not-allowed; }
button {
  max-width: 100%;
  touch-action: manipulation;
}
input[type="text"], input[type="file"] { padding: 0.5rem; margin-top: 0.5rem; border-radius: 4px; border: none; width: 100%; max-width: 300px; font-size: 1rem; color: #111; }
.choices-container { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.group-label { margin: 1rem 0 0.5rem 0; font-weight: bold; font-size: 1.1rem; }
.screen {
  display: none;
  width: 100%;
  box-sizing: border-box;
}

.screen.active {
  display: block !important;
}

#statPreview { margin-top: 1rem; white-space: pre-line; }

html, body {
  height: 100%;
  min-height: 100%;
  overflow-x: hidden;
}



button {
  touch-action: manipulation;
}

</style>
</head>
<body>
<header>
<h1>World's Gate</h1>
<p>A Text-Based Fantasy RPG</p>
</header>

<nav>
<a onclick="resetGame()">Home</a>
<a onclick="resetGame()">New Game</a>
<a onclick="saveGame()">Save Game</a>
<a onclick="confirmLoad()">Load Game</a>
<a onclick="toggleInventory()">Inventory</a>
<a onclick="toggleCharacterPanel()">Character</a>
<a onclick="toggleQuestPanel()">Quests</a>
</nav>

<div class="hero">
<h2>World's Gate</h2>
</div>

<div class="container">

<div id="inventoryPanel">
<h3>Your Inventory</h3>
<pre id="inventoryList"></pre>
</div>

<div id="abilitiesPanel" style="display:none; background:#222; padding:1rem; border:1px solid #555; border-radius:5px; margin:1rem 0; max-height:200px; overflow-y:auto;">
<h3>Abilities</h3>
<div id="abilitiesList"></div>
</div>

<div id="characterPanel">
<h3>Character Info</h3>
<pre id="characterInfo"></pre>
<button id="levelUpBtn" onclick="levelUp()" style="display:none;">Level Up</button>
</div>

<div id="questPanel">
<h3>Active Mission</h3>
<pre id="questInfo"></pre>
<button onclick="abandonMission()">Abandon Mission</button>
</div>

<div id="characterImageContainer" style="display:none;">
<img id="characterImage" src="" alt="Character Image">
</div>

<div id="character-creation" class="screen">
<div class="section">
<div class="group-label">Enter Your Name:</div>
<input type="text" id="playerName" placeholder="Your name" oninput="checkCharacterCreation()">
<div class="group-label">Select Your Gender:</div>
<div id="genderChoices" class="choices-container"></div>
<div class="group-label">Upload Character Image:</div>
<input type="file" id="characterImageInput" accept="image/*">
<div class="group-label">Roll Your Race (Max 10 Rolls):</div>
<button id="rollRaceBtn" onclick="rollRace()">Roll Race</button>
<div id="rolledRace"></div>
<div class="group-label">Select Your Class:</div>
<div id="classChoices" class="choices-container"></div>
<div id="statPreview"></div>
<button id="startGameBtn" disabled onclick="startGame()">Start Game</button>
</div>
</div>

<div id="path-selection" class="screen">
<div class="section">
<h3>Choose Your Path</h3>
<p>Welcome to Murim, a peaceful village surrounded by ancient forests and mysterious ruins.</p>
<button onclick="enterMurim()">Confirm Murim</button>
</div>
</div>

<div id="murim-village" class="screen">
<div class="section">
<h3>Murim Village</h3>
<button onclick="visitMerchant()">Visit Merchant</button>
<button onclick="goForest()">Go to the Woods</button>
<button onclick="visitHuntersGuild()">Hunters Guild</button>
<button id="warpGateBtn" onclick="tryWarpToAlliance()">Warp Gate to Murim Alliance (8,000g)</button>
<button onclick="openTravelToAlliance()">Travel</button>
<button onclick="goBack()">Back</button>
<div id="murimOutput"></div>
</div>
</div>

<div id="merchant" class="screen">
<div class="section">
<h3>Merchant</h3>
<button onclick="buyItem('Potion')">Buy Potion (50 gold)</button>
<button onclick="buyItem('Fire Scroll')">Buy Fire Scroll (50 gold)</button>
<div id="merchantEquipment"></div>
<button onclick="goBack()">Back</button>
</div>
</div>

<div id="hunters-guild" class="screen">
<div class="section">
<h3>Hunters Guild</h3>
<button onclick="applyHunter()">Register as Hunter</button>
<button onclick="showMissionBoard()">Mission Board</button>
<button onclick="checkHunterRank()">Check Rank</button>
<button id="rankUpBtn" style="display:none;" onclick="rankUp()">Rank Up</button>
<div id="guildOutput"></div>
<button onclick="goBack()">Back</button>
</div>
</div>

<div id="forest" class="screen">
<div class="section">
<h3>Forest</h3>
<button onclick="exploreForest()">Explore</button>
<button onclick="goBack()">Back</button>
<div id="forestOutput"></div>
</div>
</div>

<div id="travel-alliance" class="screen">
<div class="section">
<h3>Road to Murim Alliance</h3>
<p>The road is long and dangerous.</p>
<button onclick="travelToAlliance()">Travel</button>
<button onclick="goBack()">Back</button>
<div id="travelAllianceOutput"></div>
</div>
</div>

<div id="travel-village" class="screen">
<div class="section">
<h3>Road to Murim Village</h3>
<p>The return road stretches far across the land.</p>
<button onclick="travelToVillage()">Travel</button>
<button onclick="goBack()">Back</button>
<div id="travelVillageOutput"></div>
</div>
</div>

<div id="murim-alliance" class="screen">
  <div class="section">
    <h3>Murim Alliance City</h3>
    <p>A bustling stronghold filled with elite warriors and powerful merchants.</p>
    <button onclick="visitAllianceGuild()">Hunters Guild HG</button>
    <button onclick="visitDivineSupply()">Divine Supply</button>
    <button onclick="enterVoidGate()">Void Gate (Locked)</button>
    <button onclick="goBackToMurim()">Use Warp Gate (8,000g)</button>
    <button onclick="openTravelToVillage()">Travel</button>
    <button onclick="enterGateSelection()">Gates</button>
    <div id="allianceOutput"></div>
  </div>
</div>

<div id="alliance-guild" class="screen">
  <div class="section">
    <h3>Hunters Guild HG</h3>
    <button onclick="showAllianceMissionBoard()">Mission Board</button>
    <button onclick="checkHunterRank()">Check Rank</button>
    <button id="allianceRankUpBtn" style="display:none;" onclick="rankUp()">Rank Up</button>
    <button onclick="goBack()">Back</button>
    <div id="allianceGuildOutput"></div>
  </div>
</div>

<div id="divine-supply" class="screen">
  <div class="section">
    <h3>Divine Supply</h3>
    <button onclick="buyItem('Potion')">Buy Potion (50 gold)</button>
    <button onclick="buyItem('Fire Scroll')">Buy Fire Scroll (50 gold)</button>
    <button onclick="goBack()">Back</button>
  </div>
</div>

<div id="void-gate" class="screen">
  <div class="section">
    <h3>Void Gate</h3>
    <p>This feature is not yet accessible. Return here in a future update to face the 200-floor challenge.</p>
    <button onclick="goBack()">Back</button>
  </div>
</div>

<div id="gate-selection" class="screen">
  <div class="section">
    <h3>Select a Gate</h3>
    <button id="hornedRabbitGateBtn" onclick="enterHornedRabbitGate()">E Rank Horned Rabbits</button>
    <button onclick="goBack()">Back</button>
    <div id="gateSelectionOutput"></div>
  </div>
</div>

<div id="combat" class="screen">
<div class="section">
<h3>Combat</h3>
<p id="combatStatus"></p>
<button onclick="playerAttack()">Attack</button>
<button onclick="playerDefend()">Defend</button>
<button onclick="playerRun()">Run</button>
<button onclick="showAbilities()">Abilities</button>
</div>
</div>

<div id="boss-combat" class="screen">
<div class="section">
<h3 style="color: red;">BOSS FIGHT <span style="color: blue;">[BOSS]</span></h3>
<p id="bossCombatStatus"></p>
<button onclick="playerBossAttack()">Attack</button>
<button onclick="playerDefend()">Defend</button>
<button onclick="showAbilities()">Abilities</button>
<button onclick="playerBossRun()">Run</button>
</div>
</div>

<div id="log"></div>

</div>

<footer>
<p>© 2025 World's Gate. All rights reserved.</p>
</footer>

<script>
const rankThresholds = {
E: 500,
D: 1000,
C: 2000,
B: 4000,
A: 8000,
S: null // max rank
};

const classes = {
  Warrior: { 
    hp: 120, mp: 10, attack: 15, defense: 10, speed: 5, magic: 0, 
    inventory: ["Potion"], 
    ability: "Power Strike" 
  },

  Mage: { 
    hp: 70, mp: 50, attack: 5, defense: 5, speed: 6, magic: 20, 
    inventory: ["Fire Scroll"], 
    ability: "Fireball" 
  },

  Rogue: {
    hp: 90,
    mp: 20,
    attack: 10,
    defense: 8,
    speed: 15,
    magic: 5,
    inventory: ["Potion"],

    ability: "Shadow Strike",

    abilities: [
      { name: "Backstab", mpCost: 5, effect: "damage", multiplier: 2.0, unlockLevel: 1 },
      { name: "Quick Step", mpCost: 8, effect: "speed", bonus: 5, turns: 3, unlockLevel: 5 },
      { name: "Shadow Veil", mpCost: 10, effect: "evasion", bonus: 100, turns: 1, unlockLevel: 10 }
    ]
  }
};

const races = {
Human: { rarity: "Common", chance: 50, mods: { hp: 0, mp: 0, attack: 0, defense: 0, speed: 0, magic: 0 }},
Elf: { rarity: "Uncommon", chance: 20, mods: { hp: -5, mp: 10, attack: 0, defense: 0, speed: 5, magic: 10 }},
Dwarf: { rarity: "Rare", chance: 10, mods: { hp: 10, mp: 0, attack: 5, defense: 10, speed: -5, magic: 0 }},
Orc: { rarity: "Rare", chance: 10, mods: { hp: 15, mp: 0, attack: 10, defense: 5, speed: -5, magic: -5 }},
Dragon: { rarity: "Epic", chance: 5, mods: { hp: 20, mp: 20, attack: 10, defense: 10, speed: 5, magic: 10 }},
Angel: { rarity: "Legendary", chance: 4, mods: { hp: 25, mp: 25, attack: 5, defense: 15, speed: 5, magic: 15 }},
Demon: { rarity: "Mythic", chance: 1, mods: { hp: 30, mp: 30, attack: 15, defense: 10, speed: 10, magic: 20 }}
};

const monsters = {
Slime: {
level: 1,
hp: 65,
mp: 10,
attack: 9,
defense: 6,
speed: 12,
magic: 2,
xp: 20,
gold: 12
},
Rat: {
level: 2,
hp: 72,
mp: 12,
attack: 11,
defense: 7,
speed: 14,
magic: 2,
xp: 30,
gold: 18
},
Snake: {
level: 4,
hp: 88,
mp: 16,
attack: 15,
defense: 10,
speed: 16,
magic: 4,
xp: 50,
gold: 28
},
Hawk: {
level: 6,
hp: 104,
mp: 20,
attack: 19,
defense: 13,
speed: 18,
magic: 5,
xp: 75,
gold: 40
},
"Baby Wyvern": {
level: 10,
hp: 136,
mp: 28,
attack: 27,
defense: 19,
speed: 17,
magic: 8,
xp: 130,
gold: 70
}
};

const travelBandits = {
Bandit: { level: 11, xp: 150, gold: 100 },
"Bandit Vet": { level: 13, xp: 200, gold: 200 },
"Bandit Chief": { level: 20, xp: 400, gold: 300 }
};

function getOrcWarriorStats(level) {
const base = getCombinedStats("Orc", "Warrior");
const levelBoost = level - 1;

return {
level: level,
hp: base.hp + (levelBoost * 10),
maxHp: base.hp + (levelBoost * 10),
mp: base.mp + (levelBoost * 5),
maxMp: base.mp + (levelBoost * 5),
attack: base.attack + (levelBoost * 2),
defense: base.defense + (levelBoost * 2),
speed: base.speed,
magic: base.magic
};
}

function startTravelBanditFight(name) {
const rewardData = travelBandits[name];
const stats = getOrcWarriorStats(rewardData.level);

currentMonster = {
name: name,
...stats,
xp: rewardData.xp,
gold: rewardData.gold,
isTravelEnemy: true
};

log(`A Level ${currentMonster.level} ${name} attacks you on the road!`);
showScreen("combat");
updateCombat();
}

function handleTravelHazard() {
const roll = Math.random() * 100;

if (roll < 50) {
startTravelBanditFight("Bandit");
return true;
}

if (roll < 80) {
startTravelBanditFight("Bandit Vet");
return true;
}

if (roll < 85) {
startTravelBanditFight("Bandit Chief");
return true;
}

if (roll < 95) {
const goldFound = Math.floor(Math.random() * 100) + 1;
player.gold += goldFound;
log(`You find ${goldFound} gold on the road.`);
updateCharacterPanel();
updateInventory();
updateWarpButton();
updateAllianceWarpButton();
return false;
}

player.hp = Math.max(0, player.hp - 15);
log(`An arrow strikes you from the roadside! You lose 15 HP.`);
updateCharacterPanel();
return false;
}

const equipmentItems = {
"Training Sword": { type: "weapon", class: "Warrior", attack: 5, price: 1000 },
"Bronze Greatsword": { type: "weapon", class: "Warrior", attack: 8, price: 1500 },

"Apprentice Staff": { type: "weapon", class: "Mage", magic: 5, price: 1000 },
"Oak Staff": { type: "weapon", class: "Mage", magic: 8, price: 1500 },

"Rusty Daggers": { type: "weapon", class: "Rogue", attack: 4, speed: 2, price: 1000 },
"Twin Daggers": { type: "weapon", class: "Rogue", attack: 6, speed: 3, price: 1500 },

"Leather Armor": { type: "armor", class: "Warrior", defense: 4, price: 1000 },
"Chain Vest": { type: "armor", class: "Warrior", defense: 6, price: 1500 },

"Mana Robe": { type: "armor", class: "Mage", defense: 2, mp: 10, price: 1000 },
"Enchanted Robe": { type: "armor", class: "Mage", defense: 3, mp: 15, price: 1500 },

"Shadow Cloak": { type: "armor", class: "Rogue", defense: 3, speed: 2, price: 1000 },
"Silent Cloak": { type: "armor", class: "Rogue", defense: 4, speed: 3, price: 1500 }
};

const bosses = {
E: { name: "Adult Wyvern", hp: 200, mp: 50, attack: 25, abilities: ["Flame Breath"] },
D: { name: "Fox Spirit", hp: 300, mp: 60, attack: 35, abilities: ["Fox Fire", "Tail Swipe"] },
C: { name: "Cheon Ma", hp: 400, mp: 80, attack: 50, abilities: ["Sword Energy", "Sword Rain", "Sword Strike"] },
B: { name: "Jin Mu", hp: 550, mp: 100, attack: 70, abilities: ["Enhanced Energy Press", "Buddha Palm"] },
A: { name: "Amir", hp: 700, mp: 120, attack: 90, abilities: ["Wolf Pack Barrage", "Attack Boost 4"] },
S: { name: "Janiece B", hp: 900, mp: 150, attack: 110, abilities: ["Absolute Rule", "Bow!"] },
};

const missions = [
{ name: "Hunt 3 Slimes", target: "Slime", count: 3, rewardXP: 50, rewardGold: 100 },
{ name: "Hunt 2 Snakes", target: "Snake", count: 2, rewardXP: 80, rewardGold: 150 },
{ name: "Hunt 1 Baby Wyvern", target: "Baby Wyvern", count: 1, rewardXP: 200, rewardGold: 300 }
];

const genders = ["Male", "Female", "Other"];
const charSelection = { name: "", gender: null, race: null, class: null };
let player = null, currentMonster = null, activeMission = null, missionProgress = 0;
let characterImageData = "";
let raceRollsLeft = 10, backStack = [], logLines = [];
let travelProgressToAlliance = 0, travelProgressToVillage = 0;
let currentTravelRoute = null;

function getCombinedStats(r, c) {
const rM = races[r]?.mods || {}, cS = classes[c] || {}, f = {};
for (let s of ["hp", "mp", "attack", "defense", "speed", "magic"])
f[s] = Math.min(Math.max((cS[s] || 0) + (rM[s] || 0), 0), 999);
return f;
}

function updateStatDisplay() {
const { race, class: c } = charSelection;
if (!race || !c) {
  document.getElementById("statPreview").textContent = "";
  return;
}

const s = getCombinedStats(race, c), r = races[race].rarity;

document.getElementById("statPreview").textContent =
`Race: ${race} (${r})
HP: ${s.hp}
MP: ${s.mp}
Attack: ${s.attack}
Defense: ${s.defense}
Speed: ${s.speed}
Magic: ${s.magic}`;
}

function checkCharacterCreation() {
charSelection.name = document.getElementById("playerName").value.trim();
const ready = charSelection.name && charSelection.gender && charSelection.race && charSelection.class;
document.getElementById("startGameBtn").disabled = !ready;
updateStatDisplay();
}

function createSelectionButtons(options, containerId, category) {
const c = document.getElementById(containerId);
c.innerHTML = "";
options.forEach(opt => {
const b = document.createElement("button");
b.textContent = opt;
b.onclick = () => {
charSelection[category] = opt;
[...c.children].forEach(bt => bt.disabled = false);
b.disabled = true;
checkCharacterCreation();
};
c.appendChild(b);
});
}

function rollRace() {
if (raceRollsLeft <= 0) return;
let r = Math.random() * 100, sum = 0;
for (let [race, info] of Object.entries(races)) {
sum += info.chance;
if (r <= sum) { charSelection.race = race; break; }
}
raceRollsLeft--;
document.getElementById("rolledRace").textContent =
`You rolled: ${charSelection.race} (${races[charSelection.race].rarity}) | Rolls left: ${raceRollsLeft}`;
if (raceRollsLeft === 0) document.getElementById("rollRaceBtn").disabled = true;
checkCharacterCreation();
}

function startGame() {
const s = getCombinedStats(charSelection.race, charSelection.class), c = classes[charSelection.class];
player = {
name: charSelection.name, gender: charSelection.gender, race: charSelection.race, class: charSelection.class,
...s, maxHp: s.hp, maxMp: s.mp, xp: 0, gold: 0, level: 1, inventory: [...c.inventory], ability: c.ability,
equipment: {
weapon: null,
armor: null
},
dodgeUsed: false, hunterRank: null, subclass: null, // placeholder for future
abilities:
charSelection.class === "Warrior"
? [
{ name: "Power Strike", mpCost: 5, effect: "damage", multiplier: 1.5, unlockLevel: 1 },
{ name: "Shield Bash", mpCost: 8, effect: "damage", multiplier: 1.8, unlockLevel: 5 },
{ name: "Guard Up", mpCost: 10, effect: "defense", bonus: 5, turns: 3, unlockLevel: 10 }
]
: c.abilities
? [...c.abilities]
: [],
defenseBuff: 0,
defenseBuffTurns: 0,
};
if (charSelection.class === "Mage") {
player.abilities = [
{ name: "Fireball", mpCost: 8, effect: "damage", multiplier: 1.5, unlockLevel: 1 },
{ name: "Ice Shard", mpCost: 10, effect: "damage_slow", multiplier: 1.3, unlockLevel: 5 },
{ name: "Magic Shield", mpCost: 12, effect: "defense", bonus: 5, turns: 3, unlockLevel: 10 }
];
}
activeMission = null; missionProgress = 0;
travelProgressToAlliance = 0;
travelProgressToVillage = 0;
backStack = ["path-selection"]; // reset stack cleanly to first screen
showScreen("path-selection");
}

function showScreen(id) {
  const skipStackScreens = ["combat", "boss-combat", "character-creation"];

  // Back stack logic (unchanged)
  if (!skipStackScreens.includes(id)) {
    if (backStack.length === 0 || backStack[backStack.length - 1] !== id) {
      backStack.push(id);
    }
  }

  // ✅ HIDE ALL SCREENS AND REMOVE ACTIVE
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
  });
  
  const screen = document.getElementById(id);
  if (!screen) return;

  screen.style.display = "block";
  screen.classList.add("active");

  // Update warp button if needed
  if (id === "murim-village") {
    updateWarpButton();
  }
}

function visitHuntersGuild() { showScreen("hunters-guild"); }

function tryWarpToAlliance() {
if (!player) return;

if (player.level < 10) {
log(`"You must be level 10 or higher to use the Warp Gate."`);
return;
}

if (player.gold < 8000) {
log(`"You need 8,000 gold to use the Warp Gate."`);
return;
}

player.gold -= 8000;
log(`"You activate the Warp Gate and are transported to the Murim Alliance!"`);
updateCharacterPanel();
updateInventory();
updateWarpButton();
updateAllianceWarpButton();
showScreen("murim-alliance");
}

function goBackToMurim() {
if (!player) return;

if (player.level < 10) {
log(`"You must be level 10 or higher to use the Warp Gate."`);
return;
}

if (player.gold < 8000) {
log(`"You need 8,000 gold to use the Warp Gate."`);
return;
}

player.gold -= 8000;
log(`"You warp back to Murim Village through the shimmering gate."`);
updateCharacterPanel();
updateInventory();
updateWarpButton();
updateAllianceWarpButton();
showScreen("murim-village");
}

function travelToAlliance() {
if (!player) return;

currentTravelRoute = "alliance";
travelProgressToAlliance++;

document.getElementById("travelAllianceOutput").innerHTML =
`Travel Progress: ${travelProgressToAlliance}/15`;

log(`You travel toward Murim Alliance. (${travelProgressToAlliance}/15)`);

if (handleTravelHazard()) {
return;
}

if (travelProgressToAlliance >= 15) {
travelProgressToAlliance = 0;
travelProgressToVillage = 0;
document.getElementById("travelAllianceOutput").innerHTML = "";
log(`You arrive at Murim Alliance.`);
currentTravelRoute = null;
showScreen("murim-alliance");
}
}

function travelToVillage() {
if (!player) return;

currentTravelRoute = "village";
travelProgressToVillage++;

document.getElementById("travelVillageOutput").innerHTML =
`Travel Progress: ${travelProgressToVillage}/15`;

log(`You travel toward Murim Village. (${travelProgressToVillage}/15)`);

if (handleTravelHazard()) {
return;
}

if (travelProgressToVillage >= 15) {
travelProgressToVillage = 0;
travelProgressToAlliance = 0;
document.getElementById("travelVillageOutput").innerHTML = "";
log(`You arrive at Murim Village.`);
currentTravelRoute = null;
showScreen("murim-village");
}
}

function openTravelToAlliance() {
showScreen("travel-alliance");
document.getElementById("travelAllianceOutput").innerHTML =
travelProgressToAlliance > 0 ? `Travel Progress: ${travelProgressToAlliance}/15` : "";
}

function openTravelToVillage() {
showScreen("travel-village");
document.getElementById("travelVillageOutput").innerHTML =
travelProgressToVillage > 0 ? `Travel Progress: ${travelProgressToVillage}/15` : "";
}

function equipItem(itemName) {
const item = equipmentItems[itemName];
if (!item) return;

if (item.class && item.class !== player.class) {
log(`"${itemName} cannot be equipped by your class."`);
return;
}

if (item.type === "weapon") {
player.equipment.weapon = itemName;
}

if (item.type === "armor") {
player.equipment.armor = itemName;
}

log(`Equipped ${itemName}.`);
updateCharacterPanel();
updateInventory();
}

function buyEquipment(itemName) {
const item = equipmentItems[itemName];
if (!item) return;

if (player.gold < item.price) {
log(`"Not enough gold!"`);
return;
}

player.gold -= item.price;
player.inventory.push(itemName);
log(`Bought ${itemName}.`);
updateInventory();
updateCharacterPanel();
updateWarpButton();
updateAllianceWarpButton();
}

function applyHunter() {
if (!player.hunterRank) {
player.hunterRank = "E";
log(`"You registered as an E-rank Hunter!"`);
updateCharacterPanel();
} else log(`"You are already a registered Hunter."`);
}

function showMissionBoard() {
if (!player.hunterRank) return log(`"You must register as a Hunter first."`);

let board = missions.map((m, i) =>
`<button onclick="acceptMission(${i})">${m.name}</button>`
).join("<br>");

board += `<br><button onclick="closeMissionBoard()">Close Board</button>`;

document.getElementById("guildOutput").innerHTML = board;
}

function acceptMission(i) {
if (activeMission) return log(`"You already have an active mission."`);
activeMission = missions[i];
missionProgress = 0;
log(`Accepted mission: ${activeMission.name}`);
updateQuestPanel();
}

function abandonMission() {
if (activeMission) {
log(`Abandoned mission: ${activeMission.name}`);
activeMission = null; missionProgress = 0;
updateQuestPanel();
}
}

function updateQuestPanel() {
if (activeMission) {
document.getElementById("questInfo").textContent =
`${activeMission.name}
Progress: ${missionProgress}/${activeMission.count}`;
} else {
document.getElementById("questInfo").textContent = "No active mission.";
}
}

function buyItem(item) {
if (player.gold >= 50) {
player.gold -= 50;
player.inventory.push(item);
log(`Bought ${item}.`);
updateInventory();
updateCharacterPanel();
updateWarpButton();
updateAllianceWarpButton();
} else {
log(`"Not enough gold!"`);
}
}

function getTotalAttack() {
let total = player.attack;

if (player.equipment.weapon) {
const weapon = equipmentItems[player.equipment.weapon];
if (weapon && weapon.attack) total += weapon.attack;
}

return total;
}

function getTotalDefense() {
let total = player.defense;

if (player.equipment.armor) {
const armor = equipmentItems[player.equipment.armor];
if (armor && armor.defense) total += armor.defense;
}

return total;
}

function getTotalMagic() {
let total = player.magic;

if (player.equipment.weapon) {
const weapon = equipmentItems[player.equipment.weapon];
if (weapon && weapon.magic) total += weapon.magic;
}

return total;
}

function getTotalSpeed() {
let total = player.speed;

if (player.equipment.weapon) {
const weapon = equipmentItems[player.equipment.weapon];
if (weapon && weapon.speed) total += weapon.speed;
}

if (player.equipment.armor) {
const armor = equipmentItems[player.equipment.armor];
if (armor && armor.speed) total += armor.speed;
}

return total;
}

function getTotalMp() {
let total = player.maxMp;

if (player.equipment.armor) {
const armor = equipmentItems[player.equipment.armor];
if (armor && armor.mp) total += armor.mp;
}

return total;
}

function goForest() { showScreen("forest"); }

function exploreForest() {
const r = Math.random();

if (r < 0.55) {
const mNames = Object.keys(monsters);
const m = mNames[Math.floor(Math.random() * mNames.length)];
currentMonster = {
...monsters[m],
name: m,
hp: monsters[m].hp,
maxHp: monsters[m].hp,
mp: monsters[m].mp,
maxMp: monsters[m].mp
};
log(`A wild Level ${currentMonster.level} ${m} appears!`);
showScreen("combat");
updateCombat();
} else if (r < 0.8) {
const gold = Math.floor(Math.random() * 20) + 10;
player.gold += gold;
log(`You found ${gold} gold!`);
updateCharacterPanel();
updateInventory();
updateWarpButton();
updateAllianceWarpButton();
} else {
log(`"The forest is quiet..."`);
}
}

function goBack() {
const currentScreen = backStack[backStack.length - 1];

if (currentScreen === "travel-alliance" || currentScreen === "travel-village") {
log(`You cannot go back while traveling.`);
return;
}

if (backStack.length > 1) {
backStack.pop();
const last = backStack[backStack.length - 1];
showScreen(last);
}
}

function log(msg) {
logLines.push(msg);
if (logLines.length > 100) logLines.shift();
const logDiv = document.getElementById("log");
logDiv.innerHTML = logLines.join("<br>");
logDiv.scrollTop = logDiv.scrollHeight; // auto-scroll to bottom
}

function enterMurim() {
  updateWarpButton();
  showScreen("murim-village");
}

function updateWarpButton() {
const btn = document.getElementById("warpGateBtn");
if (!btn) return;

const canWarp = !!player && player.level >= 10 && player.gold >= 8000;
btn.disabled = !canWarp;
btn.style.opacity = canWarp ? 1 : 0.5;
}

function updateAllianceWarpButton() {
const btn = document.querySelector('#murim-alliance button[onclick="goBackToMurim()"]');
if (!btn) return;

const canWarp = !!player && player.level >= 10 && player.gold >= 8000;
btn.disabled = !canWarp;
btn.style.opacity = canWarp ? 1 : 0.5;
}

function visitMerchant() {
const merchantDiv = document.getElementById("merchantEquipment");
merchantDiv.innerHTML = "";

for (const [itemName, itemData] of Object.entries(equipmentItems)) {
if (itemData.class === player.class) {
merchantDiv.innerHTML += `<button onclick="buyEquipment('${itemName}')">Buy ${itemName} (${itemData.price} gold)</button><br>`;
}
}

showScreen("merchant");
}

function startBossFight(rank) {
const bossData = bosses[rank];
if (!bossData) {
log(`Error: Boss "${rank}" not found.`);
return;
}

currentMonster = {
name: bossData.name,
hp: bossData.hp,
maxHp: bossData.hp,
mp: bossData.mp,
maxMp: bossData.mp,
attack: bossData.attack,
abilities: bossData.abilities,
isBoss: true
};

log(`⚠️ A powerful foe approaches: ${currentMonster.name}!`);
showScreen("boss-combat");
updateCombat();
}


function updateCombat() {
if (!player || !currentMonster) return;

player.hp = Math.max(0, player.hp);
currentMonster.hp = Math.max(0, currentMonster.hp);

const enemyLabel = currentMonster.isBoss
? `<span style="color:red;">${currentMonster.name}</span> <span style="color:blue;">[Boss]</span>`
: `Lv ${currentMonster.level} ${currentMonster.name}`;

const displayText = `${player.name} HP: ${player.hp}/${player.maxHp} | MP: ${player.mp}/${getTotalMp()}<br>
vs ${enemyLabel} HP: ${currentMonster.hp}/${currentMonster.maxHp}`;

if (currentMonster.isBoss) {
document.getElementById("bossCombatStatus").innerHTML = displayText;
} else {
document.getElementById("combatStatus").innerHTML = displayText;
}
}

function playerAttack() {
let dmg = getTotalAttack() - (currentMonster.defense || 0);
dmg = Math.max(2, dmg);

if (Math.random() < 0.1) {
dmg = Math.floor(dmg * 1.5);
log(`"Critical hit!"`);
}

currentMonster.hp -= dmg;
log(`You hit ${currentMonster.name} for ${dmg} damage.`);

updateCombat();
updateCharacterPanel();

if (currentMonster.hp <= 0) {
winCombat();
return;
}

if (currentMonster.isBoss) {
bossTurn();
} else {
monsterTurn();
}
}

function playerBossAttack() {
let dmg = getTotalAttack() - (currentMonster.defense || 0);
dmg = Math.max(2, dmg);

if (Math.random() < 0.1) {
dmg = Math.floor(dmg * 1.5);
log(`"Critical hit!"`);
}

currentMonster.hp -= dmg;
log(`You hit ${currentMonster.name} for ${dmg} damage.`);

if (currentMonster.hp <= 0) {
winBossFight();
} else {
updateCombat();
bossTurn();
}
}

function playerDefend() {
player.dodgeUsed = true;
log(`"You brace for the attack."`);

if (currentMonster && currentMonster.isBoss) {
bossTurn();
} else {
monsterTurn();
}
}

function playerRun() {
log(`"You fled the battle."`);

if (currentMonster && currentMonster.isTravelEnemy) {
currentMonster = null;

if (currentTravelRoute === "alliance") {
if (travelProgressToAlliance >= 15) {
travelProgressToAlliance = 0;
travelProgressToVillage = 0;
document.getElementById("travelAllianceOutput").innerHTML = "";
currentTravelRoute = null;
log(`You arrive at Murim Alliance.`);
showScreen("murim-alliance");
} else {
showScreen("travel-alliance");
document.getElementById("travelAllianceOutput").innerHTML =
`Travel Progress: ${travelProgressToAlliance}/15`;
}
return;
}

if (currentTravelRoute === "village") {
if (travelProgressToVillage >= 15) {
travelProgressToVillage = 0;
travelProgressToAlliance = 0;
document.getElementById("travelVillageOutput").innerHTML = "";
currentTravelRoute = null;
log(`You arrive at Murim Village.`);
showScreen("murim-village");
} else {
showScreen("travel-village");
document.getElementById("travelVillageOutput").innerHTML =
`Travel Progress: ${travelProgressToVillage}/15`;
}
return;
}
}

showScreen("forest");
}

function monsterTurn() {
let dmg = currentMonster.attack + Math.floor((currentMonster.level || 1) / 2) - Math.floor(getTotalDefense() * 0.6);
dmg = Math.max(2, dmg);

if (player.dodgeUsed) dmg = Math.floor(dmg / 2);
dmg = Math.max(1, dmg);

if (player.defenseBuff > 0) {
dmg = Math.max(1, dmg - player.defenseBuff);
}

player.hp -= dmg;
player.hp = Math.max(0, player.hp);

log(`Level ${currentMonster.level} ${currentMonster.name} hits you for ${dmg} damage.`);

if (player.defenseBuffTurns > 0) {
player.defenseBuffTurns--;
if (player.defenseBuffTurns === 0) {
player.defenseBuff = 0;
log(`"Your defense buff has worn off."`);
}
}

player.dodgeUsed = false;

if (player.hp <= 0) {
player.hp = player.maxHp;
player.mp = player.maxMp;
activeMission = null;
missionProgress = 0;
currentMonster = null;
updateQuestPanel();
updateCharacterPanel();
log(`"You were defeated. You recover and return to safety."`);

const returnScreen = backStack[backStack.length - 1];
if (returnScreen === "alliance-guild") {
showScreen("alliance-guild");
} else {
showScreen("hunters-guild");
}
} else {
updateCombat();
updateCharacterPanel();
}
}

function bossTurn() {
if (!currentMonster) return;
if (currentMonster.hp <= 0) return;

let usedAbility = false;
let dmg = 0;

if (currentMonster.mp >= 20 && Math.random() < 0.5) {
const ability = currentMonster.abilities[Math.floor(Math.random() * currentMonster.abilities.length)];
currentMonster.mp -= 20;

switch (ability) {
case "Flame Breath":
case "Fox Fire":
case "Sword Energy":
case "Sword Rain":
case "Sword Strike":
case "Enhanced Energy Press":
case "Buddha Palm":
case "Wolf Pack Barrage":
case "Bow!":
dmg = Math.floor(currentMonster.attack * 1.8) + Math.floor((currentMonster.level || 1) / 2) - Math.floor(getTotalDefense() * 0.6);
dmg = Math.max(2, dmg);
log(`${currentMonster.name} used ${ability}! It deals ${dmg} damage!`);
break;

case "Attack Boost 4":
currentMonster.attack *= 2;
log(`${currentMonster.name} used Attack Boost 4! Next attack will be devastating!`);
usedAbility = true;
break;

case "Absolute Rule":
player.defenseBuff = 0;
player.dodgeUsed = false;
log(`${currentMonster.name} used Absolute Rule! All buffs and debuffs are nullified!`);
usedAbility = true;
break;

default:
dmg = currentMonster.attack + Math.floor((currentMonster.level || 1) / 2) - Math.floor(getTotalDefense() * 0.6);
dmg = Math.max(2, dmg);
log(`${currentMonster.name} attacks!`);
}
} else {
dmg = currentMonster.attack + Math.floor((currentMonster.level || 1) / 2) - Math.floor(getTotalDefense() * 0.6);
dmg = Math.max(2, dmg);
log(`${currentMonster.name} attacks!`);
}

if (!usedAbility) {
player.hp -= dmg;
}

player.hp = Math.max(0, player.hp);

if (player.hp <= 0) {
player.hp = player.maxHp;
player.mp = player.maxMp;
activeMission = null;
missionProgress = 0;
currentMonster = null;
updateQuestPanel();
updateCharacterPanel();
log(`"You were defeated by the boss. You recover and return to safety."`);

const returnScreen = backStack[backStack.length - 1];
if (returnScreen === "alliance-guild") {
showScreen("alliance-guild");
} else {
showScreen("hunters-guild");
}
} else {
updateCombat();
updateCharacterPanel();
}
}

function playerBossRun() {
log(`"You can't run from a boss!"`);
}

function winBossFight() {
const nextRank = getNextHunterRank(player.hunterRank);
player.gold += player.level * 100;

document.getElementById("abilitiesPanel").style.display = "none";

if (nextRank) {
player.hunterRank = nextRank;
log(`You defeated ${currentMonster.name}! Promoted to ${nextRank}-Rank and earned ${player.level * 100} gold`);
} else {
log(`You defeated ${currentMonster.name}! You've reached max S-Rank!`);
}

currentMonster = null;
updateCharacterPanel();
showScreen("hunters-guild");
}

function winCombat() {
const xp = currentMonster.xp || 0;
const gold = currentMonster.gold || 0;
const defeatedTravelEnemy = currentMonster.isTravelEnemy;

player.xp += xp;
player.gold += gold;

log(`Defeated Level ${currentMonster.level} ${currentMonster.name}! Gained ${xp} XP and ${gold} gold.`);

document.getElementById("abilitiesPanel").style.display = "none";

if (activeMission && currentMonster.name === activeMission.target) {
missionProgress++;
log(`Mission progress: ${missionProgress}/${activeMission.count}`);

if (missionProgress >= activeMission.count) {
player.xp += activeMission.rewardXP;
player.gold += activeMission.rewardGold;
log(`Mission complete: ${activeMission.name}! Gained ${activeMission.rewardXP} XP and ${activeMission.rewardGold} gold.`);
activeMission = null;
missionProgress = 0;
}

updateQuestPanel();
}

currentMonster = null;
checkLevelUp();
updateWarpButton();
updateAllianceWarpButton();
updateCharacterPanel();
updateInventory();

if (defeatedTravelEnemy) {
if (currentTravelRoute === "alliance") {
if (travelProgressToAlliance >= 15) {
travelProgressToAlliance = 0;
travelProgressToVillage = 0;
document.getElementById("travelAllianceOutput").innerHTML = "";
currentTravelRoute = null;
log(`You arrive at Murim Alliance.`);
showScreen("murim-alliance");
} else {
showScreen("travel-alliance");
document.getElementById("travelAllianceOutput").innerHTML =
`Travel Progress: ${travelProgressToAlliance}/15`;
}
return;
}

if (currentTravelRoute === "village") {
if (travelProgressToVillage >= 15) {
travelProgressToVillage = 0;
travelProgressToAlliance = 0;
document.getElementById("travelVillageOutput").innerHTML = "";
currentTravelRoute = null;
log(`You arrive at Murim Village.`);
showScreen("murim-village");
} else {
showScreen("travel-village");
document.getElementById("travelVillageOutput").innerHTML =
`Travel Progress: ${travelProgressToVillage}/15`;
}
return;
}
}

showScreen("forest");
}

function checkLevelUp() {
const need = player.level * 100;
if (player.xp >= need && player.level < 200) {
document.getElementById("levelUpBtn").style.display = "inline-block";
} else {
document.getElementById("levelUpBtn").style.display = "none";
}
}

function levelUp() {
const need = player.level * 100;
if (player.xp >= need && player.level < 200) {
player.level++;
player.maxHp += 10;
player.maxMp += 5;
player.hp = player.maxHp;
player.mp = player.maxMp;
player.attack += 2;
player.defense += 2;
player.xp -= need;
log(`Level up! Now level ${player.level}. Stats boosted, HP and MP fully restored.`);
document.getElementById("levelUpBtn").style.display = "none";
updateCharacterPanel();
updateInventory();
updateWarpButton();
updateAllianceWarpButton();
}
}

function unequipItem(slot) {
if (slot === "weapon") {
player.equipment.weapon = null;
log(`Weapon unequipped.`);
}

if (slot === "armor") {
player.equipment.armor = null;
log(`Armor unequipped.`);
}

updateCharacterPanel();
updateInventory();
}

function updateInventory() {
const invDiv = document.getElementById("inventoryList");

if (player.inventory.length === 0) {
invDiv.innerHTML = "Your inventory is empty.<br>Gold: " + player.gold;
return;
}

let equipmentInfo = `
Equipped Weapon: ${player.equipment.weapon || "None"} <button style="font-size:10px;" onclick="unequipItem('weapon')">Unequip</button><br>
Equipped Armor: ${player.equipment.armor || "None"} <button style="font-size:10px;" onclick="unequipItem('armor')">Unequip</button><br><br>
`;

let inventoryItems = player.inventory.map(item => {
if (equipmentItems[item]) {
return `${item} <button style="font-size:10px;" onclick="equipItem('${item}')">Equip</button>`;
} else {
return `${item} <button style="font-size:10px;" onclick="useItem('${item}')">Use</button>`;
}
}).join("<br>");

invDiv.innerHTML = equipmentInfo + inventoryItems + `<br>Gold: ${player.gold}`;
}

function updateCharacterPanel() {
if (!player) return;

document.getElementById("characterInfo").textContent =
`Name: ${player.name}
Race: ${player.race}
Class: ${player.class}
Level: ${player.level}
XP: ${player.xp}/${player.level * 100}
HP: ${player.hp}/${player.maxHp}
MP: ${player.mp}/${getTotalMp()}
Attack: ${getTotalAttack()}
Defense: ${getTotalDefense()}
Speed: ${getTotalSpeed()}
Magic: ${getTotalMagic()}
Weapon: ${player.equipment.weapon || "None"}
Armor: ${player.equipment.armor || "None"}
Gold: ${player.gold}
Hunter Rank: ${player.hunterRank || "None"}`;

const levelUpBtn = document.getElementById("levelUpBtn");
if (player.xp >= player.level * 100 && player.level < 200) {
levelUpBtn.style.display = "inline-block";
} else {
levelUpBtn.style.display = "none";
}
}

function toggleInventory() {
if (!player) return alert("No character yet.");
updateInventory();
document.getElementById("inventoryPanel").style.display =
document.getElementById("inventoryPanel").style.display === "none" ? "block" : "none";
}

function showAbilities() {
if (!player) return;
const panel = document.getElementById("abilitiesPanel");
const list = document.getElementById("abilitiesList");
list.innerHTML = "";

player.abilities.forEach(ability => {
if (player.level >= ability.unlockLevel) {
const btn = document.createElement("button");
btn.textContent = `${ability.name} (${ability.mpCost} MP)`;
btn.style.fontSize = "10px";
btn.onclick = () => useAbility(ability);
list.appendChild(btn);
}
});

panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function useAbility(ability) {
if (player.mp < ability.mpCost) {
log(`"Not enough MP!"`);
return;
}
player.mp -= ability.mpCost;

if (ability.effect === "damage") {
let dmg = Math.floor(getTotalAttack() * ability.multiplier) - (currentMonster.defense || 0);
dmg = Math.max(2, dmg);
if (Math.random() < 0.1) {
dmg = Math.floor(dmg * 1.5);
log(`"Critical hit!"`);
}
currentMonster.hp -= dmg;
log(`You used ${ability.name} for ${dmg} damage!`);
}

if (ability.effect === "speed") {
player.speed += ability.bonus;
log(`You used ${ability.name}! Speed increased by ${ability.bonus} for ${ability.turns} turns.`);
}

if (ability.effect === "evasion") {
player.dodgeUsed = true;
log(`You used ${ability.name}! You will evade the next attack.`);
}

if (ability.effect === "damage_slow") {
let dmg = Math.floor(getTotalMagic() * ability.multiplier) - Math.floor((currentMonster.defense || 0) / 2);
dmg = Math.max(2, dmg);
if (Math.random() < 0.1) {
dmg = Math.floor(dmg * 1.5);
log(`"Critical hit!"`);
}
currentMonster.hp -= dmg;
log(`You used ${ability.name} for ${dmg} damage!`);
if (Math.random() < 0.3) {
log(`${currentMonster.name} is slowed!`);
}
}

if (ability.effect === "defense") {
player.defenseBuff = ability.bonus;
player.defenseBuffTurns = ability.turns;
log(`You used ${ability.name}! Defense increased by ${ability.bonus} for ${ability.turns} turns.`);
}

updateCharacterPanel();
updateInventory();
updateCombat();

if (currentMonster.hp <= 0) {
if (currentMonster.isBoss) {
winBossFight();
} else {
winCombat();
}
} else {
if (currentMonster.isBoss) {
bossTurn();
} else {
monsterTurn();
}
}
}

function toggleCharacterPanel() {
if (!player) return alert("No character yet.");
updateCharacterPanel();
document.getElementById("characterPanel").style.display =
document.getElementById("characterPanel").style.display === "none" ? "block" : "none";
}

function toggleQuestPanel() {
if (!player) return alert("No character yet.");
updateQuestPanel();
document.getElementById("questPanel").style.display =
document.getElementById("questPanel").style.display === "none" ? "block" : "none";
}

function saveGame() {
if (!player) {
log(`"No character to save."`);
return;
}

const saveData = {
player: player,
activeMission: activeMission,
missionProgress: missionProgress,
travelProgressToAlliance: travelProgressToAlliance,
travelProgressToVillage: travelProgressToVillage,
currentTravelRoute: currentTravelRoute,
characterImageData: characterImageData
};

localStorage.setItem("worldsGateSave", JSON.stringify(saveData));
log(`"Game saved."`);
}

function confirmLoad() {
loadGame();
}

function loadGame() {
const d = localStorage.getItem("worldsGateSave");

if (!d) {
log(`"No saved game found."`);
return;
}

const saveData = JSON.parse(d);

if (!saveData.player) {
log(`"Save data is invalid."`);
return;
}

player = saveData.player;
activeMission = saveData.activeMission || null;
missionProgress = saveData.missionProgress || 0;
travelProgressToAlliance = saveData.travelProgressToAlliance || 0;
travelProgressToVillage = saveData.travelProgressToVillage || 0;
currentTravelRoute = saveData.currentTravelRoute || null;
characterImageData = saveData.characterImageData || "";

player.maxHp = player.maxHp || player.hp || 100;
player.maxMp = player.maxMp || player.mp || 10;
player.dodgeUsed = player.dodgeUsed !== undefined ? player.dodgeUsed : false;
player.hunterRank = player.hunterRank || null;
player.subclass = player.subclass || null;
player.inventory = Array.isArray(player.inventory) ? player.inventory : [];
player.abilities = Array.isArray(player.abilities) ? player.abilities : [];
player.defenseBuff = player.defenseBuff || 0;
player.defenseBuffTurns = player.defenseBuffTurns || 0;
player.equipment = player.equipment || { weapon: null, armor: null };

if (characterImageData) {
document.getElementById("characterImage").src = characterImageData;
document.getElementById("characterImageContainer").style.display = "block";
} else {
document.getElementById("characterImage").src = "";
document.getElementById("characterImageContainer").style.display = "none";
}

updateCharacterPanel();
updateInventory();
updateQuestPanel();
updateWarpButton();
updateAllianceWarpButton();

document.getElementById("travelAllianceOutput").innerHTML =
travelProgressToAlliance > 0 ? `Travel Progress: ${travelProgressToAlliance}/15` : "";

document.getElementById("travelVillageOutput").innerHTML =
travelProgressToVillage > 0 ? `Travel Progress: ${travelProgressToVillage}/15` : "";

showScreen("murim-village");
log(`Welcome back, ${player.name}.`);
}

function useItem(item) {
if (!player) {
log(`"No character yet."`);
return;
}

if (item === "Potion") {
if (player.hp >= player.maxHp) {
log(`"You're already at full HP."`);
return;
}
player.hp = Math.min(player.hp + 20, player.maxHp);
log(`"You used a Potion and restored 20 HP."`);
player.inventory.splice(player.inventory.indexOf("Potion"), 1);
updateInventory();
updateCharacterPanel();
if (document.getElementById("combat").style.display === "block") {
updateCombat();
}
return;
}

if (item === "Fire Scroll") {
if (!(document.getElementById("combat").style.display === "block" || document.getElementById("boss-combat").style.display === "block")) {
log(`"Fire Scroll can only be used in combat."`);
return;
}
let dmg = 50;
if (Math.random() < 0.1) {
dmg = Math.floor(dmg * 1.5);
log(`"Critical Fire Scroll hit!"`);
}
currentMonster.hp -= dmg;
log(`You used a Fire Scroll and dealt ${dmg} damage to ${currentMonster.name}.`);
player.inventory.splice(player.inventory.indexOf("Fire Scroll"), 1);
updateInventory();

if (currentMonster.hp <= 0) {
if (currentMonster.isBoss) {
winBossFight();
} else {
winCombat();
}
} else {
updateCombat();
if (currentMonster.isBoss) {
bossTurn();
} else {
monsterTurn();
}
}
return;
}

log(`"This item cannot be used."`);
}

window.onload = () => {
createSelectionButtons(genders, "genderChoices", "gender");
createSelectionButtons(Object.keys(classes), "classChoices", "class");
checkCharacterCreation();
showScreen("character-creation");
};

document.getElementById("characterImageInput").addEventListener("change", e => {
const f = e.target.files[0];
if (f && f.type.startsWith("image/")) {
const r = new FileReader();
r.onload = ev => {
characterImageData = ev.target.result;
document.getElementById("characterImage").src = characterImageData;
document.getElementById("characterImageContainer").style.display = "block";
};
r.readAsDataURL(f);
}
});

function resetGame() {
localStorage.removeItem("worldsGateSave");
player = null;
currentMonster = null;
activeMission = null;
missionProgress = 0;
raceRollsLeft = 10;
travelProgressToAlliance = 0;
travelProgressToVillage = 0;
currentTravelRoute = null;
characterImageData = "";

Object.assign(charSelection, { name: "", gender: null, race: null, class: null });

document.getElementById("playerName").value = "";
document.getElementById("rolledRace").textContent = "";
document.getElementById("rollRaceBtn").disabled = false;
document.getElementById("characterImageInput").value = "";
document.getElementById("characterImage").src = "";
document.getElementById("characterImageContainer").style.display = "none";
document.getElementById("levelUpBtn").style.display = "none";

createSelectionButtons(genders, "genderChoices", "gender");
createSelectionButtons(Object.keys(classes), "classChoices", "class");
checkCharacterCreation();
showScreen("character-creation");
}

function checkHunterRank() {
if (!player.hunterRank) {
log(`"You are not a registered hunter."`);
return;
}

const rankBtn = document.getElementById("rankUpBtn");
const allianceRankBtn = document.getElementById("allianceRankUpBtn");

if (rankBtn) rankBtn.style.display = "none";
if (allianceRankBtn) allianceRankBtn.style.display = "none";

const nextRank = getNextHunterRank(player.hunterRank);

if (!nextRank) {
log(`Current Rank: S (Max Rank)`);
return;
}

const neededXP = rankThresholds[player.hunterRank];
log(`Current Rank: ${player.hunterRank} | XP: ${player.xp} / ${neededXP}`);

if (player.xp >= neededXP) {
if (document.getElementById("hunters-guild").classList.contains("active") && rankBtn) {
rankBtn.style.display = "inline-block";
}
if (document.getElementById("alliance-guild").classList.contains("active") && allianceRankBtn) {
allianceRankBtn.style.display = "inline-block";
}
}
}

function getNextHunterRank(currentRank) {
const order = ["E", "D", "C", "B", "A", "S"];
const idx = order.indexOf(currentRank);
if (idx === -1 || idx === order.length -1) return null;
return order[idx +1];
}

function rankUp() {
const nextRank = getNextHunterRank(player.hunterRank);
if (!nextRank) {
log(`"You are already at max rank."`);
return;
}

const neededXP = rankThresholds[player.hunterRank];
if (player.xp >= neededXP) {
player.xp -= neededXP;
player.xp = Math.max(0, player.xp);
log(`Prepare yourself! To rank up to ${nextRank}-Rank, you must defeat the boss: ${bosses[player.hunterRank].name}!`);
startBossFight(player.hunterRank);
} else {
log(`"Not enough XP to rank up."`);
}
}

function visitAllianceGuild() {
  showScreen("alliance-guild");
}

function visitDivineSupply() {
  showScreen("divine-supply");
}

function enterVoidGate() {
  log(`"The Void Gate is locked for now. It will be available in a future update."`);
  showScreen("void-gate");
}

function showAllianceMissionBoard() {
if (!player.hunterRank) return log(`"You must register as a Hunter first."`);

let board = [
{ name: "Eliminate 3 Hawks", target: "Hawk", count: 3, rewardXP: 120, rewardGold: 200 },
{ name: "Hunt 1 Baby Wyvern", target: "Baby Wyvern", count: 1, rewardXP: 200, rewardGold: 300 },
{ name: "Cleanse 2 Snakes", target: "Snake", count: 2, rewardXP: 150, rewardGold: 250 }
];

let output = board.map((m, i) =>
`<button onclick="acceptAllianceMission(${i})">${m.name}</button>`
).join("<br>");

output += `<br><button onclick="closeAllianceMissionBoard()">Close Board</button>`;

document.getElementById("allianceGuildOutput").innerHTML = output;
window.allianceMissions = board;
}

function acceptAllianceMission(i) {
  if (activeMission) return log(`"You already have an active mission."`);
  const m = window.allianceMissions?.[i];
  if (!m) return log(`"Invalid mission."`);
  activeMission = m;
  missionProgress = 0;
  log(`Accepted mission: ${m.name}`);
  updateQuestPanel();
}

function enterGateSelection() {
  const gateBtn = document.getElementById("hornedRabbitGateBtn");
  if (!player.hunterRank || ["F", null].includes(player.hunterRank)) {
    gateBtn.disabled = true;
    gateBtn.style.opacity = 0.5;
  } else {
    gateBtn.disabled = false;
    gateBtn.style.opacity = 1;
  }
  showScreen("gate-selection");
}

function enterHornedRabbitGate() {
  log(`You enter the E Rank Horned Rabbits Gate. (Monsters coming soon)`);
}

function enterGates() {
  if (!player.hunterRank) {
    log(`"You must be a registered Hunter to enter gates."`);
    return;
  }
  updateGateButtons();
  showScreen("gate-selection");
}

function updateGateButtons() {
const btn = document.getElementById("hornedRabbitGateBtn");
if (!btn) return;

btn.disabled = player.hunterRank !== "E" &&
               player.hunterRank !== "D" &&
               player.hunterRank !== "C" &&
               player.hunterRank !== "B" &&
               player.hunterRank !== "A" &&
               player.hunterRank !== "S";
}

function closeMissionBoard() {
document.getElementById("guildOutput").innerHTML = "";
}

function closeAllianceMissionBoard() {
document.getElementById("allianceGuildOutput").innerHTML = "";
}

</script>

</body>
</html
