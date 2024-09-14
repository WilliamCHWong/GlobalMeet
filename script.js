
// Array to store people's data
const peopleData = [];

function ToDate (dateTimeString){
    const date = new Date(dateTimeString);
    let year = date.getFullYear();
    let month = date.toLocaleString('default', { month: 'short' });
    let day = date.getDay();
    return `${year}-${month}-${day}`;
}

function To24hours(dateTimeString){
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}`
}

function updateTable() {
    const tableBody = document.getElementById('peopleTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    let index = 0

    // Dynamic table
    peopleData.forEach(person => {
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = person.name;
        newRow.insertCell(1).textContent = person.city;
        newRow.insertCell(2).textContent = ToDate(person.startTime) + ' ' + To24hours(person.startTime);
        newRow.insertCell(3).textContent = ToDate(person.endTime) + ' ' + To24hours(person.endTime);

        // Remove button
        const removeButton = document.createElement("button");
        removeButton.dataset.index = index; // Keep track of the index in the array
        removeButton.textContent = "Remove";
        removeButton.type = "button";
        newRow.insertCell(4).appendChild(removeButton);
        removeButton.addEventListener('click', function (){
            const indexToRemove = removeButton.dataset.index;
            peopleData.splice(indexToRemove, 1);
            updateTable(); 
        })

        index += 1;
    });
}

document.getElementById('peopleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    // Store in the array
    peopleData.push({ name, city, startTime, endTime });

    // Update the table
    updateTable();

    // Clear the form
    document.getElementById('peopleForm').reset();
});

// Reset
document.getElementById('resetButton').addEventListener('click', function() {
    peopleData.length = 0;
    updateTable();
});

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
