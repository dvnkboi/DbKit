export function setWithExpiry(key: string, value: any, ttl: number) {
  const item = {
    value: value,
    expiry: new Date().getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  if (new Date().getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

export function setIfNotExists(key: string, value: any, ttl: number) {
  if (!getWithExpiry(key)) {
    setWithExpiry(key, value, ttl);
  }
}
