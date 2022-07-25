import axios from 'axios'

export const getAppBaseUrl = () => {
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:8000'
    }
}


export const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = token
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}
