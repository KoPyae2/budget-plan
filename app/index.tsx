import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTransactions } from "@/context/TransactionContext";
import { useCategories } from "@/context/CategoryContext";
import { Link } from "expo-router";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import SetInitialAmountModal from "@/components/SetInitialAmountModal";

export default function Dashboard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [initModalVisible, setInitModalVisible] = useState(false);
  const { transactions, isInitialized,setInitialBalance,balance } = useTransactions();

  console.log(isInitialized);

  const { categories } = useCategories();

  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // const balance = totalIncome - totalExpenses;

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleSetInitialAmount = (amount: number) => {
    console.log("Initial amount set to:", amount);
    setInitialBalance(amount);
    setInitModalVisible(false);
    // Handle the logic for setting the initial amount (e.g., updating context)
  };

  if (!isInitialized && !initModalVisible) {
    setInitModalVisible(true);
  }

  useEffect(()=>{
    if(isInitialized){
      setInitModalVisible(false);
    }else{
      setInitModalVisible(true);
    }
  },[isInitialized])

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.savingsLabel}>Current Balance</Text>
          <Text style={styles.savingsAmount}>${balance.total.toFixed(2)}</Text>

          {/* Progress Bars */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarRow}>
              <Text style={[styles.progressLabel, { color: "#2563eb" }]}>Income</Text>
              <Text style={[styles.progressAmount, { color: "#2563eb" }]}>
                ${totalIncome.toFixed(2)}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(totalIncome / Math.max(totalIncome, totalExpenses)) * 100}%`,
                    backgroundColor: "#2563eb",
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarRow}>
              <Text style={[styles.progressLabel, { color: "#ef4444" }]}>Expenses</Text>
              <Text style={[styles.progressAmount, { color: "#ef4444" }]}>
                ${totalExpenses.toFixed(2)}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(totalExpenses / Math.max(totalIncome, totalExpenses)) * 100}%`,
                    backgroundColor: "#ef4444",
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.recentTransactionsContainer}>
          <View style={styles.recentTransactionsHeader}>
            <Text style={styles.recentTransactionsTitle}>Recent Transactions</Text>
            <Link href="/transactions" asChild>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome name="list-alt" size={48} color="#94a3b8" />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
            </View>
          ) : (
            <FlatList
              data={recentTransactions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const category = getCategoryById(item.categoryId);

                return (
                  <View style={styles.transactionItem}>
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: category?.color + "20" },
                      ]}
                    >
                      <FontAwesome
                        name={category?.icon || "question"}
                        size={20}
                        color={category?.color}
                      />
                    </View>
                    <View style={styles.transactionDetails}>
                      <View style={styles.titleRow}>
                        <Text style={styles.transactionTitle}>{item.title}</Text>
                        <Text
                          style={[
                            styles.transactionAmount,
                            { color: item.type === "income" ? "#22c55e" : "#ef4444" },
                          ]}
                        >
                          {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.subtitleRow}>
                        <View style={styles.categoryTag}>
                          <Text style={[styles.categoryText, { color: category?.color }]}>
                            {category?.name || "Uncategorized"}
                          </Text>
                        </View>
                        <Text style={styles.transactionDate}>{item.date}</Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </ScrollView>

      {/* Add Transaction Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <FontAwesome name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>

      <AddTransactionModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <SetInitialAmountModal
        visible={initModalVisible}
        close={() => setInitModalVisible(false)}
        setInitAmount={handleSetInitialAmount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafc",
  },
  balanceCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 16,
  },
  savingsLabel: {
    fontSize: 18,
    color: "#64748b",
    marginBottom: 8,
  },
  savingsAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
  },
  progressBarContainer: {
    marginTop: 12,
  },
  progressBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  recentTransactionsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentTransactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recentTransactionsTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  viewAllText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtitleRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "600",
  },
  transactionDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  categoryTag: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  },
});
