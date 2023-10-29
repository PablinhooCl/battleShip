class Ship{
    constructor(length){
        this.length= length
        this.life= length
        this.current= 'alive'
        this.type= this.typeOfShip(length)
    }
    isSunk(){
        // while(this.life>0){
        //     this.current= 'alive'
        // }
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
    shipPlacement(length, x, y, orientation){ //falta setear las direcciones etc
        let spaceChecker= 0;
        const ship= new Ship(length);
        let boards= document.querySelectorAll('#cpu div');  //ocupar para  buscar los cuadros
        if(orientation=== true){
            for(let i= 0; i< length; i++){
                let key = `${[x+ i, y]}`;
                if(this.obj.get(key).ships.length=== 0){
                    spaceChecker++;
                }
            }
            if(x+ length> 7 && length!== spaceChecker){
                alert('error en posicion vuelve a intentarlo')
            }else if(x+ length< 7 && length=== spaceChecker){
                for(let i= 0; i<length; i++){
                    
                    let key = `${[x+ i, y]}`;
                    let [xCoord, yCoord] = key.split(',').map(Number);
                    let coordinate = `${xCoord}, ${yCoord}`;
                    
                    let tile= document.getElementById(coordinate)
                    tile.style.backgroundColor= 'red'

                    console.log(tile)
                    this.obj.get(key).ships.push(ship);
                    console.log('nave agregada en: '+`${[x, y]}`)
                }
            }
        }else{
            for(let i= 0; i< length; i++){
                let key = `${[x, y+ i]}`;
                if(this.obj.get(key).ships.length=== 0){
                    spaceChecker++;
                }
            }
            if(y+ length> 7 && length!== spaceChecker){
                alert('error en posicion vuelve a intentarlo')
            }else if(y+ length< 7 && length=== spaceChecker){
                for(let i= 0; i<length; i++){
                    let key = `${[x, y+ i]}`;
                    let [xCoord, yCoord] = key.split(',').map(Number);
                    const coordinate = `${xCoord}, ${yCoord}`;
                     
                    let tile= document.getElementById(coordinate)
                    tile.style.backgroundColor= 'red'

                    console.log(tile)
                    this.obj.get(key).ships.push(ship);
                    console.log('nave agregada en: '+`${[x, y]}`)
                }
            }
        }
        fixCpuBoard();
    }
    receiveAttack(x, y, player, oppo){
        const key= `${x},${y}`
        const key2= `${x}, ${y}`
        const tile= this.obj.get(key);
        if(tile.ships[0] && !tile.isHit){
            tile.isHit= true;
            tile.ships[0].hit();
            let selector = `#${player.type} div#${key2}`;
            let tiles= document.querySelectorAll(selector)
            tiles.innerText= 'x'
            console.log('hit on '+key)
            changeTurn(player, oppo);
        }else if(tile.ships.length<1 && !tile.isHit){
            tile.isHit= true;
            console.log('missed');
            let selector = `#${player.type} div#${key2}`;
            let tiles= document.querySelectorAll(selector)
            tiles.innerText= 'o'
            changeTurn(player, oppo);
        }
    };
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
// module.exports = Ship;


// start game

const restartButton= document.getElementById('start');
restartButton.addEventListener('click', function(){
    restartGame();
});
let player1;
let cpu;
function startGame(){
    player1= new Player('player1');
    cpu= new Player('cpu');
    boardCreator(player1, cpu);
    boardCreator(cpu, player1);
    for(let i= 2; i<= 5; i++){
        shipSetterCpu(i, cpu)
    }
    shipSetterCpu(3, cpu);
    player1.turn= true;
}
startGame();
function boardCreator(player, oppo){
    const mC= document.getElementById('mC');
    const pContainerTiles= document.createElement('div');
    pContainerTiles.id= oppo.type;
    mC.appendChild(pContainerTiles);
    // let player= player;
    // let oppo= oppo
    let size= 8;
    for (let i = size - 1; i >= 0; i--) {
        for (let j = 0; j < size; j++) {
            const boardTile= document.createElement('div');
            boardTile.id= j+ ', '+ i;
            boardTile.classList.add('celdas');
            boardTile.addEventListener('click', function(){
                let tile1= oppo.board;
                // .obj.get(`${(i, j)}`);
                if(player.turn=== true){
                    tile1.receiveAttack(j, i, player, oppo)
                // funcionalidad
                }
            });
            pContainerTiles.appendChild(boardTile);
        }
    }
};
function changeTurn(player, oppo){
    player.turn= false;
    oppo.turn= true 
}
function shipSetterCpu(length, player){
   let direction= Math.floor(Math.random()*2);
   if(direction== 0){
        let boolean= true;
        let xGo=  Math.floor(Math.random()*(8 - length));
        let yGo=  Math.floor(Math.random()*(8 - length));
        console.log(yGo);
        console.log(xGo);
        for(let i= xGo; i< xGo+length; i++){
            let ship= player.board.obj.get(i, yGo);
            if(ship && ship.ships.length!== 0 && xGo+ length>= 8){
                return shipSetterCpu(length, player)
            }
        }
        console.log(`cpu.board.shipPlacement(${length}, ${xGo}, ${yGo}, ${boolean})`);
        cpu.board.shipPlacement(length, xGo, yGo, boolean)
   }else if(direction== 1){
        let boolean= false;
        let xGo=  Math.floor(Math.random()*(8 - length));
        let yGo=  Math.floor(Math.random()*(8 - length));
        for(let i= yGo; i< yGo+length; i++){
            let ship= player.board.obj.get(xGo, i);
            if(ship && ship.ships.length!== 0 && yGo+ length>= 8){
                return shipSetterCpu(length, player)
            }
        }
        console.log(`cpu.board.shipPlacement(${length}, ${xGo}, ${yGo}, ${boolean})`);
        cpu.board.shipPlacement(length, xGo, yGo, boolean)
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

//          DRAG FUNCTION

let draggedShip;
const shipDocks= Array.from(navesContainer.children);
shipDocks.forEach(shipDock=> shipDock.addEventListener('dragstart', dragStart));
const allPlayerBlocks= document.querySelectorAll('#player1 div');
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
    console.log(startId);
    const [x, y] = startId.split(',').map(Number);
    if(angle=== 90){
        orientation= true
    }else if(angle=== 0){
        orientation= false
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

    let command= `${length}, ${startId}, ${orientation}`;
    console.log(command)
    player1.board.shipPlacement(length, x, y, orientation);
}
function fixCpuBoard(){
    let cpuBoards= document.querySelectorAll('#cpu div');
    cpuBoards.forEach(cpuBoard=>{
        cpuBoard.style.backgroundColor= 'aqua'
    })
}