const Loki = require("lokijs");
const Produkt = require('./Produkt');

const db = new Loki('demo.json');
const produkte = db.addCollection('produkte');

// Produkte
let zuckerl = new Produkt("Berti Zuckerl", 2.99, 0.15);
let burger = new Produkt("Mampf Burger", 3.49, 0.35);
let schoko = new Produkt("Lilo's Schokolade", 1.99, 0.33);

produkte.insert(zuckerl);
produkte.insert(burger);
produkte.insert(schoko);

module.exports = db;