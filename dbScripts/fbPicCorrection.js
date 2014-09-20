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
db.people.find({}).forEach(function(doc){
		if(doc.picture)
		{
			
			//print(doc.picture);
			//print(doc.picture.search('facebook'));
			if(doc.picture.search('facebook') != -1)
			{	print(doc.name)
				//print(doc.picture);
				//print(doc.picture.search('facebook'));
				var newStr= doc.picture.slice(0, doc.picture.indexOf('?'))+'?width=100&height=100';
				//print(newStr);
				db.people.update({_id: doc._id},{$set:{picture:newStr}});
			}
				
		}
})
 
print( "> get a square images of facebook" );