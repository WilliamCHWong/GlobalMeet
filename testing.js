const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://worldtimeapi.org/timezones';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const timezones = [];
    const cities = [];

    $('ul li, ol li').each((i, elem) => {
      const timezone = $(elem).text();

      if (timezone.includes('/') && !/\d/.test(timezone)) {
        const [, city] = timezone.split('/');
        timezones.push(timezone);
        cities.push(city);
      }
    });
    console.log(timezones);
    console.log(cities);
  })
  .catch(error => {
    console.error('Error fetching the webpage:', error);
  });
