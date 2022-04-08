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



    update: function(taskItem, data) {
      if (data.title !== taskItem.data.title) {
        // Update title view.
        taskItem.querySelector('.center').innerHTML = data.title;
      }
      if (data.category !== taskItem.data.category) {
        // Modify the item before updating categories.
        taskItem.setAttribute('category', myApp.services.categories.parseId(data.category));
        // Check if it's necessary to create new categories.
        myApp.services.categories.updateAdd(data.category);
        // Check if it's necessary to remove empty categories.
        myApp.services.categories.updateRemove(taskItem.data.category);

      }
      // Add or remove the highlight.
      taskItem.classList[data.highlight ? 'add' : 'remove']('highlight');
      // Store the new data within the element.
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
  // CATEGORIES//
  ////////////////////////

  categories: {

    create: function(categoryLabel) {
      var categoryId = myApp.services.categories.parseId(categoryLabel);

      // Category item template.
      var categoryItem = ons.createElement(
        '<ons-list-item tappable category-id="' + categoryId + '">' +
          '<div class="left">' +
            '<ons-radio name="categoryGroup" input-id="radio-'  + categoryId + '"></ons-radio>' +
          '</div>' +
          '<label class="center" for="radio-' + categoryId + '">' +
            (categoryLabel || 'No category') +
          '</label>' +
        '</ons-list-item>'
      );

      // Adds filtering functionality to this category item.
      myApp.services.categories.bindOnCheckboxChange(categoryItem);

      // Attach the new category to the corresponding list.
      document.querySelector('#custom-category-list').appendChild(categoryItem);
    },
    
        // On task creation/update, updates the category list adding new categories if needed.
    updateAdd: function(categoryLabel) {
      var categoryId = myApp.services.categories.parseId(categoryLabel);
      var categoryItem = document.querySelector('#menuPage ons-list-item[category-id="' + categoryId + '"]');

      if (!categoryItem) {
        // If the category doesn't exist already, create it.
        myApp.services.categories.create(categoryLabel);
      }
    },
    // On task deletion/update, updates the category list removing categories without tasks if needed.
    updateRemove: function(categoryLabel) {
      var categoryId = myApp.services.categories.parseId(categoryLabel);
      var categoryItem = document.querySelector('#tabbarPage ons-list-item[category="' + categoryId + '"]');

      if (!categoryItem) {
        // If there are no tasks under this category, remove it.
        myApp.services.categories.remove(document.querySelector('#custom-category-list ons-list-item[category-id="' + categoryId + '"]'));
      }
    },
    
    // Deletes a category item and its listeners.
    remove: function(categoryItem) {
      if (categoryItem) {
        // Remove listeners and the item itself.
        categoryItem.removeEventListener('change', categoryItem.updateCategoryView);
        categoryItem.remove();
      }
    },

    // Adds filtering functionality to a category item.
    bindOnCheckboxChange: function(categoryItem) {
      var categoryId = categoryItem.getAttribute('category-id');
      var allItems = categoryId === null;

      categoryItem.updateCategoryView = function() {
        var query = '[category="' + (categoryId || '') + '"]';

        var taskItems = document.querySelectorAll('#tabbarPage ons-list-item');
        for (var i = 0; i < taskItems.length; i++) {
          taskItems[i].style.display = (allItems || taskItems[i].getAttribute('category') === categoryId) ? '' : 'none';
        }
      };

      categoryItem.addEventListener('change', categoryItem.updateCategoryView);
    },

    // Transforms a category name into a valid id.
    parseId: function(categoryLabel) {
      return categoryLabel ? categoryLabel.replace(/\s\s+/g, ' ').toLowerCase() : '';
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

