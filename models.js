const mongoose = require("mongoose");

//tags {name, wishlistID}
const tagSchema = {
    name: String
};
const Tag = mongoose.model("tag", tagSchema);

//items {name, price, tags, URLlistID, imgURL}
const itemSchema = {
    name: String,
    price: String,
    tags: [tagSchema],
    //URLlistID: String,
    imgURL: String,
    link: String,
    altName: String
};
const Item = mongoose.model("item", itemSchema);

//URLlists {url, storeName, wishlistID}
const listSchema = {
    url: String,
    storeName: String,
    //wishwellyID: String,
    items: [itemSchema]
};
const List = mongoose.model("list", listSchema);
//stores that could have multiple lists
const storeSchema = {
    name: String,
    lists: [listSchema]
};
const Store = mongoose.model("store", storeSchema);
//wishlists {slug, userID, title, tags}
const wishwellySchema = {
    slug: String,
    //userID: String,
    title: String,
    //tags: [],
    stores: [storeSchema]
};
const Wishwelly = mongoose.model("wishwelly", wishwellySchema);

//users {email, password}
const userSchema = {
    email: String,
    password: String,
    wishwellys: [wishwellySchema]
};
const User = mongoose.model("user", userSchema);
//encrypt password!

module.exports = {Tag, Item, List, Store, Wishwelly, User};