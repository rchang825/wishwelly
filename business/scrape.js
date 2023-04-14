const axios = require('axios');
const cheerio = require("cheerio");
const {Item, List} = require("../models");

async function scrape(url) {
    
    const response = await axios.get(url, {
        headers: {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"}
    });
    let store = "";
    if(url.includes("amazon.com")) {
        store = "Amazon";
    } else if(url.includes("etsy.com")) {
        store = "Etsy";
    }
    const $ = cheerio.load(response.data);


    switch(store) {
        case "Amazon":
            return {
                scrapedItems: scrapeAmazon($),
                storeName: store
            };
            break;
        case "Etsy":
            return {
                scrapedItems: scrapeEtsy($),
                storeName: store
            };
            break;
    }

}

function scrapeAmazon($) {
    const $items = $("ul#g-items li.g-item-sortable");
    const scrapedItems = $items.toArray().map((element) => {
        const item = {};
        item.price = $(element).prop('data-price');
        item.name = $(element).find(".a-list-item div a.a-link-normal").prop("title");
        item.imgURL = $(element).find(".a-list-item div img").prop("src");
        item.link = "https://amazon.com" + $(element).find(".a-list-item div a.a-link-normal").prop("href");
        return item;
    });
    //console.log("scrapedItems", scrapedItems);
    return scrapedItems;    
}

function scrapeEtsy($) {
    const $items = $("li.v2-listing-card");
    const scrapedItems = $items.toArray().map((element) => {
        const item = {};
        item.price = $(element).find("div.n-listing-card__price p.lc-price span.currency-value").text();
        item.name = $(element).find("a.listing-link").prop("title");
        item.imgURL = $(element).find("div.height-placeholder img").prop("src");
        item.link = $(element).find("a.listing-link").prop("href");
        return item;
    });
    // console.log("scraped items:", scrapedItems);
    return scrapedItems;
}



async function scrapeAndCreateList(listURL) {
    const scrapedData = await scrape(listURL);
    const {scrapedItems, storeName} = scrapedData;
    const items = [];
    scrapedItems.forEach(async scrapedItem => {
        const item = new Item({
            name: scrapedItem.name,
            price: scrapedItem.price,
            imgURL: scrapedItem.imgURL,
            link: scrapedItem.link,
            altName: scrapedItem.name
        });
        items.push(item);
        //await item.save();
    });

    const list = new List({
        url: listURL,
        storeName: storeName,
        items: items
    });
    await list.save();   
    //console.log("created store: ", store);
    return list;
}

async function scrapeToWishwelly(listURL, wishwelly) {
    const scrapedData = await scrapeAndCreateList(listURL);
    const list = scrapedData;
    wishwelly.lists.push(list);
    await wishwelly.save();
    return list;
}

module.exports = {scrape, scrapeAndCreateList, scrapeToWishwelly};