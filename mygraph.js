// I don't know if the data is guaranteed to finish loading before the page is ready, so don't try to plot the graph until both are done.
var pageReady = false;
var parsed = false;

var series;
var options = {
  xaxis: { mode: "time", timeformat: "%Y/%m/%d" },
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

// parse a point of the form [ '2017-11-13 00:00:00', 271662.4285714286 ]
// into JS time and integer
function parsePoint(text) {
  var ds = text[0].replace(/ /, 'T');
  var d = new Date(ds);
  return [d.getTime(), Math.round(text[1])];
}

// parse all the points in a series
function parseSeries(text) {
  return text.map(parsePoint);
}

// parse all the series in the response
// This is the function specified in index.html as the JSONP callback, which is invoked when the data finishes loading.
// (Which is why it's not referenced anywhere else in this file.)
function parseResponse(text) {
  series = text.map(parseSeries);
  parsed = true;
  plotSeries();
}

// use Flot to plot the series on the chart
function plotSeries() {
  // only if the page is ready and the data is loaded and parsed
  if (parsed && pageReady) {
    var placeholder = $("#placeholder");
    var p = $.plot(placeholder, series, options);
    // call our hover function on plothover events
    placeholder.bind("plothover", hover);
  }
}

// when the page is ready
$(function () {
  pageReady = true;
  plotSeries();
});
