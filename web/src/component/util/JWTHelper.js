export const getToken = () => {
    return sessionStorage.getItem('jwtToken') || null;
}

export const removeToken = () => {
    sessionStorage.removeItem('jwtToken');
}

export const setToken = (token) => {
    console.log('Setting token as: ' + token);
    sessionStorage.setItem('jwtToken', token);
}

export const setUserInfo = (userInfo) => {
    console.log('Setting info as: ' + userInfo.id);
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export const getUserInfo = () => {
    console.log('gettting as: '+ JSON.parse(sessionStorage.getItem('userInfo')).id );
    return JSON.parse(sessionStorage.getItem('userInfo')) || null;
}
