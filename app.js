const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const https = require("https");
const axios = require('axios');
const cheerio = require("cheerio");

const {scrape, scrapeToWishwelly} = require("./business/scrape");
const {Tag, Item, List, Wishwelly, User} = require("./models");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//connect mongoose and set up schemas
mongoose.connect("mongodb://localhost:27017/wishwellyDB");


app.get("/", (req, res) => {
    res.render("home", {});
});

app.get("/collections/:slug", async (req, res) => {
    const requestedSlug = req.params.slug;
    const wish = await Wishwelly.findOne({slug: requestedSlug}).lean();
    const selectedStores = req.query.store;


    let stores = wish.stores;
    if (selectedStores) {
        stores = stores.filter(store => selectedStores.includes(store.name));
    }
    const storeFilters = stores.map(store => store.name);
    res.render("display", {
        wishwelly: wish, 
        stores: stores,
        storeFilters: storeFilters,
        selectedStores: selectedStores
    });

});

app.get("/collections/:slug/edit", async (req, res) => {
    const requestedSlug = req.params.slug;
    const wish = await Wishwelly.findOne({slug: requestedSlug});
    const selectedStores = req.query.store;
    

    let stores = wish.stores;
    if (selectedStores) {
        stores = stores.filter(store => selectedStores.includes(store.name));   
    }
    const storeFilters = wish.stores.map(store => store.name);
    res.render("edit", {
        wishwelly: wish, 
        stores: stores,
        storeFilters: storeFilters,
        selectedStores: selectedStores,
        slug: requestedSlug
    });
});

app.get("/collections/:slug/new", async (req, res) => {
    const requestedSlug = req.params.slug;
    const wish = await Wishwelly.findOne({slug: requestedSlug});
    const newLink = req.query.newLink;
    const list = await scrapeToWishwelly(newLink, wish);
    //const redirectLink = "/collections/" + requestedSlug
    res.render("new", {
        wishwelly: wish, 
        lists: [list], 
        slug: requestedSlug
    });
});

app.get("/about", (req, res) => {
    res.render("about", {});
});

app.get("/signin", (req, res) => {
    res.send("Sign in page");
});

app.post("/items/:itemID", async (req, res) => {
    const itemID = req.params.itemID;
    console.log("grabbed ", req.body.editName);
    const newName = req.body.editName;
    console.log("new name ", newName);
    const item = await Item.findByIdAndUpdate(itemID, {altName: newName}, {new: true});
    console.log("alt name of ", item.name, " is ", item.altName);
    res.redirect("/collections/wish1");
});






app.listen(3000, () => {
    console.log("Server started on port 3000");
});