App.controller('paymentCtrl', function($scope, FlightsSrv, ConfirmSrv, OutReturnSrv, paymentSrv, $location) {

  $scope.reservation = ConfirmSrv.getReservations();
  $scope.totalPrice = OutReturnSrv.getSelectedPrice();
  $scope.cabin = FlightsSrv.getSelectedCabin();
  var roundTrip = FlightsSrv.getSelectedRoundTrip();
  var outgoingFlight = OutReturnSrv.getSelectedOutFlight();
  if (roundTrip == 'true')
    returnFlight = OutReturnSrv.getSelectedReturnFlight();
  $scope.outCurrency = outgoingFlight.currency;

  var newres = $scope.reservation;
  var dateFormat = function() {
    // "dateOfBirth": moment("April 12, 2016", 'MMMM D, YYYY hh:mm:ss',
    for (var i = 0; i < newres.length; i++) {
      newres[i].dateOfBirth = moment(newres[i].dateOfBirth).toDate().getTime()
      if (newres[i].passportExpiryDate === undefined)
        newres[i].passportExpiryDate = moment(newres[i].passportExpiryDate).toDate().getTime()
    }
  }
  dateFormat();
  var Congrats = function() {
    $location.url('/congrats');
  };


  $scope.clicked = "clicked";
  $scope.isShown = function(clicked) {
    return clicked === $scope.clicked;
  };

  var SetCardNo = function(value) {
    paymentSrv.setSelectedCardNo(value);
  };

  var SetMonth = function(value) {
    paymentSrv.setSelectedMonth(value);
  };

  var SetYear = function(value) {
    paymentSrv.setSelectedYear(value);
  };

  var SetCVV = function(value) {
    paymentSrv.setSelectedCVV(value);
  };

  var getOtherPubKey = function(AirlineIP, cb) {
    paymentSrv.getOtherAirlineIP(AirlineIP).success(function(airlineIP) {
      // console.log(airlineIP);
      paymentSrv.getOtherStripePubKey(airlineIP).success(function(key) {
        // console.log(key);
        cb(key, airlineIP);
      })
    });
  };

  var paymentInfo = {};

  $scope.payAction = function() {
    SetCardNo($scope.selectedCardNumber);
    SetMonth($scope.selectedMonth);
    SetYear($scope.selectedYear);
    SetCVV($scope.selectedCVV);
    var returnFlightId;
    if (FlightsSrv.getSelectedRoundTrip() === 'true')
      var returnFlightId = OutReturnSrv.getSelectedReturnFlight().flightId;
    paymentInfo = {
      "passengerDetails": newres,
      "class": FlightsSrv.getSelectedCabin(),
      "cost": OutReturnSrv.getSelectedPrice(),
      "outgoingFlightId": OutReturnSrv.getSelectedOutFlight().flightId,
      "returnFlightId": returnFlightId,
      "paymentToken": 2112
    }
    if (FlightsSrv.getSelectedRoundTrip() != 'true')
      paymentInfo.returnFlightId = undefined;
    //need here to check if one way or two and put this name attrubute inside createStripeToken method
    var AirlineName1 = OutReturnSrv.getSelectedOutFlight().Airline; //  out flight
    var AirlineName2;
    if (FlightsSrv.getSelectedRoundTrip() === 'true')
      var AirlineName2 = OutReturnSrv.getSelectedReturnFlight().Airline;; // return flight
    if (FlightsSrv.getSelectedRoundTrip() === 'false' || AirlineName1 === AirlineName2)
      createStripeToken(AirlineName1);
    else {
      createStripeToken(AirlineName1);
      createStripeToken(AirlineName2);
    }

  }
  var pingIp;

  var createStripeToken = function(airline) {

    getOtherPubKey(airline, function(key, airlineIP) {
      if (airlineIP === "IBERIA")
        pingIp = "";
      else
        pingIp = "http://" + airlineIP;
      Stripe.setPublishableKey(key);
      Stripe.card.createToken({
        "number": paymentSrv.getSelectedCardNo().toString(),
        "cvc": paymentSrv.getSelectedCVV(),
        "exp_month": paymentSrv.getSelectedMonth(),
        "exp_year": paymentSrv.getSelectedYear()
      }, stripeResponseHandler);

    });
  };

  var stripeResponseHandler = function(status, response) {
    if (response.error)
      alert(response.error.message);
    else {
      paymentInfo.paymentToken = response.id;
      paymentSrv.chargeCard(paymentInfo, pingIp)
        .success(function(data, status, headers, config) {
          console.log(data.refNum);
          paymentSrv.setBookingRefNo(data.refNum);
          //reset stripe key
          getOtherPubKey("IBERIA", function(key) {
            Stripe.setPublishableKey(key);
            Congrats();
          });
        })
        .error(function(data, status, headers, config){
            alert(data.errorMessage);
        });
    }
  };
});
