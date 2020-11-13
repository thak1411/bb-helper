/**
 * RN's BB Helper Main Content
 * Made By RN
 */

/**
 * Hyper Paramater
 */
var bbUserId          = __initialContext.user.id;
var bbStudentId       = __initialContext.user.studentId;
var bbSemesterCode    = '_25_1';  // Need Update For New Semester / Semester Info : {"results":[{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2017-12-14T15:00:00.000Z","endDate":"2018-01-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2017년 겨울학기","id":"_10_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2018-12-23T15:00:00.000Z","endDate":"2019-01-15T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2018년 겨울 계절학기","id":"_14_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2018-06-21T15:00:00.000Z","endDate":"2018-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2018년 여름학기","id":"_12_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2018-02-28T15:00:00.000Z","endDate":"2018-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2018년 1학기","id":"_11_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2018-09-02T15:00:00.000Z","endDate":"2018-12-21T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2018년 2학기","id":"_13_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2019-12-23T15:00:00.000Z","endDate":"2020-01-15T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2019년 겨울학기","id":"_18_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2019-06-20T15:00:00.000Z","endDate":"2019-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2019년 여름학기","id":"_16_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2019-02-28T15:00:00.000Z","endDate":"2019-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2019년 1학기","id":"_15_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2019-08-31T15:00:00.000Z","endDate":"2020-02-29T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2019년 2학기","id":"_17_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2020년 겨울학기","id":"_26_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2020년 여름학기","id":"_24_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2020-03-15T15:00:00.000Z","endDate":"2020-08-31T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2020년 1학기","id":"_23_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2020년1학기(미래인재교육원)","id":"_68_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":"2020-08-31T15:00:00.000Z","endDate":"2021-02-28T14:59:59.000Z","durationType":"DATE_RANGE","daysOfUse":0,"name":"2020년 2학기","id":"_25_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2020년2학기(미래인재교육원)","id":"_83_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2021년 겨울학기","id":"_22_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2021년 여름학기","id":"_20_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2021년 1학기","id":"_19_1"},{"description":{"rawText":"","displayText":"","webLocation":null,"fileLocation":null},"startDate":null,"endDate":null,"durationType":"CONTINUOUS","daysOfUse":0,"name":"2021년 2학기","id":"_21_1"}],"paging":{"previousPage":"","nextPage":"","count":19,"limit":1000,"offset":0},"permissions":null} //
var bbPFFilterMode    = 1;
var bbBlankFilterMode = 1;

/**
 * Load Course List
 */
function fetchCourseLists() {
    return $.get('https://learn.hanyang.ac.kr/learn/api/v1/users/' + bbUserId + '/memberships?expand=course.effectiveAvailability,course.permissions,courseRole&includeCount=true&limit=10000')
    .then(function(res) {
        return res.results;
    })
}

/**
 * Load Course Attendance
 * return Promise Object For All Data Loaded
 */
function fetchCourseAttendance(courses) {
    var promiseList = [];
    for (var i = 0; i < courses.length; ++i) {
        if (courses[i].course.termId != bbSemesterCode) continue;
        
        var loadDataPromise = function(ix, ci) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    $.get('https://learn.hanyang.ac.kr/webapps/bbgs-OnlineAttendance-BB5a998b8c44671/app/atdView?showAll=true&custom_user_id=' + bbStudentId + '&custom_course_id=' + ci.course.courseId)
                    .then(function(res) {
                        resolve({
                            body: res,
                            name: ci.course.name,
                        });
                    })
                    .fail(function() {
                        loadDataPromise(ix, ci)
                        .then(function(res) {
                            resolve(res);
                        })
                    })
                }, 50 * ix);
            });
        }
        promiseList.push(loadDataPromise(i, courses[i]));
    }
    return Promise.all(promiseList);
}

/**
 * Parse Attendance Data
 */
function parseAttendanceData(courseList) {
    var resultTable = [];
    /**
     * Attendance Parsing Logic
     */
    function parseData(name, table, ix) {
        var ptable;
        table = table.slice(table.indexOf('<tbody'));
        table = table.slice(0, table.indexOf('</tbody>') + 8);
        resultTable[ix] = [ name ];
        for (var b = 0, bc = 0, idx = 1; ~table.indexOf('<span'); ++b) {
            table = table.slice(table.indexOf('<span'));
            table = table.slice(table.indexOf('>') + 1);
            ptable = table.slice(0, table.indexOf('</span'));
            if (b & 1) {
                if (bc == 0) resultTable[ix][idx] = [];
                resultTable[ix][idx].push(ptable);
                if (++bc % 7 == 0) ++idx;
                bc %= 7;
            }
        }
    }
    for (var i = 0; i < courseList.length; ++i) {
        parseData(courseList[i].name, courseList[i].body, i);
    }
    return Promise.resolve(resultTable);
}

/**
 * Create Modal
 */
function createModal(resultTable) {
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
    modal.innerHTML = `
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
    `;
    var bbHelperCloseBtn = document.querySelector('.bbHelperHeaderCloseBtn');
    bbHelperCloseBtn.addEventListener('click', function() {
        modal.parentNode.removeChild(modal);
    });
    var PFFilterTitle = [ 'F만 보이게', 'P만 보이게', 'F, P 둘 다 보이게' ];
    var blankFilterTitle = [ '출석없는 과목 안보이게', '출석 없어도 보이게' ];
    var bbHelperPFFilter = document.querySelector('#bbHelperPFFilter');
    var bbHelperBlankFilter = document.querySelector('#bbHelperBlankFilter');
    bbHelperPFFilter.innerText = PFFilterTitle[bbPFFilterMode - 1];
    bbHelperBlankFilter.innerText = blankFilterTitle[bbBlankFilterMode - 1];
    bbHelperPFFilter.addEventListener('click', function() {
        bbPFFilterMode = (bbPFFilterMode) % 3 + 1;
        modal.parentNode.removeChild(modal);
        createModal(resultTable);
        return;
    });
    bbHelperBlankFilter.addEventListener('click', function() {
        bbBlankFilterMode = (bbBlankFilterMode) % 2 + 1;
        modal.parentNode.removeChild(modal);
        createModal(resultTable);
        return;
    });
    var bbHelperSection = document.querySelector('.bbHelperSection');
    for (var i = 0; i < resultTable.length; ++i) {
        var value = resultTable[i];
        var title = document.createElement('h2');
        var table = document.createElement('table');
        table.classList.add('bbHelperTable');
        table.innerHTML = `
        <thead>
            <tr>
                <th>위치</th>
                <th>컨텐츠명</th>
                <th>컨텐츠 시간</th>
                <th>영상 출석 상태(P/F)</th>
            </tr>
        </thead>
        `;
        var tbody = document.createElement('tbody');
        var useCount = 0;
        for (var j = 1; j < value.length; ++j) {
            var jvalue = value[j];
            if (!((bbPFFilterMode & 1 && jvalue[6] == 'F') || (bbPFFilterMode & 2 && jvalue[6] == 'P'))) continue;
            tbody.innerHTML += `
            <tr style="background-color:${jvalue[6] == 'F' ? 'rgba(255, 0, 0, 0.15)' : 'rgba(0, 0, 255, 0.15)'};">
                <td>${jvalue[0]}</td>
                <td>${jvalue[1]}</td>
                <td>${jvalue[4]}</td>
                <td style="font-weight:900; color:${jvalue[6] == 'F' ? '#ff0000' : '#0000ff'};">${jvalue[6]}</td>
            </tr>
            `;
            useCount += 1;
        }
        if ((bbBlankFilterMode == 1 && useCount) || (bbBlankFilterMode != 1)) {
            title.innerHTML = value[0];
            bbHelperSection.appendChild(title);
            table.appendChild(tbody);
            bbHelperSection.appendChild(table);
        }
    }
}

/**
 * Create Modal Button
 */
function createModalButton(resultTable) {
    var modalBtn = document.createElement('div');
    modalBtn.id = 'bbHelperModalBtn';
    modalBtn.style.width = '70px';
    modalBtn.style.textAlign = 'center';
    modalBtn.style.fontSize = '12px';
    modalBtn.style.fontWeight = 'bold';
    modalBtn.style.cursor = `pointer`;
    modalBtn.style.background = `#000000`;
    modalBtn.style.color = `#ffffff`;
    modalBtn.innerHTML = `HELPER`;
    modalBtn.onclick = function() {
        createModal(resultTable);
    }
    document.querySelector('bb-page-size-selector > div').appendChild(modalBtn);
}

/**
 * Main WorkFlow
 */
function main() {
    fetchCourseLists()
    .then(fetchCourseAttendance)
    .then(function(context) {
        context.then(function(courseList) {
            parseAttendanceData(courseList)
            .then(createModalButton);
        });
    });
}

/**
 * Calling Main Application
 */
main();