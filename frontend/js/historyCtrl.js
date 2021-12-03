app.controller('HistoryCtrl', [ '$http', function($http) {
    console.log('HistoryCtrl started')
    let ctrl = this

    ctrl.transactions = []

    // retrieve persons list on start
    $http.get('/history?_id=619763a2522e0e4bbc5c9412').then(function(res) {
        ctrl.transactions = res.data
    }, function(err) {
        console.error(err.data)
    })

}])