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
        $(this).css('height',maxHeight+2);
    });
}

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

})

Template.startupThumbnail.screenshotToShow = function() {
      return this.screenshots[0]
  };
