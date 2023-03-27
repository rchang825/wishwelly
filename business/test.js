//test();
module.exports = function test() {
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
        imgURL: "/media/A.jpg"
    });
    const item2 = new Item({
        name: "Gift card",
        price: 100,
        tags: exTags,
        imgURL: "/media/B.jpeg"
    });
    const item3 = new Item({
        name: "Sun catcher",
        price: 13.50,
        //tags: defaultTags
        imgURL: "/media/C.jpeg"
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
    //list1.save();
    const list2 = new List({
        url: "nordstrom.com",
        storeName: "Nordstrom",
        items: exItems
    });
    //list2.save();
    const wish1 = new Wishwelly({
        slug: "wish1",
        title: "Wishwelly 1",
        lists: [list1, list2]
    });
    //wish1.save();
    const user1 = new User ({
        email: "user1@w.com",
        password: "qwerty",
        wishwellys: [wish1]
    });
    //user1.save();
}