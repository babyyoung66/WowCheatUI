// 计算时间
const TimeUtils = {
    //获取时间戳
    getMillis(time){
        if (time == null || time == '' || time == null || time == '' || typeof(time) == 'object') {
            return new Date().getTime()
        }

        if (time.indexOf("-") != -1) {
            time = time.replace(/-/g, '/')
        }
        return new Date(time).getTime()
    },
    // 计算时差（单位：分）
    ComputeDiffMinutes(before, after) {
        if (before == null || before == '' || after == null || after == '') {
            return 0
        }

        if (after.indexOf("-") != -1) {
            after = after.replace(/-/g, '/')
        }
        if (before.indexOf("-") != -1) {
            before = before.replace(/-/g, '/')
        }
        let day1 = new Date(after)
        let day2 = new Date(before)
        let diff = (day1.getTime() - day2.getTime()) / (60*1000)
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
        let now = new Date()
        let day = new Date(time)
        let between = now.getDate() - day.getDate()
        if (1 > between && between >= 0) {
           return  this.dateForMat("hh:mm",day)
        }
        if (2 > between && between >= 1) {
            return '昨天'
        }
        if (3 > between && between >= 2) {
            return '前天'
        }
        if (7 > between && between >= 3) {
            let weekdif = now.getDay() - day.getDay()
            if (now.getDay() == 0 || weekdif > 0) {
                return week[day.getDay()]
            } else {
                return day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
            }
        }
        if (between >= 7) {
            return day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
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
        let now = new Date()
        let day = new Date(time)
        let between = now.getDate() - day.getDate()
        if (1 > between && between >= 0) {
            return  this.dateForMat("hh:mm",day)
        }
        if (2 > between && between >= 1) {
            return '昨天　' + this.dateForMat("hh:mm",day)
        }
        if (3 > between && between >= 2) {
            return '前天　' + this.dateForMat("hh:mm",day)
        }
        if (7 > between && between >= 3) {
            let weekdif = now.getDay() - day.getDay()
            if (now.getDay() == 0 || weekdif > 0) {
                return week[day.getDay()] + '　' + this.dateForMat("hh:mm",day)
            } else {
                return day.getFullYear() + '年' + (day.getMonth() + 1) + '月' + day.getDate() + '日　' + this.dateForMat("hh:mm",day)
            }
        }
        if (between >= 7) {
            return day.getFullYear() + '年' + (day.getMonth() + 1) + '月' + day.getDate() + '日　' + this.dateForMat("hh:mm",day)
        }
    },
    dateForMatDefault(date){
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