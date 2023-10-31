class Ship{
    constructor(length){
        this.length= length
        this.life= length
        this.current= 'alive'
        this.type= this.typeOfShip(length)
    }
    isSunk(){
        if(this.life===0){
            this.current= 'SUNKED'
        }
    }
    hit(){
        this.life= this.life - 1;
        this.isSunk()
    }
    typeOfShip(length){
        if(length=== 5){
            return 'Carrier'
        }else if(length=== 4){
            return 'Battleship'
        }else if(length=== 3){
            let rng= Math.floor(Math.random() * (2)) + 1;
            if(rng=== 1){
                return 'Cruiser'
            }else{
                return 'Submarine'
            }
        }else if(length=== 2){
            return 'Destroyer'
        }
    }
}
class Gameboard{
    constructor(){
        this.obj= new Map();
        this.boarder();
    };
    boarder(){
        let size= 8;
        for(let i= 0; i< size; i++){
            for(let j= 0; j< size; j++){
                this.obj.set(`${[i, j]}`, { tile: null, ships: [], isHit: false });
                
            };
        };
    };
    shipPlacement(length, x, y, orientation){   
        const ship= new Ship(length);
        if(orientation){
            for(let i= 0; i<length; i++){
                let key = `${[x+ i, y]}`;
                this.obj.get(key).ships.push(ship);
                this.obj.get(key).tile.style.backgroundColor = 'red';
            }
        }else{
            for(let i= 0; i<length; i++){
                let key = `${[x, y+ i]}`;
                this.obj.get(key).ships.push(ship);
                this.obj.get(key).tile.style.backgroundColor = 'red';
            }
        }
    }
   
}
class Player{
    constructor(type){
        this.board= new Gameboard()
        this.turn= false;
        this.type= type  
    }
    gameDone(player, oppo){
        let totalCells = 0; 
        let sunkedCells = 0; 
        let size= 8;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = this.board.obj.get(`${[i, j]}`);  
                if (cell.ships.length > 0 ){
                   totalCells++; 
                }
                if (cell.ships.length > 0 && cell.ships[0].current === 'SUNKED') {
                    sunkedCells++;
                }
            }
        }
        if (sunkedCells === totalCells) {
            const tituloGanador= document.createElement('div')
            tituloGanador.innerText= `${oppo.type} ah ganado`
            gameDoneDisplay.insertBefore(tituloGanador, gameDoneDisplay.firstChild)
            gameEnded(player, oppo) 
        }

    }
}
let player;
let cpu;
function boardCreator(player, oppo){
    const mC= document.getElementById('mC');
    const pContainerTiles= document.createElement('div');
    pContainerTiles.id= player.type;
    mC.appendChild(pContainerTiles);
    let size= 8;
    for (let i = size - 1; i >= 0; i--) {
        for (let j = 0; j < size; j++) {
            const boardTile= document.createElement('div');
            boardTile.id= j+ ', '+ i;
            boardTile.classList.add('celdas');
            boardTile.addEventListener('click', function(){
                if(player.turn=== true){
                    receiveAttack(j, i, player, oppo)
                    player.gameDone(player, oppo)
                }
            });
            player.board.obj.get(`${[j, i]}`).tile = boardTile;
            pContainerTiles.appendChild(boardTile);
        }
    }
};
function startGame(){
    player= new Player('player');
    cpu= new Player('cpu');
    
    boardCreator(player, cpu);
    boardCreator(cpu, player);
    for(let i= 2; i<= 5; i++){
        shipSetter(i, cpu, null, null, null)
    }
    shipSetter(3, cpu, null, null ,null);
    changeTurn(player, cpu)
    fixCpuBoard()
}
function changeTurn(player, oppo){
    player.turn= false;
    oppo.turn= true 
    if( player.type == 'cpu'){
        cpuAttack(oppo, player)
    }
    
}
const navesContainer= document.querySelector('.ships');
const navesButton= document.getElementById('flipper');
let angle= 0;
function shipOrientation(){
    const naves= Array.from(navesContainer.children);
    angle = angle === 0 ? 90 : 0;
    naves.forEach(naves => naves.style.transform= `rotate(${angle}deg)`)

};
navesButton.addEventListener('click', shipOrientation)


function fixCpuBoard(){
    let cpuBoards= document.querySelectorAll('#cpu div');
    cpuBoards.forEach(cpuBoard=>{
        cpuBoard.style.backgroundColor= 'aqua'
    })
}
function shipSetter(length, play, x, y, direction){
    let directionXY= (direction!= 0 && direction!=1) ? Math.floor(Math.random()*2): direction
    if(directionXY== 1){
        let boolean= true;
        let xGo=  (x === null) ? Math.floor(Math.random() * (8 - length)) : x;
        let yGo=  (y === null) ? Math.floor(Math.random() * (8 - length)) : y;
        for(let i= xGo; i< xGo+length; i++){
            let key= `${i},${yGo}`;
            let ship= play.board.obj.get(key);
            if(ship.ships.length!= 0 || xGo + length> 8){ 
                if(play=== player){
                    return
                }else{
                    return shipSetter(length, play, null, null, null)
                }
            }
        }
        play.board.shipPlacement(length, xGo, yGo, boolean)
        return true
   }else if(directionXY== 0){
        let boolean= false;
        let xGo=  (x === null) ? Math.floor(Math.random() * (8 - length)) : x;
        let yGo=  (y === null) ? Math.floor(Math.random() * (8 - length)) : y;

        for(let i= yGo; i< yGo+length; i++){
            let key= `${xGo},${i}`;

            let ship= play.board.obj.get(key);

            if(ship.ships.length!== 0 || yGo + length> 8){  
                if (play === player) {
                    return false;
                } else {
                    return shipSetter(length, play, null, null, null);
                }
            }
        }
        play.board.shipPlacement(length, xGo, yGo, boolean)
        return true
   }
}
function receiveAttack(x, y, player, oppo){
    const key= `${x},${y}`
    const square= player.board.obj.get(key);
    const shipContainer= document.getElementsByClassName('ships')
    if(shipContainer[0].childElementCount== 0){
    if(square.ships[0] && !square.isHit){
        square.ships[0].hit();
        square.tile.innerText= 'x'
    }else if(square.ships.length<1 && !square.isHit){
        square.tile.innerText= 'o'
    }
    square.isHit= true;
    changeTurn(player, oppo);
    updateDisplay(oppo.type, x, y, square.tile.innerText)
}else{shipError()}
    
}
const eventDiv= document.getElementById('eventDisplayer')
function updateDisplay(play, x, y, hit){
    const result= (hit=== 'x') ? 'Attacked' : 'Missed'
    const event= document.createElement('div');
    const spaceBr= document.createElement('br');
    eventDiv.insertBefore(spaceBr, eventDiv.firstChild)
    event.innerText= `${play} ${result} on [${x}, ${y}]`;
    eventDiv.insertBefore(event, eventDiv.firstChild)
}
const restartButton= document.getElementById('restart');
restartButton.addEventListener('click', function(){
    restartGame();
});

function cpuAttack(player, oppo){
    setTimeout(function() {
        const boardInfo= cpu.board.obj;
        let tilesHited= [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (boardInfo.get(`${[j, i]}`).isHit || boardInfo.get(`${[j, i]}`).ships.lenghth!== 0){
                    tilesHited.push((`${[j, i]}`))
                }
            }
        }
        if(tilesHited.length> 0){
            let arrNum=  Math.floor(Math.random() * (tilesHited.length + 1))
            const [x, y] = tilesHited[arrNum].split(',').map(Number);
            xNote= (x-1== 0 || x+1== 7) ? xNote= x : Math.floor(Math.random() * (8))
            yNote= (y-1== 0 || y+1== 7) ? yNote= y : Math.floor(Math.random() * (8)) 
        }
        receiveAttack(xNote, yNote, player, oppo)
    }, 500);}

function gameEnded(player, oppo){
    player.turn= false
    oppo.turn= false
    gameDoneDisplay.classList.add('actived')
    overlayActivator.classList.add('actived')
}
const shipErrorDisplay= document.getElementById('shipError')
const gameDoneDisplay= document.getElementById('gameDone')
const overlayActivator= document.getElementById('overlay')
const closeAddBookModal = () => {
    shipErrorDisplay.classList.remove('actived')
    overlayActivator.classList.remove('actived')
    gameDoneDisplay.classList.remove('actived')
};
const handleKeyboardInput = (e) => {
    if (e.key === 'Escape') closeAddBookModal()
  };
  overlayActivator.onclick = closeAddBookModal;
  window.onkeydown = handleKeyboardInput
  
function shipError(){
    shipErrorDisplay.classList.add('actived')
    overlayActivator.classList.add('actived')
}
startGame()

//          DRAG FUNCTION

let draggedShip;
let shipDocks= Array.from(navesContainer.children);
shipDocks.forEach(shipDock=> shipDock.addEventListener('dragstart', dragStart));
let allPlayerBlocks= document.querySelectorAll('#player div');
allPlayerBlocks.forEach(allPlayerBlock=> {
    allPlayerBlock.addEventListener('dragover', dragOver);
    allPlayerBlock.addEventListener('drop', dropShip); 
})
function dragStart(e){
    draggedShip= e.target.id;
}

function dragOver(e){
    e.preventDefault()
}

function dropShip(e){
    let length;
    let orientation;
    const startId= e.target.id;
    const naveDiv= document.getElementById(draggedShip)
    const [x, y] = startId.split(',').map(Number);
    if(angle=== 90){
        orientation= 1
    }else if(angle=== 0){
        orientation= 0
    }

    if(draggedShip==='dos'){
        length= 2;
    }else if(draggedShip==='tres'){
        length= 3;
    }else if(draggedShip==='cuatro'){
        length= 4;
    }else if(draggedShip==='cinco'){
        length= 5;
    }
    console.log('poniendo naves')
    const placedSuccessfully = shipSetter(length, player, x, y, orientation);
    if (placedSuccessfully) {
        navesContainer.removeChild(naveDiv);
    }
    
}
function restartGame(){
    const playerBoard= document.getElementById('player')
    const cpuBoard= document.getElementById('cpu')       
    mC.removeChild(playerBoard)
    mC.removeChild(cpuBoard)
    startGame()
    shipContainerFix()
    fixCpuBoard()
    draggedShip;
    shipDocks= Array.from(navesContainer.children);
    shipDocks.forEach(shipDock=> shipDock.addEventListener('dragstart', dragStart));
    allPlayerBlocks= document.querySelectorAll('#player div');
    allPlayerBlocks.forEach(allPlayerBlock=> {
    allPlayerBlock.addEventListener('dragover', dragOver);
    allPlayerBlock.addEventListener('drop', dropShip); 
})
}
function shipContainerFix(){
    const shipsDiv= document.getElementsByClassName('ships')
    while (shipsDiv[0].firstChild) {
        shipsDiv[0].removeChild(shipsDiv[0].firstChild);
    }

    function createShip(id, numDivs) {
    var ship = document.createElement('div');
    ship.className = 'ship';
    ship.id = id;
    ship.draggable = true;

    for (let i = 0; i < numDivs; i++) {
        var div = document.createElement('div');
        ship.appendChild(div);
    }

    return ship;
    }

    var shipCinco = createShip('cinco', 5);
    var shipCuatro = createShip('cuatro', 4);
    var shipTres1 = createShip('tres', 3);
    var shipTres2 = createShip('tres', 3);
    var shipDos = createShip('dos', 2);

    shipsDiv[0].appendChild(shipCinco);
    shipsDiv[0].appendChild(shipCuatro);
    shipsDiv[0].appendChild(shipTres1);
    shipsDiv[0].appendChild(shipTres2);
    shipsDiv[0].appendChild(shipDos);

    const shipContainerDic= document.getElementsByClassName('shipContainer')
    shipContainerDic[0].insertBefore(shipsDiv[0], shipContainerDic[0].firstChild)
}