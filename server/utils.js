export const getAppBaseUrl = () => {
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:8000'
    }
}
