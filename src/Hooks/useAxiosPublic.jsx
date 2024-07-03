import axios from "axios";


const axiosPublic = axios.create({
    baseURL: 'https://bistro-boss-server-gamma-black.vercel.app'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;