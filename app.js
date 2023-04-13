const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const https = require("https");
const axios = require('axios');
const cheerio = require("cheerio");

const {scrape, scrapeToWishwelly} = require("./business/scrape");
const {Tag, Item, List, Wishwelly} = require("./models");
const {scrapeAndCreate} = require("./scripts/seed");

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
    const wish = await Wishwelly.findOne({slug: requestedSlug}).populate("lists");
    const stores = req.query.store;

    if(wish === null || wish.lists.length === 0) {
        res.redirect(requestedSlug + "/edit");
        return;
    }
    let lists = wish.lists.sort((a, b) => {
        if (a.storeName < b.storeName) {
            return -1;
        }
        if (a.storeName > b.storeName) {
            return 1;
        }
        return 0;
    });
    //console.log("stores:", stores);
    const storeNames = lists.map(list => list.storeName);
    if (stores) {
        lists = lists.filter(list => stores.includes(list.storeName));
    }
    const storeFilters = new Set(storeNames);
    res.render("display", {
        wishwelly: wish, 
        lists: lists,
        storeFilters: storeFilters,
        selectedStores: stores
    });

});

app.get("/collections/:slug/edit", async (req, res) => {
    const requestedSlug = req.params.slug;
    const wish = await Wishwelly.findOne({slug: requestedSlug}).populate("lists");
    const stores = req.query.store;
    

    let lists = wish.lists.sort((a, b) => {
        if (a.storeName < b.storeName) {
            return -1;
        }
        if (a.storeName > b.storeName) {
            return 1;
        }
        return 0;
    });
    const storeNames = lists.map(list => list.storeName);
    if (stores) {
        lists = lists.filter(list => stores.includes(list.storeName));   
    }
    const storeFilters = new Set(storeNames);
    res.render("edit", {
        wishwelly: wish, 
        lists: lists,
        storeFilters: storeFilters,
        selectedStores: stores,
        slug: requestedSlug
    });
});

app.get("/collections/:slug/new", async (req, res) => {
    const requestedSlug = req.params.slug;
    const wish = await Wishwelly.findOne({slug: requestedSlug}).populate("lists");
    const newLink = req.query.newLink;
    const list = await scrapeToWishwelly(newLink, wish);
    //const redirectLink = "/collections/" + requestedSlug
    res.render("new", {
        wishwelly: wish, 
        list: list, 
        slug: requestedSlug
    });
});

app.post("/reset", async (req, res) => {
    await Wishwelly.deleteMany({});
    await List.deleteMany({});
    const wish = await scrapeAndCreate();
    const redirectLink = "/collections/" + wish.slug;
    res.redirect(redirectLink);
});

app.get("/about", (req, res) => {
    res.render("about", {});
});

app.get("/signin", (req, res) => {
    res.send("Sign in page");
});

app.post("/:listID/:itemID", async (req, res) => {
    const itemID = req.params.itemID;
    const listID = req.params.listID;
    const newName = req.body.editName;
    let list = await List.findOne({"_id":listID});

    // const list = await List.findOneAndUpdate({_id: listID, "items._id": itemID}, { $set: {"items.$.altName": newName}}, { new: true });


    const item = list.items.id(itemID);
    item.altName = newName;
    await list.save();
    //res.redirect("/collections/wish1");
});










app.listen(3000, () => {
    console.log("Server started on port 3000");
});