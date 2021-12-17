let app = angular.module('pwa2021', [ 'ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap' ])

// router menu
app.constant('routes', [
	{ route: '/', templateUrl: 'homeView.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
	{ route: '/persons', templateUrl: 'personsView.html', controller: 'PersonsCtrl', controllerAs: 'ctrl', menu: 'Persons', roles: ['admin', 'user'] },
    { route: '/transfers', templateUrl: 'transfersView.html', controller: 'TransfersCtrl', controllerAs: 'ctrl', menu: 'Transfers', roles: ['admin', 'user'] },
    { route: '/history', templateUrl: 'historyView.html', controller: 'HistoryCtrl', controllerAs: 'ctrl', menu: 'History', roles: ['admin'] }
])

// router installation
app.config(['$routeProvider', '$locationProvider', 'routes', function($routeProvider, $locationProvider, routes) {
    $locationProvider.hashPrefix('')
	for(var i in routes) {
		$routeProvider.when(routes[i].route, routes[i])
	}
	$routeProvider.otherwise({ redirectTo: '/' })
}])

// common components

app.service('lib', [ function() {
    let lib = this

    let alert = { text: '', type: 'alert-success' }

    lib.alertText = function() { return alert.text }
    lib.alertType = function() { return alert.type }
    lib.alertClose = function() { alert.text = '' }
    lib.alertShow = function(text, type = 'success') {
        alert.text = text
        alert.type = 'alert-' + type
        console.log(alert.type + ':', alert.text)
    }

    lib.login = null
    lib.role = null
}])

app.controller('Ctrl', [ '$http', '$location', '$scope', 'routes', 'lib', function($http, $location, $scope, routes, lib) {
    console.log('Ctrl started')
    let ctrl = this

    ctrl.lib = lib

    // authorization helpers

    ctrl.creds = { login: '', password: '' }

    ctrl.doLogin = function() {
        $http.post('/auth', ctrl.creds).then(
            function(res) {
                lib.login = res.data.login
                lib.role = res.data.role
                lib.alertShow('Welcome on board, ' + ctrl.login)
                rebuildMenu()
            },
            function(err) { lib.alertShow(err.data.message, 'danger') }
        )    
    }

    ctrl.doLogout = function() {
        $http.delete('/auth').then(
            function(res) {
                lib.login = null
                lib.role = null
                lib.alertShow('You are logged out')
                rebuildMenu()
            },
            function(err) {}
        )    
    }

    // menu building

   ctrl.menu = []

   let rebuildMenu = function() {
       ctrl.menu.length = 0
       for(var i in routes) {
           if(!routes[i].roles || routes[i].roles.includes(lib.role)) {
               ctrl.menu.push({ route: routes[i].route, title: routes[i].menu })
           } 
       }
       $location.path('/')
   }

   ctrl.isCollapsed = true
   $scope.$on('$routeChangeSuccess', function () {
       ctrl.isCollapsed = true
   })
   
   ctrl.navClass = function(page) {
       return page === $location.path() ? 'active' : ''
   }    

   $http.get('/auth').then(
        function(res) {
            lib.login = res.data.login
            lib.role = res.data.role
            rebuildMenu() 
        },
        function(err) {}
   )

}])