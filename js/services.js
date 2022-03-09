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
      }

      // Clic sur la poubelle
      poubelleIcon.onclick = function (){
        myApp.services.animator.deleteTask(taskItem, function (){taskItem.parentNode.removeChild(taskItem);})
      }




      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      let pendingList = document.querySelector('#pending-list');
      pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
    },
  },

  ////////////////////////
  // Initial Data Service //
  ////////////////////////
  fixtures: [
    {
      title: 'Ajouter la fonctionnalité pour créer des taches',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Install Monaca CLI',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Star Onsen UI repo on Github',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Register in the community forum',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Send donations to Fran and Andreas',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Profit',
      category: '',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Visit Japan',
      category: 'Travels',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Enjoy an Onsen with Onsen UI team',
      category: 'Personal',
      description: 'Some description.',
      highlight: false,
      urgent: false
    }
  ],


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
  }

};

/**
 * Notification succès
 */
var addTask = function() {
  var jeveux = document.getElementById('jeveux').value;
  var categorie = document.getElementById('categorie').value;
  var description = document.getElementById('description').value;

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
    urgent: boolUrgent
  }


  myApp.services.fixtures.push(task);

  myApp.services.tasks.create(task);

};

