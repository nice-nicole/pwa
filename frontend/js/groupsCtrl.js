app.controller('GroupsCtrl', [ '$http', '$scope', 'lib', 'ws', function($http, $scope, lib, ws) {
    console.log("Are you reaching here?")
    console.log('GroupsCtrl started')
    console.log("here too?")
    let ctrl = this

    ctrl.clickedRow = -1

    ctrl.groups = []

    ctrl.group = {
        groupName: '',
        // lastName: '',
        // year: 2000
    }

    ctrl.amount = 0
    ctrl.from = ctrl.to = null

    ctrl.new = function() {
        // console.log("ctrl.group:",ctrl.group)
        $http.post('/group', ctrl.group).then(function(res) {
            ctrl.groups = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.modify = function() {
        let _id = ctrl.groups[ctrl.clickedRow]._id
        $http.put('/group?_id=' + _id, ctrl.group).then(function(res) {
            ctrl.groups = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.delete = function(_id) {
        $http.delete('/group?_id=' + _id).then(function(res) {
            ctrl.groups = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.copy = function(n) {
        ctrl.group.groupName = ctrl.groups[n].groupName
        // ctrl.group.lastName = ctrl.groups[n].lastName
        // ctrl.group.year = ctrl.groups[n].year
        ctrl.clickedRow = n
    }

    ctrl.isGroupDataCorrect = function() {
        // return ctrl.group.firstName && ctrl.group.lastName && ctrl.group.year >= 1500
        return ctrl.group.groupName
    }

    ctrl.isAdmin = function() {
        return lib.role == 'admin'
    }

    var refresh = function() {
        // retrieve groups list on start
        $http.get('/group').then(function(res) {
            ctrl.groups = res.data
            ctrl.from = ctrl.to = ctrl.groups[0]._id
        }, function(err) {
            console.error(err.data)
        })
    }

    $scope.$on('change', function(event, arg) {
        if(arg.collection == 'groups' || arg.collection == 'transactions') {
            refresh()
        }
    })

    refresh()
}])