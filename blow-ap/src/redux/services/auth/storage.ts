export const authStorage = {
  setToken: (token: string) => localStorage.setItem('accessToken', token),
  getToken: () => localStorage.getItem('accessToken'),
  clear: () => localStorage.removeItem('accessToken'),
};
