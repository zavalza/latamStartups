Meteor.startup(function () {
//Redirect www to ROOT URL in meteor
if(window.location.hostname.search('www') != -1)
  window.location.assign("http://latamstartups.org");
Session.set('currentCompanyId',"");
Session.set('counterValue', 0);
Session.set('userToShow',"");
Session.set('typeToShow',"");
Session.set('claimProfile', false);
Session.set('waiting', false);
Session.set('filters',[]);
Session.set('selectedTags',[]);
Session.set('keyControl',-1);
Session.set('screenshotToShow',"");
Meteor.subscribe("allCompanies");
Meteor.subscribe("allImpulses");
Meteor.subscribe("allTags");
Meteor.subscribe("allImages");
Meteor.subscribe("userData");
});

Deps.autorun(function () {
  Meteor.subscribe("peopleToShow", Session.get('filters'));
});

Meteor.setInterval( function(){
    var pathValues=["personas", "colabora","organizaciones"];
    var takValues=["talento", "equipo", "impulso"];
    var counter = Session.get('counterValue');
    Session.set('takValue', takValues[counter]);
    Session.set('pathValue', pathValues[counter]);
    counter +=1;
    if(counter==3)
      counter =0;
    Session.set("counterValue", counter);
    //alert(addthis_config.pubid)
 }, 4000 );

Template.profile.helpers({
	user: function()
       {
       		Meteor.subscribe('personUrl', Session.get('url'));
             return People.find({url:Session.get('url')});
        },
    company: function()
       {
       	     Meteor.call('getCompanyId',Session.get('url'), function(error, result){
       	     	if(!error)
       	     		Session.set('currentCompanyId', result)
       	     } );
             return Companies.find({url:Session.get('url')});
     	}
})
 