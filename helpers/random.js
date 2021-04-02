export const getRandomKey = () => {
  const l = 10;
  const c = "abcdefghijklmnopqrstuvwxyz0123456789";
  const cl = c.length;
  let r = "";
  for (var i = 0; i < l; i++) {
    r += c[Math.floor(Math.random() * cl)];
  }
  return r;
};
