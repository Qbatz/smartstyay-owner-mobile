import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";


export default function DeleteComplaintModal({
  visible,
  onClose,

}) {




  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {

        console.log("Back Pressed - Modal Visible:", visible);

        if (visible) {
          onClose();
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [visible])
  );



  return (
    <>

     

    
     


  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.deleteOverlay}>
      <View style={styles.deleteBox}>
 
        <Text style={styles.deleteTitle}>Delete Complaint ?</Text>
        <Text style={styles.deleteSub}>
          Are you sure you want to delete this Complaint ?
        </Text>
 
        <View style={styles.deleteBtnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onClose}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
 
      </View>
    </View>
  </Modal>


      

    </>
  );
}

const styles = StyleSheet.create({
  deleteOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},
 
deleteBox: {
  width: "90%",
  backgroundColor: "#fff",
  padding: 25,
  borderRadius: 15,
  alignItems: "center",
  elevation: 10,
},
 
deleteTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#111",
  marginBottom: 10,
},
 
deleteSub: {
  fontSize: 14,
  color: "#555",
  textAlign: "center",
  marginBottom: 25,
},
 
deleteBtnRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
},
 
cancelBtn: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#2D6CDF",
  marginRight: 10,
  alignItems: "center",
},
 
cancelText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#2D6CDF",
},
 
deleteBtn: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 10,
  backgroundColor: "#2D6CDF",
  alignItems: "center",
},
 
deleteBtnText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#fff",
},

});
