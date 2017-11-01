//Funksjoner for å gjemme og vise menydiver
function gjemDiv(divId) {
  var div = document.getElementById(divId);
  div.style.display = "none";
}
function visDiv(divId) {
  var div = document.getElementById(divId);
  div.style.display = "initial";
}

//Menyfunksjonene
document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded() {
  var historieLesing = new Audio('musikk/Historie.mp3');
  var menyMusikk = new sound('musikk/Meny.wav', "true", 0.8, "menyMusikk");
  var pausetMusikk = false;
  menyMusikk.play();

  document.getElementById("enSpiller").onclick = function() {spiller_tall(1);};
  document.getElementById("toSpiller").onclick = function() {spiller_tall(2);};
  function spiller_tall(spiller) {
    var spillere = spiller;
    gjemDiv("knappeDiv");
    document.getElementById("menyMusikk").outerHTML = "";
    pong(spillere);
  }

  //Instruksjonsmenyen
  document.getElementById("instruksjonKnapp").onclick = function() {
    gjemDiv("knappeDiv");
    visDiv("instruksjonDiv");
    historieLesing.currentTime = 0;
    historieLesing.play();
  };
  document.getElementById("instruksjonTilbakeMeny").onclick = function() {
    gjemDiv("instruksjonDiv");
    visDiv("knappeDiv");
    historieLesing.pause();
  };

  //Innstillingsmenyen
  document.getElementById("innstillingKnapp").onclick = function() {
    gjemDiv("knappeDiv");
    visDiv("innstillingDiv");
  };
  document.getElementById("innstillingTilbakeMeny").onclick = function() {
    gjemDiv("innstillingDiv");
    visDiv("knappeDiv");
  };

  document.getElementById("muteKnapp").onclick = function() {
    if (!pausetMusikk) {
      menyMusikk.stop();
      pausetMusikk = true;
  } else if (pausetMusikk) {
      menyMusikk.play();
      pausetMusikk = false;
    }
  };
}

function sound(src, gjenta, volum, id) {
  this.sound = document.createElement("audio");
  this.sound.id = id;
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.loop = gjenta;
  this.sound.volume = volum;
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
      this.sound.play();
  };
  this.stop = function(){
      this.sound.pause();
  };
}
