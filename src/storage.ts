export interface IStorageManager {
  setItem(key: string, value: string): void;
  getItem<T>(key: string): T | undefined;
  removeItem(key: string): void;
}

export class LocalStorageManager implements IStorageManager {
  constructor(
    private prefix: string = "SSO_Client",
    private storage: Storage = window.localStorage
  ) {}

  /**
   * set item to localStorage
   *
   * @param key string
   * @param value T
   * @return void
   */
  setItem<T>(key: string, value: T): void {
    this.storage.setItem(`${this.prefix}__${key}`, JSON.stringify(value));
  }

  /**
   * get item from localStorage
   *
   * @param key string
   * @returns T | undefined
   */
  getItem<T>(key: string): T | undefined {
    const json = this.storage.getItem(`${this.prefix}__${key}`);
    if (!json) return;
    try {
      return JSON.parse(json) as T;
    } catch (e) {
      throw new Error(`Error parsing JSON for key ${key}`);
    }
  }

  /**
   * remove item from localStorage
   *
   * @param key string
   * @return void
   */
  removeItem(key: string): void {
    this.storage.removeItem(`${this.prefix}__${key}`);
  }

  /**
   * Clear all items from local storage with the prefix
   *
   * @return void
   */
  clear(): void {
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    }
  }
}
