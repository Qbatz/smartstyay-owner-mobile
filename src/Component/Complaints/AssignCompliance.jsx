import React, { useEffect,useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView
} from "react-native";

import { BackHandler } from "react-native";
import DownArrow from "../../Assets/Images/direction-down.png";
import CloseIcon from "../../Assets/Images/remove.png";

export default function AssignBottomSheet({
  visible,
  onClose,
  selectedUser,
  setSelectedUser,
  onAssignDone 
}) {

     const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  // Close on hardware back press
  useEffect(() => {
    if (visible) {
      const backAction = () => {
        onClose();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => subscription.remove();
    }
  }, [visible]);

  return (
    <>
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />

        <View style={styles.sheet}>
             <View style={styles.headerLine} />
          {/* TITLE + CLOSE */}
          <View style={styles.header}>
            <Text style={styles.title}>Assign complaint</Text>

            <TouchableOpacity onPress={onClose}>
              <Image source={CloseIcon} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

        

         <Text style={styles.label}>Assign</Text>

<View style={styles.selectWrapper}>
  <TouchableOpacity style={styles.selectBox} onPress={toggleDropdown}>
    <Text style={styles.selectedText}>{selectedUser}</Text>
    <Image source={DownArrow} style={styles.downArrow} />
  </TouchableOpacity>

{dropdownVisible && (
  <View style={styles.dropdownMenu}>
    <ScrollView
      style={{ maxHeight: 150 }}       // limit height & scroll
      nestedScrollEnabled={true}        // important inside Modal
      showsVerticalScrollIndicator={false}
    >
      {["Raja", "Kannan", "Arun", "Vijay", "Sarath", "Pravin"].map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.option}
          onPress={() => {
            setSelectedUser(item);
            setDropdownVisible(false);
          }}
        >
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}

</View>



        
         <TouchableOpacity
  style={styles.submitBtn}
  onPress={() => {
    onAssignDone();    
  }}
>
  <Text style={styles.submitText}>Assign complaint</Text>
</TouchableOpacity>

        </View>
      </View>
    </Modal>


    
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
   headerLine: {
    width: 60,
    height: 5,
    backgroundColor: "#D5D5D5",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 15,
  },

selectBox: {
  borderWidth: 1,
  borderColor: "#D9D9D9",
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 16,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff",
},

selectWrapper: {
  position: "relative",
  width: "100%",
},


selectedText: {
  fontSize: 15,
  color: "#000",
},
sheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 35,
  position: "relative",

  minHeight: 350,  
},


  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeIcon: {
    width: 15,
    height:15,
    tintColor: "#000",
  },

  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
    marginTop: 10,
  },

 downArrow: {
  width: 18,
  height: 18,
  tintColor: "#6F6F6F",
},

dropdownMenu: {
  position: "absolute",
  top: 58,          // ⭐ EXACT spacing below the input box
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#D9D9D9",
  elevation: 8,
  zIndex: 999,
  paddingVertical: 8,
},



option: {
  paddingVertical: 14,
  paddingHorizontal: 16,
},

optionText: {
  fontSize: 15,
  color: "#000",
},
  downIcon: {
    width: 18,
    height: 18,
    tintColor: "#555",
  },

  submitBtn: {
    backgroundColor: "#1D5DFF",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 85,
  },
  headerLine: {
  width: 60,
  height: 5,
  backgroundColor: "#D5D5D5",
  borderRadius: 5,
  alignSelf: "center",
  marginBottom: 15,
},


  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
