export const getToken = () => {
    return sessionStorage.getItem('jwttoken') || null;
}

export const getXSRF = () => {
    return sessionStorage.getItem('xsrftoken') || null;
}

export const getRefresh = () => {
    return sessionStorage.getItem('refreshtoken') || null;
}

export const removeToken = () => {
    sessionStorage.removeItem('jwttoken');
}

export const setToken = (token, xsrf, refresh) => {
    console.log('Setting token as: ' + token);
    sessionStorage.setItem('jwttoken', token);
    sessionStorage.setItem('xsrftoken', xsrf);
    sessionStorage.setItem('refreshtoken', refresh);
}
