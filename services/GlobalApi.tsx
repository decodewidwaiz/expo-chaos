import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: 'http://192.168.137.1:1337',
    headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_KEY}`,
        'Content-Type': 'application/json',
    }
})