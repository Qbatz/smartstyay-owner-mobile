
import React, { useRef, useState, useEffect } from 'react';
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
  Keyboard, Dimensions,
} from 'react-native';
import CheckboxComponent from "./CheckboxComponent"

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

  // option width ==> 
  dropdownWidthRatio = 0.91,


  searchable = false,
  allowCustomValue = false,
  searchPlaceholder = 'Search...',
  customValueLabel = 'Add',
  multiSelect = false,
  closeOnSelect = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');



  const triggerRef = useRef(null);

  const getItemValue = item =>
    typeof item === 'object' ? item?.value : item;

  const getItemLabel = item =>
    typeof item === 'object' ? item?.label : item;

  const selectedValues = multiSelect && Array.isArray(value) ? value : [];

  const isValueSelected = v =>
    multiSelect
      ? selectedValues.some(s => String(s) === String(v))
      : value != null && String(v) === String(value);

  const selectedOption = options?.find(item => {
    const itemValue = getItemValue(item);
    return (
      itemValue != null &&
      value != null &&
      String(itemValue) === String(value)
    );
  });

  const singleLabel = selectedOption
    ? getItemLabel(selectedOption)
    : allowCustomValue && typeof value === 'string'
      ? value
      : '';

  const getMultiLabel = () => {
    if (selectedValues.length === 0) return '';

    const first = selectedValues[0];
    const firstOption = options.find(
      item => String(getItemValue(item)) === String(first)
    );
    const firstLabel = firstOption ? getItemLabel(firstOption) : String(first);

    const extra = selectedValues.length - 1;
    return extra > 0 ? `${firstLabel} +${extra} more` : firstLabel;
  };

  const selectedLabel = multiSelect ? getMultiLabel() : singleLabel;

  const filteredOptions = options.filter(item => {
    const itemLabel =
      typeof item === 'object' ? item?.label : item;

    return String(itemLabel ?? '')
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());
  });

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


  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    triggerTop: 0,
    triggerHeight: 48,
    maxHeight: maxDropdownHeight,
  });

  const triggerLayoutRef = useRef(null);
  const keyboardHeightRef = useRef(0);

  const searchInputRef = useRef(null);


  const calculateDropdownPosition = (y, height, x, width) => {
    const screenHeight = Dimensions.get('screen').height;

    const visibleHeight =
      keyboardHeightRef.current > 0
        ? keyboardHeightRef.current > screenHeight
          ? screenHeight
          : screenHeight - keyboardHeightRef.current
        : screenHeight;

    const spaceBelow = visibleHeight - (y + height) - 12;
    const spaceAbove = y - 12;

    const showBelow =
      spaceBelow >= 160 || spaceBelow >= spaceAbove;

    const availableSpace = showBelow
      ? spaceBelow
      : spaceAbove;

    const finalHeight = Math.max(
      60,
      Math.min(maxDropdownHeight, availableSpace)
    );

    setDropdownPosition({
      top: showBelow
        ? y + height + 6
        : Math.max(12, y - finalHeight - 6),
      left: x,
      width,
      triggerTop: y,
      triggerHeight: height,
      maxHeight: finalHeight,
    });
  };

  const openDropdown = () => {
    if (disabled) return;

    setSearchText('');

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      triggerLayoutRef.current = { x, y, width, height };

      calculateDropdownPosition(y, height, x, width);

      setIsOpen(true);
    });
  };



  useEffect(() => {
    const showListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        keyboardHeightRef.current =
          event.endCoordinates.height;

        triggerRef.current?.measureInWindow(
          (x, y, width, height) => {
            calculateDropdownPosition(y, height, x, width);
          }
        );
      }
    );

    const hideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        keyboardHeightRef.current = 0;

        if (isOpen) {
          triggerRef.current?.measureInWindow(
            (x, y, width, height) => {
              calculateDropdownPosition(y, height, x, width);
            }
          );
        }
      }
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [isOpen]);

  const closeDropdown = () => {
    Keyboard.dismiss();
    setIsOpen(false);
    setSearchText('');
  };

  const handleSelect = item => {
    const selectedValue = getItemValue(item);

    if (multiSelect) {
      const alreadySelected = isValueSelected(selectedValue);

      const next = alreadySelected
        ? selectedValues.filter(v => String(v) !== String(selectedValue))
        : [...selectedValues, selectedValue];

      onChange?.(next);

      if (closeOnSelect) closeDropdown();
      return;
    }

    onChange?.(selectedValue);
    closeDropdown();
  };

  const handleAddCustomValue = () => {
    const customValue = searchText.trim();
    if (!customValue || !allowCustomValue) return;

    if (multiSelect) {
      if (!isValueSelected(customValue)) {
        onChange?.([...selectedValues, customValue]);
      }
    } else {
      onChange?.(customValue);
    }
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


      <TouchableOpacity
        ref={triggerRef}
        activeOpacity={0.8}
        onPress={openDropdown}
        disabled={disabled || isOpen}
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

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        // onShow={focusSearchInput}
        onRequestClose={closeDropdown}
      >
        <View style={styles.modalContainer}>

          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeDropdown}
          />

          {searchable && (
            <View
              style={[
                styles.searchTrigger,
                {
                  position: 'absolute',
                  top: dropdownPosition.triggerTop,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                  height: dropdownPosition.triggerHeight,
                },
              ]}
            >
              {/* <SearchNormal1
                size={20}
                color="#71717A"
              /> */}

              <TextInput
                ref={searchInputRef}
                style={styles.searchTriggerInput}
                placeholder={searchPlaceholder}
                placeholderTextColor="#A1A1AA"
                value={searchText}
                onChangeText={setSearchText}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                showSoftInputOnFocus={true}
                editable={true}
                blurOnSubmit={false}
              />

              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchText('')}
                >
                  <Text style={styles.clearText}>×</Text>
                </TouchableOpacity>
              )}

              <ArrowUp2 size={20} color="#18181B" />
            </View>
          )}

          <View
            style={[
              styles.optionsShadow,
              {
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width * dropdownWidthRatio,
                maxHeight: dropdownPosition.maxHeight,
              },
              dropdownStyle,
            ]}
          >
            <View style={styles.optionsClip}>
              <ScrollView
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {filteredOptions.map((item, index) => {
                  const itemValue = getItemValue(item);
                  const itemLabel = getItemLabel(item);
                  const isSelected = isValueSelected(itemValue);

                  if (multiSelect) {
                    return (
                      <View key={String(itemValue) + index} style={styles.checkboxRow}>
                        <CheckboxComponent
                          title={itemLabel}
                          value={isSelected}
                          onValueChange={() => handleSelect(item)}
                          titleStyle={styles.checkboxTitle}
                          containerStyle={{ paddingVertical: 10 }}
                        />
                      </View>
                    );
                  }

                  return (
                    <TouchableOpacity
                      key={String(itemValue) + index}
                      activeOpacity={0.7}
                      onPress={() => handleSelect(item)}
                      style={[styles.option, isSelected && styles.selectedOption]}
                    >
                      <Text style={[styles.optionText, isSelected && styles.selectedText]}>
                        {itemLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {filteredOptions.length === 0 &&
                  !canAddCustomValue && (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        {emptyText}
                      </Text>
                    </View>
                  )}

                {canAddCustomValue && (
                  <TouchableOpacity
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
    marginTop: 6
  },

  required: {
    color: '#EF4444',
  },

  trigger: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#DEDEDE',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingLeft: 12,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
    borderWidth: 1.5
  },
  searchTrigger: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    zIndex: 10,
  },

  searchTriggerInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontSize: 14,
    color: '#18181B',
    fontFamily: 'Gilroy-Medium',
  },

  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  optionsShadow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,

    elevation: 12,

    overflow: 'visible',
    zIndex: 20,

  },

  optionsClip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    paddingVertical: 6
  },

  searchTrigger: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },

  searchTriggerInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontSize: 14,
    color: '#18181B',
    fontFamily: 'Gilroy-Medium',
    textAlignVertical: 'center',
  },

  option: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },

  optionText: {
    fontSize: 14,
    color: '#18181B',
    fontFamily: 'Gilroy-Semibold',
  },
  checkboxRow: {
    paddingHorizontal: 14,
  },

  checkboxTitle: {
    fontSize: 14,
    fontFamily: 'Gilroy-Semibold',
    color: '#18181B',
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