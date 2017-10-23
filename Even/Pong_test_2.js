//Funksjoner for å gjemme og vise menyer
function gjemDiv(divId) {
  var div = document.getElementById(divId);
  div.style.display = "none";
}
function visDiv(divId) {
  var div = document.getElementById(divId);
  div.style.display = "initial";
}

document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded() {
  document.getElementById("enSpiller").onclick = function() {spiller_tall(1);}
  document.getElementById("toSpiller").onclick = function() {spiller_tall(2);}
  function spiller_tall(spiller) {
    var spillere = spiller;
    gjemDiv("menyDiv");
    pong(spillere);
  }

  //Instruksjonsmenyen
  document.getElementById("instruksjonKnapp").onclick = function() {
    gjemDiv("knappeDiv");
    visDiv("instruksjonDiv");
  }
  document.getElementById("instruksjonTilbakeMeny").onclick = function() {
    gjemDiv("instruksjonDiv");
    visDiv("knappeDiv");
  }

  //Innstillingsmenyen
  document.getElementById("innstillingKnapp").onclick = function() {
    gjemDiv("knappeDiv");
    visDiv("innstillingDiv");
  }
  document.getElementById("innstillingTilbakeMeny").onclick = function() {
    gjemDiv("innstillingDiv");
    visDiv("knappeDiv");
  }
}

function pong(spillere) {
  var spillDiv = document.createElement("div");
  spillDiv.id = "spillDiv";
  document.body.appendChild(spillDiv);

  //Lager animasjon som går i 60 rammer per sekund
  var animate = spillDiv.requestAnimationFrame ||
    spillDiv.webkitRequestAnimationFrame ||
    spillDiv.mozRequestAnimationFrame ||
    spillDiv.oRequestAnimationFrame ||
    function(callback) {window.setTimeout(callback, 1000/60);};

  //Lager rammen og gir den bredde og høyde
  var bane = document.createElement("canvas");
  var bredde = 1000;
  var hoyde = 500;
  bane.width = bredde;
  bane.height = hoyde;
  var context = bane.getContext("2d");
  document.getElementById("spillDiv").appendChild(bane);

  //Variabler for fart og poeng
  var x_speed_array = [-3,3];
  var y_speed_array = [-0.5,-0.25,0,0.25,0.5];
  var random_speed_x = Math.floor(Math.random()*x_speed_array.length);
  var random_speed_y = Math.floor(Math.random()*y_speed_array.length);
  var poeng_spiller_1 = 0;
  var poeng_spiller_2 = 0;
  var poeng_spiller_1_ut = document.getElementById("poengSpiller1");
  var poeng_spiller_2_ut = document.getElementById("poengSpiller2");
  poeng_spiller_1_ut.textContent = poeng_spiller_1;
  poeng_spiller_2_ut.textContent = poeng_spiller_2;
  var pauset = false;
  var spillere;
  var radius = 5;

  //Gir rammen farge og plasserer rekkertene og ballen innenfor rammen
  var render = function(){
    context.fillStyle = "#FF0000";
    context.fillRect(0,0,bredde,hoyde);
    context.fillStyle = "#00FF00";
    context.fillRect(500,0,bredde,hoyde);
    player.render();
    computer.render();
    ball.render();
  };

  //Oppdaterer rekkertene og ballen
  var update = function(){
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
  };

  //Oppdaterer hver ramme
  this.step = function(){
    render();
    if (!pauset) {
      update();
    }
    animate(step);
  };

  animate(this.step.bind(this));

  //Lager et rekkert-"objekt" med størrelse og mulighet til fart
  function Paddle(x, y, bredde, hoyde){
    this.x = x;
    this.y = y;
    this.width = bredde;
    this.height = hoyde;
    this.x_speed = 0;
    this.y_speed = 0;
  }

  //Gir rekkertene farge og mulighet til en plassering
  Paddle.prototype.render = function(){
    context.fillStyle = "#0000FF";
    context.fillRect(this.x, this.y, this.width, this.height);
  };

  //Lager spillerrekkerten
  function Player() {
    this.paddle = new Paddle(980, 225, 10, 50);
  }

  //Lager computerrekkerten
  function Computer() {
    this.paddle = new Paddle(10, 225, 10, 50);
  }

  //Lager ballen og gir den fart
  function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = x_speed_array[random_speed_x];
    this.y_speed = y_speed_array[random_speed_y];
    this.radius = radius;
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
    var top_x = this.x -radius;
    var top_y = this.y -radius;
    var bottom_x = this.x + radius;
    var bottom_y = this.y + radius;

    if (this.y - radius < 0) {
      this.y = radius;
      this.y_speed = -this.y_speed;
    } else if (this.y + radius > hoyde) {
      this.y = hoyde-radius;
      this.y_speed = -this.y_speed;
    }

    if (this.x < 0) {
      this.x_speed = -3;
      random_speed_y = Math.floor(Math.random()*y_speed_array.length);
      this.y_speed = y_speed_array[random_speed_y];
      this.x = bredde/2;
      this.y = hoydde/2;
      poeng_spiller_1++;
      poeng_spiller_1_ut.textContent = poeng_spiller_1;
    } else if (this.x > bredde) {
      this.x_speed = 3;
      random_speed_y = Math.floor(Math.random()*y_speed_array.length);
      this.y_speed = y_speed_array[random_speed_y];
      this.x = bredde/2;
      this.y = hoyde/2;
      poeng_spiller_2++;
      poeng_spiller_2_ut.textContent = poeng_spiller_2;
    }
    if (poeng_spiller_1_ut.textContent == 7) {
      alert("Gratulerer, spiller 1 vant!");
      //restartSpill();
      sluttSpill();
    } else if (poeng_spiller_2_ut.textContent == 7) {
      alert("Gratulerer, spiller 2 vant!");
      //restartSpill();
      sluttSpill();
    }

    if (top_x > bredde/2) {
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
    } else if (this.y + this.height > hoyde) {
      this.y = hoyde - this.height;
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
      var x_sup = [[][[]]+[]][+[]][++[+[]][+[]]];
      if (value == 38) {
        this.paddle.move(0, -4);
      } else if (value == 40) {
        this.paddle.move(0, 4);
      } else {
        this.paddle.move(0, 0);
      }
      while (x_sup == 0) {
        this.paddle.move(-1,-1);
      }
    }
  };

  if (spillere == 2) {
    //Forteller hvordan spiller 2 skal bevege seg(computer er spiller 2)
    Computer.prototype.update = function(ball) {
      for(var key in keysDown) {
        var value = Number(key);
        var x_sup = [[][[]]+[]][+[]][++[+[]][+[]]];
        if (value == 87) {
          this.paddle.move(0, -4);
        } else if (value == 83) {
          this.paddle.move(0, 4);
        } else {
          this.paddle.move(0, 0);
        }
        while (x_sup == 0) {
          this.paddle.move(-1,-1);
        }
      }
    };
  } else if (spillere == 1) {
    //Hva som skjer når computeren beveger på seg
    Computer.prototype.update = function(ball) {
      var y_pos = ball.y;
      var diff = -((this.paddle.y + (this.paddle.height/ 2)) - y_pos);
      if (diff < 0 && diff < -2) {
        diff = -2;
      } else if (diff > 0 && diff > 2) {
        diff = 2;
      }
      this.paddle.move(0, diff);
      if (this.paddle.y < 0) {
        this.paddle.y = 0;
      } else if (this.paddle.y + this.paddle.width > width) {
        this.paddle.y = width - this.paddle.width;
      }
    };
  }

  //Lager en lytter og en pausefunksjon som stopper update()
  window.addEventListener("keydown", function(event) {
    var value = event.keyCode;
    if (value === 20 || value === 27 || value === 80) {
      pauseSpill();
    }
  });

  function pauseSpill() {
    if (!pauset) {
      pauset = true;
    } else if (pauset) {
      pauset = false;
    }
  }

  //Restarter spillet i orginale posisjoner med 0 i poeng
  function restartSpill() {
    pauset = false;
    poeng_spiller_1 = 0;
    poeng_spiller_2 = 0;
    poeng_spiller_1_ut.textContent = poeng_spiller_1;
    poeng_spiller_2_ut.textContent = poeng_spiller_2;
    player = new Player();
    computer = new Computer();
    ball = new Ball(500, 250);
  }

  function sluttSpill() {
    pauset = false;
    poeng = 0;
    poeng_spiller_1_ut.textContent = poeng;
    poeng_spiller_2_ut.textContent = poeng;
    delete Player.prototype.move;
    delete Computer.prototype.move;
    delete Ball.prototype.update;
    console.log("\\|/Dette er en hyggelig error, bare ignorer :)")
    //Enten en error i koden som ikke ødelegger for noe, eller at spillet ikke fungerer ordentlig
    var spill = document.getElementById("spillDiv").outerHTML = "";
    delete spill;
    visDiv("menyDiv");
  }

  //Aktiverer spilleren, computeren og ballen
  var player = new Player();
  var computer = new Computer();
  var ball = new Ball(500, 250);
}
