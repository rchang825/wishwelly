const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect mongoose and set up schemas
mongoose.connect("mongodb://localhost:27017/wishwellyDB");

//tags {name, wishlistID}
const tagSchema = {
    name: String
};
const Tag = mongoose.model("tag", tagSchema);

//items {name, price, tags, URLlistID, imgURL}
const itemSchema = {
    name: String,
    price: Number,
    tags: [tagSchema],
    //URLlistID: String,
    imgURL: String
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

//wishlists {slug, userID, title, tags}
const wishwellySchema = {
    slug: String,
    //userID: String,
    title: String,
    //tags: [],
    lists: [listSchema]
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

//testDisplay();

    const tag1 = new Tag({
        name: "clothing"
    });
    const tag2 = new Tag({
        name: "electronics"
    });
    const tag3 = new Tag({
        name: "decor"
    });
    const exTags = [tag1, tag2, tag3];
    const item1 = new Item({
        name: "Ring Light",
        price: 40,
        //tags: defaultTags
        imgURL: "./media/A.jpg"
    });
    const item2 = new Item({
        name: "Gift card",
        price: 100,
        tags: exTags,
        imgURL: "./media/B.jpeg"
    });
    const item3 = new Item({
        name: "Sun catcher",
        price: 13.50,
        //tags: defaultTags
        imgURL: "./media/C.jpeg"
    });

    const exItems = [item1, item2, item3];

    const list1 = new List({
        url: "amazon.com",
        storeName: "Amazon",
        items: exItems
    });

    list1.items.push(item1);
    list1.items.push(item3);
    list1.items.push(item2);
    list1.save();
    const list2 = new List({
        url: "nordstrom.com",
        storeName: "Nordstrom",
        items: exItems
    });
    list2.save();
    const wish1 = new Wishwelly({
        slug: "wish1",
        title: "Wishwelly 1",
        lists: [list1, list2]
    });
    wish1.save();
    const user1 = new User ({
        email: "user1@w.com",
        password: "qwerty",
        wishwellys: [wish1]
    });
    user1.save();







app.get("/", (req, res) => {
    //res.send("<h1>Home<h1>");
    res.render("display", {wishwelly: wish1, lists: wish1.lists});
});










app.listen(3000, () => {
    console.log("Server started on port 3000");
});