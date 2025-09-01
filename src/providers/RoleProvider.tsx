'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'user' | 'agent' | 'admin';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: {
    name: string;
    email: string;
    clinic: string;
  };
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
  initialRole?: UserRole;
}

export function RoleProvider({
  children,
  initialRole = 'user'
}: RoleProviderProps) {
  const [role, setRole] = useState<UserRole>(initialRole);

  // Mock user data - in produzione verrebbe dall'API
  const user = {
    name: role === 'user' ? 'Mario Rossi' : role === 'agent' ? 'Giulia Bianchi' : 'Admin Super',
    email: role === 'user' ? 'mario.rossi@example.com' : role === 'agent' ? 'giulia.bianchi@example.com' : 'admin@example.com',
    clinic: 'Clinica Centrale Milano'
  };

  const value = {
    role,
    setRole,
    user
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole deve essere usato dentro un RoleProvider');
  }
  return context;
}
