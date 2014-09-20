// Because we are going to be using a remote connection, be sure
// to start the MongoDB Shell (mongo) with the --nodb flag. Then,
// we can connect and define our own db instance.
 
// Connect to the MongoLab database.
//main db host
var connection = new Mongo( "ds063218.mongolab.com:63218");
 
// Connect to the database.
var db = connection.getDB( "meteor" );
 
// Authorize this connection.
//db.auth("user", "password");
db.auth( "xxxx", "xxxx" );

//roles, city, skill, college
db.companies.find({}).forEach(function(doc){

	db.companies.update({_id:doc._id},{$set:{isPublic:true}})
		//var tag = db.tags.findOne({name:doc.name});
		print (doc.name);
	//print(amount);
		
});
 
print( "> Field isPublic generated." );