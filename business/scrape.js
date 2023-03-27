const axios = require('axios');
const cheerio = require("cheerio");
module.exports = async function scrape(url) {
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