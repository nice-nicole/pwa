app.controller('ChatsCtrl', [
  '$http',
  '$scope',
  'lib',
  'ws',
  function ($http, $scope, lib, ws) {
    console.log('ChatsCtrl started')
    let ctrl = this

    ctrl.clickedRow = -1

    ctrl.chats = []

    ctrl.chat = {
      sender_id: '',
      group_id: '',
      contents: '',
    }
    // ctrl.sender_id= null
    ctrl.group_id = null
    ctrl.from = ctrl.to = null
    
    // retrieve chats list on start
    $http.get('/chat').then(function(res) {
        ctrl.chats = res.data
    }, function(err) {
        console.error(err.data)
    })

    $http.get('/group').then(function(res) {
        ctrl.groups = res.data   
        ctrl.group_id = ctrl.groups[0]._id
    }, function(err) {
        console.error(err.data)
    })

    $http.get('/person').then(function(res) {
        ctrl.persons = res.data
        group_id = ctrl.persons[0].group_id
    }, function(err) {
        console.error(err.data)
    })

    ctrl.modify = function () {
      let _id = ctrl.chats[ctrl.clickedRow]._id
      $http.put('/chat?_id=' + _id, ctrl.chat).then(
        function (res) {
          ctrl.chats = res.data
        },
        function (err) {
          console.error(err.data)
        },
      )
    }

    ctrl.delete = function (_id) {
      $http.delete('/chat?_id=' + _id).then(
        function (res) {
          ctrl.chats = res.data
        },
        function (err) {
          console.error(err.data)
        },
      )
    }

    ctrl.copy = function (n) {
      ;(ctrl.chat.group_id = ctrl.chats[n].group_id),
        (ctrl.chat.sender_id = ctrl.chats[n].sender_id),
        (ctrl.chat.contents = ctrl.chats[n].contents),
        (ctrl.clickedRow = n)
    }

    ctrl.isChatDataCorrect = function () {
      return (
        ctrl.chat.group_id &&
        ctrl.chat.sender_id &&
        ctrl.chat.contents
      )
    }

    ctrl.isAdmin = function () {
      return lib.role == 'admin'
    }
    var refresh = function () {
      $http.get('/chat').then(
        function (res) {
          ctrl.chats = res.data
        },
        function (err) {
          console.error(err.data)
        },
      )
    }


    $scope.$on('change', function (event, arg) {
      if (arg.collection == 'chats' || arg.collection == 'persons') {
        refresh()
      }
    })

    refresh()
  },
])
