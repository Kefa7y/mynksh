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
  app.get('/data/singleAirline/:airlineName', function(req, res) {
    // mongo.getAirports(function(err, airports) {
    mongo.getAirLineIP(req.params.airlineName, function(err, airLineIPAdress) {
      res.json(airLineIPAdress);
    })

  });
  // end of get ip method

  app.get('/data/bookings/search/:bookingRefNumber', function(req, res) {
    mongo.searchBookings(req.params.bookingRefNumber, function(err, bookingRef) {
      res.json(bookingRef);
    });
  });
  // app.get('/data/pay/:firstName/:lastName/:passport/:passportNumber/:issueDate/:expiryDate/:email/:phoneNumber/:bookingRefNumber/:flightNumber/:flightCabin', function(req, res) {
  //     console.log('in routes');
  //     mongo.submitPay(req.params.firstName, req.params.lastName, req.params.passport, req.params.passportNumber, req.params.issueDate, req.params.expiryDate, req.params.email, req.params.phoneNumber, req.params.bookingRefNumber, req.params.flightNumber, req.params.flightCabin, function(err, data) {
  //         res.end();
  //     });
  // });

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
        timeout = setTimeout(fn, 1000);
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
  app.use('/api/flights/search' | '/booking' | '/stripe/pubkey', function(req, res, next) {
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

  app.post('/booking', function(req, res1) {
    // console.log("i`m in api /booking" + req.body.IP);
    // if((req.body.IP) === "52.58.24.76" ){
    //     console.log("i`m in api /booking inside if ");


    stripe.charges.create({
      amount: req.body.cost,
      currency: "eur",
      source: req.body.paymentToken,
      description: "Example charge"
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        res1.send({
          refNum: null,
          errorMessage: err
        });
      } else

      {
        //move booking here
        if (req.body.returnFlightId === undefined || req.body.returnFlightId === null) {
          mongo.submitPay(req.body.passengerDetails[0].firstName, req.body.passengerDetails[0].lastName, req.body.passengerDetails[0].passportNum, req.body.passengerDetails[0].passportExpiryDate, req.body.passengerDetails[0].dateOfBirth, req.body.passengerDetails[0].nationality, req.body.passengerDetails[0].email, req.body.class, req.body.cost, req.body.outgoingFlightId, true, function(err, data) {
            //console.log("RefNum  " + data + "err" + err);
            res1.send({
              refNum: data,
              errorMessage: null
            });
          });

        } else {
          mongo.submitPay(req.body.passengerDetails[0].firstName, req.body.passengerDetails[0].lastName, req.body.passengerDetails[0].passportNum, req.body.passengerDetails[0].passportExpiryDate, req.body.passengerDetails[0].dateOfBirth, req.body.passengerDetails[0].nationality, req.body.passengerDetails[0].email, req.body.class, req.body.cost, req.body.outgoingFlightId, true, function(err, data) {
            //console.log(data);
            mongo.submitPay(req.body.passengerDetails[0].firstName, req.body.passengerDetails[0].lastName, req.body.passengerDetails[0].passportNum, req.body.passengerDetails[0].passportExpiryDate, req.body.passengerDetails[0].dateOfBirth, req.body.passengerDetails[0].nationality, req.body.passengerDetails[0].email, req.body.class, req.body.cost, req.body.returnFlightId, data, function(err, data) {
              //console.log("RefNum  " + data + "err" + err);
              res1.send({
                refNum: data,
                errorMessage: null
              });
            });
          });
        }

      }
    });
  });
  // else {    // i will make post request sending all data which will posting in database to others Airlines
  //     console.log("i`m in api /booking inside else " + req.body.IP);
  //   var options = {
  //       host: req.body.IP,
  //       path: '/booking',
  //       json: true ,
  //       port : 80
  //   };
  //   var timeout_wrapper = function(req) {
  //       return function() {
  //           // do some logging, cleaning, etc. depending on req
  //           req.abort();
  //       };
  //   };
  //   var request = http.post(options,req.body,function(res) {
  //       var body = '';
  //       res.on('data', function(chunk) {
  //           body += chunk;
  //           console.log("chunk " + body );
  //           clearTimeout(timeout);
  //           timeout = setTimeout(fn, 200000);
  //       });
  //       res.on('end', function() {
  //           try {
  //               clearTimeout(timeout);
  //               var fbResponse = JSON.stringify(body);
  //                   console.log("fbResponse  " + fbResponse );
  //               res1.send(fbResponse);
  //           } catch (err) {
  //                 console.log("err  " + err );
  //               try {
  //                   res1.status(500).send("Error");
  //               } catch (err) {   console.log("err 2 " + err );}
  //           }
  //       });
  //   }).on('error', function(e) {
  //       console.log("err 3  " + e );
  //       clearTimeout(timeout);
  //       try {
  //           res1.status(500).send("Error");
  //       } catch (err) {  console.log("err 4  " + err );}
  //       this.abort();
  //   });
  //   // generate timeout handler
  //   var fn = timeout_wrapper(request);

  //   // set initial timeout
  //   var timeout = setTimeout(fn, 10000);

  // }
  // });



  // // get Stripe pup key of others airlines
  //     app.get('/data/otherStripeKey/:airlineIP', function(req, res1) {
  //       jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNWU5LU0giLCJpYXQiOjE0NjA3NzIyOTQsImV4cCI6MTQ5MjMwODI5NSwiYXVkIjoid3d3LnNlY291cnNlLmNvbSIsInN1YiI6Ik1ZTktTSCBJYmVyaWEiLCJUZWFtIjoiTVlOS1NIIn0.hZxhv8XAcu1cARgcrtfb0l_crF1-Ic1tJt9eUhIL0qQ';
  // //need edit
  // console.log(req.params.airlineIP);
  // var options = {
  //     host: req.params.airlineIP,
  //     path: '/stripe/pubkey?wt=' +jwt,
  //     port: 80 ,
  //     json: true
  // };
  // var timeout_wrapper = function(req) {
  //     return function() {
  //         // do some logging, cleaning, etc. depending on req
  //         req.abort();
  //     };
  // };
  // var request = http.get(options, function(res) {
  //     var body = '';
  //     res.on('data', function(chunk) {
  //         body += chunk;
  //         clearTimeout(timeout);
  //         timeout = setTimeout(fn, 10000);
  //     });
  //     res.on('end', function() {
  //         try {
  //             clearTimeout(timeout);
  //             var fbResponse = JSON.stringify(body);
  //             res1.send(fbResponse);

  //         } catch (err) {
  //             try {
  //                 res1.status(500).send("Error");
  //             } catch (err) {}
  //         }
  //     });
  // }).on('error', function(e) {
  //     clearTimeout(timeout);
  //     try {
  //         res1.status(500).send("Error");
  //     } catch (err) {}
  //     this.abort();
  // });
  // // generate timeout handler
  // var fn = timeout_wrapper(request);

  // // set initial timeout
  // var timeout = setTimeout(fn, 8000);
  // // end of edit
  //     });
  // // end of get ip method

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
