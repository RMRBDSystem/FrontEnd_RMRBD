import React, { useState, useEffect } from 'react';
import AdminLayout from '../shared/AdminLayout';
import { FaMoneyBill, FaBook, FaTablet, FaUtensils, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

const IncomeManagement = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [incomeData, setIncomeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [statistics, setStatistics] = useState({
    totalBooks: 0,
    totalEbooks: 0,
    totalRecipes: 0,
    totalIncome: 0
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  useEffect(() => {
    fetchIncomeData();
  }, [dateRange, filterType]);

  const fetchIncomeData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for demonstration
      const mockData = [
        { month: 'Jan', books: 2500000, ebooks: 1500000, recipes: 1000000 },
        { month: 'Feb', books: 3000000, ebooks: 2000000, recipes: 1200000 },
        { month: 'Mar', books: 2800000, ebooks: 1800000, recipes: 900000 },
      ];

      setIncomeData(mockData);
      
      // Calculate statistics
      const totalBooks = mockData.reduce((acc, curr) => acc + curr.books, 0);
      const totalEbooks = mockData.reduce((acc, curr) => acc + curr.ebooks, 0);
      const totalRecipes = mockData.reduce((acc, curr) => acc + curr.recipes, 0);
      
      setStatistics({
        totalBooks,
        totalEbooks,
        totalRecipes,
        totalIncome: totalBooks + totalEbooks + totalRecipes
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching income data:', error);
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">
            {value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout title="Quản Lý Thu Nhập">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản Lý Thu Nhập">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                placeholderText="Chọn khoảng thời gian"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất Cả Sản Phẩm</option>
              <option value="book">Chỉ Sách</option>
              <option value="ebook">Chỉ E-book</option>
              <option value="recipe">Chỉ Công Thức</option>
            </select>
          </div>
          
          <button
            onClick={() => console.log('Exporting...')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload /> Xuất Excel
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng Thu Nhập"
            value={statistics.totalIncome}
            icon={FaMoneyBill}
            color="bg-orange-500"
          />
          <StatCard
            title="Thu Nhập Từ Sách"
            value={statistics.totalBooks}
            icon={FaBook}
            color="bg-blue-500"
          />
          <StatCard
            title="Thu Nhập Từ E-book"
            value={statistics.totalEbooks}
            icon={FaTablet}
            color="bg-green-500"
          />
          <StatCard
            title="Thu Nhập Từ Công Thức"
            value={statistics.totalRecipes}
            icon={FaUtensils}
            color="bg-yellow-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Income Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Thu Nhập Theo Tháng</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} />
                  <Legend />
                  <Bar dataKey="books" name="Sách" fill="#3b82f6" />
                  <Bar dataKey="ebooks" name="E-book" fill="#10b981" />
                  <Bar dataKey="recipes" name="Công Thức" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Income Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Phân Bố Thu Nhập</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Sách', value: statistics.totalBooks },
                      { name: 'E-book', value: statistics.totalEbooks },
                      { name: 'Công Thức', value: statistics.totalRecipes }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Income Details Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Chi Tiết Thu Nhập</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tháng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sách</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công Thức</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incomeData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.books.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.ebooks.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.recipes.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item.books + item.ebooks + item.recipes).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default IncomeManagement;