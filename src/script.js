
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
 * 모든 데이터가 로드가 완료되면 데이터를 가공해서 저장함
 * 0.1초마다 데이터 로드 완료 여부를 검사함
 */
var parseData = `
(function() {
    function script() {
        function parseData(table, ix) {
            var ptable;
            table = table.slice(table.indexOf('<tbody'));
            table = table.slice(0, table.indexOf('</tbody>') + 8);
            window.bbHelperResultTable[ix] = [];
            for (var b = 0, bc = 0, idx = 0; ~table.indexOf('<span'); ++b) {
                table = table.slice(table.indexOf('<span'));
                table = table.slice(table.indexOf('>') + 1);
                ptable = table.slice(0, table.indexOf('</span'));
                if (b & 1) {
                    if (bc == 0) window.bbHelperResultTable[ix][idx] = [];
                    window.bbHelperResultTable[ix][idx].push(ptable);
                    if (++bc % 7 == 0) ++idx;
                    bc %= 7;
                }
            }
        }
        var interval = setInterval(function() {
            if (!(window.bbHelperInit || window.bbHelperAxiosCount)) {
                clearInterval(interval);
                window.bbHelperResultTable = [];
                for (var i = 0; i < window.bbHelperCourseList.length; ++i) {
                    if (window.bbHelperCourseList[i]) parseData(window.bbHelperCourseList[i].body, i);
                }
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
 * 데이터 로드 버튼을 누르면 시작함
 * 데이터 로드는 페이지당 최대 1회만 진행함
 */
document.addEventListener('DOMContentLoaded', function() {
    var loadBtn = document.querySelector('#load-btn');
    loadBtn.addEventListener('click', function() {
        loadBtn.classList.remove('popup-btn');
        loadBtn.classList.add('popup-disabled-btn');
        loadBtn.innerHTML = '데이터 로딩 중';
        // CDN 설정 //
        chrome.tabs.executeScript({
            code: init,
        }, function() {
            // 코스 아이디 가져오기 //
            chrome.tabs.executeScript({
                code: readCourseID,
            }, function() {});
        });
        // 데이터 로딩 완료 시 데이터를 가공 //
        chrome.tabs.executeScript({
            code: parseData,
        }, function() {});
    });
});