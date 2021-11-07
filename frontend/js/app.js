let app = angular.module('pwa2021', [])

app.controller('Ctrl', [ '$http', function($http) {
    console.log('Ctrl started')
    let ctrl = this

    ctrl.clickedRow = -1

    ctrl.persons = []

    ctrl.person = {
        firstName: '',
        lastName: '',
        year: 2000
    }

    ctrl.amount = 0
    ctrl.from = ctrl.to = '0'

    ctrl.new = function() {
        $http.post('/person', ctrl.person).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.modify = function() {
        $http.put('/person?n=' + ctrl.clickedRow, ctrl.person).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.delete = function(n) {
        $http.delete('/person?n=' + n).then(function(res) {
            ctrl.persons = res.data
            if(ctrl.clickedRow == n) ctrl.clickedRow = -1
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

    // retrieve persons list on start
    $http.get('/person').then(function(res) {
        ctrl.persons = res.data
    }, function(err) {
        console.error(err.data)
    })
}])