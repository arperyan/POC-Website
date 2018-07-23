var express = require('express'),
    app = express(),
    QRS = require("./server/controllers/qrs");


app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/resources', express.static(__dirname + '/public/resources'));
app.use('/img', express.static(__dirname + '/public/resources'));
app.use('/css', express.static(__dirname + '/public/build'));
app.use('/js', express.static(__dirname + '/public/build'));

process.env.appRoot = __dirname;
process.env.SENSE_SERVER = "10.211.55.4";

app.get('/ticket', function(req, res){
  console.log('Getting Ticket');
  console.log(process.env.appRoot);
  QRS.getTicket(function(err, ticket){
    if (err) {
      res.json(err);
    }
    else {
      res.json(ticket);
    }
  })
});

app.get('/', function(req, res){
  res.sendFile(__dirname+'/public/build/index.html');
});
app.get('/pipeline', function(req, res){
  res.sendFile(__dirname+'/public/build/pipeline.html');
});
app.get('/client_planning', function(req, res){
  res.sendFile(__dirname+'/public/build/client-planning.html');
});
app.get('/cross_selling', function(req, res){
  res.sendFile(__dirname+'/public/build/cross-selling.html');
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server listening on port "+(process.env.PORT || 3000));
});
