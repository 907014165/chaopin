const actions = {
    CONNECT_SERVER: function ({ commit, state }, payload) {
        state.socket = require("socket.io-client")("http://218.193.110.247:9010", {
            transports: ["websocket", "polling"]
        });
        let msg = {
            uid: state.userInfo.mobile
            //头像
            //id
        };
        //客户端上线
        state.socket.on("connect", () => {
            state.socket.emit("login", msg);
        });
        //服务端连接 处理服务端过来的数据
        state.socket.on("message", msg => {
            console.log(msg);
            commit('SET_UNREAD_MESSAGE');
        });
    }
}
export default actions