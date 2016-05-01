App.controller('paymentCtrl', function($scope, FlightsSrv, ConfirmSrv, OutReturnSrv, paymentSrv, $location) {

    $scope.tab = "active in";
    //$scope.stripeError=false;
    //$scope.stripeErrorDescription="";
    $scope.airlineIP ="";
    $scope.reservation = ConfirmSrv.getReservation();
    $scope.totalPrice = OutReturnSrv.getSelectedPrice();
    $scope.cabin = FlightsSrv.getSelectedCabin();
    var roundTrip = FlightsSrv.getSelectedRoundTrip();
    var outgoingFlight = OutReturnSrv.getSelectedOutFlight();
    if (roundTrip == 'true')
        returnFlight = OutReturnSrv.getSelectedReturnFlight();
    $scope.outCurrency = outgoingFlight.currency;



    $scope.tab1 = function() {
        $scope.tab = "active in";
        $scope.tab2 = "";
    };

    $scope.tab2 = function() {
        $scope.tab2 = "active in";
        $scope.tab = "";
    };


    var Congrats = function() {
        $location.url('/congrats');
    };


    $scope.clicked = "clicked";
    $scope.isShown = function(clicked) {
        return clicked === $scope.clicked;
    };

    var postAPay = function() {
        $scope.bookingRefNumber = $scope.getBookingRef();
        paymentSrv.postPay($scope.reservation, $scope.bookingRefNumber, outgoingFlight, $scope.cabin).success(function()
            {
                Congrats();
            });
        if (roundTrip == 'true')
            paymentSrv.postPay($scope.reservation, $scope.bookingRefNumber, returnFlight, $scope.cabin);
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
        SetCardType($scope.selectedType);
        SetCardNo($scope.selectedCardNumber);
        SetMonth($scope.selectedMonth);
        SetYear($scope.selectedYear);
        SetCVV($scope.selectedCVV);
        SetStreet($scope.selectedStreet);
        SetInformation($scope.selectedExtra);
        SetPostalcode($scope.selectedPostalcode);
        SetCity($scope.SelectedCity);
        createStripeToken();


    };

    // give this methid name and it willl return ip
      function getIpFromName(airlineName) {
        paymentSrv.getSingleairLineIp(airlineName).success(function(airlinesiP) {
          $sope.airlineIP = airlinesiP;
        });
      };

    var createStripeToken= function() {

        Stripe.card.createToken({
          if(){// if airline name not equal ours get ip of other airline thrn query to get the pupkey then set out stripe pup key 



          }
            "number": paymentSrv.getSelectedCardNo().toString(),
            "cvc": paymentSrv.getSelectedCVV(),
            "exp_month": paymentSrv.getSelectedMonth(),
            "exp_year": paymentSrv.getSelectedYear()
            }, stripeResponseHandler);
    };
    var stripeResponseHandler= function(status, response){
        if (response.error)
            alert(response.error.message);
        else
        {
           var returnFlightId;
           if (FlightsSrv.getSelectedRoundTrip() === 'true')
               returnFlightId= OutReturnSrv.getSelectedReturnFlight().flightId;
           var paymentInfo =
           {
                "passengerDetails":[{
                    "firstName": ConfirmSrv.getReservation().FName,
                    "lastName": ConfirmSrv.getReservation().LName,
                    "passportNum": ConfirmSrv.getReservation().passportNo,
                    "passportExpiryDate": ConfirmSrv.getReservation().expiryDate,
                    // "dateOfBirth": moment(ConfirmSrv.getReservation()., 'MMMM D, YYYY hh:mm:ss').toDate().getTime(),
                    // "nationality":  ConfirmSrv.getReservation().,
                    "dateOfBirth": moment("April 12, 2016", 'MMMM D, YYYY hh:mm:ss').toDate().getTime(),
                    "nationality": "Egypt",
                    "email": ConfirmSrv.getEmail()
                }],
                "class": FlightsSrv.getSelectedCabin(),
                "cost": OutReturnSrv.getSelectedPrice() * 100,
                "outgoingFlightId":  OutReturnSrv.getSelectedOutFlight().flightId,
                "returnFlightId": returnFlightId,
                "paymentToken": response.id ,
                "IP":  $sope.airlineIP
            }
           paymentSrv.chargeCard(paymentInfo)
           .success(function(data, status, headers, config) {
                //postAPay();
                console.log(paymentInfo);
            });
       }

    };

    //NARIHAN
    $scope.getBookingRef = function() {
        //encode and get the first part of the outgoing date
        var card = $scope.selectedCardNumber;
        //
        var outFlightNo = OutReturnSrv.getSelectedOutFlight().flightNumber;
        var str = card + "," + outFlightNo;
        var enc = window.btoa(str);
        var dec = window.atob(enc);

        var res = enc;

        // "<br>" + "Decoded String: " + dec;
        document.getElementById("ptag").innerHTML = "Booking Reference:(please copy it for further tracking):" + "<br>";
        document.getElementById("demo").innerHTML = res;

        var copyTextareaBtn = document.querySelector('.js-textareacopybtn');

        copyTextareaBtn.addEventListener('click', function(event) {
            var copyTextarea = document.querySelector('.js-copytextarea');
            copyTextarea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        });
        return enc;
    };

    //End of Narihan


});
