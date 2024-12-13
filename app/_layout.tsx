import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { TransactionProvider, useTransactions } from "@/context/TransactionContext";
import { CategoryProvider } from "@/context/CategoryContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <CategoryProvider>
          <TransactionProvider>
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2563eb",
                tabBarInactiveTintColor: "#64748b",
                tabBarStyle: {
                  paddingBottom: 5,
                },
              }}
            >
              <Tabs.Screen
                name="index"
                options={{
                  title: "Dashboard",
                  tabBarIcon: ({ color }) => (
                    <FontAwesome name="home" size={24} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="transactions"
                options={{
                  title: "Transactions",
                  headerShown:true,
                  headerTitleAlign:'center',
                  tabBarIcon: ({ color }) => (
                    <FontAwesome name="exchange" size={24} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="analytics"
                options={{
                  title: "Analytics",
                  tabBarIcon: ({ color }) => (
                    <FontAwesome name="bar-chart" size={24} color={color} />
                  ),
                }}
              />
            </Tabs>
          </TransactionProvider>
        </CategoryProvider>
    </GestureHandlerRootView>
  );
}
