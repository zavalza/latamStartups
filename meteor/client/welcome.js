Template.headerwrap.takValue = function()
{
	return Session.get('takValue');
}

Template.headerwrap.pathValue = function()
{
	return Session.get('pathValue');
}

  Template.headerwrap.peopleAmount = function(){
    return People.find({}).count();
  }

  Template.headerwrap.startupsAmount = function(){
    Meteor.subscribe("allCompanies");
    //maybe just type=startup
    return Companies.find({types:'Startup',isPublic:true}).count();
  }

  Template.newStartups.newStartup = function()
  {
      return Companies.find({types:'Startup',isPublic:true},{sort: {timestamp: -1},limit:3})
    }

  Template.trendingStartups.trendingStartup = function()
  {    //Use views for sorting just today, then change to score
      //printoo, blooders, 3dfactory
      return Companies.find({_id:{$in:["FWS4sBY789wbPq9v5","rH4ixpeLxd5DHSnsF","G2y6xzKjH2aFH3pJm"]},types:'Startup',isPublic:true},{sort:{clicks: -1},limit:3})
    }

  Template.peopleInCommunity.newUser = function()
  {
    Meteor.subscribe('last3Users');
    return Meteor.users.find({},{sort: {createdAt: -1}, limit:3});
  }

  Template.peopleInCommunity.person = function (personId)
  {
    return People.find({_id:personId});
  }