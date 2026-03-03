import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  Easing, ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function DoubleStatusSheet({
  visible,
  onClose,
  bed,
  room,
  onPressNotice,
  handleShowFinalSettlement,
  handleNoticeToBookin,
  handleReAssignBed, handleMakeUsInActive, handleCheckIn, selectedBed, handleNoticeToCheckout, handleEditBed
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const { activeHostelId } = useContext(CommonContexts);
  const { getCustomersByHostel, loading } = useCustomer();
  const navigation = useNavigation();

  const [showOccupiedMenu, setShowOccupiedMenu] = useState(false);
  const [showReservedMenu, setShowReservedMenu] = useState(null);
  const [customers, setCustomers] = useState([]);

  const handleCheckoutSheet = () => {
    setShowOccupiedMenu(false);
    handleNoticeToCheckout()
    onClose();
  }
  const roomChip = room?.room_no ? `${room.room_no} - ${bed?.label || ""}` : "Room";

  const handleEdit = () => {
    if (!handleEditBed || !selectedBed) return;
    handleEditBed(selectedBed);
    onClose()
  };

  console.log("selectedBed", selectedBed)
  const openSheet = () => {
    translateY.setValue(SCREEN_HEIGHT);
    overlayOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();

    setShowOccupiedMenu(false);
    setShowReservedMenu(false);
  };
  const handleNewReserve = () => {
    handleNoticeToBookin()
  }
  const handleFinalSettled = () => {
    handleShowFinalSettlement()
  }
  const handleCancelNotice = () => {
    handleReAssignBed()
  }
  // const handleMakeUsIn=()=>{
  //   handleMakeUsInActive()
  // }
  const handleMakeUsIn = (item) => {
    setShowReservedMenu(null);
    handleMakeUsInActive(item);   // ⭐ item direct-ah parent-ku
  };
  const handleBookToCheckin = () => {
    handleCheckIn()
  }

  /* ---------------- CLOSE ---------------- */
  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };


  useEffect(() => {
    if (activeHostelId) {
      fetchCustomers();
    }
  }, [activeHostelId])




  const fetchCustomers = async () => {
    const data = await getCustomersByHostel(activeHostelId);
    setCustomers(data?.listCustomers || []);
  };
  console.log("customers123", customers)
  const matchedCustomer = customers.find(
    c => c.customerId === selectedBed?.currentTenantInfo[0]?.tenetId
  );
  console.log("matchedCustomer", matchedCustomer)

  useEffect(() => {
    if (visible) openSheet();
  }, [visible]);

  /* ---------------- SWIPE DOWN ---------------- */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          translateY.setValue(g.dy);
          overlayOpacity.setValue(1 - g.dy / SCREEN_HEIGHT);
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1) closeSheet();
        else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();

          Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  const isDisabled = true;


  if (!visible) return null;

  return (
    <View style={styles.absoluteContainer} pointerEvents="box-none">


      <TouchableWithoutFeedback onPress={closeSheet}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      {/* SHEET */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
            maxHeight: "80%",
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        {/* TITLE */}
        <Text style={styles.title}>Bed Status</Text>

        {/* CHIPS */}
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{selectedBed.floorName}</Text>
          </View>
          <View style={[styles.chip, styles.chipSoft]}>
            <Text style={[styles.chipText, styles.chipSoftText]}>{selectedBed.roomName}-{selectedBed.bedName}</Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          indicatorStyle="white"
        >

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Occupied by</Text>

            <View style={styles.headerRow}>
              <View style={styles.personRow}>
                {/* <Image
                source={require("../../../Assets/Images/Avatar.png")}
                style={styles.avatar}
              /> */}
                {selectedBed?.currentTenantInfo?.[0]?.profilePic ? (
                  <Image
                    source={{ uri: selectedBed.currentTenantInfo[0].profilePic }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.initialCircle}>
                    <Text style={styles.initialText}>
                      {selectedBed?.currentTenantInfo?.[0]?.initials ||
                        selectedBed?.currentTenantInfo?.[0]?.tenantFullName
                          ?.split(" ")
                          ?.map(w => w[0])
                          ?.join("")
                          ?.slice(0, 2)
                          ?.toUpperCase() ||
                        "--"}
                    </Text>
                  </View>
                )}

                <View>
                  <Text style={styles.name}>{selectedBed.currentTenantInfo[0]?.tenantFullName}</Text>
                  <Text style={styles.phone}>+91 {selectedBed.currentTenantInfo[0]?.mobile}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.dotsButton}
                onPress={() => {
                  setShowOccupiedMenu(!showOccupiedMenu);
                  setShowReservedMenu(false);
                }}
              >
                <Text style={styles.dots}>⋯</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Rental Amount</Text>
              <Text style={styles.value}>₹ {selectedBed.currentTenantInfo[0]?.rentAmount}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Check-In Date</Text>
              <Text style={styles.value}> {selectedBed.currentTenantInfo[0]?.joiningDate
              }</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Last Invoice</Text>
              <Text style={styles.link}>{selectedBed.currentTenantInfo[0]?.lastInvoiceNumber} & {selectedBed.currentTenantInfo[0]?.totalInvoices} more</Text>
            </View>

            {showOccupiedMenu && (
              <>
                {/* {showOccupiedMenu && (
  <TouchableWithoutFeedback onPress={() => setShowOccupiedMenu(false)}>
    <View style={styles.menuOverlay} />
  </TouchableWithoutFeedback>
)}    */}
                <TouchableWithoutFeedback onPress={() => setShowOccupiedMenu(false)}>
                  <View style={styles.fullMenuOverlay}>
                    <View style={styles.menuCard}>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleEdit}
                      >
                        <Image
                          source={require("../../../Assets/Images/editIcon.png")}
                          style={styles.menuIcon}
                        />
                        <Text style={styles.menuText}>Edit</Text>
                      </TouchableOpacity>
                      {matchedCustomer?.currentStatus === "Settlement Generated" ? (
                        <>
                          <TouchableOpacity style={styles.menuItem} onPress={handleCheckoutSheet}>
                            <Image
                              source={require("../../../Assets/Images/NewBook.png")}
                              style={styles.menuIcon}
                            />
                            <Text style={styles.menuText}>Checkout</Text>
                          </TouchableOpacity>

                        </>
                      ) : (
                        <>
                          <TouchableOpacity style={styles.menuItem} onPress={handleNewReserve}>
                            <Image style={styles.menuIcon} source={require("../../../Assets/Images/NewBook.png")} />
                            <Text style={styles.menuText}>New Booking</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.menuItem} onPress={handleCancelNotice}>
                            <Image style={styles.menuIcon} source={require("../../../Assets/Images/calendarremove.png")} />
                            <Text style={styles.menuText}>Cancel Check-out</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.menuItem} onPress={handleFinalSettled}>
                            <Image style={styles.menuIcon} source={require("../../../Assets/Images/receipttext.png")} />
                            <Text style={styles.menuText}>Generate</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      {/* {matchedCustomer?.currentStatus === "Settlement Generated" &&
  <TouchableOpacity style={styles.menuItem} onPress={handleFinalSettled}>
                <Image style={styles.menuIcon} source={require("../../../Assets/Images/receipttext.png")} />
                <Text style={styles.menuText}>Checkout</Text>
              </TouchableOpacity>
} */}

                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </>
            )}
          </View>

          {/* RESERVED SECTION */}
          {selectedBed?.newTenantInfo?.length > 0 && (
            <View style={[styles.section, { borderBottomWidth: 0 }]}>
              <Text style={styles.sectionTitle}>Reserved by</Text>

              {
                selectedBed.newTenantInfo.map((item, index) => {
                  return (


                    <View style={{ position: "relative" }} key={index}>
                      <View style={styles.headerRow}>
                        <View style={styles.personRow}>
                          {/* <Image
                source={require("../../../Assets/Images/profile.png")}
                style={styles.avatar}
              /> */}
                          {item?.profilePic ? (
                            <Image
                              source={{ uri: item.profilePic }}
                              style={styles.avatar}
                            />
                          ) : (
                            <View style={styles.initialCircle}>
                              <Text style={styles.initialText}>
                                {item?.tenantFullName
                                  ?.split(" ")
                                  ?.map(w => w[0])
                                  ?.join("")
                                  ?.slice(0, 2)
                                  ?.toUpperCase() || "--"}
                              </Text>
                            </View>
                          )}

                          <View>
                            <Text style={styles.name}>{item.tenantFullName}</Text>
                            <Text style={styles.phone}>+91 {item.mobile}</Text>
                          </View>
                        </View>

                        {/* <TouchableOpacity
              style={styles.dotsButton}
              onPress={() => {
                setShowReservedMenu(!showReservedMenu);
                setShowOccupiedMenu(false);
              }}
            >
              <Text style={styles.dots}>⋯</Text>
            </TouchableOpacity> */}
                        <TouchableOpacity
                          style={styles.dotsButton}
                          onPress={() => {
                            setShowReservedMenu(
                              showReservedMenu === index ? null : index
                            );
                            setShowOccupiedMenu(false);
                          }}
                        >
                          <Text style={styles.dots}>⋯</Text>
                        </TouchableOpacity>

                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Booking Amount</Text>
                        <Text style={styles.value}>₹  {item.bookingAmount}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Check-In Date</Text>
                        <Text style={styles.value}> {item.joiningDate}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Last Invoice</Text>
                        <Text style={styles.link}>{item.lastInvoiceNumber || "N/A"}
                        </Text>
                      </View>
                      {showReservedMenu === index && (

                        <TouchableWithoutFeedback onPress={() => setShowReservedMenu(null)}>
                          <View style={styles.fullMenuOverlay}>
                            <View style={styles.inlineMenu}>
                              <TouchableOpacity

                                onPress={handleBookToCheckin}
                                disabled={isDisabled}   // boolean
                                style={[
                                  styles.menuItem,
                                  isDisabled && styles.menuItemDisabled
                                ]}
                              >
                                <Image
                                  style={[
                                    styles.menuIcon,
                                    isDisabled && { opacity: 0.5 }
                                  ]}
                                  source={require("../../../Assets/Images/add-circle.png")}
                                />
                                <Text style={[
                                  styles.menuText,
                                  isDisabled && styles.menuTextDisabled
                                ]}>Check-in</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.menuItem}
                                // onPress={handleMakeUsIn}
                                onPress={() => handleMakeUsIn(item)}
                              >
                                <Image
                                  style={styles.menuIcon}
                                  source={require("../../../Assets/Images/Logout.png")}
                                />
                                <Text style={styles.menuText}>Make as Inactive</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      )}

                    </View>
                  )
                })
              }




            </View>
          )}

        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.noticeBtn}>
            <Text style={styles.noticeText}>Notice Period</Text>
          </TouchableOpacity>
          {selectedBed?.newTenantInfo?.length > 0 && (
            <TouchableOpacity style={styles.reservedBtn}>
              <Text style={styles.reservedText}>Occupied</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 50,
    maxHeight: SCREEN_HEIGHT * 0.92,
  },

  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 12,
  },

  title: { fontSize: 18, fontWeight: "700" },

  chipRow: { flexDirection: "row", marginTop: 10, marginBottom: 10, gap: 8 },

  chip: {
    backgroundColor: "#FFF3D9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  chipText: { fontSize: 11, fontWeight: "600", color: "#A0602C" },

  chipSoft: { backgroundColor: "#FFEAE8" },
  chipSoftText: { color: "#BF5555" },

  section: {
    marginTop: 10,
    paddingBottom: 54,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  sectionTitle: { fontSize: 13, fontWeight: "600", marginBottom: 8, color: "#555" },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },

  personRow: { flexDirection: "row", alignItems: "center", flex: 1 },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },

  name: { fontSize: 15, fontWeight: "600" },

  phone: { fontSize: 12, color: "#666" },

  dotsButton: { paddingHorizontal: 8 },
  dots: { fontSize: 20, color: "#777" },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 7 },

  label: { fontSize: 12, color: "#555" },
  value: { fontSize: 13, fontWeight: "600" },
  link: { fontSize: 13, fontWeight: "600", color: "#3562FF" },

  menuCard: {
    position: "absolute",
    top: 30,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E9F0",
    elevation: 6,
    paddingVertical: 6,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFFFFF",

  },
  menuIcon: {
    width: 20,
    height: 20
  },

  menuItemDisabled: {
    backgroundColor: "#F3F4F6",
  },

  menuText: {
    fontSize: 14,
    color: "#111",
    marginLeft: 8,
    fontFamily: "Gilroy-Medium" 
  },

  menuTextDisabled: {
    color: "#9CA3AF",
    fontFamily: "Gilroy-Medium" 
  },


  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,

  },

  noticeBtn: {
    flex: 1,
    backgroundColor: "#FFECEC",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginRight: 8,
  },

  noticeText: { color: "#E4503D", fontWeight: "700", fontSize: 14 },

  reservedBtn: {
    flex: 1,
    backgroundColor: "#EAF0FF",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginLeft: 8,
  },

  reservedText: { color: "#1E45E1", fontWeight: "700", fontSize: 14 },
  inlineMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E9F0",
    elevation: 6,
    paddingVertical: 6,
    zIndex: 999,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  initialCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5
  },

  initialText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151", // dark grey ✅
  },
  fullMenuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "transparent",
  },


});
