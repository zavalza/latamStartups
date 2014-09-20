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
db.tags.find({}).forEach(function(doc){

	var matches = db.tags.find({name:doc.name});
	var amount = matches.count();
	if (amount > 1)
	{	
		//print(doc.name)
		var tagtoSave =null;
		var tagsToDelete = [];
		print(amount);
		matches.forEach(function(doc)
		{
			if (tagtoSave == null)
				tagtoSave = doc._id;
			else
				tagsToDelete.push(doc._id);
		});
		print("A guardar:")
		print(tagtoSave)
		print("A borrar:")
		for(var i=0; i < tagsToDelete.length; i++)
		{
			db.people.update({tag_ids:tagsToDelete[i]},{$addToSet:{tag_ids:tagtoSave}});
			db.people.update({tag_ids:tagsToDelete[i]},{$pull:{tag_ids:tagsToDelete[i]}});
			db.companies.update({tag_ids:tagsToDelete[i]},{$addToSet:{tag_ids:tagtoSave}});
			db.companies.update({tag_ids:tagsToDelete[i]},{$pull:{tag_ids:tagsToDelete[i]}});
			db.tags.remove({_id:tagsToDelete[i]});
			print(tagsToDelete[i]);
		}

		//var tag = db.tags.findOne({name:doc.name});

	}
	//print(amount);
		
});
 
print( "> Duplicates deleted." );