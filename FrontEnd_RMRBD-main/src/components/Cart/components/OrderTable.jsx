import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { formatCurrency } from '../../../utils/formatters';

const OrderTable = ({
  orders,
  books,
  selectedOrders,
  onQuantityChange,
  onDeleteClick,
  onSelectionChange
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">
              <input
                type="checkbox"
                checked={orders.length > 0 && selectedOrders.size === orders.length}
                onChange={(e) => {
                  const newSelected = new Set();
                  if (e.target.checked) {
                    orders.forEach(order => newSelected.add(order.orderDetailId));
                  }
                  onSelectionChange(newSelected);
                }}
                className="rounded border-gray-300"
              />
            </th>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Total</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const book = books[order.bookId] || {};
            return (
              <tr key={order.orderDetailId} className="border-t">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.has(order.orderDetailId)}
                    onChange={() => {
                      const newSelected = new Set(selectedOrders);
                      if (newSelected.has(order.orderDetailId)) {
                        newSelected.delete(order.orderDetailId);
                      } else {
                        newSelected.add(order.orderDetailId);
                      }
                      onSelectionChange(newSelected);
                    }}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-4">
                    {book.imageUrl && (
                      <img
                        src={book.imageUrl}
                        alt={book.bookName}
                        className="w-16 h-20 object-cover rounded"
                      />
                    )}
                    <span className="font-medium">{book.bookName}</span>
                  </div>
                </td>
                <td className="p-4">{formatCurrency(order.price)}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onQuantityChange(order.orderDetailId, order.quantity - 1)}
                      disabled={order.quantity <= 1}
                      className="p-1 rounded border disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={order.quantity}
                      onChange={(e) => onQuantityChange(order.orderDetailId, parseInt(e.target.value, 10))}
                      className="w-16 text-center border rounded p-1"
                      min="1"
                      max={book.unitInStock}
                    />
                    <button
                      onClick={() => onQuantityChange(order.orderDetailId, order.quantity + 1)}
                      disabled={order.quantity >= book.unitInStock}
                      className="p-1 rounded border disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-4">{formatCurrency(order.totalPrice)}</td>
                <td className="p-4">
                  <button
                    onClick={() => onDeleteClick(order.orderDetailId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(OrderTable); 