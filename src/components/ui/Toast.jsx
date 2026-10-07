/* ============================================
   CareerPilot AI — Toast Component
   Custom toast helper using react-hot-toast
   ============================================ */

import toast from 'react-hot-toast';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Styled toast helpers that use the app's design system icons.
 * Usage: showToast.success('Profile updated!');
 */
export const showToast = {
  success: (message) =>
    toast.success(message, {
      icon: <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />,
    }),

  error: (message) =>
    toast.error(message, {
      icon: <AlertCircle size={18} style={{ color: 'var(--color-error)' }} />,
    }),

  warning: (message) =>
    toast(message, {
      icon: <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />,
    }),

  info: (message) =>
    toast(message, {
      icon: <Info size={18} style={{ color: 'var(--color-info)' }} />,
    }),

  promise: (promise, messages) => toast.promise(promise, messages),
};
