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
        '<ons-checkbox class="checkbox"/>' +
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



      // dates             S1
      if(!(isNaN(data.dateLimite[0]) || isNaN(data.dateLimite[1]) || isNaN(data.dateLimite[2]))){
        // S7
        let newDate = new Date( data.dateLimite[2],data.dateLimite[1]-1 ,data.dateLimite[0]);
        if(Date.parse(newDate)-Date.parse(new Date())<0) return
        taskItem.querySelector(".date").innerHTML = data.dateLimite[0] + "/" + data.dateLimite[1] + "/" + data.dateLimite[2];
      }


      // Highlight
      if(taskItem.data.highlight) taskItem.classList.add("highlight")


      // Récupération des elements
      let checkbox = taskItem.children[1].children[0]
      let poubelleIcon = taskItem.children[3].children[1];

      if(taskItem.data.state === 'enCours'){
        checkbox.checked = true;
      }
      else if(taskItem.data.state === 'enAttente'){
        checkbox.checked = false;
      }
      else{
        checkbox.style.display = "none";
      }



      /* --------------------- Interactions utilisateurs ---------------------- */
      // Checkbox change
      checkbox.onchange = function (){
        let taskList = taskItem.parentNode;
        let newTaskList;
        if(taskList.id === "pending-list"){
          newTaskList = document.querySelector('#inProgress-list');
          taskItem.data.state = 'enCours'
        }
        else{
          newTaskList = document.querySelector('#pending-list');
          taskItem.data.state = 'enAttente'
        }
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
      console.log(data.state)
      if(data.state === 'enAttente'){
        list = document.querySelector('#pending-list');
      }
      else if(data.state === 'enCours'){
        list = document.querySelector('#inProgress-list');
      }
      else{
        list = document.querySelector('#completed-list');
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
    let storageData = JSON.stringify(myApp.services.fixtures)
    localStorage.setItem("tasks", storageData)
  },

  load : function () {
    this.fixtures = JSON.parse(localStorage.getItem("tasks"))
    if(this.fixtures!=null) this.fixtures.forEach(task => myApp.services.tasks.create(task))
    else this.fixtures = []
  },
};

