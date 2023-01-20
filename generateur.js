const mots = require('./wordList.js')

class Generateur{
    constructor(dim, schema){
        this.dim = dim; //taille de la grille
        this.schema = schema; //liste nombre de mots de longueur (ex: schema[0] : nb de mots de longueur 3, schema[1] de longueur 4 etc)
    }

    getWord(length){
        return mots[length-3][Math.floor(Math.random() * mots[length-3].length)]
    }

    weightPosition(word, x, y, orient, grid){ //grid[x][y] 1st letter position, orient : true=horizontal / false=vertical
        //return 0 if position not possible, and bigger the value is, better the position is

        let x_bis = x - !orient
        let y_bis = y - orient

        if((x_bis>=0 && y_bis>=0 && grid[x_bis][y_bis].letter!="-")){
            return 0
        }

        let weight = 0

        for(let i=0; i<word.length; i++){
            x_bis+=!orient
            y_bis+=orient
            if(grid[x_bis][y_bis].letter=="-"){
                if((orient && grid[x_bis][y_bis].allowHorz) || (!orient && grid[x_bis][y_bis].allowVert)){
                    weight+=1
                }else{
                    return 0
                }
            }else if(grid[x_bis][y_bis].letter==word[i]){
                weight+=10
            }else{
                return 0
            }
        }

        x_bis+=!orient
        y_bis+=orient

        if((x_bis<this.dim && y_bis<this.dim && grid[x_bis][y_bis].letter!="-")){
            return 0
        }

        return weight
    }

    wordBestPosition(word, grid){
        let n = word.length
        let bestPosition = {
            x : 0,
            y : 0,
            orient : true,
            weight : 0,
            number : 1,
            word: word
        }

        for(let var1=0; var1<this.dim - n + 1; var1++){
            for(let var2=0; var2<this.dim; var2++){
                let weightHorz = this.weightPosition(word, var2, var1, true, grid)
                let weightVert = this.weightPosition(word, var1, var2, false, grid)
                if(weightHorz==bestPosition.weight){
                    if(Math.random()<=1/(bestPosition.number+1)){
                        bestPosition.x = var2;
                        bestPosition.y = var1;
                        bestPosition.orient = true;
                    }
                    bestPosition.number+=1;
                }else if(weightHorz>bestPosition.weight){
                    bestPosition.x = var2;
                    bestPosition.y = var1;
                    bestPosition.orient = true;
                    bestPosition.number=1;
                    bestPosition.weight=weightHorz;
                }

                if(weightVert==bestPosition.weight){
                    if(Math.random()<=1/(bestPosition.number+1)){
                        bestPosition.x = var1;
                        bestPosition.y = var2;
                        bestPosition.orient = false;
                    }
                    bestPosition.number+=1;
                }else if(weightVert>bestPosition.weight){
                    bestPosition.x = var1;
                    bestPosition.y = var2;
                    bestPosition.orient = false;
                    bestPosition.number=1;
                    bestPosition.weight=weightVert;
                }
            }
        }

        return bestPosition
    }

    applyWord(position, grid){
        let x_bis = position.x - !position.orient;
        let y_bis = position.y - position.orient;

        if(x_bis>=0 && y_bis>=0){
            grid[x_bis][y_bis].allowHorz=false;
            grid[x_bis][y_bis].allowVert=false;
        }

        for(let i=0; i<position.word.length; i++){
            x_bis+= !position.orient;
            y_bis+= position.orient;
            grid[x_bis][y_bis].letter=position.word[i]

            if(x_bis-position.orient>=0 && y_bis-!position.orient>=0){
                if(position.orient){
                    grid[x_bis-position.orient][y_bis-!position.orient].allowHorz=false;
                }else{
                    grid[x_bis-position.orient][y_bis-!position.orient].allowVert=false;
                }
            }

            if(x_bis+position.orient<this.dim && y_bis+!position.orient<this.dim){
                if(position.orient){
                    grid[x_bis+position.orient][y_bis+!position.orient].allowHorz=false;
                }else{
                    grid[x_bis+position.orient][y_bis+!position.orient].allowVert=false;
                }
            }
        }

        x_bis+= !position.orient;
        y_bis+= position.orient;

        if(x_bis<this.dim && y_bis<this.dim){
            grid[x_bis][y_bis].allowHorz=false;
            grid[x_bis][y_bis].allowVert=false;
        }
    }

    choseBestWord(schema, grid){
        let bestPosition = {weight:0};
        let index=-1

        for(let i=0;i<schema.length; i++){
            if(schema[i]>0){
                let position = this.wordBestPosition(this.getWord(i+3),grid)
                if(position.weight>=bestPosition.weight){
                    bestPosition = position
                    index = i
                }
            }
        }
        
        if(bestPosition.weight>=7){
            this.applyWord(bestPosition, grid)
            schema[index]-=1
        }
    }

    schemaSum(schema){
        let sum = 0;
        for(let i=0; i<schema.length; i++){
            sum+=schema[i]
        }
        return sum
    }

    generatGrid(){
        let needed = [...this.schema]
        let grid = new Array(this.dim)

        for(let i=0; i<this.dim; i++){
            grid[i] = new Array(this.dim)
            for(let j=0; j<this.dim; j++){
                grid[i][j] = {
                    letter : "-",
                    allowVert : true,
                    allowHorz : true
                }
            }
        }
        while(this.schemaSum(needed)>0){
            this.choseBestWord(needed, grid)

            // let finalGrid = this.assembleGrid(grid)

            // for(let i=0; i<this.dim; i++){
            //     console.log(finalGrid[i])
            // }

            // console.log('\n$$$$$$$$$$$\n')

            console.log(this.schemaSum(needed))
        }

        let finalGrid = this.assembleGrid(grid)

        for(let i=0; i<this.dim; i++){
            console.log(finalGrid[i])
        }

        console.log('\n$$$$$$$$$$$\n')
    }

    assembleGrid(grid){
        let finalGrid = new Array(this.dim);

        for(let i=0; i<this.dim; i++){
            let ligne = ""

            for(let j=0; j<this.dim; j++){
                ligne+=grid[i][j].letter;
            }

            finalGrid[i]=ligne
        }

        return finalGrid
    }
}

let gen = new Generateur(11, [4,5,3,3,1,2])
console.log(gen.generatGrid())