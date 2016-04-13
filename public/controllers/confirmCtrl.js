App.controller('confirmCtrl', function($scope, FlightsSrv, OutReturnSrv, ConfirmSrv, $location) {

    $scope.selectedOutgoingFlight = OutReturnSrv.getSelectedOutFlight();
    $scope.roundTrip = FlightsSrv.getSelectedRoundTrip();
    if($scope.roundTrip === 'true')
        $scope.selectedReturnFlight = OutReturnSrv.getSelectedReturnFlight();
    $scope.tickets = FlightsSrv.getSelectedNumberOfTickets();
    $scope.price = OutReturnSrv.getSelectedPrice();

    $scope.setTicketFirstName = function(value) {
        ConfirmSrv.setFName(value);
    };
    $scope.setTicketLastName = function(value) {
        ConfirmSrv.setLName(value);
    };
    $scope.setTicketIssueDate = function(value) {
        ConfirmSrv.setIssueDate(value);
    };
    $scope.setTicketExpiryDate = function(value) {
        ConfirmSrv.setExpiryDate(value);
    };
    $scope.setTicketEmail = function(value) {
        ConfirmSrv.setEmail(value);
    };

    $scope.setTicketPhoneNo = function(value) {
        ConfirmSrv.setPhoneNo(value);
    };

    $scope.setTicketPassportNo = function(value) {
        ConfirmSrv.setPassportNo(value);
    };
    $scope.setTicketPassportType = function(value) {
        ConfirmSrv.setPassportType(value);
    };

    $scope.isGreaterThanTickets = function(num) {
        return num < $scope.number;
    };
    
    $scope.typedEmail = "";
    $scope.typePhoneno = "";
    var flightNumber = "2";


    $scope.reservation = [];

    for (var bookingRef = 1; bookingRef <= FlightsSrv.getSelectedNumberOfTickets(); bookingRef++) {
        var ticket = {};
        // ticket.email = $scope.typedEmail;
        // ticket.phone = $scope.typePhoneno;
        ticket.refNo = bookingRef;
        ticket.flight = flightNumber;
        $scope.reservation.push(ticket);
    };

    $scope.goToPayment = function() {
        $location.url('/payment');
    };
});
