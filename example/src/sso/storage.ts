export interface IStorageManager {
  setItem(key: string, value: string): void;
  getItem<T>(key: string): T | undefined;
  removeItem(key: string): void;
}

export class LocalStorageManager implements IStorageManager {
  constructor(private prefix: string = "SSO_Client") {}

  /**
   * set item to localStorage
   *
   * @param key string
   * @param value string
   * @return void
   */
  setItem(key: string, value: string): void {
    window.localStorage.setItem(
      `${this.prefix}__${key}`,
      JSON.stringify(value)
    );
  }

  /**
   * get item from localStorage
   *
   * @param key string
   * @returns T | undefined
   */
  getItem<T>(key: string): T | undefined {
    const json = window.localStorage.getItem(`${this.prefix}__${key}`);
    if (!json) return;
    try {
      return JSON.parse(json) as T;
    } catch (e) {
      return;
    }
  }

  /**
   * remove item from localStorage
   *
   * @param key string
   * @return void
   */
  removeItem(key: string): void {
    window.localStorage.removeItem(`${this.prefix}__${key}`);
  }
}
