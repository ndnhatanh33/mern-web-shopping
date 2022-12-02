export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export function formatCash(str) {
  return str
    .toString()
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + '.') + prev;
    });
}
