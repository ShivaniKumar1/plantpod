export const getToken = () => {
    return sessionStorage.getItem('jwttoken') || null;
}

export const removeToken = () => {
    sessionStorage.removeItem('jwttoken');
}

export const setToken = (token, xsrf, refresh) => {
    console.log('Setting token as: ' + token);
    sessionStorage.setItem('jwttoken', token);
}
