//
// MODULE3 serveur Nodejs: analyse et route les requetes  MongoDb, formate et renvoie les réponses au client
//
const { MongoClient } = require("mongodb");
// Connection URI
const uri =  "mongodb://127.0.0.1:27017/?maxPoolSize=20&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);

const bcrypt = require('bcrypt');
const fssync = require('fs');

const jwt = require('jsonwebtoken');
tokenchain='A Nice, ces raviolis de la Maison Barale « mêlent la singularité du citron confit à la chaleur épicée du gingembre »';



// ----------------------------------
// serveur http
// ----------------------------------

var http=require('http');
res="";
var server=http.createServer(
    function(request,response) {
		requesturl=request.url;
        resp=response;
		console.log("requrl: "+requesturl);
//----------------------------------------------------------------------------
//   **** pages html
//----------------------------------------------------------------------------

		if (requesturl == "/") {
			response.end(getfile("indexm3.html"));
		}
		else if (requesturl == "/indexm3.html") {
			response.end(getfile("indexm3.html"));
		}
		else if (requesturl == "/indexm3.js") {
			response.end(getfile("indexm3.js"));
		}
		else if (requesturl == "/adminm3.html") {
			response.end(getfile("adminm3.html"));
		}
		else if (requesturl == "/adminm3.js") {
			response.end(getfile("adminm3.js"));
		}
		else if (requesturl == "/favicon.ico") {
		}

//
// login producteur ==> /logprod/&email&pwd
// response: 
/*
{
  "userId": "Email",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJFbWFpbCIsImlhdCI6MTY3OTEzNDA0MywiZXhwIjoxNjc5MTQ4NDQzfQ.n5zGTSd_lgDuy_Jflx7mcvknIVcS5Ff3kFzV78-G7n0",
  "expiresinhours": "4"
}
ou
"NOK ..."
*/
// 
//
        else if (requesturl.substr(0,8) == "/logprod") {
			logprod(request.url,response,9);
		}

// 
// creation admin ==> /createadmin/&nom&prenom&email&pwd&tokenadmin		// create admin
// 	return 
/*
{
  "nom": "Bauchard",
  "prenom": "Philippe",
  "email": "philippe.bauchard@free.fr",
  "pwd": "$2b$10$typxV/flVwUIMOtk/LWcbOLE6k2s95b3VndePLUn/OXD/OoXcLqk6",
  "_id": "6415bb81bf7dc1f9d525162d"
}
*/
// ou NOK
        else if (requesturl.substr(0,12) == "/createadmin") {
			createadmin(request.url,response,13);
		}

//
// login admin ==> /logadmin/&email&pwd
// response: 
/*
{
  "userId": "philippe.bauchard@free.fr",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwaGlsaXBwZS5iYXVjaGFyZEBmcmVlLmZyIiwiaWF0IjoxNjc5MTQ2NDQwLCJleHAiOjE2NzkxNjA4NDB9.ZHRyoSDZBdc6S5nHbOl9wKl368jwUBgT30Ic3DFZ3PQ",
  "expiresinhours": "4"
} ou
"NOK ..."
*/
// 
//
        else if (requesturl.substr(0,9) == "/logadmin") {
			logadmin(request.url,response,10);
		}
// 
// creation category ==> /createcat/&nomcat&tokenadmin
// 	return 
/*{
  "nomcat": "fruits",
  "_id": "641617f2d0c47eda54521cf5"
}
ou "NOK ..."
*/
        else if (requesturl.substr(0,10) == "/createcat") {
			createcat(request.url,response,11);
		}
//
// /createproduct/&nomproduit&nomcat&tokenadmin		// ajouter un produit dans une catégorie
//	return idproduct / NOK
//
// vérifier que la catégorie existe, si oui vérifier que le produit n'existe pas déjà, si OK créer le produit avec un lien sur la catégorie
// 
//
        else if (requesturl.substr(0,14) == "/createproduct") {
			createproduct(request.url,response,15);
		}

//
// creation producteur ==> /createprod/&nom&prenom&email&pwd&ville&addr&tel
//
// response:
/*
{
  "nom": "nom",
  "prenom": "prenom",
  "email": "email2",
  "pwd": "$2b$10$Rsd734CQ2kIYR751xe8kIOdJ7EI.51PqJeDndmASKGcQv9Rq.B.wW",
  "ville": "ville",
  "addr": "addr",
  "tel": "tel",
  "_id": "64159063e064c2c09e1bc408"
}
ou "NOK ..."
*/
        else if (requesturl.substr(0,11) == "/createprod") {
			createprod(request.url,response,12);
		}

/*
/addstock/&emailproducteur&nomproduit&nomcat&image&datedispo&qte&tokenprod
							// ajouter un produit dans le stock
	return 
{
  "emailproducteur": "jean.maraicher@orange.fr",
  "nomproduit": "cote de porc",
  "nomcat": "viandes",
  "imageb64": "",
  "datedispo": "2023-04-05",
  "qte": "75",
  "_id": "64170ec8ce69347d4565e970"
}
ou "NOK ..."
*/
        else if (requesturl.substr(0,9) == "/addstock") {
			addstock(request.url,response,10);
		}

/*
/createuser/&nom&prenom&email&pwd		// création compte utilisateur sur la plateforme
/*
{
  "nom": "Dupond",
  "prenom": "Jean Claude",
  "email": "jc.dupond@free.fr",
  "pwd": "$2b$10$0r51BrgCbtyJ8Yge54GMs.f3vq6pwCkv4msN6PpijZbquRvxsXpy.",
  "_id": "64176574e20409335cfeb0c1"
}
ou "NOK <reason>"

*/
		else if (requesturl.substr(0,11) == "/createuser") {
			createuser(request.url,response,12);
		}
/*
/loginuser/&email&pwd				// login utilisateur de la plateforme

{
  "userId": "jc.dupond@free.fr",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJqYy5kdXBvbmRAZnJlZS5mciIsImlhdCI6MTY3OTI1NTU1MCwiZXhwIjoxNjc5MjY5OTUwfQ.aulAmzleDP8UX38fho2_OO-2dE2H8kpEvZpIc8G4174",
  "expiresinhours": "4"
}
ou "NOK <reason>"
*/
        else if (requesturl.substr(0,10) == "/loginuser") {
			loginuser(request.url,response,11);
		}
/*
/getprod/&ville
Response:
// http://127.0.0.1:8001/getprod/&Angers

[
  {
    "_id": "64176cbaaa5f9ca12e16e066",
    "emailproducteur": "albert.dupontel@orange.fr",
    "nomproduit": "bananes",
    "nomcat": "fruits",
    "imageb64": "",
    "datedispo": "2023-04-06",
    "qte": "75"
  },
  {
    "_id": "64176d02aa5f9ca12e16e067",
    "emailproducteur": "albert.dupontel@orange.fr",
    "nomproduit": "pommes",
    "nomcat": "fruits",
    "imageb64": "",
    "datedispo": "2023-04-07",
    "qte": "55"
  },
  {
    "_id": "64170e93ce69347d4565e96f",
    "emailproducteur": "jean.maraicher@orange.fr",
    "nomproduit": "poulet entier",
    "nomcat": "viandes",
    "imageb64": "",
    "datedispo": "2023-04-05",
    "qte": "85"
  },
  {
    "_id": "64170ec8ce69347d4565e970",
    "emailproducteur": "jean.maraicher@orange.fr",
    "nomproduit": "cote de porc",
    "nomcat": "viandes",
    "imageb64": "",
    "datedispo": "2023-04-05",
    "qte": "75"
  }
]
ou NOK <reason>
*/
        else if (requesturl.substr(0,8) == "/getprod") {
			getprod(request.url,response,9);
		}
//
// /bookprod/&idstock&qte&emailconso&token
//
        else if (requesturl.substr(0,9) == "/bookprod") {
			bookprod(request.url,response,10);
		}
//
// /getcat
//
        else if (requesturl.substr(0,7) == "/getcat") {
			getcat(request.url,response,8);
		}
//
// /gettowns
//
        else if (requesturl.substr(0,9) == "/gettowns") {
			gettowns(request.url,response,10);
		}
//
// sinon hello !! 
//
		else response.end("Hi, how are you today !?");

	} //  function(request,response)
); // var server=http.createServer(


port="8001";
server.listen(port);
console.log("Server is up, listening on port "+port);

// ----------------------------------------------
// login producteur ==> /logprod/&email&pwd
// ----------------------------------------------
function logprod(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url login producteur==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var email=decodeURIComponent(arrayreq[1]);
			var pwd=decodeURIComponent(arrayreq[2]);

//
// on a récupéré email et pwd, il faut comparer avec le mdp crypté en base
//
//  
// vérifier que le compte existe, si oui récupérer vérifier le mot de passe et si Ok renvoyer le token de connexion 
//
		mongo_check_logonprod(email,pwd,resp);
			
}

async function mongo_check_logonprod(email,pwd,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("producteur");
	var query = { email: "" };
	query.email=email;
	
	// console.log("query"+query.email);
    const result = await col.find(query).toArray(); // on recherche le compte avec cet email
	if (result.length ==0) { // tableau de taille nulle: l'email n'existe pas dans la collection donc c'est une erreur, le compte n'existe pas
		resp.end("NOK Le compte producteur avec l'email '"+email+ "' n'existe pas.");
	}
	else { // le compte existe , il faut vérifier le mot de passe et si ok renvoyer le token
		// console.log(result);
		// console.log(result[0].pwd);
		bcrypt
			// actual passw, encrypted pwd
			.compare(pwd, result[0].pwd)
            .then(valid => {
                   if (!valid) {
                       resp.end('NOK Mot de passe incorrect !');
                   }
                   else {
					   resp.end(JSON.stringify({
										userId: email,
										// le token renvoyé pour ce userid devra être renvoyé par le client sur les apis spécifiques au producteur
										token: jwt.sign(
											{ userId: email },
											tokenchain,
											{ expiresIn: '4h' }
										
										),
										expiresinhours: "4"
									}
						));
						
				   }
        })
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

// ----------------------------------------------
// login admin ==> /logadmin/&email&pwd
// ----------------------------------------------

function logadmin(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url login admin==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var email=decodeURIComponent(arrayreq[1]);
			var pwd=decodeURIComponent(arrayreq[2]);

//
// on a récupéré email et pwd, il faut comparer avec le mdp crypté en base
//  
// vérifier que le compte existe, si oui récupérer vérifier le mot de passe et si Ok renvoyer le token de connexion 
//
		mongo_check_logonadmin(email,pwd,resp);
			
}

async function mongo_check_logonadmin(email,pwd,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("admin");
	var query = { email: "" };
	query.email=email;
	
	// console.log("query"+query.email);
    const result = await col.find(query).toArray(); // on recherche le compte avec cet email
	if (result.length ==0) { // tableau de taille nulle: l'email n'existe pas dans la collection donc c'est une erreur, le compte n'existe pas
		resp.end("NOK Le compte admin avec l'email '"+email+ "' n'existe pas.");
	}
	else { // le compte existe , il faut vérifier le mot de passe et si ok renvoyer le token
		// console.log(result);
		// console.log(result[0].pwd);
		bcrypt
			// actual passw, encrypted pwd
			.compare(pwd, result[0].pwd)
            .then(valid => {
                   if (!valid) {
                       resp.end('NOK Mot de passe incorrect !');
                   }
                   else {
					   resp.end(JSON.stringify({
										userId: email,
										// le token renvoyé pour ce userid devra être renvoyé par le client sur les apis spécifiques au producteur
										token: jwt.sign(
											{ userId: email },
											tokenchain,
											{ expiresIn: '4h' }
										
										),
										expiresinhours: "4"
									}
						));
						
				   }
        })
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

// ----------------------------------------------
// loginuser ==> /loginuser/&email&pwd
// ----------------------------------------------
/*
{
  "userId": "jc.dupond@free.fr",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJqYy5kdXBvbmRAZnJlZS5mciIsImlhdCI6MTY3OTI1NTU1MCwiZXhwIjoxNjc5MjY5OTUwfQ.aulAmzleDP8UX38fho2_OO-2dE2H8kpEvZpIc8G4174",
  "expiresinhours": "4"
}
ou "NOK <reason>"
*/
function loginuser(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url login user==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var email=decodeURIComponent(arrayreq[1]);
			var pwd=decodeURIComponent(arrayreq[2]);

//
// on a récupéré email et pwd, il faut comparer avec le mdp crypté en base
//  
// vérifier que le compte existe, si oui récupérer vérifier le mot de passe et si Ok renvoyer le token de connexion 
//
		mongo_check_loginuser(email,pwd,resp);
			
}

async function mongo_check_loginuser(email,pwd,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("user");
	var query = { email: "" };
	query.email=email;
	
	// console.log("query"+query.email);
    const result = await col.find(query).toArray(); // on recherche le compte avec cet email
	if (result.length ==0) { // tableau de taille nulle: l'email n'existe pas dans la collection donc c'est une erreur, le compte n'existe pas
		resp.end("NOK Le compte utilisateur avec l'email '"+email+ "' n'existe pas.");
	}
	else { // le compte existe , il faut vérifier le mot de passe et si ok renvoyer le token
		// console.log(result);
		// console.log(result[0].pwd);
		bcrypt
			// actual passw, encrypted pwd
			.compare(pwd, result[0].pwd)
            .then(valid => {
                   if (!valid) {
                       resp.end('NOK Mot de passe incorrect !');
                   }
                   else {
					   resp.end(JSON.stringify({
										userId: email,
										// le token renvoyé pour ce userid devra être renvoyé par le client sur les apis spécifiques au producteur
										token: jwt.sign(
											{ userId: email },
											tokenchain,
											{ expiresIn: '4h' }
										
										),
										expiresinhours: "4"
									}
						));
						
				   }
        })
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

/*
/addstock/&emailproducteur&nomproduit&nomcat&image&datedispo&qte&tokenprod
										// ajouter un produit dans le stock
	return 
{
  "emailproducteur": "jean.maraicher@orange.fr",
  "nomproduit": "cote de porc",
  "nomcat": "viandes",
  "imageb64": "",
  "datedispo": "2023-04-05",
  "qte": "75",
  "_id": "64170ec8ce69347d4565e970"
}
ou "NOK ..."
*/

function addstock(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url  addstock ==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var emailproducteur=decodeURIComponent(arrayreq[1]);
			var nomproduit=decodeURIComponent(arrayreq[2]);
			var nomcat=decodeURIComponent(arrayreq[3]);
			var imageb64=decodeURIComponent(arrayreq[4]);
			var datedispo=decodeURIComponent(arrayreq[5]);
			var qte=decodeURIComponent(arrayreq[6]);	
			var token=decodeURIComponent(arrayreq[7]);			
//
// il faut d'abord vérifier que le token est valide (connexion OK) 
//
			try {
				const decodedToken = jwt.verify(token, tokenchain); // si le token est invalide, on part dans le bloc err
				// tous les autres paramètres sont réputés OK (controlés coté client), on lance la création de cette ligne de stock
				mongo_addstock(emailproducteur,nomproduit,nomcat,imageb64,datedispo,qte,token,resp);
			}
			catch(err) {
				console.log(err);
				resp.end("NOK invalid token: "+err);
			}

}

async function mongo_addstock(emailproducteur,nomproduit,nomcat,imageb64,datedispo,qte,token,resp) {

try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("stock");
	var stockobj = { 
		emailproducteur: "",
		nomproduit:"",
		nomcat:"",
		imageb64:"",
		datedispo:"",
		qte:""
	};
	
	stockobj.emailproducteur=emailproducteur;
	stockobj.nomproduit=nomproduit;
	stockobj.nomcat=nomcat;
	stockobj.imageb64=imageb64;
	stockobj.datedispo=datedispo;
	stockobj.qte=qte;
		
  	const result = await col.insertOne(stockobj);
	console.log("SUCCESS");
	resp.end(JSON.stringify(stockobj));
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

//
// en fonction de la localité (ville), le système doit renvoyer l’ensemble des producteurs de cette localité et pour chacun, la liste des produits avec la date de disponibilité
// /getprod/&ville
//

function getprod(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url  /getprod ==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var ville=decodeURIComponent(arrayreq[1]);
			
//
// il faut rechercher dans la collection "producteur" tous ceux dont la ville est <ville>
//
			mongo_find_town(ville,resp);
}

async function mongo_find_town(ville,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("producteur");
	var query = { ville: "" };
	query.ville=ville;
	
	// console.log("query"+query.email);
    const result = await col.find(query).toArray(); // on recherche la ville
	if (result.length ==0) { // Aucun producteur recensé pour cette ville
		resp.end("NOK Aucun producteur n'est recensé pour la ville:'"+ville+ "'.");
	}
	else { 
		// la liste des producteurs pour cette ville se trouve dans result[i].email entre 0 et  result.length-1
		 console.log(result);
		// resp.end(JSON.stringify(result));
		// console.log(result[0].pwd);
		//
		// il faut construire la future requete dans le stock : rechercher toutes les lignes contenant les producteurs trouvés 
		//
		var mongoquery="";
		for (var i=0;i <result.length;i++) {
			mongoquery = mongoquery+' { emailproducteur:"'+result[i].email+'"},';
		}
		mongoquery= mongoquery.substr(0,mongoquery.length-1); // drop dernière virgule 
		mongoquery= "{ $or: ["+mongoquery+"] }";
		// resp.end(mongoquery);
		console.log(mongoquery);
		mongo_filter_stock(mongoquery,resp);
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
	await client.close();
  }

finally {
	// Ensures that the client will close when you finish/error
//	await client.close();
  }

}

async function mongo_filter_stock(mongoquery,resp) {
try {
    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("stock");
	
	// console.log("query"+query.email);
    const result = await col.find({}).sort({"emailproducteur":1}).toArray(); //
	var output = [];
	var j=0;
	for (var i=0;i <result.length;i++) {
			console.log(result[i].emailproducteur);
			if (mongoquery.indexOf(result[i].emailproducteur) > 0) { // l'email est celui d'un des producteurs de la ville sélectionnée dans la requête
				output[j] =result[i];
				console.log(result[i]);
				j++;
			}
	}
	resp.end(JSON.stringify(output));
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

//
// /bookprod/&idstock&qte&emailconso&token
//
function bookprod(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url  /bookprod ==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var idstock=decodeURIComponent(arrayreq[1]);
			var qte=decodeURIComponent(arrayreq[2]);
			var emailconso=decodeURIComponent(arrayreq[3]);
			var token=decodeURIComponent(arrayreq[4]);
//
// il faut d'abord controler le token: seul un utilisateur connecté (identifié) peut réserver 
//
			try {
				const decodedToken = jwt.verify(token, tokenchain); // si le token est invalide, on part dans le bloc err
				//
				// si c'est Ok alors on fait la réservation
				//
				mongo_reserve_stock(idstock,qte,emailconso,token,resp);

			}
			catch(err) {
				console.log(err);
				resp.end("NOK invalid token: "+err);
			}
		
}

async function mongo_reserve_stock(idstock,qte,emailconso,token,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("stock");
	const { BSON, EJSON, ObjectId } = require('bson');
	var query = { _id: new BSON.ObjectId(idstock)};
		
    const result = await col.find(query).toArray(); // on recherche le compte avec cet _ID
	if (result.length ==0) { // Aucun stock existant avec cet _id
		resp.end("NOK erreur le stock recherché n'existe pas:'"+idstock+ "'.");
	}
	else { 
		// 
		console.log(result);
		var newqte=result[0].qte - qte;
		if (newqte < 0) {
			resp.end("NOK Erreur: la quantité demandée ("+qte+") est > au stock disponible ("+result[0].qte+") pour ce produit");
			await client.close();
			return;
		}
		var emailproducteur= result[0].emailproducteur;
		var nomproduit=result[0].nomproduit;
		var nomcat=result[0].nomcat;
		var imageb64=result[0].imageb64;
		var datedispo=result[0].datedispo;
		console.log(newqte);
		// resp.end(JSON.stringify(result));
		//
		// L'item stock a été trouvé, 
		// Il faut maintenant décrémenter l'entrée concernée dans la collection stock et créer un stock réservé correspondant dans la collection rstock  
		//
		mongo_minus_stock(idstock,qte,newqte,emailconso,emailproducteur,nomproduit,nomcat,imageb64,datedispo,token,resp);
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
	await client.close();
  }

finally {
	// Ensures that the client will close when you finish/error
//	await client.close();
  }

}

async function mongo_minus_stock(idstock,qte,newqte,emailconso,emailproducteur,nomproduit,nomcat,imageb64,datedispo,token,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("stock");
	const { BSON, EJSON, ObjectId } = require('bson');
	var query = { _id: new BSON.ObjectId(idstock)};
	var query2= {$set: { qte: newqte }} ;
	//var queryall= query+","+query2;
		
    const result = await col.updateOne(query, query2); // 
	if (result.length ==0) { // Aucun stock existant avec cet _id
		resp.end("NOK erreur le stock recherché n'existe pas:'"+idstock+ "'.");
		await client.close();
	}
	else { 
		// 
		 console.log(result);
		// resp.end(JSON.stringify(result));
		//
		// il faut maintenant créer une ligne dans rstock pour matérialise la réservartion
		mongo_plus_rstock(qte,emailconso,emailproducteur,nomproduit,nomcat,imageb64,datedispo,token,resp);
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
	await client.close();
  }

finally {
	// Ensures that the client will close when you finish/error
//	await client.close();
  }

}

async function mongo_plus_rstock(qte,emailconso,emailproducteur,nomproduit,nomcat,imageb64,datedispo,token,resp) {

try {
	console.log("enter plus_rstock");
    // Connect the client to the server 
    await client.connect();
	console.log("connect ok");
    // 
  	const col = await client.db("module3").collection("rstock");
	var rstockobj = { 
		emailproducteur: "",
		emailconso:"",
		nomproduit:"",
		nomcat:"",
		imageb64:"",
		datedispo:"",
		dateresa:"",
		qte:""
	};
	
	rstockobj.emailproducteur=emailproducteur;
	rstockobj.emailconso=emailconso;
	rstockobj.nomproduit=nomproduit;
	rstockobj.nomcat=nomcat;
	rstockobj.imageb64=imageb64;
	rstockobj.datedispo=datedispo;
	rstockobj.dateresa=getdate("fn");
	rstockobj.qte=qte;
		
  	const result = await col.insertOne(rstockobj);
	console.log("SUCCESS");
	resp.end(JSON.stringify(result));
	
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }


}
// ----------------------------------------------
// creation producteur ==> /createprod/&nom&prenom&email&pwd&ville&addr&tel
// ----------------------------------------------

function createprod(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url creation producteur==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var nom=decodeURIComponent(arrayreq[1]);
			var prenom=decodeURIComponent(arrayreq[2]);
			var email=decodeURIComponent(arrayreq[3]);
			var pwd=decodeURIComponent(arrayreq[4]);
			var ville=decodeURIComponent(arrayreq[5]);	
			var addr=decodeURIComponent(arrayreq[6]);			
			var tel=decodeURIComponent(arrayreq[7]);

//
// il faut encoder le mot de passe
//
// et vérifier que le producteur n'existe pas déjà (avec l'email) avant de chercher à le créer 
//
	bcrypt
		.hash(pwd, 10)
		.then(hash => {
		mongo_check_prod(nom,prenom,email,hash,ville,addr,tel,resp);
		})
}


async function mongo_check_prod(nom,prenom,email,pwd,ville,addr,tel,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("producteur");
	var query = { email: "" };
	query.email=email;
	// query.email="toto";
	console.log("query"+query.email);
    const result = await col.find(query).toArray();
	if (result.length ==0) { // tableau de taille nulle: l'email n'existe pas dans la collection donc on lance la création
		mongo_create_prod(nom,prenom,email,pwd,ville,addr,tel,resp);
	}
	else {
		resp.end("NOK Création de compte producteur impossible: un compte producteur avec l'email '"+email+ "' existe déjà.");
		await client.close();
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
	await client.close();
  }

finally {
	// Ensures that the client will close when you finish/error
//	await client.close();
  }

}

async function mongo_create_prod(nom,prenom,email,pwd,ville,addr,tel,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("producteur");
	var prodobj = { 
		nom: "",
		prenom:"",
		email:"",
		pwd:"",
		ville:"",
		addr:"",
		tel:""
	};
	
	prodobj.nom=nom;
	prodobj.prenom=prenom;
	prodobj.email=email;
	prodobj.pwd=pwd;
	prodobj.ville=ville;
	prodobj.addr=addr;
	prodobj.tel=tel;
		
  	const result = await col.insertOne(prodobj);
	console.log("SUCCESS");
	resp.end(JSON.stringify(prodobj));
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

// ----------------------------------------------
// creation user ==> /createuser/&nom&prenom&email&pwd
// ----------------------------------------------
/*
{
  "nom": "Dupond",
  "prenom": "Jean Claude",
  "email": "jc.dupond@free.fr",
  "pwd": "$2b$10$0r51BrgCbtyJ8Yge54GMs.f3vq6pwCkv4msN6PpijZbquRvxsXpy.",
  "_id": "64176574e20409335cfeb0c1"
}
ou NOK rerason
*/
function createuser(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url creation user==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var nom=decodeURIComponent(arrayreq[1]);
			var prenom=decodeURIComponent(arrayreq[2]);
			var email=decodeURIComponent(arrayreq[3]);
			var pwd=decodeURIComponent(arrayreq[4]);

//
// il faut encoder le mot de passe
//
// et vérifier que le user n'existe pas déjà (avec l'email) avant de chercher à le créer 
//
	bcrypt
		.hash(pwd, 10)
		.then(hash => {
		mongo_check_user(nom,prenom,email,hash,resp);
		})
}


async function mongo_check_user(nom,prenom,email,pwd,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("user");
	var query = { email: "" };
	query.email=email;
	// query.email="toto";
	console.log("query"+query.email);
    const result = await col.find(query).toArray();
	if (result.length ==0) { // tableau de taille nulle: l'email n'existe pas dans la collection donc on lance la création
		mongo_create_user(nom,prenom,email,pwd,resp);
	}
	else {
		resp.end("NOK Création de compte utilisateur impossible: un compte utilisateur avec l'email '"+email+ "' existe déjà.");
		await client.close();
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
	await client.close();
  }

finally {
// Ensures that the client will close when you finish/error
//	await client.close();
  }

}

async function mongo_create_user(nom,prenom,email,pwd,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("user");
	var userobj = { 
		nom: "",
		prenom:"",
		email:"",
		pwd:""
	};
	
	userobj.nom=nom;
	userobj.prenom=prenom;
	userobj.email=email;
	userobj.pwd=pwd;
		
  	const result = await col.insertOne(userobj);
	console.log("SUCCESS");
	resp.end(JSON.stringify(userobj));
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

//
// /createproduct/&nomproduit&nomcat&tokenadmin		// ajouter un produit dans une catégorie
//	return idproduct / NOK
//
// vérifier que la catégorie existe, si oui vérifier que le produit n'existe pas déjà, si OK créer le produit avec un lien sur la catégorie
// 
//
function createproduct(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url creation produit==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var nomproduit=decodeURIComponent(arrayreq[1]);
			var nomcat=decodeURIComponent(arrayreq[2]);
			var token=decodeURIComponent(arrayreq[3]);

//
// On vérifie le token puis il faut d'abord vérifier que la catégorie existe bien
//
			try {
				const decodedToken = jwt.verify(token, tokenchain); // si le token est invalide, on part dans le bloc err
				mongo_check_product(nomproduit,nomcat,token,resp);

			}
			catch(err) {
				console.log(err);
				resp.end("NOK invalid token: "+err);
			}
		
		
}


async function mongo_check_product(nomproduit,nomcat,token,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("categorie");
	var query = { nomcat: "" };
	query.nomcat=nomcat;
	// query.email="toto";
	console.log("query"+query.nomcat);
    const result = await col.find(query).toArray();
	if (result.length ==0) { // tableau de taille nulle: la catégorie n'existe pas, c'est une erreur
		resp.end("NOK Création de produit impossible: la catégorie '"+nomcat+ "' n'existe pas.");
		await client.close();
	}
	else {
		mongo_create_product(nomproduit,nomcat,token,resp); // on crée le produit en le rattachant à nomcat
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
	await client.close();
  }

finally {
	// Ensures that the client will close when you finish/error
	// await client.close();
  }

}

async function mongo_create_product(nomproduit,nomcat,token,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("produit");
	var query = { nomproduit: "" };
	query.nomproduit=nomproduit;
	// query.email="toto";
	console.log("query"+query.nomproduit);
    var result = await col.find(query).toArray();

  } 
 catch(err) {
	resp.end("NOK "+err);
  }


finally {
	// Ensures that the client will close when you finish/error
	await client.close();
	if (result.length ==0) { // tableau de taille nulle: la produit n'existe pas, c'est OK on peut le créer
		mongo_create_product2(nomproduit,nomcat,token,resp); // on crée le produit en le rattachant à idcat
	}
	else {

		resp.end("NOK Création de produit impossible: le produit '"+nomproduit+ "' existe déjà.");
	}
	
	console.log("on continue");
  }

}

async function mongo_create_product2(nomproduit,nomcat,token,resp) {
try {
//console.log("product2");
// Connect the client to the server 
    await client.connect();
//	console.log("connect db ok");
    // 
  	const col = await client.db("module3").collection("produit");
//		console.log("connect table ok");
	var productobj = { 
		nomproduit: "",
		nomcat:""
	};
	
	productobj.nomproduit=nomproduit;
	productobj.nomcat=nomcat;
		
  	const result = await col.insertOne(productobj);
	console.log("insert ok");
//	console.log("SUCCESS");
	resp.end(JSON.stringify(productobj));
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

// ---------------------------------------------- 
// creation admin ==> /createadmin/&nom&prenom&email&pwd&tokenadmin		// create admin
// ---------------------------------------------- 
// 	return 
/*
{
  "nom": "Bauchard",
  "prenom": "Philippe",
  "email": "philippe.bauchard2@free.fr",
  "pwd": "$2b$10$ZL2Iuvk91zBT8.Sl/kdnBuuaRLfrMW5pi3mN63I8UzjVEng.YEBkC",
  "_id": "6415c0b20e3efa50091d6c98"
}
*/
// ou NOK ...
// ----------------------------------------------

function createadmin(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url creation admin==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var nom=decodeURIComponent(arrayreq[1]);
			var prenom=decodeURIComponent(arrayreq[2]);
			var email=decodeURIComponent(arrayreq[3]);
			var pwd=decodeURIComponent(arrayreq[4]);
			var token=decodeURIComponent(arrayreq[5]);	

			try {
				const decodedToken = jwt.verify(token, tokenchain); // si le token erst invalide, on part dans le bloc err
//
// il faut encoder le mot de passe
//
// et vérifier que l'admin n'existe pas déjà (avec l'email) avant de chercher à le créer 
//
				bcrypt
					.hash(pwd, 10)
					.then(hash => {
					mongo_check_admin(nom,prenom,email,hash,token,resp);
					})

			}
			catch(err) {
				console.log(err);
				resp.end("NOK invalid token: "+err);
			}

}

async function mongo_check_admin(nom,prenom,email,pwd,token,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("admin");
	var query = { email: "" };
	query.email=email;
	
	console.log("query"+query.email);
    const result = await col.find(query).toArray();
	if (result.length ==0) { // tableau de taille nulle: l'email n'existe pas dans la collection donc on lance la création
		mongo_create_admin(nom,prenom,email,pwd,token,resp);
	}
	else {
		resp.end("NOK Création de compte admin impossible: un compte admin avec l'email '"+email+ "' existe déjà.");
		await client.close();
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
	await client.close();
  }

finally {
	// Ensures that the client will close when you finish/error
	// await client.close();
  }

}

async function mongo_create_admin(nom,prenom,email,pwd,token,resp) {
try {
    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("admin");
	var adminobj = { 
		nom: "",
		prenom:"",
		email:"",
		pwd:"",
	};
	
	adminobj.nom=nom;
	adminobj.prenom=prenom;
	adminobj.email=email;
	adminobj.pwd=pwd;

  	const result = await col.insertOne(adminobj);
	console.log("SUCCESS");
	resp.end(JSON.stringify(adminobj));
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

// 
// creation category ==> /createcat/&nomcat&tokenadmin
// 	return: 
/*{
  "nomcat": "fruits",
  "_id": "641617f2d0c47eda54521cf5"
}
ou NOK ...
*/

function createcat(request,resp,idx) {
			var reqcreation=request.substr(idx);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log("url creation categorie==>"+reqcreation);
			var arrayreq=reqcreation.split("&");

			var nomcat=decodeURIComponent(arrayreq[1]);
			var token=decodeURIComponent(arrayreq[2]);	

			try {
				const decodedToken = jwt.verify(token, tokenchain); // si le token erst invalide, on part dans le bloc err
//
// il faut vérifier que la catégorie n'existe pas déjà avant de chercher à la créer 
//
				mongo_check_cat(nomcat,token,resp);


			}
			catch(err) {
				console.log(err);
				resp.end("NOK invalid token: "+err);
			}

}

async function mongo_check_cat(nomcat,token,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("categorie");
	var query = { nomcat: "" };
	query.nomcat=nomcat;
	
	console.log("query"+query.nomcat);
    const result = await col.find(query).toArray();
	if (result.length ==0) { // tableau de taille nulle: la catégorie n'existe pas dans la collection categorie donc on lance la création
		mongo_create_cat(nomcat,token,resp);
	}
	else {
		resp.end("NOK Création de catégorie impossible: la catégorie '"+nomcat+ "' existe déjà.");
		await client.close();
		
	}
	
  } 
 catch(err) {
	resp.end("NOK "+err);
	await client.close();
  }

finally {
	// Ensures that the client will close when you finish/error
//	await client.close();
  }

}

async function mongo_create_cat(nomcat,token,resp) {
try {

    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("categorie");
	var catobj = { 
		nomcat: ""
	};
	
	catobj.nomcat=nomcat;
		
  	const result = await col.insertOne(catobj);
	console.log("SUCCESS");
	resp.end(JSON.stringify(catobj));
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }

}

//
// /getcat
//
async function getcat(request,resp,idx) {
	try {
    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("produit");
    const result = await col.find({}).sort({"nomcat":1, "nomproduit":1}).toArray(); //
	resp.end(JSON.stringify(result));
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }
}

//
// /gettowns
//
async function gettowns(request,resp,idx) {
	try {
    // Connect the client to the server 
    await client.connect();
    // 
  	const col = await client.db("module3").collection("producteur");
    const result = await col.find({}).sort({"ville":1}).toArray(); //
	var j=0;
	var prec="";
	var output = [];
	for (var i=0;i <result.length;i++) {
			if (prec== result[i].ville) {}
			else {
				output[j] =result[i].ville;
				j++;
			}
			prec=result[i].ville;
	}
	resp.end(JSON.stringify(output));
  } 
 catch(err) {
	resp.end("NOK "+err);
  }

finally {
	// Ensures that the client will close when you finish/error
	await client.close();
  }
}

// ///////////////////////////////////
function getfile(fichier) {
// ///////////////////////////////////
        try {
                var fic= fssync.readFileSync(fichier);
        }
        catch (err) {
                console.log(fichier +" NOT FOUND");
				fic=fichier +" NOT FOUND";
        }

return fic
}

function ValidateEmail(inputText) {
	var mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
	if(inputText.match(mailformat)) {
		return true;
	}
	else	{
		return false;
	}
}

// ////////////////////////////////
function getdate(par)
// ////////////////////////////////
{
        var d = new Date();
        var day= d.getDate();

        var month = d.getMonth()+1;

        var year = d.getFullYear();

        var hr = d.getHours();
        var minute = d.getMinutes();
        var secs = d.getSeconds();

        if (par=="fullsecs") return(hr*3600+minute*60+secs);

        if (month < 10) month = "0"+month;
        if (day < 10) day = "0"+day;
        if (minute < 10) minute = "0"+minute;
        if (secs < 10) secs = "0"+secs;
        if (hr < 10) hr = "0"+hr;

        if (par=="fulldate")
          return year+"/"+month+"/"+day+" "+ hr+":"+minute;

        if (par=="sec")
          return year+"/"+month+"/"+day+" "+ hr+":"+minute+":"+secs;

        if (par=="time")
          return hr+":"+minute+":"+secs;

         if (par=="secs") par=": "+secs;
         else  if (par=="fn") {
                 return year+"-"+month+"-"+day+"-"+hr+"-"+minute+"-"+secs;
         }
         else par="";

         return hr+":"+minute+par;
}
