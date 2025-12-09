import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SuccessModal = ({
  visible,
  onClose,
  message,
  type,
  imageSource,
  imageStyle = {},
  modalStyle = {},
  messageStyle = {},
}) => {
  const getIcon = () => {
    if (imageSource) {
      return (
        <Image source={imageSource} style={[styles.iconImage, imageStyle]} />
      );
    }

    switch (type) {
      case 'success':
        return <Icon name="checkmark-circle" size={24} color="#4CAF50" />;
      case 'error':
        return <Icon name="close-circle" size={24} color="#F44336" />;
      case 'warning':
        return <Icon name="warning" size={24} color="#FF9800" />;
      default:
        return <Icon name="checkmark-circle" size={24} color="#4CAF50" />;
    }
  };

  const getModalBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#f8fff8';
      case 'error':
        return '#ffeaea';
      case 'warning':
        return '#fff8e1';
      default:
        return 'white';
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case 'success':
        return '#2E7D32';
      case 'error':
        return '#D32F2F';
      case 'warning':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FF9800';
      default:
        return '#E0E0E0';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.modalContainer, modalStyle]}>
          <View style={styles.contentRow}>
            {getIcon()}
            <Text
              style={[
                styles.message,
                { color: getMessageColor() },
                messageStyle,
              ]}
            >
              {message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',  
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 280,
    borderColor: 'white',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    flex: 1,
    marginLeft: 8,
  },
});

export default SuccessModal;
