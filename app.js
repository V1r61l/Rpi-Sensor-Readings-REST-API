/**
 * Created by Virgil-Vaio on 04.10.2016.
 */

/**
 *Require modules
 */
var express 	= require('express');
var bodyParser 	= require('body-parser');
var sqlite3 	= require('sqlite3').verbose();

/**
 * Global objects
 */
var app = express();

var db = new sqlite3.Database('/home/pi/Documents/Personal Projects/Cloud Sensors Data Logger/SQLITE_DB/Sensors.db');

//set up the application content header
app.use(bodyParser.json());

//Get All Sensor values
app.get('/sensor/values', function(req, res){
	var stmt = "SELECT * FROM SensorReadings";
	db.all(stmt, function(err, rows){
		if(err) throw err;
		console.log(rows);
		res.json({"values" : rows });
	});
});

// Get All Sensor Values that lie in a given time interval
app.get('/sensor/values/:begin_date/:end_date', function(req, res){
    	var from_date = req.params.begin_date;
    	var to_date   = req.params.end_date;
    	var stmt = "SELECT * FROM SensorReadings WHERE Datestamp BETWEEN '" + from_date + "' AND '" + to_date + "'";
    	db.all(stmt, function(err, rows){
        	if(err) throw  err;
        	console.log(rows);
        	res.json({ "values" : rows});
    	});
});

//Get a Specific Sensor Value by its id
app.get('/sensor/values/:_id', function(req, res){
    var id = req.params._id;
    var stmt = "SELECT * FROM SensorReadings WHERE Id = " + id;
    db.get(stmt, function(err, row){
        if(err) throw  err;
        console.log(row);
        res.json({"value" : row});
    });
});

//Remove a Specific Sensor Value by its id
app.delete('/sensor/values/:_id', function(req, res){
    var id = req.params._id;
    console.log(id);
    var stmt = "DELETE FROM SensorReadings WHERE Id = " + id;
    db.run(stmt, function(err, row){
        if(err){
            throw  err
        };
        console.log(row);
        res.json({"value" : row});
    });
});

// Insert a specific Sensor value
app.post('/sensor/values', function(req, res) {
    var sensor_val = req.body;
    var stmt = "INSERT INTO SensorReadings (Sensor_No, Sensor_Type, Temperature, Pressure, Humidity, GPS, Datestamp)" +
               " VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.run(stmt, sensor_val.Sensor_No,
                 sensor_val.Sensor_Type,
                 sensor_val.Temperature,
                 sensor_val.Pressure,
                 sensor_val.Humidity,
                 sensor_val.GPS,
                 sensor_val.Datestamp, function(err, row){
                                            if(err){
                                                throw  err
                                            };
                                            console.log(row);
                                            res.json({"value" : row});
                                        });
});

app.listen(3000);
console.log("Submit GET or POST to http://192.168.0.155:3000/sensor");