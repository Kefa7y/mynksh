App.controller('paymentCtrl', function($scope, FlightsSrv, ConfirmSrv, OutReturnSrv, paymentSrv, $location) {

  $scope.tab = "active in";
  $scope.reservation = ConfirmSrv.getReservations();
  $scope.totalPrice = OutReturnSrv.getSelectedPrice();
  $scope.cabin = FlightsSrv.getSelectedCabin();
  var roundTrip = FlightsSrv.getSelectedRoundTrip();
  var outgoingFlight = OutReturnSrv.getSelectedOutFlight();
  if (roundTrip === 'true') {
    $scope.returnFlight = OutReturnSrv.getSelectedReturnFlight();
  };

  var Congrats = function() {
    $location.url('/congrats');
  };


  $scope.clicked = "clicked";
  $scope.isShown = function(clicked) {
    return clicked === $scope.clicked;
  };

  var postAPay = function(cb) {
    if (roundTrip === 'true')
      paymentSrv.postPayR($scope.reservation, outgoingFlight, $scope.returnFlight, $scope.cabin).success(function(data) {
        paymentSrv.setBookingRefNo(data.encoding);
        cb();
      });
    else
      paymentSrv.postPayS($scope.reservation, outgoingFlight, $scope.cabin).success(function(data) {
        paymentSrv.setBookingRefNo(data.encoding);
        cb();
      });
  };

  var SetCardType = function(value) {
    paymentSrv.setSelectedCardType(value);
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

  var SetStreet = function(value) {
    paymentSrv.setSelectedStreet(value);
  };
  var SetInformation = function(value) {
    paymentSrv.setSelectedInformation(value);
  };
  var SetPostalcode = function(value) {
    paymentSrv.setSelectedPostalcode(value);
  };
  var SetCity = function(value) {
    paymentSrv.setSelectedCity(value);
  };

  $scope.payAction = function() {
    postAPay(function() {
      SetCardType($scope.selectedType);
      SetCardNo($scope.selectedCardNumber);
      SetMonth($scope.selectedMonth);
      SetYear($scope.selectedYear);
      SetCVV($scope.selectedCVV);
      SetStreet($scope.selectedStreet);
      SetInformation($scope.selectedExtra);
      SetPostalcode($scope.selectedPostalcode);
      SetCity($scope.SelectedCity);
      Congrats();
    });
  };

});
