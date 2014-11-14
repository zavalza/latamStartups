//MongoDB
Impulses = new Meteor.Collection("impulses");
Records = new Meteor.Collection('records');
Companies = new Meteor.Collection("companies");
People =  new Meteor.Collection("people");
Tags = new Meteor.Collection("tags");

//File Storage in MongoDb using FS
var imageStore = new FS.Store.GridFS("images");
Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

//Iron Router configuration, specify which templates are loaded under which path
//It is better to use the global Iron Router configuration to specify a notFoundTemplate, a layoutTemplate and the loadingTemplate rather than doing this in a route itself:

Router.configure({
  //layoutTemplate: 'layout',
  //notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  trackPageView: true
});

Router.onBeforeAction('loading');

Router.map(function() {
  this.route('welcome', {path: '/welcome'});
  this.route('loginForm', {path: '/entrar'});
  this.route('newUserForm', {path: '/registro'});
  this.route('newImpulse',{path:'/nuevoImpulso',
      waitOn: function() 
  { 
    Session.set('selectedTags',[]);
    return Meteor.subscribe('allTags')},
  });
  this.route('editImpulse',{path:'/editarImpulso/:_id',
      waitOn: function() 
  { 
    Session.set('currentImpulse',this.params._id);
    return Meteor.subscribe('allTags')},
  });
  this.route('news', {path: '/noticias'});
  this.route('firstLogin', {path: '/bienvenido'});
  this.route('companies', {path: '/organizaciones',
    waitOn: function() 
  { 
    Session.set('filters',[]);
    return Meteor.subscribe('allCompanies')},
  });
  this.route('impulses', {path: '/colabora',
    waitOn: function() 
  { 
    Session.set('filters',[]);
    return Meteor.subscribe('allImpulses')},
  });
  this.route('startups', {path: '/',
    waitOn: function() 
  { 
    Session.set('filters',[]);
    return Meteor.subscribe('allCompanies')},
  });
  this.route('people', 
  {path: '/personas',
  waitOn: function() 
  { 
    Session.set('filters',[]);
    return Meteor.subscribe('allRegistredPeople')},
  });
  this.route('editCompany', {path: '/editarCompania'});
  this.route('newCompany', {path: '/nueva'});
  this.route('editProfile', {path: '/editarPerfil'});
  this.route('profile', 
    {path: '/:url',
    waitOn: function()
    { 
      Session.set('screenshotToShow', null);
      Session.set("currentCompanyId", null);
      Session.set("url", this.params.url);
      Meteor.subscribe('allCompanies')
      return Meteor.subscribe('personUrl', this.params.url);
    },
    data: function() {
      var profile = null;
      var image = null;
     
      profile = People.findOne({
        url: this.params.url
      });
      if(profile == null)
      {
        profile = Companies.findOne({
        url: this.params.url
      });
      }

      return {
        profile: profile,
      };
    },
    onAfterAction: function() {
      var profile;
      // The SEO object is only available on the client.
      // Return if you define your routes on the server, too.
      if (!Meteor.isClient) {
        return;
      }
      profile = this.data().profile;
      var image = Images.findOne({
          _id:profile.logo
        })
      var imageUrl;
      if(image == null)
      {
        imageUrl = profile.picture; 
      }
      else
      {
        imageUrl = "http://latamstartups.org/cfs/files/images/"+image._id+"/"+image.original.name;
      }

      //alert(profile.name);
        SEO.set({
        title: profile.name + ' | LatamStartups',
        meta:{
          'description': profile.description
        },
        og: {
          'title': profile.name + ' | LatamStartups',
          'description': profile.description,
          'image': imageUrl,
          'url': "http://latamstartups.org/"+profile.url
        }
      });
    }
    });
});
