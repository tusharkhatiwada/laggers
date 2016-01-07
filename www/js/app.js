// Ionic Starter App
var firebaseUrl = "https://laggers.firebaseio.com/";
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('laggers', ['ionic', 'firebase'])

.run(function($ionicPlatform, $rootscope, $location, Auth, $ionicLoading) {
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
    ionic.Platform.fullScreen();

    $rootscope.firebaseUrl = firebaseUrl;
    $rootscope.displayName = null;

    Auth.$onAuth(function (authData){
      if(authData){
        console.log ("Logged in as:", authData.uid);
      }else{
        console.log("Logged Out");
        $ionicLoading.hide();
        $location.path('/login');
      }
    });
    $rootscope.logout = function() {
      console.log("Logging out from the app");
      $ionicLoading.show({
        template: 'Logging Out...'
      });
      Auth.$unauth();
    }
    $rootscope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
      if(error === "AUTH_REQUIRED"){
        $location.path('/login');
      }
    });
  });
}).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "LoginCtrl",
    resolve: {
      "currentAuth": ["Auth",
        function(Auth){
          return Auth.$waitForAuth();
        }
      ]
    }
  })

  $urlRouterProvider.otherwise('/');

});
