(function () {
  'use strict';

  angular.module('blog.controllers', ['blog.services']);

  function PostListCtrl(Post) {
    this.posts = Post.query();
  }

  function PostDetailCtrl($routeParams, Post, Comment) {
    this.post = Post.query({ id: $routeParams.postId });
    this.comments = Comment.query({ postId: $routeParams.postId });
  }
  function PostCreateCtrl(Post) {
    var self = this;
    this.create = function() {
      Post.save(self.post);
    };
  }
  function PostDetailCtrl($routeParams, Post, Comment) {
    this.post = {};
    this.comments = {};
    this.user = {}
    var self = this; // Para guardar la referencia
    Post.query({ id: $routeParams.postId })
      .$promise.then(
      //Success
      function(data) {
        self.post = data[0];
        self.user = User.query({ id: self.user.userId });
      },
    //Error
    function(error) {
      console.log(error);
    });
    this.comments = Comment.query({ postId: $routeParams.postId });
  }
  angular.module('blog.controllers')
    .controller('PostDetailCtrl',PostDetailCtrl)
    .controller('PostDetailCtrl',PostDetailCtrl)
    .controller('PostListCtrl',PostListCtrl);


})();
