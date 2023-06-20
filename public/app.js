// To ensure a smooth experience, I make sure the entire HTML document is loaded before my JavaScript code starts running. 
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('The document is now fully loaded and ready for my JavaScript to take over.');
});

// I start by defining the context for the chart that I will be drawing.
let ctx = document.getElementById('StockAI').getContext('2d');

// I create an initially empty line chart using Chart.js. This will fill with data later on.
let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],  // These labels will be populated with timestamps in the future.
        datasets: [{
            label: 'Stock Price',
            data: [],  // This will contain the actual stock prices once I have them.
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        },
        {
            label: 'Prediction',
            data: [],  // This will hold the predicted prices when they're available.
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            },
            y: {}
        }
    }    
});

// Now, it's time to fetch the stock price data from my server.
fetch('http://localhost:3000/fetch-stock-data')
    .then(response => {
        // I verify that the request was successful before proceeding.
        if (!response.ok) {
            throw new Error('There seems to be an issue with the network response.');
        }
        // If all is well, I proceed to parse the JSON response from the server.
        return response.json();
    })
    .then(data => {
        // To make them easier to handle, I convert the string timestamps into actual JavaScript Date objects.
        data.timestamps = data.timestamps.map(timestamp => new Date(timestamp));

        // For debugging purposes, I log the received data to the console.
        console.log("Here's the data received from the server:", data);
        console.log("Have all timestamps been correctly formatted as strings?", data.timestamps.every(timestamp => typeof timestamp === 'string'));  
        console.log("Are all prices correctly represented as valid numbers?", data.prices.every(price => typeof price === 'number' && !isNaN(price)));  
        console.log("Have all predictions been correctly represented as valid numbers?", data.predictions.every(prediction => typeof prediction === 'number' && !isNaN(prediction)));

        // With the data now in hand, I update the chart.
        chart.data.labels = data.timestamps;
        chart.data.datasets[0].data = data.prices;
        chart.data.datasets[1].data = data.predictions;
        chart.update(); // And here we go, the chart is brought to life!
    })
    .catch(error => console.error('Oops, an error occurred:', error));
