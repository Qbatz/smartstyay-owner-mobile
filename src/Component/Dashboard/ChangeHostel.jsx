import React,{useState,useRef,useCallback} from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,Animated,PanResponder,Dimensions,BackHandler } from "react-native";
import HostelImg from "../../Assets/Images/PgImg.png";
import PgRooms from "../../Assets/Images/pgrooms.png";
import call from "../../Assets/Images/call.png";
import sms from "../../Assets/Images/sms.png";
import Building from "../../Assets/Images/buildings.png";
import { useFocusEffect } from '@react-navigation/native';


export default function ChangeHostelScreen({ navigation }) {
    const [showSheet, setShowSheet] = useState(false);
const SCREEN_HEIGHT = Dimensions.get("window").height;
const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      if (showSheet) {
        closeSheet();   // 👈 bottom sheet close
        return true;    // 👈 prevent default back action
      }

      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [showSheet, navigation])
);

const openSheet = () => {
  setShowSheet(true);
  Animated.timing(translateY, {
    toValue: 0,
    duration: 220,
    useNativeDriver: true,
  }).start();
};

const closeSheet = () => {
  Animated.timing(translateY, {
    toValue: SCREEN_HEIGHT,
    duration: 200,
    useNativeDriver: true,
  }).start(() => setShowSheet(false));
};
const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > SCREEN_HEIGHT * 0.15) {
        closeSheet();
      } else {
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      }
    },
  })
).current;

  return (
    <>
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
     
      <View style={styles.header}>
  

  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Text style={styles.back}>←</Text>
    </TouchableOpacity>

    <Text style={styles.title}>Hostel</Text>
  </View>

  {/* RIGHT SIDE → Switch Account */}
  <TouchableOpacity onPress={openSheet}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={require("../../Assets/Images/arrow-transfer.png")} 
        style={{ width: 18, height: 18, marginRight: 4,transform: [{ rotate: "90deg" }],tintColor:"#2F80ED" }}
      />
      <Text style={styles.switchText}>Switch Account</Text>
    </View>
  </TouchableOpacity>

</View>


      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={HostelImg} style={styles.hostelImg} />

          <View style={{ marginLeft: 12 }}>
            <Text style={styles.hostelName}>Royal Grand Hostel</Text>
            <Text style={styles.badge}>Paying Guest</Text>
          </View>
        </View>

        {/* 3 Columns */}
        <View style={styles.rowBox}>
          <View style={styles.col}>
            <Text style={styles.num}>210</Text>
            <Text style={styles.label}>Available Beds</Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.num}>45</Text>
            <Text style={styles.label}>Total Rooms</Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.num}>192</Text>
            <Text style={styles.label}>Occupied Beds</Text>
          </View>
        </View>

        {/* Images row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[PgRooms, PgRooms, PgRooms,PgRooms,PgRooms].map((x, i) => (
            <Image key={i} source={x} style={styles.roomImg} />
          ))}
        </ScrollView>

        {/* Contact Info */}
        {/* <View style={{ marginTop: 12 }}>
          <Text style={styles.info}><Image source={sms} style={{width:15,height:15}}/> info@royalgrand.com</Text>
          <Text style={styles.info}><Image source={call}/>  +91 98765 43210</Text>
          <Text style={styles.info}>
        <Image source={Building}/> 9, 8th Main Rd, Jaya Nagar Block 1, Solinganallur, Chennai 600098
          </Text>
        </View> */}
        <View style={{ marginTop: 12 }}>

  {/* Email */}
  <View style={styles.infoRow}>
    <Image source={sms} style={styles.infoIcon} />
    <Text style={styles.infoText}>info@royalgrand.com</Text>
  </View>

  {/* Phone */}
  <View style={styles.infoRow}>
    <Image source={call} style={styles.infoIcon} />
    <Text style={styles.infoText}>+91 98765 43210</Text>
  </View>

  {/* Address */}
  <View style={styles.infoRow}>
    <Image source={Building} style={styles.infoIcon} />
    <Text style={styles.infoText}>
      9, 8th Main Rd, Jaya Nagar 1st Block, Solinganallur, Chennai, 600 098
    </Text>
  </View>

</View>

      </View>
    </ScrollView>
    {showSheet && (
  <View style={styles.overlay}>
    {/* Close by touching outside */}
    <TouchableOpacity style={{ flex: 1 }} onPress={closeSheet} />

    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.sheet, { transform: [{ translateY }] }]}
    >
      <View style={styles.handle} />

      {/* Hostel List */}
      <TouchableOpacity style={styles.hostelRow}>
        <Image source={HostelImg} style={styles.hostelIcon} />
        <View>
          <Text style={styles.hostelTitle}>Royal Grand Hostel</Text>
          <Text style={styles.hostelEmail}>info@royalgrand.com</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.hostelRow}>
        <Image source={HostelImg} style={styles.hostelIcon} />
        <View>
          <Text style={styles.hostelTitle}>Smartstay PG</Text>
          <Text style={styles.hostelEmail}>support@smartstay.com</Text>
        </View>
      </TouchableOpacity>
       <TouchableOpacity style={styles.hostelRow}>
        <Image source={HostelImg} style={styles.hostelIcon} />
        <View>
          <Text style={styles.hostelTitle}>Smartstay PG</Text>
          <Text style={styles.hostelEmail}>support@smartstay.com</Text>
        </View>
      </TouchableOpacity>

    </Animated.View>
  </View>
)}

    </>
  );
}

const styles = StyleSheet.create({
  header: {
  paddingHorizontal: 16,
  paddingTop: 40,
  paddingBottom: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

back: {
  fontSize: 22,
  fontWeight: "bold",
  marginRight: 12,
},

title: {
  fontSize: 18,
  fontWeight: "700",
  color: "#000",
},

switchText: {
  fontSize: 15,
  color: "#2F80ED",
  fontWeight: "600",
},


  card: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EAEFFC",
  },
  hostelImg: { width: 52, height: 52, borderRadius: 26 },
  hostelName: { fontSize: 18, fontWeight: "700" },
  badge: {
    backgroundColor: "#F6EEDA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    marginTop: 4,
  },

  rowBox: {
    backgroundColor: "#F4F7FF",
    borderRadius: 12,
    flexDirection: "row",
    padding: 14,
    marginTop: 16,
  },
  col: { flex: 1, alignItems: "center" },
  num: { fontSize: 20, fontWeight: "700" },
  label: { fontSize: 11, color: "#6B7280", marginTop: 4 },

  roomImg: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginTop: 14,
  },

  info: {
    marginTop: 8,
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 8,
},

infoIcon: {
  width: 18,
  height: 18,
  
  marginRight: 10,
},

infoText: {
  fontSize: 13,
  color: "#4B5563",
  flex: 1,  // long address wrap properly
  lineHeight: 20,
},
overlay: {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
  
},

sheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  paddingBottom: 70,
  maxHeight: "60%",
},

handle: {
  width: 45,
  height: 5,
  backgroundColor: "#D1D5DB",
  borderRadius: 10,
  alignSelf: "center",
  marginBottom: 15,
},

hostelRow: {
  flexDirection: "row",
  padding: 14,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#E0E7FF",
  marginBottom: 12,
  alignItems: "center",
},

hostelIcon: {
  width: 48,
  height: 48,
  borderRadius: 10,
  marginRight: 12,
},

hostelTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: "#111",
},

hostelEmail: {
  fontSize: 13,
  color: "#6B7280",
  marginTop: 2,
},


});
