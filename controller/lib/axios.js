const axios = require("axios");
const BOT_TOKEN = "7992285279:AAFEa2CvK6dM6r5oHywzZP-SRFE0aU_Nshc";
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

function getAxiosInstance() {
    return {
        get(method, params) {
            return axios.get(`/${method}`, {
                baseURL: BASE_URL,
                params,
            });
        },
        post(method, data) {
            return axios({
                method: "post",
                baseURL: BASE_URL,
                url: `/${method}`,
                data,
            });
        },
    };
}

module.exports = { axiosInstance: getAxiosInstance() };
