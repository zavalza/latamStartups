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
          'description': 'LatamStartups tiene la información más actualizada sobre startups de Latinoamérica. Déscubrelas.'
        },
         og:{
          'image':'http://latamstartups.org/latam.png',
        },
        auto: {
          twitter: true,
          og: true,
          set: ['description', 'url', 'title']
        },
       
      }); 
//Run this code just one time, then comment. Otherwise we will have many seo documents
SeoCollection.insert(
    {
            route_name: 'startups',
            title: 'LatamStartups | Startups en Latinoamérica',
            meta: {
                'description': 'Estos son los proyectos más innovadores que hemos encontrado en Latinoamérica.'
            },

            og: {
                'title': 'LatamStartups | Startups en Latinoamérica',
                'description': 'Estos son los proyectos más innovadores que hemos encontrado en Latinoamérica. Conócelos.',
                'image':'http://latamstartups.org/latam.png',
                'url':'http://latamstartups.org/startups'
            }
    }
);

SeoCollection.insert(
    {
            route_name: 'people',
            title: 'LatamStartups | Comunidad startupera en Latinoamérica',
            meta: {
                'description': 'Estas son las personas trabajando en construir la siguiente gran startup en Latinoamérica. Contáctalas.'
            },
            og: {
                'title': 'LatamStartups | Comunidad startupera en Latinoamérica',
                'description': 'Estas son las personas trabajando en construir la siguiente gran startup en Latinoamérica. Contáctalas.',
                'image':'http://latamstartups.org/latam.png',
                'url':'http://latamstartups.org/personas'
            }
    }
);

SeoCollection.insert(
    {
            route_name: 'companies',
            title: 'LatamStartups | Organizaciones que apoyan startups en Latinoamérica',
            meta: { 
                'description': 'Estas son las organizaciones que te pueden apoyar si tienes una Startup en Latinoamérica. Conócelas.'
            },
            og: {
                'title': 'LatamStartups |  Organizaciones que apoyan startups en Latinoamérica',
                'description': 'Estas son las organizaciones que te pueden apoyar si tienes una Startup en Latinoamérica. Conócelas.',
                'image':'http://latamstartups.org/latam.png',
                'url':'http://latamstartups.org/organizaciones'
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
 