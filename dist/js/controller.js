/* ==== Login Controller ==== */
app.controller('loginCtrl', function ($scope, $rootScope, $location, $state, userService) {
    const COOKIE_NAME = 'FPT_QUIZ_USERNAME';

    let targetUrl = $rootScope.back || '/home';

    const users = userService.findAll();

    $scope.username = getCookie(COOKIE_NAME) != null ? getCookie(COOKIE_NAME) : '';

    $scope.rememberCheck = function () {
        $scope.remember = !$scope.remember;
    }

    $scope.process = function () {
        const username = $scope.username, password = $scope.password;

        users.forEach(user => {
            if (user.username === username && user.password === password) {
                if ($scope.remember == true) {
                    setCookie(COOKIE_NAME, username, 30);
                } else {
                    eraseCookie(COOKIE_NAME);
                }

                $location.path(targetUrl);
                sessionStorage.setItem("user", JSON.stringify(user));
                return;
            }
        });

        $scope.error = true;
        $scope.password = '';
    }
    
})


/* ==== Forget Password Controller ==== */
app.controller('forgotCtrl', function ($scope) {

})


/* ==== Registration Controller ==== */
app.controller('registCtrl', function ($scope, $location, userService) {

    $scope.phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    $scope.submit = function () {
        console.log($scope.user);
        userService.save($scope.user).then(function (status) {
            if (status === 201) {
                $location.path("/login");
            }
        })
    }
})

/* ==== Init Data ==== */
function init($scope) {
    $scope.categories = JSON.parse(sessionStorage.getItem("categories"));
}

/* ==== User Controller ==== */
app.controller('userCtrl', function ($scope, $location, courseService) {

    init($scope);

    $scope.user = JSON.parse(sessionStorage.getItem("user"));

    $scope.logout = function () {
        sessionStorage.removeItem("user");
        $location.path("/login");
    }

    $scope.search = function () {
        const keyword = $scope.searchInput;

        if (keyword && keyword.length > 0) {
            courseService.searchByKeyword(keyword).then(function (response) {
                $scope.result = response.data.content;
            })
        } else {
            $scope.result = null;
        }
    }

    $scope.reset = function () {
        $scope.searchInput = "";
    }
})

/* ==== Home Controller ==== */
app.controller('homeCtrl', function ($scope, userService, courseService) {
    init($scope, courseService);

    const loginedUser = JSON.parse(sessionStorage.getItem("user"));;
    if (loginedUser != null) {
        userService.getRecentCourses(loginedUser.id).then(function (response) {
            $scope.userCourses = response.data.content;
            console.log($scope.userCourses)
        })
        $scope.user = loginedUser;
    }
})

app.controller('coursesCtrl', function ($scope, $stateParams, courseService) {
    init($scope, courseService);

    courseService.getCoursesByCategoryId($stateParams.categoryId).then(function (response) {
        $scope.courses = response.data.content;
    })

    $scope.more = function () {
        $scope.page += 4;
    }
})

app.controller('courseCtrl', function ($scope, $stateParams, $location, userService, courseService) {

    function checkEnrolled() {
        userService.getRecentCourses(loginedUser.id).then(function (response) {
            const userCourses = response.data.content;
            for (const course of userCourses) {
                if (course.id == $stateParams.courseId) $scope.enrolled = true;
            }
        })
    }

    const loginedUser = JSON.parse(sessionStorage.getItem("user"));;
    if (loginedUser != null) {
        checkEnrolled();
    } else {
        $scope.enrolled = false;
    }

    courseService.getCourse($stateParams.courseId).then(function (response) {
        $scope.info = response.data.content;
        $scope.info.lastUpdate = new Date();
    })

    $scope.enrollStyle = function () {
        const backgroundColor = $scope.enrolled == true ? '#bdb8b7' : '#d12d17';
        const color = $scope.enrolled == true ? '#555' : '#dfdfdf';
        return { background: backgroundColor, color: color };
    }

    $scope.showConfirm = function () {
        if (loginedUser == null) {
            $location.path("/login");
        } else {
            $('#confirmModal').modal('show');
        }
    }

    $scope.enroll = function () {
        const userId = loginedUser.id;
        const courseId = +$stateParams.courseId;

        if ($scope.enrolled) {
            userService.removeCourse(userId, courseId).then(function (response) {
                if (response.status === 204) {
                    $scope.enrolled = false;
                }
            }, function (error) {

            })
        } else {
            userService.addCourse(userId, courseId).then(function (response) {
                if (response.status === 201) {
                    $scope.enrolled = true;
                } else {

                }
            }, function (error) {

            })
        }

        $('#confirmModal').modal('hide');
    }

})


app.controller('quizCtrl', function ($scope, $stateParams, $interval, userService, courseService) {
    const loginedUser = JSON.parse(sessionStorage.getItem("user"));

    /* ======================= Quiz function ======================= */
    courseService.getCourse($stateParams.courseId).then(function (response) {
        const courseInfo = response.data.content; // fetch course info
        $scope.info = courseInfo;

        userService.updateCourseActiveDate(loginedUser.id, courseInfo.id, new Date); // update active date to this course
    })

    function shuffle(array, outputSize) {
        for (let i = array.length - 1 > outputSize ? outputSize : array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * array.length);
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array.slice(0, outputSize);
    }

    let questions = [];

    function getQuestion() { // fetch data from api
        courseService.getQuestions($stateParams.courseId).then(function (response) {
            questions = shuffle(response.data.content, 10); // then shuffle questions and get 10 of them
            $scope.currentQuestion = questions[0];
            $scope.questions = questions;
            $scope.questions.forEach(q => q.answers);
        })
    }

    let timer; // define timer to handle countdown functions

    function start() {
        $scope.showQuestion = true; // show question view

        $('.start-btn').hide();
        $('.time-left').show();

        let time = 300, s = 0, m = time / 60;
        $scope.m = ('' + m).length < 2 ? '0' + m : m;
        $scope.s = ('' + s).length < 2 ? '0' + s : s;

        timer = $interval(function () {
            if (m === 0 && s === 0) {
                stop();
            } else if (s === 0) {
                s = 59;
                m -= 1;
            } else {
                s -= 1;
            }
            $scope.m = ('' + m).length < 2 ? '0' + m : m;
            $scope.s = ('' + s).length < 2 ? '0' + s : s;

        }, 1000);
    }

    function stop() { // stop timer
        $scope.showQuestion = false; // hide question view

        $('.start-btn').show();
        $('.time-left').hide();

        $interval.cancel(timer);
        timer = null;

        $scope.play = false; // hide quiz view, show result view
        $scope.idx = 1; // reset index to 1
        $scope.point = calc(); // calculate total point
    }

    $scope.start = function () {
        getQuestion();

        start();
    }

    $scope.select = function (idx, answer) {
        questions[idx].userAnswer = answer; // assign new value to user answer
        questions[idx].isCorrect = questions[idx].userAnswer === questions[idx].correctAnswer; // check if the answer is correct
        console.log(questions[idx]);
    }

    $scope.previous = function () {
        if ($scope.idx > 1) {
            $scope.currentQuestion = questions[$scope.idx];
            $scope.idx -= 1;
        }
    }

    $scope.next = function () {
        if ($scope.idx < questions.length) {
            $scope.currentQuestion = questions[$scope.idx];
            $scope.idx += 1;
        }
    }

    function calc() {
        let point = 0;
        questions.forEach(q => {
            if (q.isCorrect === true) {
                point++;
            }
        });
        return point;
    }

    $scope.confirm = function () {
        $('#confirmModal').modal('show');
    }

    $scope.finish = function () {
        stop();
        $('#confirmModal').modal('hide');
    }

    $scope.difficultStyle = function (difficult) {
        let value = difficult == 'EASY' ? '#12a33b' : difficult == 'NORMAL' ? '#2b6ae0' : '#ed1313';
        return { "color": value };
    }

    /* ======================= Result function ======================= */

    $scope.resultPointStyle = function () {
        // set value for text color base on point
        let value = calc() >= 8 ? '#0fd948' : calc() >= 5 ? '#f09d46' : '#f52f2f';
        return { "color": value };
    }

    $scope.details = function () {
        $scope.more = !$scope.more;
    }

    $scope.restart = function () {
        $scope.play = true; // show quiz view, hide result view
        getQuestion(); // reload new random question
    }

})

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

function getCookie(name) {
    const nameEQ = name + '=';
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i];
        while(cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) == 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}