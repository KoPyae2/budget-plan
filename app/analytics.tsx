import { useCategories } from "@/context/CategoryContext";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import PieChart from "react-native-pie-chart";
import { Category } from "@/types/category";

const categor = [
  { id: 1, name: "Salary", amount: 5000, transactions: 1, color: "#4F46E5", icon: "💼" },
  { id: 2, name: "Medicine", amount: 2680, transactions: 2, color: "#EF4444", icon: "💊" },
  { id: 3, name: "Restaurant", amount: 2680, transactions: 5, color: "#F97316", icon: "🍴" },
  { id: 4, name: "Cloth", amount: 700, transactions: 2, color: "#10B981", icon: "👗" },
  { id: 5, name: "Fuel", amount: 190, transactions: 3, color: "#22D3EE", icon: "⛽" },
];

export default function Analytics() {
  const { categories } = useCategories();

  const totalAmount = categories.reduce((sum, category) => sum + category.amount, 0);

  const chartData = categories.map((category) => category.amount);
  const chartColors = categories.map((category) => category.color);

  console.log(chartData);
  console.log(chartColors);



  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
        <FontAwesome
          name={item.icon}
          size={24}
          color={item.color}
        />

      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.transactionCount}>
          {item.count} {item.count > 1 ? "transactions" : "transaction"}
        </Text>
      </View>
      <Text style={styles.categoryAmount}>${item.amount.toLocaleString()}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Pie Chart Section */}
      <View style={styles.pieChartContainer}>
        <PieChart
          widthAndHeight={180}
          series={chartData}
          sliceColor={chartColors}
          coverRadius={0.6}
          coverFill={"#FFFFFF"}
        />
        <Text style={styles.totalAmount}>Total: ${totalAmount.toLocaleString()}</Text>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {categories.map((category) => (
            <View key={category.id} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: category.color }]}
              />
              <Text style={styles.legendText}>{category.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Category Details Section */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
        contentContainerStyle={styles.categoriesContainer}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  pieChartContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 8,
  },
  legendContainer: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#333333",
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  detailsContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  transactionCount: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
});
