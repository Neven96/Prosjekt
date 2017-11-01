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
  //Arrays for å få en tilfeldig rettning på ballen ved starten av spillet
  var x_fart_array = [-ball_fart_x-bonus_fart,ball_fart_x+bonus_fart];
  var y_fart_array = [-1,-0.75,-0.5,-0.25,0,0,0.25,0.5,0.75,1];
  var random_fart_x = Math.floor(Math.random()*x_fart_array.length);
  var random_fart_y = Math.floor(Math.random()*y_fart_array.length);
  var poeng_spiller_1 = 0;
  var poeng_spiller_2 = 0;
  //Størrelse- og posisjonsvariabler, endre disse for endringer på paddler og ball
  var rekkert_bredde = 15;
  var rekkert_hoyde = 75;
  var rekkert_pos_y = hoyde/2-rekkert_hoyde/2;
  var s1_rekkert_pos_x = bredde-rekkert_bredde-10;
  var s2_rekkert_pos_x = 10;
  var radius = 9;
  var pauset = false;
  var pausetMusikk = false;
  var pausetSFX = false;
  var spillMusikk;
  var vinnerMusikk;
  var taperMusikk;
  var sprett1;
  var sprett2;
  var musX;
  var musY;
  var keysDown = {};
  var s1_farge_paddle_valg = document.getElementById("paddleSpiller1");
  var s2_farge_paddle_valg = document.getElementById("paddleSpiller2");
  var s1_farge_bane_valg = document.getElementById("baneSpiller1");
  var s2_farge_bane_valg = document.getElementById("baneSpiller2");
  var bane_farge = {'Red': '#FF3333',
                    'Blue': '#3333FF',
                    'Green': '#33FF33',};
  var paddle_farge = {'Red': '#8B0000',
                      'Blue': '#00008B',
                      'Green': '#008B00',};
  var s1_farge_paddle = paddle_farge[s1_farge_paddle_valg.value];
  var s2_farge_paddle = paddle_farge[s2_farge_paddle_valg.value];
  var s1_farge_bane = bane_farge[s1_farge_bane_valg.value];
  var s2_farge_bane = bane_farge[s2_farge_bane_valg.value];

  //Gir rammen farge med gradvis overgang til hvit og plasserer rekkertene og ballen innenfor rammen
  var render = function(){
    var gradientVenstre = innhold.createLinearGradient(-bredde/3, hoyde/2, bredde/2, hoyde/2);
    gradientVenstre.addColorStop(0, "#FFFFFF");
    gradientVenstre.addColorStop(1, s2_farge_bane);
    innhold.fillStyle = gradientVenstre;
    innhold.fillRect(0,0,bredde,hoyde);
    var gradientHoyre = innhold.createLinearGradient(bredde/2, hoyde/2, bredde+bredde/3, hoyde/2);
    gradientHoyre.addColorStop(0, s1_farge_bane);
    gradientHoyre.addColorStop(1, "#FFFFFF");
    innhold.fillStyle = gradientHoyre;
    innhold.fillRect(bredde/2,0,bredde,hoyde);
    //Poengscore
    innhold.fillStyle = "#000000";
    innhold.font = "30px Comic Sans MS";
    innhold.fillText(poeng_spiller_2,(bredde/2)-25,25);
    innhold.fillText(poeng_spiller_1,(bredde/2)+5,25);
    //Henter fram knapper for pausemeny, og seier/tap
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

  //Veldig viktig linje som må stå akkurat her, og som sørger for at hele canvasen faktisk dukker opp
  //https://stackoverflow.com/questions/6065169/requestanimationframe-with-this-keyword er hvorfor den fungerer
  animate(this.step.bind(this));

  //Lager et paddle-objekt, gir det posisjon, størrelse og fart
  function Paddle(x, y, bredde, hoyde, farge){
    this.x = x;
    this.y = y;
    this.width = bredde;
    this.height = hoyde;
    this.x_fart = 0;
    this.y_fart = 0;
    this.farge = farge;
  }

  //Gir paddlene farge og gjør dem klare for å bli laget
  Paddle.prototype.render = function(){
    innhold.fillStyle = this.farge;
    innhold.fillRect(this.x, this.y, this.width, this.height);
  };

  //Lager paddlen til Spiller 1, som er spilleren til høyre
  function Spiller1() {
    this.paddle = new Paddle(s1_rekkert_pos_x, rekkert_pos_y, rekkert_bredde, rekkert_hoyde, s1_farge_paddle);
  }

  //Lager paddlen til Spiller 2, som er spilleren til venstre, eller computeren
  function Spiller2() {
    this.paddle = new Paddle(s2_rekkert_pos_x, rekkert_pos_y, rekkert_bredde, rekkert_hoyde, s2_farge_paddle);
  }

  //Lager et ballobjekt, gir den størrelse og gir den fart
  function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_fart = x_fart_array[random_fart_x];
    this.y_fart = y_fart_array[random_fart_y];
    this.radius = radius;
  }

  //Plasserer paddlen til spiller 1 innenfor rammen
  Spiller1.prototype.render = function() {
    this.paddle.render();
  };

  //Plasserer paddlen til spiller 2/computeren innenfor rammen
  Spiller2.prototype.render = function() {
    this.paddle.render();
  };

  //Lager ballen og gir den farge og gjør den klar for å plasseres
  Ball.prototype.render = function() {
    innhold.beginPath();
    innhold.arc(this.x, this.y, this.radius, 2*Math.PI, false);
    innhold.fillStyle = "#FFFFFF";
    innhold.fill();
    innhold.lineWidth = 3;
    innhold.strokeStyle = "#000000";
    innhold.stroke();
    innhold.closePath();
  };

  //Gir ballen fart og oppdaterer farten for hver ramme, og når rekkertene treffer den
  Ball.prototype.update = function(paddle1, paddle2){
    this.x += this.x_fart;
    this.y += this.y_fart;
    var topp_x = this.x -radius;
    var topp_y = this.y -radius;
    var bunn_x = this.x + radius;
    var bunn_y = this.y + radius;

    //Hva som skjer når ballen treffer en av kantene oppe og nede på banen
    if (this.y - radius < 0) {
      this.y = radius;
      this.y_fart = -this.y_fart;
    } else if (this.y + radius > hoyde) {
      this.y = hoyde-radius;
      this.y_fart = -this.y_fart;
    }

    //Hva som skjer når ballen treffer høyre eller venstre side, dvs. at en av spillerne scorer
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
    //Når en av spillerne/computeren vinner
    if (spillere == 1) {
      if (poeng_spiller_1 === 7) {
        vinnSpill();
        if (!pausetMusikk) {
          vinnerMusikk = new Audio('musikk/Vinner.wav');
          vinnerMusikk.play();
        }
      } else if (poeng_spiller_2 === 7) {
        vinnSpill();
        if (!pausetMusikk) {
          taperMusikk = new Audio('musikk/Taper.wav');
          taperMusikk.play();
        }
      }
    } else if (spillere == 2) {
        if (poeng_spiller_1 === 7 || poeng_spiller_2 === 7) {
          vinnSpill();
          if (!pausetMusikk) {
            vinnerMusikk = new Audio('musikk/Vinner.wav');
            vinnerMusikk.play();
        }
      }
    }

    //Hvordan ballen treffer paddlene og hva som defineres som treffområde på paddlene
    //Når ballen treffer spiller 1
    if (topp_x > bredde/2) {
      if (topp_x < (paddle1.x + paddle1.width) && bunn_x > paddle1.x && topp_y < (paddle1.y + paddle1.height) && bunn_y > paddle1.y) {
        this.x_fart = -ball_fart_x-bonus_fart;
        this.y_fart += (paddle1.y_fart / 2);
        this.x += this.x_fart;
        if (!pausetSFX) {
          sprett1 = new Audio('musikk/Sprett1.wav');
          sprett1.play();
        }
      }
    //Når ballen treffer spiller 2
    } else {
      if (topp_x < (paddle2.x + paddle2.width) && bunn_x > paddle2.x && topp_y < (paddle2.y + paddle2.height) && bunn_y > paddle2.y) {
        this.x_fart = ball_fart_x+bonus_fart;
        this.y_fart += (paddle2.y_fart / 2);
        this.x += this.x_fart;
        if (!pausetSFX) {
          var sprett2 = new Audio('musikk/Sprett2.wav');
          sprett2.play();
        }
      }
    }
  };

  //Forteller hva som skjer når en paddle beveger seg, og hvor langt den kan bevege seg(så den ikke kan gå utenfor banen)
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

  //Når man trykker på en knapp, enten for å bevege paddlen, pause spillet eller pause musikk/lydeffekter
  window.addEventListener("keydown", trykkKnapp);
  function trykkKnapp(event) {
    keysDown[event.keyCode] = true;
    var value = event.keyCode;
    //27 = ESC, 80 = p
    if (value === 20 || value === 27 || value === 80) {
      pauseSpill();
    }
    //77 = m, 78 = n
    if (value === 77) {
      pauseMusikk();
    }
    if (value === 78) {
      pauseSFX();
    }
  }

  //Sletter knappetrykket så paddlene ikke fortsetter å bevege seg etter å ha sluppet knappen
  window.addEventListener("keyup", slippKnapp);
  function slippKnapp(event) {
    delete keysDown[event.keyCode];
  }

  //Forteller hvordan spiller 1 skal bevege seg og med hvilke knapper
  //(38 = opp-pil, 40 = ned-pil)
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

  //Bestemmer om man spiller enspiller eller tospiller
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
    //Forteller hvordan spiller 2 skal bevege seg og med hvilke knapper
    //87 = W, 83 = S
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

  //Pauser spillet og setter opp knapper for enten restart eller tilbake til meny
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

  function pauseMusikk() {
    if (!pausetMusikk) {
      spillMusikk.stop();
      pausetMusikk = true;
  } else if (pausetMusikk) {
      spillMusikk.play();
      pausetMusikk = false;
    }
  }

  function pauseSFX(){
    if (!pausetSFX){
      pausetSFX = true;
    } else if (pausetSFX){
      pausetSFX = false;
    }
  }

  //Når man vinner spillet så kommer man hit, den setter opp alt til videre,
  //enten restarte spillet eller tilbake til meny
  //render() er der en siste gang for at poengene skal oppdatere seg
  //ellers vil det bare stå 6 poeng, istedenfor 7 når spillet er vunnet
  function vinnSpill() {
    render();
    pauseSpill();
    spillMusikk.stop();
    bane.addEventListener("mousemove", sjekkPos);
    bane.addEventListener("mouseup", sjekkKlikk);
  }

  //Lager firkanter i canvas for knapper for å enten restarte spillet eller å gå tilbake til menyen
  function sluttKnapper() {
    innhold.lineWidth = "4";
    innhold.strokeStyle = "#000000";
    innhold.rect(bredde/4-2,hoyde*1/2-2,bredde/5+4,hoyde/5+4);
    innhold.rect(bredde*3/4-bredde/5-2,hoyde*1/2-2,bredde/5+4,hoyde/5+4);
    innhold.stroke();
    innhold.fillStyle = "#6495ED";
    innhold.fillRect(bredde/4,hoyde*1/2,bredde/5,hoyde/5);
    innhold.fillRect(bredde*3/4-bredde/5,hoyde*1/2,bredde/5,hoyde/5);
    innhold.fillStyle = "#000000";
    innhold.font = "30px Comic Sans MS";
    //Hvis du spiller enspiller skal du kunne gå videre, men i tospiller skal du bare starte på nytt
    if (spillere == 1 && poeng_spiller_1 == 7) {
      innhold.fillText("Videre", bredde/4+bredde/20, hoyde*1/2+hoyde/9);
    } else if (spillere == 2 || pauset) {
      innhold.fillText("Start på nytt", bredde/4+bredde/100, hoyde*1/2+hoyde/9);
    }
    innhold.fillText("Gå til menyen", bredde*3/4-bredde/5+bredde/100, hoyde*1/2+hoyde/9);
    innhold.font = "50px Comic Sans MS";
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

  //Sjekker hvor musepekeren er innenfor canvasen og gjør det mulig å trykke på knapper
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

  //Sjekker om du trykker med musa, og om du er innenfor posisjonen til knappene i canvasen
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
    if(!pausetMusikk){
      spillMusikk.play();
    }
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
    //Denne delete biten vil lage en error, men den erroren er ikke farlig og gjør ikke noe for videre spilling
    //Uten denne delete biten vil alle objekter i canvasen bevege seg dobbelt så fort hver gang man går inn og ut av menyen
    //Enten en error i koden som ikke ødelegger for noe, eller at spillet ikke fungerer ordentlig
    delete Ball.prototype.update;
    console.log("\\|/Dette er en hyggelig error, bare ignorer :)");
    //Sletter hele diven som spillet ligger inni når du avslutter spillet
    document.getElementById("spillDiv").outerHTML = "";
    document.getElementById("spillMusikk").outerHTML = "";
    window.removeEventListener("keydown", trykkKnapp);
    window.removeEventListener("keyup", slippKnapp);
    visDiv("knappeDiv");
    var menyMusikk = new sound('musikk/Meny.wav', "true", 0.8, "menyMusikk");
    if (!pausetMusikk) {
      menyMusikk.play();
    }
  }

  spillMusikk = new sound("musikk/Spillmusikk.wav", "true", 0.5, "spillMusikk");
  spillMusikk.play();

  //Aktiverer spiller 1, spiller 2 og ballen
  var spiller1 = new Spiller1();
  var spiller2 = new Spiller2();
  var ball = new Ball(bredde/2, hoyde/2);
}
