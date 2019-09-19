//good-storage 是一个操作原生localstorage的库
import storage from 'good-storage'
//定义 存取搜索历史的key
const SEARCH_KEY = '__search__'
const TOKEN_KEY = '__token__'
//历史存取最大长度
const SEARCH_MAX_LEN = 15

/* 插入函数 arr为目标数组 val为插入数据 compare为比较函数 maxLen最大长度 */
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)
    //当下标为一时 直接返回
    if (index === 0) {
        return
    }
    //大于一 说明已经存在 得删除
    if (index > 0) {
        arr.splice(index, 1)
    }
    //头部插入数据
    arr.unshift(val)
    //大于最长存储长度删除尾部
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}
//本地存储搜素历史
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    console.log('savaSearch')
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LEN)
    storage.set(SEARCH_KEY, searches)
    return searches
}
//获取本地存储数据
export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}
//清除本地搜索历史
export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}
export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteFromArray(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function setToken(token){
    storage.set(TOKEN_KEY,token)
}

export function getToken(){
    return storage.get(TOKEN_KEY,'')
}

export function removeToken(){
    storage.remove(TOKEN_KEY)
}