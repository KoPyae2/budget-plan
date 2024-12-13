import { View, Text, StyleSheet, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTransactions } from "@/context/TransactionContext";
import { useCategories } from "@/context/CategoryContext";

export default function Transactions() {
  const { transactions, loading } = useTransactions();
  const { categories } = useCategories();

  const getCategoryById = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome name="list-alt" size={48} color="#94a3b8" />
          <Text style={styles.emptyStateText}>No transactions yet</Text>
        </View>
      ) : (
        <FlatList
          data={transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const category = getCategoryById(item.categoryId);
            
            return (
              <View style={styles.transactionItem}>
                <View style={[styles.categoryIcon, { backgroundColor: category?.color + '20' }]}>
                  <FontAwesome
                    name={category?.icon || 'question'}
                    size={20}
                    color={category?.color}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <View style={styles.titleRow}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text
                      style={[styles.transactionAmount, { color: item.type === 'income' ? '#22c55e' : '#ef4444' }]}
                    >
                      {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.subtitleRow}>
                    <View style={styles.categoryTag}>
                      <Text style={[styles.categoryText, { color: category?.color }]}>
                        {category?.name || 'Uncategorized'}
                      </Text>
                    </View>
                    <Text style={styles.transactionDate}>{item.date}</Text>
                  </View>
                  {item.note && (
                    <Text style={styles.transactionNote}>{item.note}</Text>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#64748b',
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
  transactionItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: "#6b7280",
  },
  transactionDate: {
    fontSize: 14,
    color: "#9ca3af",
  },
  transactionNote: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "600",
  },
});
