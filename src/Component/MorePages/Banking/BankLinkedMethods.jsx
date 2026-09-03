import React, { useState, useEffect, useRef, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Image,
    ScrollView, Platform, FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useRoute } from "@react-navigation/native";
import { PGContext } from "../../../Context/PGContext";
import { useHasPermission } from "../../../Utils/useHasPermission";



export default function BankLinkedMethods() {

    const route = useRoute();
    const { bankDetails, bankId } = route.params || {};

    const { getBankMethod, bankMethod, } = useContext(BankingContext);
    const { activeHostelId } = useContext(CommonContexts);
      const { getParticularHostelDetails, PGDetails } = useContext(PGContext);

    useEffect(() => {
      if (activeHostelId && bankId) {
        getBankMethod(activeHostelId, bankId);
      }
    }, [activeHostelId, bankId])

    console.log("bankMethod",bankMethod)

        const {
            canWriteModule: canWriteBanking,
            canReadModule: canReadBanking,
            canUpdateModule: canUpdateBanking,
            canDeleteModule: canDeleteBanking,
        } = useHasPermission("Banking")

     const isValidSubscription = PGDetails?.isSubscriptionActive;
    const isSubscriptionAllow = isValidSubscription
    

    const navigation = useNavigation()



    const getPaymentIcon = (method) => {
  switch (method) {
    case "UPI":
      return require("../../../Assets/Images/GpayIcon.png");

    case "Debit Card":
      return require("../../../Assets/Images/Cardblue.png");

    case "Credit Card":
      return require("../../../Assets/Images/Cardorange.png");

    default:
      return require("../../../Assets/Images/Cardblue.png");
  }
};

const getBadgeStyle = (method) => {
  switch (method) {
    case "UPI":
      return styles.upi;
    case "Debit Card":
      return styles.debit;
    case "Credit Card":
      return styles.credit;
    default:
      return styles.debit;
  }
};

const getBadgeTextColor = (method) => {
  switch (method) {
    case "UPI":
      return "#1D4ED8";
    case "Debit Card":
      return "#8B5CF6";
    case "Credit Card":
      return "#F97316";
    default:
      return "#111827";
  }
};

    const paymentMethods = [
        {
            id: 1,
            title: "Gpay UPI",
            value: "smartstay@oksbi",
            type: "UPI",
            icon: require("../../../Assets/Images/GpayIcon.png"),
        },
        {
            id: 2,
            title: "Phonepe UPI",
            value: "smartstay@oksbi",
            type: "UPI",
            icon: require("../../../Assets/Images/PhonepeSymbol.png"),
        },
        {
            id: 3,
            title: "SBI Debit Card",
            value: "3247 **** **** 9878",
            type: "Debit Card",
            icon: require("../../../Assets/Images/Cardblue.png"),
        },
        {
            id: 4,
            title: "Imman Credit Card",
            value: "6487 **** **** 5476",
            type: "Credit Card",
            payable: "₹18,160",
            icon: require("../../../Assets/Images/Cardorange.png"),
        },
    ];

    // const PaymentItem = ({ item }) => (
    //     <View style={styles.card}>

    //         <View style={styles.iconContainer}>
    //             <Image source={item.icon} style={styles.icon} />
    //         </View>

    //         <View style={styles.content}>

    //             <Text style={styles.title}>
    //                 {item.title}
    //             </Text>

    //             <Text style={styles.subtitle}>
    //                 {item.value}
    //             </Text>

    //         </View>

    //         <View style={styles.rightSection}>

    //             <View
    //                 style={[
    //                     styles.badge,
    //                     item.type === "UPI"
    //                         ? styles.upi
    //                         : item.type === "Debit Card"
    //                             ? styles.debit
    //                             : styles.credit
    //                 ]}
    //             >

    //                 <Text
    //                     style={[
    //                         styles.badgeText,
    //                         item.type === "UPI"
    //                             ? { color: "#1D4ED8" }
    //                             : item.type === "Debit Card"
    //                                 ? { color: "#8B5CF6" }
    //                                 : { color: "#F97316" }
    //                     ]}
    //                 >
    //                     {item.type}
    //                 </Text>

    //             </View>

    //             {item.payable && (

    //                 <Text style={styles.payable}>
    //                     Payable{" "}
    //                     <Text style={styles.amount}>
    //                         {item.payable}
    //                     </Text>
    //                 </Text>

    //             )}

    //         </View>

    //         <TouchableOpacity>

    //             <Image
    //                 source={require("../../../Assets/Images/3dots.png")}
    //                 style={styles.menu}
    //             />

    //         </TouchableOpacity>

    //     </View>
    // );

    const PaymentItem = ({ item }) => {
  const isCard =
    item.paymentMethod === "Credit Card" ||
    item.paymentMethod === "Debit Card";

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Image
          source={getPaymentIcon(item.paymentMethod)}
          style={styles.icon}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {item.displayName}
        </Text>

        <Text style={styles.subtitle}>
          {isCard
            ? `**** **** **** ${item.cardNumber}`
            : item.upiId || "-"}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <View
          style={[
            styles.badge,
            getBadgeStyle(item.paymentMethod),
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: getBadgeTextColor(item.paymentMethod) },
            ]}
          >
            {item.paymentMethod}
          </Text>
        </View>

        {item.paymentMethod === "Credit Card" &&
          item.creditLimit != null && (
            <Text style={styles.payable}>
              Limit{" "}
              <Text style={styles.amount}>
                ₹{Number(item.creditLimit).toLocaleString("en-IN")}
              </Text>
            </Text>
          )}
      </View>

      <TouchableOpacity>
        <Image
          source={require("../../../Assets/Images/3dots.png")}
          style={styles.menu}
        />
      </TouchableOpacity>
    </View>
  );
};

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <Text style={styles.heading}>
                    Linked Payment methods
                </Text>

                <TouchableOpacity 
                // style={styles.addBtn} 
                  style={[
                                styles.addBtn,
                                (!canWriteBanking || !isSubscriptionAllow) && {
                                    opacity: 0.4,
                                },
                            ]}
                            disabled={!canWriteBanking || !isSubscriptionAllow}

               onPress={() =>
  navigation.navigate("AddPaymentMethod", {
    bankDetails,
    bankId,
  })
}>
                    <Text style={styles.addBtnText}>
                        ＋ Add Method
                    </Text>
                </TouchableOpacity>

            </View>

            {/* <FlatList
                data={paymentMethods}
                keyExtractor={(item) => item?.id.toString()}
                renderItem={({ item }) => <PaymentItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            /> */}

            <FlatList
  data={bankMethod || []}
  keyExtractor={(item) => item.paymentMethodId}
  renderItem={({ item }) => <PaymentItem item={item} />}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 30 }}
  ListEmptyComponent={
    <View style={{ alignItems: "center", marginTop: 80 }}>
      <Text
        style={{
          fontFamily: "Gilroy-Medium",
          color: "#718096",
          fontSize: 15,
        }}
      >
        No linked payment methods found
      </Text>
    </View>
  }
/>

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 18,
        marginBottom: 30,
    },
    heading: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        color: "#111827"
    },

    addBtn: {
        height: 40,
        paddingHorizontal: 22,
        borderRadius: 12,
        backgroundColor: "#2648E8",
        justifyContent: "center",
        alignItems: "center",
    },

    addBtnText: {
        fontSize: 14,
        fontFamily: "Gilroy-Semibold",
        color: "#fff"
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 34,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },

    icon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },

    content: {
        flex: 1,
        marginLeft: 16
    },

    title: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        color: "#202020"
    },

    subtitle: {
        marginTop: 6,
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
        color: "#718096"
    },

    rightSection: {
        alignItems: "flex-end",
        marginRight: 14
    },

    badge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10
    },

    upi: {
        backgroundColor: "#EEF2FF"
    },

    debit: {
        backgroundColor: "#F6F0FF"
    },

    credit: {
        backgroundColor: "#FFF5EC"
    },

    badgeText: {
        fontSize: 13,
        fontFamily: "Gilroy-Semibold"
    },

    payable: {
        marginTop: 12,
        fontSize: 12,
        fontFamily: "Gilroy-Medium",
        color: "#6B7280"
    },

    amount: {
        fontSize: 15,
        fontFamily: "Gilroy-Bold",
        color: "#111827"
    },
    menu: {
        width: 18,
        height: 18,
        resizeMode: "contain",
        marginTop: 8,
    },

})