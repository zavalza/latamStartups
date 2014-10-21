Meteor.startup(function () {
//Redirect www to ROOT URL in meteor
if(window.location.hostname.search('www') != -1)
  window.location.assign("http://latamstartups.org");
Session.set('currentCompanyId',null);
Session.set("url", null);
Session.set('counterValue', 0);
Session.set('userToShow',"");
Session.set('typeToShow',"");
Session.set('claimProfile', false);
Session.set('waiting', false);
Session.set('openNew', true);
Session.set('views',[]);
Session.set('filters',[]);
Session.set('selectedTags',[]);
Session.set('keyControl',-1);
Session.set('screenshotToShow',"");
Meteor.subscribe("allCompanies");
Meteor.subscribe("allPeople");
Meteor.subscribe("allImpulses");
Meteor.subscribe("allTags");
Meteor.subscribe("allImages");
Meteor.subscribe("userData");

SEO.config({
        title: 'LatamStartups | Conoce startups de Latinoamérica día a día',
        meta: {
          'description': 'LatamStartups es el lugar donde personas y startups se conocen día a día'
        }
      });

SeoCollection.insert(
    {
            route_name: 'startups',
            title: 'LatamStartups | Startups en Latinoamérica',
            meta: {
                'description': 'LatamStartups es el lugar donde personas y startups se conocen día a día'
            },
            og: {
                'title': 'Startups en Latinoamérica'
            }
    }
);

SeoCollection.insert(
    {
            route_name: 'people',
            title: 'LatamStartups | Comunidad startupera en Latinoamérica',
            meta: {
                'description': 'LatamStartups es el lugar donde personas y startups se conocen día a día'
            },
            og: {
                'title': 'Comunidad startupera en Latinoamérica'
            }
    }
);

SeoCollection.insert(
    {
            route_name: 'companies',
            title: 'LatamStartups | Organizaciones que apoyan startups en Latinoamérica',
            meta: {
                'description': 'LatamStartups es el lugar donde personas y startups se conocen día a día'
            },
            og: {
                'title': 'Organizaciones para startups en Latinoamérica'
            }
    }
);

});

Deps.autorun(function () {
  Meteor.subscribe("peopleToShow", Session.get('filters'));
});



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
 