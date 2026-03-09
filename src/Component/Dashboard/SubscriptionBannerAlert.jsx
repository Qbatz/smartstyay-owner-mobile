import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const SubscriptionExpiredCard = ({ visible, onRenew }) => {

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>

        <LinearGradient
          colors={["#1E3A8A", "#1D4ED8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >

          <Text style={styles.title}>
            Your Plan has Expired..!
          </Text>

          <Text style={styles.subtitle}>
            Renew your plan to continue managing the
            property operations.
          </Text>

          <TouchableOpacity style={styles.button} onPress={onRenew}>
            <Text style={styles.buttonText}>
              Renew Now →
            </Text>
          </TouchableOpacity>

        </LinearGradient>

      </View>
    </Modal>
  );
};

export default SubscriptionExpiredCard;

const styles = StyleSheet.create({

overlay:{
flex:1,
backgroundColor:"rgba(0,0,0,0.35)",
justifyContent:"center",
alignItems:"center",
padding:20
},

card:{
width:"100%",
borderRadius:14,
padding:22,
},

title:{
color:"#fff",
fontSize:18,
fontWeight:"700",
marginBottom:6
},

subtitle:{
color:"#E5E7EB",
fontSize:13,
marginBottom:18,
lineHeight:18
},

button:{
backgroundColor:"rgba(255,255,255,0.25)",
paddingVertical:10,
borderRadius:10,
alignItems:"center"
},

buttonText:{
color:"#fff",
fontSize:14,
fontWeight:"600"
}

});