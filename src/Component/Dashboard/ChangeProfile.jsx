import React,{useState,useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,Animated,PanResponder
} from "react-native";
import LeftArrow from "../../Assets/Images/Arrow_left.png";
import SettingIcon from "../../Assets/Images/setting.png";
import ThreeDots from "../../Assets/Images/3dots.png";
import Edit from "../../Assets/Images/editIcon.png";
import Delete from "../../Assets/Images/trash.png";




export default function ProfileScreen({ navigation }) {
   const SCREEN_WIDTH = Dimensions.get("window").width;
    const [activeMenu, setActiveMenu] = useState(null);
    const [popupPos, setPopupPos] = useState({ top: 0, right: 0 });
    const [showAccountSheet, setShowAccountSheet] = useState(false);
const sheetY = useRef(new Animated.Value(300)).current;
const DotsTopRef = useRef(null);
const DotsBottomRef = useRef(null);

const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      Math.abs(gesture.dy) > 5,  // only vertical drag

    onPanResponderMove: (_, gesture) => {
      if (gesture.dy > 0) sheetY.setValue(gesture.dy); // pull down only
    },

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy > 120 || gesture.vy > 1.5) {
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

const openSheet = () => {
  setShowAccountSheet(true);
  Animated.timing(sheetY, {
    toValue: 0,
    duration: 220,
    useNativeDriver: true,
  }).start();
};

const closeSheet = () => {
  Animated.timing(sheetY, {
    toValue: 300,
    duration: 200,
    useNativeDriver: true,
  }).start(() => setShowAccountSheet(false));
};


const dotsRef = useRef(null);
    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <View style={styles.leftRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={LeftArrow} style={styles.headerIcon} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
                    <Image source={SettingIcon} style={styles.headerIcon} />
                </TouchableOpacity>

            </View>


            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Image
                            source={require("../../Assets/Images/profile.png")}
                            style={styles.avatar}
                        />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>Muthuram K</Text>

                            <TouchableOpacity style={styles.changePwdRow}>
                                <Image
                                    source={require("../../Assets/Images/Eye.png")}
                                    style={styles.eyeIcon}
                                />
                                <Text style={styles.changePwdText}>Change Password</Text>
                            </TouchableOpacity>
                        </View>

                      <TouchableOpacity
  ref={DotsTopRef}
  onPress={() => {
    DotsTopRef.current.measureInWindow((x, y, width, height) => {
      setPopupPos({
        top: y + height + 6,
        right: SCREEN_WIDTH - (x + width),
      });
    });
    setActiveMenu("box");
  }}
>
  <Image source={ThreeDots} style={styles.dotsIcon} />
</TouchableOpacity>


                    </View>

                    <View style={styles.infoRow}>
                        <Image
                            source={require("../../Assets/Images/sms.png")}
                            style={styles.infoIcon}
                        />
                        <Text style={styles.infoText}>rajkumar001@gmail.com</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Image
                            source={require("../../Assets/Images/call.png")}
                            style={styles.infoIcon}
                        />
                        <Text style={styles.infoText}>+91 98765 43210</Text>
                    </View>

                    <Text style={styles.addressTitle}>Address</Text>

                    <View style={styles.infoRow}>
                        <Image
                            source={require("../../Assets/Images/call.png")}
                            style={styles.infoIcon}
                        />
                        <Text style={styles.infoText}>
                            203, E block, Nivas Nagar, Chennai {"\n"}2145602
                        </Text>
                    </View>

                 <TouchableOpacity style={styles.changeBtn} onPress={openSheet}>
  <Image
    source={require("../../Assets/Images/call.png")}
    style={styles.swapIcon}
  />
  <Text style={styles.changeBtnText}>Change Account</Text>
</TouchableOpacity>
                </View>

                <View style={[styles.card, { marginTop: 20 }]}>
                    <View style={styles.row}>
                        <Image
                            source={require("../../Assets/Images/profile.png")}
                            style={styles.avatar}
                        />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>Priya</Text>

                            <TouchableOpacity style={styles.changePwdRow}>
                                <Image
                                    source={require("../../Assets/Images/Eye.png")}
                                    style={styles.eyeIcon}
                                />
                                <Text style={styles.changePwdText}>Change Password</Text>
                            </TouchableOpacity>
                        </View>

                       <TouchableOpacity
  ref={DotsBottomRef}
  onPress={() => {
    DotsBottomRef.current.measureInWindow((x, y, width, height) => {
      setPopupPos({
        top: y + height + 6,
        right: SCREEN_WIDTH - (x + width),
      });
    });
    setActiveMenu("box1");
  }}
>
  <Image source={ThreeDots} style={styles.dotsIcon} />
</TouchableOpacity>

                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>


   {activeMenu && (
  <TouchableOpacity
    style={styles.menuOverlay}
    onPress={() => setActiveMenu(null)}
  >
    <View style={[styles.menuBox, { top: popupPos.top, right: popupPos.right }]}>

      {/* EDIT */}
      <TouchableOpacity
        style={styles.menuRow}
        onPress={() => {
          console.log(activeMenu + " EDIT");
          setActiveMenu(null);
        }}
      >
        <Image source={Edit} style={styles.menuIcon} />
        <Text style={styles.menuText}>Edit</Text>
      </TouchableOpacity>

      {/* DELETE */}
      <TouchableOpacity
        style={styles.menuRow}
        onPress={() => {
          console.log(activeMenu + " DELETE");
          setActiveMenu(null);
        }}
      >
        <Image
          source={Delete}
          style={[styles.menuIcon, { tintColor: "red" }]}
        />
        <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
      </TouchableOpacity>

    </View>
  </TouchableOpacity>
)}

{showAccountSheet && (
  <View style={styles.sheetOverlay}>
    
    <TouchableOpacity style={styles.overlayTouch} onPress={closeSheet} />

    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.bottomSheet,
        { transform: [{ translateY: sheetY }] }
      ]}
    >

      <View style={styles.sheetBar} />

      <TouchableOpacity style={styles.sheetCard}>
        <Image source={require("../../Assets/Images/profile.png")} style={styles.sheetAvatar} />
        <Text style={styles.sheetName}>Muthuram K</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sheetCard}>
        <Image source={require("../../Assets/Images/profile.png")} style={styles.sheetAvatar} />
        <Text style={styles.sheetName}>Priya</Text>
      </TouchableOpacity>
      

    </Animated.View>
  </View>
)}



        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F8FB",
        paddingTop: 45,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 12,
        backgroundColor: "#F8F9FF",
    },
    leftRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    leftContainer: {
        width: 40,           // fixed width ensures perfect center title
        justifyContent: "center",
        alignItems: "flex-start",
    },

    rightContainer: {
        width: 40,           // same width keeps title perfectly centered
        justifyContent: "center",
        alignItems: "flex-end",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 8,
        color: "#000",
    },

    headerIcon: {
        width: 22,
        height: 22,
        resizeMode: "contain",
    },


    card: {
        backgroundColor: "#fff",
        padding: 18,
        marginHorizontal: 15,
        borderRadius: 14,
        elevation: 2,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 10,
        marginRight: 12,
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },

    changePwdRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },

    eyeIcon: {
        width: 16,
        height: 16,
        marginRight: 6,
        tintColor: "#2F80ED",
    },

    changePwdText: {
        color: "#2F80ED",
        fontSize: 13,
        fontWeight: "500",
    },

    dotsIcon: {
        width: 20,
        height: 20,
        tintColor: "#444",
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
    },

    infoIcon: {
        width: 18,
        height: 18,
        marginRight: 10,

        tintColor: "#2F80ED",
    },

    infoText: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
        flex: 1,
    },

    addressTitle: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: "600",
        color: "#444",

    },

    changeBtn: {
        marginTop: 20,
        backgroundColor: "#1E45E1",
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    swapIcon: {
        width: 20,
        height: 20,
        tintColor: "#fff",
        marginRight: 6,
    },

    changeBtnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    menuBox: {
  position: "absolute",
  backgroundColor: "#fff",
  padding: 12,
  width: 170,
  borderRadius: 12,
  elevation: 8,
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  borderWidth: 1,
  borderColor: "#EEE",
  zIndex: 9999,
},
menuOverlay: {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
},


  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  menuIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

sheetOverlay: {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},

overlayTouch: {
  flex: 1,
},

bottomSheet: {
  width: "100%",
  backgroundColor: "#fff",
  paddingTop: 15,
  paddingBottom: 60,
  paddingHorizontal: 18,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},

sheetBar: {
  width: 45,
  height: 5,
  backgroundColor: "#D0D0D0",
  borderRadius: 20,
  alignSelf: "center",
  marginBottom: 15,
},

sheetCard: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
  paddingHorizontal: 12,
  backgroundColor: "#F8F9FC",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  marginBottom: 12,
},

sheetAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10,
},

sheetName: {
  fontSize: 16,
  fontWeight: "600",
  color: "#000",
},

closeBtn: {
  marginTop: 10,
  alignSelf: "center",
  paddingVertical: 10,
  paddingHorizontal: 20,
},

closeBtnText: {
  fontSize: 15,
  fontWeight: "600",
  color: "#555",
},

});

