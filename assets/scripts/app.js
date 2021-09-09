const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const HEAL_PLAYER_VALUE = 20;
let hasBonusLife = true;

const MODE_ATTACK = "ATTACK"; //MODE ATTACK = 0
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; //MODE_STRONG_ATTACK = 0
const LOG_EVENT_PLAYER_ATTCK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTCK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTCK";
const LOG_EVENT_PLAYER_HEALING = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
let chosenMaxLife;

function getMaxUserValue() {
  const enteredValue = prompt("Maximum life for you and monster", "95");
  let parsedValue = parseInt(enteredValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw "Invalid user input, Not a Number";
  }
  return parsedValue;
}

try {
  chosenMaxLife = getMaxUserValue();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert("you have entered an invalid value");
}

let bettleLog = [];

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  if (ev === LOG_EVENT_PLAYER_ATTCK) {
    logEntry.target = "MONSTER";
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTCK) {
    logEntry = {
      event: ev,
      value: val,
      target: "MONSTER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_PLAYER_HEALING) {
    logEntry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  }
  bettleLog.push(logEntry);
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

adjustHealthBars(chosenMaxLife);

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;

  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but bonus life saved your ass");
    setPlayerHealth(initialPlayerHealth);
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Its a draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "It's DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTCK
      : LOG_EVENT_PLAYER_STRONG_ATTCK;
  // if(mode === MODE_ATTACK){
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTCK;

  // }else if (mode === MODE_STRONG_ATTACK){
  //   maxDamage = STRONG_ATTACK_VALUE;
  // }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
  endRound();
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
  endRound();
}

function healPlayer() {
  let healPlayer;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_PLAYER_VALUE) {
    alert("You can't heal more than Max health");
    healPlayer = chosenMaxLife - currentPlayerHealth;
  } else {
    healPlayer = HEAL_PLAYER_VALUE;
  }
  increasePlayerHealth(HEAL_PLAYER_VALUE);
  currentPlayerHealth += healPlayer;
  writeToLog(
    LOG_EVENT_PLAYER_HEALING,
    healPlayer,
    currentMonsterHealth,
    currentPlayerHealth
  );

  endRound();
}

function printLogHandler() {
  for (let i = 0; i < 3; i++) {
    console.log(`----------------------`);
  }
  let i = 0;
  for (const logEntry of bettleLog) {
    console.log(`#${i}-:`);
    for (const key in logEntry) {
      console.log(`${key} => ${logEntry[key]}`);
    }
    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayer);
logBtn.addEventListener("click", printLogHandler);
