var arena = document.getElementById("arena");
var playerInput = document.getElementById("players");
var goButton = document.getElementById("run");
var resetButton = document.getElementById("reset");

var players = [];

function createPlayers() {
  function trim(x) {
    return x.trim();
  }
  var playerNames = playerInput.innerText.split("\n").map(trim).filter(trim);
  for (var i=0; i<players.length; i++) {
    var pi = players[i].img;
    pi.parentElement.removeChild(pi);
    var nt = players[i].nameTag;
    nt.parentElement.removeChild(nt);
  }
  players = [];
  for (var i=0; i<playerNames.length; i++) {
    var nameTag = document.createElement("span");
    nameTag.classList.add("nametag");
    nameTag.innerText = playerNames[i];
    for (var j=0; j<100; j++) {
      nameTag.innerText += " - " + playerNames[i];
    }
    nameTag.style.left = 0;
    nameTag.style.top = players.length * 100 + 20;
    arena.appendChild(nameTag);
    var player = document.createElement("img");
    player.src = "runner.gif";
    player.classList.add("runner");
    player.style.left = 0;
    player.style.top = players.length * 100 + 10;
    arena.appendChild(player);
    players.push({img: player, nameTag: nameTag,
                  left: 0, nextBound: 0, dx: 0});
  }
  arena.style.height = players.length * 100 + "px";
}

var running = null;
function gogogo() {
  playerInput.contentEditable = "false";
  playerInput.onkeydown = null;
  goButton.disabled = true;
  running = setInterval(race, 80);
}

var winner = null;
function win(player) {
  if (winner) return;
  winner = player;
  resetButton.disabled = false;
  player.nameTag.style.color = "#fd3";
  player.nameTag.style.fontWeight = "bold";
}

function race() {
  var goal = arena.getBoundingClientRect().width - 70;
  var end = goal + 20;
  var winners = [];
  for (var i=0; i<players.length; i++) {
    var p = players[i];
    if (p.left >= p.nextBound) {
      p.dx = randy.best.triangular(3, 8, 5);
      p.nextBound += 100;
    }
    if (p.left >= end)
      p.dx = 0;
    var pastFinish = (p.left >= goal);
    p.left += p.dx * (pastFinish ? 0.5 : 1.0);
    p.img.style.left = p.left;
    if (p.left >= goal)
      winners.push(p);
  }
  if (winners.length > 0) {
    win(randy.best.choice(winners));
  }
}

function reset() {
  winner = null;
  playerInput.contentEditable = "true";
  playerInput.onkeydown = function () {
    setTimeout(createPlayers, 0);
  }
  goButton.disabled = false;
  createPlayers();
  resetButton.disabled = true;
  if (running)
    clearInterval(running);
}

reset();
goButton.onclick = gogogo;
resetButton.onclick = reset;
