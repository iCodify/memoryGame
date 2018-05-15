var gameplayInterval;
var time = 0;
var ready = true;
var gameStart = false;
var clickedCells = [];
var fieldSize = 0;

document.getElementById("slider").oninput = function() {
  document.getElementById("sizeOutput").innerHTML = this.value+"*"+this.value;
  this.size = this.value * this.value;
}

document.getElementById("start").addEventListener("click", function(){
  fieldSize = slider.size;
  document.documentElement.style.setProperty("--colNum", Math.sqrt(fieldSize));
  document.documentElement.style.setProperty("--bord", "5px");
  document.getElementById("mainMenu").hidden = true;
  document.getElementById("gameMenu").hidden = false;
  document.getElementById("field").hidden = false;
  setField();
  setUpGame();
});

function setAnswers() {
  let answers = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13];
  answers = answers.slice(0,fieldSize);
  answers.sort(function(item) {
    return .5 - Math.random();
  })
  return answers;
}

function setGameEndValue() {
  if(fieldSize % 2 === 0) {
    return fieldSize;
  }
  return (fieldSize - 1);
}

function gameTimeStart() {
  if (gameStart === false) {
    gameplayInterval = setInterval(function(){
      time++;
      document.getElementById("time1").innerHTML = time + " s";
    }, 1000);
  }
  gameStart = true;
}

function reveal(cell) {
  cell.innerHTML = cell.value;
  cell.clicked = true;
}

function hide(cell) {
  cell.innerHTML = "";
  cell.clicked = false;
}

function reset() {
  document.getElementById("time1").innerHTML = "0 s";
  clearInterval(gameplayInterval);
  time = 0;
  gameStart = false;
  clickedCells = [];
}

function setField() {
  for (let i=0; i<fieldSize; i++) {
    document.querySelector('.grid-container').innerHTML += '<button class="grid-item" id="'+i+'"></button>';
  }
}

function setUpGame() {
  let gameEndValue = setGameEndValue();
  let grid = document.getElementsByClassName("grid-item");
  let answers = setAnswers();;
  let playerGuesses = 0;

  reset();

  //use line18 in html (onClick="setUpGame()") or this below
  //document.getElementById("reset").addEventListener("click", setUpGame, false);

  for (let i = 0; i < grid.length; i++) {
    let cell = grid[i];
    cell.innerHTML = "";
    cell.value = answers[i];
    cell.clicked = false;
    cell.addEventListener("click", function(){
      if(ready === false) {
        return;
      }
      gameTimeStart();

      if (this.clicked === false && clickedCells.length<2) {
        clickedCells.push(this);
        reveal(this);
      }
      if (clickedCells.length === 2) {  
        if (clickedCells[0].value ===clickedCells[1].value) {
          playerGuesses += 2;
          if(playerGuesses===gameEndValue) {
            setTimeout(function() {
              alert("Game won in: "+document.getElementById("time1").innerHTML);
              clearInterval(gameplayInterval);
            }, 250);
            playerGuesses = 0;
          }
          clickedCells = [];
        }
        else {
          ready = false;
          setTimeout(function() {
            hide(clickedCells[0]);
            hide(clickedCells[1]);

            clickedCells = [];

            ready = true;
          }, 150);
        }
      }
    });
  }
}