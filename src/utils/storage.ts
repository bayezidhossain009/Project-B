import { UserInfo, MachineRecord } from '../types';

const STORAGE_KEYS = {
  USER_INFO: 'bg_user_info',
  RECORDS: 'bg_machine_records',
  SPLASH_SHOWN: 'bg_splash_shown',
};

export const storage = {
  getUserInfo: (): UserInfo | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return data ? JSON.parse(data) : null;
  },

  setUserInfo: (user: UserInfo): void => {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
  },

  getRecords: (): MachineRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },

  saveRecord: (record: MachineRecord): void => {
    const records = storage.getRecords();
    const existingIndex = records.findIndex((r) => r.id === record.id);
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  },

  updateRecord: (id: string, updates: Partial<MachineRecord>): void => {
    const records = storage.getRecords();
    const index = records.findIndex((r) => r.id === id);
    if (index >= 0) {
      records[index] = { ...records[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    }
  },

  deleteRecord: (id: string): void => {
    const records = storage.getRecords().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  },

  getRecordsByStatus: (status: 'active' | 'closed'): MachineRecord[] => {
    return storage.getRecords().filter((r) => r.status === status);
  },

  exportData: (): string => {
    const data = {
      userInfo: storage.getUserInfo(),
      records: storage.getRecords(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.userInfo) {
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(data.userInfo));
      }
      if (data.records && Array.isArray(data.records)) {
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(data.records));
      }
      return true;
    } catch {
      return false;
    }
  },

  wasSplashShown: (): boolean => {
    return sessionStorage.getItem(STORAGE_KEYS.SPLASH_SHOWN) === 'true';
  },

  setSplashShown: (): void => {
    sessionStorage.setItem(STORAGE_KEYS.SPLASH_SHOWN, 'true');
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
  },
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
