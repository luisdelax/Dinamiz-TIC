import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

// Define los roles de tu aplicación
export const USER_ROLES = {
  ADMIN: 'admin',
  TECHNICIAN: 'technician',
  USER: 'user',
};

// Define las capacidades/permisos de cada rol
// Esto es una simplificación, en un sistema real, los permisos serían más granulares
const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    canManageUsers: true,
    canManageOrganization: true,
    canManageInventory: true,
    canManageTickets: true,
    canEditAnyTicket: true,
    canDeleteAnyTicket: true,
    canEditAnyAsset: true,
    canDeleteAnyAsset: true,
  },
  [USER_ROLES.TECHNICIAN]: {
    canManageUsers: false,
    canManageOrganization: false,
    canManageInventory: true, // Puede crear/editar/eliminar activos
    canManageTickets: true, // Puede crear/editar/eliminar tickets
    canEditAnyTicket: true,
    canDeleteAnyTicket: false, // Solo puede editar, no eliminar
    canEditAnyAsset: true,
    canDeleteAnyAsset: false, // Solo puede editar, no eliminar
  },
  [USER_ROLES.USER]: {
    canManageUsers: false,
    canManageOrganization: false,
    canManageInventory: false,
    canManageTickets: true, // Puede crear sus propios tickets
    canEditAnyTicket: false, // Solo puede ver/editar sus propios tickets
    canDeleteAnyTicket: false,
    canEditAnyAsset: false,
    canDeleteAnyAsset: false,
  },
};

// Hook personalizado para verificar permisos
export const usePermission = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const hasPermission = (permissionKey) => {
    if (!isAuthenticated || !user || !user.role) {
      return false;
    }
    const userRole = user.role;
    // Verifica si el rol existe en nuestra definición de permisos
    if (ROLE_PERMISSIONS[userRole]) {
      return ROLE_PERMISSIONS[userRole][permissionKey] || false;
    }
    return false;
  };

  // Función para obtener si el usuario es un tipo de rol específico
  const isRole = (role) => {
    if (!isAuthenticated || !user || !user.role) {
      return false;
    }
    return user.role === role;
  };

  // Función para verificar si el usuario tiene alguno de los roles dados
  const hasAnyRole = (roles) => {
    if (!isAuthenticated || !user || !user.role) {
      return false;
    }
    return roles.includes(user.role);
  };

  return { hasPermission, isRole, hasAnyRole, user, isAuthenticated };
};

// Roles para exportar y usar en otros componentes
export const ROLES = USER_ROLES;
