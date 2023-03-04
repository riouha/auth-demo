export function validateNationalCode(nid: string) {
  if (typeof nid !== 'string') return false;
  if (!nid.match(/^\d{10}$/)) return false;
  if (nid.match(/(\d)\1{9}/)) return false;

  const L = 10; // nid.length
  const controlNumber = +nid[9];
  let value = 0;
  for (let i = 0; i < L - 1; i++) {
    value = value + +nid[i] * (L - i);
  }
  const reminder = value % 11;

  const state1 = reminder < 2 && reminder === controlNumber;
  const state2 = reminder >= 2 && 11 - reminder === controlNumber;
  if (state1 || state2) return true;
  return false;
}
