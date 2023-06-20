// Here I'm requiring the necessary modules for the project
const axios = require('axios');   // for making HTTP requests to the Alpha Vantage API
const express = require('express');  // for building my server
const trainModel = require('./trainModel');  // my custom module for training the LSTM model
const app = express();
const port = 3000;

// I'm using TensorFlow.js for training the LSTM model
const tf = require('@tensorflow/tfjs-node');

// I've defined my API endpoint and key here for simplicity
const API_URL = 'https://www.alphavantage.co/query';
const API_KEY = '1EH4LMFAV6A2LY6T'; // I've replaced this with my actual API key

// I've set up some express middleware to parse JSON and serve my public directory
app.use(express.json());
app.use(express.static('public'));

// Here's where I train my model and start the server once the model is ready
let model;
trainModel().then((trainedModel) => {
    model = trainedModel;
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});

// Here's my route for making predictions using the trained model
app.post('/predict', (req, res) => {
    let data = req.body.data;

    // I'm reshaping the data to match the input shape expected by the model
    data = tf.tensor3d(data, [data.length, data[0].length, 1]);
    
    // I make the prediction and convert the output tensor to a JavaScript array
    const prediction = model.predict(data).arraySync();
    
    // I send the prediction back as a response
    res.send({ prediction: prediction });
});

// Here's my route for fetching stock data from Alpha Vantage
app.get('/fetch-stock-data', (req, res) => {
    axios.get(API_URL, {
        params: {
            function: 'TIME_SERIES_INTRADAY',
            interval: '15min',
            symbol: 'TSLA',
            outputsize: 'compact',
            datatype: 'json',
            apikey: API_KEY
        }
    })
    .then(response => {
        const timeSeriesData = response.data['Time Series (15min)'];
        let closingPrices = [];
        let timestamps = [];

        // I parse the API response to get the closing prices and timestamps
        for(let datetime in timeSeriesData) {
            closingPrices.push(parseFloat(timeSeriesData[datetime]['4. close']));
            timestamps.push(datetime);
        }

        // Here's where I make predictions for each sequence in the closing prices
        let predictions = [];
        let sequenceLength = 26; // I'm using the same sequence length as when I trained the model
        for(let i = 0; i < closingPrices.length - sequenceLength; i++) {
            let sequence = closingPrices.slice(i, i + sequenceLength);

            // I normalize the sequence to improve the model's performance
            let maxPrice = Math.max(...sequence);
            let minPrice = Math.min(...sequence);
            let normalizedSequence = sequence.map(price => (price - minPrice) / (maxPrice - minPrice));

            // I reshape the sequence and convert it to a tensor for prediction
            let sequenceTensor = tf.tensor3d(normalizedSequence, [1, sequence.length, 1]);
            let prediction = model.predict(sequenceTensor).arraySync()[0][0];

            // I denormalize the prediction to get it back in the original price range
            let denormalizedPrediction = prediction * (maxPrice - minPrice) + minPrice;

            predictions.push(denormalizedPrediction);
        }

        // I package the timestamps, prices, and predictions into an object and send it as a response
        const data = { 
            timestamps: timestamps, 
            prices: closingPrices, 
            predictions: predictions
        };

        res.send(data);
    })
    .catch(error => {
        // In case of an error, I log it and send a 500 status code with a descriptive error message
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Error fetching stock data' });
    });    
});

// I've added a catch-all route to handle any requests to undefined routes
app.all('*', (req, res) => {
    res.status(404).send('404 Not Found');
});
