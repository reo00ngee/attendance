export const getUserName = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const userName = user.first_name + " " + user.last_name;
      return `UserName: ${userName}`;
    } catch (error) {
      return;
    }
  }
};