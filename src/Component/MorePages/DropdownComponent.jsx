
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Keyboard,
} from 'react-native';

import { ArrowUp2, ArrowDown2, SearchNormal1 } from 'iconsax-react-native';

const DropdownComponent = ({
  label,
  required = false,
  options = [],
  value,
  onChange,
  placeholder = 'Select one',
  error,
  emptyText = 'No options available',
  disabled = false,
  containerStyle,
  dropdownStyle,
  maxDropdownHeight = 240,
  dropdownWidthRatio = 1,

  // NEW FEATURES
  searchable = false,
  allowCustomValue = false,
  searchPlaceholder = 'Search...',
  customValueLabel = 'Add',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const triggerRef = useRef(null);

  // Selected option
  const selectedOption = options?.find(item => {
    const itemValue =
      typeof item === 'object' ? item?.value : item;

    return (
      itemValue != null &&
      value != null &&
      String(itemValue) === String(value)
    );
  });

  const selectedLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label
      : selectedOption
    : allowCustomValue && typeof value === 'string'
      ? value
      : '';

  // Search filter
  const filteredOptions = options.filter(item => {
    const itemLabel =
      typeof item === 'object' ? item?.label : item;

    return String(itemLabel ?? '')
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());
  });

  // Check whether typed value already exists
  const customValueExists = options.some(item => {
    const itemLabel =
      typeof item === 'object' ? item?.label : item;

    const itemValue =
      typeof item === 'object' ? item?.value : item;

    const query = searchText.trim().toLowerCase();

    return (
      String(itemLabel ?? '').trim().toLowerCase() === query ||
      String(itemValue ?? '').trim().toLowerCase() === query
    );
  });

  const canAddCustomValue =
    searchable &&
    allowCustomValue &&
    searchText.trim().length > 0 &&
    !customValueExists;

  // Open dropdown
  const openDropdown = () => {
    if (disabled) return;

    setSearchText('');

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const statusBarOffset =
        Platform.OS === 'android'
          ? StatusBar.currentHeight || 0
          : 0;

      setDropdownPosition({
        top: y + height + 6 + statusBarOffset,
        left: x,
        width,
      });

      setIsOpen(true);
    });
  };

  const closeDropdown = () => {
    Keyboard.dismiss();
    setIsOpen(false);
    setSearchText('');
  };

  // Select existing option
  const handleSelect = item => {
    const selectedValue =
      typeof item === 'object' ? item.value : item;

    onChange?.(selectedValue);
    closeDropdown();
  };

  // Add custom value
  const handleAddCustomValue = () => {
    const customValue = searchText.trim();

    if (!customValue || !allowCustomValue) return;

    onChange?.(customValue);
    closeDropdown();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required && (
            <Text style={styles.required}> *</Text>
          )}
        </Text>
      ) : null}

      {/* Dropdown Trigger */}
      <TouchableOpacity
        ref={triggerRef}
        activeOpacity={0.8}
        onPress={openDropdown}
        disabled={disabled}
        style={[
          styles.trigger,
          error && styles.errorBorder,
          disabled && styles.disabled,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.triggerText,
            !selectedLabel && styles.placeholder,
          ]}
        >
          {selectedLabel || placeholder}
        </Text>

        {isOpen ? (
          <ArrowUp2 size={20} color="#18181B" />
        ) : (
          <ArrowDown2 size={20} color="#71717A" />
        )}
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDropdown}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeDropdown}
          />

          <View
            style={[
              styles.optionsContainer,
              {
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width:
                  dropdownPosition.width * dropdownWidthRatio,
                maxHeight: maxDropdownHeight,
              },
              dropdownStyle,
            ]}
          >
            {/* Search Input */}
            {searchable && (
              <View style={styles.searchContainer}>
                <SearchNormal1
                  size={18}
                  color="#71717A"
                />

                <TextInput
                  style={styles.searchInput}
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#A1A1AA"
                  value={searchText}
                  onChangeText={setSearchText}
                  returnKeyType={
                    canAddCustomValue ? 'done' : 'search'
                  }
                  onSubmitEditing={
                    canAddCustomValue
                      ? handleAddCustomValue
                      : undefined
                  }
                  blurOnSubmit={false}
                  autoCorrect={false}
                />

                {searchText.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchText('')}
                  >
                    <Text style={styles.clearText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <ScrollView
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {/* Existing Options */}
              {filteredOptions.map((item, index) => {
                const itemValue =
                  typeof item === 'object'
                    ? item.value
                    : item;

                const itemLabel =
                  typeof item === 'object'
                    ? item.label
                    : item;

                const isSelected =
                  value != null &&
                  String(itemValue) === String(value);

                return (
                  <TouchableOpacity
                    key={String(itemValue) + index}
                    activeOpacity={0.7}
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.option,
                      isSelected && styles.selectedOption,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {itemLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* No Results */}
              {filteredOptions.length === 0 &&
                !canAddCustomValue && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {emptyText}
                    </Text>
                  </View>
                )}

              {/* Add Custom Value */}
              {canAddCustomValue && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.addCustomOption}
                  onPress={handleAddCustomValue}
                >
                  <Text style={styles.addCustomText}>
                    + {customValueLabel} "{searchText.trim()}"
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontFamily: 'Gilroy-Semibold',
    color: '#18181B',
    marginBottom: 6,
  },

  required: {
    color: '#EF4444',
  },

  trigger: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  triggerText: {
    flex: 1,
    fontSize: 14,
    color: '#18181B',
    fontFamily: 'Gilroy-Semibold',
  },

  placeholder: {
    color: '#71717A',
  },

  disabled: {
    opacity: 0.5,
  },

  modalContainer: {
    flex: 1,
  },

  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 6,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 10,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: '#18181B',
    fontFamily: 'Gilroy-Medium',
    paddingVertical: 0,
  },

  clearText: {
    fontSize: 22,
    color: '#71717A',
  },

  option: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },

  optionText: {
    fontSize: 14,
    color: '#18181B',
    fontFamily: 'Gilroy-Semibold',
  },

  selectedOption: {
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
  },

  selectedText: {
    color: '#18181B',
    fontWeight: '500',
  },

  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
  },

  addCustomOption: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F5F8FF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },

  addCustomText: {
    fontSize: 14,
    color: '#2563EB',
    fontFamily: 'Gilroy-Semibold',
  },

  errorBorder: {
    borderColor: '#EF4444',
  },
});

export default DropdownComponent;


// state dropdown 
{/* <DropdownComponent
  label="State"
  required
  placeholder="Select State"
  options={stateOptions}
  value={selectedState}
  onChange={setSelectedState}
  searchable={true}
  searchPlaceholder="Search State..."
  emptyText="No state found"
/> */}


// saerch and add value 

{/* <DropdownComponent
  label="Received from"
  required
  placeholder="Enter / Select the Respective Person"
  options={guardianOptions}
  value={selectedGuardian}
  onChange={setSelectedGuardian}
  searchable={true}
  allowCustomValue={true}
  searchPlaceholder="Search Guardian..."
  customValueLabel="Add Guardian"
  emptyText="No guardian found"
/> */}