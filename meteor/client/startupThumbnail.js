Template.startupThumbnail.rendered = function()
 {

  var maxHeight = 0;
  $('.thumbText').each(function(){
        var h = $(this).height();
        if(h > maxHeight)
        {
          //alert(h);
          maxHeight = h;
        }
    });
  $('.thumbText').each(function(){
        $(this).css('height',maxHeight+1);
    });
}

Template.startupThumbnail.events({

  'click .companyLink': function(evt, tmpl)
  {
    var date = new Date();
    var dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
     if(Meteor.user())
        person_id = Meteor.user().person_id;
      else
        person_id = null;

      var recordDoc = {
                  profile_id: this._id,
                  date:dateString,
                  clicks:[person_id],
                  timestamp: new Date(),
         }  
     Meteor.call('addClick', recordDoc);
  }
})

Template.startupThumbnail.helpers({

    person:function(personId)
    {
      return People.find({_id:personId});
    },
     roleTag: function(personTags)
      {
        return Tags.find({_id:{$in:personTags}, type:'Role'});
      },

      skillTag: function(personTags)
      {
        return Tags.find({_id:{$in:personTags}, type:'Skill'});
      },

    image: function(ids)
        {
          //alert(ids);
          if (typeof (ids) == 'object')
          return Images.find({_id:{$in: ids}});
          else
          {
            //alert(typeof (ids)) string
            return Images.find({_id:ids})
          }
          
        },

  cities: function(tagsArray)
    {
         return Tags.find({_id:{$in:tagsArray}, type:'City'});
    },
  markets: function(tagsArray)
    {
         return Tags.find({_id:{$in:tagsArray}, type:'Market'});
    },
      externalLink: function(url)
        {
          if(url.search('http') != -1)
            {
              return url;
            }
          else
          {
            return "http://"+url ;
          }
        },

})

Template.startupThumbnail.screenshotToShow = function() {
      return this.screenshots[0]
  };
