import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // For redirecting
import './EmployeeDashboard.css';  // For styling

// Hardcoded customer list
const customersData = [
  { id: 1, name: 'John Doe', accountNumber: '1234567890', idNumber: '1234567890123', role: 'customer' },
  { id: 2, name: 'Jane Smith', accountNumber: '2345678901', idNumber: '2345678901234', role: 'customer' },
  { id: 3, name: 'Michael Brown', accountNumber: '3456789012', idNumber: '3456789012345', role: 'customer' },
  { id: 4, name: 'Emily Davis', accountNumber: '4567890123', idNumber: '4567890123456', role: 'customer' },
];

function EmployeeDashboard() {
  const [customers] = useState(customersData);  // Hardcoded customers data
  const navigate = useNavigate();  // Hook for navigation

  // Greeting employee
  const employeeName = localStorage.getItem('employeeName');  // Assuming name is saved after login

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('employeeName');  // Clear employee name from localStorage
    navigate('/login');  // Redirect to login page
  };

  return (
    <div className="employee-dashboard">
      <h2>Employee Dashboard</h2>

      {employeeName && (
        <div className="greeting">
          <h3>Hello, {employeeName}!</h3>
          <p>Welcome back to your dashboard.</p>
        </div>
      )}

      <div className="customer-list">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-info">
              <h3>{customer.name}</h3>
              <p><strong>Account Number:</strong> {customer.accountNumber}</p>
              <p><strong>ID Number:</strong> {customer.idNumber}</p>
            </div>
            <div className={`customer-role ${customer.role}`}>
              {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default EmployeeDashboard;
