var jwt = require('jsonwebtoken');
var moment = require('moment');
var airlines = require('../../modules/airLines.json');
var http = require('http');
var stripe = require('stripe')(process.env.StripeSecret);

module.exports = function(app, mongo) {

    /* RENDER MAIN PAGE */
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '../../public/index.html');
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

    /* GET ALL STATES ENDPOINT */
    app.get('/data/airports', function(req, res) {
        mongo.getAirports(function(err, airports) {
            res.json(airports);
        })
    });



    app.get('/data/airlines', function(req, res) {
        // mongo.getAirports(function(err, airports) {
        mongo.getAirLines(function(err, airLines) {
                res.json(airLines);
            })
            // })
    });
// get ip of given airline name
    app.get('/data/singleAirlines/:airlineName', function(req, res) {
        // mongo.getAirports(function(err, airports) {
        mongo.getAirLinesIP(airlineName,function(err, airLinesIPAdress) {
                res.json(airLinesIPAdress);
            })

    });
// end of get ip method

// get Stripe pup key of others airlines
    app.get('/data/singleAirlines/:airlineName', function(req, res) {
        // mongo.getAirports(function(err, airports) {
        mongo.getAirLinesIP(airlineName,function(err, airLinesIPAdress) {
                res.json(airLinesIPAdress);
            })

    });
// end of get ip method

    app.get('/data/bookings/search/:bookingRefNumber', function(req, res) {
        mongo.searchBookings(req.params.bookingRefNumber, function(err, bookingRef) {
            res.json(bookingRef);
        });
    });

    app.get('/data/pay/:firstName/:lastName/:passport/:passportNumber/:issueDate/:expiryDate/:email/:phoneNumber/:bookingRefNumber/:flightNumber/:flightCabin', function(req, res) {
        mongo.submitPay(req.params.firstName, req.params.lastName, req.params.passport, req.params.passportNumber, req.params.issueDate, req.params.expiryDate, req.params.email, req.params.phoneNumber, req.params.bookingRefNumber, req.params.flightNumber, req.params.flightCabin, function(err, data) {
            // var card = $scope.selectedCardNumber;
            // var outFlightNo = OutReturnSrv.getSelectedOutFlight().flightNumber;
            // var str = card + "," + outFlightNo;
            // var enc = window.btoa(str);
            // var dec = window.atob(enc);
            //
            // var res = enc;
        });
    });

    app.get('/api/others/search/:ip/:origin/:destination/:departingDate/:returningDate/:cabin/:seats/:wt', function(req, res1) {
        var options = {
            host: req.params.ip,
            path: '/api/flights/search/' + req.params.origin + '/' + req.params.destination + '/' + req.params.departingDate +
                '/' + req.params.returningDate + '/' + req.params.cabin + '/' + req.params.seats + '/?wt=' + req.params.wt,
            json: true
        };
        var timeout_wrapper = function(req) {
            return function() {
                // do some logging, cleaning, etc. depending on req
                req.abort();
            };
        };
        var request = http.get(options, function(res) {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
                clearTimeout(timeout);
                timeout = setTimeout(fn, 10000);
            });
            res.on('end', function() {
                try {
                    clearTimeout(timeout);
                    var fbResponse = JSON.parse(body);
                    res1.send(fbResponse);
                } catch (err) {
                    try {
                        res1.status(500).send("Error");
                    } catch (err) {}
                }
            });
        }).on('error', function(e) {
            clearTimeout(timeout);
            try {
                res1.status(500).send("Error");
            } catch (err) {}
            this.abort();
        });
        // generate timeout handler
        var fn = timeout_wrapper(request);

        // set initial timeout
        var timeout = setTimeout(fn, 1000);
    });

    app.get('/api/others/search/:ip/:origin/:destination/:departingDate/:cabin/:seats/:wt', function(req, res1) {
        var options = {
            host: req.params.ip,
            path: '/api/flights/search/' + req.params.origin + '/' + req.params.destination + '/' + req.params.departingDate +
                  '/' + req.params.cabin + '/' + req.params.seats + '/?wt=' + req.params.wt,
            json: true
        };
        var timeout_wrapper = function(req) {
            return function() {
                // do some logging, cleaning, etc. depending on req
                req.abort();
            };
        };
        var request = http.get(options, function(res) {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
                clearTimeout(timeout);
                timeout = setTimeout(fn, 10000);
            });
            res.on('end', function() {
                try {
                    clearTimeout(timeout);
                    var fbResponse = JSON.parse(body);
                    res1.send(fbResponse);
                } catch (err) {
                    try {
                        res1.status(500).send("Error");
                    } catch (err) {}
                }
            });
        }).on('error', function(e) {
            clearTimeout(timeout);
            try {
                res1.status(500).send("Error");
            } catch (err) {}
            this.abort();
        });
        // generate timeout handler
        var fn = timeout_wrapper(request);

        // set initial timeout
        var timeout = setTimeout(fn, 1000);
    });

    /* Middlewear For Secure API Endpoints */
    app.use('/api/flights/search' | '/booking', function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.wt || req.query.wt || req.headers['x-access-token'];
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
            res.status(403).sendFile(__dirname + '../../public/views/error.html');
        }
    });
    app.post('/booking', function(req, res1){
      if((req.body.ip) === "our ip an amsh 3arfo :D"){


        stripe.charges.create({
            amount: req.body.cost,
            currency: "eur",
            source: req.body.paymentToken,
            description: "Example charge"
        }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                res.send({ refNum: null, errorMessage: err});
            }
            else
            {
                //move booking here / m7tagen nzbt l submit 3lshan ta5od mn l body parser
                //res.send(charge);
                console.log(charge);
                res.end();
            }
        });
      } else {    // i will make post request sending all data which will posting in database to others Airlines

        var options = {
            host: req.body.ip,
            path: '/booking',
            json: true
        };
        var timeout_wrapper = function(req) {
            return function() {
                // do some logging, cleaning, etc. depending on req
                req.abort();
            };
        };
        var request = http.post(options,req.body,function(res) {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
                clearTimeout(timeout);
                timeout = setTimeout(fn, 10000);
            });
            res.on('end', function() {
                try {
                    clearTimeout(timeout);
                    var fbResponse = JSON.parse(body);
                    res1.send(fbResponse);
                } catch (err) {
                    try {
                        res1.status(500).send("Error");
                    } catch (err) {}
                }
            });
        }).on('error', function(e) {
            clearTimeout(timeout);
            try {
                res1.status(500).send("Error");
            } catch (err) {}
            this.abort();
        });
        // generate timeout handler
        var fn = timeout_wrapper(request);

        // set initial timeout
        var timeout = setTimeout(fn, 1000);

      }
    });

    app.get('/api/flights/search/:origin/:destination/:departingDate/:returningDate/:cabin/:seats', function(req, res) {
        if (moment(req.params.departingDate, 'MMMM D, YYYY').format('MMMM D, YYYY') === req.params.departingDate) {
            var departDate = req.params.departingDate;
            var outDate = req.params.returningDate;
        } else {
            var departDate = moment(parseInt(req.params.departingDate)).format('MMMM D, YYYY');
            var outDate = moment(parseInt(req.params.returningDate)).format('MMMM D, YYYY');
        }
        mongo.searchFlights(req.params.origin, req.params.destination, departDate, req.params.cabin, req.params.seats, function(err, outgoingFlight) {
            mongo.searchFlights(req.params.destination, req.params.origin, outDate, req.params.cabin, req.params.seats, function(err, returnFlight) {
                var flights = {};
                flights.outgoingFlights = outgoingFlight;
                flights.returnFlights = returnFlight;
                res.json(flights);
            });
        });
    });

    // return /stripe/pubkey
    app.get('/stripe/pubkey', function(req, res) {
            res.end('pk_test_fWP8viqFbT95teED8zWD3ieK');

    });
    //end of return /stripe/pubkey

    app.get('/api/flights/search/:origin/:destination/:departingDate/:cabin/:seats', function(req, res) {
        if (moment(req.params.departingDate, 'MMMM D, YYYY').format('MMMM D, YYYY') === req.params.departingDate)
            var departDate = req.params.departingDate;
        else
            var departDate = moment(parseInt(req.params.departingDate)).format('MMMM D, YYYY');
        mongo.searchFlights(req.params.origin, req.params.destination, departDate, req.params.cabin, req.params.seats, function(err, outgoingFlight) {
            var flights = {};
            flights.outgoingFlights = outgoingFlight;
            res.json(flights);
        });
    });


};
