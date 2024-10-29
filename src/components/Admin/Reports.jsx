import React from 'react';
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';

const Report = () => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [isSubMenuOpen, setSubMenuOpen] = React.useState(false);
  const notifications = ["Notification 1", "Notification 2"];
  const location = useLocation();
  
  const handleToggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const isAccountManagementActive = location.pathname.includes("accountmanagement");
  const isReportActive = location.pathname === "/reports";

  const toggleSubMenu = () => {
    setSubMenuOpen(prev => !prev);
  };

  // Sample reports data
  const reports = [
    {
      id: 1,
      title: "Monthly Sales Report",
      description: "A comprehensive report on monthly sales performance.",
    },
    {
      id: 2,
      title: "Customer Feedback Report",
      description: "Summary of customer feedback and satisfaction.",
    },
    {
      id: 3,
      title: "Inventory Status Report",
      description: "Current status of inventory levels across all categories.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-roboto">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/5 bg-white text-black flex flex-col">
          <div className="p-4 flex justify-center">
            <img src="/src/assets/Logo.png" alt="Logo" className="w-40" />
          </div>
          <nav className="mt-10">
            {["Dashboard", "Account Management", "Income Management", "Product Management", "Feedback & Comments", "Reports", "Delivery Management"].map((item, index) => (
              <div key={index}>
                <div>
                  <Link 
                    to={`/${item.replace(/ /g, '').toLowerCase()}`} 
                    className={`block py-2.5 px-4 rounded ${location.pathname === `/${item.replace(/ /g, '').toLowerCase()}` ? "text-orange-500 font-semibold border-b-2 border-orange-500" : "text-black"}`}>
                    {item}
                  </Link>
                </div>
                <div className={`border-b border-gray-300 ${item !== "Feedback" ? "mb-2" : ""}`} /> {/* Add this line */}
                {item === "Account Management" && isSubMenuOpen && (
                  <div className={`ml-4 overflow-hidden transition-max-height duration-300 ease-in-out ${isSubMenuOpen ? 'max-h-40' : 'max-h-0'}`}>
                    <Link to="/Feedback/roles" className="block py-2 px-4 text-gray-600 hover:bg-gray-200 rounded">Roles</Link>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Reports */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          <header className="p-4 bg-orange-400 flex justify-between items-center">
            <h1 className="text-white text-xl">Reports</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search reports..." 
                  className="rounded-md px-3 py-2 text-gray-800 pr-10" 
                  name="reportSearch"
                />
                <button className="absolute right-0 top-0 bottom-0 text-black rounded-r-md px-3 flex items-center">
                  <FaSearch />
                </button>
              </div>
              <button onClick={handleToggleNotifications} className="text-white flex items-center relative">
                <IoIosNotifications size={24} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">{notifications.length}</span>
                )}
              </button>
            </div>
          </header>

          {showNotifications && (
            <div className="absolute right-4 top-16 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
              <h2 className="font-semibold mb-2">Notifications</h2>
              {notifications.length > 0 ? (
                <ul className="space-y-1">
                  {notifications.map((note, index) => (
                    <li key={index} className="text-gray-800">{note}</li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}

          {/* Report List */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Report Details</h2>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Report Title</th>
                  <th className="py-2 px-4 border-b text-left">Description</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id}>
                    <td className="py-2 px-4 border-b">{report.title}</td>
                    <td className="py-2 px-4 border-b">{report.description}</td>
                    <td className="py-2 px-4 border-b">
                      <Link to={`/reports/view/${report.id}`} className="text-blue-500">View</Link>
                      <Link to={`/reports/edit/${report.id}`} className="text-red-500 ml-4">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Report;
