let app = angular.module('pwa2021', [])

app.controller('Ctrl', [ '$http', function($http) {
    console.log('Ctrl started')
    let ctrl = this

    ctrl.person = {
        firstName: '',
        lastName: '',
        year: 2000
    }

    ctrl.send = function() {
        // console.log(ctrl.person)
        $http.post('/data', ctrl.person).then(function(res) {
            console.log(res.data)
        }, function(err) {
            console.error(err.data)
        })
    }
}])