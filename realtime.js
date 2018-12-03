/* Display a graph of historical values retrieved from the random.cgi service.
 * Clicking anywhere on the page pauses/resumes the requests to the server.
 */

var SERVICE_URL = 'http://localhost/~colin/jsgraph/random.cgi';
var MAX_POINTS = 1000;  // How much history we keep
var UPDATE_INTERVAL = 250;  // Delay between updates, in milliseconds

var timer;
var series = [];
var options = {
  xaxis: { mode: "time", timeformat: "%M:%S" },  // only show minutes & seconds
  yaxis: { min: 0 },
  grid: { hoverable: true }
};

// Show the value when we're hovering over a point on the chart
function hover(event, pos, item) {
  if (item) {
    $("#label").css("display", "block");
    $("#label").css("position", "absolute");
    // Offset the label so it's not covered by the cursor
    $("#label").css("left", (item.pageX + 10) + "px");
    $("#label").css("top", (item.pageY - 20) + "px");
    $("#label").text(item.datapoint[1]);
  }
  else {
    $("#label").css("display", "none");
  }
};

// Callback function which adds retrieved value to time series.
function addData(response) {
  var timestamp = (new Date()).getTime();
  series.push([timestamp, response]);
  plotSeries();
  while (series.length > MAX_POINTS) {
    series.shift();
  }
};

// Fetch data from web service
function update() {
  $.ajax({
    url: SERVICE_URL,
    jsonp: 'addData',
    dataType: 'jsonp',
    success: function(response) {
      // addData() does all the work
    }
  });
}

// use Flot to plot the series on the chart
function plotSeries() {
  if (series.length < 2)
    return;
  var placeholder = $("#placeholder");
  var p = $.plot(placeholder, [series], options);
}

// Start timer to periodically fetch data.
function startTimer() {
  timer = setInterval(update, UPDATE_INTERVAL);
}

// Pause or resume fetching of data
function toggleTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = undefined;
  }
  else {
    startTimer();
  }
}

// when the page is ready
$(function () {
  // call our hover function on plothover events
  var placeholder = $("#placeholder");
  placeholder.bind("plothover", hover);

  addEventListener("click", toggleTimer);

  timer = setInterval(update, 250);
});
