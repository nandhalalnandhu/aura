import Cookies from 'js-cookie';

const TOKEN_KEY = 'jwtToken';

export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, { expires: 1 }); // Expires in 1 day
};

export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
    Cookies.remove(TOKEN_KEY);
};