var ctx, data, options, myRadarChart, oldLabels;

ctx = document.getElementById("myChart").getContext("2d");
options = {
    pointLabelFontSize : 18,
    pointLabelFontColor : "#000",
};

data = {
    datasets: [
        {
            label: "Positive Sentiment",
            fillColor: "rgba(90,170,40,0.2)",
            strokeColor: "rgba(90,170,40,1)",
            pointColor: "rgba(90,170,40,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(90,170,40,1)"
        },
        {
            label: "Negative Sentiment",
            fillColor: "rgba(196,0,34,0.2)",
            strokeColor: "rgba(196,0,34,1)",
            pointColor: "rgba(196,0,34,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(196,0,34,1)"
        }
    ]
};

var sentimentIndexes = {
    'positive': 0,
    'negative': 1
};

function initChart() {
    data.labels = ["", "", "", "", ""];
    data.datasets[0].data = [0,0,0,0,0];
    data.datasets[1].data = [0,0,0,0,0];

    myRadarChart = new Chart(ctx).Radar(data, options);
}

function buildChartData(tweets) {
    var labelIndex = 0;
    var labelIndexes = {};
    var labels = []
    for (var sentiment in sentimentIndexes) {
        var sentimentIndex = sentimentIndexes[sentiment];
        var sentimentCount = [];
        if (labels.length > 0) {
            for (var i=0; i<labels.length; i++) {
                sentimentCount[i] = 0;
            }
        }
        for (var i=0; i<tweets[sentiment].length; i++) {
            var tweet = tweets[sentiment][i];
            for (var j=0; j<tweet['keywords'].length; j++) {
                var label = tweet['keywords'][j];
                if (labelIndexes[label] == undefined) {
                    sentimentCount[labelIndex] = 1;
                    labels[labelIndex] = label;
                    labelIndexes[label] = labelIndex++;
                }
                else {
                    sentimentCount[labelIndexes[label]]++;
                }
            }
        }

        data.datasets[sentimentIndex].data = sentimentCount;
    }

    oldLabels = data.labels;
    data.labels = labels;

    writeChart(data);
}

function rebuildChart(data) {
    myRadarChart.destroy();
    myRadarChart = new Chart(ctx).Radar(data, options);
}

function updateChart(data) {
    for (var i = 0, l=data.datasets.length; i < l; i++) {
        for (var a = 0, b=data.datasets[i].data.length; a < b; a++) {
            myRadarChart.datasets[i].points[a].value = data.datasets[i].data[a];
        }
    }
    myRadarChart.update();
}

function checkLabels() {
    if (data.labels.length != oldLabels.length) {
        return false;
    }

    for (var i = 0, l=data.labels.length; i < l; i++) {
        if (data.labels[i] != oldLabels[i]) {
            return false;
        }
    }

    return true;
}

function writeChart(data) {
    if(!checkLabels(data.labels)) {
        rebuildChart(data);
    } else {
        updateChart(data);
    }
}

initChart();
