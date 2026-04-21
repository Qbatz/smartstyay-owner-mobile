import React, { useRef, useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useFloor } from "../../../Context/PayingGuestContext";
import Profile from "../../../Assets/Images/profile.png";
import SuccessModal from "../../../ToastFile/ToastPage";
import RoomIcon from "../../../Assets/Images/Room_Icon.png"
import BedIcon from "../../../Assets/Images/Bed_Icon.png"


export default function CheckoutBottomSheet({
  visible,
  onClose,
  customer,
  reason,
  setReason,
  checkoutDate = "22/10/2024",
  noticeDays = 30,
  onCheckout, selectedBed, selectedItem, onSuccess
}) {
  const sheetY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const navigation = useNavigation();
  const { activeHostelId } = useContext(CommonContexts);
  const { getCustomersByHostel, loading, initializeCheckout, confirmCheckout } = useCustomer();
  const { getAllFloorsByHostel, getAllRoomsByFloor, getAllBedsByRoom } = useFloor();
  const [customers, setCustomers] = useState([]);
  const [checkoutDateDettail, setCheckoutDateDettail] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");



  useEffect(() => {
    if (visible) {
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // close sheet
  const closeSheet = () => {
    Animated.timing(sheetY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(onClose);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1.2) {
          closeSheet();
        } else {
          Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;


  useFocusEffect(
    useCallback(() => {
      if (activeHostelId) {
        fetchCustomers();
      }
    }, [activeHostelId])
  );



  // const fetchCustomers = async () => {
  //   const data = await getCustomersByHostel(activeHostelId);
  //   setCustomers(data || []);
  // };
   const fetchCustomers = async () => {
  const data = await getCustomersByHostel(activeHostelId);
  setCustomers(data?.listCustomers || []);
};

  const matchedCustomer = customers.find(
    c =>
      c.customerId === selectedBed?.currentTenantInfo?.[0]?.tenetId ||
      c.customerId === selectedItem?.customerId
  );



  useEffect(() => {
    if (!activeHostelId) return;

    const customerId =
      selectedBed?.currentTenantInfo?.[0]?.tenetId ||
      selectedItem?.customerId;

    if (!customerId) return;

    const handleCheckoutInit = async () => {
      const res = await initializeCheckout(activeHostelId, customerId);

      if (res.success) {

        setCheckoutDateDettail(res.data)
      }
    };

    handleCheckoutInit();
  }, [selectedBed, selectedItem, activeHostelId]);

  const handleConfirmCheckout = async () => {
    const customerId =
      selectedBed?.currentTenantInfo?.[0]?.tenetId ||
      selectedItem?.customerId;

    if (!customerId) {
      alert("Customer missing");
      return;
    }

    const res = await confirmCheckout(customerId);
    console.log("checkout",res)

    if (res.success) {

      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      await getCustomersByHostel(activeHostelId);
      if (onSuccess) {
        await onSuccess();
      }
      onClose();

      setTimeout(() => {
        setShowSuccess(false);

      }, 800);

    } else {

      setModalType("error");
      setMessage(res.message);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);

      }, 800);
    }
  };
  console.log(matchedCustomer)


  if (!visible) return null;

  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeSheet} />


      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sheet,
          { transform: [{ translateY: sheetY }] },
        ]}
      >
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Check-out Tenant</Text>

          {/* <Text style={styles.notice}>
            Notice Days : <Text style={{ color: "#2D6CDF" }}>{noticeDays}</Text>
          </Text> */}

          {/* CARD */}
          <View style={styles.card}>
            <View style={styles.row}>
              {matchedCustomer?.profilePic ? 
               <Image source={matchedCustomer?.profilePic || Profile} style={styles.avatar} /> :
               <View style={[styles.avatar,{alignItems:'center',backgroundColor:'#e6e7eb',justifyContent:'center'}]}>
                  <Text style={{fontSize:16,fontFamily:'Gilroy-Bold'}}>{matchedCustomer?.initials}</Text>
               </View>
              }
             

              <View style={{ marginLeft: 12 }}>
                <Text style={styles.name}>{matchedCustomer?.fullName}</Text>

                <View style={styles.detailsRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeTxt}>{matchedCustomer?.floorName}</Text>
                  </View>
                  <Image source={RoomIcon} style={styles.icon} />
                  <Text style={styles.val}>{matchedCustomer?.roomName}</Text>
                  <Image source={BedIcon} style={styles.icon} />
                  <Text style={styles.val}>{matchedCustomer?.bedName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.line} />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Checkout Date</Text>
                <Text style={styles.labelVal}>{checkoutDateDettail?.checkoutDate}</Text>
              </View>

              <View style={{ flex: 1}}>
                <Text style={styles.label}>Status</Text>
                <Text style={[styles.labelVal, { color: "green" }]}>Checkout</Text>
              </View>
            </View>
          </View>

          {/* REASON */}
          <Text style={styles.label}>Reason</Text>
          <TextInput
            style={styles.reasonBox}
            multiline
            placeholder="Enter reason..."
            value={reason}
            onChangeText={setReason}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outBtn} onPress={handleConfirmCheckout}>
              <Text style={styles.outTxt}>Check-Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  }
  ,
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 20,
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111" },
  notice: { marginVertical: 5, color: "#777", fontSize: 14 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 15,
    marginTop: 10,
  },
  row: { flexDirection: "row", alignItems: "center", },
  avatar: { width: 50, height: 50, borderRadius: 30 },
  name: { fontSize: 17, fontWeight: "700", color: "#111" },
  detailsRow: { flexDirection: "row", marginTop: 6, alignItems: "center" },

  badge: {
    backgroundColor: "#FFF4D0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  badgeTxt: { fontSize: 11, color: "#C49A00" },

  icon: { width: 18, height: 18, marginHorizontal: 4 },
  val: { color: "#444", fontSize: 13 },

  label: { marginTop: 15, fontSize: 13, color: "#666" },
  labelVal: { fontSize: 14, fontWeight: "600", marginTop: 2 },

  line: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  reasonBox: {
    height: 110,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    textAlignVertical: "top",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 60,
    paddingTop: 30

  },

  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2D6CDF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  cancelTxt: { color: "#2D6CDF", fontWeight: "600" },

  outBtn: {
    flex: 1,
    backgroundColor: "#2D6CDF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  outTxt: { color: "#fff", fontWeight: "600" },
});
