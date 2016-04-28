App.factory('BookingSrv', function($http) {
  return{
    getBookingInfo: function( Origin, Dest, rDate, Cabin,SeatNumber) {
        return $http.get('/data/flights/bookings/' + Origin + '/' + Dest + '/' + rDate + '/' + Cabin + '/' + SeatNumber);
    },

  getSelectedBookingRef: function() {
      return this.SelectedBookingRef;
  },
  setSelectedBookingRef: function(value) {
      this.SelectedBookingRef = value;
  },

}
});
