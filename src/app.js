var express = require('express');
var app      = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ADODB = require('node-adodb');
var moment = require('moment');
var provider = 'Microsoft.Jet.OLEDB.4.0';
var mdbFilePath = 'D:/GSV/SURPURA_DATA_web.mdb';
//mdbFilePath = 'D:/Surpura/docs/SURPURA_DATA_web.mdb';
//mdbFilePath = 'D:/web_data/SURPURA_DATA_web.mdb';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));

app.get('/api/chdata/latest', function (req, res) {
  var columnId = req.query.id;
  var connection = ADODB.open('Provider='+ provider +';Data Source=' + mdbFilePath + ';');
  var query = 'SELECT J342_Surpura.ID_NO, J342_Surpura.Dated_Time, J342_Surpura.' + columnId + ' FROM J342_Surpura WHERE J342_Surpura.Dated_Time in (SELECT Max(t.Dated_Time)FROM J342_Surpura t )';

  connection
    .query(query)
    .on('done', function(data) {
       // console.log(data);
      res.send(data);
    })
    .on('fail', function(error) {
      console.log("Error " + error);
      console.log("Error to load latest data");
      res.send("Failed...");
    });

});

app.get('/api/chdata', function (req, res) {
  var connection = ADODB.open('Provider='+ provider +';Data Source=' + mdbFilePath + ';');
  var query = 'SELECT * FROM J342_Surpura WHERE J342_Surpura.Dated_Time in (SELECT Max(t.Dated_Time)FROM J342_Surpura t)';

  connection
    .query(query)
    .on('done', function(data) {
      // console.log(data);
      res.send(data);
    })
    .on('fail', function(error) {
      console.log(error);
      console.log("Error to load data");
      res.send("Failed...");
    });

});

app.get('/api/chdetail', function (req, res) {
  var columnId = req.query.id;
  var connection = ADODB.open('Provider='+ provider +';Data Source=' + mdbFilePath + ';');
  var query = 'SELECT Max(t.Dated_Time) as maxDate FROM J342_Surpura t ';

  connection
    .query(query)
    .on('done', function(data) {
      //console.log(data);

      var currentDateStr = data[0].maxDate;
      // console.log(currentDate);
      query = 'SELECT J342_Surpura.ID_NO, J342_Surpura.Dated_Time, J342_Surpura.' + columnId + '  FROM J342_Surpura WHERE J342_Surpura.Dated_Time in (SELECT Max(t.Dated_Time)FROM J342_Surpura t )';

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

        query = query + ' Or J342_Surpura.Dated_Time in (SELECT Min(t.Dated_Time) FROM J342_Surpura t where t.Dated_Time Between #'+ oldTime +'# And #'+ newDateTime +'# )';
        // console.log(" " + oldTime + "   AND   " + newDateTime + "<br>");
        oldTime = newDateTime;
      }

      query = query + ' ORDER BY J342_Surpura.Dated_Time DESC';

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
