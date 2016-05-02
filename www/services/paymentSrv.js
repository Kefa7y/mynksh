
App.factory('paymentSrv', function($http) {
    return {

        postPayS: function(reservation,  outgoingFlight , cabin) {
            return $http.get('http://localhost:8080/data/pay/'+ reservation.FName + '/' + reservation.LName + '/' + reservation.country + '/' + reservation.passportNo+'/'+
            reservation.issueDate+'/'+ reservation.expiryDate + '/' + reservation.email + '/' + reservation.phoneno + '/'+outgoingFlight.flightNumber+'/'+cabin);
        },
        postPayR: function(reservation,  outgoingFlight , returnFlight , cabin) {
            return $http.get('http://localhost:8080/data/pay/'+ reservation.FName + '/' + reservation.LName + '/' + reservation.country + '/' + reservation.passportNo+'/'+
            reservation.issueDate+'/'+ reservation.expiryDate + '/' + reservation.email + '/' + reservation.phoneno + '/' +outgoingFlight.flightNumber+
            '/'+returnFlight.flightNumber+'/'+cabin);
        },
        // postPay: function(reservation,  outgoingFlight , returnFlight , cabin) {
        //     return $http.get('http://localhost:8080/data/pay/'+ "safa" + '/' + "radwa" + '/' + "cairo" + '/' + "0105"+'/'+
        //     2016-01-01+'/'+   2016-0-01 + '/' + "radwa_Ads" + '/' + 01061575730 + '/' +outgoingFlight.flightNumber+
        //     '/'+returnFlight.flightNumber+'/'+cabin);
        // },
        getSelectedCardType: function() {
            return this.SelectedCardType;
        },
        setSelectedCardType: function(value) {
            this.SelectedCardType = value;
        },
        getSelectedCardNo: function() {
            return this.SelectedCardNo;
        },
        setSelectedCardNo: function(value) {
            this.SelectedCardNo = value;
        },
        getSelectedMonth: function() {
            return this.SelectedMonth;
        },
        setSelectedMonth: function(value) {
            this.SelectedMonth = value;
        },
        getSelectedYear: function() {
            return this.SelectedYear;
        },
        setSelectedYear: function(value) {
            this.SelectedYear = value;
        },
        getSelectedCVV: function() {
            return this.SelectedCVV;
        },
        setSelectedCVV: function(value) {
            this.SelectedCVV = value;
        },
        getSelectedStreet: function() {
            return this.selectedStret;
        },
        setSelectedStreet: function(value) {
            this.selectedStret = value;
        },
        getSelectedInformation: function() {
            return this.Selectedinformation;
        },
        setSelectedInformation: function(value) {
            this.Selectedinformation = value;
        },
        getSelectedPostalcode: function() {
            return this.selectedPostalcode;
        },
        setSelectedPostalcode: function(value) {
            this.selectedPostalcode = value;
        },
        getBookingRefNo: function() {
            return this.bookingRefNo;
        },
        setBookingRefNo: function(value) {
            this.bookingRefNo = value;
        },
        getSelectedCity: function() {
            return this.SelectedCity;
        },
        setSelectedCity: function(value) {
            this.SelectedCity = value;
        }

    };
});
