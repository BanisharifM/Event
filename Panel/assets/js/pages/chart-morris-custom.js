"use strict";
$(document).ready(function() {
  Morris.Line({
    element: "morris-line-chart",
    data: [
      { y: "2006", a: 20 },
      { y: "2007", a: 55 },
      { y: "2008", a: 45 },
      { y: "2009", a: 75 },
      { y: "2010", a: 50 },
      { y: "2011", a: 75 },
      { y: "2012", a: 100 }
    ],
    xkey: "y",
    redraw: true,
    resize: true,
    smooth: true,
    ykeys: ["a"],
    hideHover: "auto",
    responsive: true,
    labels: ["Series A"],
    lineColors: ["#a389d4"]
  });
});
