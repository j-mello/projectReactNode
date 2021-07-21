const ConversionRate = require("./models/mongo/ConversionRate");
const { Scrapper, MongooseGenerator } = require("./scrapper");

new Scrapper(
    {
        url:
            "http://api.exchangeratesapi.io/v1/latest?access_key=" + process.env.CONVERTER_RATE_API_KEY,
    },
    ({ base, date, rates }) => Object.keys(rates).map((key) => ({
        baseCurrency: base,
        targetCurrency: key,
        date: date,
        rate: rates[key]
    })),
    (data) => MongooseGenerator(data, ConversionRate)
).scrap();