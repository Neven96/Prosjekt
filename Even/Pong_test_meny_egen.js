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
  var historieLesing = new Audio('musikk/story.mp3');

  document.getElementById("enSpiller").onclick = function() {spiller_tall(1);};
  document.getElementById("toSpiller").onclick = function() {spiller_tall(2);};
  function spiller_tall(spiller) {
    var spillere = spiller;
    gjemDiv("knappeDiv");
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
}
