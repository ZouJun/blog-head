angular.module("blog", ["bgf.paginateAnything", "ngRoute"])
    .config(["$httpProvider", "$routeProvider", function ($httpProvider, $routeProvider) {
        $httpProvider.defaults.withCredentials = true;
        $routeProvider
            .when("/articles", {
                controller: 'main',
                templateUrl: "partile/_articles.html"
            })
            .when("/articles/no_tags", {
                controller: 'main',
            templateUrl: "partile/_tags.html"
    })
            .when("/articles/zhuye", {
                controller: 'main',
                templateUrl: "partile/_articles.html"
            })
            .when("/article/:id/comments", {
                controller: 'main',
                templateUrl: "comment.html"
            })
            .when("/article/:id", {
                controller: 'arti',
                templateUrl: "article.html"
            })
            .when("/articles/:id", {
                controller: 'edit_article',
                templateUrl: "articles/_update_article.html"
            })
            .when("/article/:id/comments/anything", {
                controller: 'comments',
                templateUrl: "articles/_comment.html"
            })
            .otherwise({redirectTo: '/articles/zhuye'})
    }])
    .controller("main", function ($rootScope, $scope, $http, $routeParams, $location) {

        $rootScope.urls = 'http://api.tavern.name/zoujun/articles/anything';

        //自动获取当前用户
        $scope.load_current_user = function () {
            $http.get("http://api.tavern.name/zoujun/users/current").success(function (user) {
                if (user != null) {
                    $scope.myvalue = true;
                }
                $scope.c_data = user;
            }).error(function (message) {
                console.log(message);
            })
        }
        $scope.load_current_user();

        //登陆
        $scope.login_click = function () {
            $http.post("http://api.tavern.name/zoujun/users/login", $scope.user).success(function (user) {
                console.log(user.username);
                $scope.load_current_user();
                $location.path("/articles/zhuye")
            }).error(function (message) {
                $scope.message = message;
            })

        }

        //注销
        $scope.login_out = function () {
            $http.post("http://api.tavern.name/zoujun/users/logout").success(function () {
                $scope.users = null;
                $scope.myvalue = false;
                console.log("注销成功");
            }).error(function (message) {
                console.log(message);
            })
        }

        //修改用户资料
        $scope.update_source = function () {
            $http.put("http://api.tavern.name/zoujun/users/current", {
                old_password: $scope.old_password,
                password: $scope.new_password
            }).success(function (user) {
                $scope.myvalue = false;
                console.log(user);
            }).error(function (message) {
                console.log(message);
            })
        }

        //发表文章
        $scope.article_submit = function () {
            $http.post("http://api.tavern.name/zoujun/articles", {
                title: $scope.article.title,
                tags: [$scope.article.tags],
                content: $scope.article.content
            }).success(function (article) {
                console.log(article);
                $location.path("/articles/zhuye");
            }).error(function (message) {
                console.log(message);
            })
        }

        //评论文章
        $scope.comment_article = function () {
            $scope.id_c = $routeParams.id;
            $http.post("http://api.tavern.name/zoujun/articles/" + $scope.id_c + "/comments", {content: $scope.content}).success(function (content) {
                console.log(content);
                $location.path("/articles/zhuye");
            }).error(function (content) {
                console.log(content);
            })
        }

        //删除文章评论
        $scope.delete_comment = function (id) {
            $scope.comment_id = $rootScope.id_c;
            $http.delete("http://api.tavern.name/zoujun/articles/" + $scope.comment_id + "/comments/" + id).success(function () {
                console.log("删除评论成功");
                $location.path("/articles/zhuye");
            }).error(function (message) {
                console.log(message);
            })

        }

        //删除文章
        $scope.delete_article = function () {
            $scope.edit_id = $rootScope.id;
            $http.delete("http://api.tavern.name/zoujun/articles/" + $scope.edit_id).success(function () {
                console.log("删除文章成功");
                $location.path("/articles/zhuye");
            }).error(function (message) {
                console.log(message);
            })
        }

        //按标签获取文章
        $scope.tags_get = function () {
            $http.get("http://api.tavern.name/zoujun/articles/anything?tagname=" + $scope.tags).success(function (data) {
                console.log(data);
                $rootScope.urls = 'http://api.tavern.name/zoujun/articles/anything?tagname=' + $scope.tags;
                console.log($scope.urls)
            }).error(function (message) {
                $location.path("/articles/no_tags");
                console.log(message);
            })


        }
    })
    .controller("comments", function ($rootScope, $scope, $http, $routeParams, $location) {

        //获取评论内容
        $scope.id_com = $routeParams.id;
        $scope.url = 'http://api.tavern.name/zoujun/articles/' + $scope.id_com + '/comments/anything';
        //$rootScope.id_c = $scope.id_com;
        //$http.get("http://api.tavern.name/zoujun/articles/" + $scope.id_com + "/comments/anything").success(function (data) {
        //    console.log(data);
        ////    $scope.url = 'http://api.tavern.name/zoujun/articles/' + $scope.id_com + '/comments/anything';
        ////    console.log($scope.url);
        //if(data.size()==0){
        //    $location.path("/articles/no_comments");
        //}
        //}).error(function (message) {
        //  console.log(message)
        //})


        //}).error(function (message) {
        //    console.log(message);
    })

    .
    controller("arti", function ($rootScope, $scope, $http, $routeParams) {

        //获取文章详细信息
        $scope.number = $routeParams.id;
        $rootScope.id = $scope.number;
        $http.get("http://api.tavern.name/zoujun/articles/" + $scope.number).success(function (data) {
            $scope.articledata = data;
            $rootScope.articledata=data;
        }).error(function (message) {
            console.log(message);
        })


    })
.controller("edit_article",function($rootScope,$http,$scope,$location){

        $scope.edit_article_id=$rootScope.id;
        $http.get("http://api.tavern.name/zoujun/articles/" + $scope.edit_article_id).success(function (data) {
            console.log(data)
            $scope.edit_title = data.title;
            $rootScope.edit_content=data.content;
        }).error(function (message) {
            console.log(message);
        })

        //修改文章
        $scope.edit_article = function () {
            $scope.edit_id = $rootScope.id;
            $http.post("http://api.tavern.name/zoujun/articles/" + $scope.edit_id, {
                title: $scope.edit_title,
                content: $scope.edit_content
            }).success(function () {
                $location.path("/articles/zhuye");
                console.log("修改文章成功");
            }).error(function (message) {
                console.log(message);
            })
        }

    })


