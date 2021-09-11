/* Owl Carousel Directive */
app.directive('owlCarousel', function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope, element) {
            scope.initCarousel = function (items) {
                // provide any default options you want
                let defaultOptions = {
                    loop: true,
                    dots: false,
                    margin: 10,
                    nav: true,
                    responsiveClass: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: items < 2 ? 1 : 2
                        },
                        900: {
                            items: items < 3 ? items : 3
                        },
                        1200: {
                            items: items < 4 ? items : 4
                        }
                    }
                };
                let customOptions = scope.$eval($(element).attr('data-options'));
                // combine the two options objects
                for (var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }
                // init carousel
                $(element).owlCarousel(defaultOptions);
            };
        },
    };
});

app.directive('courseItem', [
    function () {
        return {
            restrict: 'E',
            transclude: false,
            link: function (scope) {
                // wait for the last item in the ng-repeat then call init
                if (scope.$last) {
                    let items = $('.owl-carousel div.item');
                    scope.$parent.initCarousel(items.length);
                }

            },
            template:
                `<a href="#!/course/{{item.id}}">
                <div class="course item">   
                    <div class="course-thumbnail">
                        <img src="resources/images/subjects/{{item.image}}" alt="">
                    </div>
                    <div class="course-info">
                        <span class="course-title">{{item.title}}</span>
                        <div class="course-content">
                            {{item.description}}
                        </div>
                        <div class="lecture">
                            <span class="fw-bold">Lecture:</span>
                            <span>{{item.timeLeft}} minute(s) left</span>
                        </div>
                    </div>
                </div>
            </a>`
        };
    },
]);

/* Meanmenu Directive */
app.directive('meanMenu', function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {

            let options = {
                meanMenuContainer: ".mobile-menu",
                meanScreenWidth: "992",
                meanMenuOpen: '<i class="fas fa-th-list"></i>',
                meanMenuClose: '<i class="fas fa-times"></i>',
                meanExpand: '<i class="fas fa-plus"></i>',
                meanContract: '<i class="fas fa-minus"></i>',
            }

            $(element).meanmenu(options);
        }

    }
});

/* Sticky Directive */
app.directive('stickyHeader', function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope, element) {
            $(element).sticky({
                topSpacing: 0,
            });
        }
    }
});

/* Search Area Directive */
app.directive('searchArea', function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function () {
            $(".search-bar-icon").on("click", function (e) {
                e.preventDefault();
                $(".search-area").addClass("search-active");
            });

            $(".close-btn").on("click", function () {
                $(".search-area").removeClass("search-active");
            });

            $(document).on("keydown", function (event) {
                if (
                    event.key == "Escape" &&
                    $(".search-area").hasClass("search-active")
                ) {
                    $(".close-btn").trigger("click");
                }
            });
        }
    }
});

/* Preloader Directive */
app.directive('preLoader', function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function () {
            $(window).on("load", function () {
                $(".loader").fadeOut(1000);
            });
        }
    }
});

app.directive('musicPlayer', function ($http) {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {

            const player = element[0];

            const $ = document.querySelector.bind(document);
            const $$ = document.querySelectorAll.bind(document);

            const PLAYER_STORAGE_KEY = "KARASU_PLAYER";

            const heading = $('.music-player header h2');
            const cd = $('.music-player .cd');
            const cdThumb = $('.music-player .cd-thumb');
            const audio = $('#audio');
            const playlist = $('.music-player .playlist');
            const playBtn = $('.music-player .btn-toggle-play');
            const prevBtn = $('.music-player .btn-prev');
            const nextBtn = $('.music-player .btn-next');
            const randomBtn = $('.music-player .btn-random');
            const repeatBtn = $('.music-player .btn-repeat');
            const resizeBtn = $('.music-player .btn-resize');
            const volumeBtn = $('.music-player .btn-volume');
            const volumeBar = $('.music-player .volume');
            const volumeHoverBox = $('.music-player .btn-volume .bar-hoverbox');
            const progress = $('#progress');

            const app = {
                currentIndex: 0,
                isExpanding: true,
                isPlaying: false,
                isRandom: false,
                isRepeat: false,
                isMuted: false,
                isHoverOn: false,
                config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
                songs: [
                    {
                        name: "Nevada",
                        singer: "Vicetone (ft. Cozi Zuehlsdorff)",
                        url: "/resources/music/Vicetone - Nevada (ft. Cozi Zuehlsdorff).mp3",
                        thumbnail: "/resources/music/thumbnail/nevada.jpg"
                    },
                    {
                        name: "Summertime (Sunshine)",
                        singer: "K-391",
                        url: "/resources/music/K-391 - Summertime [Sunshine].mp3",
                        thumbnail: "/resources/music/thumbnail/summertime-k391.jpg"
                    },
                    {
                        name: "Heroes Tonight",
                        singer: "Janji (feat. Johnning)",
                        url: "/resources/music/Janji - Heroes Tonight (feat. Johnning).mp3",
                        thumbnail: "/resources/music/thumbnail/hero-tonight.jpg"
                    },
                    {
                        name: "Cradles",
                        singer: "Sub Urban",
                        url: "/resources/music/Sub Urban - Cradles.mp3",
                        thumbnail: "/resources/music/thumbnail/cradles.jpg"
                    },
                    {
                        name: "Waiting For Love",
                        singer: "Avicii",
                        url: "/resources/music/Avicii - Waiting For Love.mp3",
                        thumbnail: "/resources/music/thumbnail/waiting-for-love.jpg"
                    },
                    {
                        name: "Reality",
                        singer: "Lost Frequencies",
                        url: "/resources/music/Reality - Lost Frequencies.mp3",
                        thumbnail: "/resources/music/thumbnail/Reality - Lost Frequencies.jpg"
                    },
                    {
                        name: "潮汐 (Thuỷ Triều)",
                        singer: "傅梦彤 (Phó Mộng Đồng)",
                        url: "/resources/music/BGM_01.mp3",
                        thumbnail: "/resources/music/thumbnail/潮汐.jpg"
                    },
                    {
                        name: "白月光与朱砂痣 (Bạch Nguyệt Quang Và Nốt Chu Sa)",
                        singer: "大籽 (Đại Tử)",
                        url: "/resources/music/BGM_02.mp3",
                        thumbnail: "/resources/music/thumbnail/白月光与朱砂痣.jpg"
                    },
                    {
                        name: "Người theo đuổi ánh sáng",
                        singer: "Từ Vi",
                        url: "/resources/music/BGM_03.mp3",
                        thumbnail: "/resources/music/thumbnail/nguoi-theo-duoi-anh-sang.jpg"
                    },
                    {
                        name: "Probably",
                        singer: "YOASOBI",
                        url: "/resources/music/YOASOBIたふん.mp3",
                        thumbnail: "/resources/music/thumbnail/Probably.jpg"
                    },
                    {
                        name: "Tracing That Dream",
                        singer: "YOASOBI",
                        url: "/resources/music/YOASOBIあの夢をなぞって.mp3",
                        thumbnail: "/resources/music/thumbnail/YOASOBI-Tracing-That-Dream.jpg"
                    },
                    {
                        name: "Encore",
                        singer: "YOASOBI",
                        url: "/resources/music/YOASOBIアンコール.mp3",
                        thumbnail: "/resources/music/thumbnail/encore-yoasobi.jpg"
                    },
                    {
                        name: "Racing into The Night",
                        singer: "YOASOBI",
                        url: "/resources/music/YOASOBI「夜に駆ける」.mp3",
                        thumbnail: "/resources/music/thumbnail/racing-into-the-night.jpg"
                    }
                ],
                loadConfig: function () {
                    this.isRandom = this.config.isRandom;
                    this.isRepeat = this.config.isRepeat;

                    randomBtn.classList.toggle('active', this.isRandom);
                    repeatBtn.classList.toggle('active', this.isRepeat);
                    this.setVolume(75);
                },
                setConfig: function (key, value) {
                    this.config[key] = value;
                    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
                },
                render: function () {
                    const htmls = this.songs.map((song, index) => {
                        return `
                        <div class="song" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.thumbnail}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                        `
                    })
                    playlist.innerHTML = htmls.join('');
                },
                defineProperties: function () {
                    Object.defineProperty(this, 'currentSong', {
                        get: function () {
                            return this.songs[this.currentIndex];
                        }
                    })
                },
                handleEvents: function () {
                    const _this = this;
                    const cdWidth = cd.offsetWidth;

                    const cdThumbAnimate = cdThumb.animate([{
                        transform: 'rotate(360deg)'
                    }], {
                        duration: 10000,
                        iterations: Infinity

                    })
                    cdThumbAnimate.pause();

                    volumeBtn.onclick = function (e) {
                        if (e.target.closest('.btn .btn-volume')) {
                            _this.isMuted = !_this.isMuted;
                            _this.setVolume(_this.isMuted ? 1 : 75);
                        }
                    }

                    volumeHoverBox.onclick = function (e) {
                        let value = e.offsetX;

                        _this.setVolume(value);
                    }

                    volumeHoverBox.onwheel = function (e) {
                        let value = +volumeBar.value + e.deltaY * 0.1;

                        _this.setVolume(value);
                    }

                    volumeHoverBox.ontouchmove = function (e) {
                        let value = e.offsetX <= 100 ? e.offsetX : 100;

                        _this.setVolume(value);
                    }

                    resizeBtn.onclick = function () {
                        _this.isExpanding = !_this.isExpanding;
                        player.classList.toggle('shrinking', !_this.isExpanding);

                        cd.style.width = _this.isExpanding ? cdWidth + 'px' : 0;
                        playlist.style.marginTop = _this.isExpanding ? 350 + 'px' : 200 + 'px';
                    }

                    playBtn.onclick = function () {
                        if (_this.isPlaying) {
                            audio.pause();
                        } else {
                            audio.play();
                        }
                    }

                    audio.onplay = function () {
                        _this.isPlaying = true;
                        player.classList.add('playing');
                        cdThumbAnimate.play();
                    }

                    audio.onpause = function () {
                        _this.isPlaying = false;
                        player.classList.remove('playing');
                        cdThumbAnimate.pause();
                    }

                    audio.ontimeupdate = function () {
                        if (this.duration && !_this.isHoverOn) {
                            const percent = Math.floor(this.currentTime / this.duration * 100);
                            progress.value = percent;
                        }
                    }

                    audio.onended = function () {
                        if (_this.isRepeat) {
                            audio.play();
                        } else {
                            nextBtn.click();
                        }
                    }

                    playlist.onclick = function (e) {
                        const notCurrentSong = e.target.closest('.song:not(.active)');
                        const option = e.target.closest('.option');

                        if (notCurrentSong && !option) {
                            _this.currentIndex = notCurrentSong.dataset.index;
                            _this.loadCurrentSong();
                            audio.play();
                        }
                    }

                    progress.onmousedown = function () {
                        _this.isHoverOn = true;
                    }

                    progress.onmouseup = function () {
                        _this.isHoverOn = false;
                    }

                    progress.onchange = function (e) {
                        const percent = e.target.value;
                        audio.currentTime = audio.duration / 100 * percent;
                    }

                    prevBtn.onclick = function () {
                        if (_this.isRandom) {
                            _this.randomSong();
                        } else {
                            _this.prevSong();
                        }
                        audio.play();
                    }

                    nextBtn.onclick = function () {
                        if (_this.isRandom) {
                            _this.randomSong();
                        } else {
                            _this.nextSong();
                        }
                        audio.play();
                    }

                    randomBtn.onclick = function () {
                        _this.isRandom = !_this.isRandom;
                        _this.setConfig('isRandom', _this.isRandom);
                        this.classList.toggle('active', _this.isRandom);
                    }

                    repeatBtn.onclick = function () {
                        _this.isRepeat = !_this.isRepeat;
                        _this.setConfig('isRepeat', _this.isRepeat);
                        this.classList.toggle('active', _this.isRepeat);
                    }
                },
                loadCurrentSong: function () {
                    heading.textContent = this.currentSong.name
                    cdThumb.style.backgroundImage = `url('${this.currentSong.thumbnail}')`
                    audio.src = this.currentSong.url;

                    this.activeCurrentSong();
                },
                setVolume: function (value) {
                    const fill = $('.btn-volume .bar .bar-fill');

                    if (!value || value > 100) {
                        value = 100;
                    } else if (value < 1) {
                        value = 1;
                    }

                    fill.style.width = value + '%';
                    audio.volume = value != 1 ? value / 100 : 0;
                    volumeBar.value = value;

                    if (volumeBar.value == 1 && !this.isMuted) this.isMuted = true;

                    volumeBtn.classList.toggle('up', volumeBar.value > 60);
                    volumeBtn.classList.toggle('down', volumeBar.value <= 60 && volumeBar.value > 20);
                    volumeBtn.classList.toggle('off', volumeBar.value <= 20 && volumeBar.value > 1);
                    volumeBtn.classList.toggle('muted', volumeBar.value == 1);
                },
                prevSong: function () {
                    this.currentIndex--;
                    if (this.currentIndex < 0) {
                        this.currentIndex = this.songs.length - 1;
                    }
                    this.loadCurrentSong();
                },
                nextSong: function () {
                    this.currentIndex++;
                    if (this.currentIndex >= this.songs.length) {
                        this.currentIndex = 0;
                    }
                    this.loadCurrentSong();
                },
                randomSong: function () {
                    let newIndex;
                    do {
                        newIndex = Math.floor(Math.random() * this.songs.length);
                    } while (newIndex === this.currentIndex);

                    this.currentIndex = newIndex;
                    this.loadCurrentSong();
                },
                activeCurrentSong: function () {
                    const songs = $$('.song');
                    // remove active class
                    for (const song of songs) {
                        song.classList.remove('active');
                    }
                    // add active class to current song
                    songs[this.currentIndex].classList.add('active');

                    // scroll current song to view
                    setTimeout(() => {
                        songs[this.currentIndex].scrollIntoView({
                            behavior: 'smooth',
                            block: 'end'
                        });
                    }, 250);
                },
                start: function () {
                    this.loadConfig();

                    this.defineProperties();

                    this.handleEvents();

                    app.render();

                    app.loadCurrentSong();

                }
            };

            app.start();
        }
    }
})

/* COmpare To Directive */
app.directive('compareTo', function () {
    return {
        require: "ngModel",
        scope: {
            compareValue: "=compareTo"
        },
        link: function (scope, element, attributes, modelVal) {

            modelVal.$validators.compareTo = function (val) {
                return val == scope.compareValue;
            };

            scope.$watch("compare", function () {
                modelVal.$validate();
            });
        }
    };
});


app.directive("uniqueUsername", function (userService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                if (!ngModel || !element.val()) return;
                let username = element.val();
                userService.checkUniqueValue(username)
                    .then(function (response) {
                        if (username == element.val()) {
                            const unique = response.data.content;
                            ngModel.$setValidity('uniqueUsername', unique);
                            scope.$broadcast('show-errors-check-validity');
                        }
                    });
            });
        }
    }
});


/* Datatables Directive */
app.directive('datatables', function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {
            let options = scope.$eval($(element).attr('data-options'));
            $(element).DataTable(options);
        }
    }
});