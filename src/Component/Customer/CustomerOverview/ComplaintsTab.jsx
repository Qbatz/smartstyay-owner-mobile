import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import EmptyState from "../../../Assets/Images/Empty_state.png";

const ComplaintsTab = () => {
  return (
    <View style={styles.container}>
      <Image source={EmptyState} style={styles.image} resizeMode="contain" />
      <Text style={styles.text}>No Complaints Found</Text>
    </View>
  );
};

export default ComplaintsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 180,
    height: 180,
  },

  text: {
    marginTop: 15,
    fontSize: 16,
    color: "#6B7280",
  },
});

