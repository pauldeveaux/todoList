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



        if(jeveux==""){
          ons.notification.toast('Veuillez donner un nom à la tâche', {
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
            state: 'enAttente',
            dateLimite : []
          }

          let date = document.querySelector("#datePicker")
          if(date.value != null) {
            let d = date.value.split("-")
            let newDate = new Date( d[0], d[1] , d[2]);
            task.dateLimite[0] = leading0(newDate.getDate(),2)
            task.dateLimite[1] = leading0(newDate.getMonth(),2)
            task.dateLimite[2] = newDate.getFullYear().toString()

          }

          myApp.services.fixtures.push(task);
          myApp.services.tasks.create(task);
          document.querySelector('#myNavigator').popPage();
        }

      };
    });
  },

  detailsTaskPage : function(page){

    var element = page.data.element;

    // Fill the view with the stored data.
    page.querySelector('#jeveux').value = element.data.title;
    page.querySelector('#categorie').value = element.data.category;
    page.querySelector('#description').value = element.data.description;

    page.querySelector('[component="button/save-task"]').onclick = function(){
      ons.notification.confirm('Confirmer les modifications').then(function(ok){
        if(ok===1){
          myApp.services.tasks.update(element,
            {
              title: page.querySelector('#jeveux').value,
              category: page.querySelector('#categorie').value,
              description: page.querySelector('#description').value,

            }
          );
          document.querySelector('#myNavigator').popPage();

        }
      })
    }


  }
};



function leading0(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

