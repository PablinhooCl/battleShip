// const Gameboard = require('./index');
const Ship = require('./index');

let length= 5;
const ship= new Ship(length)

test("test navy 1", () => {
    expect(ship).toEqual({
        'current': 'alive',
        'length': 5,
        'life': 5,
        'type': 'Carrier'
      });
  });

length= 4;
ship.life= 0;

test("test navy 2", () => {
    expect(ship).toEqual({
        'current': 'SUNKED',
        'length': 4,
        'life': 0,
        'type': 'Battleship'
      });
  });