'use client';
import { createContext, useContext } from 'react';

/**
 * AdminConfigContext — provides dealer config to admin tab components
 * without prop drilling. Anywhere inside the AdminPanel tree, call
 * useAdminConfig() to read config.dealerName, config.phone, config.address, etc.
 */
export const AdminConfigContext = createContext(null);

export const useAdminConfig = () => useContext(AdminConfigContext) || {};
