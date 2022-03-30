export const generateRandomEmail = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let first = '';
  let domain = '';
  for (let ii = 0; ii < 15; ii++) {
    first += chars[Math.floor(Math.random() * chars.length)];
    domain += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${first}@${domain}.com`;
};
