let app = angular.module('pwa2021', [ 'ngRoute', 'ngSanitize', 'ngAnimate', 'ngCookies', 'ws', 'ui.bootstrap' ])

// websocket config
app.config(['wsProvider', function(wsProvider) {
    wsProvider.setUrl('ws://' + window.location.host)
}])

// router menu
app.constant('routes', [
	{ route: '/', templateUrl: 'homeView.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
	{ route: '/persons', templateUrl: 'personsView.html', controller: 'PersonsCtrl', controllerAs: 'ctrl', menu: 'Persons', roles: ['admin', 'user'] },
    { route: '/groups', templateUrl: 'groupsView.html', controller: 'GroupsCtrl', controllerAs: 'ctrl', menu: 'Groups', roles: ['admin'] },
    { route: '/transfers', templateUrl: 'transfersView.html', controller: 'TransfersCtrl', controllerAs: 'ctrl', menu: 'Transfers', roles: ['admin', 'user'] },
    { route: '/history', templateUrl: 'historyView.html', controller: 'HistoryCtrl', controllerAs: 'ctrl', menu: 'History', roles: ['admin'] },
    { route: '/chat', templateUrl: 'chatsView.html', controller: 'ChatsCtrl', controllerAs: 'ctrl', menu: 'Chats', roles: ['admin', 'user'] },
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

app.service('lib', [ '$cookies', function($cookies) {
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
    lib.session = $cookies.get('session')
}])

app.controller('Ctrl', [ '$http', '$location', '$scope', 'routes', 'lib', 'ws', function($http, $location, $scope, routes, lib, ws) {
    console.log('Ctrl started')
    let ctrl = this

    ctrl.lib = lib

    // initialize WS
    ws.send(lib.session)
    console.log('Send a session id', lib.session, ' to ws server')

    // handle ws messages from server
	ws.on('message', function(messageEvent) {
        console.log('ws message from server', messageEvent.data)
        try {
            let message = JSON.parse(messageEvent.data)
            if(message.event && message.source != lib.session) {
                let event = message.event
                delete message.event
                delete message.source
                $scope.$broadcast(event, message)
            }
        } catch(ex) {
            console.error('Broken ws message')
        }
    })

    // authorization helpers

    ctrl.creds = { login: '', password: '' }

    ctrl.doLogin = function() {
        $http.post('/auth', ctrl.creds).then(
            function(res) {
                lib.login = res.data.login
                lib.role = res.data.role
                lib.alertShow('Welcome on board, ' + lib.login)
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