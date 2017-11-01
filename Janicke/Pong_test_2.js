function pong(spillere) {
  //Lager en div for å holde canvas i
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
  var innhold = bane.getContext("2d");
  document.getElementById("spillDiv").appendChild(bane);

  //Variabler for fart, størrelse og bevegelse
  var spiller_fart = 4;
  var computer_fart = 3;
  var ball_fart_x = 5;
  var bonus = 0;
  var bonus_fart = 0;
  var x_fart_array = [-ball_fart_x-bonus_fart,ball_fart_x+bonus_fart];
  var y_fart_array = [-1,-0.75,-0.5,-0.25,0,0,0.25,0.5,0.75,1];
  var random_fart_x = Math.floor(Math.random()*x_fart_array.length);
  var random_fart_y = Math.floor(Math.random()*y_fart_array.length);
  var poeng_spiller_1 = 0;
  var poeng_spiller_2 = 0;
  var rekkert_bredde = 15;
  var rekkert_hoyde = 75;
  var rekkert_pos_y = hoyde/2-rekkert_hoyde/2;
  var s1_rekkert_pos_x = bredde-rekkert_bredde-10;
  var s2_rekkert_pos_x = 10;
  var radius = 7.5;
  var pauset = false;
  var musX;
  var musY;

  //Gir rammen farge og plasserer rekkertene og ballen innenfor rammen
  var render = function(){
    var gradientVenstre = innhold.createLinearGradient(-bredde/10, hoyde/2, bredde/2, hoyde/2);
    gradientVenstre.addColorStop(0, "#FFFFFF");
    gradientVenstre.addColorStop(1, "#FF0000");
    innhold.fillStyle = gradientVenstre;
    innhold.fillRect(0,0,bredde,hoyde);
    var gradientHoyre = innhold.createLinearGradient(bredde/2, hoyde/2, bredde+bredde/10, hoyde/2);
    gradientHoyre.addColorStop(0, "#00FF00");
    gradientHoyre.addColorStop(1, "#FFFFFF");
    innhold.fillStyle = gradientHoyre;
    innhold.fillRect(bredde/2,0,bredde,hoyde);
    innhold.fillStyle = "#000000";
    innhold.font = "20px font1";
    innhold.fillText(poeng_spiller_2,(bredde/2)-25,25);
    innhold.fillText(poeng_spiller_1,(bredde/2)+5,25);
    if (poeng_spiller_1 == 7 || poeng_spiller_2 == 7 || pauset) {
      sluttKnapper();
    }
    spiller1.render();
    spiller2.render();
    ball.render();
  };

  //Oppdaterer rekkertene og ballen
  var update = function(){
    spiller1.update();
    spiller2.update(ball);
    ball.update(spiller1.paddle, spiller2.paddle);
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
    this.x_fart = 0;
    this.y_fart = 0;
  }

  //Gir rekkertene farge og mulighet til en plassering
  Paddle.prototype.render = function(){
    innhold.fillStyle = "#0000FF";
    innhold.fillRect(this.x, this.y, this.width, this.height);
  };

  //Lager spillerrekkerten
  function Spiller1() {
    this.paddle = new Paddle(s1_rekkert_pos_x, rekkert_pos_y, rekkert_bredde, rekkert_hoyde);
  }

  //Lager computerrekkerten
  function Spiller2() {
    this.paddle = new Paddle(s2_rekkert_pos_x, rekkert_pos_y, rekkert_bredde, rekkert_hoyde);
  }

  //Lager ballen og gir den fart
  function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_fart = x_fart_array[random_fart_x];
    this.y_fart = y_fart_array[random_fart_y];
    this.radius = radius;
  }

  //Plasserer spillerrekkerten innenfor rammen
  Spiller1.prototype.render = function() {
    this.paddle.render();
  };

  //Plasserer computerrekkerten innenfor rammen
  Spiller2.prototype.render = function() {
    this.paddle.render();
  };

  //Lager ballen og gir den farge og mulighet til plassering
  Ball.prototype.render = function() {
    innhold.beginPath();
    innhold.arc(this.x, this.y, this.radius, 2*Math.PI, false);
    innhold.fillStyle = "#000000";
    innhold.fill();
  };

  //Gir ballen fart og oppdaterer farten for hver ramme, og når rekkertene treffer den
  Ball.prototype.update = function(paddle1, paddle2){
    this.x += this.x_fart;
    this.y += this.y_fart;
    var topp_x = this.x -radius;
    var topp_y = this.y -radius;
    var bunn_x = this.x + radius;
    var bunn_y = this.y + radius;

    if (this.y - radius < 0) {
      this.y = radius;
      this.y_fart = -this.y_fart;
    } else if (this.y + radius > hoyde) {
      this.y = hoyde-radius;
      this.y_fart = -this.y_fart;
    }

    if (this.x < 0) {
      this.x_fart = -ball_fart_x-bonus_fart;
      random_fart_y = Math.floor(Math.random()*y_fart_array.length);
      this.y_fart = y_fart_array[random_fart_y];
      this.x = bredde/2;
      this.y = hoyde/2;
      poeng_spiller_1++;
    } else if (this.x > bredde) {
      this.x_fart = ball_fart_x+bonus_fart;
      random_fart_y = Math.floor(Math.random()*y_fart_array.length);
      this.y_fart = y_fart_array[random_fart_y];
      this.x = bredde/2;
      this.y = hoyde/2;
      poeng_spiller_2++;
    }
    if (poeng_spiller_1 === 7 || poeng_spiller_2 === 7) {
      vinnSpill();
    }

    if (topp_x > bredde/2) {
      if (topp_x < (paddle1.x + paddle1.width) && bunn_x > paddle1.x && topp_y < (paddle1.y + paddle1.height) && bunn_y > paddle1.y) {
        this.x_fart = -ball_fart_x-bonus_fart;
        this.y_fart += (paddle1.y_fart / 2);
        this.x += this.x_fart;
      }
    } else {
      if (topp_x < (paddle2.x + paddle2.width) && bunn_x > paddle2.x && topp_y < (paddle2.y + paddle2.height) && bunn_y > paddle2.y) {
        this.x_fart = ball_fart_x+bonus_fart;
        this.y_fart += (paddle2.y_fart / 2);
        this.x += this.x_fart;
      }
    }
  };

  //Forteller hva som skjer når en rekkert beveger seg, og hvor langt den kan bevege seg
  Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_fart = x;
    this.y_fart = y;
    if (this.y < 0) {
      this.y = 0;
      this.y_fart = 0;
    } else if (this.y + this.height > hoyde) {
      this.y = hoyde - this.height;
      this.y_fart = 0;
    }
  };

  var keysDown = {};

  //Når man trykker på en knapp
  window.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
    var value = event.keyCode;
    if (value === 20 || value === 27 || value === 80) {
      pauseSpill();
    }
    if (value === 77) {
      pauseMusikk(musikk);
    }
    if (value === 78) {
      pauseMusikk(effekter);
    }
  });

  //Når man slipper knappen
  window.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode];
  });

  //Forteller hvordan spilleren skal bevege seg
  Spiller1.prototype.update = function() {
    for(var key in keysDown) {
      var value = Number(key);
      if (value == 38) {
        this.paddle.move(0, -spiller_fart-bonus_fart);
      } else if (value == 40) {
        this.paddle.move(0, spiller_fart+bonus_fart);
      } else {
        this.paddle.move(0, 0);
      }
    }
  };

  if (spillere == 1) {
    //Hva som skjer når computeren beveger på seg
    Spiller2.prototype.update = function(ball) {
      var y_pos = ball.y;
      var diff = -((this.paddle.y + (this.paddle.height/ 2)) - y_pos);
      if (diff < 0 && diff < -computer_fart-bonus_fart) {
        diff = -computer_fart-bonus_fart;
      } else if (diff > 0 && diff > computer_fart+bonus_fart) {
        diff = computer_fart+bonus_fart;
      }
      this.paddle.move(0, diff);
      if (this.paddle.y < 0) {
        this.paddle.y = 0;
      } else if (this.paddle.y + this.paddle.width > bredde) {
        this.paddle.y = bredde - this.paddle.width;
      }
    };
  } else if (spillere == 2) {
    //Forteller hvordan spiller 2 skal bevege seg
    Spiller2.prototype.update = function(ball) {
      for(var key in keysDown) {
        var value = Number(key);
        if (value == 87) {
          this.paddle.move(0, -spiller_fart-bonus_fart);
        } else if (value == 83) {
          this.paddle.move(0, spiller_fart+bonus_fart);
        } else {
          this.paddle.move(0, 0);
        }
      }
    };
  }

  function pauseSpill() {
    if (!pauset) {
      pauset = true;
      bane.addEventListener("mousemove", sjekkPos);
      bane.addEventListener("mouseup", sjekkKlikk);
    } else if (pauset) {
      bane.removeEventListener("mousemove", sjekkPos);
      bane.removeEventListener("mouseup", sjekkKlikk);
      pauset = false;
    }
  }

  function pauseMusikk(lyd) {
    if (lyd.play()) {
      lyd.pause();
    } else if (lyd.pause()) {
      lyd.play();
    }
  }

  function vinnSpill() {
    render();
    pauseSpill();
    bane.addEventListener("mousemove", sjekkPos);
    bane.addEventListener("mouseup", sjekkKlikk);
  }

  function sluttKnapper() {
    innhold.lineWidth = "1";
    innhold.strokeStyle = "#000000";
    innhold.rect(bredde/4-2,hoyde*1/2-2,bredde/5+4,hoyde/5+4);
    innhold.rect(bredde*3/4-bredde/5-2,hoyde*1/2-2,bredde/5+4,hoyde/5+4);
    innhold.stroke();
    innhold.fillStyle = "rgba(255, 255, 255, 0.4)";
    innhold.fillRect(bredde/4,hoyde*1/2,bredde/5,hoyde/5);
    innhold.fillRect(bredde*3/4-bredde/5,hoyde*1/2,bredde/5,hoyde/5);
    innhold.fillStyle = "#000000";
    innhold.font = "14px font1";
    if (spillere == 1 && poeng_spiller_1 == 7) {
      innhold.fillText("Videre", bredde/4+bredde/100, hoyde*1/2+hoyde/9);
    } else if (spillere == 2 || pauset) {
      innhold.fillText("Start på nytt", bredde/4+bredde/100, hoyde*1/2+hoyde/9);
    }
    innhold.fillText("Gå til menyen", bredde*3/4-bredde/5+bredde/100, hoyde*1/2+hoyde/9);
    innhold.font = "24px font1";
    if (spillere == 1) {
      if (poeng_spiller_1 == 7) {
        innhold.fillText("Gratulerer du vant!", bredde*1/4, hoyde*1/3);
      } else if (poeng_spiller_2 == 7) {
        innhold.fillText("Du tapte...", bredde*2/5, hoyde*1/3);
      }
    } else if (spillere == 2) {
      if (poeng_spiller_1 == 7) {
        innhold.fillText("Gratulerer spiller 1 vant!", bredde*1/4, hoyde*1/3);
      } else if (poeng_spiller_2 == 7) {
        innhold.fillText("Gratulerer spiller 2 vant!", bredde*1/4, hoyde*1/3);
      }
    }
  }

  function sjekkPos(mouseEvent) {
    musX = mouseEvent.pageX - this.offsetLeft;
    musY = mouseEvent.pageY - this.offsetTop;

    if (mouseEvent.pageX || mouseEvent.pageY == 0) {
      musX = mouseEvent.pageX - this.offsetLeft;
      musY = mouseEvent.pageY - this.offsetTop;
    } else if (mouseEvent.offsetX || mouseEvent.offsetY == 0) {
      musX = mouseEvent.offsetX;
      musY = mouseEvent.offsetY;
    }
  }

  function sjekkKlikk(mouseEvent) {
    if (musX > bredde/4 && musX < bredde/4 + bredde/5) {
      if (musY > hoyde*1/2 && musY < hoyde*1/2 + hoyde/5) {
        restartSpill();
      }
    }
    if (musX > bredde*3/4-bredde/5 && musX < bredde*3/4 + bredde/5) {
      if (musY > hoyde*1/2 && musY < hoyde*1/2 + hoyde/5) {
        sluttSpill();
      }
    }
  }

  //Restarter spillet i orginale posisjoner med 0 i poeng
  function restartSpill() {
    pauseSpill();
    poeng_spiller_1 = 0;
    poeng_spiller_2 = 0;
    if (spillere == 1 && poeng_spiller_1 == 7) {
      bonus += 2.5;
      bonus_fart += Math.pow(bonus,2)/100;
    }
    x_fart_array = [-ball_fart_x-bonus_fart,ball_fart_x+bonus_fart];
    random_fart_x = Math.floor(Math.random()*x_fart_array.length);
    spiller1 = new Spiller1();
    spiller2 = new Spiller2();
    ball = new Ball(bredde/2, hoyde/2);
    bane.removeEventListener("mousemove", sjekkPos);
    bane.removeEventListener("mouseup", sjekkKlikk);
  }

  //Avslutter spillet og returnerer til menyen
  function sluttSpill() {
    pauseSpill();
    poeng_spiller_1 = 0;
    poeng_spiller_2 = 0;
    bonus = 0;
    bonus_fart = 0;
    delete Ball.prototype.update;
    console.log("\\|/Dette er en hyggelig error, bare ignorer :)");
    //Enten en error i koden som ikke ødelegger for noe, eller at spillet ikke fungerer ordentlig
    document.getElementById("spillDiv").outerHTML = "";
    visDiv("knappeDiv");
  }

  //Aktiverer spilleren, computeren og ballen
  var spiller1 = new Spiller1();
  var spiller2 = new Spiller2();
  var ball = new Ball(bredde/2, hoyde/2);
}
