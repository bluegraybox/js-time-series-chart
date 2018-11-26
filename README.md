# JS Time Series Chart

Very simple demo project using [Flot](https://github.com/flot/flot/blob/master/README.md) to graph time series data.

Data is stored as JavaScript in `n-transactions.js` and loaded using JSONP.
It's done this way so that you don't need to run a web server - you can just open the `index.html` file in a browser.

At first, I tried to load the data file with jQuery's `load` function, and got a cross-site request error.
For security reasons I don't fully understand, Chrome won't load files with a `file:` URL - it requires `http:`.
So you need to be running a web server, and getting that set up and configured is more hassle than I want to put someone through.
