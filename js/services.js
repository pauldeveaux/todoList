/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  /////////////////
  // Task Service //
  /////////////////
  tasks: {
    // Creates a new task and attaches it to the pending task list.
    create: function (data) {
      // Task item template.
      var taskItem = ons.createElement(
        // '<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
        '<ons-list-item tappable category="' + data.category + '">' +
        '<label class="left">' +
        '<ons-checkbox></ons-checkbox>' +
        '</label>' +
        '<div class="center">' +
        data.title +
        '</div>' +
        '<div class="right">' +
        '<div class="date"></div>' +
        '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
        '</div>' +
        '</ons-list-item>'
      );

      // Store data within the element.
      taskItem.data = data;

      // dates
      if(!(isNaN(data.dateLimite[0]) || isNaN(data.dateLimite[1]) || isNaN(data.dateLimite[2]))){
        taskItem.querySelector(".date").innerHTML = data.dateLimite[0] + "/" + data.dateLimite[1] + "/" + data.dateLimite[2];
      }


      // Highlight
      if(taskItem.data.highlight) taskItem.classList.add("highlight")


      // Récupération des elements
      let checkbox = taskItem.children[1].children[0]
      let poubelleIcon = taskItem.children[3].children[0];



      /* --------------------- Interactions utilisateurs ---------------------- */
      // Checkbox change
      checkbox.onchange = function (){
        let taskList = taskItem.parentNode;
        let newTaskList;
        if(taskList.id === "pending-list") newTaskList = document.querySelector('#inProgress-list');
        else newTaskList = document.querySelector('#pending-list');
        myApp.services.animator.swipeTask(taskItem, taskList,function (){
          newTaskList.insertBefore(taskItem, taskItem.data.urgent ? newTaskList.firstChild : null);
        });
        myApp.services.save();
      }

      // Clic sur la poubelle
      poubelleIcon.onclick = function (){
        myApp.services.fixtures.splice(myApp.services.fixtures.indexOf(taskItem.data),1)
        myApp.services.animator.deleteTask(taskItem, function (){taskItem.parentNode.removeChild(taskItem);})
        myApp.services.save();
      }


      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      let list;
      if(data.state === 'enAttente'){
        list = document.querySelector('#pending-list');
      }
      else if(data.state === 'enCours'){
        list = document.querySelector('#inProgress-list');
      }
      list.insertBefore(taskItem, taskItem.data.urgent ? list.firstChild : null);
      
      taskItem.querySelector('.center').onclick = function(){
        document.querySelector('#myNavigator').pushPage('html/details_task.html',
        {
          data : {
            element: taskItem
          }
        }
        
        );
      };
      
      myApp.services.save();
    },


    update: function(taskItem, data) {
      if (data.title !== taskItem.data.title) {
        taskItem.querySelector('.center').innerHTML = data.title;
      }
      taskItem.data = data;
      myApp.services.save();

    },


    deleteAll : function () {
      document.querySelectorAll("ons-list-item").forEach(taskItem => {
        myApp.services.animator.deleteTask(taskItem, function (){taskItem.parentNode.removeChild(taskItem);})
      })
      myApp.services.fixtures = []
      localStorage.clear();
    },
  },

  ////////////////////////
  // Initial Data Service //
  ////////////////////////
  fixtures: [],


  /*-------------------ANIMATOR--------------------*/

  animator : {
    swipeTask : function(taskItem, list, callback){
      let animation = (list.id === 'pending-list') ? 'animation-swipe-right' : 'animation-swipe-left';
      taskItem.classList.add(animation);
      setTimeout(function (){
        taskItem.classList.remove(animation);
        callback();
      }, 950);
    },

    deleteTask : function (taskItem, callback){
      taskItem.classList.add("animation-remove");
      setTimeout(function (){
        callback();
      }, 750)
    }
  },

  save : function () {
    // TODO regarder pourquoi le tableau pour les dates ne va pas dans le local storage
    let storageData = JSON.stringify(myApp.services.fixtures)
    localStorage.setItem("tasks", storageData)
  },

  load : function () {
    this.fixtures = JSON.parse(localStorage.getItem("tasks"))
    this.fixtures.forEach(task => myApp.services.tasks.create(task))

  }

};

