
/**
 * axios / cheerio 를 사용하기 위해 관련 CDN을 끼워넣음
 */
var init = `
(function() {
    function script() {
        window.bbHelperInit = true;
        window.bbHelperCourseList = [];
        if (window.bbHelperCDN) return;
        window.bbHelperCDN = true;
        var axiosScript = document.createElement('script');
        axiosScript.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
        document.body.appendChild(axiosScript);
        var cheerioScript = document.createElement('script');
        cheerioScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/cheerio/0.22.0/index.min.js';
        document.body.appendChild(cheerioScript);
    }
    
    function inject(fn) {
        var script = document.createElement('script');
        script.text = '(' + fn.toString() + ')()';
        document.body.appendChild(script);
    }
    
    inject(script);
})();
`;

/**
 * 유저 아이디 ( 블랙보드 고유 아이디 ) 와 학번을 긁어와 출석 정보를 모두 들고옴
 * TODO: 코드 상 script 태그가 계속 생기는데 없앨 수 있는 방법 고민
 */
var readCourseID = `
(function() {
    function script() {
        window.bbHelperUserId = __initialContext.user.id;
        window.bbHelperStudentId = __initialContext.user.studentId;
        axios.get('https://learn.hanyang.ac.kr/learn/api/v1/users/' + window.bbHelperUserId + '/memberships?expand=course.effectiveAvailability,course.permissions,courseRole&includeCount=true&limit=10000')
        .then(function(res) {
            return res.data.results;
        })
        .then(function(courses) {
            for (var i = 0; i < courses.length; ++i) {
                if (window.bbHelperAxiosCount) ++window.bbHelperAxiosCount;
                else window.bbHelperAxiosCount = 1;
                window.bbHelperInit = false;
                (function(ix, ci) {
                    setTimeout(function() {
                        axios.get('https://learn.hanyang.ac.kr/webapps/bbgs-OnlineAttendance-BB5a998b8c44671/app/atdView?showAll=true&custom_user_id=' + window.bbHelperStudentId + '&custom_course_id=' + ci.course.courseId)
                        .then(function(res) {
                            --window.bbHelperAxiosCount;
                            window.bbHelperCourseList[ix] = {
                                body: res.data,
                                name: ci.course.name,
                            };
                        })
                        .catch(function() {
                            --window.bbHelperAxiosCount;
                        });
                    }, 200 * i);
                })(i, courses[i]);
            }
        });
    }
    
    function inject(fn) {
        var script = document.createElement('script');
        script.text = '(' + fn.toString() + ')()';
        document.body.appendChild(script);
    }
    
    inject(script);
})();
`;

/**
 * 모든 데이터가 로드가 완료되면 화면에 테이블 모달을 띄워줌
 * 0.1초마다 데이터 로드 완료 여부를 검사함
 */
var drawContent = `
(function() {
    function script() {
        function makeParserTree() {
            document.querySelector('html').innerHTML = window.bbHelperCourseList[4].body;
        }

        var interval = setInterval(function() {
            if (!(window.bbHelperInit || window.bbHelperAxiosCount)) {
                clearInterval(interval);
                makeParserTree();
            }
        }, 100);
    }
    
    function inject(fn) {
        var script = document.createElement('script');
        script.text = '(' + fn.toString() + ')()';
        document.body.appendChild(script);
    }
    
    inject(script);
})();
`;

/**
 * 익스텐션 버튼을 누르면 시작함
 */
document.addEventListener('DOMContentLoaded', function() {
    // CDN 설정 - 1회만 설정 함 //
    chrome.tabs.executeScript({
        code: init,
    }, function() {
        // 코스 아이디 가져오기 //
        chrome.tabs.executeScript({
            code: readCourseID,
        }, function() {});
    });
    // 데이터 완료 시 모달을 그려줌 //
    chrome.tabs.executeScript({
        code: drawContent,
    }, function() {});
});