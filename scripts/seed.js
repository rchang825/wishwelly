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
    const listURL = "https://www.amazon.com/hz/wishlist/ls/2RAF9Y78RJ8DW?ref_=wl_share";

    const list = scrapeAndCreateList(listURL);

    const wish1 = new Wishwelly({
        slug: "wish1",
        title: "Wishwelly 1",
        lists: [list]
    });
    wish1.save();
}
