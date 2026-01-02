//This is Personal Finance Dashboard using React and Vite.

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
function App() {
  const [transactions, setTransactions] = useState([]); // Use state hook 

  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'
const [searchCategory, setSearchCategory] = useState('');
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  // Filter transactions based on selected filter and search
const filteredTransactions = transactions.filter(transaction => {
  // Filter by type (all/income/expense)
  const matchesFilter = filter === 'all' || transaction.type === filter;
  
  // Filter by category search
  const matchesSearch = searchCategory === '' || 
    transaction.category.toLowerCase().includes(searchCategory.toLowerCase());
  
  return matchesFilter && matchesSearch;
});

  // Prepare data for pie chart (expenses by category)
const expensesByCategory = transactions
  .filter(t => t.type === 'expense')
  .reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

const chartData = Object.keys(expensesByCategory).map(category => ({
  name: category,
  value: expensesByCategory[category]
}));

// Colors for pie chart
const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-indigo-600">
            💰 Personal Finance Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Track your income and expenses</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-indigo-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Balance</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              ${balance.toFixed(2)}
            </p>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Income</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ${totalIncome.toFixed(2)}
            </p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Expenses</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Coming Soon Message */}
        {/* Add Transaction Form */}
<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>
  
  <form onSubmit={(e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newTransaction = {
      id: Date.now(),
      type: formData.get('type'),
      amount: parseFloat(formData.get('amount')),
      category: formData.get('category'),
      description: formData.get('description'),
      date: new Date().toLocaleDateString()
    };
    
    setTransactions([...transactions, newTransaction]);
    e.target.reset();
  }} className="space-y-4">
    
    {/* Type Selection */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Type
      </label>
      <select 
        name="type"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>

    {/* Amount Input */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Amount
      </label>
      <input 
        type="number"
        name="amount"
        step="0.01"
        required
        placeholder="0.00"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>

    {/* Category Input */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Category
      </label>
      <input 
        type="text"
        name="category"
        required
        placeholder="e.g., Food, Salary, Rent"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>

    {/* Description Input */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Description (Optional)
      </label>
      <input 
        type="text"
        name="description"
        placeholder="e.g., Grocery shopping"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>

    {/* Submit Button */}
    <button 
      type="submit"
      className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
    >
      Add Transaction
    </button>
  </form>
</div>

{/* Charts Section */}
{transactions.length > 0 && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {/* Expense Breakdown Pie Chart */}
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Expenses by Category</h2>
      
      {chartData.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No expenses yet. Add some expenses to see the breakdown!
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>

    {/* Summary Stats */}
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Stats</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-semibold">Total Transactions</span>
          <span className="text-2xl font-bold text-indigo-600">{transactions.length}</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-semibold">Income Transactions</span>
          <span className="text-2xl font-bold text-green-600">
            {transactions.filter(t => t.type === 'income').length}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-semibold">Expense Transactions</span>
          <span className="text-2xl font-bold text-red-600">
            {transactions.filter(t => t.type === 'expense').length}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
          <span className="text-gray-700 font-semibold">Savings Rate</span>
          <span className="text-2xl font-bold text-indigo-600">
            {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
          </span>
        </div>
      </div>
    </div>
  </div>
)}

{/* Transaction List */}
<div className="bg-white rounded-lg shadow-lg p-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>

  {/* Filter Controls */}
<div className="mb-6 space-y-4">
  {/* Filter Buttons */}
  <div className="flex flex-wrap gap-3">
    <button
      onClick={() => setFilter('all')}
      className={`px-4 py-2 rounded-lg font-semibold transition ${
        filter === 'all' 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      All Transactions
    </button>
    
    <button
      onClick={() => setFilter('income')}
      className={`px-4 py-2 rounded-lg font-semibold transition ${
        filter === 'income' 
          ? 'bg-green-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      💰 Income Only
    </button>
    
    <button
      onClick={() => setFilter('expense')}
      className={`px-4 py-2 rounded-lg font-semibold transition ${
        filter === 'expense' 
          ? 'bg-red-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      💸 Expenses Only
    </button>
  </div>
  
  {/* Search by Category */}
  <div>
    <input
      type="text"
      placeholder="🔍 Search by category (e.g., Food, Rent)..."
      value={searchCategory}
      onChange={(e) => setSearchCategory(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    />
  </div>
  
  {/* Results Count */}
  <p className="text-sm text-gray-600">
    Showing <span className="font-bold text-indigo-600">{filteredTransactions.length}</span> of {transactions.length} transactions
  </p>
</div>
  
  {filteredTransactions.length === 0 ? (
    <p className="text-gray-500 text-center py-8">
       No transactions match your filters. Try adjusting your search!
    </p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr 
              key={transaction.id} 
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-700">{transaction.date}</td>
              <td className="py-3 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {transaction.type === 'income' ? '💰 Income' : '💸 Expense'}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-700">{transaction.category}</td>
              <td className="py-3 px-4 text-gray-600">{transaction.description || '-'}</td>
              <td className={`py-3 px-4 text-right font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => {
                    setTransactions(transactions.filter(t => t.id !== transaction.id));
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

      </main>
    </div>








  );
}

export default App;