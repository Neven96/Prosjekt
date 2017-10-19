document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded() {
  var canvas = document.getElementById("menyCanvas");
  var context = canvas.getContext("2d");
  var width = canvas.getAttribute('width');
  var height = canvas.getAttribute('height');

  var bgImage = new Image();
  var logoImage = new Image();
  var playImage = new Image();
  var instructImage = new Image();
  var settingsImage = new Image();
  var creditsImage = new Image();
  var ballImage = new Image();

  bgImage.src = "Images/Background.png";
  logoImage.src = "Images/logo.png";
  playImage.src = "Images/play.png";
  instructImage.src = "Images/instructions.png";
  settingsImage.src = "Images/settings.png";
  creditsImage.src = "Images/credits.png";
  ballImage.src = "Images/ball.png";

  var buttonX = [192,110,149,160];
  var buttonY = [100,140,180,220];
  var buttonWidth = [96,260,182,160];
  var buttonHeight = [40,40,40,40];

  bgImage.onload = function() {
    context.drawImage(bgImage, 0, 0);
  };
  logoImage.onload = function() {
    context.drawImage(logoImage, 50, -10);
  };
  playImage.onload = function() {
    context.drawImage(playImage, buttonX[0], buttonY[0]);
  };
  instructImage.onload = function() {
    context.drawImage(instructImage, buttonX[1], buttonY[1]);
  };
  settingsImage.onload = function() {
    context.drawImage(settingsImage, buttonX[2], buttonY[2]);
  };
  creditsImage.onload = function() {
    context.drawImage(creditsImage, buttonX[3], buttonY[3]);
  };

  var frames = 60;
  var timerId = 0;

  animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {window.setTimeout(callback, 1000/60);};

  window.onload = function() {
    document.getElementById("menyDiv").appendChild(canvas);
    animate(update);
  };

  //timerId = setInterval(update, 1000/frames);

  function update() {
    clear();
    move();
    draw();
    animate(update);
  }

  function clear() {
    context.clearRect(0, 0, width, height);
  }

  var backgroundY = 0;
  var speed = 1;

  function move() {
    backgroundY -= speed;
    if (backgroundY == -1 * height) {
      backgroundY = 0;
    }

    if (ballSize == ballWidth) {
      ballRotate = -1;
    }
    if (ballSize == 0) {
      ballRotate = 1;
    }
    ballSize += ballRotate;
  }

  function draw() {
    context.drawImage(bgImage, 0, backgroundY);
    context.drawImage(logoImage, 50, -10);
    context.drawImage(playImage, buttonX[0], buttonY[0]);
    context.drawImage(instructImage, buttonX[1], buttonY[1]);
    context.drawImage(settingsImage, buttonX[2], buttonY[2]);
    context.drawImage(creditsImage, buttonX[3], buttonY[3]);

    if (ballVisible == true) {
      context.drawImage(ballImage, ballX[0] - (ballSize/2), ballY[0], ballSize, ballHeight);
      context.drawImage(ballImage, ballX[1] - (ballSize/2), ballY[1], ballSize, ballHeight);
    }
  }

  var mouseX;
  var mouseY;
  canvas.addEventListener("mousemove", checkPos);

  var ballX = [0,0];
  var ballY = [0,0];
  var ballWidth = 40;
  var ballHeight = 40;
  var ballVisible = false;
  var ballSize = ballWidth;
  var ballRotate = 0;

  function checkPos(mouseEvent) {
    mouseX = mouseEvent.pageX - this.offsetLeft;
    mouseY = mouseEvent.pageY - this.offsetTop;

    if (mouseEvent.pageX || mouseEvent.pageY == 0) {
      mouseX = mouseEvent.pageX - this.offsetLeft;
      mouseY = mouseEvent.pageY - this.offsetTop;
    } else if (mouseEvent.offsetX || mouseEvent.offsetY == 0) {
      mouseX = mouseEvent.offsetX;
      mouseY = mouseEvent.offsetY;
    }

    for (var i = 0;i < buttonX.length;i++) {
      if (mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]) {
        if (mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]) {
          ballVisible = true;
          ballX[0] = buttonX[i] - (ballWidth/2) - 2;
          ballY[0] = buttonY[i] + 2;
          ballX[1] = buttonX[i] + ballWidth[i] + (ballWidth/2);
          ballY[1] = buttonY[i] + 2;
        }
      } else {
        ballVisible = false;
      }
    }
  }

  var fadeId = 0;
  canvas.addEventListener("mouseup", checkClick);

  function checkClick(mouseEvent) {
    for (var i = 0;i < buttonX.length;i++) {
      if (mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]) {
        if (mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]) {
          fadeId = setInterval("fadeOut()", 1000/frames);
        }
      }
    }
  }
}
