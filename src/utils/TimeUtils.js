// 计算时间
const TimeUtils = {
    // 计算时差（单位：分）
    ComputeDiffMinutes(time1,time2){
        if(time1 == null || time2 == null){
            return
        }

        if (time1.search("-") != -1) {
            time1 = time1.replace(/-/g, '/')
        }  
        if (time2.search("-") != -1) {
            time2 = time2.replace(/-/g, '/')
        }  
        let day1 = new Date(time1) 
        let day2 = new Date(time2) 
        let between = day1.getMinutes() - day2.day1.getMinutes() 
        return between
    },

    // 计算出时间差，转成昨天，前天，星期x，年月日
    formatForSimpleView(time) {
        if(time == null){
            return
        }

        let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        if (time == "") {
            return ""
        }
        if (time.search("-") != -1) {
            time = time.replace(/-/g, '/')
        }
        let now = new Date()
        let day = new Date(time)
        let between = now.getDate() - day.getDate() 
        if (1 > between && between >= 0) {
            return day.getHours() + ':' + day.getMinutes()
        }
        if (2 > between && between >= 1) {
            return '昨天'
        }
        if (3 > between && between >= 2) {
            return '前天'
        }
        if (7 > between && between >= 3) {
            let weekdif = now.getDay() - day.getDay()
            if ( now.getDay() == 0 || weekdif > 0) {
                return week[day.getDay()]
            }else{
                return day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate() 
            }
        }
        if (between >= 7) {
            return day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
        }
    },

    formatForDetial(time) {
        let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

        if (time == "") {
            return ""
        }
        if (time.search("-") != -1) {
            time = time.replace(/-/g, '/')
        }
        let now = new Date()
        let day = new Date(time)
        let between = now.getDate() - day.getDate() 
        if (1 > between && between >= 0) {
            return day.getHours() + ':' + day.getMinutes()
        }
        if (2 > between && between >= 1) {
            return '昨天'
        }
        if (3 > between && between >= 2) {
            return '前天'
        }
        if (7 > between && between >= 3) {
            let weekdif = now.getDay() - day.getDay()
            if ( now.getDay() == 0 || weekdif > 0) {
                return week[day.getDay()]
            }else{
                return day.getFullYear() + '年' + (day.getMonth() + 1) + '月' + day.getDate() + '日' + day.getHours() + ':' + day.getMinutes()
            }
        }
        if (between >= 7) {
            return day.getFullYear() + '年' + (day.getMonth() + 1) + '月' + day.getDate() + '日' + day.getHours() + ':' + day.getMinutes()
        }
    }
}
export default TimeUtils;