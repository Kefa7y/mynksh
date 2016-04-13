/**
 * confirmation Service
 */
App.factory('ConfirmSrv', function($http) {
    return {
        setReservation: function(value) {
            this.reservation = value;
        },
        getReservation: function() {
            return this.reservation;
        },
        setEmail: function(value) {
            this.email = value;
        },
        getEmail: function() {
            return this.email;
        },
        setPhoneNo: function(value) {
            this.phoneNo = value;
        },
        getPhoneNo: function() {
            return this.phoneNo;
        }
    };
});
