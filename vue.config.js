const path = require('path')
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const axios = require('axios')


const slideImages = require('./mock/slideImages.json')
const recommendList = require('./mock/recommend.json')
const hotKeys = require('./mock/hotKey.json')

const pendingPayOder = require('./mock/userOrderPendingPay.json')
const allOrder = require('./mock/userOrderAll.json')
const cancelOrder = require('./mock/userOrderCancel.json')
const completeOrder = require('./mock/userOrderComplete.json')
const logisticsOrder = require('./mock/userOrderLogistics.json')
const Ratings = require('./mock/ratings.json')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    chainWebpack(config) {
        config.resolve.alias
            .set('components', resolve('src/components'))
            .set('common', resolve('src/common'))
            .set('api', resolve('src/api'))
            .set('base', resolve('src/base'))
            .set('pages', resolve('src/pages'))
    },
    devServer: {
        before(app) {
            app.get('/api/getOderPendingPay', function (req, res) {
                res.json({
                    code: 0,
                    data: pendingPayOder
                })
            })
            app.get('/api/getOderCancel', function (req, res) {
                res.json({
                    code: 0,
                    data: cancelOrder
                })
            })
            app.get('/api/getOderComplete', function (req, res) {
                res.json({
                    code: 0,
                    data: completeOrder
                })
            })
            app.get('/api/getOderAll', function (req, res) {
                res.json({
                    code: 0,
                    data: allOrder
                })
            })
            app.get('/api/getOderLogistics', function (req, res) {
                res.json({
                    code: 0,
                    data: logisticsOrder
                })
            })
            app.get('/api/getSlideImages', function (req, res) {
                res.json({
                    code: 0,
                    data: slideImages
                })
            })
            app.get('/api/getRecommendList', function (req, res) {
                res.json({
                    code: 0,
                    data: recommendList
                })
            })
            app.get('/api/test', function (req, res) {
                var url = 'http://192.168.1.50:8080/users/product/test'
                axios.get(url, {
                    headers: {
                        referer: 'http://192.168.1.50:8080/swagger-ui.html',
                        host: '192.168.1.50:8080'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                }).catch((e) => {
                    console.log(e)
                })
            })
            app.get('/api/getHotKey', function (req, res) {
                res.json({
                    code: 0,
                    data: hotKeys
                })
            })
            app.get('/api/getGoodsListByKeyWords', function (req, res) {
                res.json({
                    code: 0,
                    data: recommendList
                })
            })
            app.get('/api/getRatings', function (req, res) {
                res.json({
                    code: 0,
                    data: Ratings
                })
            })
        },
        proxy: {
            '/api': {
                target: 'http://192.168.1.101:9090/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
            '/rongbin': {
                target: 'http://192.168.1.66:21002/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/rongbin': '/'
                }
            },
            '/jiahao':{
                target: 'http://192.168.1.101:18052/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/jiahao': '/'
                }
            },
            '/coupon':{
                target: 'http://192.168.1.53:9093/', //对应优惠券接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/coupon': '/'
                }
            },
            '/dindang':{
                target: 'http://192.168.1.53:9092/', //对应优惠券接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/dindang': '/'
                }
            },

        }
    },
    css: {
        // modules:false,
        // extract:true,
        sourceMap: false,
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer(),
                    pxtorem({
                        rootValue: 37.5,
                        propList: ['*']
                    })
                ]
            }
        }
    },
    publicPath: './'
}