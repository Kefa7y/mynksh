/**
 * Flights Controller
 */
App.controller('flightsCtrl', function($scope, FlightsSrv, OutReturnSrv, $location) {

    function outgoingInfo() {
        OutReturnSrv.getOutgoingInfo().success(function(outgoingInfo) {
            $scope.outgoingInfo = outgoingInfo;
        });
    };

    function returnInfo() {
        OutReturnSrv.getReturnInfo().success(function(returnInfo) {
            $scope.returnInfo = returnInfo;
        });
    };
    $scope.stringToDate = function(date) {
        return new Date(date);
    };
    $scope.timediff = function(depart, arr) {
        return moment.utc(moment(arr).diff(moment(depart))).format("hh:mm");
    };
    $scope.BookFlight = function() {
        OutReturnSrv.setSelectedOutFlight($scope.selectedOutgoingFlight);
        OutReturnSrv.setSelectedOutOperatedBy('iberia');
        OutReturnSrv.setSelectedOutCabin($scope.outgoingCabin);
        if($scope.roundTrip ==true){
            OutReturnSrv.setSelectedReturnFlight($scope.selectedReturnFlight);
            OutReturnSrv.setSelectedReturnOperatedBy('iberia');
            OutReturnSrv.setSelectedReturnCabin($scope.returnCabin);
        }
        OutReturnSrv.setSelectedPrice($scope.outgoingPrice + $scope.returnPrice);
        $location.url('/sopre');
    };
    $scope.angular = angular;
    $scope.roundTrip = FlightsSrv.getSelectedRoundTrip();
    $scope.origin= FlightsSrv.getSelectedOriginAirport();
    $scope.dest= FlightsSrv.getSelectedDestinationAirport();
    $scope.oDate= FlightsSrv.getSelectedOutDate();
    $scope.rDate= FlightsSrv.getSelectedReturnDate();

    outgoingInfo();
    returnInfo();

  //calculating the price

  $scope.$watch('outgoingCabin',function() {$scope.calculateOutgoingPrice();},true);
  $scope.$watch('selectedOutgoingFlight',function() {$scope.calculateOutgoingPrice();},true);
  $scope.$watch('selectedOutgoingFlight',function() {$scope.calculateReturningPrice();},true);
  $scope.$watch('returnCabin',function() {$scope.calculateReturningPrice();},true);

  $scope.calculateOutgoingPrice = function(){
    if($scope.outgoingCabin === "economy"){
        $scope.outgoingPrice = $scope.selectedOutgoingFlight.eCost;
      };
    if($scope.outgoingCabin === "business"){
        $scope.outgoingPrice = $scope.selectedOutgoingFlight.bCost;
      };
  };

  $scope.calculateReturningPrice = function(){
    if($scope.returnCabin === "economy"){
        $scope.returnPrice = $scope.selectedReturnFlight.eCost;
      };
    if($scope.returnCabin === "business"){
      $scope.returnPrice = $scope.selectedReturnFlight.bCost;
    };
  };

  $scope.goCocontinuePay = function() {
      $location.url('/payment');
  };

});
