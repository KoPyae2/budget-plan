import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";

interface SetInitialAmountModalProps {
  visible: boolean;
  close: () => void;
  setInitAmount: (amount: number) => void;
}

export default function SetInitialAmountModal({
  visible,
  close,
  setInitAmount,
}: SetInitialAmountModalProps) {
  const [initialAmount, setInitialAmount] = useState("");

  const handleSetInitialAmount = () => {
    const parsedAmount = parseFloat(initialAmount);
    if (!initialAmount || isNaN(parsedAmount)) {
      Alert.alert("Invalid Input", "Please enter a valid amount.");
      return;
    }

    setInitAmount(parsedAmount);
    close();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Initial Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={initialAmount}
            onChangeText={setInitialAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.setButton} onPress={handleSetInitialAmount}>
            <Text style={styles.setButtonText}>Set</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  setButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },
  setButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },
  cancelButtonText: {
    color: "#1f2937",
    fontSize: 16,
    fontWeight: "600",
  },
});
