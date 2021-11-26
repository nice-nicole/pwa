let app = angular.module('pwa2021', [ 'ngRoute', 'ngSanitize' ])

// router menu
app.constant('routes', [
	{ route: '/', templateUrl: 'homeView.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
	{ route: '/persons', templateUrl: 'personsView.html', controller: 'PersonsCtrl', controllerAs: 'ctrl', menu: 'Persons' },
    { route: '/transfers', templateUrl: 'transfersView.html', controller: 'TransfersCtrl', controllerAs: 'ctrl', menu: 'Transfers' }
])

// router installation
app.config(['$routeProvider', '$locationProvider', 'routes', function($routeProvider, $locationProvider, routes) {
    $locationProvider.hashPrefix('')
	for(var i in routes) {
		$routeProvider.when(routes[i].route, routes[i])
	}
	$routeProvider.otherwise({ redirectTo: '/' })
}])

app.controller('Ctrl', [ '$http', '$location', '$scope', 'routes', function($http, $location, $scope, routes) {
    console.log('Ctrl started')
    let ctrl = this

    // menu building

   ctrl.menu = []

   let rebuildMenu = function() {
       for(var i in routes) {
           ctrl.menu.push({ route: routes[i].route, title: routes[i].menu })
       }
       $location.path('/')
   }

   // kontrola nad menu zwiniętym i rozwiniętym
   ctrl.isCollapsed = true
   $scope.$on('$routeChangeSuccess', function () {
       ctrl.isCollapsed = true
   })
   
   // sprawdzenie która pozycja menu jest wybrana
   ctrl.navClass = function(page) {
       return page === $location.path() ? 'active' : ''
   }    

   rebuildMenu()

   // end of menu preparation


 
}])