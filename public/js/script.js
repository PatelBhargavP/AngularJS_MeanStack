var appAng = angular.module('myApp', ['ngRoute', 'ngMessages', 'ngAria', 'ngAnimate']);
appAng.config(function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: "views/login.html",
        controller: "logInCntrl",
        resolve: ['authservice', function (authservice) {
            return authservice.isLoggedIn("a");
        }]
    })
        .when('/register', {
            templateUrl: "views/register.html",
            controller: "regCntrl",
            resolve: ['authservice', function (authservice) {
                return authservice.isLoggedIn("b");
            }]
        })
        .when('/post', {
            templateUrl: "views/postJob.html",
            controller: "postCntrl",
            resolve: ['authservice', function (authservice) {
                return authservice.isLoggedIn("c");
            }]
        })
        .when('/search', {
            templateUrl: "views/searchJob.html",
            controller: "searchCntrl",
            resolve: ['authservice', function (authservice) {
                return authservice.isLoggedIn("d");
            }]
        })
        .otherwise('/login');
});


appAng.controller('mainCntrl', ['$scope', '$rootScope', '$location', 'loginStatus', '$http', function ($scope, $rootScope, $location, loginStatus, $http) {
    $http.get('http://localhost:3000/checkLogIn').then(function (res) {
        if (res.data.length == 0) {
        } else {
            loginStatus.currentUser = res.data[0]
            loginStatus.loginStat = res.data[0].isLoggedIn;
            loginStatus.userType = res.data[0].type;
            $scope.logStat = true;
            $scope.thisUser = loginStatus.currentUser;
            if (loginStatus.userType == "company") {
                $scope.employee = true;
            } else {
                $scope.employee = false;
            }
        }
    });

    $rootScope.$on('update_logStat', function ($event, args) {
        $scope.logStat = args.value;
    });

    $rootScope.$on('update_thisUser', function ($event, args) {
        $scope.thisUser = args.value;
    });

    $rootScope.$on('update_emp', function ($event, args) {
        $scope.employee = args.value;
    });

    $scope.logOutFn = function () {
        $http.post('http://localhost:3000/logOut').then(function (res) {
            $scope.logStat = false;
            loginStatus.loginStat = false;
            loginStatus.currentUser = null;
            loginStatus.userType = null;
            $location.path('/');
        })

    };
}]);


appAng.controller('logInCntrl', ['$scope','$rootScope', 'loginStatus', '$http', 'getAll', '$location', function ($scope, $rootScope, loginStatus, $http, getAll, $location) {
    $scope.logInFn = function (userDetails) {
        if ($scope.logInForm.$valid) {
            $http.post('http://localhost:3000/Loginusers', $scope.cred).then(
                function (res) {
                    if (res.data.length == 0) {
                        alert("Invalid username or password");
                    } else {
                        $rootScope.$broadcast('update_logStat', { value: true });
                        loginStatus.loginStat = true;
                        loginStatus.currentUser = res.data[0];
                        loginStatus.userType = res.data[0].type;
                        if (loginStatus.userType == "company") {
                            $rootScope.$broadcast('update_emp', { value: true });
                        } else {
                            $rootScope.$broadcast('update_emp', { value: false });
                        }
                        $rootScope.$broadcast('update_thisUser', { value: loginStatus.currentUser });
                        $location.path('/search');

                    }
                }
            )
        }
    };
}]);


appAng.controller('regCntrl', ['$scope', '$rootScope', 'loginStatus', '$http', 'getAll', '$location', function ($scope, $rootScope, loginStatus, $http, getAll, $location) {


    $scope.submitForm = function (userDetails) {
        if ($scope.userForm.$valid) {
            $scope.user.isLoggedIn = false;
            $http.post('http://localhost:3000/createusers', $scope.user).then(function (res) {
                if (res.data.length == 0) {
                    alert("This username is already taken");
                } else {
                    $http.post('http://localhost:3000/logOut').then(function (res) {
                        $rootScope.$broadcast('update_emp', { value: false });
                        loginStatus.loginStat = false;
                        loginStatus.currentUser = null;
                        loginStatus.userType = null;
                        $location.path('/login');
                    })
                }
            })
        }
    };
}]);


appAng.controller('postCntrl', ['$scope', 'loginStatus', '$http', 'getAll', '$location', function ($scope, loginStatus, $http, getAll, $location) {
    $scope.postJob = function (job) {
        if ($scope.newJob.$valid) {
            job.keywords = job.keywords.split(",");
            $http.post('http://localhost:3000/createjob', job).then(
                function (res) {
                    alert("Job saved successfully");
                    document.getElementById("jobForm").reset()
                }
            )
        }
    }
}]);


appAng.controller('searchCntrl', ['$scope', 'loginStatus', '$http', 'getAll', '$location', function ($scope, loginStatus, $http, getAll, $location) {
    $scope.byTitle = function (title) {
        if ($scope.searchTitle.$valid) {
            $scope.jsonTitle = JSON.parse('{"titleVal":"' + title + '"}');
            $http.post('http://localhost:3000/searchbytitle', $scope.jsonTitle).then(
                function (res) {
                    if (res.data.length == 0) {
                        alert("Couldn't find the job with this title");
                    } else {
                        $scope.results = res.data;
                        document.getElementById("loc").reset();
                        document.getElementById("keyword").reset();
                    }
                }
            )
        }
    };

    $scope.byLocation = function (loc) {
        if ($scope.searchLocation.$valid) {
            $scope.jsonLoc = JSON.parse('{"locVal":"' + loc + '"}');
            $http.post('http://localhost:3000/searchbyloc', $scope.jsonLoc).then(
                function (res) {
                    if (res.data.length == 0) {
                        alert("Couldn't find the job with this location");
                    } else {
                        $scope.results = res.data;
                        document.getElementById("title").reset();
                        document.getElementById("keyword").reset();
                    }
                }
            )
        }
    };

    $scope.byKey = function (keyword) {
        // check to make sure the form is completely valid
        if ($scope.searchKey.$valid) {
            keyword = keyword.split(",");
            $http.post('http://localhost:3000/searchbykey', keyword).then(
                function (res) {
                    if (res.data.length == 0) {
                        alert("Couldn't find the job with this keywords");
                    } else {
                        $scope.results = res.data;
                        document.getElementById("title").reset();
                        document.getElementById("loc").reset();
                    }
                }
            )
        }
    };

    $scope.deleteAll = function () {
        $scope.results = [];
        document.getElementById("title").reset();
        document.getElementById("loc").reset();
        document.getElementById("keyword").reset();
    };
}]);


appAng.directive('searchResults', function () {
    return {
        templateUrl: `views/searchResults.html`,
        link: function (scope, elem, attrs) {
        }
    }
});


appAng.service('getAll', ['$http', function ($http) {
    this.allusers = [];
    this.getallusers = function () {
        $http.get('http://localhost:3000/getAll').then(function (res) {
            this.allusers = res.data;
            return this.allusers;
        })
    }
}]);


appAng.service('loginStatus', ['$location', function ($location) {
    this.loginStat;
    this.currentUser;
    this.userType;
}]);


appAng.factory('authservice', function ($q, $http, $location) {
    return {
        isLoggedIn: function (flag) {
            var promise = $q.defer();
            $http.get('http://localhost:3000/checkLogIn').then(function (res) {
                if (res.data.length == 0) {
                    if (flag=="b" && res.data.length == 0) {
                        $location.path('/register');
                        promise.resolve();
                    } else if (flag == "a" && res.data.length == 0) {
                        $location.path('/login');
                        promise.resolve();
                    }
                } else {
                    if (res.data[0].type == "company" && flag == "c") {
                        $location.path('/post')
                        promise.resolve();
                    }
                    else if (flag=="d") {
                        $location.path('/search');
                        promise.resolve();
                    }
                }
            })
            return promise.promise;
        }
    }
});