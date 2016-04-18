
App.factory('paymentSrv', function($http) {
    return {

        postPay: function(reservation, bookingRefNumber, flightNumber) {
          return $http.get('/api/pay/'+ reservation.FName + '/' + reservation.LName + '/' + reservation.country'/' + reservation.passportNo+'/'+reservation.issueDate+'/'+ reservation.expiryDate + '/' + reservation.email + '/' + reservation.phoneno + '/' + bookingRefNumber+'/'+flightNumber);
        },
        getSelectedCardType: function() {
            return this.SelectedCardType;
        },
        setSelectedCardType: function(value) {
            this.SelectedCardType = value;
        },
        getSelectedCardNo: function() {
            return this.SelectedCaradNo;
        },
        setSelectedCardNo: function(value) {
            this.SelectedCaradNo = value;
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
        setselectedStret: function(value) {
            this.selectedStret = value;
        },
        getSelectedinformation: function() {
            return this.Selectedinformation;
        },
        setSelectedinformation: function(value) {
            this.Selectedinformation = value;
        },
        getSelectedPostalcode: function() {
            return this.selectedPostalcode;
        },
        setselectedPostalcode: function(value) {
            this.selectedPostalcode = value;
        },
        getSelectedCity: function() {
            return this.SelectedCity;
        },
        setSelectedCity: function(value) {
            this.SelectedCity = value;
        }

    };
});