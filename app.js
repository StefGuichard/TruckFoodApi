var app = require('express')(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
  fs = require('fs');

var MongoClient = require("mongodb").MongoClient;


// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log('un utilisateur est Connecté');
  GetEveryCoordonate();
  

  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('insertvalue', function (message) {
    if (message != null) {
      if (message.length > 0) {
        console.log('longitude : ' + message[0] + '\n latitude : ' + message[1]);
        insertNewDataInDataBase(message);
      }
    }
  });
    socket.on('InsertOrUpdateFacebookUser', function (user) {
    if (user != null) {
        InsertOrUpdateFacebookUser(user);
    }});

    socket.on('InsertOrUpdateGoogleUser', function (user) {
    if (user != null) {
        InsertOrUpdateGoogleUser(user);
    }});
});

server.listen(8080);

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function GetEveryCoordonate() {
  MongoClient.connect("mongodb://localhost/BetaTruckFood", function (error, db) {
    if (error)
      return funcCallback(error);
    console.log("Connecté à la base de données 'BetaTruckFood'");

    db.collection("TruckFoodAdress").find().toArray(function (error, results) {
      if (error) throw error;

      if (results.length > 0) {
        console.log("des documents ont été envoyé");
        io.sockets.emit('coordonate', results);
      }
    });

  });
}

function InsertOrUpdateFacebookUser(user) {
  MongoClient.connect("mongodb://localhost/BetaTruckFood", function (error, db) {
    if (error)
      return funcCallback(error);
    console.log("Connecté à la base de données 'BetaTruckFood'");

db.collection("FacebookUser").find({facebookId:user.id}).toArray(function (error, results) {
      if (error) throw error;

      if (results.length == 0) {
        var objNew = { facebookId: user.id,name: user.name,email:user.email,gender:user.gender,birthday:user.birthday ,datecrea:new Date(),datemode:new Date()};
        db.collection("FacebookUser").insert(objNew, null, function (error, results) {
          if (error)
            console.log("error");

          console.log("Le document(user) a bien été inséré");
        });
      }
      else
      {
          console.log("Le document(user) existe");
          var userFind = results[0];
          var objNew = { facebookId: user.id,name: user.name,email:user.email,gender:user.gender,birthday:user.birthday ,datecrea:results[0].datecrea,datemode:new Date()};
          
       db.collection("FacebookUser").update({_id : userFind._id},objNew, null, function (error, results) {
          if (error)
            console.log("error");

          console.log("Le document(user) a bien été modifié");
        });   
      }
    });

  });
}


function InsertOrUpdateGoogleUser(user) {
  MongoClient.connect("mongodb://localhost/BetaTruckFood", function (error, db) {
    if (error)
      return funcCallback(error);
    console.log("Connecté à la base de données 'BetaTruckFood'");

db.collection("FacebookUser").find({googleId:user.id}).toArray(function (error, results) {
      if (error) throw error;

      if (results.length == 0) {
        var objNew = { googleId: user.id,name: user.displayName,email:user.emails[0].value,gender:user.gender,birthday:user.birthday ,datecrea:new Date(),datemode:new Date()};
        db.collection("FacebookUser").insert(objNew, null, function (error, results) {
          if (error)
            console.log("error");

          console.log("Le document(user) a bien été inséré");
        });
      }
      else
      {
          console.log("Le document(user) existe");
          var userFind = results[0];
          var objNew = { googleId: user.id,name: user.displayName,email:user.emails[0].value,gender:user.gender,birthday:user.birthday ,datecrea:results[0].datecrea,datemode:new Date()};
          
       db.collection("FacebookUser").update({_id : userFind._id},objNew, null, function (error, results) {
          if (error)
            console.log("error");

          console.log("Le document(user) a bien été modifié");
        });   
      }
    });

  });
}

function insertNewDataInDataBase(message) {
  MongoClient.connect("mongodb://localhost/BetaTruckFood", function (error, db) {
    if (error)
      return funcCallback(error);
    console.log("Connecté à la base de données 'BetaTruckFood'");

    var objNew = { longitude: message[0], latitude: message[1] };

    
    db.collection("TruckFoodAdress").find(objNew).toArray(function (error, results) {
      if (error) throw error;

      if (results.length == 0) {
        db.collection("TruckFoodAdress").insert(objNew, null, function (error, results) {
          if (error)
            console.log("error");

          console.log("Le document a bien été inséré");
        });
      }
    });

  });
}