import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

function App() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses
  const fetchExpenses = async () => {
    const res = await fetch("https://expense-tracker-qevb.onrender.com/get");
    const data = await res.json();
    setExpenses(data);
  };

  // Add expense
  const addExpense = async () => {
    if (!amount || !category || !date) return;

    await fetch("https://expense-tracker-qevb.onrender.com/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount, category, date })
    });

    setAmount("");
    setCategory("");
    setDate("");
    fetchExpenses();
  };

  // Delete expense (using id now)
  const deleteExpense = async (id) => {
    await fetch(`https://expense-tracker-qevb.onrender.com/delete/${id}`, {
      method: "DELETE"
    });
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calculate total
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // Prepare chart data
  const categoryTotals = {};
  expenses.forEach((e) => {
    if (!categoryTotals[e.category]) {
      categoryTotals[e.category] = 0;
    }
    categoryTotals[e.category] += Number(e.amount);
  });

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals)
      }
    ]
  };

  return (
  <div className="dashboard">

    {/* LEFT */}
    <div className="container">
      <h1>💰 Expense Tracker</h1>

      <input placeholder="Amount" value={amount}
        onChange={(e) => setAmount(e.target.value)} />

      <input placeholder="Category" value={category}
        onChange={(e) => setCategory(e.target.value)} />

      <input type="date" value={date}
        onChange={(e) => setDate(e.target.value)} />

      <button onClick={addExpense}>Add Expense</button>

      <div className="total">Total: ₹{total}</div>

      {expenses.map((e) => (
        <div key={e.id} className="card">
          ₹{e.amount} - {e.category} ({e.date})
          <br />
          <button
            className="delete-btn"
            onClick={() => deleteExpense(e.id)}
          >
            ❌ Delete
          </button>
        </div>
      ))}
    </div>

    {/* RIGHT */}
    <div className="right-panel">
      <h3>📊 Spending Breakdown</h3>
      {expenses.length > 0 && <Pie data={chartData} />}
    </div>

  </div>
);
}

export default App;