/* 静态配置参数 */
const constans = {
 //apiBase : 'http://127.0.0.1:9999',
 //socketUrl: 'http://127.0.0.1:9999/WowCheat',
 //apiBase: 'https://www.cinle.icu:1288',
 //socketUrl: 'https://www.cinle.icu:1288/WowCheat',

 //nginx代理，非真实访问路径,域名前缀www使用了CDN，所以这里不使用www前缀，保证后台api不走CDN
 apiBase: 'https://cinle.icu/wowcheatapi',
 socketUrl: 'https://cinle.icu/wowcheatapi/WowCheat',
}
export default constans