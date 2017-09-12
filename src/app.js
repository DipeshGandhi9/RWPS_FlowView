var express = require('express');
var app      = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ADODB = require('node-adodb');
var moment = require('moment');
var mdbFilePath = 'D:/GSV/ICGData.mdb';
//mdbFilePath = 'C:/Users/dipesh/Desktop/ICGData/ICGData.mdb';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));

app.get('/api/chdata/latest', function (req, res) {
  var connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + mdbFilePath + ';');
  var query = 'SELECT * FROM ChData WHERE ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t where t.UnitID = 342 GROUP BY t.UnitID)';

  connection
    .query(query)
    .on('done', function(data) {
      // console.log(data);
      res.send(data);
    })
    .on('fail', function(error) {
      console.log("Error to load latest data");
      res.send("Failed...");
    });

});

app.get('/api/chdata', function (req, res) {
  var connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + mdbFilePath + ';');
  var query = 'SELECT Max(t.SampleTime) as maxDate FROM ChData t Where t.UnitID = 342 GROUP BY t.UnitID ';

  connection
    .query(query)
    .on('done', function(data) {
      //console.log(data);

      var currentDateStr = data[0].maxDate;
      // console.log(currentDate);
      query = 'SELECT * FROM ChData WHERE ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t where t.UnitID = 342 GROUP BY t.UnitID)';

      // console.log("Query = " + query);
      var currentDate = new Date(currentDateStr);
      // console.log("currentDate = " + currentDate);
      currentTime = moment(currentDate).format("MM/DD/YYYY hh:mm:ss A");

      // console.log("currentTime = " + currentTime);
      var oldTime = currentTime;

      for (var i = 1; i < 24; i++) {
        var newDateTime = new Date();
        var time = moment.duration(i + ":00:00");
        var date = moment(currentTime, "MM/DD/YYYY hh:mm:ss A").subtract(time);
        // console.log("date = " + date);
        newDateTime = date.format("MM/DD/YYYY hh:mm:ss A");

        query = query + ' Or ChData.SampleTime in (SELECT Min(t.SampleTime) FROM ChData t where t.SampleTime Between #'+ oldTime +'# And #'+ newDateTime +'# AND  t.UnitID = 342 GROUP BY t.UnitID)';
        // console.log(" " + oldTime + "   AND   " + newDateTime + "<br>");
        oldTime = newDateTime;
      }

      query = query + ' AND ChData.UnitID = 342 ORDER BY ChData.SampleTime DESC';

      //console.log("Query = " + query);

      connection
        .query(query)
        .on('done', function(data) {
          // console.log(JSON.stringify(data));
          res.send(data);
        })
        .on('fail', function(error) {
          console.log("Error to load data");
          res.send("Failed...");
        });
    })
    .on('fail', function(error) {
      console.log("Error to load data");
      res.send("Failed...");
    });

});



app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname,'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
if (app.get('env') == 'development')
{
  app.listen(3000, function () {
    console.log('Example listening on port 3000!');
  });
}
else{
  app.listen(8080, function () {
    console.log('Example listening on port 8080!');
  });
}
module.exports = app;
