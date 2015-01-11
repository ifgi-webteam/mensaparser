var pg = require('pg');

var conString = "postgres://postgres:mysecretpassword@172.17.0.6/docker";

var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('INSERT INTO menus (data) VALUES (\'{"something": "hello"}\')', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    client.end();
  });
});