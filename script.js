const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://worldtimeapi.org/timezones';
const HTTP_PORT = 3001;

const timezones = [];
const cities = [];
const peopleData = [];

app.set('view engine', 'ejs');
// Middleware to parse data from the form submission
app.use(express.urlencoded({ extended: true }));


const fetchCities = async () => {
    try {
      const response = await axios.get(url);

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

    } catch (error) {
      console.error('Error fetching the timezones:', error);
    }
  };

  app.get('/', async (req, res) => {
    if (cities.length === 0) {
      await fetchCities();
    }
    res.render('index', { cities, peopleData });
});

app.post('/add-person', (req, res) => {
    const { name, city, startTime, endTime } = req.body;
    peopleData.push({ name, city, startTime, endTime });
    res.render('index', { cities, peopleData });
});

app.listen(HTTP_PORT, () => {
    console.log(`Server is listening at http://localhost:${HTTP_PORT}`);
  });