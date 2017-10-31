//Funksjoner for å gjemme og vise menyer
function gjemDiv(divId) {
  var div = document.getElementById(divId);
  div.style.display = "none";
}
function visDiv(divId) {
  var div = document.getElementById(divId);
  div.style.display = "initial";
}

var myMusic

function startMusic(){
  myMusic = new sound("BeepBox-Song (2).wav");
  myMusic.play();
}

//Menyfunksjonene
document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded() {
  document.getElementById("enSpiller").onclick = function() {spiller_tall(1);};
  document.getElementById("toSpiller").onclick = function() {spiller_tall(2);};
  function spiller_tall(spiller) {
    var spillere = spiller;
    gjemDiv("menyDiv");
    pong(spillere);
  }

  //Instruksjonsmenyen
  document.getElementById("instruksjonKnapp").onclick = function() {
    gjemDiv("knappeDiv");
    visDiv("instruksjonDiv");
    var audio = new Audio('story.mp3');
    audio.play();

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
}
