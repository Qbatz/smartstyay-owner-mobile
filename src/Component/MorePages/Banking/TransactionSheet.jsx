import React, { useState, useEffect, useRef , useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  Image, TouchableWithoutFeedback
} from "react-native";
import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";


const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.48;

export default function TransactionSheet({
  visible,
  onClose, navigation, bankId , bankDetails
}) {


     const { getBankOverview, getTransferInitialize, transferInitialize,
          bankOverview, bankList, transactionList, loading, errorMsg, getBankListByHostel, AddBankAmount } =
          useContext(BankingContext);
      const { activeHostelId } = useContext(CommonContexts);

  const translateY = useRef(
    new Animated.Value(SHEET_HEIGHT)
  ).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);





  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  };


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          translateY.setValue(g.dy);
        }
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const DATA = [
    {
      title: "Expense",
      icon: require("../../../Assets/Images/Room_bed.png"),
      screen: "AddExpensesPage",
    },
    {
      title: "Tenant Payment",
      icon: require("../../../Assets/Images/TenantPayment.png"),
      screen: "TenantPayment",
    },
   {
  title: "Transfer",
  icon: require("../../../Assets/Images/arrow-transfer.png"),
  screen: "BankTransfer",
  action: "TRANSFER",
},
    {
      title: "Vendor Payment",
      icon: require("../../../Assets/Images/VendorPaymentIcon.png"),
      screen: "VendorPayment",
    },
    {
      title: "Credit Card Payment",
      icon: require("../../../Assets/Images/CreditCardIcon.png"),
      screen: "CreditCardPayment",
    },
    {
      title: "Investment",
      icon: require("../../../Assets/Images/InvestmentBlue.png"),
      screen: "Investment",
    },
  ];

  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);

      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setMounted(false);
      });
    }
  }, [visible]);

  // const handleItemPress = (item) => {
  //   Animated.timing(translateY, {
  //     toValue: SHEET_HEIGHT,
  //     duration: 220,
  //     useNativeDriver: true,
  //   }).start(() => {
  //     onClose?.();

  //     navigation.navigate(item.screen);
  //   });
  // };

  // const handleItemPress = (item) => {
  //   Animated.timing(translateY, {
  //     toValue: SHEET_HEIGHT,
  //     duration: 220,
  //     useNativeDriver: true,
  //   }).start(() => {
  //     onClose?.();

  //     navigation.navigate(item.screen, {
  //       bankId: bankId,
  //       bankDetails:bankDetails,
  //     })
  //   })
  // }

  const handleItemPress = async (item) => {
  if (item.title === "Transfer") {
    const res = await getTransferInitialize(
      activeHostelId,
      bankId
    );

    if (!res?.success) return;
  }

  Animated.timing(translateY, {
    toValue: SHEET_HEIGHT,
    duration: 220,
    useNativeDriver: true,
  }).start(() => {
    onClose?.();

    navigation.navigate(item.screen, {
      bankId,
      bankDetails,
    });
  });
};

  if (!mounted) return null;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {/* 
    <TouchableOpacity
      activeOpacity={1}
      style={styles.backdrop}
      onPress={closeSheet}
    /> */}

      <TouchableWithoutFeedback onPress={closeSheet}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>
          Add Transaction
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {DATA.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.item}
                activeOpacity={0.8}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.iconBox}>
                  <Image
                    source={item.icon}
                    style={styles.icon}
                  />
                </View>

                <Text style={styles.label}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 9999,
    elevation: 9999,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    height: SHEET_HEIGHT,

    backgroundColor: "#FFF",

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

    paddingTop: 12,
    paddingHorizontal: 28,

    elevation: 100,
    zIndex: 100,
  },

  handle: {
    width: 70,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#D6D6D6",
    alignSelf: "center",
    marginBottom: 28,
  },

  title: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    color: "#202020",
    marginBottom: 28,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  item: {
    width: "30%",
    alignItems: "center",
    marginBottom: 28,
  },

  iconBox: {
    width: 62,
    height: 62,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  icon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
    tintColor: '#1E45E1'
  },

  label: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Gilroy-Semibold",
    color: "#00000",
  },
});