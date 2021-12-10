let app = angular.module('pwa2021', [ 'ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap' ])

// router menu
app.constant('routes', [
	{ route: '/', templateUrl: 'homeView.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
	{ route: '/persons', templateUrl: 'personsView.html', controller: 'PersonsCtrl', controllerAs: 'ctrl', menu: 'Persons' },
    { route: '/transfers', templateUrl: 'transfersView.html', controller: 'TransfersCtrl', controllerAs: 'ctrl', menu: 'Transfers' },
    { route: '/history', templateUrl: 'historyView.html', controller: 'HistoryCtrl', controllerAs: 'ctrl', menu: 'History' }
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

}])

app.controller('Ctrl', [ '$http', '$location', '$scope', 'routes', 'lib', function($http, $location, $scope, routes, lib) {
    console.log('Ctrl started')
    let ctrl = this

    ctrl.lib = lib

    // authorization helpers

    ctrl.creds = { login: '', password: '' }
    ctrl.login = null

    $http.get('/auth').then(
        function(res) { ctrl.login = res.data.login },
        function(err) {}
    )

    ctrl.doLogin = function() {
        $http.post('/auth', ctrl.creds).then(
            function(res) {
                ctrl.login = res.data.login
                lib.alertShow('Welcome on board, ' + ctrl.login)
            },
            function(err) { lib.alertShow(err.data.message, 'danger') }
        )    
    }

    ctrl.doLogout = function() {
        $http.delete('/auth').then(
            function(res) {
                ctrl.login = null
                lib.alertShow('You are logged out')
            },
            function(err) {}
        )    
    }

    // menu building

   ctrl.menu = []

   let rebuildMenu = function() {
       for(var i in routes) {
           ctrl.menu.push({ route: routes[i].route, title: routes[i].menu })
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

   rebuildMenu()
 
}])