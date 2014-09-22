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