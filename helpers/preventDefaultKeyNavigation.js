
history.pushState(null, null, location.href);

window.onpopstate = function() {
  history.go(1);
};

window.addEventListener("keydown", e => {
  if (e.keyCode == 8) {
    if (
      (e.target.tagName == "INPUT" && e.target.type == "text") ||
      (e.target.tagName == "INPUT" && e.target.type == "password") ||
      (e.target.tagName == "INPUT" && e.target.type == "date") ||
      (e.target.tagName == "INPUT" && e.target.type == "number") ||
      e.target.tagName == "TEXTAREA"
    ) {
      if (!e.target.readOnly && !e.target.disabled) {
        return true;
      }
    }
    if((e.target.tagName =="body") || (e.target.tagName =="DIV") || (e.target.tagName == "div")){
      e.preventDefault();
      return false;
    } else {
      return true;
    }
    
  }
  if (e.keyCode == 116 || e.keyCode == 122 || e.keyCode == 27) {
    e.preventDefault();
    return false;
  }
  if (event.altKey && (e.keyCode == 37 || e.keyCode == 39)) {
    e.preventDefault();
    return false;
  }

  if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189' || event.which == '48'  ) ) {        
    event.preventDefault();
  }

  enterFullscreenMode();
});
document.body.oncontextmenu = function() {
  return false;
};
// document.body.onbeforeunload = function() {
//   return "Really?";
// };

// window.addEventListener("onbeforeunload", function() {
//   return "Really?";
// });
window.onbeforeunload = function () {
  return "Really?";
};

function enterFullscreenMode() {
  var path = window.location.href.split("/");
  path = path[path.length - 1];
  var full_screen_element =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    null;
  let init_status = JSON.parse(window.sessionStorage.getItem("init_status"));
  if (init_status !== undefined && init_status != null) {
    let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;
    if (conf_data !== undefined && conf_data.logout_page_fullscreen_control == 1) path = "logout";
  }
  if (path != "") {
    // If no element is in full-screen
    if (full_screen_element === null) {
      if (document.body.msRequestFullscreen)
        document.body.msRequestFullscreen();
      else if (document.body.mozRequestFullScreen)
        document.body.mozRequestFullScreen();
      else if (document.body.webkitRequestFullscreen)
        document.body.webkitRequestFullscreen();
      else if (document.body.requestFullscreen)
        document.body.requestFullscreen();
    }
  }
}
window.addEventListener("click", () => {
  enterFullscreenMode();
});
document.addEventListener("MSFullscreenChange", function() {
  enterFullscreenMode();
});
document.addEventListener("fullscreenchange", function() {
  enterFullscreenMode();
});
document.addEventListener("mozfullscreenchange", function() {
  enterFullscreenMode();
});
document.addEventListener("webkitfullscreenchange", function() {
  enterFullscreenMode();
});

window.addEventListener('mousewheel', function() {  
  if (event.ctrlKey == true) {      
    event.preventDefault();
  }
})
