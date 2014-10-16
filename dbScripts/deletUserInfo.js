// Because we are going to be using a remote connection, be sure
// to start the MongoDB Shell (mongo) with the --nodb flag. Then,
// we can connect and define our own db instance.
 
// Connect to the MongoLab database.
//main db host
var connection = new Mongo( "ds059519.mongolab.com:59519");
 
// Connect to the database.
var db = connection.getDB( "latam" );
 
// Authorize this connection.
//db.auth("user", "password");
db.auth( "xxxx", "xxxx" );

//roles, city, skill, college
db.people.find({}).forEach(function(doc){

	db.people.update({_id:doc._id},{$set:{user_id:null, facebook_url:null, linkedin_url:null, email:null, picture: "defaultPic.png"}})
		//var tag = db.tags.findOne({name:doc.name});
		print (doc.name);
	//print(amount);
		
});
 
print( "> People Fields to default." );