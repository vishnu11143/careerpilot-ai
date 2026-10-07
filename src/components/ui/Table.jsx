/* ============================================
   CareerPilot AI — Table Component
   Reusable table with sub-components
   ============================================ */

import { cn } from '../../utils/cn';

export function Table({ children, className, ...props }) {
  return (
    <div className="table-wrapper">
      <table className={cn('table', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }) {
  return (
    <thead className={cn('table-header', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }) {
  return (
    <tbody className={cn('table-body', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }) {
  return (
    <tr className={cn('table-row', className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }) {
  return (
    <th className={cn('table-head', className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }) {
  return (
    <td className={cn('table-cell', className)} {...props}>
      {children}
    </td>
  );
}
