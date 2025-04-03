
import { Link } from 'react-router-dom';
import { OrderType } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

type RecentOrdersProps = {
  orders: OrderType[];
};

const RecentOrders = ({ orders }: RecentOrdersProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-row items-center justify-between">
        <h3 className="font-semibold text-lg">Recent Orders</h3>
        <Link to="/orders" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="p-0 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Order #</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Customer</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Service</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Due Date</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">
                  <Link to={`/orders/${order.id}`} className="text-primary hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm">{order.customerName}</td>
                <td className="px-6 py-4 text-sm">
                  {order.serviceType.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(order.dueDate).toLocaleDateString()} 
                  <span className="text-xs ml-1 text-muted-foreground">
                    ({formatDistanceToNow(new Date(order.dueDate), { addSuffix: true })})
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">${order.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
