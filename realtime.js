var MAX_POINTS = 1000;
var timer;
var series = [];
var options = {
  xaxis: { mode: "time", timeformat: "%H:%M:%S" },
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

function addData(text) {
  series.push([(new Date()).getTime(), text]);
  plotSeries();
  while (series.length > MAX_POINTS) {
    // clearTimeout(timer);
    series.shift();
  }
};

function update() {
  $.ajax({
    url: 'http://localhost/~colin/jsgraph/realtime.cgi',
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

function startTimer() {
  timer = setInterval(update, 250);
}

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
  update();
  plotSeries();
  window.addEventListener("click", toggleTimer);
  timer = setInterval(update, 250);
});
