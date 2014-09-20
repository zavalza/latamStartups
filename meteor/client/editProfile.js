Template.editProfile.rendered=function() {
    $('.input-group.date').datepicker({
      format: "M-yyyy",
      minViewMode: 1, 
      language: "es",
      autoclose: true
      });
    //alert('Hecho')
  };

Template.editProfile.events({
    'keyup #name,#email,#facebook_url,#twitter_url,#linkedin_url,#github_url,#behance_url,#personal_url' : function(evt, tmpl){
      var targetId = evt.target.id;
      evt.target.style = "";
    },
    'change #name,#email,#facebook_url,#twitter_url,#linkedin_url,#github_url,#behance_url,#personal_url' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert (Session.get('userToShow'));
      var newValue = tmpl.find('#'+targetId).value.trim();
      var re = /([a-zA-Z]+)/g;
      if(newValue.match(re))
      {
        switch(targetId)
        {
          case "twitter_url":
             if (newValue.charAt(0) == '@')
              {
                newValue = 'https://twitter.com/'+newValue.substring(1);
              }
             else if (newValue.search('https://twitter.com/') == -1)
             {
               newValue = 'https://twitter.com/'+newValue;
             }
          break;
          case "facebook_url":
            if (newValue.search('www.facebook.com/') == -1)
              newValue = 'https://www.facebook.com/'+newValue;
          break;
          case "github_url":
            if (newValue.search('github.com/') == -1)
              newValue = 'https://github.com/'+newValue;
          break;
          case "behance_url":
            if (newValue.search('www.behance.net/') == -1)
              newValue= 'https://www.behance.net/'+newValue;
          break;
          case "personal_url":
            if(!newValue.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/))
            {
              alert("No parece una liga válida, revisa que no haya ningún signo '?'");
              evt.target.style = "border-color: #f41717;";
              return false;
            }
          break;
          case "email":
            if(!newValue.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/))      
            {
              alert("El correo electrónico no es válido");
              evt.target.style = "border-color: #f41717;";
              return false;
            }
          break;
        }
     
        Meteor.call('updateTextField', Session.get('userToShow'), targetId, newValue);

        evt.target.style = "border-color: #44c444;";
      }
      
    },

    'change #url': function(evt, tmpl){
      var newUrl = tmpl.find('#url').value.trim();
      Meteor.call('validatePersonUrl', Session.get('userToShow'), newUrl, 
        function(error, result)
        {
          if(error)
          {
             alert('La url ya está siendo usada');
          }
        });
    },

    'click .pullTag' : function(evt, tmpl){
      var targetName = evt.target.name;
      //alert (targetName)
      if(Meteor.userId())
      {
        var sucess = Meteor.call('pullTag', Session.get('userToShow'), this._id);
      }
      else
      {
        alert("Error al borrar etiqueta");
      }
    },

    'mousedown .saveTag' : function(evt, tmpl){
      var targetName = evt.target.name;
      //alert (targetName)
      var value = tmpl.find('#'+targetName).value.trim();
      value = value[0].toUpperCase() + value.slice(1);
       var re = /([a-zA-Z]+)/g;
      if(Meteor.userId() && value.match(re))
      {
        var doc={
                  type: targetName,
                  name:value,
                  counter:{
                    people: 0,
                    companies: 0,
                  },
                  referrer: document.referrer, 
                  timestamp: new Date(),
                }
        var tagId = Meteor.call('saveTag', Session.get('userToShow'), doc);
        tmpl.find('#'+targetName).value = "";
        tmpl.find('#'+targetName).blur();
        document.getElementById(targetName+'options').style.display='none';
      }
      else
      {
        alert("Error al guardar etiqueta");
      }
    },

    'click .deleteLink' : function (evt, tmpl){
      //alert(this.toString());
      Meteor.call('deleteLink', Session.get('userToShow'), this.toString());
      return true;
    },

    'click .deleteExperience': function(evt, tmpl){
       //alert(this.company_id);
       Meteor.call('deleteExperience', Session.get('userToShow'), this.company_id)
    },

    'change #title,#startedAt,#endedAt': function(evt, tmpl){
      //alert(this.company_id);
      var field = evt.target.id;
      //alert(field);
      var value = evt.target.value.trim();
      //alert(value);
      var re = /([a-zA-Z]+)/g;
      if(value.match(re))
      {
        Meteor.call('updateExperience', Session.get('userToShow'),this.company_id, field, value);
        evt.target.style = "border-color: #44c444;";
      }
      else
        evt.target.style = "border-color: #f41717;";
    },

    'keyup #City,#Skill,#College,#Role,#Company' : function(evt, tmpl){
      //busca todo el string y no palabra por palabra
      //alert(evt.keyCode);

      var targetId = evt.target.id;
      //alert(targetId)
      filter = tmpl.find('#'+targetId).value.trim().toUpperCase();
      var re = /([a-zA-Z]+)/g;
      var options = document.getElementsByClassName(targetId);
      var matches = [];
      for (var i = 0; i < options.length; i++) {

        if (filter.match(re)){
          var name = options[i].innerHTML;
          //alert(name);
          if (name.toUpperCase().indexOf(filter) == 0)
              {
                document.getElementById(targetId+'Options').style.display='inline';
                options[i].style.display = 'list-item';
                //options[i].className = targetId;
                matches.push(options[i]);
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

      var key =evt.keyCode;
      //alert(key);
      var selection = Session.get('keyControl');

      switch(key){
        case 40: //Down
          if(selection+1 < matches.length) 
            selection = selection+1;
        break;
        case 38: //Up
          if(selection-1 >= 0)
          selection = selection -1;
        break;
        case 13: //Return
          if(targetId == 'Company')
          {

              var typeOfExperience = tmpl.find('#Experience').value.trim();
              if (typeOfExperience != "")
              {
                  if(matches.length == 0) //New company name
                  {
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
                      team:[{
                        type:typeOfExperience,
                        title:null,
                        startedAt:null,
                        endedAt:null,
                        confirmed:false,
                        person_id: Session.get('userToShow')
                      }],
                      followers:{count:0, user_ids:[]},
                      referrer: document.referrer, 
                      timestamp: new Date(),
                      isPublic:true
                    }
                    Meteor.call('addExperience', Session.get('userToShow'), typeOfExperience, newCompany);
                    }
                  }
                  else
                  {
                    var personDoc = {
                              type:typeOfExperience,
                              title:null,
                              startedAt:null,
                              endedAt:null,
                              confirmed:false,
                              person_id: Session.get('userToShow')
                            };
                    var companyDoc = {
                              type:typeOfExperience,
                              title:null,
                              startedAt:null,
                              endedAt:null,
                              confirmed:false,
                              company_id: matches[selection].getAttribute('name')
                  };
                  Meteor.call('pushExperience', Session.get('userToShow'), matches[selection].getAttribute('name'), companyDoc, personDoc);
                  }
            }
            else
              {
                alert ("Selecciona un tipo de experiencia");
              }
          }
          else
          {
            if(matches.length == 0) //New tag
            {
              var value = tmpl.find('#'+targetId).value.trim();
              value = value[0].toUpperCase() + value.slice(1);
               var re = /([a-zA-Z]+)/g;
              if(Meteor.userId() && value.match(re))
              {
                var doc={
                          type: targetId,
                          name:value,
                          counter:{
                            people: 0,
                            companies: 0,
                          },
                          referrer: document.referrer, 
                          timestamp: new Date(),
                        }
                    Meteor.call('saveTag', Session.get('userToShow'), doc);
              }
            } 
            else
              Meteor.call('pushTag', Session.get('userToShow'), matches[selection].getAttribute('name'));
          }
          tmpl.find('#'+targetId).value = "";
            tmpl.find('#'+targetId).blur();
            document.getElementById(targetId+'Options').style.display='none';
        break;
        default:
          selection = -1;
        break;
      }

      for(var j=0; j < matches.length; j++)
      {
        if(j==selection)
          matches[j].className =targetId+' list-group-item active';
        else
          matches[j].className = targetId+' list-group-item';
      }
      matches = [];
      //Session.set('keyControl', 0);
      Session.set('keyControl', selection);
      //alert(selection);
    },

    'blur #City,#Skill,#College,#Role,#Company' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert(evt.currentTarget.id);
      Session.set('keyControl', -1);
      tmpl.find('#'+targetId).value = "";
      document.getElementById(targetId+'Options').style.display='none';
      
    },

    'mousedown .City,.Skill,.College,.Role' : function (evt, tmpl){
      //alert(this._id);
      var targetClass = evt.target.getAttribute('class').split(' ')[0];
      Meteor.call('pushTag', Session.get('userToShow'), this._id);
      //blur event is called after mousedown
    }
  });

Template.editProfile.helpers({
  person: function(personId){
          Session.set('userToShow', personId);
          Meteor.subscribe('person', personId);
    return People.find({_id:personId});
  },

  city: function(tagId)
  {
    return Tags.find({_id:tagId, type:'City'});
  },

  role: function(tagId)
  {
    return Tags.find({_id:tagId, type:'Role'});
  },

  skill: function(tagId)
  {
    return Tags.find({_id:tagId, type:'Skill'});
  },

  company: function(companyId)
  {
    return Companies.find({_id:companyId});
  },

 college: function(tagId)
  {
    return Tags.find({_id:tagId, type:'College'});
  }
})