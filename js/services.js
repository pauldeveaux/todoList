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
      const taskItem = ons.createElement(
        //'<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
        '<ons-list-item tappable category="' + data.category + '">' +
        '<label class="left">' +
        '<ons-checkbox></ons-checkbox>' +
        '</label>' +
        '<div class="center">' +
        data.title +
        '</div>' +
        '<div class="right">' +
        '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
        '</div>' +
        '</ons-list-item>'
      );

      // Store data within the element.
      taskItem.data = data;

      // Highlight
      if(taskItem.data.highlight) taskItem.classList.add("highlight")


      // Récupération des elements
      let checkbox = taskItem.children[1].children[0]
      let poubelleIcon = taskItem.children[3].children[0];
      var detailLigne = taskItem.children[2];
      detailLigne.addEventListener("click", function(){
        // document.querySelector('#myNavigator').pushPage('html/details_task.html');
        let titre = myApp.services.fixtures[myApp.services.fixtures.indexOf(taskItem.data)]['title']
      })

      /* --------------------- Interactions utilisateurs ---------------------- */
      // Checkbox change
      checkbox.onchange = function (){
        let taskList = taskItem.parentNode;
        let newTaskList;
        if(taskList.id === "pending-list") {
          newTaskList = document.querySelector('#inProgress-list');
          taskItem.data['state'] = 'enCours'
        }
        else  {
          newTaskList = document.querySelector('#pending-list')
          taskItem.data['state'] = 'enAttente'
        };
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
      else if(data.state==='enCours'){
        checkbox.checked = true;
        list = document.querySelector('#inProgress-list');
      }
      else{
        console.log('erreur');
      }
      list.insertBefore(taskItem, taskItem.data.urgent ? list.firstChild : null);
      myApp.services.save();
    },

    deleteAll : function () {
      document.querySelectorAll("ons-list-item").forEach(taskItem => {
        myApp.services.animator.deleteTask(taskItem, function (){taskItem.parentNode.removeChild(taskItem);})
      })
      myApp.services.fixtures = []
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

  // Question P1

  save : function () {
    let storageData = JSON.stringify(myApp.services.fixtures)
    localStorage.setItem("tasks", storageData)
  },

  load : function () {
    let temp = JSON.parse(localStorage.getItem("tasks"))
    if(temp == null) this.fixtures = []
    else this.fixtures = temp
    this.fixtures.forEach(task => myApp.services.tasks.create(task))
  }

};
