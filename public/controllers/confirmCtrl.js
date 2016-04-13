App.controller('confirmCtrl', function($scope, FlightsSrv, OutReturnSrv, ConfirmSrv, $location) {

    $scope.selectedOutgoingFlight = OutReturnSrv.getSelectedOutFlight();
    $scope.roundTrip = FlightsSrv.getSelectedRoundTrip();
    if($scope.roundTrip === 'true')
        $scope.selectedReturnFlight = OutReturnSrv.getSelectedReturnFlight();
    $scope.tickets = FlightsSrv.getSelectedNumberOfTickets();
    $scope.price = OutReturnSrv.getSelectedPrice();

    $scope.setTicketEmail = function(value) {
        ConfirmSrv.setEmail(value);
    };

    $scope.setTicketPhoneNo = function(value) {
        ConfirmSrv.setPhoneNo(value);
    };

    $scope.setTicketReservation = function(value) {
        ConfirmSrv.setReservation(value);
    };
    $scope.isGreaterThanTickets = function(num) {
        return num < $scope.number;
    };

    $scope.reservation = [];

    for (var bookingRef = 1; bookingRef <= FlightsSrv.getSelectedNumberOfTickets(); bookingRef++) {
        var ticket = {};
        ticket.refNo = bookingRef;
        $scope.reservation.push(ticket);
    };

    $scope.goToPayment = function() {
        setTicketEmail($scope.typedEmail);
        setTicketPhoneNo($scope.typedPhoneNo);
        setTicketReservation($scope.reservation);
        for (var x = 1; x <= FlightsSrv.getSelectedNumberOfTickets(); x++) {
        if($scope.reservation(x).FName==null){
            $scope.FNameShow=true;
            return;
        }
        else
            $scope.FNameShow=false;

        if($scope.reservation(x).LName==null){
            $scope.LNameShow=true;
            return;
        }
        else
            $scope.LNameShow=false;

        if($scope.reservation(x).issueDate==null){
            $scope.IssueDateShow=true;
            return;
        }
        else
            $scope.IssueDateShow=false;

         if($scope.reservation(x).expiryDate==null){
            $scope.ExpiryDateShow=true;
            return;
        }
        else
            $scope.ExpiryDateShow=false;

            if($scope.reservation(x).passportNo==null){
            $scope.PassportNumberShow=true;
            return;
        }
        else
            $scope.PassportNumberShow=false;
                    
     }
        $location.url('/payment');
    };
});
