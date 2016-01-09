// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('frackr', ['ionic'])

/**
  The Workout factory handles saving and loading workouts from local storage, and also lets us save and load the last active workout index.
**/

.factory('Workouts', function() {
  return {
    all: function() {
      var workoutString = window.localStorage['workouts'];
      if(workoutString) {
        return angular.fromJson(workoutString);
      }
      return [];
    },
    save: function(workouts) {
      window.localStorage['workouts'] = angular.toJson(workouts);
    },
    newWorkout: function(workoutTitle) {
      // Add a new workout
      return {
        title: workoutTitle,
        exercises: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveWorkout']) || 0; 
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveWorkout'] == index;
    }
  }
})

.controller('FrackrCtrl',function($scope, $timeout, $ionicModal, Workouts, $ionicSideMenuDelegate) {
  
  // A utility function for creating a new workout with the given workoutTitle
  var createWorkout = function(workoutTitle) {  
    var newWorkout= Workouts.newWorkout(workoutTitle);
    $scope.workouts.push(newWorkout);
    Workouts.save($scope.workouts);
    $scope.selectWorkout(newWorkout, $scope.workouts.length-1);
  }

  // Load or initialize workouts
  $scope.workouts = Workouts.all();

  // Grab the last active, or the first project
  $scope.activeWorkout = $scope.workouts[Workouts.getLastActiveIndex()];

  //Called to create a new workout
  $scope.newWorkout = function() {
    var workoutTitle = prompt ('Workout name');
    if(workoutTitle) {
      createWorkout(workoutTitle);
    }
  };

  //Called to select the given workout
  $scope.selectWorkout = function(workout, index) {
    $scope.activeWorkout = workout;
    Workouts.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false); 
  };

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-exercise.html', function(modal) {
    $scope.exerciseModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.createExercise = function(exercise) {
    if(!$scope.activeWorkout || !exercise) {
      return;
    }
    
    $scope.activeWorkout.exercises.push({
      title: exercise.title
    });
    $scope.exerciseModal.hide();

    //inefficient, but save all the workouts 
    Workouts.save($scope.workouts);

    exercise.title = "";
  };

  $scope.newExercise = function() {
    $scope.exerciseModal.show();
  };
  $scope.closeNewExercise= function() {
    $scope.exerciseModal.hide();
  }

  $scope.toggleWorkouts = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.workouts.length == 0) {
      while(true) {
        var workoutTitle = prompt('Your first workout title: ');
        if(workoutTitle) {
          createWorkout(workoutTitle);
          break;
        }
      }
    }
  });

})
  
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
