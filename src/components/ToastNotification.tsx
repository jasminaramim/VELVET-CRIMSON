import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
      <div className="flex items-center gap-3 bg-[#111111] text-white px-5 py-3.5 rounded-lg shadow-2xl border border-gray-800">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#B11226] shrink-0" />}
        {isInfo && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        {!isSuccess && !isInfo && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
        <span className="text-sm font-medium tracking-wide">{toast.message}</span>
      </div>
    </div>
  );
};
