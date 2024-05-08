export const userCopyWithoutPassword = (user) => {
  const { id, email } = user;
  return { id, email };
};
