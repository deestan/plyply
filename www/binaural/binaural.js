var currentSound = null;
var nextSound = null;
var flipTimer = null;

function start(el) {
  if (el.classList.contains("disabled"))
    return;
  toggleOff(el);
  if (flipTimer !== null)
    clearTimeout(flipTimer);
  if (currentSound !== null)
    currentSound.pause();

  var preId = "hz-" + el.dataset.beat + "-" + el.dataset.tone + "-";
  currentSound = document.getElementById(preId + "a");
  nextSound = document.getElementById(preId + "b");
  currentSound.pause();
  nextSound.pause();
  currentSound.currentTime = 0.0;
  currentSound.play();
  flipTimer = window.setInterval(flip, 29000);
}

function stop(el) {
  if (el.classList.contains("disabled"))
    return;
  toggleOff(el);
  if (flipTimer !== null) {
    clearTimeout(flipTimer);
    flipTimer = null;
  }
  currentSound.pause();
}

function updateVolume(level) {
  var volume = level * 0.01;
  var audios = document.getElementsByTagName("audio");
  for (var i=0; i < audios.length; i++)
    audios[i].volume = volume;
}

function flip() {
  nextSound.currentTime = 0.0;
  var _currentSound = currentSound;
  nextSound.play();
  var tmp = currentSound; currentSound = nextSound; nextSound = tmp;
}

function toggleOff(el) {
  var table = document.getElementById("buttonsTable");
  var buttons = table.getElementsByClassName("button");
  for (var i=0; i < buttons.length; i++) {
    var b = buttons[i];
    if (b !== el)
      b.classList.remove("disabled");
  }
  el.classList.add("disabled");
}
