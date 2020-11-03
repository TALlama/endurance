var startTS = Date.UTC(2017, 0, 20, 7, 0, 0);
var endTS = Date.UTC(2021, 0, 20, 7, 0, 0);

function numberWithCommas(n) {
    var parts=n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

function addTooltips() {
  addTooltip($('#milliseconds.its-been'), 'millisecond', 1);
  addTooltip($('#seconds.its-been'), 'second', 1000);
  addTooltip($('#minutes.its-been'), 'minute', 1000*60);
  addTooltip($('#hours.its-been'), 'hour', 1000*60*60);
  addTooltip($('#days.its-been'), 'day', 1000*60*60*24);
  addTooltip($('#weeks.its-been'), 'week', 1000*60*60*24*7);
  addTooltip($('#years.its-been'), 'year', 1000*60*60*24*365.251);
}

function addTooltip(itsBeen, label, slice) {
  var msTotal = endTS - startTS;
  itsBeen.attr('title', `Each ${label} is ${(slice/msTotal*100.0).toFixed(9)}% of the term`);
}

function updateItsBeen(itsBeen, msElapsed, msTotal, divider) {
  itsBeen.find('.elapsed .val').text(numberWithCommas((msElapsed/divider).toFixed(0)));
  itsBeen.find('.to-endure .val').text(numberWithCommas(((msTotal-msElapsed)/divider).toFixed(0)));
}

function updateTimes(now) {
  now = now || new Date();
  var nowTS = now.getTime();
  
  var msTotal = endTS - startTS;
  var msElapsed = nowTS - startTS;
  var msPercent = (msElapsed/msTotal*100.0);
  
  updateItsBeen($('#milliseconds.its-been'), msElapsed, msTotal, 1);
  updateItsBeen($('#seconds.its-been'), msElapsed, msTotal, 1000);
  updateItsBeen($('#minutes.its-been'), msElapsed, msTotal, 1000*60);
  updateItsBeen($('#hours.its-been'), msElapsed, msTotal, 1000*60*60);
  updateItsBeen($('#days.its-been'), msElapsed, msTotal, 1000*60*60*24);
  updateItsBeen($('#weeks.its-been'), msElapsed, msTotal, 1000*60*60*24*7);
  updateItsBeen($('#years.its-been'), msElapsed, msTotal, 1000*60*60*24*365.251);
  
  $('.percentage').text(`We're ${msPercent.toFixed(5)}% of the way through`);
  $('#content').attr('style', `background-size: ${100 - msPercent}%;`);
}

function animateTimes() {
  requestAnimationFrame(function() {
    updateTimes();
    animateTimes();
  });
}

$(function() {
  addTooltips();
  
  var match = document.location.href.match(/\?ts=([^&]+?)(&|$)/);
  if (match) {
    var freeze = new Date(match[1]);
    $('.frozen').text(`As of ${freeze.toLocaleString()},`);
    updateTimes(freeze);
  } else {
    animateTimes();
  }
});