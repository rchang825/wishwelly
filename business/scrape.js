const axios = require('axios');
const cheerio = require("cheerio");
const {Item, List} = require("../models");

async function scrape(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const $items = $("ul#g-items li.g-item-sortable");
    const scrapedItems = $items.toArray().map((element) => {
        const item = {};
        item.price = $(element).prop('data-price');
        item.name = $(element).find(".a-list-item div a.a-link-normal").prop("title");
        item.imgURL = $(element).find(".a-list-item div img").prop("src");
        item.link = "https://amazon.com" + $(element).find(".a-list-item div a.a-link-normal").prop("href");
        return item;
    });
    console.log("scrapedItems", scrapedItems);
    return scrapedItems;
}

async function scrapeAndCreateList(listURL) {
    const scrapedItems = await scrape(listURL);
    const items = [];
    scrapedItems.forEach(async scrapedItem => {
        const item = new Item({
            name: scrapedItem.name,
            price: scrapedItem.price,
            imgURL: scrapedItem.imgURL,
            link: scrapedItem.link
        });
        items.push(item);
        await item.save();
    });

    const list = new List({
        url: listURL,
        storeName: "Amazon",
        items: items
    });
    list.save();
    return list;
}

async function scrapeToWishwelly(listURL, wishwelly) {
    const list = await scrapeAndCreateList(listURL);
    wishwelly.lists.push(list);
    wishwelly.save();
    return list;
}

module.exports = {scrape, scrapeAndCreateList, scrapeToWishwelly};