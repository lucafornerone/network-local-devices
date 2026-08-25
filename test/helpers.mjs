export const isMac = (addr) => {
  return /^([0-9A-Fa-f]{1,2}[:-]){5}([0-9A-Fa-f]{1,2})$/.test(addr);
};
