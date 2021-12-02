app.controller('TransfersCtrl', [ '$http', function($http) {
    console.log('TransfersCtrl started')
    let ctrl = this

    ctrl.deposit_on_all = function() {
        $http.post('/transfer', { amount: ctrl.amount }).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.transfer = function() {
        $http.put('/transfer', { from: ctrl.from, to: ctrl.to, amount: ctrl.amount }).then(function(res) {
            console.log('Transfer committed')
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

        // retrieve persons list on start
        $http.get('/person').then(function(res) {
            ctrl.persons = res.data
            ctrl.from = ctrl.to = ctrl.persons[0]._id
        }, function(err) {
            console.error(err.data)
        })
}])