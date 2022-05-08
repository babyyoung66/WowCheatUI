const utils = {
    // 深克隆
    deepClone(target) {
        let result;
        // 如果当前需要深拷贝的是一个对象的话
        if (typeof target === 'object') {
            // 如果是一个数组的话
            if (Array.isArray(target)) {
                result = []; // 将result赋值为一个数组，并且执行遍历
                for (let i in target) {
                    // 递归克隆数组中的每一项
                    result.push(deepClone(target[i]))
                }
                // 判断如果当前的值是null的话；直接赋值为null
            } else if (target === null) {
                result = null;
                // 判断如果当前的值是一个RegExp对象的话，直接赋值    
            } else if (target.constructor === RegExp) {
                result = target;
            } else {
                // 否则是普通对象，直接for in循环，递归赋值对象的所有值
                result = {};     
                for (let i in target) {   
                   result[i] = this.deepClone(target[i]);
                }
            }
            // 基本数据类型，那么直接赋值
        } else {
            result = target;
        }
        // 返回最终结果
        return result;
    },
    hasText(object,key){
        if(object === null || object === undefined || typeof(object) === 'undefined' ){
            return false
        }
        let value = object[key]
        if( value === null || value === undefined || typeof(value) === 'undefined' || value.trim() === '' || value.length == 0){
            return false
        }
        return true
    },

    // 中英文字符串排序
    mySort(value1,value2){
        let reg = /[a-zA-Z0-9]/
        if(reg.test(value1)&& reg.test(value2)){
            if(value1>value2){
                return 1
            }else if(value1<value2){
                return -1
            }else{
                return 0
            }
         }else {
            return value1.localeCompare(value2)
         }
    }

    
}
export default utils;