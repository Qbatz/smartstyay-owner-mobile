import React, { useState, useRef, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback, BackHandler
} from "react-native";
import { NotificationContext } from "../../Context/NotificationContext";
import { CommonContexts } from "../../Context/CommonContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";


import newTenant from "../../Assets/Images/newTenants.png";
import paymentReceived from "../../Assets/Images/paymentReceived.png";
import complaintMark from "../../Assets/Images/complantMark.png";
import leftArrow from "../../Assets/Images/Arrow_left.png";
import FilterIcon from "../../Assets/Images/filter.png";
import CalendarIcon from "../../Assets/Images/calendar.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import NoResultFound from "../../Assets/Images/NoResultFound.png"


export default function NotificationDetails() {
  const navigation = useNavigation();
  const { getNotificationsByHostel, readNotificationsByHostel } = useContext(NotificationContext);
  const { activeHostelId } = useContext(CommonContexts);
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const [showFilter, setShowFilter] = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unReadcomments, setUnReadComments] = useState("")
  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");






  const fetchCustomers = async () => {
    const res = await getNotificationsByHostel(activeHostelId);

    // ✅ correct array extraction
    setNotifications(res?.data?.listOfNotifications || []);
    setUnReadComments(res.data.unreadCount)
    console.log("res.data", res.data)
  };



  useFocusEffect(
    useCallback(() => {
      let timer;

      if (activeHostelId) {
        // 1️⃣ initial fetch
        fetchCustomers();

        // 2️⃣ unread irundha mattum delayed read
        if (unReadcomments > 0) {
          timer = setTimeout(async () => {
            await readNotificationsByHostel(activeHostelId);

            // ✅ 3️⃣ read API success apram REFRESH
            fetchCustomers();
          }, 5000);
        }
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [activeHostelId, unReadcomments])
  );


  //       useFocusEffect(
  //   useCallback(() => {
  //     if (activeHostelId) {
  //       // fetch list
  //       fetchCustomers();

  //       // 🔔 mark all as read
  //       readNotificationsByHostel(activeHostelId);
  //     }
  //   }, [activeHostelId])
  // );
  console.log("setNotifications", notifications)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showFilter) {
          onClose();
          return true;
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
    }, [showFilter, navigation])
  );


  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > SCREEN_HEIGHT * 0.15) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    })
  ).current;
  const onClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowFilter(false));
  };


  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>


        <View style={styles.header}>

          {/* LEFT SIDE → Arrow + Title */}
          <View style={styles.leftRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>

              <Image source={leftArrow} style={styles.backArrow} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Notifications</Text>
          </View>

          {/* RIGHT SIDE → Filter Icon */}
          {/* <TouchableOpacity
  onPress={() => {
    setShowFilter(true);
    translateY.setValue(SCREEN_HEIGHT); // RESET
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }}
>
  <Image source={FilterIcon} style={{ width: 22, height: 22 }} />
</TouchableOpacity> */}

        </View>


        {/* <ScrollView showsVerticalScrollIndicator={false}>

      
        <Text style={styles.sectionTitle}>Today</Text>

        
        <View style={[styles.card, styles.activeCard]}>
          <View style={styles.dot} />

          <View style={styles.row}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>AB</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Ashwin Bose raised a New Complaint</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.time}>2m</Text>
              <Text style={styles.threeDots}>...</Text>
            </View>
          </View>

         
          <TouchableOpacity style={styles.reviewBtn}>
            <Text style={styles.reviewText}>Review</Text>
          </TouchableOpacity>
        </View>

        {[
          {
            icon: paymentReceived,
            title: "Payment Received from Arun K",
            desc: "₹8,000 received via UPI on 03 July 2025.\nReceipt generated.",
            time: "14h",
          },
          {
            icon: newTenant,
            title: "New Tenant Added – Rahul D",
            desc: "Tenant added to Ground Floor, Room 102.",
            time: "14h",
          },
          {
            icon: complaintMark,
            title: "SJ Suryah Raised a Complaint",
            desc: 'Issue resolved: "Fan not working" in Room 303.',
            time: "15h",
          }
        ].map((item, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.row}>
              
              <Image
                source={item.icon}
                style={{ width: 40, height: 40, marginRight: 14 }}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={styles.threeDots}>...</Text>
              </View>

            </View>
          </View>
        ))}

     
        <Text style={styles.sectionTitle}>Yesterday</Text>

        {[
          {
            title: "Complaint Marked Resolved by Admin",
            desc: 'Issue resolved: "Fan not working" in Room 303.',
          },
          {
            title: "Complaint Marked Resolved by Admin",
            desc: 'Issue resolved: "Fan not working" in Room 303.',
          },
            {
            title: "Complaint Marked Resolved by Admin",
            desc: 'Issue resolved: "Fan not working" in Room 303.',
          },
          
        ].map((item, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.row}>
              
              <Image
                source={complaintMark}
                style={{ width: 40, height: 40, marginRight: 14 }}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.time}>Yesterday</Text>
                <Text style={styles.threeDots}>⋯</Text>
              </View>

            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView> */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>
          {notifications
            .sort(
              (a, b) =>
                dayjs(b.requestedAt, "DD/MM/YYYY").valueOf() -
                dayjs(a.requestedAt, "DD/MM/YYYY").valueOf()
            )
            .map((item, index, arr) => { console.log(item)
              const curr = dayjs(item.requestedAt, "DD/MM/YYYY");
              const prev =
                index > 0
                  ? dayjs(arr[index - 1].requestedAt, "DD/MM/YYYY")
                  : null;

              const showHeader =
                !prev || !curr.isSame(prev, "day");

              let label = "";
              if (curr.isSame(dayjs(), "day")) label = "Today";
              else if (
                curr.isSame(dayjs().subtract(1, "day"), "day")
              )
                label = "Yesterday";
              else label = curr.format("DD MMM YYYY");

              return (
                <View key={item.notificationId}>
                  {/* 🔹 DATE HEADER */}
                  {showHeader && (
                    <Text style={styles.sectionTitle}>
                      {label}
                    </Text>
                  )}

                  {/* 🔹 CARD */}
                  <View
                    style={[
                      styles.card,
                      !item.isRead && styles.activeCard,
                    ]}
                  >
                    {!item.isRead && <View style={styles.dot} />}

                    <View style={styles.row}>
                      <View style={styles.profileCircle}>
                        <Text style={styles.profileInitial}>
                          {item.requestedUser?.[0] || "NA"}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.title}>
                          {item.notificationTitle}
                        </Text>
                        <Text style={styles.desc}>
                          {item.notificationDescription}
                        </Text>
                      </View>

                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.time}>
                          {item?.requestedAt}
                        </Text>
                      </View>
                    </View>

                    {item.typeCode === 4 && (
                      <TouchableOpacity
                        style={styles.reviewBtn}
                        onPress={() =>
                          navigation.navigate("HistoryAndComments", {
                            notificationId: item.requestId,
                            item: item,
                          })
                        }
                      >
                        <Text style={styles.reviewText}>
                          Review
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}

          {notifications.length === 0 && (
            <View style={{ flex: 1,alignItems:'center',justifyContent:'center' }}>
              <Image source={NoResultFound} style={{ width: 310, height: 220 }} />
              <Text style={{fontSize:20,fontWeight:600,}}>
                No Result Found !
              </Text>
               <Text style={{fontSize:16,fontWeight:400,color:'#4B4B4B',paddingHorizontal:20,
                            textAlign:'center',marginTop:10, lineHeight: 24,}}>
                Try adjusting your search or filters to see {"\n"}more options.
              </Text>
            </View>

          )}
        </ScrollView>

      </SafeAreaView>

      {
        showFilter &&
        <View style={styles.overlay}>

          {/* CLOSE ON BACKDROP */}
          <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.sheet,
              { transform: [{ translateY }] },
            ]}
          >
            <View style={styles.handle} />

            <ScrollView showsVerticalScrollIndicator={false}>

              {/* TITLE */}
              <Text style={styles.heading}>Filter by</Text>

              {/* STATUS DROPDOWN (dummy design) */}
              <Text style={styles.label}>Status</Text>
              <View style={styles.dropBox}>
                <Text style={styles.dropText}>All</Text>
                <Text style={styles.arrow}>▾</Text>
              </View>

              {/* DATE ROW */}
              {/* <View style={styles.row}>
          
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>From</Text>
              <DatePicker
                mode="single"
                date={dayjs()}
                onChange={() => {}}
                style={styles.dateBox}
              />
            </View>

          
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.label}>To</Text>
              <DatePicker
                mode="single"
                date={dayjs()}
                onChange={() => {}}
                style={styles.dateBox}
              />
            </View>
          </View> */}
              <View style={styles.dateRow}>
                <TouchableOpacity style={styles.dateBox} onPress={() => setOpenFrom(true)}>
                  <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
                  <Image source={CalendarIcon} style={styles.calIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.dateBox} onPress={() => setOpenTo(true)}>
                  <Text style={styles.dateText}>{formatDate(toDate)}</Text>
                  <Image source={CalendarIcon} style={styles.calIcon} />
                </TouchableOpacity>
              </View>

              {/* QUICK FILTER BUTTONS */}
              <View style={styles.quickRow}>
                <Text style={styles.quickBtn}>Today</Text>
                <Text style={styles.quickBtn}>This Week</Text>
                <Text style={styles.quickBtn}>This Month</Text>
              </View>

              {/* RESET + APPLY */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.resetBtn}>
                  <Text style={styles.resetText}>Reset All</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyBtn}>
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </Animated.View>
        </View>
      }

      {openFrom && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenFrom(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              date={fromDate}
              onChange={(p) => {
                setFromDate(p.date || dayjs());
                setOpenFrom(false);
              }}
            />
          </View>
        </View>
      )}


      {openTo && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenTo(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              date={toDate}
              onChange={(p) => {
                setToDate(p.date || dayjs());
                setOpenTo(false);
              }}
            />
          </View>
        </View>
      )}
    </>
  );
}




const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50
  },
  backArrow: {
    width: 25,
    height: 25

  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginLeft: 4
  },
  filterIcon: {
    width: 25,
    height: 25,
    tintColor: "#000",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },


  sectionTitle: {
    fontSize: 13,
    marginLeft: 16,
    marginTop: 14,
    marginBottom: 6,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  activeCard: {
    backgroundColor: "#ECF2FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C9D8FF",
    marginTop: 6,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
    position: "absolute",
    left: 10,
    top: 20,
  },

  row: { flexDirection: "row", alignItems: "flex-start" },

  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  profileInitial: { fontWeight: "700", fontSize: 16 },

  title: {
    fontSize: 15,
    fontWeight: "700",
  },

  desc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 18,
  },

  time: { fontSize: 12, color: "#6B7280", marginBottom: 4 },

  threeDots: {
    fontSize: 20,
    color: "#6B7280",
    marginTop: -4,
  },

  reviewBtn: {
    marginTop: 12,
    backgroundColor: "#2F80ED",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  reviewText: { color: "#fff", fontWeight: "700", fontSize: 13 },



  overlay: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: "85%",
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    borderRadius: 20,
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    color: "#374151",
    fontWeight: "600",
  },
  dropBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropText: { color: "#111" },
  arrow: { fontSize: 18, color: "#555" },
  row: { flexDirection: "row", marginTop: 10 },
  dateBox: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 5,
  },
  quickRow: {
    flexDirection: "row",
    marginTop: 18,
    justifyContent: "space-between",
  },
  quickBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#111827",
    fontSize: 13,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "space-between",
    marginBottom: 40
  },
  resetBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    alignItems: "center",
    marginRight: 10,
  },
  resetText: {
    color: "#4F46E5",
    fontWeight: "700",
  },
  applyBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "700",
  },
  dateRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  dateBox: { width: "48%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 12 },
  dateText: { color: "#111" },
  calIcon: { width: 20, height: 20 },
  sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  datePickerBox: { width: "90%", backgroundColor: "#fff", padding: 12, borderRadius: 15, alignSelf: "center", marginBottom: 30 },



});
