// Copyright 2016 Eyevinn Technology. All rights reserved
// Use of this source code is governed by a MIT License
// license that can be found in the LICENSE file.
// Author: Jonas Birme (Eyevinn Technology)
var activeViewPort;

function initHlsPlayer(conf, videoelemid, donecb) {
  var hlsconfig = {
    capLevelToPlayerSize: true
  };
  var hls = new Hls(hlsconfig);
  var videoelem = document.getElementById(videoelemid);
  hls.attachMedia(videoelem);
  hls.on(Hls.Events.MEDIA_ATTACHED, function() {
    hls.loadSource(conf.manifest);
    hls.on(Hls.Events.MANIFEST_PARSED, function(ev, data) {
      videoelem.muted = true;
      videoelem.play();
      donecb(videoelem);
    });
  });
  hls.on(Hls.Events.ERROR, function (event, data) {
    if (data.fatal) {
      switch(data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
      // try to recover network error
        console.log("fatal network error encountered, try to recover");
        hls.startLoad();
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.log("fatal media error encountered, try to recover");
        hls.recoverMediaError();
        break;
      default:
        // cannot recover
        hls.destroy();
        break;
      }
    }
  });
}

function initDashPlayer(conf, videoelemid, donecb) {
  var videoelem = document.getElementById(videoelemid);
  var shakap = new shaka.Player(videoelem);
  shakap.load(conf.manifest).then(function(ev) {
    videoelem.muted = true;
    shakap.setMaxHardwareResolution(600, 600);
    videoelem.play();
    donecb(videoelem);
  }).catch(function(e) { console.log("Error: ", e); });
}


function initPlayer(conf, videoelemid, donecb) {
  if (conf.type === 'hls') {
    initHlsPlayer(conf, videoelemid, donecb);
  } else if (conf.type === 'dash') {
    initDashPlayer(conf, videoelemid, donecb);
  }
}

function onVideoClick(ev) {
  activateViewPort(ev.target.id);
}

function onWaiting(ev) {
  ev.target.className +=" video-buffering";
}

function onPlaying(ev) {
  ev.target.className = ev.target.className.replace("video-buffering", "");
}

function initViewPort(conf, videoelemid) {
  initPlayer(conf, videoelemid, function(videoelem) {
    console.log(videoelemid + " loaded!");
    videoelem.addEventListener("click", onVideoClick);
    videoelem.addEventListener("waiting", onWaiting);
    videoelem.addEventListener("playing", onPlaying);
    var titleelem = document.getElementById(videoelemid+'-title');
    titleelem.innerHTML = conf.title;
  });
}

function initViewPortRow(row, numcols, config) {
  for (var i=0; i<numcols; i++) {
    videoelemid = "vp"+row+i;
    c = config['row'+row][i];
    if (c) {
      initViewPort(c, videoelemid);
    }
  }
}

function activateViewPort(videoelemid) {
  if (activeViewPort) {
    currentActiveVideoElem = document.getElementById(activeViewPort);
    currentActiveVideoElem.className = currentActiveVideoElem.className.replace("video-unmuted", "");
    currentActiveVideoElem.muted = true;
  }
  newActiveVideoElem = document.getElementById(videoelemid);
  newActiveVideoElem.className += " video-unmuted";
  newActiveVideoElem.muted = false;
  activeViewPort = videoelemid;
}

function togglePlaybackOnAllViewPorts() {
  for(var i=0; i<2; i++) {
    for(var j=0; j<4; j++) {
      var videoelem = document.getElementById('vp'+i+j);
      if (videoelem.paused) {
        videoelem.play();
      } else {
        videoelem.pause();
      }    
    }
  }
}

function initMultiView(config) {
  if (config) {
    shaka.polyfill.installAll();
    initViewPortRow(0, 4, config);
    initViewPortRow(1, 4, config);
    if(config['row0'][0]) { 
      initViewPort(config['row0'][0], 'vpleft');
    }
    if(config['row1'][0]) { 
      initViewPort(config['row1'][0], 'vpright');
    }
  }
}

function onKeyPress(ev) {
  if (ev.keyCode == 32) {
    // space
    console.log('operator hit space');
    togglePlaybackOnAllViewPorts();
    ev.preventDefault();
    ev.stopPropagation();
  }
}

function initKeyControls() {
  document.addEventListener("keypress", onKeyPress, false);
}
