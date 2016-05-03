var mongo = require("./api.js");
var db = require("./db.js");
var request = require('supertest');
var assert = require('chai').assert;

// var insertPassengers = function(i, passengerDetails, cabin, cost, outgoingFlightId, returnFlightId, data, cb) {
//   if (i === passengerDetails.length) {
//     var fb = {
//       refNum: data,
//       errorMessage: null
//     };
//     cb(fb);
//   } else
//   if (returnFlightId === undefined || returnFlightId === null) {
//     mongo.submitPay(passengerDetails[i].firstName, passengerDetails[i].lastName, passengerDetails[i].passportNum,
//       passengerDetails[i].passportExpiryDate, passengerDetails[i].dateOfBirth, passengerDetails[i].nationality,
//       passengerDetails[i].email, cabin, cost, outgoingFlightId, data, "s",
//       function(err, data2) {
//         insertPassengers(i + 1, passengerDetails, cabin, cost, outgoingFlightId, returnFlightId, data2, cb);
//       });
//   } else {
//     mongo.submitPay(passengerDetails[i].firstName, passengerDetails[i].lastName, passengerDetails[i].passportNum,
//       passengerDetails[i].passportExpiryDate, passengerDetails[i].dateOfBirth, passengerDetails[i].nationality,
//       passengerDetails[i].email, cabin, cost, outgoingFlightId, data, "s",
//       function(err, data2) {
//         mongo.submitPay(passengerDetails[i].firstName, passengerDetails[i].lastName, passengerDetails[i].passportNum,
//           passengerDetails[i].passportExpiryDate, passengerDetails[i].dateOfBirth, passengerDetails[i].nationality,
//           passengerDetails[i].email, cabin, cost, returnFlightId, data2, "r",
//           function(err, data3) {
//             insertPassengers(i + 1, passengerDetails, cabin, cost, outgoingFlightId, returnFlightId, data3, cb);
//           });
//       });
//   } //end of else
// }

var newres = [{
  "firstName": "qwwww",
  "lastName": "qwwww",
  "passportNum": "qwwww",
  "passportExpiryDate": "qwwww",
  "dateOfBirth": "qwwww",
  "nationality": "qwwww",
  "email": "qwwww",
}, {
  "firstName": "uuuuu",
  "lastName": "uuuuu",
  "passportNum": "uuuuu",
  "passportExpiryDate": "uuuuu",
  "dateOfBirth": "uuuuu",
  "nationality": "uuuuu",
  "email": "uuuuu",
}, {
  "firstName": "zzzzz",
  "lastName": "zzzzz",
  "passportNum": "zzzzz",
  "passportExpiryDate": "zzzzz",
  "dateOfBirth": "zzzzz",
  "nationality": "zzzzz",
  "email": "zzzzz", 
}, {
  "firstName": "vvvvvvvv",
  "lastName": "vvvvvvvv",
  "passportNum": "vvvvvvvv",
  "passportExpiryDate": "vvvvvvvv",
  "dateOfBirth": "vvvvvvvv",
  "nationality": "vvvvvvvv",
  "email": "vvvvvvvv",
}, {
  "firstName": "22222222",
  "lastName": "22222222",
  "passportNum": "22222222",
  "passportExpiryDate": "22222222",
  "dateOfBirth": "22222222",
  "nationality": "22222222",
  "email": "22222222",
}]

paymentInfo = {
  "passengerDetails": newres,
  "class": 'economy',
  "cost": 12321312,
  "outgoingFlightId": "5728c8a0a5771909178f4585",
  "returnFlightId": "5728c8a0a5771909178f4584",
  "paymentToken": 2112
}

db.init('mongodb://localhost:27017/mynksh',function(){
insertPassengers(0, paymentInfo.passengerDetails, paymentInfo.class, paymentInfo.cost,
  paymentInfo.outgoingFlightId, paymentInfo.returnFlightId, true,
  function(fb) {
    console.log(fb);
  });
});


describe('seedDB test', function() {
  var model=db.db().collection('airLines').length();
  it('Should return the no. of elements in the db', function(done){
    mongo.seedDB();
    assert.equal(model,db().collection('airLines'));
    .expect(200,done);

  });
    // it('/api/quote should return a quote JSON object with keys [_id, text, author]', function(done) {
    //     request.get('/api/quote').set('Accept','application/json').expect('Content-Type',/json/).expect(function(res){
    //         assert.property(res.body,'_id','object has an id');
    //         assert.property(res.body,'text','object has a text');
    //         assert.property(res.body,'author','object has an author');
    //         // assert.isString(res.body.author);
    //     }).expect(200,done);
    // });

    // it('/api/quotes should return an array of JSON object when I visit', function(done) {
    //     request.get('/api/quotes').set('Accept','application/json').expect('Content-Type',/json/).expect(200,done);
    // });
});