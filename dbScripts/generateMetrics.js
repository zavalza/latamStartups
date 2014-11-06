// Because we are going to be using a remote connection, be sure
// to start the MongoDB Shell (mongo) with the --nodb flag. Then,
// we can connect and define our own db instance.
 
// Connect to the MongoLab database.
//main db host
var connection = new Mongo( "ds049990-a0.mongolab.com:49990" );
 
// Connect to the database.
var db = connection.getDB( "latstartups" );
 
// Authorize this connection.
//db.auth("user", "password");
db.auth( xxxx, xxxx );

//roles, city, skill, college
var date = null;
var views, clicks, counter, manyViews, manyClicks= 0;

db.records.find({
	"views": {
        "$ne": ["WoZXawfN4aBJuE8ZC"] //paul
   },
    "clicks": {
        "$ne": ["WoZXawfN4aBJuE8ZC"] //paul
   }
}).sort({'date':1}).forEach(function(doc){
	//print(">"+doc.date);
	if(doc.date != date)
	{
		print(date + "-> clicks: "+clicks+" views: "+views+ " manyViews: " +manyViews + " manyClicks: " + manyClicks +"  totalOfRecords: "+counter);
		date = doc.date;
		counter=0;
		views= 0;
		clicks=0;
		manyViews = 0;
		manyClicks = 0;
	}
	if(doc.views)
	{
		views+= doc.views.length;
		if(doc.views.length > 2)
		{
			manyViews += 1;
		}
	}
		
	if(doc.clicks)
	{
		clicks+= doc.clicks.length;
		if(doc.clicks.length > 2)
		{
			manyClicks += 1;
		}
	}
		
	counter+=1;
	
	/*var amountPeople = db.people.find({tag_ids:doc._id}).count();
	print(amountPeople);
	var amountCompanies = db.companies.find({tag_ids:doc._id}).count();
	print(amountCompanies);
	db.tags.update({_id:doc._id}, {$set:{'counter.people':amountPeople, 'counter.companies':amountCompanies}});*/
})
 
print( "> Metrics generated." );