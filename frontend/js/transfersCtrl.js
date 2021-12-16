app.controller('TransfersCtrl', [ '$http', 'lib', function($http, lib) {
    console.log('TransfersCtrl started')
    let ctrl = this

    ctrl.deposit_on_all = function() {
        $http.post('/transfer', { amount: ctrl.amount }).then(function(res) {
            lib.alertShow('Deposit (' + ctrl.amount + ') committed')
        }, function(err) {
            lib.alertShow('Deposit (' + ctrl.amount + ') rejected', 'danger')
        })
    }

    ctrl.transfer = function() {
        $http.put('/transfer', { from: ctrl.from, to: ctrl.to, amount: ctrl.amount }).then(function(res) {
            lib.alertShow('Transfer (' + ctrl.amount + ') committed')
        }, function(err) {
            lib.alertShow('Transfer (' + ctrl.amount + ') rejected', 'danger')
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