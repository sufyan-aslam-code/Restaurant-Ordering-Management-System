const ACCESS_TOKEN_KEY = "restaurant_access_token";
const USER_KEY = "restaurant_user";

export const saveAuthSession = ({ accessToken, user }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    return null;
  }
};