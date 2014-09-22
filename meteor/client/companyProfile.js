Template.companyProfile.rendered = function()
{
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

Template.profileThumbnail.rendered = function()
{
  var maxHeight = 0;
  $('.cvText').each(function(){
        var h = $(this).height();
        if(h > maxHeight)
        {
          //alert(h);
          maxHeight = h;
        }
    });
  $('.cvText').each(function(){
        $(this).css('height',maxHeight+1);
    });
}

Template.companyProfile.events({
  'mouseenter .screenshot':function(evt, tmpl){
    Session.set("screenshotToShow",this._id);
  },

  'click .deleteImpulse': function(evt, tmpl)
  {
    //alert(evt.target.id)
    //alert(this._id);
    Meteor.call('deleteImpulse', Session.get('url'), evt.target.id);
  },

  'click .giveInterest': function(evt, tmpl)
  {
    //alert(evt.target.id)
    //alert(this._id);
    Meteor.call('giveInterest', evt.target.id, Meteor.user().person_id);
    alert('Tu información se ha enviado, espera a que te contacten');
  }
});


 Template.companyProfile.screenshotToShow = function() {
    var selection = Session.get("screenshotToShow");
    if(selection)
      return selection
    else
      return this.screenshots[0]
  };

  Template.companyProfile.someDescription = function()
  {
    return (this.description||this.video_url||this.screenshots);
  }

Template.profileThumbnail.helpers({
  company: function(companyId)
        {
            return Companies.find({_id:companyId}); 
        },

    miniCV: function(experience)
  {
    var CV = [];
    for(var i = 0; i < experience.length; i++)
    { 
      var text;
      if(experience[i].title)
      {
        text = experience[i].title;
      }
      else
      {
        text = experience[i].type;
      }
      var doc= {string: text,
                company_id: experience[i].company_id}
      if(experience[i].company_id == Session.get('currentCompanyId'))
      {
        CV.splice(0,0,doc);
      }
      else
      {

        CV.push(doc);
      }
        
    }
    //alert(EJSON.stringify(CV))
    return CV.slice(0,4);
  }
})

Template.companyProfile.helpers ({
        canEdit: function(personId)
    {
      //return true;
      return (People.find({_id: personId,
        'experience':{$elemMatch:{'company_id': Session.get('currentCompanyId')}}}).count() > 0);
    },

      city: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'City'});
      },

      market: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'Market'});
      },

      typeOfCompany: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'TypeOfCompany'});
      },

      impulse: function (impulseIds)
      {
        return Impulses.find({_id:{$in:impulseIds}});
      },
      
       type: function (tagIds)
      {
        return Tags.find({_id:{$in:tagIds}, type:"ImpulseType"});
      },

      tag: function (tagIds)
      {
        return Tags.find({_id:{$in:tagIds}});
      },

      reward: function (tagIds)
      {
        return Tags.find({_id:{$in:tagIds}, type:"RewardType"});
      },

        company: function(companyId)
        {
          if(companyId)
            return Companies.find({_id:companyId});
          else
          {
            //alert(Session.get('currentCompanyId'));
             return Companies.find({_id:Session.get('currentCompanyId')});
          }
           
        },

          externalLink: function(url)
        {
          var ret=[]
          if(url.search('http') != -1)
            {
              ret.push(url)
            }
          else
          {
            ret.push("http://"+url);
          }

           return ret;
        },

        image: function(ids)
        {
          if (typeof (ids) == 'object')
          return Images.find({_id:{$in: ids}});
          else
          {
            //alert(typeof (ids)) string
            return Images.find({_id:ids})
          }
          
        },

         videoCode: function(video_url)
        {
          var array=[];

          var videoCode = video_url.substr(video_url.lastIndexOf('/')+1);
          array.push(videoCode);
          //alert(videoCode)
          return array;
        },

        isYoutube: function(video_url)
        {
          return (video_url.search('youtu') != -1);
        },

        isVimeo: function(video_url)
        {
          return (video_url.search('vimeo') != -1);
        },

         founder: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            if (teamArray[i].type=="Fundador")
            {
              idsToFind.push(teamArray[i].person_id);
            }
          }
          Meteor.subscribe("manyPersons", idsToFind);
          return People.find({_id:{$in:idsToFind}});
        },

        teamMember: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            //alert(teamArray[i].type)
            if (teamArray[i].type=="Miembro del equipo")
            {
              idsToFind.push(teamArray[i].person_id);
            }
          }
          Meteor.subscribe("manyPersons", idsToFind);
          return People.find({_id:{$in:idsToFind}});
        },

        investor: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            if (teamArray[i].type=="Inversionista")
            {
              idsToFind.push(teamArray[i].person_id);
            }
          }
          Meteor.subscribe("manyPersons", idsToFind);
          return People.find({_id:{$in:idsToFind}});
        },
        otherRole: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            if (teamArray[i].type=="Asesor" || teamArray[i].type=="Miembro del consejo" )
            {
              idsToFind.push(teamArray[i].person_id);
            }
          }
          Meteor.subscribe("manyPersons", idsToFind);
          return People.find({_id:{$in:idsToFind}});
        },
    });