Template.loginForm.waiting = function()
{
  return Session.get('waiting');
}

Template.loginForm.events({
    'click .tryFacebookLogin': function(evt, tmpl){
      if(Accounts.loginServicesConfigured()){
        Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'user_friends']
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
          else
          {
            //Success
            if(Session.get('claimProfile'))
            {
               Meteor.call('claimPerson', Meteor.userId(), Session.get('url'), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  Session.set('claimProfile', false);
                  //alert(result);
                  Router.go('firstLogin');
                }
              });

            }
            else
            {
              Meteor.call('userToPerson', Meteor.userId(), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  //alert(result);
                  Router.go('people');
                }
              });
            }
        
            
          }
      }); 
      }
      else{
        alert("Error en inicio de sesión");
      }
    },

      'click .tryLinkedinLogin': function(evt, tmpl){
      if(Accounts.loginServicesConfigured()){
        Meteor.loginWithLinkedIn({
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
          else
          {
            //Success
            if(Session.get('claimProfile'))
            {
              Session.set('waiting', true);
               Meteor.call('claimPerson', Meteor.userId(), Session.get('url'), function(error, result)
              {
                if(!error){
                  Session.set('waiting', false);
                  Session.set('userToShow', result);
                  Session.set('claimProfile', false);
                  //alert(result);
                  Router.go('firstLogin');
                }
              });

            }
            else
            {
              Meteor.call('userToPerson', Meteor.userId(), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  //alert(result);
                  Router.go('people');
                }
              });
            }
             
          }
      }); 
      }
      else{
        alert("Error en inicio de sesión");
      }
    }
  });