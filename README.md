# AI-Based Stock Price Predictor
 An intuitive, web-based application leveraging the power of Artificial Intelligence (AI) to predict stock price movements with the aid of Machine Learning (ML).
 
## Project Overview
This project presents an innovative approach to predicting stock price movements using the power of AI. At the heart of the system is an LSTM (Long Short-Term Memory) Machine Learning model, trained with historical stock data to predict future price movements.

Using JavaScript and TensorFlow.js, a powerful library for machine learning, the LSTM model processes and learns from the historical closing prices of a given stock at 15-minute intervals. This information is then used to make predictions about future stock prices. 

The model's predictions are displayed alongside actual stock prices in a visually pleasing and easily comprehensible manner, thanks to the Charts.js library. This visual comparison gives users the opportunity to directly observe the performance of the AI model against the real-world data.

The stock data itself is sourced in real-time from the Alpha Vantage API, providing up-to-the-minute accuracy and relevance. The backend operations are handled using Express.js, a minimalist web application framework for Node.js, making the application fast, reliable, and efficient.

All the operations are executed within a user-friendly and intuitive web interface built with HTML, CSS, and JavaScript, enhancing the user experience and making the complex workings of AI and ML accessible to everyone.

## How to Use
1. Clone the repository.
2. Install the necessary dependencies by running `npm install` from the command line.
3. Start the server by running `npm start`.
4. Open a web browser and navigate to `localhost:3000` to interact with the application.

## Technologies Used
This project is built using a range of technologies:
- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- Express.js: A fast, unopinionated, minimalist web framework for Node.js.
- TensorFlow.js: A JavaScript library for training and deploying ML models in the browser and on Node.js.
- Alpha Vantage API: A leading provider of free APIs for realtime and historical data on stocks.
- Charts.js: A flexible JavaScript charting library for designers & developers.
- HTML, CSS, JavaScript: Standard technologies for building web pages and applications.

## Known Issues
This project is a work in progress and, as such, there may be certain issues that you encounter while using it. One such issue that we're currently working on is the initial load time; due to the complex nature of the AI model, there may be some slowness on load. We understand this can affect the user experience and we're actively working on ways to optimize the model without compromising on its accuracy.

Slow load times: Due to the adjustment of the training process from 125 to 10 epochs, the project's initial load time will be faster than before. This change was made to improve the project's initialization speed, although it will certainly have an impact on the accuracy of the AI model.

Additionally, while we strive to make our predictions as accurate as possible, it's important to understand that the model's predictions should not be used for actual trading decisions. The world of stock trading is incredibly complex and while our AI model is a powerful tool, it does not take into account all possible factors that could influence a stock's price. Therefore, any trading decisions should be made with careful consideration and professional advice.

## Future Development
Going forward, there are several exciting avenues for improvement and extension of this project. One of these is incorporating additional dimensions of data into our AI model. Currently, the model utilizes 'close price' data for training and prediction, and while this gives a good approximation, it doesn't tell the whole story of the stock's movement.

Improved Accuracy: Currently, the AI model achieves its highest accuracy when trained for 125 epochs. However, due to load time considerations, the number of epochs has been temporarily reduced to 10. As part of future development, the intention is to train the model before loading the page to strike a balance between accuracy and load time. This approach will ensure that the AI model's accuracy is optimized while maintaining an acceptable load time for the project.

A significant future enhancement would be to factor in the trading 'volume' into our AI model. Volume is a key indicator in stock trading, as it reflects the number of shares that changed hands during a given period. High-volume periods can often signal important events driving increased trading activity, such as earnings releases, product launches, or news shocks.

By incorporating volume data, the AI model will have access to richer context and potentially identify patterns and dependencies that are not visible with price data alone. This could improve the accuracy of our predictions and create a more robust AI model.

Stay tuned for these enhancements as we continue to make our AI-based stock price predictor even more powerful and accurate.

## License
This project is licensed under the terms of the MIT license. 
