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
  },

  'click .addInfo':function(evt, tmpl){
    Session.set('openAdmin', true);
  },

  'click .cancelAdd':function(evt, tmpl){
    Session.set('openAdmin', false);
  },

  'click .addNewCompany':function(evt, tmpl){
                    Session.set('openAdmin', false);
                    var companyName = tmpl.find('#Company').value.trim();
                    var re = /([a-zA-Z]+)/g;
                    if(companyName.match(re))
                    {
                      var newCompany={
                      types: [], //startup, incubator, accelerator, cowork etc.
                      name:companyName,
                      url:null,
                      logo:"", //id of logo image
                      description:"",
                      highConcept:"",
                      company_url:"",
                      fb_url:"",
                      twitter_url:"",
                      tag_ids:[],
                      video_url:"",
                      screenshots:[],
                      team:[],
                      followers:{count:0, user_ids:[]},
                      referrer: document.referrer, 
                      timestamp: new Date(),
                      isPublic:false
                    }
                      Meteor.call('addNewCompany', newCompany, function(error , result){
                          if(error)
                           {
                            console.log(error)
                           } 
                          else
                          {
                            console.log(result) ;
                            Session.set('url', result);
                            Router.go('editCompany');
                          }
                          
                        });
                    }
 
  }
  });

Template.navigation.openNew = function()
{
  return Session.get('openNew');
}

Template.navigation.openAdmin = function()
{
  return Session.get('openAdmin');
}

Template.navigation.helpers ({

  thisUser: function(personId)
  {
    Meteor.subscribe("person", personId);
    return People.find({_id: personId});
  },

  isAdmin: function(personId)
  {
    return personId == "WoZXawfN4aBJuE8ZC"
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