import router from '../../router/router'
export function listenBack() {
    if (!window.plus) {
        return;
    }
    var webview = plus.webview.currentWebview();
    plus.key.addEventListener("backbutton", function () {
        webview.canBack(function (e) {
            if (e.canBack) {
                console.log('路由返回')
                router.goBack();
                //webview.back();
            } else {
                //webview.close(); //hide,quit
                //plus.runtime.quit();
                //首页返回键处理
                //处理逻辑：1秒内，连续两次按返回键，则退出应用；
                var first = null;
                var tmp = 1
                plus.key.addEventListener(
                    "backbutton",
                    function () {
                        //首次按键，提示‘再按一次退出应用’
                        if (!first && tmp) {
                            first = new Date().getTime();

                            plus.nativeUI.toast("再按一次退出应用");
                            setTimeout(function () {
                                first = null;
                            }, 1000);

                        } else {
                            if (new Date().getTime() - first < 1500) {
                                plus.runtime.quit();
                            }
                            tmp = 1
                        }
                    },
                    false
                );
            }
        });
    }, false);
}
