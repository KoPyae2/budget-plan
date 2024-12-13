import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useCategories } from '@/context/CategoryContext';

const ICON_OPTIONS = [
  'cutlery', 'shopping-cart', 'car', 'film', 'file-text-o',
  'fire', 'medkit', 'money', 'coffee', 'glass', 'home',
  'plane', 'gift', 'gamepad', 'book',
] as const;

const COLOR_OPTIONS = [
  '#f97316', '#8b5cf6', '#06b6d4', '#ec4899', '#f43f5e',
  '#64748b', '#22c55e', '#eab308', '#3b82f6', '#a855f7',
];

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  icon?: string;
  color?: string;
}

export function AddCategoryModal({ visible, onClose }: AddCategoryModalProps) {
  const { addCategory } = useCategories();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<typeof ICON_OPTIONS[number] | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Category name is required';
      isValid = false;
    }

    if (!selectedIcon) {
      newErrors.icon = 'Please select an icon';
      isValid = false;
    }

    if (!selectedColor) {
      newErrors.color = 'Please select a color';
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
      await addCategory({
        name: name.trim(),
        icon: selectedIcon!,
        color: selectedColor!,
        amount: 0,
        count: 0
      });
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add category. Please try again.');
    }
  };

  const resetForm = () => {
    setName('');
    setSelectedIcon(null);
    setSelectedColor(null);
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
            <ScrollView style={styles.content}>
              <Text style={styles.title}>Add Category</Text>

              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="Enter category name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <Text style={styles.label}>Icon *</Text>
              {errors.icon && <Text style={styles.errorText}>{errors.icon}</Text>}
              <View style={[styles.iconContainer, errors.icon && styles.containerError]}>
                <FlatList
                  data={ICON_OPTIONS}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.iconOption,
                        selectedIcon === item && styles.selectedIcon,
                      ]}
                      onPress={() => {
                        setSelectedIcon(item);
                        setErrors(prev => ({ ...prev, icon: undefined }));
                      }}
                    >
                      <FontAwesome
                        name={item}
                        size={24}
                        color={selectedIcon === item ? 'white' : '#64748b'}
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>

              <Text style={styles.label}>Color *</Text>
              {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
              <View style={[styles.colorContainer, errors.color && styles.containerError]}>
                <FlatList
                  data={COLOR_OPTIONS}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.colorOption,
                        { backgroundColor: item },
                        selectedColor === item && styles.selectedColor,
                      ]}
                      onPress={() => {
                        setSelectedColor(item);
                        setErrors(prev => ({ ...prev, color: undefined }));
                      }}
                    />
                  )}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    resetForm();
                    onClose();
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={[styles.buttonText, styles.submitButtonText]}>
                    Add Category
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  iconContainer: {
    marginVertical: 8,
    padding: 4,
  },
  colorContainer: {
    marginVertical: 8,
    padding: 4,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedIcon: {
    backgroundColor: '#2563eb',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
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
  inputError: {
    borderColor: '#ef4444',
  },
  containerError: {
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
}); 