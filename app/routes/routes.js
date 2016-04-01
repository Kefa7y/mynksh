/**
 * App routes:
 */
module.exports = function(app,mongo) {

    /* GET ALL STATES ENDPOINT */
    app.get('/api/data/airports', function(req, res) {
      res.json(require('../../modules/airports.json'));
    });

    /* RENDER MAIN PAGE */
    app.get('/', function (req, res) {
      res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/api/outgoinginfo', function(req, res) {
      res.json(require('../../modules/flights.json'));
    });
   
};


