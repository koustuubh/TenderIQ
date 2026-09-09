import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export const StatusBadge = ({ status = 'Compliant', size = 'md', showIcon = true, className = '' }) => {
  const normalized = status.toLowerCase();

  let config = {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
    label: 'Compliant'
  };

  if (normalized.includes('review') || normalized.includes('needs')) {
    config = {
      bg: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      label: 'Needs Review'
    };
  } else if (normalized.includes('non') || normalized.includes('fail')) {
    config = {
      bg: 'bg-red-50 text-red-800 border-red-300',
      icon: XCircle,
      iconColor: 'text-red-600',
      label: 'Non-Compliant'
    };
  } else if (normalized.includes('miss') || normalized.includes('pending')) {
    config = {
      bg: 'bg-slate-100 text-slate-800 border-slate-300',
      icon: HelpCircle,
      iconColor: 'text-slate-500',
      label: 'Missing Document'
    };
  }

  const IconComponent = config.icon;
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold'
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border shadow-xs ${config.bg} ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
export default StatusBadge;