const actions = {
    CONNECT_SERVER: function ({ commit, state }, payload) {
        state.socket = require("socket.io-client")("http://218.193.110.247:9010?token=Bearer "+state.token, {
            transports: ["websocket", "polling"]
        });
        let msg = {
            uid: state.userInfo.mobile
            //头像
            //id
        };
        state.reconnection = false
        //客户端上线
        state.socket.on("connect", () => {
            state.socket.emit("login", msg);
        });
        //服务端连接 处理服务端过来的数据
        state.socket.on("message", msg => {
            console.log(msg);
            commit('SET_UNREAD_MESSAGE');
        });
    },
    LOGIN_OUT: function ({ commit, state }, payload) {
        commit('REMOVE_TOKEN')
        commit('REMOVE_THIRD_LOGIN_INFO')
        commit('REMOVE_SOCKET')
        commit('REMOVE_THIRD_LOGIN_INFO')
        commit('SET_RECONNECTION', true)
    }
}
export default actions