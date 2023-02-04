const f = require('fs');
const readline = require('readline');
const file = "./liste_anglaise.txt";

var r = readline.createInterface({
    input: f.createReadStream(file)
});

var listeDeMots = [[], [], [], [], [], []]

r.on('line', function (text) {
    console.log(text)
    registerMot(text)
}).on('close', ()=>{
    var json = JSON.stringify(listeDeMots)
    f.writeFile('myjsonfile.json', json, 'utf8', (err)=>{console.log(err)});
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