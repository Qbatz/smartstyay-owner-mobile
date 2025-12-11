import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, G, ClipPath, Rect } from "react-native-svg";

const ErrorMessage = ({ message, type = "error" }) => {
  if (!message) return null;

  const messages = Array.isArray(message) ? message : [message];

  let textColor, bgColor;

  switch (type) {
    case "success":
      textColor = "#03A000";
      bgColor = "rgba(230,255,230,0.7)";
      break;

    case "warning":
      textColor = "#FF8C00";
      bgColor = "rgba(255,140,0,0.15)";
      break;

    default:
      textColor = "#FF0000";
      bgColor = "rgba(255,0,0,0.10)";
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {messages.map((msg, index) => (
        <View key={index} style={styles.row}>
          
          {/* INLINE SVG ICON */}
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <G clipPath="url(#clip0)">
              <Path
                d="M12 9V14"
                stroke={textColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12.0001 21.4093H5.94005C2.47005 21.4093 1.02005 18.9293 2.70005 15.8993L5.82006 10.2793L8.76006 4.9993C10.5401 1.7893 13.4601 1.7893 15.2401 4.9993L18.1801 10.2893L21.3001 15.9093C22.9801 18.9393 21.5201 21.4193 18.0601 21.4193H12.0001V21.4093Z"
                stroke={textColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M11.9945 17H12.0035"
                stroke={textColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </G>
            <ClipPath id="clip0">
              <Rect width="24" height="24" fill="white" />
            </ClipPath>
          </Svg>

          <Text style={[styles.text, { color: textColor }]}>{msg}</Text>
        </View>
      ))}
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
});
