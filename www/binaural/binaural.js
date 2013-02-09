var currentSound = null;
var nextSound = null;
var flipTimer = null;

function start(el) {
  toggleOff(el);
  if (flipTimer !== null)
    clearTimeout(flipTimer);
  if (currentSound !== null)
    fade(currentSound, currentSound.volume, 0, 5);

  var preId = "hz-" + el.dataset.beat + "-" + el.dataset.tone + "-";
  currentSound = document.getElementById(preId + "a");
  nextSound = document.getElementById(preId + "b");
  currentSound.pause();
  nextSound.pause();
  currentSound.currentTime = 0.0;
  fade(currentSound, 0, 1);
  currentSound.play();
  flipTimer = window.setInterval(flip, 28000);
}

function stop(el) {
  toggleOff(el);
  if (flipTimer !== null) {
    clearTimeout(flipTimer);
    flipTimer = null;
  }
  fade(currentSound, currentSound.volume, 0);
}

function flip() {
  nextSound.currentTime = 0.0;
  fade(nextSound, 0, 1);
  var _currentSound = currentSound;
  window.setTimeout(function () {
    fade(_currentSound, 1, 0);
  }, 100);
  nextSound.play();
  var tmp = currentSound; currentSound = nextSound; nextSound = tmp;
}

function fade(snd, from, to, ticks) {
  var tick = 0;
  ticks = ticks || 10;
  var timer = null;
  snd.volume = from;
  function tickDown() {
    tick += 1;
    if (tick >= ticks)
      clearTimeout(timer);
    var vol = from + (to - from) * (tick / ticks);
    snd.volume = vol;
  }
  timer = window.setInterval(tickDown, 1000 / ticks);
}

function toggleOff(el) {
  var table = document.getElementById("buttonsTable");
  var buttons = table.getElementsByTagName("button");
  for (var i=0; i < buttons.length; i++) {
    var b = buttons[i];
    if (b !== el)
      b.disabled = false;
  }
  el.disabled = true;
}
