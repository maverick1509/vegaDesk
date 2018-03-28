angular.module('ResourcesApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


  .controller('stewardsController', function($scope, $http, $interval, $cookies) {

    //Check if logged in
    if($cookies.get("zaitoonAdmin")){
      $scope.isLoggedIn = true;
    }
    else{
      $scope.isLoggedIn = false;
      window.location = "adminlogin.html";
    }

    //Logout function
    $scope.logoutNow = function(){
      if($cookies.get("zaitoonAdmin")){
        $cookies.remove("zaitoonAdmin");
        window.location = "adminlogin.html";
      }
    }

      $scope.outletCode = localStorage.getItem("branch");
      var temp_branch = localStorage.getItem("branchCode");

      $scope.initAgents = function(){
	      $http.get("https://kopperkadai.online/services/fetchroles.php?branch="+temp_branch+"&role=STEWARD").then(function(response) {
	          $scope.delivery_agent = response.data.results;
	      });
      }
      
      $scope.initAgents();
	
      $scope.errorflag =  false;
      $scope.agentcode = '';
      $scope.agentname = '';
      $scope.addAgent = function(){
        var data = {};
        data.token = $cookies.get("zaitoonAdmin");
        data.code = $scope.agentcode ;
        data.name = $scope.agentname ;
        if(data.code == "" || data.name == ""){
          $scope.errorflag =  true;
        }
        else{
          $http({
            method  : 'POST',
            url     : 'https://kopperkadai.online/services/deskaddsteward.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
              $scope.initAgents();
            });
        }
      }
      
      $scope.askForDelete = function(con){
      	$scope.askContent = con;
      	$('#confirmationModal').modal('show');
      }

      $scope.removeAgent = function(code){
        var data = {};
        data.token = $cookies.get("zaitoonAdmin");
        data.code = code;
        $http({
          method  : 'POST',
          url     : 'https://kopperkadai.online/services/deskremovesteward.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
          $('#confirmationModal').modal('hide');
          $scope.initAgents();
         });

      }


       //Refresh Badge Counts
        var admin_data = {};
        admin_data.token = $cookies.get("zaitoonAdmin");
        $http({
          method  : 'POST',
          url     : 'https://kopperkadai.online/services/fetchbadgecounts.php',
          data    : admin_data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
         	if(response.data.status){
              		$scope.reservations_length = response.data.reservationsCount;
              		$scope.pending_orders_length = response.data.ordersCount;
              		$scope.helprequests_length = response.data.helpCount;
              	}
              	else{
              		$scope.reservations_length = 0;
              		$scope.pending_orders_length = 0;
              		$scope.helprequests_length = 0;
              	}
         });

        $scope.Timer = $interval(function () {
          $http({
            method  : 'POST',
            url     : 'https://kopperkadai.online/services/fetchbadgecounts.php',
            data    : admin_data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
                if(response.data.status){
              		$scope.reservations_length = response.data.reservationsCount;
              		$scope.pending_orders_length = response.data.ordersCount;
              		$scope.helprequests_length = response.data.helpCount;
              	}
              	else{
              		$scope.reservations_length = 0;
              		$scope.pending_orders_length = 0;
              		$scope.helprequests_length = 0;
              	}
           });
        }, 20000);


	})
		

  ;
