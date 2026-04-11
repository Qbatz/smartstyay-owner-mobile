import React, { useEffect, useRef, useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { BillContext } from "../../Context/BillsContext";
import EditIcon from "../../Assets/Images/editIcon.png"
import RemoveIcon from "../../Assets/Images/remove.png"

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function SettlementDiscountAction({
  visible,
  onClose,
  onEdit,
  onEditSuccess,
  discountAmount = 0,
  hostelId,
  invoiceId,
  onSuccess, 
}) {
  const { DeleteBillDiscount } = useContext(BillContext);

  const [loading, setLoading] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleRefuse = async () => {
    if (!hostelId || !invoiceId) return;

    setLoading(true);

    const res = await DeleteBillDiscount({
      hostelId,
      invoiceId,
    });

    setLoading(false);

    if (res?.success) {
      handleClose(); 

      if (onSuccess) {
        onSuccess(); 
      }
    } else {
      console.log("Error:", res?.message);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 9999,
          elevation: 9999,
        }}
      />

      {/* Bottom Sheet */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: [{ translateY }],
          zIndex: 10000,
          elevation: 10000,
        }}
      >
        {/* Drag Line */}
        <View
          style={{
            width: 50,
            height: 5,
            backgroundColor: "#D9D9D9",
            borderRadius: 5,
            alignSelf: "center",
            marginBottom: 15,
          }}
        />

        {/* Title */}
        <Text style={{ fontSize: 20,  fontFamily: "Gilroy-Semibold", marginBottom: 6 , color:'#4B4B4B'}}>
          Update Discount !
        </Text>

        {/* Subtitle */}
        <Text style={{ fontSize: 16, color: "#4B4B4B", marginBottom: 20 , fontFamily: "Gilroy-Medium",}}>
          ₹ {discountAmount} discount applied on this invoice!
        </Text>

        {/* Buttons */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          
          {/* Edit */}
          <TouchableOpacity
            onPress={() => {
              handleClose();
              onEdit();
  

            }}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 10,
              backgroundColor: "#F3F3F3",
              flexDirection:'row',
              justifyContent:'center',
              alignItems: "center",
            }}
          >
            <Image source={EditIcon} style={{height:18, width:18, marginRight:5}}></Image>
            <Text style={{ color: "#333",  fontFamily: "Gilroy-Medium",}}>
              Edit
            </Text>
          </TouchableOpacity>

          {/* Refuse */}
          <TouchableOpacity
            onPress={handleRefuse}
            disabled={loading}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 10,
              backgroundColor: "#E53935",
               flexDirection:'row',
              justifyContent:'center',
              alignItems: "center",
            }}
          >
             <Image source={RemoveIcon} style={{height:12, width:12, marginRight:5}}></Image>
            
              <Text style={{ color: "#fff",  fontFamily: "Gilroy-Medium",}}>
                Refuse with Invoice
              </Text>
            
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}