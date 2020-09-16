
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
        loaderTag.innerHTML = '2';
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
                // 학기 번호 - 학기 바뀌면 업데이트 필요 //
                // 학기 관련 정보: {"results":[{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2017-12-14T15:00:00.000Z","endDate":"2018-01-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2017년 겨울학기","id":"_10_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2018-12-23T15:00:00.000Z","endDate":"2019-01-15T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2018년 겨울 계절학기","id":"_14_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2018-06-21T15:00:00.000Z","endDate":"2018-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2018년 여름학기","id":"_12_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2018-02-28T15:00:00.000Z","endDate":"2018-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2018년 1학기","id":"_11_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2018-09-02T15:00:00.000Z","endDate":"2018-12-21T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2018년 2학기","id":"_13_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2019-12-23T15:00:00.000Z","endDate":"2020-01-15T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2019년 겨울학기","id":"_18_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2019-06-20T15:00:00.000Z","endDate":"2019-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2019년 여름학기","id":"_16_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2019-02-28T15:00:00.000Z","endDate":"2019-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2019년 1학기","id":"_15_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2019-08-31T15:00:00.000Z","endDate":"2020-02-29T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2019년 2학기","id":"_17_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2020년 겨울학기","id":"_26_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2020년 여름학기","id":"_24_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2020-03-15T15:00:00.000Z","endDate":"2020-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2020년 1학기","id":"_23_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2020년1학기(미래인재교육원)","id":"_68_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2020-08-31T15:00:00.000Z","endDate":"2021-02-28T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2020년 2학기","id":"_25_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2020년2학기(미래인재교육원)","id":"_83_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2021년 겨울학기","id":"_22_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2021년 여름학기","id":"_20_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2021년 1학기","id":"_19_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2021년 2학기","id":"_21_1"}],"paging":{"previousPage":"","nextPage":"","count":19,"limit":1000,"offset":0},"permissions":null} //
                if (courses[i].course.termId != '_25_1') continue;

                if (window.bbHelperAxiosCount) ++window.bbHelperAxiosCount;
                else window.bbHelperAxiosCount = 1;
                window.bbHelperInit = false;
                (function req(ix, ci) {
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
                            // --window.bbHelperAxiosCount;
                            req(ix, ci);
                        });
                    }, 50 * i);
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
                window.bbHelperResultTable = [];
                for (var i = 0; i < window.bbHelperCourseList.length; ++i) {
                    if (window.bbHelperCourseList[i]) parseData(window.bbHelperCourseList[i].name, window.bbHelperCourseList[i].body, i);
                }
                document.querySelector("#bbHelperLoader").innerHTML = '1';
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
        if (document.querySelector('#bbHelperModal')) return;
        if (!window.bbHelperPFFilterMode) window.bbHelperPFFilterMode = 1;
        if (!window.bbHelperBlankFilterMode) window.bbHelperBlankFilterMode = 1;
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
            .bbHelperNavigation {
                width: 100%;
                height: 50px;
                text-align: right;
                border-bottom: 1px solid rgba(0, 0, 0, 0.15);
            }
            .bbHelperDropdownBtn {
                width: 220px;
                height: 100%;
                font-size: 18px;
                border-left: 1px solid rgba(0, 0, 0, 0.15);
            }
            .bbHelperSection {
                width: 100%;
                overflow: hidden auto;
                height: calc(100% - 150px);
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
            .bbHelperTable tbody tr {
                border-bottom: 1px solid #ececec;
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
            <h1>BB Helper Attendance Table</h1>
        </div>
        <div class="bbHelperNavigation">
            <button id="bbHelperPFFilter" class="bbHelperDropdownBtn"></button>
            <button id="bbHelperBlankFilter" class="bbHelperDropdownBtn"></button>
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
        var PFFilterTitle = [ 'F만 보이게', 'P만 보이게', 'F, P 둘 다 보이게' ];
        var blankFilterTitle = [ '출석없는 과목 안보이게', '출석 없어도 보이게' ];
        var bbHelperPFFilter = document.querySelector('#bbHelperPFFilter');
        var bbHelperBlankFilter = document.querySelector('#bbHelperBlankFilter');
        bbHelperPFFilter.innerText = PFFilterTitle[window.bbHelperPFFilterMode - 1];
        bbHelperBlankFilter.innerText = blankFilterTitle[window.bbHelperBlankFilterMode - 1];
        bbHelperPFFilter.addEventListener('click', function() {
            window.bbHelperPFFilterMode = (window.bbHelperPFFilterMode) % 3 + 1;
            modal.parentNode.removeChild(modal);
            script();
            return;
        });
        bbHelperBlankFilter.addEventListener('click', function() {
            window.bbHelperBlankFilterMode = (window.bbHelperBlankFilterMode) % 2 + 1;
            modal.parentNode.removeChild(modal);
            script();
            return;
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
            var tbody = document.createElement('tbody');
            var useCount = 0;
            for (var j = 1; j < value.length; ++j) {
                var jvalue = value[j];
                if (!((window.bbHelperPFFilterMode & 1 && jvalue[6] == 'F') || (window.bbHelperPFFilterMode & 2 && jvalue[6] == 'P'))) continue;
                tbody.innerHTML += \`
                <tr style="background-color:\${jvalue[6] == 'F' ? 'rgba(255, 0, 0, 0.15)' : 'rgba(0, 0, 255, 0.15)'};">
                    <td>\${jvalue[0]}</td>
                    <td>\${jvalue[1]}</td>
                    <td>\${jvalue[4]}</td>
                    <td style="font-weight:900; color:\${jvalue[6] == 'F' ? '#ff0000' : '#0000ff'};">\${jvalue[6]}</td>
                </tr>
                \`;
                useCount += 1;
            }
            if ((window.bbHelperBlankFilterMode == 1 && useCount) || (window.bbHelperBlankFilterMode != 1)) {
                title.innerHTML = value[0];
                bbHelperSection.appendChild(title);
                table.appendChild(tbody);
                bbHelperSection.appendChild(table);
            }
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
    // CDN 설정 //
    chrome.tabs.executeScript({
        code: init,
    }, function() {});
    // CDN 설정 및 라이브러리 로딩이 끝나면 데이터 수집 및 모달 열기 //
    var rinterval = setInterval(function() {
        chrome.tabs.executeScript({
            code: 'document.querySelector("#bbHelperLoader").innerHTML',
        }, function(res) {
            if (res == '2') {
                clearInterval(rinterval);
                // 데이터 가져오기 //
                chrome.tabs.executeScript({
                    code: readCourseID,
                }, function() {});
                // 데이터 로딩 완료 시 데이터를 가공 //
                chrome.tabs.executeScript({
                    code: parseData,
                }, function() {});
            }
        })
    }, 100);
    // 모든 데이터가 로드되면 모달 창을 띄워 줌 //
    var linterval = setInterval(function() {
        chrome.tabs.executeScript({
            code: 'document.querySelector("#bbHelperLoader").innerHTML',
        }, function(res) {
            if (res == '1') {
                clearInterval(linterval);
                chrome.tabs.executeScript({
                    code: createModal,
                }, function() {});
            }
        })
    }, 100);
});