const app = angular.module("application", ["ui.router"]);

app.run(function ($rootScope, $templateCache, $http, $transitions, courseService) {
  $http.get('/partials/header.html', { cache: $templateCache });
  $http.get('/partials/footer.html', { cache: $templateCache });

  courseService.getCategories().then(function (response) {
    const categories = response.data.content;
    sessionStorage.setItem("categories", JSON.stringify(categories));
  })


  $transitions.onStart({}, function (transition) {
    const authenticate = JSON.parse(sessionStorage.getItem("user"));
    const fromState = transition.from();
    const toState = transition.to();

    if (toState.name == 'Quiz') {
      if (authenticate === null) {
        return transition.router.stateService.target(fromState.name);
      }
    }
  });

  $rootScope.$on('$locationChangeStart', function (evt, current, previous) {
    const prevUrl = previous.substring(previous.lastIndexOf('#!/') + 2);
    const currentUrl = current.substring(current.lastIndexOf('#!/') + 2);

    if (prevUrl != currentUrl && 
        prevUrl != '/registration' && 
        prevUrl != '/forget-password' && 
        currentUrl === '/login') {
      $rootScope.back = prevUrl;
    }

  });

});

app.config(function ($stateProvider) {

  $stateProvider
    .state("index", {
      url: "",
      redirectTo: 'Home'
    })
    .state("Home", {
      url: "/home",
      views: {
        header: {
          templateUrl: "/partials/header.html",
          controller: "userCtrl"
        },
        offcanvas: {
          templateUrl: "/partials/offcanvas.html",
        },
        $default: {
          templateUrl: "/partials/home.html",
          controller: "homeCtrl",
        },
        footer: {
          templateUrl: "/partials/footer.html",
        },
      },
    })
    .state("Courses", {
      url: "/category/:categoryId",
      views: {
        header: {
          templateUrl: "/partials/header.html",
          controller: "userCtrl"
        },
        offcanvas: {
          templateUrl: "/partials/offcanvas.html",
        },
        $default: {
          templateUrl: "/partials/course-list.html",
          controller: "coursesCtrl",
        },
        footer: {
          templateUrl: "/partials/footer.html",
        },
      },
    })
    .state("Course", {
      url: "/course/:courseId",
      views: {
        header: {
          templateUrl: "/partials/header.html",
          controller: "userCtrl"
        },
        offcanvas: {
          templateUrl: "/partials/offcanvas.html",
        },
        $default: {
          templateUrl: "/partials/course.html",
          controller: "courseCtrl",
        },
        footer: {
          templateUrl: "/partials/footer.html",
        },
      },
    })
    .state("Quiz", {
      url: "/course/:courseId/quiz",
      views: {
        header: {
          templateUrl: "/partials/header.html",
          controller: "userCtrl"
        },
        offcanvas: {
          templateUrl: "/partials/offcanvas.html",
        },
        $default: {
          templateUrl: "/partials/quiz.html",
          controller: "quizCtrl",
        },
        footer: {
          templateUrl: "/partials/footer.html",
        },
      },
    })
    .state("Contact", {
      url: "/contact",
      views: {
        header: {
          templateUrl: "/partials/header.html",
          controller: "userCtrl"
        },
        offcanvas: {
          templateUrl: "/partials/offcanvas.html",
        },
        $default: {
          templateUrl: "/partials/contact.html",
          controller: "homeCtrl",
        },
        footer: {
          templateUrl: "/partials/footer.html",
        },
      },
    })
    .state("Login", {
      url: "/login",
      templateUrl: "/partials/login.html",
      controller: "loginCtrl",
    })
    .state("SignIn", {
      url: "/registration",
      templateUrl: "/partials/registration.html",
      controller: "registCtrl",
    })
    .state("ForgotPassword", {
      url: "/forget-password",
      templateUrl: "/partials/forget-password.html",
      controller: "forgotCtrl",
    })
    .state("Error.PageNotFound", {
      url: "/404",
      templateUrl: "/partials/404.html",
    });
});
