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
  
  if (msPercent > 100) {
    msTotal = endTS - startTS;
    msElapsed = endTS - startTS;
  
    $('.percentage').text(`Our long national nightmare is over.`);
    $('#content').addClass('celebratory').attr('style', `background-size: 2%;`);
    fireSparkler();
  } else {
    $('.percentage').text(`We're ${msPercent.toFixed(5)}% of the way through`);
    $('#content').attr('style', `background-size: ${100 - msPercent}%;`);
  }
  
  updateItsBeen($('#milliseconds.its-been'), msElapsed, msTotal, 1);
  updateItsBeen($('#seconds.its-been'), msElapsed, msTotal, 1000);
  updateItsBeen($('#minutes.its-been'), msElapsed, msTotal, 1000*60);
  updateItsBeen($('#hours.its-been'), msElapsed, msTotal, 1000*60*60);
  updateItsBeen($('#days.its-been'), msElapsed, msTotal, 1000*60*60*24);
  updateItsBeen($('#weeks.its-been'), msElapsed, msTotal, 1000*60*60*24*7);
  updateItsBeen($('#years.its-been'), msElapsed, msTotal, 1000*60*60*24*365.251);
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

Array.prototype.sample = function sample() {
  return this[Math.floor((Math.random()*this.length))];
};

function randomBetween(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function fireSpark() {
  let spark = document.createElement('article');
  spark.classList.add('sparkler--spark')
  spark.classList.add('red blue'.split(' ').sample());

  let motionLength = randomBetween(400, 3000);
  let opacityLength = randomBetween(400, motionLength);
  spark.style.transition = `top ${motionLength}ms cubic-bezier(0, 1.4, 0.72, 1.4), left ${motionLength}ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity ${opacityLength}ms cubic-bezier(0.95, 0.05, 0.795, 0.035), transform ${opacityLength}ms cubic-bezier(0.95, 0.05, 0.795, 0.035)`;
  
  $('#content').append(spark);
  
  requestAnimationFrame(function() {
    let css = {
      top: randomBetween(0, 80) + "vh",
      left: randomBetween(20, 80) + "vw",
      opacity: 0,
      transform: 'scale(' + (1 + (randomBetween(-100, 200) / 100)) + ')'
    };
    $(spark).css(css);
  });
  
  setTimeout(function() {
    spark.remove();
  }, motionLength * 1.1);
}

function fireSparkler() {
  requestAnimationFrame(function() {
    fireSpark();
    fireSparkler();
  });
}
