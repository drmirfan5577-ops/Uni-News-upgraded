// Admin Service — Authentication & Multi-Admin Management
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '@/constants/config';

export interface AdminUser {
  id: string;
  name: string;
  password: string;
  isMain: boolean;
  isEnabled: boolean;
  permissions: AdminPermission[];
  createdAt: number;
  lastLogin?: number;
}

export type AdminPermission =
  | 'publish_news'
  | 'delete_news'
  | 'edit_news'
  | 'manage_media'
  | 'manage_settings'
  | 'manage_music';

const ADMINS_KEY = 'swn_admins';
const SESSION_KEY = 'swn_admin_session';

const DEFAULT_MAIN_ADMIN: AdminUser = {
  id: 'main_admin',
  name: 'Dr M Irfan Qadir Thaheem',
  password: APP_CONFIG.mainAdminPassword,
  isMain: true,
  isEnabled: true,
  permissions: ['publish_news', 'delete_news', 'edit_news', 'manage_media', 'manage_settings', 'manage_music'],
  createdAt: Date.now(),
};

export const adminService = {
  async getAdmins(): Promise<AdminUser[]> {
    try {
      const stored = await AsyncStorage.getItem(ADMINS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure main admin always exists
        if (!parsed.find((a: AdminUser) => a.isMain)) {
          parsed.unshift(DEFAULT_MAIN_ADMIN);
          await AsyncStorage.setItem(ADMINS_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
      const defaults = [DEFAULT_MAIN_ADMIN];
      await AsyncStorage.setItem(ADMINS_KEY, JSON.stringify(defaults));
      return defaults;
    } catch {
      return [DEFAULT_MAIN_ADMIN];
    }
  },

  async saveAdmins(admins: AdminUser[]): Promise<void> {
    await AsyncStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  },

  async authenticate(password: string): Promise<AdminUser | null> {
    const admins = await this.getAdmins();
    const admin = admins.find(a => a.password === password && a.isEnabled);
    if (admin) {
      admin.lastLogin = Date.now();
      await this.saveAdmins(admins);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ adminId: admin.id, loginAt: Date.now() }));
      return admin;
    }
    return null;
  },

  async getSession(): Promise<string | null> {
    try {
      const stored = await AsyncStorage.getItem(SESSION_KEY);
      if (!stored) return null;
      const session = JSON.parse(stored);
      // Session valid for 24 hours
      if (Date.now() - session.loginAt > 86400000) {
        await AsyncStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session.adminId;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  },

  async addAdmin(admin: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> {
    const admins = await this.getAdmins();
    const newAdmin: AdminUser = {
      ...admin,
      id: `admin_${Date.now()}`,
      createdAt: Date.now(),
    };
    admins.push(newAdmin);
    await this.saveAdmins(admins);
    return newAdmin;
  },

  async updateAdmin(id: string, updates: Partial<AdminUser>): Promise<void> {
    const admins = await this.getAdmins();
    const idx = admins.findIndex(a => a.id === id);
    if (idx >= 0) {
      admins[idx] = { ...admins[idx], ...updates };
      await this.saveAdmins(admins);
    }
  },

  async removeAdmin(id: string): Promise<void> {
    const admins = await this.getAdmins();
    const filtered = admins.filter(a => a.id !== id && a.isMain !== true);
    await this.saveAdmins(filtered.length > 0 ? filtered : admins.filter(a => a.isMain));
  },

  createId(): string {
    return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  },
};
