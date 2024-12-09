import React, { useState, useEffect } from 'react';
import AdminLayout from '../shared/AdminLayout';
import { FaUsers, FaShoppingCart, FaBook, FaUtensils } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';
import { getCoinTransactionByAccountId, getWithdraw } from '../../services/Transaction';

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalEbooks: 0,
    totalRecipes: 0,
    recentTransactions: []
  });

  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users count
      const usersResponse = await axios.get('https://rmrbdapi.somee.com/odata/account', {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        }
      });
      console.log('Users data:', usersResponse.data);

      // Create a map of user IDs to names for quick lookup
      const userMap = new Map(
        usersResponse.data.map(user => [user.accountId, user.userName])
      );

      // Count all active accounts
      const customerCount = Array.isArray(usersResponse.data) 
        ? usersResponse.data.filter(account => account.accountStatus === 1).length
        : 0;

      // Fetch all orders
      const ordersResponse = await axios.get('https://rmrbdapi.somee.com/odata/BookOrder', {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        }
      });
      console.log('Raw orders data:', ordersResponse.data);

      // Filter valid orders (those with orderCode)
      const validOrders = Array.isArray(ordersResponse.data) 
        ? ordersResponse.data.filter(order => order.orderCode !== null)
        : [];
      console.log('Valid orders:', validOrders);

      // Fetch all transactions
      const withdrawResponse = await getWithdraw();
      console.log('Withdraw transactions:', withdrawResponse);

      // Get recent transactions from all users
      const recentTransactions = [];
      for (const user of usersResponse.data) {
        if (user.accountStatus === 1) {
          const userTransactions = await getCoinTransactionByAccountId(user.accountId);
          if (Array.isArray(userTransactions)) {
            recentTransactions.push(...userTransactions);
          }
        }
      }

      // Sort transactions by date and take the 5 most recent
      const sortedTransactions = recentTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      // Process orders data for the sales chart
      const monthlyData = validOrders.reduce((acc, order) => {
        if (!order.purchaseDate) return acc;

        const date = new Date(order.purchaseDate);
        const month = date.toLocaleString('default', { month: 'short' });
        
        if (!acc[month]) {
          acc[month] = {
            month,
            sales: 0,
            orders: 0
          };
        }
        
        acc[month].sales += Number(order.totalPrice) || 0;
        acc[month].orders += 1;
        
        return acc;
      }, {});

      console.log('Monthly data:', monthlyData);
      const salesData = Object.values(monthlyData);
      console.log('Sales data:', salesData);

      // Fetch recipes count
      const recipesResponse = await axios.get('https://rmrbdapi.somee.com/odata/Recipe', {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        }
      });
      console.log('Recipes data:', recipesResponse.data);

      // Fetch ebooks count
      const ebooksResponse = await axios.get('https://rmrbdapi.somee.com/odata/ebook', {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        }
      });
      console.log('Ebooks data:', ebooksResponse.data);

      setStatistics({
        totalUsers: customerCount,
        totalOrders: validOrders.length,
        totalEbooks: Array.isArray(ebooksResponse.data) ? ebooksResponse.data.length : 0,
        totalRecipes: Array.isArray(recipesResponse.data) ? recipesResponse.data.length : 0,
        recentTransactions: sortedTransactions.map(transaction => ({
          orderId: transaction.coinTransactionId,
          customerId: transaction.customerId,
          customerName: userMap.get(transaction.customerId) || 'Unknown',
          totalAmount: Math.abs(transaction.coinFluctuations),
          status: transaction.status,
          orderDate: new Date(transaction.date).toLocaleDateString()
        }))
      });

      setSalesData(salesData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value || 0}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  // Update the Recent Transactions table to show transaction status correctly
  const getTransactionStatus = (status) => {
    switch (status) {
      case 1:
        return { text: 'Hoàn Thành', className: 'bg-green-100 text-green-800' };
      case -1:
        return { text: 'Đang Chờ', className: 'bg-yellow-100 text-yellow-800' };
      default:
        return { text: 'Đã Hủy', className: 'bg-red-100 text-red-800' };
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Tổng Quan">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tổng Quan">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng Người Dùng"
            value={statistics.totalUsers}
            icon={FaUsers}
            color="bg-blue-500"
          />
          <StatCard
            title="Tổng Đơn Hàng (Sách)"
            value={statistics.totalOrders}
            icon={FaShoppingCart}
            color="bg-green-500"
          />
          <StatCard
            title="Tổng E-books"
            value={statistics.totalEbooks}
            icon={FaBook}
            color="bg-purple-500"
          />
          <StatCard
            title="Tổng Công Thức"
            value={statistics.totalRecipes}
            icon={FaUtensils}
            color="bg-orange-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Doanh Thu Theo Tháng</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData.length > 0 ? salesData : [{ month: 'Không có dữ liệu', sales: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#f97316" name="Doanh Thu (₫)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Đơn Hàng Theo Tháng</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData.length > 0 ? salesData : [{ month: 'Không có dữ liệu', orders: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="#f97316" name="Đơn Hàng" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Giao Dịch Gần Đây</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Giao Dịch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Khách Hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Khách Hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Xu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statistics.recentTransactions.map((transaction) => {
                    const status = getTransactionStatus(transaction.status);
                    return (
                      <tr key={transaction.orderId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.customerId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.totalAmount.toLocaleString()} Xu
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.orderDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                            {status.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 