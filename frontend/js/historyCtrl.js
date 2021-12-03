app.controller('HistoryCtrl', [ '$http', function($http) {
    console.log('HistoryCtrl started')
    let ctrl = this

    ctrl.transactions = []
    ctrl.person_id = null

    // retrieve persons list on start
    $http.get('/person').then(function(res) {
        ctrl.persons = res.data
        ctrl.person_id = ctrl.persons[0]._id
        ctrl.refreshHistory()
    }, function(err) {
        console.error(err.data)
    })
    
    ctrl.refreshHistory = function() {
        $http.get('/history?_id=' + ctrl.person_id).then(function(res) {
            ctrl.transactions = res.data
            ctrl.transactions.forEach(function(transaction) {
                let date = new Date(transaction.when)
                transaction.when = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
            })
        }, function(err) {
            console.error(err.data)
        })
    }

}])