function initGallery() {
  function getEl() {
    return document.getElementsByClassName("gallery")[0];
  }

  var gDim;

  function dimensionsChanged() {
    var curGalDim = getEl().getBoundingClientRect();
    return (curGalDim.width != gDim.width ||
            curGalDim.height != gDim.height);
  }
  
  var imgPos;
  var stripE = getEl().getElementsByClassName("strip")[0];
  function initSizes() {
    imgPos = [];
    var gal = getEl();
    gDim = gal.getBoundingClientRect();
    var w = gDim.width;
    var h = gDim.height;
    var imgs = stripE.getElementsByTagName("img");
    stripE.style.setProperty("height", h+"px", "");
    stripE.style.setProperty("width", (w*imgs.length)+"px", "");
    for (var i=0; i<imgs.length; i++) {
      imgPos.push(-i*w);
      imgs[i].style.setProperty("position", "absolute", "");
      imgs[i].style.setProperty("left", (i*w)+"px", "");
      imgs[i].style.setProperty("width", w+"px", "");
      imgs[i].style.setProperty("height", h+"px", "");
    }
  };
  
  initSizes();
  
  var transition = (function() {
    var transitioning = false;
    return function(fromIdx, toIdx, callback) {
      if (transitioning) return;
      transitioning = true;
      var step = 0;
      var STEPS = 50;
      function move() {
        var from = imgPos[fromIdx];
        var to = imgPos[toIdx];
        if (step == STEPS) {
          stripE.style.setProperty("left", to+"px", "");
          if (callback) callback();
          transitioning = false;
        } else {
          var pos = step / STEPS;
          var smoothPos = (1 - Math.cos(pos * Math.PI)) / 2;
          var left = from + (to - from) * smoothPos;
          ++step;
          stripE.style.setProperty("left", left+"px", "");
          setTimeout(move, 20);
        }
      }
      move();
    }
  })();

  var atIdx = 0;
  var autoCycling = false;
  var interval;
  function goNext() {
    if (dimensionsChanged())
      initSizes();
    var nxtIdx = atIdx + 1;
    if (nxtIdx >= imgPos.length) nxtIdx = 0;
    transition(atIdx, nxtIdx);
    atIdx = nxtIdx;
  }
  function start() {
    interval = setInterval(goNext, 8000);
  }
  function stop() {
    clearInterval(interval);
  }

  var prevOnResize = window.onresize;
  window.onresize = function() {
    initSizes();
    stripE.style.setProperty("left", imgPos[atIdx] + "px", "");
    prevOnResize && prevOnResize();
  };

  start();
}
