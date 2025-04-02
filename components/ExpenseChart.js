import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { PieChart } from "recharts";
import axios from "axios";

const ExpenseChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("https://your-backend-url/api/transactions", {
      headers: { Authorization: `Bearer YOUR_TOKEN` },
    })
    .then(response => {
      const expenses = response.data.filter((t) => t.type === "expense");
      const groupedData = expenses.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) acc[category] = 0;
        acc[category] += item.amount;
        return acc;
      }, {});

      const chartData = Object.keys(groupedData).map((category) => ({
        name: category,
        value: groupedData[category],
      }));

      setData(chartData);
    })
    .catch(error => console.log(error));
  }, []);

  return (
    <View>
      <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>Expense Distribution</Text>
      <PieChart
        data={data}
        cx={150}
        cy={100}
        innerRadius={40}
        outerRadius={80}
        fill="#8884d8"
      />
    </View>
  );
};

export default ExpenseChart;
