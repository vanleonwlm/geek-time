import axios from 'axios';

class HttpUtils {

    constructor(config = {}) {
        this.client = axios.create({
            timeout: 10000,
            ...config
        });
    }

    async post(url, data, headers = {}, retries = 0) {
        try {
            const response = await this.client.post(url, data, { headers });
            return response.data;
        } catch (error) {
            if (retries > 0) {
                return this.post(url, data, headers, retries - 1);
            }
            throw this.handleError(error);
        }
    }

    async get(url, params = {}, headers = {}, retries = 0) {
        try {
            const response = await this.client.get(url, { params, headers });
            return response.data;
        } catch (error) {
            if (retries > 0) {
                return this.get(url, params, headers, retries - 1);
            }
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            return new Error(`HTTP Error ${status}: ${JSON.stringify(data)}`);
        } else if (error.request) {
            return new Error('No response received from server');
        } else {
            return new Error(`Request error: ${error.message}`);
        }
    }
}

export default HttpUtils; 
