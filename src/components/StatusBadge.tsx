import { Sale, StatusType, ARStatusType } from '@/types/sales';

interface StatusBadgeProps {
  status: StatusType | ARStatusType;
  type?: 'default' | 'ar';
}

export function StatusBadge({ status, type = 'default' }: StatusBadgeProps) {
  const isGood = type === 'ar' ? status === 'paid' : status === 'released';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${isGood ? 'status-released' : 'status-pending'}`}>
      {status}
    </span>
  );
}

export function getStatusColor(status: StatusType | ARStatusType, type: 'default' | 'ar' = 'default'): string {
  const isGood = type === 'ar' ? status === 'paid' : status === 'released';
  return isGood ? 'status-released' : 'status-pending';
}
