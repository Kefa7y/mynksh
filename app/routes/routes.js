var jwt = require('jsonwebtoken');
var moment = require('moment');
var airlines = require('../../modules/airLines.json');

module.exports = function(app, mongo) {

    /* RENDER MAIN PAGE */
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

    /* GET ALL STATES ENDPOINT */
    app.get('/api/data/airports', function(req, res) {
        mongo.getAirports(function(err, airports) {
            res.json(airports);
        })
    });

    app.get('/api/data/airlines', function(req, res) {
        // mongo.getAirports(function(err, airports) {
        res.json(airlines);
        // })
    });

    app.post('/api/data/bookings', function(req, res) {
        mongo.getBooking(function(err, bookings) {
            res.json(bookings);
        })
    });

    /* Middlewear For Secure API Endpoints */
    app.use(function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.wt || req.query.wt || req.headers['x-access-token'] || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNWU5LU0giLCJpYXQiOjE0NjA3NzIyOTQsImV4cCI6MTQ5MjMwODI5NSwiYXVkIjoid3d3LnNlY291cnNlLmNvbSIsInN1YiI6Ik1ZTktTSCBJYmVyaWEiLCJUZWFtIjoiTVlOS1NIIn0.hZxhv8XAcu1cARgcrtfb0l_crF1-Ic1tJt9eUhIL0qQ';
        // console.log("{{{{ TOKEN }}}} => ", token);
        var jwtSecret = process.env.JWTSECRET;
        // console.log(jwtSecret);
        // Get JWT contents:
        try {
            var payload = jwt.verify(token, jwtSecret);
            req.payload = payload;
            next();
        } catch (err) {
            console.error('[ERROR]: JWT Error reason:', err);
            res.send('403 error');
        }
    });

    app.get('/api/flights/search/:origin/:destination/:departingDate/:returningDate/:cabin', function(req, res) {
        if (moment(req.params.departingDate, 'MMMM D, YYYY').format('MMMM D, YYYY') === req.params.departingDate) {
            var departDate = req.params.departingDate;
            var outDate = req.params.returningDate;
        } else {
            var departDate = moment(parseInt(req.params.departingDate)).format('MMMM D, YYYY');
            var outDate = moment(parseInt(req.params.returningDate)).format('MMMM D, YYYY');
        }
        mongo.searchFlights(req.params.origin, req.params.destination, departDate, req.params.cabin, function(err, outgoingFlight) {
            mongo.searchFlights(req.params.destination, req.params.origin, outDate, req.params.cabin, function(err, returnFlight) {
                var flights = {};
                flights.outgoingFlights = outgoingFlight;
                flights.returnFlights = returnFlight;
                res.json(flights);
            });
        });
    });


    app.get('/api/flights/search/:origin/:destination/:departingDate/:cabin', function(req, res) {
      console.log("Ay 7aga");
        if (moment(req.params.departingDate, 'MMMM D, YYYY').format('MMMM D, YYYY') === req.params.departingDate)
            var departDate = req.params.departingDate;
        else
            var departDate = moment(parseInt(req.params.departingDate)).format('MMMM D, YYYY');
        mongo.searchFlights(req.params.origin, req.params.destination, departDate, req.params.cabin, function(err, outgoingFlight) {
            var flights = {};
            flights.outgoingFlights = outgoingFlight;
            res.json(flights);
        });
    });

    app.get('/api/pay/:firstName/:lastName/:passport/:passportNumber/:issueDate/:expiryDate/:email/:phoneNumber/:bookingRefNumber/:flightNumber/:flightCabin', function(req, res) {
        mongo.submitPay(req.params.firstName, req.params.lastName, req.params.passport, req.params.passportNumber, req.params.issueDate, req.params.expiryDate, req.params.email, req.params.phoneNumber, req.params.bookingRefNumber, req.params.flightNumber,req.params.flightCabin,function(err, data) {
            console.log('i`m in route');
        });
    });

    app.get('/api/bookings/search/:bookingRefNumber', function(req, res) {
        mongo.searchBookings(req.params.bookingRefNumber, function(err, bookingRef) {
            res.json(bookingRef);
        });
    });


    /* SEED DB */
    app.get('/db/seed', function(req, res) {
        mongo.seedDB();
        res.send("Seeding done");
    });

    /* DELETE DB */
    app.get('/db/delete', function(req, res) {
        mongo.clearDB();
        res.send("DB clear");
    });
};
