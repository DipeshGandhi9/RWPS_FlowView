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
//mdbFilePath = 'D:/groupnishdata/GSV/SURPURA_DATA_web.mdb';
//mdbFilePath = 'D:/Surpura/docs/SURPURA_DATA_web.mdb';
mdbFilePath = 'D:/web_data/SURPURA_DATA_web.mdb';
var zeroFlowMdbFilePath = 'D:/GSV/ICGData.mdb';
//zeroFlowMdbFilePath = 'D:/groupnishdata/GSV/ICGData.mdb';
zeroFlowMdbFilePath = 'D:/GSV/ICGData/ICGData.mdb';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));

app.get('/api/zerochdata/latest', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var id = req.query.id;
  var connection = ADODB.open('Provider='+ provider +';Data Source=' + zeroFlowMdbFilePath + ';');
  var query = 'SELECT * FROM ChData WHERE ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t where t.UnitID = ' + id +' GROUP BY t.UnitID)';

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

app.get('/api/zerochdata', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var connection = ADODB.open('Provider='+ provider +';Data Source=' + zeroFlowMdbFilePath + ';');
  var query = 'SELECT * FROM ChData WHERE (ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t Where t.UnitID = 342) AND ChData.UnitID = 342) OR (ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t Where t.UnitID = 344) AND ChData.UnitID = 344) OR (ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t Where t.UnitID = 345) AND ChData.UnitID = 345) OR (ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t Where t.UnitID = 346) AND ChData.UnitID = 346) OR (ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t Where t.UnitID = 347) AND ChData.UnitID = 347) OR (ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t Where t.UnitID = 348) AND ChData.UnitID = 348) OR (ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t Where t.UnitID = 349) AND ChData.UnitID = 349) ORDER BY ChData.UnitID ASC';

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

app.get('/api/zerochdetail', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var id = req.query.id;
  var connection = ADODB.open('Provider='+ provider +';Data Source=' + zeroFlowMdbFilePath + ';');
  var query = 'SELECT Max(t.SampleTime) as maxDate FROM ChData t Where t.UnitID = ' + id +' GROUP BY t.UnitID ';

  connection
    .query(query)
    .on('done', function(data) {
      //console.log(data);

      var currentDateStr = data[0].maxDate;
      // console.log(currentDate);
      query = 'SELECT * FROM ChData WHERE (ChData.SampleTime in (SELECT Max(t.SampleTime)FROM ChData t where t.UnitID = ' + id +' GROUP BY t.UnitID) AND ChData.UnitID = ' + id + ') ';

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

        query = query + ' Or (ChData.SampleTime in (SELECT Min(t.SampleTime) FROM ChData t where t.SampleTime Between #'+ oldTime +'# And #'+ newDateTime +'# AND  t.UnitID = ' + id +' GROUP BY t.UnitID) AND ChData.UnitID = ' + id +') ';
        // console.log(" " + oldTime + "   AND   " + newDateTime + "<br>");
        oldTime = newDateTime;
      }

      //query = query + ' AND ChData.UnitID = ' + id +' ORDER BY ChData.SampleTime DESC';
      query = query + ' ORDER BY ChData.SampleTime DESC';

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
  var query = 'SELECT '+ getFieldList('J342_Surpura') +' FROM J342_Surpura WHERE J342_Surpura.Dated_Time in (SELECT Max(t.Dated_Time)FROM J342_Surpura t)';

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

var getFieldList = function(tableName){
  // var fieldArray = ['ID_NO' , 'Dated_Time' , 'RWPS_LVL1' , 'RWPS_LVL2' , 'RWPS_FLW_1_CMN_DIS' , 'RWPS_FLW_TOTAL_1'
  //   , 'RWPS_FLW_2' , 'RWPS_FLW_TOTAL_2' , 'WTP_LVL_BKWS_TNK' , 'WTP_LVL_SLG_SMP' , 'WTP_LVL_RCY_TNK' , 'WTP_LVL_SLG_THCK'
  //   , 'WTP_FLW_BKWS_TNK' , 'WTP_FLW_TOTAL_BKWS_TNK' , 'WTP_FLW_INLT_INLT_CMB' , 'WTP_FLW_TOTAL_INLT_INLT_CMB' , 'WTP_FLW_INLT_OTLT_CMB'
  //   , 'WTP_FLW_TOTAL_INLT_OTLT_CMB' , 'CWPS_LVL' , 'CWPS_FLW_LSG' , 'CWPS_FLW_TOTAL_LSG' , 'CWPS_FLW_DGR' , 'CWPS_FLW_TOTAL_DGR'
  //   , 'LSG_LVL' , 'LSG_FLW_CMN_DIS_CNP' , 'LSG_FLW_CMN_DIS_PNJ' , 'LSG_FLW_CMN_DIS_NBR' , 'LSG_FLW_TOTAL_CMN_DIS_CNP'
  //   , 'LSG_FLW_TOTAL_CMN_DIS_PNJ' , 'LSG_FLW_TOTAL_CMN_DIS_NBR' , 'LSG_FLW_CMN_DIS_RNG' , 'LSG_FLW_CMN_DIS_MDC' , 'LSG_FLW_TOTAL_CMN_DIS_RNG'
  //   , 'LSG_FLW_TOTAL_CMN_DIS_MDC' , 'LSG_FLW_CMN_DIS_IDC' , 'LSG_FLW_CMN_DIS_LSGR' , 'LSG_FLW_TOTAL_CMN_DIS_IDC' , 'LSG_FLW_TOTAL_CMN_DIS_LSGR'
  //   , /*'VTC_Gandhinagar' , 'VTC_DGR_1' , 'VTC_DGR_2' , 'VTC_DINDAYAL' , 'VTC_KABIR_ASHRAM' , 'VTC_ZERO_POINT' , 'VTC_RWPS'*/
  //   , 'RWPS_Pump1' , 'RWPS_Pump2' , 'RWPS_Pump3' , 'RWPS_Pump4' , 'RWPS_Pump5' , 'RWPS_Pump6' , 'RWPS_DW_Pump1' , 'RWPS_DW_Pump2'
  //   , 'CWPS_Pump1' , 'CWPS_Pump2' , 'CWPS_Pump3' , 'CWPS_Pump4' , 'CWPS_DW_Pump1' , 'CWPS_DW_Pump2' , 'LSG_Pump1' , 'LSG_Pump2'
  //   , 'LSG_Pump3' , 'LSG_Pump4' , 'LSG_Pump5' , 'LSG_Pump6' , 'LSG_Pump7' , 'LSG_Pump8' , 'LSG_Pump9' , 'LSG_Pump10' , 'LSG_Pump11'
  //   , 'LSG_Pump12' , 'LSG_Pump13' , 'LSG_Pump14' , 'LSG_DW_Pump1' , 'LSG_DW_Pump2'];

  var fieldArray = ['ID_NO' , 'Dated_Time' , 'RWPS_LVL1' , 'RWPS_FLW_1_CMN_DIS' , 'RWPS_FLW_TOTAL_1'
    , 'RWPS_FLW_2' , 'RWPS_FLW_TOTAL_2' , 'WTP_FLW_INLT_INLT_CMB' , 'WTP_FLW_TOTAL_INLT_INLT_CMB' , 'WTP_CHLORINE_INLET_CHAMBER'
    , 'WTP_PH_INLET_CHAMBER' , 'WTP_TA_INLET_CHAMBER' , 'WTP_TA_FILTERBED_INLET' , 'R3_CLD_2_MAP' , 'WTP_CHLORINE_FILTERBED_INLET'
    , 'WTP_CHLORINE_FILTERBED_OUTLET' , 'WTP_PH_FILTERBED_OUTLET' , 'WTP_TA_FILTERBED_OUTLET' , 'WTP_FLW_BKWS_TNK' , 'WTP_FLW_TOTAL_BKWS_TNK'
    , 'WTP_LVL_BKWS_TNK' , 'WTP_LVL_SLG_SMP' , 'WTP_LVL_RCY_TNK' , 'WTP_LVL_SLG_THCK' , 'WTP_FLW_INLT_OTLT_CMB' , 'WTP_FLW_TOTAL_INLT_OTLT_CMB'
    , 'FB1_LOH_LT_MAP' , 'FB1_ROF_LT_MAP' , 'FB2_LOH_LT_MAP' , 'FB2_ROF_LT_MAP' , 'FB3_LOH_LT_MAP' , 'FB3_ROF_LT_MAP' , 'FB4_LOH_LT_MAP' , 'FB4_ROF_LT_MAP' , 'FB5_LOH_LT_MAP' , 'FB5_ROF_LT_MAP'
    , 'FB6_LOH_LT_MAP' , 'FB6_ROF_LT_MAP' , 'FB7_LOH_LT_MAP' , 'FB7_ROF_LT_MAP' , 'FB8_LOH_LT_MAP' , 'FB8_ROF_LT_MAP' , 'FB9_LOH_LT_MAP' , 'FB9_ROF_LT_MAP' , 'FB10_LOH_LT_MAP' , 'FB10_ROF_LT_MAP',
    , 'CWPS_LVL' , 'CWPS_FLW_LSG' , 'CWPS_FLW_TOTAL_LSG' , 'CWPS_FLW_DGR' , 'CWPS_FLW_TOTAL_DGR' , 'LSG_LVL' , 'LSG_FLW_CMN_DIS_CNP'
    , 'LSG_FLW_TOTAL_CMN_DIS_CNP' , 'LSG_FLW_CMN_DIS_PNJ' , 'LSG_FLW_TOTAL_CMN_DIS_PNJ' , 'LSG_FLW_CMN_DIS_NBR' , 'LSG_FLW_TOTAL_CMN_DIS_NBR'
    , 'LSG_FLW_CMN_DIS_RNG' , 'LSG_FLW_TOTAL_CMN_DIS_RNG' , 'LSG_FLW_CMN_DIS_MDC' , 'LSG_FLW_TOTAL_CMN_DIS_MDC' , 'LSG_FLW_CMN_DIS_IDC'
    , 'LSG_FLW_TOTAL_CMN_DIS_IDC' , 'LSG_FLW_CMN_DIS_LSGR' , 'LSG_FLW_TOTAL_CMN_DIS_LSGR' , /*'VTC_Gandhinagar' , 'VTC_Gandhinagar_TOTALIZER'
    , 'VTC_DGR_1' , 'VTC_DGR_1_TOTSLIZER' , 'VTC_DGR_2' , 'VTC_DGR_2_TOTALIZER' , 'VTC_DINDAYAL' , 'VTC_DINDAYAL_TOTALIZER' , 'VTC_KABIR_ASHRAM'
    , 'VTC_KABIR_ASHRAM_TOTALIZER' ,*/ 'RWPS_Pump1' , 'RWPS_Pump2' , 'RWPS_Pump3' , 'RWPS_Pump4' , 'RWPS_Pump5' , 'RWPS_Pump6' , 'RWPS_DW_Pump1'
    , 'RWPS_DW_Pump2' , 'CWPS_Pump1' , 'CWPS_Pump2' , 'CWPS_Pump3' , 'CWPS_Pump4' , 'CWPS_DW_Pump1' , 'CWPS_DW_Pump2' , 'LSG_Pump1' , 'LSG_Pump2'
    , 'LSG_Pump3' , 'LSG_Pump4' , 'LSG_Pump5' , 'LSG_Pump6' , 'LSG_Pump7' , 'LSG_Pump8' , 'LSG_Pump9' , 'LSG_Pump10' , 'LSG_Pump11' , 'LSG_Pump12'
    , 'LSG_Pump13' , 'LSG_Pump14' , 'LSG_DW_Pump1' , 'LSG_DW_Pump2'];
  var statement = "";
  fieldArray.forEach(function(value, index){
    statement = statement + tableName + "." + value + " ";
    if(index != fieldArray.length - 1 ){
      statement = statement + " , ";
    }
  });
  return statement;
};

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
