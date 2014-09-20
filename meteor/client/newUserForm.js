Template.newUserForm.waiting = function()
{
  return Session.get('waiting');
}

Template.newUserForm.events({
    'keyup #User' : function(evt, tmpl){
      //busca todo el string y no palabra por palabra
      var targetId = evt.target.id;
      //alert(targetId)
      filter = tmpl.find('#'+targetId).value.trim().toUpperCase();
      var re = /([a-zA-Z]+)/g;
      var options = document.getElementsByClassName(targetId);
      for (var i = 0; i < options.length; i++) {

        if (filter.match(re)){
          var name = options[i].innerHTML;
          //alert(name);
          if (name.toUpperCase().indexOf(filter) == 0)
              {
                document.getElementById(targetId+'Options').style.display='inline';
                options[i].style.display = 'list-item';
              }
              
          else
              {
                options[i].style.display = 'none';
              }
              
        }
        else
        {
          document.getElementById(targetId+'Options').style.display='none';
          options[i].style.display = 'none';
        }
          
      }
    },

    'click .tryFacebookLogin': function(evt, tmpl){
        if(Accounts.loginServicesConfigured()){
        Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'user_friends', 'email']
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
          else
          {
            Meteor.call('userToPerson', Meteor.userId(), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  //alert(result);
                  Router.go('firstLogin');
                }
              });
            
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
           Session.set('waiting', true);
           Meteor.call('userToPerson', Meteor.userId(), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  //alert(result);
                  Session.set('waiting', false);
                  Router.go('firstLogin');
                }
              });
          }
      }); 
      }
      else{
        alert("Error en inicio de sesión");
      }
    }
  });

Template.newUserForm.helpers({
  userOptions : function()
    {
      Meteor.subscribe('people');
    return People.find({});
    }
})