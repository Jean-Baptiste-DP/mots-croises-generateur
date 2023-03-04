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

test('apply word', ()=>{
    let testedWord = "BONJOUR"
    let grid = gen.emptyGrid()
    gen.applyWord({
        x : 1,
        y : 1,
        orient : true,
        weight : 0,
        number : 1,
        word: testedWord
    }, grid)
    for(let i=0; i<testedWord.length; i++){
        expect(grid[1][i+1].letter).toBe(testedWord[i]);
        expect(grid[2][i+1].allowHorz).toBe(false);
        expect(grid[2][i+1].allowVert).toBe(true);
    }
    expect(grid[1][testedWord.length+1].allowHorz).toBe(false);
    expect(grid[1][testedWord.length+1].allowVert).toBe(false);

    testedWord = "NID"
    gen.applyWord({
        x : 1,
        y : 3,
        orient : false,
        weight : 0,
        number : 1,
        word: testedWord
    }, grid)

    for(let i=1; i<testedWord.length; i++){
        expect(grid[i+1][3].letter).toBe(testedWord[i]);
        expect(grid[i+1][4].allowVert).toBe(false);
        expect(grid[i+1][2].allowVert).toBe(false);
    }
    expect(grid[testedWord.length+1][3].allowHorz).toBe(false);
    expect(grid[testedWord.length+1][3].allowVert).toBe(false);
})

test("weight of position", ()=>{
    let grid = gen.emptyGrid()
    expect(gen.weightPosition("BONJOUR",0,0,true,grid)).toBe(7);
    expect(gen.weightPosition("BONJOUR",2,4,false,grid)).toBe(7);

    gen.applyWord({
        x : 0,
        y : 0,
        orient : true,
        weight : 0,
        number : 1,
        word: "BONJOUR"
    }, grid)

    expect(gen.weightPosition("BONJOUR",0,0,false,grid)).toBe(16);
    expect(gen.weightPosition("BONJOUR",1,0,false,grid)).toBe(0);
    expect(gen.weightPosition("BONJOUR",0,1,false,grid)).toBe(0);
    expect(gen.weightPosition("BONJOUR",1,0,true,grid)).toBe(0);

    gen.applyWord({
        x : 10,
        y : 0,
        orient : true,
        weight : 0,
        number : 1,
        word: "BONJOUR"
    }, grid)

    expect(gen.weightPosition("BONJOUR",3,0,false,grid)).toBe(0);
})

test("word best position", ()=>{
    let grid = gen.emptyGrid()
    let bestPos = gen.wordBestPosition("BONJOUR", grid)

    expect(bestPos.weight).toBe(7);
    expect(bestPos.number).toBe(110);
    expect(bestPos.word).toBe("BONJOUR");
    expect(bestPos.x).toBeGreaterThanOrEqual(0);
    expect(bestPos.y).toBeGreaterThanOrEqual(0);
    expect(bestPos.x).toBeLessThanOrEqual(size);
    expect(bestPos.y).toBeLessThanOrEqual(size);

    gen.applyWord({
        x : 0,
        y : 0,
        orient : true,
        weight : 0,
        number : 1,
        word: "BONJOUR"
    }, grid)

    expect(gen.wordBestPosition("BEAUCOUP", grid)).toEqual({
        x : 0,
        y : 0,
        orient : false,
        weight : 17,
        number : 1,
        word: "BEAUCOUP"
    })
    
})

test("choose 1 word", ()=>{
    let grid = gen.emptyGrid()
    gen.choseBestWord([4,5,3,3,0,0], grid)

    for(let x=0; x<size; x++){
        for(let y=0; y<size; y++){
            expect(grid[x][y].letter).toBe("-")
        }
    }

    let numberLetters = 0

    gen.choseBestWord([4,5,3,3,1,2], grid)


    for(let x=0; x<size; x++){
        for(let y=0; y<size; y++){
            expect(grid[x][y].letter).toMatch(/[A-Z\-]/)
            if(grid[x][y].letter!="-"){
                numberLetters++;
            }
        }
    }

    expect(numberLetters).toBe(8);
})

test("Assemble grid", ()=>{
    let grid = gen.emptyGrid();

    gen.choseBestWord([4,5,3,3,1,2], grid);
    gen.choseBestWord([4,5,3,3,1,2], grid);
    gen.choseBestWord([4,5,3,3,1,2], grid);
    gen.choseBestWord([4,5,3,3,1,2], grid);
    gen.choseBestWord([4,5,3,3,1,2], grid);
    gen.choseBestWord([4,5,3,3,1,2], grid);

    let assembledGrid = gen.assembleGrid(grid)

    expect(assembledGrid.length).toBe(size);
    for(let x=0; x<size; x++){
        expect(assembledGrid[x].length).toBe(size);
        expect(assembledGrid[x]).toMatch(/[A-Z]*/);
        for(let y=0; y<size; y++){
            expect(grid[x][y].letter).toBe(assembledGrid[x][y]);
        }
    }
})

test("General test", ()=>{
    let finalGrid = gen.generatGrid()

    expect(finalGrid.length).toBe(size);
    for(let x=0; x<size; x++){
        expect(finalGrid[x].length).toBe(size);
        expect(finalGrid[x]).toMatch(/[A-Z]*/);
    }
})

test("testing ability to merge", ()=>{
    expect(1).toBe(0);
})