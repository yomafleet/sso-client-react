export interface IStorageManager {
    setItem(key: string, value: string): void;
    getItem<T>(key: string): T | undefined;
    removeItem(key: string): void;
}
export declare class LocalStorageManager implements IStorageManager {
    private prefix;
    constructor(prefix?: string);
    /**
     * set item to localStorage
     *
     * @param key string
     * @param value string
     * @return void
     */
    setItem(key: string, value: string): void;
    /**
     * get item from localStorage
     *
     * @param key string
     * @returns T | undefined
     */
    getItem<T>(key: string): T | undefined;
    /**
     * remove item from localStorage
     *
     * @param key string
     * @return void
     */
    removeItem(key: string): void;
}
