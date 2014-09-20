   Accounts.onCreateUser(function(options, user){
    var firstName, lastName, fbLink, email;
    if(user.services.facebook)
    {
      console.log(user.services.facebook);
      name = user.services.facebook.first_name+" "+user.services.facebook.last_name;
      email = user.services.facebook.email;
      fbLink = user.services.facebook.link;
      fbPicture = "http://graph.facebook.com/v2.0/" + user.services.facebook.id + "/picture/?width=100&height=100"; //graph request for picture
      var profile ={
                      url:null,
                      name:name,
                      email:email,
                      picture:fbPicture, //url of picture
                      facebook_url:fbLink,
                      tag_ids:[],
                      portafolio_urls:[],
                      experience:[], //current and past jobs with title, started, ended and id of the company
                    }
   
    }
    /*if(user.services.twitter)
    {
      console.log(user.services.twitter);
    }*/
    if(user.services.linkedin)
    {
      console.log(user.services.linkedin);
      name = user.services.linkedin.firstName+" "+user.services.linkedin.lastName;
      email = user.services.linkedin.emailAddress;
      linkedinLink = user.services.linkedin.publicProfileUrl;
      linkedinPicture = user.services.linkedin.pictureUrl;
      var profile ={
                      url:null,
                      name:name,
                      email:email,
                      picture:linkedinPicture, //url of picture
                      linkedin_url:linkedinLink,
                      tag_ids:[],
                      portafolio_urls:[],
                      experience:[], //current and past jobs with title, started, ended and id of the company
                    }
    }
    /*else{
      console.log("Error");
    }*/
    user.profile = profile;
    return user;
  });