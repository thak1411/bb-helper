
/**
 * axios 를 사용하기 위해 관련 CDN을 끼워넣음
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
        var loaderTag = document.createElement('div');
        loaderTag.innerHTML = '0';
        loaderTag.id = "bbHelperLoader";
        loaderTag.style.display = 'none';
        document.body.appendChild(loaderTag);
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
        function parseData(name, table, ix) {
            var ptable;
            table = table.slice(table.indexOf('<tbody'));
            table = table.slice(0, table.indexOf('</tbody>') + 8);
            window.bbHelperResultTable[ix] = [ name ];
            for (var b = 0, bc = 0, idx = 1; ~table.indexOf('<span'); ++b) {
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
                document.querySelector("#bbHelperLoader").innerHTML = '1';
                window.bbHelperResultTable = [];
                for (var i = 0; i < window.bbHelperCourseList.length; ++i) {
                    if (window.bbHelperCourseList[i]) parseData(window.bbHelperCourseList[i].name, window.bbHelperCourseList[i].body, i);
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

var createModal = `
(function() {
    function script() {
        if (document.querySelector('#bbHelperModal')) return;;
        var modal = document.createElement('div');
        modal.id = 'bbHelperModal';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.position = 'absolute';
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.margin = 0;
        modal.style.zIndex = 1000000;
        modal.style.background = '#ffffff';
        document.body.appendChild(modal);
        modal.innerHTML = \`
        <style>
            .bbHelperHeader {
                width: 100%;
                height: 60px;
                text-align: center;
                background: #1d41c8;
            }
            .bbHelperHeader h1 {
                margin: 0;
                color: #ffffff;
                line-height: 60px;
                font-family: "Open Sans";
            }
            .bbHelperHeaderCloseBtn {
                left: 0;
                width: 60px;
                height: 60px;
                color: #ffffff;
                font-size: 34px;
                font-weight: 600;
                position: absolute;
            }
            .bbHelperSection {
                width: 100%;
                overflow: hidden auto;
                height: calc(100% - 100px);
            }
            .bbHelperSection h2 {
                text-align: center;
                font-family: "Open Sans";
            }
            .bbHelperTable {
                width: 100%;
                margin-bottom: 20px;
            }
            .bbHelperTable thead tr {
                border-bottom: 1px solid #ececec;
            }
            .bbHelperTable thead tr th {
                height: 35px;
            }
            .bbHelperTable tbody tr td {
                height: 30px;
                text-align: center;
                vertical-align: middle;
            }
            .bbHelperTable tbody tr:nth-child(even) {
                background: #ececec;
            }
            .bbHelperFooter {
                width: 100%;
                height: 40px;
                text-align: right;
            }
            .bbHelperFooter h2 {
                font-family: "Open Sans";
            }
        </style>
        <div class="bbHelperHeader">
            <button class="bbHelperHeaderCloseBtn">×</button>
            <h1>BB Helper Attendance List</h1>
        </div>
        <div class="bbHelperSection">
        </div>
        <div class="bbHelperFooter">
            <h2>Made By Rn</h2>
        </div>
        \`;
        var bbHelperCloseBtn = document.querySelector('.bbHelperHeaderCloseBtn');
        bbHelperCloseBtn.addEventListener('click', function() {
            modal.parentNode.removeChild(modal);
        });
        var bbHelperSection = document.querySelector('.bbHelperSection');
        for (var i = 0; i < window.bbHelperResultTable.length; ++i) {
            var value = window.bbHelperResultTable[i];
            var title = document.createElement('h2');
            var table = document.createElement('table');
            table.classList.add('bbHelperTable');
            table.innerHTML = \`
            <thead>
                <tr>
                    <th>위치</th>
                    <th>컨텐츠명</th>
                    <th>컨텐츠 시간</th>
                    <th>영상 출석 상태(P/F)</th>
                </tr>
            </thead>
            \`;
            title.innerHTML = value[0];
            bbHelperSection.appendChild(title);
            var tbody = document.createElement('tbody');
            for (var j = 1; j < value.length; ++j) {
                var jvalue = value[j];
                tbody.innerHTML += \`
                <tr>
                    <td>\${jvalue[0]}</td>
                    <td>\${jvalue[1]}</td>
                    <td>\${jvalue[4]}</td>
                    <td>\${jvalue[6]}</td>
                </tr>
                \`;
            }
            table.appendChild(tbody);
            bbHelperSection.appendChild(table);
        }
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
    var modalBtn = document.querySelector('#modal-btn');
    // CDN 설정 //
    chrome.tabs.executeScript({
        code: init,
    }, function() {});
    // 클릭 시 데이터를 불러옴 //
    loadBtn.addEventListener('click', function() {
        loadBtn.classList.remove('popup-btn');
        loadBtn.classList.add('popup-disabled-btn');
        loadBtn.innerHTML = '데이터 로딩 중';
        // 코스 아이디 가져오기 //
        chrome.tabs.executeScript({
            code: readCourseID,
        }, function() {});
        // 데이터 로딩 완료 시 데이터를 가공 //
        chrome.tabs.executeScript({
            code: parseData,
        }, function() {});
    });
    // 클릭 시 모달 창을 띄워 줌 //
    modalBtn.addEventListener('click', function() {
        chrome.tabs.executeScript({
            code: createModal,
        }, function() {});
    });
    // 모든 데이터가 로드됐는지 확인함 //
    var interval = setInterval(function() {
        chrome.tabs.executeScript({
            code: 'document.querySelector("#bbHelperLoader").innerHTML',
        }, function(res) {
            if (res == '1') {
                clearInterval(interval);
                loadBtn.innerHTML = '데이터 로딩 완료';
                loadBtn.classList.remove('popup-btn');
                loadBtn.classList.add('popup-disabled-btn');
                modalBtn.classList.add('popup-btn');
                modalBtn.classList.remove('popup-disabled-btn');
            }
        })
    }, 100);
});