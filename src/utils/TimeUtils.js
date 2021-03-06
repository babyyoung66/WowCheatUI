// 计算时间
const TimeUtils = {
    //获取时间戳
    getMillis(time) {
        if (time == null || time == '' || typeof (time) == 'object') {
            let now = new Date()
            let mill = now.getTime()
            return mill
        }

        if (time.indexOf("-") != -1) {
            time = time.replace(/-/g, '/')
        }
        let day = new Date(time)
        return day.getTime()
    },
    // 计算时差（单位：分）
    ComputeDiffMinutes(startTime, endTime) {
        if (startTime == null || startTime == '' || endTime == null || endTime == '') {
            return 0
        }

        if (endTime.indexOf("-") != -1) {
            endTime = endTime.replace(/-/g, '/')
        }
        if (startTime.indexOf("-") != -1) {
            startTime = startTime.replace(/-/g, '/')
        }
        let day1 = new Date(endTime)
        let day2 = new Date(startTime)
        let diff = (day1.getTime() - day2.getTime()) / (60 * 1000)
        //向下取整
        return Math.ceil(diff)

    },

    // 计算出时间差，转成昨天，前天，星期x，年月日
    formatForSimpleView(time) {
        if (time == null || time == "") {
            return ""
        }

        let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

        if (time.indexOf("-") != -1) {
            time = time.replace(/-/g, '/')
        }
        var today = new Date()
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        let day = new Date(time)
        let between = (today.getTime() - day.getTime()) / 24 / 60 / 60 / 1000
        let nowYear = today.getFullYear()
        let dayYear = day.getFullYear()
        if (between < 0) {
            return this.dateForMat("hh:mm", day)
        }
        if (1 >= between && between > 0) {
            return '昨天'
        }
        if (2 >= between && between > 1) {
            return '前天'
        }
        if (5 > between && between > 2) {
            let weekdif = today.getDay() - day.getDay()
            if (today.getDay() == 0 || weekdif > 0) {
                return week[day.getDay()]
            } else {
                return (day.getMonth() + 1) + '/' + day.getDate()
            }
        }
        if (between >= 5) {
            if (nowYear == dayYear) {
                return (day.getMonth() + 1) + '/' + day.getDate()
            } else {
                return day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
            }

        }
    },

    formatForDetial(time) {
        let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

        if (time == null || time == "") {
            return ""
        }
        if (time.search("-") != -1) {
            time = time.replace(/-/g, '/')
        }
        var today = new Date()
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        let day = new Date(time)
        let between = (today.getTime() - day.getTime()) / 24 / 60 / 60 / 1000
        let nowYear = today.getFullYear()
        let dayYear = day.getFullYear()
        if (between < 0) {
            return this.dateForMat("hh:mm", day)
        }
        if (1 >= between && between > 0) {
            return '昨天    ' + this.dateForMat("hh:mm", day)
        }
        if (2 >= between && between > 1) {
            return '前天    ' + this.dateForMat("hh:mm", day)
        }
        if (5 > between && between > 2) {
            let weekdif = today.getDay() - day.getDay()
            if (today.getDay() == 0 || weekdif > 0) {
                return week[day.getDay()] + '   ' + this.dateForMat("hh:mm", day)
            } else {
                return (day.getMonth() + 1) + '月' + day.getDate() + '日     ' + this.dateForMat("hh:mm", day)
            }
        }
        if (between >= 5) {
            if (nowYear == dayYear) {
                return (day.getMonth() + 1) + '月' + day.getDate() + '日     ' + this.dateForMat("hh:mm", day)
            } else {
                return day.getFullYear() + '年' + (day.getMonth() + 1) + '月' + day.getDate() + '日     ' + this.dateForMat("hh:mm", day)
            }
        }
    },
    dateForMatDefault(date) {
        if (date == null || date == '') {
            date = new Date()
        }
        let fmt = "yyyy-MM-dd hh:mm:ss.S"
        return this.dateForMat(fmt, date)
    },

    // mess.time = TimeUtils.dateForMat("yyyy-MM-dd hh:mm:ss.S",new Date())
    dateForMat(fmt, date) {
        var o = {
            "M+": date.getMonth() + 1,                 //月份   
            "d+": date.getDate(),                    //日   
            "h+": date.getHours(),                   //小时   
            "m+": date.getMinutes(),                 //分   
            "s+": date.getSeconds(),                 //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}
export default TimeUtils;