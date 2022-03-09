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

      // Checkbox change
      taskItem.onchange = function (){
        myApp.services.animator.swipeTask(taskItem);
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
    swipeTask : function(taskItem){
      if(taskItem.parentNode.id === "pending-list") {
        let inProgressList = document.querySelector('#inProgress-list');
        taskItem.classList.add("animation-swipe-right");
        setTimeout(function (){
          inProgressList.insertBefore(taskItem, taskItem.data.urgent ? inProgressList.firstChild : null);
          taskItem.classList.remove("animation-swipe-right")
        }, 950)
      }
      else{
        let pendingList = document.querySelector('#pending-list');
        taskItem.classList.add("animation-swipe-left");
        setTimeout(function (){
          pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
          taskItem.classList.remove("animation-swipe-left")
        }, 950)
      }
    }
  }

};


