Template.navigation.events({
  'click .tryLogout': function (evt, tmpl) {
        Meteor.logout(function(err){
            if (err)
            {
              //To do if logout was not successfull
            }
            else{
                Router.go('loginForm');
              }
            });
        return false
      },

  'click .closeNew': function(evt, tmpl){
    Session.set('openNew', false);
  }
  });

Template.navigation.openNew = function()
{
  return Session.get('openNew');
}

Template.navigation.helpers ({

  thisUser: function(personId)
  {
    Meteor.subscribe("person", personId);
    return People.find({_id: personId});
  },

   company: function(companyId)
        {
          return Companies.find({_id:companyId});
        },

  unpublicCompany: function(personId)
  {
    return Companies.find({'team':{$elemMatch:{'person_id': personId}},'isPublic':false});
  }
});