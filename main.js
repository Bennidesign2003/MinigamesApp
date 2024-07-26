//Variables
const cells = document.querySelectorAll(".cell");
const titleHeader = document.querySelector("#titleHeader");
const xPlayerDisplay = document.querySelector("#xPlayerDisplay");
const oPlayerDisplay = document.querySelector("#oPlayerDisplay");
const restartBtn = document.querySelector("#restartBtn");

//Initialize Variables for the game
let player = 'X';
let playerGame = '';
let otherPlayer = '';
let isPauseGame = false;
let isGameStart = false;

//Array of win conditions
const inputCells = ['', '', '',
                    '', '', '',
                    '', '', ''];

//Array of win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //Columns
    [0, 4, 8], [2, 4, 6] //Diagonal
]

//Add Click Event Listener to each cell
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => tapCell(cell, index));
});

function tapCell(cell, index){
    //Ensure cell is empty and game isn't pause
    if(cell.textContent == '' &&
        !isPauseGame
    ){
    
        if(!isGameStart){
            playerGame = player;
            otherPlayer = player == "X" ? "O" : "X";
        }

        isGameStart = true;
        updateCell(cell, index);

        //Do a random pick if there are no results
        if(!checkWinner()){
            changePlayer();

            if(player == "X"){
                xPlayerDisplay.classList.add("player-active");
                oPlayerDisplay.classList.remove("player-active");
            }
            else{
                xPlayerDisplay.classList.remove("player-active");
                oPlayerDisplay.classList.add("player-active");
            }

            let cellPickOtherPlayer = Math.floor(Math.random() * 10);

            //Choose if random or not
            console.log(checkWinDouble());
            console.log(cellPickOtherPlayer)
            if(checkWinDouble() != undefined && cellPickOtherPlayer <= 6) {cellPick(checkWinDouble());}
            else {randomPick();}

            //Load Audio
            var audio = new Audio("wood-audio.mp3");
            audio.play();
        }
    }
}

function updateCell(cell, index){
    cell.textContent = player;
    inputCells[index] = player;
    cell.style.color = (player == 'X') ? "#1892EA" : "#A737FF";
}

function changePlayer(){
    player = (player == 'X') ? 'O' : 'X';
}

function checkWinDouble(){
    for(const [a, b, c] of winConditions){
        //Check each winning condition
        if(inputCells[a] == playerGame &&
           inputCells[b] == playerGame
        ){
            if(inputCells[c] != '') return undefined;
            else return [c];
        }
        else if(inputCells[c] == playerGame &&
            inputCells[a] == playerGame){
                if(inputCells[b] != '') return undefined;
                else return [b];
            }
        else if(inputCells[b] == playerGame &&
            inputCells[c] == playerGame){
                if(inputCells[a] != '') return undefined;
                else return [a];
            }
    }
}

function checkWinDoubleOtherPlayer(){
    for(const [a, b, c] of winConditions){
        //Check each winning condition
        if(inputCells[a] == otherPlayer &&
           inputCells[b] == otherPlayer
        ){
            if(inputCells[c] != '') return undefined;
            else return [c];
        }
        else if(inputCells[c] == otherPlayer &&
            inputCells[a] == otherPlayer){
                if(inputCells[b] != '') return undefined;
                else return [b];
            }
        else if(inputCells[b] == otherPlayer &&
            inputCells[c] == otherPlayer){
                if(inputCells[a] != '') return undefined;
                else return [a];
            }
    }
}

function checkWinner(){
    //checkWinDouble();
    //console.log(checkWinDouble());

    for(const [a, b, c] of winConditions){
        //Check each winning condition
        if(inputCells[a] == player &&
           inputCells[b] == player &&
           inputCells[c] == player
        ){
            declareWinner([a, b, c]);
        }

        //Load Audio
        if(inputCells[a] == playerGame &&
            inputCells[b] == playerGame &&
            inputCells[c] == playerGame
         ){
             declareWinner([a, b, c]);
             var audio = new Audio("won-game.mp3");
             audio.play();

            checkSelectedPlayer();

            //Higlight X display
             return true;
         } else if(inputCells[a] == otherPlayer &&
            inputCells[b] == otherPlayer &&
            inputCells[c] == otherPlayer
         ){
            declareWinner([a, b, c]);
            var audio = new Audio("losed-game.mp3");
            audio.play();
            return true;
         }
    }

    //Check for a draw (if cells are filled)
    if(inputCells.every(cell => cell != '')){
        declareDraw();
        var audio = new Audio("draw-game.mp3");
        audio.play();
        return true;
    };
}

function declareWinner(winningIndices){
    titleHeader.textContent = `${player} Win`;
    isPauseGame = true;

    //Highlight winning cells
    winningIndices.forEach((index) => {
        cells[index].style.background = '#2A2343';
    })

    restartBtn.style.visibility = 'visible';
}

function declareDraw(){
    titleHeader.textContent = 'Draw!';
    isPauseGame = true;
    restartBtn.style.visibility = 'visible';
}

function cellPick(index){
    //Pause the game to allow computer to pick
    isPauseGame = true;
    
    setTimeout(() => {
        //Update the cell with computer move
        updateCell(cells[index], index, player);

        //Check if computer not won
        if(!checkWinner()){
            checkSelectedPlayer();
            changePlayer();

             //Load Audio
             var audio = new Audio("wood-audio.mp3");
             audio.play();

            //Switch back to human player
            isPauseGame = false;
            return;
        }
        //changePlayer();
    }, 1000);
}

function randomPick(){
    //Pause the game to allow computer to pick
    isPauseGame = true;

    setTimeout(() => {
        let randomIndex;
        do{
            //Pick a random index
            randomIndex = Math.floor(Math.random() * inputCells.length);
        } while(
            //Ensure the choosen cell is empty
            inputCells[randomIndex] != ''
        )

        //Update the cell with computer move
        updateCell(cells[randomIndex], randomIndex, player);

        //Check if computer not won
        if(!checkWinner()){
            checkSelectedPlayer();
            changePlayer();

             //Load Audio
             var audio = new Audio("wood-audio.mp3");
             audio.play();

            //Switch back to human player
            isPauseGame = false;
            return;
        }
        //changePlayer();
    }, 1000);
}

function choosePlayer(selectedPlayer){
    //Ensure the game hasn't started
    if(!isGameStart){
        //Override the selected player value
        player = selectedPlayer;
       checkSelectedPlayer();
    }
}

function checkSelectedPlayer(){
    if(playerGame == "X"){
        xPlayerDisplay.classList.add("player-active");
        oPlayerDisplay.classList.remove("player-active");
    }
    else{
        xPlayerDisplay.classList.remove("player-active");
        oPlayerDisplay.classList.add("player-active");
    }
}

restartBtn.addEventListener("click", () => {
    var audio = new Audio("new-game.mp3");
    audio.play();

    //Reset Player
    player = playerGame == "X" ? "X" : "O";

    if(player == 'X'){
        //Higlight X display
        xPlayerDisplay.classList.add("player-active");
        oPlayerDisplay.classList.remove("player-active");
    } else{
        //Higlight X display
        xPlayerDisplay.classList.remove("player-active");
        oPlayerDisplay.classList.add("player-active");
    }

    setTimeout(() => {
        restartBtn.style.visibility = "hidden";
        inputCells.fill('');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.background = '';
        });
        isPauseGame = false;
        isGameStart = false;
        titleHeader.textContent = 'Choose';
    }, 1200)
});