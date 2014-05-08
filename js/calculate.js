var display1 = "";
var storage = window.localStorage;
var nums = "";
var numArray = [];
var symbol = "-";
var clickDate1;
var clickDate2;

//设置目标字体颜色

function setFontColor(option, color) {
    var temp = $('.' + option);
    for (var i = 0; i < temp.length; i++) {
        temp[i].style.color = color;
    }
    return;
};

//根据目标正负设置颜色

function setColorByNum(num) {
    if (num > 0) {
        symbol = "+";
        setFontColor('display1', "green");
        $('.display1').html(symbol + num);
    } else if (num == null || display1 == 0) {
        $('.display1').html("0.0");
        setFontColor('display1', "black");
    } else if (num < 0) {
        setFontColor('display1', "red");
        $('.display1').html(num);
    };
}

function getDataByDate() {
    var date = getDate();
    var today = date.year + "/" + date.month + "/" + date.day;
    for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        if (today == key.split(' ')[0]) {
            valueJSON = JSON.parse(storage.getItem(key));
            $('.report-table-js').append("<tr><th>" + valueJSON.date + " " + valueJSON.time + "</th><th>" + valueJSON.from + "</th><th>" + valueJSON.money + "</th></tr>");
        }
    }
}

//初始化数据

function initData() {
    var date = getDate();
    var today = date.year + "/" + date.month + "/" + date.day;
    for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        if (today == key.split(' ')[0]) {
            display1 = display1 * 1 + JSON.parse(storage.getItem(key)).money * 1;
        }
    }
    $('.display1').html(display1);

    setColorByNum(display1);
    if ('gain' == $('.switch').val()) {
        $('.gain-switch').show();
        $('.pay-switch').hide();
    } else {
        $('.gain-switch').hide();
        $('.pay-switch').show();
    }
};

function getXAxisCategories() {
    var date = getDate();
    var today = date.year + "/" + date.month + "/" + date.day;
    var xAxisCategories = [];
    for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        if (today == key.split(' ')[0]) {
            xAxisCategories.push(JSON.parse(storage.getItem(key)).time);
        }
    }
    return xAxisCategories;
};

function getSeriesData() {
    var date = getDate();
    var today = date.year + "/" + date.month + "/" + date.day;
    var seriesArray = [];
    for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        if (("display1" == key.split('?')[0])&&(today == key.split('?')[1]) ) {
            seriesArray.push(storage.getItem(key));
        }
    }
    return JSON.parse("[" + seriesArray + "]");
};



function drawHighcharts() {
    $('#container').highcharts({

        chart: {
            type: 'column',
            backgroundColor: 'rgba(0,0,0,0)'
        },

        title: {
            text: null
        },

        xAxis: {
            categories: ['0~3', '4~7', '8~11', '12~15', '16~19', '20~23']
        },

        yAxis: {
            allowDecimals: false,
            title: {
                text: '单位：元'
            }
        },

        tooltip: {
            formatter: function() {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    '总额: ' + this.point.stackTotal;
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: getSeriesData()
    });

};
//根据switch设置symbol

function setSymbol() {
    var temp = "";
    if ('gain' == $('.switch').val()) {
        temp = "+";
    } else {
        temp = "-";
    }
    return temp
}

function getDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    if (month<10) {
    	month = "0"+month;
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

function save(money) {
    var date = getDate();
    var key = date.year + "/" + date.month + "/" + date.day + " " + date.hours + ":" + date.minutes + ":" + date.senonds;
    var valueJSON = {
        date: date.year + "/" + date.month + "/" + date.day,
        time: date.hours + ":" + date.minutes,
        money: money
    }
    storage.setItem(key, JSON.stringify(valueJSON));
};

function saveByFrom(from, type, money) {
    var date = getDate();
    var key = "display1?" + date.year + "/" + date.month + "/" + date.day + "?from=" + from;
    if (!storage.getItem(key)) {
        var dataArray = [0, 0, 0, 0, 0, 0];
        var hours = date.hours;
        if (hours <= 3) {
            dataArray[0] = money;
        } else if (hours <= 7) {
            dataArray[1] = money;
        } else if (hours <= 11) {
            dataArray[2] = money;
        } else if (hours <= 15) {
            dataArray[3] = money;
        } else if (hours <= 17) {
            dataArray[4] = money;
        } else if (hours <= 23) {
            dataArray[5] = money;
        };
        var valueJSON = {
            name: from,
            data: dataArray,
            stack: type
        }
    } else {
        var dataFromStorage = JSON.parse(storage.getItem(key));
        var dataArray = dataFromStorage.data;
        var hours = date.hours;
        if (hours <= 3) {
            dataArray[0] = money + dataArray[0];
        } else if (hours <= 7) {
            dataArray[1] = money + dataArray[1];
        } else if (hours <= 11) {
            dataArray[2] = money + dataArray[2];
        } else if (hours <= 15) {
            dataArray[3] = money + dataArray[3];
        } else if (hours <= 17) {
            dataArray[4] = money + dataArray[4] * 1;
        } else if (hours <= 23) {
            dataArray[5] = money + dataArray[5];
        };
        var valueJSON = {
            name: from,
            data: dataArray,
            stack: type
        }
    }
    storage.setItem(key, JSON.stringify(valueJSON));
};

function saveGroupByFromForMonth(from, type, money){
	var date = getDate();
	var month = date.year+"/"+date.month+"?from="+from+"?type="+type;
	if (storage.getItem(month)) {
		var dataFromStorage = storage.getItem(month);
		var oldMoney = dataFromStorage.split(',')[1].split(']')[0];
		money = oldMoney*1+money*1;

	};
	var dataToSave= from+","+money;
    storage.setItem(month,dataToSave);
}

function save(from, type, money) {
    saveByFrom(from, type, money);
    saveGroupByFromForMonth(from, type, money)
    var date = getDate();
    var key = date.year + "/" + date.month + "/" + date.day + " " + date.hours + ":" + date.minutes + ":" + date.senonds;
    var valueJSON = {
        date: date.year + "/" + date.month + "/" + date.day,
        time: date.hours + ":" + date.minutes,
        money: money,
        from: from,
        type: type
    }
    storage.setItem(key, JSON.stringify(valueJSON));
};




function changeSwitch() {
    if ('gain' == $('.switch').val()) {
        $('.gain-switch').show();
        $('.pay-switch').hide();
    } else {
        $('.gain-switch').hide();
        $('.pay-switch').show();
    }
};


$(function() {
    getSeriesData();
    initData();
    drawHighcharts();
    $("body").on("swipe", function() {
        window.location.href="record.html";
    });

    $('.submit').tap(function() {
        var result = "";
        if (!$('.display2').html() * 1 == 0 && isNaN($('.display2').html() * 1)) {
            return;
        };
        if ('gain' == $('.switch').val()) {
            var from = $('.gain').html().trim();
            result = display1 * 1 + nums * 1
            save(from, "gain", nums * 1);
        } else {
            var from = $('.pay').html().trim();
            result = display1 * 1 - nums * 1
            save(from, "pay", nums * (-1));
        }
        display1 = result;
        setColorByNum(display1);
        drawHighcharts();
        $('.display2').html("");
        nums = "";
        return;
    });


    $('.num').tap(function() {
        clickDate1 = new Date();
        if (clickDate1 - clickDate2 < 250) {
            return;
        };
        var temp = nums + $(this).attr("value");
        if (!/^([1-9]\d{0,4}|0)(\.\d{0,1})?$/.test(temp)) {
            return;
        };
        nums = temp;
        symbol = setSymbol();
        if ('gain' == $('.switch').val()) {
            setFontColor('display2', "green");
        } else {
            setFontColor('display2', "red");
        }
        $('.display2').html(symbol + nums);
        clickDate2 = new Date();
        return;
    });


    $('.remove').tap(function() {
        if (nums.length > 0) {
            nums = nums.substring(0, nums.length - 1);
            $('.display2').html(symbol + nums);

            if (nums.length == 0) {
                setFontColor("display2", "black");
                $('.display2').html("0.0");
            };
        }
    });
});