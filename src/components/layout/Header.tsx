'use client';

import React, { useState } from 'react';
import { Bell, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRole } from '@/providers/RoleProvider';

interface HeaderProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
    clinic: string;
  };
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const { role, setRole } = useRole();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Nuovo ticket assegnato',
      message: 'Ti è stato assegnato il ticket #1239',
      time: '2 minuti fa',
      type: 'info' as const,
      unread: true
    },
    {
      id: 2,
      title: 'SLA in scadenza',
      message: 'Il ticket #1234 scadrà tra 2 ore',
      time: '1 ora fa',
      type: 'warning' as const,
      unread: true
    },
    {
      id: 3,
      title: 'Ticket risolto',
      message: 'Il ticket #1230 è stato risolto',
      time: '3 ore fa',
      type: 'success' as const,
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const roles = [
    { key: 'user', label: 'Utente', description: 'Gestione ticket personali' },
    { key: 'agent', label: 'Agente', description: 'Gestione ticket utenti e clinica' },
    { key: 'admin', label: 'Admin', description: 'Amministrazione completa' }
  ] as const;

  const handleRoleChange = (newRole: typeof role) => {
    setRole(newRole);
    setShowRoleMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 relative">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cerca ticket, utenti, categorie..."
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>

        {/* Right side - Role selector, notifications and user menu */}
        <div className="flex items-center space-x-3">
          {/* Role Selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
            >
              <span className="text-sm font-medium">
                {roles.find(r => r.key === role)?.label || 'Utente'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Role Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Seleziona Ruolo</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowRoleMenu(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="py-2">
                  {roles.map((roleOption) => (
                    <button
                      key={roleOption.key}
                      onClick={() => handleRoleChange(roleOption.key)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        role === roleOption.key ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{roleOption.label}</p>
                          <p className="text-sm text-gray-600">{roleOption.description}</p>
                        </div>
                        {role === roleOption.key && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Usa questo menu per testare i diversi ruoli durante lo sviluppo
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifiche</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'info' ? 'bg-blue-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'success' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <Button variant="ghost" size="sm" className="w-full">
                    Visualizza tutte le notifiche
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User info */}
          {user && (
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.clinic}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full p-2"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Il mio profilo
                    </a>
                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Impostazioni
                    </a>
                    <a href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Aiuto
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <a href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Disconnetti
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cerca..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu || showRoleMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
            setShowRoleMenu(false);
          }}
        />
      )}
    </header>
  );
}