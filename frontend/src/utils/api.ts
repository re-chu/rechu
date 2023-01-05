import axios from 'axios';

class axiosAPI {
    instance;
    // BASE_URL = 'https://rechu.jinytree.shop/api';

    BASE_URL = 'http://localhost:8080';

    constructor() {
        this.instance = axios.create();
        this.instance.interceptors.request.use(
            (config): any => {
                const headers = config.headers;
                const token = localStorage.getItem('accessToken');
                try {
                    if (headers !== undefined)
                        headers.Authorization = token ? `Bearer ${token}` : '';
                    return config;
                } catch (err) {
                    // console.error('[_axios.interceptors.request] config : ' + err);
                    console.log('Without Token');
                    return config;
                }
            },
            error => {
                return Promise.reject(error);
            },
        );
    }

    async get(endpoint: string, params = '') {
        try {
            const apiUrl = `${endpoint}/${params}`;
            console.log(`%cGET 요청: ${apiUrl} `, 'color: #a25cd1;');
            const res = await this.instance.get(this.BASE_URL + apiUrl);
            const data = res.data.data;
            return data;
        } catch (err) {
            console.log('Error: ', err);
        }
    }

    async post(endpoint: string, data: any) {
        try {
            const apiUrl = endpoint;
            const res = await this.instance.post(this.BASE_URL + apiUrl, data);
            return res.data;
        } catch (err) {
            console.log('Error:', err);
        }
    }

    async patch(endpoint: any, params = '', data: any) {
        try {
            const apiUrl = `${endpoint}/${params}`;
            const res = await this.instance.patch(this.BASE_URL + apiUrl, data);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async delete(endpoint: any, params = '', data = {}) {
        try {
            const apiUrl = `${endpoint}/${params}`;
            const res = await this.instance.delete(this.BASE_URL + apiUrl, data);
            return res;
        } catch (err) {
            console.log(err);
        }
    }
}

const API = new axiosAPI();

export default API;
