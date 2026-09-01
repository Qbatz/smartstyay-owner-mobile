import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, G, ClipPath, Rect } from "react-native-svg";

const SuccessModal = ({
  visible,
  onClose,
  message,
  type,
  modalStyle = {},
  messageStyle = {},
}) => {

  // ---------------- SVG ICONS ---------------- //
  const SuccessIcon = ({ size = 24, color = "#4CAF50" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12.5L11 14.5L15 10.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 21C6.48 21 2 16.52 2 11C2 5.48 6.48 1 12 1C17.52 1 22 5.48 22 11C22 16.52 17.52 21 12 21Z"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );

  const ErrorIcon = ({ size = 24, color = "#F44336" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0)">
        <Path
          d="M12 9V14"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.0001 21.4093H5.94005C2.47005 21.4093 1.02005 18.9293 2.70005 15.8993L5.82006 10.2793L8.76006 4.9993C10.5401 1.7893 13.4601 1.7893 15.2401 4.9993L18.1801 10.2893L21.3001 15.9093C22.9801 18.9393 21.5201 21.4193 18.0601 21.4193H12.0001V21.4093Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M11.9945 17H12.0035"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <ClipPath id="clip0">
        <Rect width="24" height="24" fill="white" />
      </ClipPath>
    </Svg>
  );

  const WarningIcon = ({ size = 24, color = "#FF9800" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 8V13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M12 17H12.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M10.29 3.85999L1.82001 18C1.09001 19.26 2.01001 21 3.47001 21H20.53C21.99 21 22.91 19.26 22.18 18L13.71 3.85999C12.98 2.59999 11.02 2.59999 10.29 3.85999Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );

  // ---------------- ICON HANDLER ---------------- //
  const getIcon = () => {
    switch (type) {
      case "success":
        return <SuccessIcon />;
      case "error":
        return <ErrorIcon />;
      case "warning":
        return <WarningIcon />;
      default:
        return <SuccessIcon />;
    }
  };

  // ---------------- STYLE HANDLERS ---------------- //
  const getBackground = () => {
    switch (type) {
      case "success":
        return "#f8fff8";
      case "error":
        return "#ffeaea";
      case "warning":
        return "#fff8e1";
      default:
        return "#fff";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "#2E7D32";
      case "error":
        return "#D32F2F";
      case "warning":
        return "#FF9800";
      default:
        return "#333";
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.modalContainer, { backgroundColor: getBackground() }, modalStyle]}>
          <View style={styles.row}>
            {getIcon()}
            <Text style={[styles.message, { color: getTextColor() }, messageStyle]}>
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
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingBottom: 40,
  },
  modalContainer: {
    width: "85%",
    borderRadius: 14,
    padding: 16,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    flexShrink: 1,
  },
});

export default SuccessModal;
