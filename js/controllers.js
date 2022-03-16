/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Tabbar Page Controller //
  //////////////////////////
  tabbarPage: function(page) {
    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function() {
      document.querySelector('#mySplitter').left.toggle();
    };

    // Set button functionality to push 'new_task.html' page.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/new_task.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });

    // Set button functionality to delete all tasks
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/delete-tasks"]'), function(element) {
      element.onclick = function() {
        myApp.services.tasks.deleteAll();
      };
      element.show && element.show(); // Fix ons-fab in Safari.
    });

  },

  newTaskPage: function(page){
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element){
      element.onclick = function() {


        var jeveux = document.getElementById('jeveux').value;
        var categorie = document.getElementById('categorie').value;
        var description = document.getElementById('description').value;

        if(jeveux==="" || categorie ==="" || description === ""){
          ons.notification.toast('Complétez le formualire merci !', {
            timeout: 2000
          });
        }
        else{
          var surligner = document.getElementById('switch1');
          let boolSurligner = false;
          if(surligner.checked){
            boolSurligner = true;
          }

          var urgent = document.getElementById('switch2');
          let boolUrgent = false;
          if(urgent.checked){
            boolUrgent = true;
          }

          ons.notification.toast('Enregistré!', {
            timeout: 2000
          });

          let task = {
            title: jeveux,
            category: categorie,
            description: description,
            highlight: boolSurligner,
            urgent: boolUrgent,
            state: 'enAttente'
          }
          myApp.services.fixtures.push(task);
          myApp.services.tasks.create(task);
          document.querySelector('#myNavigator').popPage();
        }

      };
    });
  },

  detailTaskPage : function(page){
    console.log(myApp.services.tasks.create().detailLigne)

    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element){
      element.onclick = function() {
       

      };
    });
  }
};


console.log(myApp.services)





/**formulaire */
