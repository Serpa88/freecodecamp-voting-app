'use strict';

(function() {

   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var profileRepos = document.querySelector('#profile-repos') || null;
   var displayName = document.querySelector('#display-name');
   var loginButton = document.querySelector('#logout');
   var deleteButton = document.querySelector('#delete') || null;
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement(data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
      if (data) {
         var userObject = JSON.parse(data).github;
         loginButton.innerHTML = "Logout";
         loginButton.href = "/logout";
         
         if(deleteButton) {
            deleteButton.href = location.pathname + '/delete';
         }
         
         if (userObject.displayName !== null) {
            updateHtmlElement(userObject, displayName, 'displayName');
         }
         else {
            updateHtmlElement(userObject, displayName, 'username');
         }

         if (profileId !== null) {
            updateHtmlElement(userObject, profileId, 'id');
         }

         if (profileUsername !== null) {
            updateHtmlElement(userObject, profileUsername, 'username');
         }

         if (profileRepos !== null) {
            updateHtmlElement(userObject, profileRepos, 'publicRepos');
         }
      }
   }));
})();
