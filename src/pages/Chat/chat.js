export function getServeMsg(msg, _this) {
    //console.log(msg);
    //msg 是老师传递过来的消息数据
    let msgServer = _this.formatMsg(msg);
    console.log(msgServer);
    _this.screenMsg(msgServer);
}
