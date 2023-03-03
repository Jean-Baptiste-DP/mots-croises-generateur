# Générateur de mots croisés - Cross word generator

This is a server, built with express, that returns a crossword on the route /

## Installation

```bash
git clone git@github.com:Jean-Baptiste-DP/mots-croises-generateur.git
npm install
```

## Run server

```bash
node index.js
```

## Run tests

```bash
npm test
```

## Change parameters

By default, the server is running on port 10206, it can be changed in the [.env](https://github.com/Jean-Baptiste-DP/mots-croises-generateur/blob/main/.env) file.

The default language use is the French, this repository also contain English words. It can be changed in the [.env](https://github.com/Jean-Baptiste-DP/mots-croises-generateur/blob/main/.env) file.

If you want to use this generator for another language, it's possible to do that, just check the [triListe.js](https://github.com/Jean-Baptiste-DP/mots-croises-generateur/blob/main/triListe.js) file for instruction.

## Project

This is a microservice of a project named Mots-croisés, which is a WebApplication. You can find here the [front](https://github.com/nbert71/mots-croises-front) and the [back](https://github.com/nbert71/mots-croises-back) repositories of this project.