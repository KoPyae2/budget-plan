import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTransactions } from '@/context/TransactionContext';
import { useCategories } from '@/context/CategoryContext';
import { Category } from '@/types/category';
import { AddCategoryModal } from './AddCategoryModal';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
}

export function AddTransactionModal({ visible, onClose }: AddTransactionModalProps) {
  const { addTransaction } = useTransactions();
  const { categories, updateCategoryAmount } = useCategories();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [note, setNote] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!amount) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
      isValid = false;
    }

    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await addTransaction({
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        date: new Date().toISOString().split('T')[0],
        categoryId: selectedCategory!.id,
        note: note.trim(),
      });
      await updateCategoryAmount(selectedCategory!.id, parseFloat(amount));
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('expense');
    setSelectedCategory(null);
    setNote('');
    setErrors({});
  };

  return (
    <>
      {visible && (
        <View style={styles.backdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </View>
      )}
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={styles.modalContent}>
            <View style={styles.handle} />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.innerContainer}
            >
              <ScrollView style={styles.content}>
                <Text style={styles.title}>Add Transaction</Text>

                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === 'expense' && styles.selectedType,
                    ]}
                    onPress={() => setType('expense')}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        type === 'expense' && styles.selectedTypeText,
                      ]}
                    >
                      Expense
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === 'income' && styles.selectedType,
                    ]}
                    onPress={() => setType('income')}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        type === 'income' && styles.selectedTypeText,
                      ]}
                    >
                      Income
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    setErrors(prev => ({ ...prev, title: undefined }));
                  }}
                  placeholder="Enter title"
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

                <Text style={styles.label}>Amount *</Text>
                <TextInput
                  style={[styles.input, errors.amount && styles.inputError]}
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    setErrors(prev => ({ ...prev, amount: undefined }));
                  }}
                  placeholder="Enter amount"
                  keyboardType="decimal-pad"
                />
                {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

                <Text style={styles.label}>Category *</Text>
                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                <View style={styles.categoriesContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={[errors.category && styles.categoryContainerError]}
                  >
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryItem,
                          selectedCategory?.id === category.id && {
                            backgroundColor: category.color,
                          },
                        ]}
                        onPress={() => {
                          setSelectedCategory(category);
                          setErrors(prev => ({ ...prev, category: undefined }));
                        }}
                      >
                        <FontAwesome
                          name={category.icon}
                          size={24}
                          color={selectedCategory?.id === category.id ? 'white' : category.color}
                        />
                        <Text
                          style={[
                            styles.categoryText,
                            selectedCategory?.id === category.id && styles.selectedCategoryText,
                          ]}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.addCategoryButton}
                      onPress={() => setShowCategoryModal(true)}
                    >
                      <FontAwesome name="plus" size={24} color="#64748b" />
                      <Text style={styles.addCategoryText}>New Category</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>

                <Text style={styles.label}>Note (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.noteInput]}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a note"
                  multiline
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onClose}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit}
                  >
                    <Text style={[styles.buttonText, styles.submitButtonText]}>
                      Add Transaction
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      <AddCategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    marginTop: 'auto',
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  innerContainer: {
    maxHeight: '100%',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedType: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  typeButtonText: {
    color: '#64748b',
    fontWeight: '600',
  },
  selectedTypeText: {
    color: 'white',
  },
  label: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  submitButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  submitButtonText: {
    color: 'white',
  },
  categoriesContainer: {
    marginVertical: 8,
  },
  categoryItem: {
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    minWidth: 100,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  addCategoryButton: {
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    minWidth: 100,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#64748b',
  },
  addCategoryText: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  categoryContainerError: {
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    padding: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
}); 