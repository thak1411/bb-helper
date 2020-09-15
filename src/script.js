
/**
 * axios를 사용하기 위해 관련 CDN을 끼워넣는 코드
 */
var initCDN = `
(function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
    document.body.appendChild(script);
})();
`

/**
 * 유저 아이디 ( 블랙보드 고유 아이디 ) 와 학번을 긁어와 출석 정보를 모두 들고옴
 */
var readCourseID = `
(function() {
    function script() {
        window.userId = __initialContext.user.id;
        window.studentId = __initialContext.user.studentId;
        axios.get('https://learn.hanyang.ac.kr/learn/api/v1/users/' + userId + '/memberships?expand=course.effectiveAvailability,course.permissions,courseRole&includeCount=true&limit=10000')
        .then(function(res) {
            return res.data.results;
        })
        .then(function(courses) {
            for (var i = 0; i < courses.length; ++i) {
                (function(ix) {
                    axios.get('https://learn.hanyang.ac.kr/webapps/bbgs-OnlineAttendance-BB5a998b8c44671/app/atdView?showAll=true&custom_user_id=' + studentId + '&custom_course_id=' + courses[i].course.courseId)
                    .then(function(res) {
                        console.log(ix, courses[ix]);
                    });
                })(i);
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
`

document.addEventListener('DOMContentLoaded', function() {
    // axios 설정 //
    chrome.tabs.executeScript({
        code: initCDN,
    }, function(res) {
        // 코스 아이디 가져오기 //
        chrome.tabs.executeScript({
            code: readCourseID,
        }, function(res) {
        });
    });
});