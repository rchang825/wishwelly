const mongoose = require("mongoose");

//tags {name, wishlistID}
const tagSchema = {
    name: String
};
const Tag = mongoose.model("Tag", tagSchema);

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
const Item = mongoose.model("Item", itemSchema);

//URLlists {url, storeName, wishlistID}
const listSchema = {
    url: String,
    storeName: String,
    //wishwellyID: String,
    items: [itemSchema]
};
const List = mongoose.model("List", listSchema);
//wishlists {slug, userID, title, tags}
const wishwellySchema = {
    slug: String,
    //userID: String,
    title: String,
    //tags: [],
    lists: [{type: mongoose.Schema.Types.ObjectId, ref: "List"}]
};
const Wishwelly = mongoose.model("Wishwelly", wishwellySchema);

//users {email, password}
const userSchema = {
    email: String,
    password: String,
    wishwellys: [wishwellySchema]
};
const User = mongoose.model("User", userSchema);
//encrypt password!

module.exports = {Tag, Item, List, Wishwelly, User};