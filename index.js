const express = require('express')
const app = express()
const server = require('http').createServer(app);
const Generateur = require('./generateur.js')

let gen = new Generateur(11, [4,5,3,3,1,2])

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    fichier = gen.generatGrid()
    res.json(fichier);
})

server.listen(10206, () => console.log(`Lisening on port :10206`))