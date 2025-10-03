export const isEmail = (v = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

export const hasMin6 = (v = '') => String(v).length >= 6;
