// These will be set by the document.onload handler.
var arena;
var playerInput;
var goButton;
var resetButton;
var hint;

var players = [];

function createPlayers() {
  function trim(x) {
    return x.replace(/^\s*/, "").replace(/\s*$/, "");
  }
  var ROWHEIGHT = 80;
  var playerNames = _.chain(playerInput.innerHTML
                            .replace(/&nbsp;/g, " ")
                            .replace(/,/g, "\n")
                            .replace(/<[^>]*>/g, "\n")
                            .split("\n"))
    .map(trim)
    .filter(trim)
    .value();
  for (var i=0; i<players.length; i++) {
    var pi = players[i].img;
    pi.parentElement.removeChild(pi);
    var nt = players[i].nameTag;
    nt.parentElement.removeChild(nt);
  }
  players = [];
  for (var i=0; i<playerNames.length; i++) {
    var nameTag = document.createElement("span");
    nameTag.className = "nametag";
    var textContent = playerNames[i];
    for (var j=0; j<100; j++)
      textContent += " - " + playerNames[i];
    nameTag.innerHTML = textContent;
    nameTag.style.left = 0;
    nameTag.style.top = players.length * ROWHEIGHT + 10;
    arena.appendChild(nameTag);
    var player = document.createElement("img");
    player.src = "runner_ready.gif";
    player.className = "runner";
    player.style.left = 0;
    player.style.top = players.length * ROWHEIGHT - 5;
    arena.appendChild(player);
    players.push({img: player, nameTag: nameTag,
                  left: 0, nextAnimBound: 0,
                  nextSpeedBound: 0,
                  dx: 0});
  }
  arena.style.height = players.length * ROWHEIGHT + "px";
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
  player.nameTag.style.color = "#fb1";
  player.nameTag.style.fontWeight = "bold";
}

function race() {
  var arenaBounds = arena.getBoundingClientRect();
  var goal = (arenaBounds.right - arenaBounds.left) - 70;
  var end = goal + 20;
  var winners = [];
  for (var i=0; i<players.length; i++) {
    var p = players[i];
    if (p.left >= p.nextSpeedBound) {
      p.dx = randy.best.triangular(3, 8, 5);
      p.nextSpeedBound += 100;
    }
    if (p.left >= p.nextAnimBound) {
      p.img.src = randy.choice(["runner1.gif", "runner1.gif", "runner1.gif",
                                "runner2.gif",
                                "runner3.gif", "runner3.gif", "runner3.gif",
                                "runner4.gif",
                                "runner5.gif", "runner5.gif",
                                "runner6.gif", "runner6.gif",
                                "runner7.gif", "runner7.gif"]);
      p.nextAnimBound += randy.randInt(150, 300);
    }
    var pastEnd = (p.left >= end);
    var pastFinish = (p.left >= goal);
    if (pastEnd && !p.pastEndImage) {
      if (p == winner) {
        p.img.src = randy.choice(["runner_win1.gif",
                                  "runner_win2.gif"]);
      } else {
        p.img.src = "runner_finished.gif";
      }
      p.pastEndImage = true;
    }
    if (!pastEnd && p.pastEndImage) {
      p.nextAnimBound = p.left;
      p.pastEndImage = false;
    }
    p.left += p.dx * (pastFinish ? 0.5 : 1.0) * (pastEnd ? 0.0 : 1.0);
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

arena = document.getElementById("arena");
playerInput = document.getElementById("players");
goButton = document.getElementById("run");
resetButton = document.getElementById("reset");
hint = document.getElementById("hint");
reset();
bindClickAndTouchEvent(goButton, gogogo);
bindClickAndTouchEvent(resetButton, reset);
playerInput.onclick = function () {
  hint.onclick = null;
  hint.style.display = "none";
}
bindClickAndTouchEvent(hint, function () {
  hint.onclick = null;
  hint.style.display = "none";
  playerInput.focus();
  var s = window.getSelection();
  s.selectAllChildren(playerInput);
});

function bindClickAndTouchEvent(el, action) {
  var canFire = true;
  function fire() {
    if (el.disabled)
      return;
    if (!canFire)
      return;
    canFire = false;
    setTimeout(function () { canFire = true; }, 2000);
    action();
  }
  el.onclick = fire;
  if (el.addEventListener)
    el.addEventListener("touchstart", fire, false);
}
