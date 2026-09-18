'use client';
import { formatBDT } from '@/lib/utils';

interface Props { amount: number; className?: string; showSymbol?: boolean; }
export function CurrencyFormatter({ amount, className, showSymbol = true }: Props) {
  return (
    <span className={className}>
      {showSymbol ? formatBDT(amount) : amount.toLocaleString('en-BD')}
    </span>
  );
}
