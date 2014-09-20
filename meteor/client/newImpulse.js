Template.newImpulse.events({
    'keyup #Tag' : function(evt, tmpl){
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
          //alert('Enter')
          var tagsArray = Session.get("selectedTags");
          tagsArray.push(matches[selection].id);
          Session.set('selectedTags', tagsArray);
          //alert(Session.get('selectedTags'));
          //alert(EJSON.stringify(Session.get('selectedTags')));
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

    'blur #Tag' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert(evt.currentTarget.id);
      Session.set('keyControl', -1);
      tmpl.find('#'+targetId).value = "";
      document.getElementById(targetId+'Options').style.display='none';
      
    },

    'mousedown .Tag' : function (evt, tmpl){
      //alert(this._id);
      var targetClass = evt.target.getAttribute('class');
      var tagsArray = Session.get("selectedTags");
      tagsArray.push(evt.target.id);
      Session.set('selectedTags', tagsArray);
      //blur event is called after mousedown
    },
    'click .pullTag' : function(evt, tmpl){
      //alert (targetName)
      var tagsArray = Session.get('selectedTags');
      var pos= tagsArray.indexOf(evt.target.id);
      tagsArray.splice(pos, 1);
      Session.set('selectedTags', tagsArray);
      
    },
    'click .saveImpulse': function(evt, tmpl)
    {
      //alert('salvar');
      var title= tmpl.find('#title').value;
      var description = tmpl.find('#description').value;
      var type = tmpl.find('#impulseType').value;
      var remotes = document.getElementsByName('remote');
      for(var i = 0; i < remotes.length; i++)
      {
        if(remotes[i].checked)
           var remote= remotes[i].value;
      }
     
      if(title.length==0 || description.length == 0 || type.length == 0 || remote.length == 0)
      {
        alert ('Por favor llena todos los campos');
        return false;
      }
      var tags = Session.get('selectedTags');
      if(tags.length == 0)
      {
        alert('Selecciona al menos un tag para el perfil');
        return false;
      }
      var reward_ids = [];
      var rewards = document.getElementsByName('reward');
      for (var i = 0; i < rewards.length; i++)
      {
        if(rewards[i].checked)
        {
          //alert(rewards[i].id);
          reward_ids.push(rewards[i].id);
        }
      }
      if(reward_ids.length == 0)
      {
        alert ("Selecciona qué darás a cambio");
        return false;
      }
      reward_ids.push(type);

      //var companyDoc = Companies.findOne({'url': Session.get('url')});
      var impulseDoc = {
        //company_id: will be added on server side
        title:title,
        description:description,
        person_tags:tags,
        remote:remote,
        tag_ids:reward_ids
      }
      Meteor.call('insertImpulse', Session.get('url'), impulseDoc);
      //alert(EJSON.stringify(impulseDoc));
      window.history.back();
    }
  });
Template.newImpulse.selectedTags = function()
{
  return Session.get('selectedTags');
}

Template.newImpulse.helpers({
  tagOptions : function()
    {
    return Tags.find({'counter.people':{$gt:0}});
    },
  tag: function(tagId)
  {
    return Tags.find({_id:tagId});
  },

  impulseTypeOptions: function()
  {
    return Tags.find({'type': 'ImpulseType'});
  },

  rewardTypeOptions: function()
  {
    return Tags.find({'type': 'RewardType'});
  }
})