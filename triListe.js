// This file allow you to precompute the words you want to use in the crossword.
// By default, a set of words is already done in French and English.
// To generate the file, you need to have an input file which have this characteristic :
//      - a text file
//      - one word per line
//      - no uppercase character for the 1st letter of each word

// Then change the 2 following parameters and run the command : node triListe.js
// Don't forget to include your file in the .env file


// Parameters to change

const inputFile = "./liste_anglaise.txt"
const outputFile = "wordListEN.js"

// Don't touch that

const f = require('fs');
const readline = require('readline');

var r = readline.createInterface({
    input: f.createReadStream(inputFile)
});

var listeDeMots = [[], [], [], [], [], []]

r.on('line', function (text) {
    console.log(text)
    registerMot(text)
}).on('close', ()=>{
    var json = JSON.stringify(listeDeMots)
    f.writeFile(outputFile, "module.exports = ", 'utf-8', (err)=>{console.log(err)});
    f.appendFile(outputFile, json, 'utf8', (err)=>{console.log(err)});
})

//enlève majuscules en premier, ceux qui on un espace ou un caractère spécial 
function triMots(mot){
    if(mot.charCodeAt(0)>=65 && mot.charCodeAt(0)<=90){
        return false
    }else if(mot[0]=="É" || mot[0]=="È" || mot[0]=="À"){
        return false
    }else if(mot.length>8 || mot.length<3){
        return false
    }
    let mot_copy = mot.toUpperCase()
    for(let i=0; i<mot_copy.length; i++){
        if(mot_copy[i]=="É" || mot_copy[i]=="È"){
            mot_copy="E"
        }else if(mot_copy[i]=="À"){
            mot_copy="A"
        }else if(mot_copy.charCodeAt(i)>90 || mot_copy.charCodeAt(i)<65){
            return false
        }
    }
    return mot_copy
}

function registerMot(mot){
    let tri = triMots(mot)
    if(tri){
        listeDeMots[tri.length-3].push(tri)
    }
}