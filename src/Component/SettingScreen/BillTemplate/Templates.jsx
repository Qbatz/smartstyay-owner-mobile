import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import BackIcon from "../../../Assets/Images/Arrow_left.png";

export default function TemplateSettings({ onBack }) {
  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Templates</Text>
      </View>

      <Text style={{ fontSize: 16, marginTop: 20 }}>
        Template Settings UI Here...
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backIcon: { width: 22, height: 22, marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
});
