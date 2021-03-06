// Because we are going to be using a remote connection, be sure
// to start the MongoDB Shell (mongo) with the --nodb flag. Then,
// we can connect and define our own db instance.
 
// Connect to the MongoLab database.
//main db host
var connection = new Mongo( "ds029831.mongolab.com:29831" );
 
// Connect to the database.
var db = connection.getDB( "latam" );
 
// Authorize this connection.
//db.auth("user", "password");
db.auth( "xxxx", "xxxx" );

//roles, city, skill, college

db.companies.find({types:'Startup',isPublic:true}).sort({'timestamp':-1}).limit(3).forEach(function(doc){
	print(doc.name)
});

db.companies.find({types:'Startup',isPublic:true}).sort({'timestamp':1}).forEach(function(doc){
	var clicks = 0;
	var views = 0;
	var timestamp= new Date(2015, 2, 4);
	db.records.find({
		'profile_id':doc._id,
		 "views": {
	        "$ne": ["WoZXawfN4aBJuE8ZC"] //paul
	   			  },
	    "clicks": {
	        "$ne": ["WoZXawfN4aBJuE8ZC"] //paul
				   },
		'timestamp':{'$gte':timestamp}
		}).forEach(function(record){
			if(record.clicks)
				clicks += record.clicks.length;
			if(record.views)
				views += record.views.length;
		})
	var scoreFull = doc.clicks/doc.views;
	var scoreBest = clicks*.8+views*0.2;
	print(">"+doc.name +" "+ clicks+" "+views+ " "+scoreBest);
	
})
 
print( "> Newsletter generated." );
