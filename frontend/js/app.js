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

    ctrl.clickedRow = -1

    ctrl.persons = []

    ctrl.person = {
        firstName: '',
        lastName: '',
        year: 2000
    }

    ctrl.amount = 0
    ctrl.from = ctrl.to = null

    ctrl.new = function() {
        $http.post('/person', ctrl.person).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.modify = function() {
        let _id = ctrl.persons[ctrl.clickedRow]._id
        $http.put('/person?_id=' + _id, ctrl.person).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.delete = function(_id) {
        $http.delete('/person?_id=' + _id).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.copy = function(n) {
        ctrl.person.firstName = ctrl.persons[n].firstName
        ctrl.person.lastName = ctrl.persons[n].lastName
        ctrl.person.year = ctrl.persons[n].year
        ctrl.clickedRow = n
    }

    ctrl.deposit_on_all = function() {
        $http.post('/balance', { amount: ctrl.amount }).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.transfer = function() {
        $http.put('/balance', { from: ctrl.from, to: ctrl.to, amount: ctrl.amount }).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.isTransferAvailable = function() {
        if(!ctrl.persons || ctrl.from == ctrl.to || ctrl.amount <= 0) return false
        return true
    }

    ctrl.isDepositAvailable = function() {
        return ctrl.amount > 0
    }

    ctrl.isPersonDataCorrect = function() {
        return ctrl.person.firstName && ctrl.person.lastName && ctrl.person.year >= 1500
    }

    // retrieve persons list on start
    $http.get('/person').then(function(res) {
        ctrl.persons = res.data
        ctrl.from = ctrl.to = ctrl.persons[0]._id
    }, function(err) {
        console.error(err.data)
    })
}])