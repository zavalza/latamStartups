  Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'person_id': 1}});
  } else {
    this.ready();
  }
});

  Meteor.publish('peopleToShow', function(filtersArray){
    if(filtersArray != null && filtersArray.length == 0)
      return People.find({user_id:{$ne:null}});
    else
      return People.find({tag_ids:{$all:filtersArray}});
  });

  Meteor.publish('allImpulses', function()
  {
    return Impulses.find({});
  });
  Meteor.publish('allRegistredPeople', function(){
    return People.find({user_id:{$ne:null}});
  });

  Meteor.publish('personUrl', function(urlToFind){
    return People.find({url:urlToFind});
  });

  Meteor.publish("companyProfile", function (companyId) {
  //console.log("publishing company with id: " +companyId);
    return Companies.find({_id: companyId});
    //limitar campos a los que sean públicos para seguridad
  });

 Meteor.publish('allCompanies', function(){
 	return Companies.find({});
 })

 Meteor.publish('allTags', function(){
 	return Tags.find({});
 })

 Meteor.publish('allImages', function(){
  //console.log('Images');
 	return Images.find({});
 })

  Meteor.publish("userProfile", function (userId) {
  //console.log("publishing user with id: " +userId);
    return Meteor.users.find({_id: userId});
    //limitar campos a los que sean públicos para seguridad
  });

   Meteor.publish("person", function (personId) {
    return People.find({_id: personId});
    //Todos los campos deberían ser públicos
  });

   Meteor.publish("manyPersons", function (idsToFind) {
    return People.find({_id:{$in:idsToFind}});
    //Todos los campos deberían ser públicos
  });

   Meteor.publish("people", function (personId) {
    return People.find({});
    //Todos los campos deberían ser públicos
  });

  Meteor.publish('manyUserProfiles', function(idsToFind){
 	return Meteor.users.find({_id:{$in:idsToFind}});
 })

 Meteor.publish('allUserProfiles', function(){
 	return Meteor.users.find({});
 })