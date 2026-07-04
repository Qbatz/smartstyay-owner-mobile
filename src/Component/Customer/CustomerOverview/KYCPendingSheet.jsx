import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    PanResponder,
    TextInput,
    Keyboard,
    ScrollView,
    Image,
    FlatList,
    Pressable,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import DownArrow from "../../../Assets/Images/direction-down.png";
import CloseIcon from "../../../Assets/Images/remove.png";
import { AmenityContext } from "../../../Context/AmenityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useHasPermission } from "../../../Utils/useHasPermission"


const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.88;

export default function KycPendingSheet({
    visible,
    onClose,
    customerDetails,
    //   onSuccessRefresh,onSuccess 
}) {
    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const keyboardOffset = useRef(new Animated.Value(0)).current;
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");


    const { RequestKYC } = useCustomer();

    console.log("customerDetails",customerDetails)

    const { activeHostelId } = useContext(CommonContexts);

    const {
        canWriteModule: canWriteTenant,
        canReadModule: canReadTenant,
        canUpdateModule: canUpdateTenant,
        canDeleteModule: canDeleteTenant,
    } = useHasPermission("Customers");

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState(null);

    const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef(null);

    const [amenityError, setAmenityError] = useState("");
    const [loading, setLoading] = useState(false);

 const kycStatus = customerDetails?.kycInfo?.status;

const isPending = kycStatus === "PENDING";
const isRequested = kycStatus === "REQUESTED";
const isVerified = kycStatus === "VERIFIED";


    const handleKYCRequest = async () => {
 if (isVerified || isRequested) return;

        const res = await RequestKYC(customerDetails?.customerId);

        console.log("kycresponse", res);
        

        if (res?.success) {
            setModalType("success");
            setMessage("KYC request sent successfully")
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                onClose()

            }, 800);

        } else {
           setModalType("error");
            setMessage("KYC request failed")
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);

            }, 800);
        }
    };



    const resetState = () => {
        setSelectedAmenity(null);
        setShowDropdown(false);
        setAmenityError("");
        setLoading(false);
        onClose?.()
    }



    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
            Animated.timing(keyboardOffset, {
                toValue: e.endCoordinates.height - 20,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });

        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            Animated.timing(keyboardOffset, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => {
                if (showDropdown) return false;
                return g.dy > 10;
            },
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 140) {
                    Keyboard.dismiss();
                    resetState();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

   

    const initials =
        (customerDetails?.initials || customerDetails?.firstName?.[0] || "U") +
        (customerDetails?.lastName?.[0] || "");

    const name = customerDetails?.firstName || "Customer";
    const floor = customerDetails?.hostelInfo?.floorName || "N/A";
    const roomBed =
        `${customerDetails?.hostelInfo?.roomName || ""} - ${customerDetails?.hostelInfo?.bedName || ""
            }`.trim() || "N/A";

    const ProfilePic = customerDetails?.profilePic


console.log("KYC visible", visible);

if (!visible) return null;



    return (
        <>
            <SuccessModal visible={showSuccess} message={message} type={modalType} />
            <View style={styles.wrapper} pointerEvents="box-none">
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => {
                        Keyboard.dismiss();
                        resetState();
                    }}
                />

                {showDropdown && (
                    <Pressable
                        style={styles.dropdownBackdrop}
                        onPress={() => setShowDropdown(false)}
                    />
                )}

                <Animated.View
                    {...(!showDropdown ? panResponder.panHandlers : {})}
                    style={[
                        styles.sheet,
                        {
                            transform: [
                                { translateY },
                                { translateY: Animated.multiply(keyboardOffset, -1) },
                            ],
                        },
                    ]}
                >
                    <View style={styles.handle} />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 40,
                            paddingTop: 6
                        }}
                    >

                        <Text style={styles.pendingText}>
                            <Text style={styles.pendingCount}>2</Text> Pending action(s)
                        </Text>

                        <View style={styles.divider} />

                        {/* HEADER */}
                        <View style={styles.progressRow}>
                            <Text style={styles.progressTitle}>
                                Profile completed
                            </Text>

                            <View style={styles.percentBadge}>
                                <Text style={styles.percentText}>
                                    70%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.progressBackground}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: "70%" },
                                ]}
                            />
                        </View>



                        <View style={styles.actionCard}>

                            <View style={styles.titleRow}>
                                <Text style={styles.cardTitle}>
                                    KYC Verification
                                </Text>

                                <Text style={styles.addText}>
                                    Add 20%
                                </Text>
                            </View>

                           <Text style={styles.description}>
  {isVerified
    ? "Tenant has successfully completed KYC verification."
    : isRequested
    ? "KYC reminder has already been sent to the tenant."
    : "Verify the tenant's KYC through the Smartstay Tenant App."}
</Text>

                           <TouchableOpacity
  style={[
    styles.reminderBtn,
    isVerified && styles.completedBtn,
    isRequested && styles.requestedBtn,
  ]}
  disabled={isVerified || isRequested}
  onPress={handleKYCRequest}
>
  <Text
    style={[
      styles.reminderText,
      isVerified && styles.completedText,
    ]}
  >
    {isVerified
      ? "Completed"
      : isRequested
      ? "Reminder Sent"
      : "Send Reminder"}
  </Text>
</TouchableOpacity>

                        </View>


                        <View style={styles.actionCard}>

                            <View style={styles.titleRow}>
                                <Text style={styles.cardTitle}>
                                    Agreement Process
                                </Text>

                                <Text style={styles.addText}>
                                    Add 10%
                                </Text>
                            </View>

                            <Text style={styles.description}>
                                Complete Agreement process through Smartstay Tenant App
                            </Text>

                            <TouchableOpacity style={styles.reminderBtn}>
                                <Text style={styles.reminderText}>
                                    Send Reminder
                                </Text>
                            </TouchableOpacity>

                        </View>



                    </ScrollView>
                </Animated.View>
            </View>


        </>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    wrapper: {
        ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 1000,
    elevation: 1000,
    },

    dropdownBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent",
        zIndex: 9998,
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: SHEET_HEIGHT,
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingTop: 8,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        zIndex: 1001,
    elevation: 1001,
    },

    handle: {
        // width: 60,
        // height: 5,
        // borderRadius: 3,
        // backgroundColor: "#D1D5DB",
        // alignSelf: "center",
        // marginBottom: 12,

        width: 64,
        height: 6,
        borderRadius: 10,
        backgroundColor: "#D1D5DB",
        marginBottom: 26,
        alignSelf: "center",
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        fontSize: 24,
        fontFamily: "Gilroy-Bold",
        color: "#232323",
    },

    closeBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    closeIcon: {
        width: 16,
        height: 16,
        tintColor: "#111827",
    },

    divider: {
        height: 1,
        backgroundColor: "#ECECEC",
        marginBottom: 8,
        marginTop: 10,
    },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    avatarText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#374151",
    },

    userName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 6,
    },

    chipRow: {
        flexDirection: "row",
        gap: 10,
    },

    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },

    chipText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#111827",
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 6,
    },

    dropdownInput: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
        backgroundColor: "#fff",
    },

    dropdownText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#111827",
    },

    arrow: {
        width: 18,
        height: 18,
        tintColor: "#9CA3AF",
    },

    dropdownBoxOverlay: {
        position: "absolute",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        overflow: "hidden",
        zIndex: 9999,
        elevation: 20,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },

    dropdownItem: {
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },

    dropdownItemText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#111827",
    },

    amountInput: {
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#F3F4F6",
        fontSize: 16,
        color: "#111827",
        marginBottom: 18,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 22,
        marginTop: 8,
    },

    cancelText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B7280",
    },

    assignButton: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 26,
        paddingVertical: 12,
        borderRadius: 14,
        minWidth: 110,
        alignItems: "center",
        justifyContent: "center",
    },

    assignButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    errorText: {
        color: "red",
        fontSize: 13,
        marginBottom: 10,
        fontWeight: "500",
    },


    actionCard: {
        marginTop: 26,
        backgroundColor: "#fff",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        paddingHorizontal: 22,
        paddingVertical: 22,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },

    progressTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Medium",
        color: "#353535",
    },

    progressBackground: {
        height: 14,
        borderRadius: 20,
        backgroundColor: "#E9EDF3",
        overflow: "hidden",
    },

    progressFill: {
        height: 14,
        width: "70%",
        backgroundColor: "#FF8A00",
        borderRadius: 20,
    },

    percentBadge: {
        backgroundColor: "#FFF4DD",
        borderRadius: 30,
        height: 44,
        minWidth: 72,
        justifyContent: "center",
        alignItems: "center",
    },

    percentText: {
        color: "#F58A07",
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
    },
    // percentBadge:{
    //     backgroundColor:"#FFF3DD",
    //     borderRadius:18,
    //     paddingHorizontal:12,
    //     paddingVertical:6,
    // },

    // percentText:{
    //     color:"#EB6617",
    //     fontFamily:"Gilroy-Bold",
    // },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    cardTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
        color: "#232323",
    },
    description: {
        fontSize: 14,
        // lineHeight:31,
        color: "#4B4B4B",
        fontFamily: "Gilroy-Regular",
    },

    addText: {
        marginLeft: 18,
        color: "#00A32E",
        fontSize: 15,
        fontFamily: "Gilroy-Medium",
    },

    reminderBtn: {
        marginTop: 24,
        alignSelf: "flex-end",

        width: 180,
        height: 46,

        borderRadius: 13,
        backgroundColor: "#2952E8",

        justifyContent: "center",
        alignItems: "center",
    },

    reminderText: {
        fontSize: 15,
        color: "#fff",
        fontFamily: "Gilroy-SemiBold",
    },
    pendingText: {
        fontSize: 20,
        color: "#1F2937",
        fontFamily: "Gilroy-Bold",
    },

    pendingCount: {
        fontFamily: "Gilroy-Bold",
    },
    requestedBtn: {
  backgroundColor: "#E8F1FF",
},

completedBtn: {
  backgroundColor: "#E8F8EE",
},

completedText: {
  color: "#16A34A",
},
});
