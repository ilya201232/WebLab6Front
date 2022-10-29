import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { createStore } from "vuex";
import axios from "axios";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from 'socket.io-client'

const store = createStore({
    state() {
        return {
            is_working: false,
            current_date: "",
            current_values: [],
        }
    },
    mutations: {
        startSim: (state, data) => {
            state.is_working = data.is_working;
            state.current_date = data.current_date;
        },
        updateSimDate: (state) => {
            if (!state.is_working)
                console.error("Cannot update sim day when simulation is not upped in store!");
            let simulationDay = new Date(state.current_date);
            simulationDay.setDate(simulationDay.getDate() + 1);

            state.current_date = simulationDay.toLocaleDateString("en-US");
        },
        stopSim: (state) => {
            state.is_working = false;
            state.current_date = "";
            state.current_values = [];
        },
        setCurrentValues: (state, data) => {
            state.current_values = data;
        }

    },
    actions: {
        SOCKET_connect: async (context) => {
            console.log("Connected to lab 5 server!");

            const simStatusResponse = await axios.get("http://localhost:3200/api/get_sim_status");

            if (simStatusResponse.data) {
                const simDateResponse = await axios.get("http://localhost:3200/api/get_sim_date");
                const currentDay = new Date(simDateResponse.data);

                context.commit("startSim", {
                    is_working: true,
                    current_date: currentDay.toLocaleDateString("en-US")
                });

                const getCurrentStocksResponse = await axios.get("http://localhost:3200/api/get_current_stocks_values");

                context.commit("setCurrentValues", getCurrentStocksResponse.data);

            }
        },
        SOCKET_start: async (context, data) => {
            context.commit("startSim", {
                is_working: true,
                current_date: JSON.parse(data).start_date
            });

            axios.get("http://localhost:3200/api/get_current_stocks_values").then((res) => {
                context.commit("setCurrentValues", res.data);
            });
        },
        SOCKET_update: async (context) => {
            context.commit("updateSimDate");
        },
        SOCKET_stocks_update: (context, data) => {
            context.commit("setCurrentValues", JSON.parse(data));
        },
        SOCKET_stop: (context) => {
            context.commit("stopSim");
        }
    }
})

const socket1 = new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:3001', {
        withCredentials: false
    }),
    vuex: {
        store,
    }
})

createApp(App).use(router).use(store).use(socket1).mount('#app')
