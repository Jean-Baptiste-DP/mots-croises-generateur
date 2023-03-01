const Generateur = require('./generateur.js')

const size = 11;
const schema = [4,5,3,3,1,2];

const gen = new Generateur(size, schema)

test('having random word with good size and good letters', () => {
    for (let i = 3; i <= 8; i++) {
        let word = gen.getWord(i);
        expect(word.length).toBe(i);
        expect(word).toMatch(/[A-Z]*/);
    }
});

test('sum of schema', ()=>{
    expect(gen.schemaSum([4,5,3,3,1,2])).toBe(18);
    expect(gen.schemaSum([4,5,3,3])).toBe(15);
    expect(gen.schemaSum([1])).toBe(1);
    expect(gen.schemaSum([0,0,0,0,0])).toBe(0);
    expect(gen.schemaSum([])).toBe(0);
})

test('new empty grid', ()=>{
    let grid = gen.emptyGrid()
    expect(grid.length).toBe(size);
    expect(grid[0].length).toBe(size);
    for(let x=0; x<size; x++){
        for(let y=0; y<size; y++){
            expect(grid[x][y]).toEqual({
                letter : "-",
                allowVert : true,
                allowHorz : true
            })
        }
    }
})