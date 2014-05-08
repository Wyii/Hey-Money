var storage = window.localStorage;

function getDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    };
    var dateJSON = {
        year: date.getFullYear(),
        month: month,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        senonds: date.getSeconds()
    }
    return dateJSON;
}

function getDataByDate() {
    $('.report-table-js').html("");
    var today = $.datepicker.formatDate("yy/mm/dd", $(".date-input").datepicker("getDate"));
    if (!today) {
        var date = getDate();
        today = date.year + "/" + date.month + "/" + date.day;
        $(".date-input").val(today);
    };
    for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        if (today == key.split(' ')[0]) {
            valueJSON = JSON.parse(storage.getItem(key));
            $('.report-table-js').append("<tr><td>" + valueJSON.time + "</td><td>" + valueJSON.from + "</td><td>" + valueJSON.money + "</td></tr>");
        }
    }
}

function getDateForWeek() {
    var today = new Date();
    var weeks = [];
    for (var i = 0; i < 7; i++) {
        weeks.push($.datepicker.formatDate("mm/dd", new Date(today - 24 * 60 * 60 * 1000 * i)));
    }
    return weeks;
}

function getSeriesDataForWeek() {
    var today = new Date();
    var seriesArray = [];
    for (var i = 0; i < 7; i++) {
        var day = $.datepicker.formatDate("yy/mm/dd", new Date(today - 24 * 60 * 60 * 1000 * i));
        var dayData = 0;
        for (var j = 0; j < storage.length; j++) {
            var key = storage.key(j);
            if (day == key.split(' ')[0]) {
                dayData = dayData + JSON.parse(storage.getItem(key)).money;
            }
        }
        seriesArray.push(dayData);
    }
    return seriesArray;
};

function getSeriesDataForMonth() {
    var date = getDate();
    var month = date.year + "/" + date.month;
    var resultArray = [];
    for (var j = 0; j < storage.length; j++) {
        var key = storage.key(j);
        if (month == key.split("?")[0]&&"type=pay"== key.split("?")[2]) {

            var seriesArray = [];
            var temp = storage.getItem(key).split(",");
            seriesArray.push(temp[0]);
            seriesArray.push(temp[1] * -1);
        resultArray.push(seriesArray);

        }
    }
    return resultArray;
};



function drawWeek() {
    $('#aWeek').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'rgba(0,0,0,0)'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: getDateForWeek()
        },
        yAxis: {
            title: {
                text: '单位：元'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f} 元</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '收支',
            data: getSeriesDataForWeek()

        }]
    });
}

function drawMonth() {
    $('#aMonth').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: 'rgba(0,0,0,0)'
        },
        title: {
            text: null
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            type: 'pie',
            name: '收支占比',
            data: getSeriesDataForMonth()
        }]
    });
}

$(function() {
    getDataByDate();
    drawWeek();
    drawMonth();
    $('.date-input').change(function() {
        getDataByDate();
    });
    $("body").on("swipe", function() {
        window.location.href = "index.html";
    });
});