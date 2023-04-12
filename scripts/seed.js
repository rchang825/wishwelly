const mongoose = require("mongoose");
const https = require("https");
const axios = require('axios');
const cheerio = require("cheerio");

const {scrapeAndCreateList} = require("../business/scrape");
const {Tag, Item, List, Wishwelly, User} = require("../models");

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wishwellyDB");
    await scrapeAndCreate();
    //process.exit();
}
main();

/* 
    price: "xx.xx",
    name: "Name of Item",
    imgURL: "https:// where image is stored",
    link: "https:// direct link from wishlist"
*/
async function scrapeAndCreate() {
    //console.log("seed.js store: ", store);
    const wish1 = new Wishwelly({
        slug: "wish",
        title: "My Wishwelly",
        lists: []
    });
    await wish1.save();
    return wish1;
}

module.exports = {scrapeAndCreate};