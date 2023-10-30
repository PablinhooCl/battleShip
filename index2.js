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
    shipPlacement(length, x, y, orientation){   //
        const ship= new Ship(length);
        if(orientation){
            for(let i= 0; i<length; i++){
                let key = `${[x+ i, y]}`;
                this.obj.get(key).ships.push(ship);
                this.obj.get(key).tile.style.backgroundColor = 'red';
                console.log('nave agregada en: '+`${[x, y]}`)
            }
        }else{
            for(let i= 0; i<length; i++){
                let key = `${[x, y+ i]}`;
                this.obj.get(key).ships.push(ship);
                this.obj.get(key).tile.style.backgroundColor = 'red';
                console.log('nave agregada en: '+`${[x, y]}`)
            }
        }
    }
    gameDone(){
        let totalCells = 0; 
        let sunkedCells = 0; 
        let size= 8;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                totalCells++; 
                const cell = this.obj.get(`${[i, j]}`);

                if (cell.ships.length > 0 && cell.ships[0].current === 'SUNKED') {
                    sunkedCells++;
                }
            }
        }
        if (sunkedCells === totalCells) {
            return true; // gamedone 
        }

        return false; // keepgoin
    }
}
class Player{
    constructor(type){
        this.board= new Gameboard()
        this.turn= false;
        this.type= type  
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
    // const playerBoard= document.getElementById('player')
    // const cpuBoard= document.getElementById('cpu')       crear funcion restart y cambiar boton de start y funcion por restart
    // mC.removeChild(playerBoard)
    // mC.removeChild(cpuBoard)
    boardCreator(player, cpu);
    boardCreator(cpu, player);
    for(let i= 2; i<= 5; i++){
        shipSetter(i, cpu, null, null, null)
    }
    shipSetter(3, cpu, null, null ,null);
    changeTurn(player, cpu)
    fixCpuBoard()
}
startGame();
function changeTurn(player, oppo){
    player.turn= false;
    oppo.turn= true 
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

//          DRAG FUNCTION

let draggedShip;
const shipDocks= Array.from(navesContainer.children);
shipDocks.forEach(shipDock=> shipDock.addEventListener('dragstart', dragStart));
const allPlayerBlocks= document.querySelectorAll('#player div');
console.log(allPlayerBlocks)
allPlayerBlocks.forEach(allPlayerBlock=> {
   allPlayerBlock.addEventListener('dragover', dragOver);
    allPlayerBlock.addEventListener('drop', dropShip); 
})


function dragStart(e){
    draggedShip= e.target.id;
    console.log(draggedShip);
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
    console.log(naveDiv)
    const placedSuccessfully = shipSetter(length, player, x, y, orientation);
    if (placedSuccessfully) {
        navesContainer.removeChild(naveDiv);
    }
    
}
function fixCpuBoard(){
    let cpuBoards= document.querySelectorAll('#cpu div');
    cpuBoards.forEach(cpuBoard=>{
        cpuBoard.style.backgroundColor= 'aqua'
    })
}
function shipSetter(length, play, x, y, direction){
    let directionXY= (direction!= 0 && direction!=1) ? Math.floor(Math.random()*2): direction
    console.log(x, y)
    if(directionXY== 1){
        let boolean= true;
        let xGo=  (x === null) ? Math.floor(Math.random() * (8 - length)) : x;
        let yGo=  (y === null) ? Math.floor(Math.random() * (8 - length)) : y;
        console.log(xGo, yGo)
        for(let i= xGo; i< xGo+length; i++){
            let key= `${i},${yGo}`;
            let ship= play.board.obj.get(key);
            console.log(ship)
            if(ship.ships.length!= 0 || xGo + length> 8){ // borre ship &&
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
        console.log(xGo, yGo)

        for(let i= yGo; i< yGo+length; i++){
            let key= `${xGo},${i}`;

            let ship= play.board.obj.get(key);
            console.log(ship)

            if(ship.ships.length!== 0 || yGo + length> 8){ // borre ship && 
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
        square.isHit= true;
        square.ships[0].hit();
        square.tile.innerText= 'x'
        console.log('hit on '+key)
        changeTurn(player, oppo);
    }else if(square.ships.length<1 && !square.isHit){
        square.isHit= true;
        console.log('missed');
        square.tile.innerText= 'o'
        changeTurn(player, oppo);
    }}
}
const startButton= document.getElementById('start');
startButton.addEventListener('click', function(){
    startGame();
});