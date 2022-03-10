// 计算时间
const TimeUtils = {
    // 计算出时间差，转成昨天，前天，星期x，年月日
    formatForSimpleView(time) {
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
            return day.getFullYear() + ' / ' + (day.getMonth() + 1) + '/' + day.getDate()
        }
    }
}
export default TimeUtils;