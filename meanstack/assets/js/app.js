/** * http://usejsdoc.org/
 */
(function(){
	var app  = angular.module("myapp",[]);
	 app.controller('appCtrl' ,['$scope','$http','$location',function($scope,$http,$location){
		    $scope.form = {};
		    $scope.submit = function(form) {
				var data_obj = {
						'firstname':form.firstname,
						'lastname':form.lastname,
						'address':form.address,
						'city':form.city,
						'zipcode':form.zipcode,
						'phonenumber':form.phonenumber ,
						'state':form.state,
						'username':form.username
				};
				console.log(data_obj.username);
				
				$http.post('http://localhost:8085/save_details', data_obj).then(
					function(success_rep) {
						alert('Data saved successfully = '+success_rep.data.flag);
						
							window.location.href =("/js/user.html") ;
						   
					},
					function(err_rep) {
						alert('Error happened while saving data'+err_rep.data.flag);
					}
				);
				
			};
			
	 }]); 
	 
	 
	 
	 app.controller('app2Ctrl',["$scope","$http",function($scope,$http) {
		 $scope.form = {};
		 $scope.submit = function(form){
			 var user_obj ={ 
					 'emailid': form.emailid,
					 'username': form.username,
					 'password':form.password
			 };
			 console.log(user_obj);
			 
			 $http.post('http://localhost:8085/login_details', user_obj).then(
						function(success_rep) {
							alert('Users saved successfully = '+success_rep.data.flag);
							
								
							
						},
						function(err_rep) {
							alert('Error happened while saving data'+err_rep.data.flag);
						}
					);
			 
			 
				
		 };
		 
		 $scope.view = function(form) {
			 console.log("click working"+form.username)
				$http.get('http://localhost:8085/liststudents/'+form.username).then(
					function(success_resp) {
						$scope.students_data = success_resp.data;
					},
					function(err_resp) {
					console.log("failure")	
					}
				);
			};
			
			$scope.mail = function(form){
				
			}
			
	 }]);
})();
