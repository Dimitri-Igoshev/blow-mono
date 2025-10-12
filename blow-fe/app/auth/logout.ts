export const logout = () => {
	localStorage.setItem("access-token", "");
	window.open("/", "_self");
};