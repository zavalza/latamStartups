

  Template.portafolioInput.events({
    'click .addLink' : function (evt, tmpl){
      //alert(this._id);
      var link = tmpl.find('#newLink').value;
      var re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (link.match(re))
      {
        Meteor.call('addLink', Session.get('userToShow'), link);
        tmpl.find('#newLink').value = "";
      }
      else
      {
        alert("No parece una liga válida, revisa que no haya ningún signo '?'");
      }
      //document.getElementById('SkillOptions').style.display='none';
      return true;
    },
  });

  Template.experienceInput.events({
    'mousedown .Company': function(evt, tmpl){
      var companyName = evt.target.id.trim();
      //alert (this._id);
      var typeOfExperience = tmpl.find('#Experience').value.trim();
      if (typeOfExperience != "")
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
                    company_id: this._id
        };
      Meteor.call('pushExperience', Session.get('userToShow'), this._id, companyDoc, personDoc);
      }
      else
      {
        alert ("Selecciona un tipo de experiencia");
      }
    },

    'mousedown .addExperience' : function(evt, tmpl){
      var typeOfExperience = tmpl.find('#Experience').value.trim();
      var companyName = tmpl.find('#Company').value.trim()
      var re = /([a-zA-Z]+)/g;
      if (typeOfExperience != "" && companyName.match(re))
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
      else
      {
        alert ("Selecciona un tipo de experiencia y escribe una compañía");
      }
    }
  });

    Template.locationInput.helpers ({
        cityOptions : function()
        {
          return Tags.find({type:'City'});
        }
    });

    Template.marketInput.helpers({
       marketOptions: function()
       {
        return Tags.find({type:'Market'});
       }
    });


    Template.skillsInput.helpers({
       skillOptions : function()
        {
          return Tags.find({type:'Skill'});
        },
    });

    Template.collegesInput.helpers({
       collegeOptions : function()
        {
          return Tags.find({type:'College'});
        },
    });

    Template.rolesInput.helpers({
       roleOptions : function()
        {
          return Tags.find({type:'Role'});
        }
    });

    Template.experienceInput.helpers ({
        companyOptions : function()
        {
          return Companies.find();
        }
    });
