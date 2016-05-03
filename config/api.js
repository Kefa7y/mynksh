var mongo = require('./db.js');
var flights = require('../modules/flights.json');
var airports = require('../modules/airports.json');
var bookings = require('../modules/bookings.json');
var airlines = require('../modules/airLines.json');
var assert = require('assert');
var moment = require('moment');
var ObjectId = require('mongodb').ObjectId;

exports.seedDB = function(cb) {
  mongo.clearDB(function(err) {
    assert.equal(null, err);
    mongo.seed('flights', flights, function() {
      mongo.seed('airLines', airlines, function() {
        mongo.seed('airports', airports, function() {
        });
      });
    });
  });
};

exports.clearDB = function(cb) {
  mongo.clearDB(function() {
    cb();
  });;
}

exports.getAirports = function(cb) {
  var collection = mongo.db().collection('airports');
  collection.find().toArray(function(err, airports) {
    cb(err, airports);
  });
}

exports.getAirLines = function(cb) {
  var collection = mongo.db().collection('airLines');
  collection.find().toArray(function(err, airLines) {
    cb(err, airLines);
  });
}

exports.getAirLineIP = function(airLineName, cb) {
  var airLineIP = "";
  var collection = mongo.db().collection('airLines');
  collection.find({
    "name": airLineName + " Airlines"
  }).toArray(function(err, airLine) {
    if (airLine.length === 0)
      airLineIP = "52.58.24.76";
    if (airLine[0] === null) {
      cb(err, "No ip with this Name");
    }
    airLineIP = airLine[0].ip;
    cb(err, airLineIP);
  });
}


exports.getBooking = function(cb) {
  var collection = mongo.db().collection('bookings');
  collection.find().toArray(function(err, bookings) {
    cb(err, bookings);
  });
}

exports.searchFlights = function(origin, destination, departingDate, cabin, seats, cb) {
  var cost = 0;
  var economyOrBusiness = cabin.toLowerCase();
  var reqSeats = seats;
  if (reqSeats === undefined)
    reqSeats = 1;
  var collection = mongo.db().collection('flights');
  collection.find({
    "origin": origin,
    "destination": destination,
    "departureTime": {
      '$regex': departingDate
    }
  }).toArray(function(err, flights) {
    if (flights.length === 0) {
      cb(err, []);
    } else {
      if (economyOrBusiness == "economy")
        cost = flights[0].eCost;
      else
        cost = flights[0].bCost;
      if ((economyOrBusiness == "economy" && flights[0].availableESeats >= reqSeats) || (economyOrBusiness == "business" && flights[0].availableBSeats >= reqSeats)) {
        var departureDate = flights[0].departureTime;
        var arrivalDate = flights[0].arrivalTime;
        rflights = [{
          "flightId": flights[0]._id,
          "flightNumber": flights[0].flightNumber,
          "aircraftType": flights[0].aircraftType,
          "aircraftModel": flights[0].aircraftModel,
          "departureDateTime": moment(departureDate, 'MMMM D, YYYY hh:mm:ss').toDate().getTime(),
          "arrivalDateTime": moment(arrivalDate, 'MMMM D, YYYY hh:mm:ss').toDate().getTime(),
          "cost": cost,
          "currency": "USD",
          "origin": origin,
          "destination": flights[0].destination,
          "class": economyOrBusiness,
          "Airline": "Iberia"
        }];
      } else
        rflights = {};
      cb(err, rflights);
    }
  });
}

exports.submitPay = function(firstName, lastName, passportNumber, expiryDate, dateOfBirth, passport, email, businessOrEconomic, cost, flightId, generateOrUseOld, fWay, cb) {
  var selectedSeat = 0;
  if (flightId === undefined) {
    cb("flightId was not passed", null);
    return;
  }
  var collection = mongo.db().collection('flights');
  collection.find({
    "_id": new ObjectId(flightId)
  }).toArray(function(err, flights) {
    if (flights.length === 0) {
      cb("This flight " + flightId + "is not supported be Iberia", null);
      return;
    }
    if (businessOrEconomic === "economy") {
      if (!(flights[0].availableESeats === 0)) {
        selectedSeat = flights[0].nextEcoSeat;
        flights[0].availableESeats = flights[0].availableESeats - 1;
        flights[0].nextEcoSeat = flights[0].nextEcoSeat + 1;
      }
    } else {
      if (!(flights[0].availableBSeats === 0)) {
        selectedSeat = flights[0].nextBusSeat;
        flights[0].availableBSeats = flights[0].availableBSeats - 1;
        flights[0].nextBusSeat = flights[0].nextBusSeat - 1;
      }
    }

    var bookingReference;
    var bSeat = flights[0].nextBusSeat;
    var eSeat = flights[0].nextEcoSeat;
    if (generateOrUseOld === true)
      bookingReference = generateBookingRef(flights[0].SeatMap[selectedSeat].seatNum, flights[0].flightNumber, businessOrEconomic);
    else
      bookingReference = generateOrUseOld;
    flights[0].SeatMap[selectedSeat].bookingRefNumber = bookingReference;

    mongo.db().collection("flights").update({
      "_id": new ObjectId(flightId)
    }, {
      $set: {
        "availableESeats" : flights[0].availableESeats,
        "availableBSeats" : flights[0].availableBSeats,
        "nextBusSeat"     : bSeat,
        "nextEcoSeat"     : eSeat,
        "SeatMap"         : flights[0].SeatMap
      }
    }, {
      upsert: false
    }, function(err, results) {

      var collection = mongo.db().collection('bookings');
      var document = {
        "firstName": firstName,
        "lastName": lastName,
        "passport": passport,
        "passportNumber": passportNumber,
        "expiryDate": expiryDate,
        "email": email,
        "bookingRefNumber": bookingReference,
        "flightNumber": flights[0].flightNumber,
        "seatNum": flights[0].SeatMap[selectedSeat].seatNum,
        "origin": flights[0].origin,
        "destination": flights[0].destination,
        "arrivalTime": flights[0].arrivalTime,
        "departureTime": flights[0].departureTime,
        "way" : fWay
      };
      collection.insertOne(document, {
        w: 1
      }, function(err, records) {
        cb(err, document.bookingRefNumber);
      });
    });
  });
}

exports.searchBookings = function(bookingRef, cb) {
  var collection = mongo.db().collection('bookings');
  collection.find({
    "bookingRefNumber": bookingRef
  }).toArray(function(err, ref) {
    if (ref[0] == undefined)
      cb(err, []);
    else
      cb(err, ref);
  });
}


var generateBookingRef = function(seatnum, flightNumber, businessOrEconomic) {
  return encoded = new Buffer(seatnum + ',' + flightNumber).toString('base64');
};
