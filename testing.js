const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://worldtimeapi.org/timezones';

const timezones = [];
const cities = [];

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('ul li, ol li').each((i, elem) => {
      const timezone = $(elem).text();

      if (timezone.includes('/') && !/\d/.test(timezone)) {
        const [, city] = timezone.split('/');
        if(!(cities.includes(city))){
          cities.push(city.replace('_', ' '));
        }
        timezones.push(timezone);
      }
    });

  })
  .catch(error => {
    console.error('Error fetching the webpage:', error);
  });