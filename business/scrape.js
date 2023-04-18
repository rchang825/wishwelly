const axios = require('axios');
const cheerio = require("cheerio");
const {Item, List} = require("../models");
const puppeteer = require('puppeteer');

async function scrape(url) {
    let store = "";
    
    if(url.includes("amazon.com")) {
        store = "Amazon";
    } else if(url.includes("etsy.com")) {
        store = "Etsy";
    } else if(url.includes("sephora.com")) {
        store = "Sephora";
    } else {
        return;
    }

    switch(store) {
        case "Amazon":
            return {
                scrapedItems: await scrapeAmazon(url),
                storeName: store
            };
            break;
        case "Etsy":
            return {
                scrapedItems: await scrapeEtsy(url),
                storeName: store
            };
            break;
        case "Sephora":
            return {
                scrapedItems: await scrapeSephora(url),
                storeName: store
            };
            break;
        default:
            return;
            
    }

}

async function scrapeAmazon(link) {
    let $ = await scrapeWithAxios(link);
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

async function scrapeEtsy(link) {
    let $ = await scrapeWithAxios(link);
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

async function scrapeSephora(link) {
    let $ = await scrapeWithPuppeteer(link);
    console.log("$? ", $);
    const $items = $('div[data-at="product_list_item"]');
    console.log("$items:", $items);
    console.log("toArray: ",  $items.toArray());
    const scrapedItems = $items.toArray().map((element) => {
        console.log("element: ", element);
        const item = {};
        item.price = $(element).find('[data-at="sku_item_price_list"]').text().substring(1);
        item.name = $(element).find('[data-at="sku_item_name"]').text();
        item.imgURL = $(element).find("picture img").prop("src");
        item.link = "sephora.com" + $(element).find("a").prop("href");
        return item;
    });
    console.log("scraped items:", scrapedItems);
    return scrapedItems;
}

async function scrapeWithPuppeteer(link) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36");
    await page.goto(link);
  //   await page.screenshot({'path': 'sephora_js.png'})
    const html = await page.content();
    console.log("html: ", html);
    await browser.close();
    let $ = cheerio.load(html);
    return $;
}

async function scrapeWithAxios(link) {
    const response = await axios.get(link, {
        headers: {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"}
    });
    let $ = cheerio.load(response.data);
    return $;
}

async function scrapeAndCreateList(listURL) {
    const scrapedData = await scrape(listURL);
    if(scrapedData == null) {
        return;
    }
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
    if(scrapedData == null) {
        return;
    }
    const list = scrapedData;
    wishwelly.lists.push(list);
    await wishwelly.save();
    return list;
}

module.exports = {scrape, scrapeAndCreateList, scrapeToWishwelly};