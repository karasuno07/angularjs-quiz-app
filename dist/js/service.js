const baseUrl = "http://localhost:7777/api";

app.service('userService', function ($http) {
    return {
        checkUniqueValue: function (username) {
            return $http.get(`${baseUrl}/users/search/isUnique?username=${username}`)
                .then(function (response) {
                    return response;
                }, function (error) {
                    return error;
                })
        },

        findAll: function () {
            let users = [];
            $http.get(`${baseUrl}/users`).then(function (response) {
                const data = response.data.content;
                data.forEach(item => {
                    users.push(item);
                });
            });
            return users;
        },

        save: function (user) {
            return $http.post(`${baseUrl}/users`, user).then(function (response) {
                return response.status;
            })
        },

        authenticate: function (username, password) {
            return null;
        },


        addCourse: function (userId, courseId) {
            return $http({
                method: 'POST',
                url: `${baseUrl}/users/add-course`,
                data: {
                    userId: userId,
                    courseId: courseId
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(function (response) {
                return response;
            })
        },

        getRecentCourses: function (userId) {
            return $http.get(`${baseUrl}/users/courses/byUserId/${userId}?sortBy=active-date&order=desc`)
                .then(function (response) {
                    return response;
                })
        },

        updateCourseActiveDate: function (userId, courseId, date) {
            return $http({
                method: "PUT",
                url: `${baseUrl}/users/${userId}/course/${courseId}/update-active-date`,
                data: JSON.stringify(date),
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(function (response) {
                return response;
            }, function (error) {
                console.log(error);
                return error;
            })
        },

        removeCourse: function (userId, courseId) {
            return $http({
                method: 'DELETE',
                url: `${baseUrl}/users/remove-course`,
                data: {
                    userId: userId,
                    courseId: courseId
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(function (response) {
                return response;
            })
        }
    }
});

app.service('courseService', function ($http) {

    let course = {};
    let courses = [];

    return {
        course,
        courses,

        getCourse: function (courseId) {
            return $http.get(`${baseUrl}/courses/${courseId}`)
                .then(function (response) {
                    return response;
                })
        },

        searchByKeyword: function (keyword) {
            return $http.get(`${baseUrl}/courses/search/byKeyword?keyword=${keyword}`)
                .then(function (response) {
                    return response;
                }, function (error) {
                    console.log(error)
                    return error;
                })
        },

        getQuestions: function (courseId) {
            return $http.get(`${baseUrl}/courses/${courseId}/quiz`)
                .then(function (response) {
                    return response;
                })
        },

        getCoursesByCategoryId: function (categoryId) {
            return $http.get(`${baseUrl}/courses/category/${categoryId}`)
                .then(function (response) {
                    return response;
                })
        },

        getCategories: function () {
            return $http.get(`${baseUrl}/courses/categories`)
            .then(function (response) {
                return response
            })
        }

    }
})


app.service('httpErrorResponseInterceptor', ['$q', '$location',
    function ($q, $location) {
        return {
            response: function (responseData) {
                return responseData;
            },
            responseError: function error(response) {
                switch (response.status) {
                    case 401:
                        $location.path('/login');
                        break;
                    case 404:
                        $location.path('/404');
                        break;
                    default:
                        $location.path('/404');
                }

                return $q.reject(response);
            }
        };
    }
]);
