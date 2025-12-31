import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({providedIn: 'root'})
export class PersistentStorageService {
    async get<T>(key: string): Promise<T | string | null> {
        const {value} = await Preferences.get({key});
        if (value === null) {
            return null;
        }

        try {
            return JSON.parse(value) as T;
        } catch {
            return value;
        }
    }

    async has(key: string): Promise<boolean> {
        const {keys} = await Preferences.keys();
        const keysLength = keys.length;
        for (let i = 0; i < keysLength; i++) {
            if (keys[i] === key) {
                return true;
            }
        }

        return false;
    }

    async set<T>(key: string, data: T): Promise<void> {
        await Preferences.set({
            key,
            value: typeof data === 'string' ? data : JSON.stringify(data),
        });
    }

    async remove(key: string): Promise<void> {
        await Preferences.remove({key});
    }

    async clear(): Promise<void> {
        await Preferences.clear();
    }
}
