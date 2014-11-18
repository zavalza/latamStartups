Template.userProfile.rendered = function()
{
  document.body.scrollTop = document.documentElement.scrollTop = 0;
   setTimeout(function() { //wait for user data
      ga("send", "event", 'views', 'open', 'userProfile', 0);
    },700);
}

Template.userProfile.helpers({
      user: function(personId)
        {
            return People.find({_id:personId}); 
        },

       canEdit: function()
       {
        if(Meteor.userId())
          return Meteor.userId()== this.user_id;
        else
          return false;
       },

       hasNoUser: function()
       {
        if(this.user_id)
          return false;
        else
          return true;
       },

       isFirst:function(pos)
       {
        return (pos == 0);
       },


       image: function(ids)
        {
          if (typeof (ids) == 'object')
          {
            //alert(EJSON.stringify(ids));
            return Images.find({_id:{$in: ids}});
          }
          
          else
          {
            //alert(ids);
            //alert(typeof (ids)) string
            return Images.find({_id:ids})
          }
          
        },

       company: function(companyId)
       {
        return Companies.find({_id:companyId});
       },

       role: function(tagsArray)
       {
          return Tags.find({_id:{$in:tagsArray}, type: 'Role'}); 
       },

      city: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'City'});
      },

      college: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'College'});
      },

      skill: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'Skill'}).map(function(skill, index) {
          skill.position = index;
          return skill;
          });
      }
    });

Template.userProfile.events({
  'click .claimProfile': function(evt, tmpl)
  {
      if(Meteor.userId())
      {
            Meteor.call('claimPerson', Meteor.userId(), Session.get('url'), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  //alert(result);
                  Router.go('editProfile');
                }
              });
            
      }
      else{
          Session.set('claimProfile', true);
          alert("Inicia sesión para reclamar tu perfil");
          Router.go('loginForm');
      }
    }
  })