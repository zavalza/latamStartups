 Template.companies.events({
    'change #types': function(evt, tmpl){
    //alert(evt.target.value);
    var filtersArray = Session.get("filters");
    if (evt.target.checked)
    {
    filtersArray.push(evt.target.value);
    }
    else
    {
      var pos= filtersArray.indexOf(evt.target.value);
      filtersArray.splice(pos, 1);
    }
    Session.set('filters', filtersArray);
  },
  'keyup #City,#Market' : function(evt, tmpl){
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
          var filtersArray = Session.get("filters");
          filtersArray.push(matches[selection].id);
          Session.set('filters', filtersArray);
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

    'blur #City,#Market' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert(evt.currentTarget.id);
      Session.set('keyControl', -1);
      tmpl.find('#'+targetId).value = "";
      document.getElementById(targetId+'Options').style.display='none';
      
    },

    'mousedown .City,.Market' : function (evt, tmpl){
      //alert(this._id);
      var targetClass = evt.target.getAttribute('class');
      var filtersArray = Session.get("filters");
      filtersArray.push(evt.target.id);
      Session.set('filters', filtersArray);
      //blur event is called after mousedown
    },

    'click .tag'  : function (evt, tmpl){
      var filtersArray = Session.get("filters");
      filtersArray.push(evt.target.id);
      Session.set('filters', filtersArray);
      return true;
    },

    'click .pullFilter': function(evt, tmpl){
      var filtersArray = Session.get('filters');
      var pos= filtersArray.indexOf(evt.target.id);
      filtersArray.splice(pos, 1);
      Session.set('filters', filtersArray);
    }
 })

 Template.companies.helpers({
  company: function()
  {
        if (Session.get('filters').length == 0)
            return Companies.find({types:{$ne:'Startup'}, isPublic:true});
           else
            return Companies.find({types:{$ne:'Startup'}, isPublic:true, tag_ids:{$all:Session.get('filters')}});
  },

  cities: function(tagsArray)
    {
         return Tags.find({_id:{$in:tagsArray}, type:'City'});
    },
  markets: function(tagsArray)
    {
         return Tags.find({_id:{$in:tagsArray}, type:'Market'});
    },
  city: function(tagId)
  {
    return Tags.find({_id:tagId, type:'City'});
  },

  market: function(tagId)
  {
    return Tags.find({_id:tagId, type:'Market'});
  },

  typeOfCompanyOption: function()
    {
        return Tags.find({"type": "TypeOfCompany","counter.companies":{$gt:0}, "name":{$ne:"Startup"}});
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
    cityOption: function()
        {
            return Tags.find({"type": "City","counter.companies":{$gt:0}});
        },

    marketOption: function()
        {
            return Tags.find({"type": "Market","counter.companies":{$gt:0}});
        },

 })

Template.companies.filters = function(){
  return Session.get('filters');
};
 