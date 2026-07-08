import AdminOrderCard from './AdminOrderCard';

export default function AdminMonthGroup({ month, orders }) {
  return (
    <section className="month-section">
      <h3>{month}</h3>

      <div className="admin-orders">
        {orders.map((order) => (
          <AdminOrderCard key={order.id} order={order} canOrder={false} />
        ))}
      </div>
    </section>
  );
}
