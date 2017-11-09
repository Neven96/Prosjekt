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
  menyMusikk = new sound('musikk/Meny.wav', "true", 0.8, "menyMusikk");
  menyMusikk.play();

  document.getElementById("enSpiller").onclick = function() {spiller_tall(1);};
  document.getElementById("toSpiller").onclick = function() {spiller_tall(2);};
  function spiller_tall(spiller) {
    var spillere = spiller;
    gjemDiv("knappeDiv");
    if (document.getElementById("tekstDiv")) {
      gjemDiv("tekstDiv");
    }
    historieLesing.pause();
    document.getElementById("menyMusikk").outerHTML = "";
    pong(spillere);
  }

  //Instruksjonsmenyen
  document.getElementById("instruksjonKnapp").onclick = function() {
    gjemDiv("knappeDiv");
    visDiv("instruksjonDiv");
  };
  document.getElementById("instruksjonTilbakeMeny").onclick = function() {
    gjemDiv("instruksjonDiv");
    visDiv("knappeDiv");

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

  document.getElementById("kreditKnapp").onclick = function() {
    gjemDiv("knappeDiv");
    visDiv("kreditDiv");
  };
  document.getElementById("kreditTilbakeMeny").onclick = function() {
    gjemDiv("kreditDiv");
    visDiv("knappeDiv");
  };

  document.getElementById("muteKnapp").onclick = function() {
    if (!pausetMusikk) {
      menyMusikk.stop();
      historieLesing.pause();
      if (document.getElementById("tekstDiv")) {
        gjemDiv("tekstDiv");
      }
      pausetMusikk = true;
  } else if (pausetMusikk) {
      menyMusikk.play();
      pausetMusikk = false;
    }
  };
  historieLesing.play();

  // Funksjon for å få liste til å rulle
  $('#fade').list_ticker({
      speed:5000,
      effect:'fade'
  });
  setTimeout(function(){
    document.getElementById("tekstDiv").outerHTML = "";
  }, 25000);
}

var menyMusikk;
var pausetMusikk = false;

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

function startMusikk() {
  menyMusikk = new sound('musikk/Meny.wav', "true", 0.8, "menyMusikk");
  if (!pausetMusikk) {
    menyMusikk.play();
  }
}
