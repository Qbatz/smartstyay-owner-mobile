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
  Easing, ScrollView, NativeModules, Linking
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonContexts } from "../../../Context/CommonContext";
import { PGContext } from "../../../Context/PGContext";
import { useCustomer } from "../../../Context/CustomerContext";
import ReAssign from "../../../Assets/Images/ReAssign.png";
import WhatsappGreenIcon from "../../../Assets/Images/whatsapp.png";
import Call from "../../../Assets/Images/call.png";
import { useHasPermission } from "../../../Utils/useHasPermission";
import SuccessModal from "../../../ToastFile/ToastPage";
import Calendar from "../../../Assets/Images/calendar_blue.png";
import Money from "../../../Assets/Images/money.png";
import Invoice from "../../../Assets/Images/invoice.png";


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
  const { CommonModule } = NativeModules;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const { activeHostelId } = useContext(CommonContexts);
  const { getParticularHostelDetails, PGDetails } = useContext(PGContext);
  const { getCustomersByHostel, loading } = useCustomer();
  const navigation = useNavigation();

  const [showOccupiedMenu, setShowOccupiedMenu] = useState(false);
  const [showReservedMenu, setShowReservedMenu] = useState(null);
  const [customers, setCustomers] = useState([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const handleCheckoutSheet = () => {
    setShowOccupiedMenu(false);
    handleNoticeToCheckout()
    onClose();
  }




  const {
    canWriteModule: canWriteCustomers,
    // canReadModule: canReadPayingGuests,
    // canUpdateModule: canUpdatePayingGuests,
    // canDeleteModule: canDeletePayingGuests,
  } = useHasPermission("Customers");



  const {
    canReadModule: canReadPayingGuests,
    canUpdateModule: canUpdatePayingGuests,
    // canDeleteModule: canDeletePayingGuests,

  } = useHasPermission("Paying Guests");

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
    if (activeHostelId) {
      const data = await getCustomersByHostel(activeHostelId);
      setCustomers(data?.listCustomers || []);
    }
  };

  useEffect(() => {
    if (activeHostelId) {
      getParticularHostelDetails(activeHostelId);
    }
  }, [activeHostelId])

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

  const handleCallPhone = (mobile) => {
    console.log("mobile", mobile)
    if (mobile) {
      CommonModule.makeCall(mobile)
    }

  }

  const handleOpenWhatsapp = (item) => {
    console.log("mobile", item);
    if (!item) return;

    let mobile = item?.mobileNo || item?.mobile;
    let countryCode = item?.countryCode || "91";

    if (!mobile) {
      setModalType("warning");
      setModalMessage("Mobile number not available");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }

    mobile = mobile.toString().replace(/\D/g, "");

    if (mobile.startsWith(countryCode)) {
      mobile = mobile.slice(countryCode.length);
    }

    const phoneNumber = `${countryCode}${mobile}`;
    const url = `https://wa.me/${phoneNumber}`;

    console.log("url", url);

    Linking.openURL(url).catch(() => {
      setModalType("warning");
      setModalMessage("WhatsApp not installed");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
    });
  };

  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isSubscriptionAllow = isValidSubscription && canReadPayingGuests;

  if (!visible) return null;

  return (

    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

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
              maxHeight: "95%",
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
            <View style={styles.divider} />

            <View style={styles.section}>

              <Text style={{
                color: "#000000",
                fontSize: 14,
                fontFamily: "Gilroy-Semibold", marginBottom: 10
              }}>Occupied by</Text>

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
                    <TouchableOpacity onPress={() =>
                      navigation.navigate("CustomerOverviewScreen", {
                        customerId: selectedBed.currentTenantInfo[0]?.tenetId,
                        customer: selectedBed.currentTenantInfo[0],
                      })
                    }>
                      <Text style={styles.name}>{selectedBed.currentTenantInfo[0]?.tenantFullName}</Text>
                    </TouchableOpacity>

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

              <View style={styles.actionRow}>

                <TouchableOpacity
                  style={[styles.chatBtn, !isSubscriptionAllow && { opacity: 0.4 }]}
                  disabled={!isSubscriptionAllow}
                  onPress={() => handleOpenWhatsapp(selectedBed?.currentTenantInfo[0])}>
                  <Image source={WhatsappGreenIcon} style={styles.actionIcon} />
                  <Text style={styles.chatText}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.callBtn, !isSubscriptionAllow && { opacity: 0.4 }]}
                  disabled={!isSubscriptionAllow}
                  onPress={() => handleCallPhone(selectedBed.currentTenantInfo[0]?.mobile)}>
                  <Image source={Call} style={styles.actionIcon} />
                  <Text style={styles.callText}>Call</Text>
                </TouchableOpacity>

              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Rental Amount</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={Money} style={{ width: 20, height: 20, marginRight: 6 }} />
                  <Text style={styles.value}>₹ {selectedBed.currentTenantInfo[0]?.rentAmount}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>
                  {selectedBed.currentTenantInfo[0]?.currentStatus === "NOTICE" ? "Checkout Date" : "Check-In Date"}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={Calendar} style={{ width: 20, height: 20, marginRight: 6 }} />
                  <Text style={styles.value}>
                    {selectedBed.currentTenantInfo[0]?.currentStatus === "NOTICE" ? selectedBed.currentTenantInfo[0]?.leavingDate :
                      selectedBed.currentTenantInfo[0]?.joiningDate
                    }</Text>
                </View>

              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}> {selectedBed.currentTenantInfo[0]?.currentStatus === "NOTICE" ? "Request Date" : "Last Invoice"}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={selectedBed.currentTenantInfo[0]?.currentStatus === "NOTICE" ? Calendar : Invoice}
                    style={{ width: 20, height: 20, marginRight: 6 }} />

                  <Text style={styles.link}>
                    {selectedBed.currentTenantInfo[0]?.currentStatus === "NOTICE" ? selectedBed.currentTenantInfo[0]?.requestedLeavingDate || "N/A" :
                      `${selectedBed.currentTenantInfo[0]?.lastInvoiceNumber & selectedBed.currentTenantInfo[0]?.totalInvoices} "more" `}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}> Last Invoice</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={Invoice}
                    style={{ width: 20, height: 20, marginRight: 6 }} />

                  <Text style={styles.link}>
                    {selectedBed.currentTenantInfo[0]?.lastInvoiceNumber}
                    & {selectedBed.currentTenantInfo[0]?.totalInvoices} more</Text>
                </View>
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
                          // style={styles.menuItem}
                          disabled={!canUpdatePayingGuests}
                          style={[styles.menuItem, !canUpdatePayingGuests && { opacity: 0.4 }]}
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
                            <TouchableOpacity
                              disabled={!canWriteCustomers}
                              style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                              // style={styles.menuItem} 
                              onPress={handleCheckoutSheet}>
                              <Image
                                source={require("../../../Assets/Images/checkout_red.png")}
                                style={styles.menuIcon}
                              />
                              <Text style={styles.menuText}>Checkout</Text>
                            </TouchableOpacity>

                          </>
                        ) : (
                          <>
                            <TouchableOpacity
                              // style={styles.menuItem}
                              disabled={!canWriteCustomers}
                              style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                              onPress={handleNewReserve}>
                              <Image style={styles.menuIcon} source={require("../../../Assets/Images/user-square.png")} />
                              <Text style={styles.menuText}>New Booking</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              disabled={!canWriteCustomers}
                              style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                              // style={styles.menuItem}
                              onPress={handleCancelNotice}>
                              <Image style={styles.menuIcon} source={require("../../../Assets/Images/calendarremove.png")} />
                              <Text style={styles.menuText}>Cancel Check-out</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              //  style={styles.menuItem} 
                              disabled={!canWriteCustomers}
                              style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                              onPress={handleFinalSettled}>
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

                <Text style={{
                  color: "#000000",
                  fontSize: 14,
                  fontFamily: "Gilroy-Semibold", marginBottom: 10
                }}>Reserved by</Text>

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
                              <TouchableOpacity onPress={() =>
                                navigation.navigate("CustomerOverviewScreen", {
                                  customerId: item?.tenetId,
                                  customer: item,
                                })
                              }>
                                <Text style={styles.name}>{item.tenantFullName}</Text>
                              </TouchableOpacity>

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

                        <View style={styles.actionRow}>

                          <TouchableOpacity
                            style={[styles.chatBtn, !isSubscriptionAllow && { opacity: 0.4 }]}
                            disabled={!isSubscriptionAllow}
                            onPress={() => handleOpenWhatsapp(item)}>
                            <Image source={WhatsappGreenIcon} style={styles.actionIcon} />
                            <Text style={styles.chatText}>Chat</Text>
                          </TouchableOpacity>


                          <TouchableOpacity
                            style={[styles.callBtn, !isSubscriptionAllow && { opacity: 0.4 }]}
                            disabled={!isSubscriptionAllow}
                            onPress={() => handleCallPhone(item?.mobile)}>
                            <Image source={Call} style={styles.actionIcon} />
                            <Text style={styles.callText}>Call</Text>
                          </TouchableOpacity>

                        </View>

                        <View style={styles.infoRow}>
                          <Text style={styles.label}>Booking Amount</Text>

                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={Money} style={{ width: 20, height: 20, marginRight: 6 }} />
                            <Text style={styles.value}>₹  {item.bookingAmount}</Text>
                          </View>

                        </View>

                        <View style={styles.infoRow}>
                          <Text style={styles.label}>Check-In Date</Text>

                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={Calendar} style={{ width: 20, height: 20, marginRight: 6 }} />
                            <Text style={styles.value}> {item.joiningDate}</Text>
                          </View>
                        </View>

                        {/* {item.lastInvoiceNumber && ( */}
                        <View style={styles.infoRow}>
                          <Text style={styles.label}>Last Invoice</Text>

                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={Invoice} style={{ width: 20, height: 20, marginRight: 6 }} />
                            <Text style={styles.link}>{item?.lastInvoiceNumber || "N/A"}
                            </Text>
                          </View>

                        </View>
                        {/* )} */}

                        {showReservedMenu === index && (

                          <TouchableWithoutFeedback onPress={() => setShowReservedMenu(null)}>
                            <View style={styles.fullMenuOverlay}>
                              <View style={styles.inlineMenu}>


                                <TouchableOpacity
                                  // style={styles.menuItem}
                                  disabled={!canWriteCustomers}
                                  style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                                  // onPress={handleMakeUsIn}
                                  onPress={() => handleMakeUsIn(item)}
                                >
                                  <Image
                                    style={styles.menuIcon}
                                    source={require("../../../Assets/Images/Logout.png")}
                                  />
                                  <Text style={styles.menuText}>Make as Inactive</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  // style={styles.menuItem}
                                  disabled={!canUpdatePayingGuests}
                                  style={[styles.menuItem, !canUpdatePayingGuests && { opacity: 0.4 }]}
                                  onPress={handleEdit}
                                >
                                  <Image
                                    source={require("../../../Assets/Images/editIcon.png")}
                                    style={styles.menuIcon}
                                  />
                                  <Text style={styles.menuText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  // style={styles.menuItem}
                                  // disabled={!canWriteCustomers}
                                  disabled={isDisabled}   // boolean
                                  style={[
                                    styles.menuItem,
                                    isDisabled && styles.menuItemDisabled
                                  ]}

                                // style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                                // onPress={handleEdit}
                                // disabled
                                >
                                  <Image
                                    source={ReAssign}
                                    // style={styles.menuIcon}
                                    style={[
                                      styles.menuIcon,
                                      isDisabled && { opacity: 0.5 }
                                    ]}
                                  />
                                  <Text style={styles.menuText}>Change Bed</Text>
                                </TouchableOpacity>
                                <TouchableOpacity

                                  onPress={handleBookToCheckin}
                                  disabled={isDisabled}   // boolean
                                  style={[
                                    styles.menuItem,
                                    isDisabled && styles.menuItemDisabled
                                  ]}

                                // disabled={!canWriteCustomers}
                                // style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
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
                <Text style={styles.reservedText}>Reserved</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </>
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

  title: { fontSize: 18, fontFamily: "Gilroy-Bold" },

  chipRow: { flexDirection: "row", marginTop: 10, marginBottom: 10, gap: 8 },

  chip: {
    backgroundColor: "#FFF3D9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  chipText: { fontSize: 11, fontFamily: "Gilroy-Semibold", color: "#A0602C" },

  chipSoft: { backgroundColor: "#FFEAE8" },
  chipSoftText: { color: "#BF5555" },

  section: {
    marginTop: 10,
    paddingBottom: 54,
    borderBottomWidth: 0.6,
    borderColor: "#EEE",
  },

  sectionTitle: { fontSize: 13, fontFamily: "Gilroy-Semibold", marginBottom: 8, color: "#555" },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },

  personRow: { flexDirection: "row", alignItems: "center", flex: 1 },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },

  name: { fontSize: 15, fontFamily: "Gilroy-Semibold" },

  phone: { fontSize: 12, color: "#666", fontFamily: "Gilroy-Regular" },

  dotsButton: { paddingHorizontal: 8 },
  dots: { fontSize: 20, color: "#777" },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 7, alignItems: 'center' },

  label: { fontSize: 12, color: "#555", fontFamily: "Gilroy-Regular" },
  value: { fontSize: 13, fontFamily: "Gilroy-Semibold" },
  link: { fontSize: 13, fontFamily: "Gilroy-Semibold", color: "#3562FF" },

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

  noticeText: { color: "#E4503D", fontFamily: "Gilroy-Bold", fontSize: 14 },

  reservedBtn: {
    flex: 1,
    backgroundColor: "#EAF0FF",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginLeft: 8,
  },

  reservedText: { color: "#1E45E1", fontFamily: "Gilroy-Bold", fontSize: 14 },
  inlineMenu: {
    position: "absolute",
    top: 10,
    right: 28,
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
    fontFamily: "Gilroy-Bold",
    color: "#374151",
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


  actionRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10
  },

  chatBtn: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#E8F7EE",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1
  },

  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#E8F0FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1
  },

  chatText: {
    color: "#00A653",
    fontFamily: "Gilroy-Semibold",
    marginLeft: 6
  },

  callText: {
    color: "#1E45E1",
    fontFamily: "Gilroy-Semibold",
    marginLeft: 6
  },
  actionIcon: {
    width: 18,
    height: 18
  },
  divider: {
    height: 0.6,
    backgroundColor: "#E5E7EB",
    marginBottom: 4,
    marginTop: 10
  },
});
