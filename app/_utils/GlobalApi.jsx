const {default: axios} = require('axios');

const axiosClient = axios.create({
    baseURL:`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api`,
})

const getCategory = () => axiosClient.get('/categories');

const getProduct = () => axiosClient.get('/products?populate=*').then(resp => {
    return resp.data.data
});

const createOrder = (orderData) =>
    axiosClient.post('/orders', { data: orderData }).then(resp => resp.data);


export default {
    getCategory,
    getProduct,
    createOrder,
}