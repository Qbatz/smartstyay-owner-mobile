import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,Image
} from "react-native";
import AddIcon from "../../Assets/Images/AddIcon.png"
import CloseIcon from "../../Assets/Images/close_circle.png"


export default function AddButton({
  isOpen,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      {/* <View > */}
       <Image
  source={isOpen ? CloseIcon : AddIcon}
  style={styles.icon}
/>
      {/* </View> */}

      <Text style={styles.label}>
         { isOpen ? "Close" : "Add"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
 container: {
  width: 60,
//   height: 74,
  alignItems: "center",
  justifyContent: "flex-end",
    marginBottom:5
},

//   circle: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#07B53B",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 8,
//   },

 icon: {
  width: 30,
  height: 30,
  resizeMode: "contain",

},

 label: {
  marginTop: 2,
  fontSize: 12,
  color: "#444",
  fontFamily: "Gilroy-Regular",
},
});