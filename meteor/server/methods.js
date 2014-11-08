 Meteor.methods({

          userToPerson: function(userId){
          var userDoc = Meteor.users.findOne({_id:userId}, {'profile':1,'_id':0});
          if(userDoc.person_id)
          {
            return userDoc.person_id;
          }
          else
          {
          //console.log(userDoc);
          var emptyProfile={followers:{count:0, user_ids:[]},
                            following:{count: 0, user_ids:[], company_ids:[]}
                            };
          personId = People.insert(userDoc.profile);
          var url = Meteor.call('generateUrl', userDoc.profile.name);
          if(userDoc.services.linkedin)
          {
            var Future = Npm.require('fibers/future');

            for (var i=0; i < userDoc.services.linkedin.skills._total; i++)
            {
              var enString =userDoc.services.linkedin.skills.values[i].skill.name;
               var future = new Future();
                HTTP.get("http://api.mymemory.translated.net/get?q="+enString+"&langpair=en|es&de=paulz_91@hotmail.com",function( error, result ){
                    if(result)
                    {
                      //console.log(result);
                      future.return(result.data.responseData.translatedText);
                    }             
                });
               //formato y verificar que no sea null
               if(future.wait() != null)
              {
                var skillTag = {
                      type: "Skill",
                      name:future.wait()[0].toUpperCase()+future.wait().slice(1),
                      counter:{
                        people: 0,
                        companies: 0,
                      },
                      timestamp: new Date(),
                    }
               

                Meteor.call('saveTag', personId, skillTag);
              }
              
            }
          } 
          People.update({_id:personId}, 
            {$set:{'user_id':Meteor.userId(), 'url':url}});
          Meteor.users.update({_id:Meteor.userId()},
            {$set:{'person_id':personId,'profile':emptyProfile}});
          return personId;
          }
        },

        claimPerson: function(userId, personUrl){
          Meteor.call('userToPerson', userId); //Not so efficient way

          var userDoc = Meteor.users.findOne({_id:userId}, {'profile':1,'_id':0});
          //Do we need an empty profile?
          /*var emptyProfile={followers:{count:0, user_ids:[]},
                            following:{count: 0, user_ids:[], company_ids:[]}
          
                            };*/
          var claimedDoc = People.findOne({url:personUrl});
          var personId = claimedDoc._id; //claimed personId will be updated
         
            //get current object
          var currentDoc = People.findOne({_id: userDoc.person_id});
          
          //what happen to the names?, how do we use this or the email for verification

          console.log('Joint of user '+ userId + " with person "+personId);
          People.update({_id:personId}, 
            {$set:{'user_id':userId, 
                  'picture': currentDoc.picture, 
                  'facebook_url': currentDoc.facebook_url,
                  'linkedin_url': currentDoc.linkedin_url,
                  'email':currentDoc.email}});
          People.update({_id:personId}, 
            {$addToSet:{'tag_ids':{$each:currentDoc.tag_ids}}});
          //Experience is not mixed, just take the claimed one

           People.remove({_id:userDoc.person_id}); //Remove old person doc
          //Asign new person Id
          Meteor.users.update({_id:userId},
            {$set:{'person_id':personId}});
          return personId;

        },

        generateUrl: function(name){
            //console.log('creating a url');
            var url = name.toLowerCase().split(' ').join('-');
            var notValid = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
            var valid = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
            for (var i=0; i<notValid.length; i++) {
            url = url.replace(notValid.charAt(i), valid.charAt(i));
            }
             var existing = Companies.find({'url': url}).count()+ People.find({'url': url}).count();
            if(existing !=0)
            {
              url = url + existing.toString();
            }
            return url;
            },

      validatePersonUrl: function(personId, url){

        var newUrl = Meteor.call('generateUrl', url);
        Meteor.call('updateTextField', personId , 'url', newUrl);
      },
      addMember: function(companyUrl, typeOfExperience, name){
      console.log('requesting new url');
      var url = Meteor.call('generateUrl', name);
      var companyDoc = Companies.findOne({url:companyUrl});
      console.log("Creating a new person")
      var person={
                url: url,
                name: name,
                email: null,
                picture:"defaultPic.png", //url of picture
                facebook_url: null,
                tag_ids:[],
                portafolio_urls:[],
                experience:[{
                type:typeOfExperience,
                title:null,
                startedAt:null,
                endedAt:null,
                confirmed:false,
                company_id: companyDoc._id,
                }], 
                followers:{count:0, user_ids:[]},
                following:{count: 0, user_ids:[], company_ids:[]}
                }
      //Validar nombre no repetido?
      var personId= People.insert(person);
      console.log('Adding experience to '+ companyUrl);
      var experience = {
      type:typeOfExperience,
      title:null,
      startedAt:null,
      endedAt:null,
      confirmed:false,
      user_id: null,
      person_id: personId
      }
      Companies.update({url: companyUrl},
      {$push:{'team': experience}});
      },

      updateTextField: function(personId, field, value){
          console.log('Updating field '+ field +' of person '+personId);
          switch(field){
            case ('name'):
            People.update({_id: personId},
            {$set: {'name':value}});
            break;
            case('email'):
            People.update({_id: personId},
            {$set: {'email':value}});
            break;
            case('facebook_url'):
            People.update({_id: personId},
            {$set: {'facebook_url':value}});
            break;
            case('twitter_url'):
            People.update({_id: personId},
            {$set: {'twitter_url':value}});
            break;
             case('linkedin_url'):
            People.update({_id: personId},
            {$set: {'linkedin_url':value}});
            break;
            case('github_url'):
            People.update({_id: personId},
            {$set: {'github_url':value}});
            break;
            case('behance_url'):
            People.update({_id: personId},
            {$set: {'behance_url':value}});
            break;
            case('personal_url'):
            People.update({_id: personId},
            {$set: {'personal_url':value}});
            break;
            case('url'):
            People.update({_id: personId},
            {$set: {'url':value}});
            break;
            default: break;
          }
          
      },

      updateExperience: function(personId, companyId, field, value){
          console.log('Updating field '+ field +' of person '+personId + ' and company '+ companyId);
          switch(field){
            case ('title'):
            People.update({_id: personId,'experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'experience.$.title':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'person_id': personId}}},
             {$set: {'team.$.title':value}});
            break;
            case ('startedAt'):
            People.update({_id: personId,'experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'experience.$.startedAt':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'person_id': personId}}},
             {$set: {'team.$.startedAt':value}});
            break;
            case('endedAt'):
            People.update({_id: personId,'experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'experience.$.endedAt':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'person_id': personId}}},
             {$set: {'team.$.endedAt':value}});
            break;
            default: break;
          }
          
      },

      pushExperience: function(personId, companyId, companyDoc, personDoc){
          console.log('Pushing experience to both '+personId+' and '+companyId);
          People.update({_id: personId},
          {$push:{'experience': companyDoc}});

          Companies.update({_id: companyId},
          {$push:{'team': personDoc}});
      },

      addLink: function(personId, link){
          console.log('Adding a link to profile '+ personId);
          People.update({_id: personId},
          {$push:{'portafolio_urls': link}});
      },

      addView: function(doc){
        //console.log('view');
        var recordDoc= Records.findOne({profile_id: doc.profile_id, date: doc.date});
        if(recordDoc != null)
        {
          recordId = recordDoc._id;
          console.log('record already exist in '+recordId);
          //posible metodo para verificar cuantos views permitiremos de cada uno, hasta de null
          Records.update({_id:recordId},{$push:{views:doc.views[0]}});

        }
        else
        {
          recordId = Records.insert(doc);
          console.log('new record has id ' +recordId);
        }
        //Si hacemos otro metodo para poder habilitar personas tmb?
        Companies.update({_id:doc.profile_id},{$inc:{views:1}});
      },

      addClick: function(doc){
        //console.log('view');
        var recordDoc= Records.findOne({profile_id: doc.profile_id, date: doc.date});
        if(recordDoc != null)
        {//Por ahora todos deben caer en este caso

          recordId = recordDoc._id;
          console.log('record already exist in '+recordId);
          //posible metodo para verificar cuantos views permitiremos de cada uno, hasta de null
          Records.update({_id:recordId},{$push:{clicks:doc.clicks[0]}});

        }
        else
        {
          recordId = Records.insert(doc);
          console.log('new record has id ' +recordId);
        }
        //Si hacemos otro metodo para poder habilitar personas tmb?
        Companies.update({_id:doc.profile_id},{$inc:{clicks:1}});
      },

      deleteLink: function(personId, link){
          console.log('Deleting the link '+link +' of profile '+ personId);
          People.update({_id: personId},
          {$pull:{'portafolio_urls': link}});
      },

      addArticle: function(companyId, link){
          console.log('Adding an article to company'+ companyId);
          Companies.update({_id: companyId},
          {$push:{'article_urls': link}});
      },

      deleteArticle: function(companyId, link){
          console.log('Deleting the article '+link +' of profile '+ companyId);
          Companies.update({_id: companyId},
          {$pull:{'article_urls': link}});
      },

      addScreenshot: function(companyUrl, imageId)
      {
        console.log('Adding image '+ imageId + ' to '+companyUrl);
        Companies.update({url: companyUrl},
          {$push:{'screenshots':imageId}});
      },

      deleteScreenshot: function(companyUrl, imageId)
      {
        console.log('Deleting image '+ imageId + ' from '+companyUrl);
        Companies.update({url: companyUrl},
          {$pull:{'screenshots':imageId}});
        Images.remove({_id: imageId});
      },

      updateCompanyLogo: function(companyUrl, imageId)
      {
        //Borrar el anterior?
        console.log('New logo'+ imageId + ' in '+companyUrl);
        Companies.update({url: companyUrl},
          {$set:{'logo':imageId}});
      },

       deleteCompanyLogo: function(companyUrl, imageId)
      {
        console.log('Deleting logo '+ imageId + ' from '+companyUrl);
        Companies.update({url: companyUrl},
          {$set:{'logo':null}});
        Images.remove({_id: imageId});
      },

      addExperience: function(personId, typeOfExperience, companyDoc){
        console.log("Creating a new company")
        //Validar nombre no repetido?
        var companyId = Companies.insert(companyDoc);
        var url = Meteor.call('generateUrl', companyDoc.name);
        Companies.update({_id: companyId},{$set:{'url': url}});
        console.log('Adding experience to '+ personId);
        var experience = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    company_id: companyId
                  }
        People.update({_id: personId},
          {$push:{'experience': experience}});

      },


      deleteExperience: function(personId, companyId){
         People.update({_id: personId},
             {$pull: {'experience':{'company_id':companyId}}});
         Companies.update({_id: companyId},
             {$pull: {'team':{'person_id':personId}}});
      },

       addNewCompany: function(companyDoc){
        console.log("Creating a new company")
        //Validar nombre no repetido?
        var companyId = Companies.insert(companyDoc);
        var url = Meteor.call('generateUrl', companyDoc.name);
        Companies.update({_id: companyId},{$set:{'url': url}});
        return url
      },
      getCompanyId: function(companyUrl){
          var companyDoc = Companies.findOne({url: companyUrl});
          if(companyDoc)
            return companyDoc._id;
          else
            return null;
      },

      pushCompanyType: function(companyUrl, type){
          console.log('Pushing type '+ type +' to company ' + companyUrl);
          Companies.update({url: companyUrl},
            {$push: {'types': type}});
          var tag=Tags.findOne({name:type, type:"TypeOfCompany"});
          Meteor.call('pushCompanyTag', companyUrl, tag._id);
          return true
      },

      pullCompanyType: function(companyUrl, type){
          console.log('Pulling type '+ type +' from company ' + companyUrl);
          Companies.update({url: companyUrl},
            {$pull: {'types': type}});
          var tag=Tags.findOne({name:type, type:"TypeOfCompany"});
          Meteor.call('pullCompanyTag', companyUrl, tag._id);
          return true
      },

      updateCompanyLink: function(companyUrl, field, link){
        console.log('Updating field '+ field +' of company '+companyUrl);
          switch(field){
            case ('company_url'):
            Companies.update({url: companyUrl},
            {$set: {'company_url': link}});
            break;
            case ('fb_url'):
            Companies.update({url: companyUrl},
            {$set: {'fb_url': link}});
            break;
            case ('twitter_url'):
             Companies.update({url: companyUrl},
            {$set: {'twitter_url': link}});
            break;
            case ('video_url'):
             Companies.update({url: companyUrl},
            {$set: {'video_url': link}});
            break;
            default:
            break;
          }
      },

      updateCompanyText: function(companyUrl, field, value){
        console.log('Updating field '+ field +' of company '+companyUrl);
          switch(field){
            case ('name'):
            Companies.update({url: companyUrl},
            {$set: {'name': value}});
            break;
            case ('city'):
            Companies.update({url: companyUrl},
            {$set: {'city': value}});
            break;
            case ('highConcept'):
             Companies.update({url: companyUrl},
            {$set: {'highConcept': value}});
            break;
            case ('description'):
             Companies.update({url: companyUrl},
            {$set: {'description': value}});
            break;
            default:
            break;
          }
      },

      pushTag: function(personId, tagId){
          console.log('Pushing tag with id '+ tagId +' to person ' + personId);
          var updatedDoc = People.update({_id: personId},
            {$addToSet: {'tag_ids': tagId}});
          
          Tags.update({_id: tagId}, {$inc:{'counter.people':updatedDoc}});
          return true
      },

      pushCompanyTag: function(companyUrl, tagId){
          console.log('Pushing tag with id '+ tagId +' to company ' + companyUrl);
          var updatedDoc = Companies.update({url: companyUrl},
            {$addToSet: {'tag_ids': tagId}});
          Tags.update({_id: tagId}, {$inc:{'counter.companies':updatedDoc}});
          return true
      },
    
      pullTag: function (personId, tagId){
          console.log('Unlink tag with id '+ tagId +' from person '+ personId);
          People.update({_id: personId},
            {$pull: {'tag_ids': tagId}});
          Tags.update({_id: tagId}, {$inc:{'counter.people':-1}});
          return true
      },

      pullCompanyTag: function (companyUrl, tagId){
          console.log('Unlink tag with id '+ tagId +' from company '+ companyUrl);
          Companies.update({url: companyUrl},
            {$pull: {'tag_ids': tagId}});
          Tags.update({_id: tagId}, {$inc:{'counter.companies':-1}});
          return true
      },

    
      saveTag: function(personId, doc){
        console.log('addingTag');
        //protection method against duplication
        var tagDoc= Tags.findOne({name: doc.name, type: doc.type});
        if(tagDoc != null)
        {
          tagId = tagDoc._id;
          console.log('tag already exist in '+tagId);
        }
        else
        {
          tagId = Tags.insert(doc);
          console.log('new tag has id ' +tagId);
        }
        Meteor.call('pushTag', personId, tagId);
        return tagId;
      },

      saveCompanyTag: function(companyUrl, doc){
        console.log('addingTag');
        //protection method against duplication
        var tagDoc= Tags.findOne({name: doc.name, type: doc.type});
        if(tagDoc != null)
        {
          tagId = tagDoc._id;
          console.log('tag already exist in '+tagId);
        }
        else
        {
          tagId = Tags.insert(doc);
          console.log('new tag has id ' +tagId);
        }
        Meteor.call('pushCompanyTag', companyUrl, tagId);
        return tagId;
      },

      insertImpulse: function (companyUrl, impulseDoc)
      {
        console.log('creating new Impulse on '+companyUrl);
        companyDoc = Companies.findOne({url: companyUrl});
        impulseDoc.company_id = companyDoc._id;
        //console.log(impulseDoc);
        impulseId = Impulses.insert(impulseDoc);
        for( var i = 0; i < impulseDoc.tag_ids.length; i++)
        {
          //Need to know how to insert relation with tags
          //Meteor.call('pushCompanyTag', companyUrl, impulseDoc.tag_ids[i]);
        }
        Companies.update({url:companyUrl},{$addToSet:{impulse_ids:impulseId}});
            
      },

      giveInterest: function(impulseId, userId)
      {
        console.log('interest from '+userId+' to '+impulseId)
        Impulses.update({_id: impulseId},{$addToSet:{'people':userId}});
      },

      saveImpulse: function (impulseDoc)
      {
       
        
        //console.log(impulseDoc);
         Impulses.update({_id:impulseDoc._id}, impulseDoc);
        for( var i = 0; i < impulseDoc.tag_ids.length; i++)
        {
          /*Falta cambiar los tags que se quitaron al editar*/
          //Meteor.call('pushCompanyTag', companyUrl, impulseDoc.tag_ids[i]);
        }
            
      },

      deleteImpulse: function(companyUrl, impulseId)
      {
        console.log('delete Impulse '+impulseId+ ' from '+companyUrl);
        Companies.update({url:companyUrl},{$pull:{impulse_ids:impulseId}});
        Impulses.remove({_id: impulseId});
      },

      getImpulseDoc: function(impulseId)
      {
        impulseDoc = Impulses.findOne({_id:impulseId});
        //console.log(impulseDoc.person_tags);
        return impulseDoc;
      }
      
    });