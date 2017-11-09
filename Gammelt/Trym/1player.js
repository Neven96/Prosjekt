//Lager animasjon som går i 60 rammer per sekund
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {window.setTimeout(callback, 1000/60);};

//Lager rammen og gir den bredde og høyde
var canvas = document.createElement("canvas");
var width = 600;
var height = 400;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext("2d");

//Aktiverer animasjonen i rammen
window.onload = function(){
  document.body.appendChild(canvas);
  animate(step);
};

//Oppdaterer hver ramme
var step = function(){
  update();
  render();
  animate(step);
};

//Oppdaterer rekkertene og ballen
var update = function(){
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

//Gir rammen farge og plasserer rekkertene og ballen innenfor rammen
var render = function(){
  context.fillStyle = "#FF394F";
  context.fillRect(0,0,300,height);
  context.fillStyle = "#AA394F";
  context.fillRect(300,0,300,height);
  player.render();
  computer.render();
  ball.render();
};

//Lager et rekkert-"objekt" med størrelse og mulighet til fart
function Paddle(x, y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

//Gir rekkertene farge og mulighet til en plassering
Paddle.prototype.render = function(){
  context.fillStyle = "#565656";
  context.fillRect(this.x, this.y, this.width, this.height);
};

//Lager spillerrekkerten
function Player() {
  this.paddle = new Paddle(580, 175, 10, 50);
}

//Lager computerrekkerten
function Computer() {
  this.paddle = new Paddle(10, 175, 10, 50);
}

//Lager ballen
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 3;
  this.y_speed = 0;
  this.radius = 5;
}

//Plasserer spillerrekkerten innenfor rammen
Player.prototype.render = function() {
  this.paddle.render();
};

//Plasserer computerrekkerten innenfor rammen
Computer.prototype.render = function() {
  this.paddle.render();
};

//Lager ballen og gir den farge og mulighet til plassering
Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2*Math.PI, false);
  context.fillStyle = "#000000";
  context.fill();
};

//Gir ballen fart og oppdaterer farten for hver ramme, og når rekkertene treffer den
Ball.prototype.update = function(paddle1, paddle2){
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x -5;
  var top_y = this.y -5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if (this.y - 5 < 0) {
    this.y = 5;
    this.y_speed = -this.y_speed;
  } else if (this.y + 5 > 400) {
    this.y = 395;
    this.y_speed = -this.y_speed;
  }

  if (this.x < 0 || this.x > 600) {
    this.x_speed = 3;
    this.y_speed = 0;
    this.x = 300;
    this.y = 200;
  }

  if (top_x > 300) {
    if (top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
      this.x_speed = -3;
      this.y_speed += (paddle1.y_speed / 2);
      this.x += this.x_speed;
    }
  } else {
    if (top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
      this.x_speed = 3;
      this.y_speed += (paddle2.y_speed / 2);
      this.x += this.x_speed;
    }
  }
};

//Forteller hva som skjer når en rekkert beveger seg, og hvor langt den kan bevege seg
Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if (this.y < 0) {
    this.y = 0;
    this.y_speed = 0;
  } else if (this.y + this.height > 400) {
    this.y = 400 - this.height;
    this.y_speed = 0;
  }
};

var keysDown = {};

//Når man trykker på en knapp
window.addEventListener("keydown", function(event){
  keysDown[event.keyCode] = true;
});

//Når man slipper knappen
window.addEventListener("keyup", function(event){
  delete keysDown[event.keyCode];
});

//Forteller hvordan spilleren skal bevege seg hvis knappen er trykket (37 = venstre pil, og 39 = høyre pil )
Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if (value == 38) {
      this.paddle.move(0, -4);
    } else if (value == 40) {
      this.paddle.move(0, 4);
    } else {
      this.paddle.move(0, 0);
    }
  }
};


//Hva som skjer når computeren beveger på seg
Computer.prototype.update = function(ball) {
  var y_pos = ball.y;
  var diff = -((this.paddle.y + (this.paddle.height/ 2)) - y_pos);
  if (diff < 0 && diff < -4) {
    diff = -4;
  } else if (diff > 0 && diff > 4) {
    diff = 4;
  }
  this.paddle.move(0, diff);
  if (this.paddle.y < 0) {
    this.paddle.y = 0;
  } else if (this.paddle.y + this.paddle.height > 600) {
    this.paddle.y = 600 - this.paddle.height;
  }
};

//Aktiverer spilleren, computeren og ballen
var player = new Player();
var computer = new Computer();
var ball = new Ball(300, 200);
