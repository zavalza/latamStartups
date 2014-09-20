// Because we are going to be using a remote connection, be sure
// to start the MongoDB Shell (mongo) with the --nodb flag. Then,
// we can connect and define our own db instance.
 
// Connect to the MongoLab database.
//main db host
var connection = new Mongo( "ds063218.mongolab.com:63218" );
 
// Connect to the database.
var db = connection.getDB( "meteor" );
 
// Authorize this connection.
//db.auth("user", "password");
db.auth( "xxxx", "xxxx" );

//roles, city, skill, college
db.tags.find({}).forEach(function(doc){
	print(">"+doc.name);
	var amountPeople = db.people.find({tag_ids:doc._id}).count();
	print(amountPeople);
	var amountCompanies = db.companies.find({tag_ids:doc._id}).count();
	print(amountCompanies);
	db.tags.update({_id:doc._id}, {$set:{'counter.people':amountPeople, 'counter.companies':amountCompanies}});
})
 
print( "> Counters generated." );