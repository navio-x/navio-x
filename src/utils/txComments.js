const STORAGE_KEY = 'navio_tx_comments';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

export function getTxComment(txid) {
  if (!txid) return '';
  return readAll()[txid] || '';
}

export function setTxComment(txid, comment) {
  if (!txid) return;
  const all = readAll();
  if (comment) {
    all[txid] = comment;
  } else {
    delete all[txid];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
