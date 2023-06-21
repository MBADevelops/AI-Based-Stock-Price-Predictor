// I start by importing TensorFlow.js for machine learning and axios for HTTP requests.
const tf = require('@tensorflow/tfjs-node');
const axios = require('axios');

// To make things easy, I define the API endpoint and key here.
const API_URL = 'https://www.alphavantage.co/query';
const API_KEY = '1EH4LMFAV6A2LY6T'; 

async function trainModel() {
    // I fetch stock price data from the Alpha Vantage API.
    const response = await axios.get(API_URL, {
        params: {
            function: 'TIME_SERIES_INTRADAY',
            interval: '15min',
            symbol: 'TSLA',
            outputsize: 'compact',
            datatype: 'json',
            apikey: API_KEY
        }
    });

    const timeSeriesData = response.data['Time Series (15min)'];
    let closingPrices = [];

    // I extract closing prices from the data I fetched.
    for(let datetime in timeSeriesData) {
        closingPrices.push(parseFloat(timeSeriesData[datetime]['4. close']));
    }

    // To improve my model's performance, I normalize the closing prices.
    let maxPrice = Math.max(...closingPrices);
    let minPrice = Math.min(...closingPrices);
    let normalizedPrices = closingPrices.map(price => (price - minPrice) / (maxPrice - minPrice));

    // I generate sequences of prices to be used as inputs for my model.
    let sequences = [];
    let sequenceLength = 26;
    for(let i = 0; i < normalizedPrices.length - sequenceLength; i++) {
        let sequence = normalizedPrices.slice(i, i + sequenceLength);
        sequences.push(sequence);
    }

    let X = [];
    let y = [];

    // I prepare the inputs (X) and targets (y) for my model.
    for(let i = 0; i < sequences.length - 1; i++) {
        let sequence = sequences[i].map(value => [value]);  // Wrapping each value in an array to match the expected input format.
        X.push(sequence);
        y.push([sequences[i + 1][25]]);
    }

    // I define and compile my LSTM model.
    let model = tf.sequential();
    model.add(tf.layers.lstm({units: 100, returnSequences: true, inputShape: [sequenceLength, 1]}));
    model.add(tf.layers.lstm({units: 50}));
    model.add(tf.layers.dense({units: 1}));
    model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
    });

    // I convert my JavaScript arrays to tensors for model training.
    let xs = tf.tensor3d(X, [X.length, sequenceLength, 1]);
    let ys = tf.tensor2d(y, [y.length, 1]);

    // The training begins!
    await model.fit(xs, ys, {
        epochs: 125
    });

    // I return the trained model.
    return model;
}

// I initiate the model training and handle any potential errors.
trainModel()
    .then(model => {
        console.log("Hooray, the model is trained successfully!");
    })
    .catch(error => {
        console.log("Uh-oh, something went wrong during model training: ", error);
    });

// I export the trainModel function so it can be used in other modules.
module.exports = trainModel;
