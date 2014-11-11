Template.newCompany.events({

 'change #logo' : function(evt, tmpl) {
    var error = false;
    FS.Utility.eachFile(evt, function(file) {
      im = Images.insert(file, function (err, fileObj) {
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if(err){
          error = true;
        }
      });
      if(!error)
      {

        //alert(EJSON.stringify(im));
       Session.set('logo', im._id);
        //var encontrada = Images.findOne({_id : im._id});
        //alert(encontrada._id)
      }   
    });
  },

'click .deleteLogo': function(evt, tmpl){
  //alert(this._id)

  Meteor.call('deleteCompanyLogo', Session.get('url'), this._id);
},

'click .cancel':function(evt, tmpl)
    {
      window.history.back();
    },
    'click .save': function(evt, tmpl)
    {
      //alert('salvar');
      var name= tmpl.find('#name').value;
      var highConcept = tmpl.find('#highConcept').value;
      var website = tmpl.find('#company_url').value;
      var logo = Session.get('logo');
      
      
     
      if(name.length==0 || highConcept.length == 0 || website.length ==0)
      {
        alert ('Por favor llena todos los campos');
        return false;
      }
     var newStartup={
                      types: ["Startup"], //startup, incubator, accelerator, cowork etc.
                      name:name,
                      url:null,
                      logo:logo, //id of logo image
                      description:"",
                      highConcept:highConcept,
                      company_url:website,
                      fb_url:"",
                      twitter_url:"",
                      tag_ids:[],
                      video_url:"",
                      screenshots:[],
                      team:[],
                      followers:{count:0, user_ids:[]},
                      referrer: document.referrer, 
                      timestamp: new Date(),
                      isPublic:false
                    };

      Session.set('logo', null);
      Meteor.call('addNewCompany', newStartup);
      //go to new idea profile
      //alert(EJSON.stringify(impulseDoc));
      window.history.back();
    }

  });


    Template.newCompany.helpers ({
       
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
    });

Template.newCompany.logo =function()
{
  return Session.get('logo');
}