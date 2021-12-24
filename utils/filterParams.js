const filterParams = (obj) => {
  const arr = Object.entries(obj).filter((key, value) => value !== "");
  return Object.fromEntries(arr);
};

module.exports = filterParams;
