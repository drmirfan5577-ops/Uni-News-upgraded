// Admin Context — Authentication State Provider
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { adminService, AdminUser } from '@/services/adminService';

interface AdminContextType {
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  admins: AdminUser[];
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => Promise<AdminUser>;
  updateAdmin: (id: string, updates: Partial<AdminUser>) => Promise<void>;
  removeAdmin: (id: string) => Promise<void>;
  refreshAdmins: () => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    setIsLoading(true);
    try {
      const [sessionId, allAdmins] = await Promise.all([
        adminService.getSession(),
        adminService.getAdmins(),
      ]);
      setAdmins(allAdmins);
      if (sessionId) {
        const admin = allAdmins.find(a => a.id === sessionId && a.isEnabled);
        setCurrentAdmin(admin || null);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string): Promise<boolean> => {
    const admin = await adminService.authenticate(password);
    if (admin) {
      setCurrentAdmin(admin);
      const allAdmins = await adminService.getAdmins();
      setAdmins(allAdmins);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await adminService.logout();
    setCurrentAdmin(null);
  };

  const addAdmin = async (admin: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> => {
    const newAdmin = await adminService.addAdmin(admin);
    const allAdmins = await adminService.getAdmins();
    setAdmins(allAdmins);
    return newAdmin;
  };

  const updateAdmin = async (id: string, updates: Partial<AdminUser>) => {
    await adminService.updateAdmin(id, updates);
    const allAdmins = await adminService.getAdmins();
    setAdmins(allAdmins);
    if (currentAdmin?.id === id) {
      const updated = allAdmins.find(a => a.id === id);
      setCurrentAdmin(updated || null);
    }
  };

  const removeAdmin = async (id: string) => {
    await adminService.removeAdmin(id);
    const allAdmins = await adminService.getAdmins();
    setAdmins(allAdmins);
  };

  const refreshAdmins = async () => {
    const allAdmins = await adminService.getAdmins();
    setAdmins(allAdmins);
  };

  return (
    <AdminContext.Provider value={{
      currentAdmin,
      isAuthenticated: currentAdmin !== null,
      isLoading,
      admins,
      login,
      logout,
      addAdmin,
      updateAdmin,
      removeAdmin,
      refreshAdmins,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
