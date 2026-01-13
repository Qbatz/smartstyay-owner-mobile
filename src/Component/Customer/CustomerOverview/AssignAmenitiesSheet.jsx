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

const SHEET_HEIGHT = 520;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");


export default function AssignAmenitiesSheet({
  visible,
  onClose,
  customerDetails,
  onSuccessRefresh,onSuccess // ✅ optional callback (customer details reload)
}) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
   const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");

  const {
    GetAllAmenities,
    amenitiesAllData,
     // ✅ AmenityContext la add pannadhu
  } = useContext(AmenityContext);
  const { assignAmenitiesForTenant } = useCustomer();

  const { activeHostelId } = useContext(CommonContexts);

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);

  const [amenityError, setAmenityError] = useState("");
  const [loading, setLoading] = useState(false);

  const amount = selectedAmenity?.amenityAmount
    ? String(selectedAmenity.amenityAmount)
    : "";

  // ✅ already assigned remove
  const assignedIds = useMemo(() => {
    return customerDetails?.assignedAmenities?.map((a) => a.amenityId) || [];
  }, [customerDetails]);

  const availableAmenities = useMemo(() => {
    return (amenitiesAllData || []).filter(
      (a) => !assignedIds.includes(a.amenityId)
    );
  }, [amenitiesAllData, assignedIds]);

  const resetState = () => {
    setSelectedAmenity(null);
    setShowDropdown(false);
    setAmenityError("");
    setLoading(false);
    onClose?.();
  };

  // ✅ Load amenities
  useEffect(() => {
    if (activeHostelId) {
      GetAllAmenities(activeHostelId);
    }
  }, [activeHostelId]);

  // ✅ Keyboard offset
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

  // ✅ open / close bottom sheet
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // ✅ drag sheet only if dropdown closed
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

  if (!visible) return null;

  const initials =
    (customerDetails?.initials || customerDetails?.firstName?.[0] || "U") +
    (customerDetails?.lastName?.[0] || "");

  const name = customerDetails?.firstName || "Customer";
  const floor = customerDetails?.hostelInfo?.floorName || "N/A";
  const roomBed =
    `${customerDetails?.hostelInfo?.roomName || ""} - ${
      customerDetails?.hostelInfo?.bedName || ""
    }`.trim() || "N/A";

  // ✅ Dropdown position measure
  const openDropdown = () => {
    Keyboard.dismiss();

    dropdownRef.current?.measureInWindow((x, y, w, h) => {
      let top = y + h + 52; // ✅ YOU SAID THIS IS PERFECT ✅

      const maxHeight = 200;
      if (top + maxHeight > SCREEN_HEIGHT - 20) {
        top = SCREEN_HEIGHT - maxHeight - 20;
      }

      setDropPos({ top, left: x, width: w });
      setShowDropdown(true);
    });
  };



 const handleAssignAmenity = async () => {
   if (!selectedAmenity?.amenityId) {
    setAmenityError("Please select amenity");
    return;
  }

  const hostelId = activeHostelId;

  const payload = {
    customerId: String(customerDetails?.customerId),
    newAmenities: [String(selectedAmenity?.amenityId)], 
  };

  

  try {
    const res = await assignAmenitiesForTenant(hostelId, payload);
   
      setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);
            await onSuccess();
              GetAllAmenities(activeHostelId);
            setTimeout(() => {
                setShowSuccess(false);
                resetState();

            }, 800);

  

 
  } catch (err) {
    console.log("ERROR --->", err?.response?.data || err.message);
  }
};


  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
          resetState();
        }}
      />

      {/* Dropdown Backdrop */}
      {showDropdown && (
        <Pressable
          style={styles.dropdownBackdrop}
          onPress={() => setShowDropdown(false)}
        />
      )}

      {/* SHEET */}
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
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 24 }}
          scrollEnabled={!showDropdown}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Assign Amenities</Text>

          
          </View>

          <View style={styles.divider} />

          {/* CUSTOMER */}
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{name}</Text>

              <View style={styles.chipRow}>
                <View style={[styles.chip, { backgroundColor: "#FEF3C7" }]}>
                  <Text style={styles.chipText}>{floor}</Text>
                </View>

                <View style={[styles.chip, { backgroundColor: "#FFE4E6" }]}>
                  <Text style={styles.chipText}>{roomBed}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* AMENITIES */}
          <Text style={styles.label}>
            Amenities <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TouchableOpacity
            ref={dropdownRef}
            style={styles.dropdownInput}
            activeOpacity={0.8}
            onPress={() => {
              if (showDropdown) {
                setShowDropdown(false);
              } else {
                openDropdown();
              }
            }}
          >
            <Text
              style={[
                styles.dropdownText,
                !selectedAmenity && { color: "#9CA3AF" },
              ]}
            >
              {selectedAmenity
                ? selectedAmenity.amenityName
                : "Select an Amenities"}
            </Text>

            <Image source={DownArrow} style={styles.arrow} />
          </TouchableOpacity>

          {amenityError && (
                    <ErrorMessage message={amenityError} type="error" />
                                )}

          {/* AMOUNT */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            editable={false}
            placeholder="Amount"
            placeholderTextColor="#9CA3AF"
          />

          {/* FOOTER */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={resetState} disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.assignButton}
             
              onPress={handleAssignAmenity}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.assignButtonText}>Assign</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      {/* ✅ Dropdown overlay */}
      {showDropdown && (
        <View
          style={[
            styles.dropdownBoxOverlay,
            {
              top: dropPos.top,
              left: dropPos.left,
              width: dropPos.width,
            },
          ]}
        >
          <FlatList
            data={availableAmenities}
            keyExtractor={(item) => String(item.amenityId)}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 200 }}
            onStartShouldSetResponderCapture={() => true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedAmenity(item);
                  setShowDropdown(false);
                  setAmenityError("");
                }}
              >
                <Text style={styles.dropdownItemText}>{item.amenityName}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.dropdownItem}>
                <Text style={[styles.dropdownItemText, { color: "#9CA3AF" }]}>
                  No amenities available
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    zIndex: 10,
  },

  handle: {
    width: 60,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 12,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
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
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
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
});
