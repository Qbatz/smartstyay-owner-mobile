import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import DownArrow from "../../Assets/Images/direction-down.png";

export default function RequestComplaintCard({
  title,
  icon,
  total = 0,
  stats = [],
  list = [],
  selectedMonth,
  onMonthPress,
  arrowIcon,
  viewText,
}) {
  return (
    <View style={styles.requestsCard}>
      
      {/* HEADER */}
      <View style={styles.requestHeader}>
        <View style={styles.requestHeaderLeft}>
          <View style={styles.requestIconBox}>
            <Image source={icon} style={{ width: 18, height: 18 }} />
          </View>

          <Text style={styles.requestTitle}   numberOfLines={1}
  ellipsizeMode="tail">
            {title} ({total})
          </Text>
        </View>

   <TouchableOpacity style={styles.monthBtn} onPress={onMonthPress}>
  
  <Text
    style={styles.monthText}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {selectedMonth || "Select Month"}
  </Text>

  <Image
    source={DownArrow}
    style={{ width: 12, height: 12, marginLeft: 6 }}
  />

</TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.requestStatsRow}>
        {stats.map((item, index) => (
          <View
            key={index}
            style={[styles.requestStatBox, { backgroundColor: item.bg }]}
          >
            <Text style={[styles.requestStatNumber, { color: item.text }]}>
              {item.count}
            </Text>
            <Text style={styles.requestStatLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* LIST */}
      <ScrollView
  style={{ maxHeight: 220 }}   
  showsVerticalScrollIndicator={false}
  nestedScrollEnabled={true}
>
        {list?.length === 0 ? (
          <Text style={styles.empty}>No data available</Text>
        ) : (
          list.map((item, index) => (
            <View key={index} style={styles.requestItem}>
              
              {/* TOP ROW */}
              {/* <View style={styles.requestTopRow}>
                
                <Text style={styles.requestName}   numberOfLines={1}
  ellipsizeMode="tail">{item.name}</Text>

                {item.room && (
                  <Text style={styles.requestRoom}   numberOfLines={1}
  ellipsizeMode="tail">• {item.room}</Text>
                )}

                {item.status && (
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === "Pending" && { backgroundColor: "#FFF1E6" },
                      item.status === "In Progress" && { backgroundColor: "#E8F0FF" },
                      item.status === "Resolved" && { backgroundColor: "#E8F7EE" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        item.status === "Pending" && { color: "#EA580C" },
                        item.status === "In Progress" && { color: "#2563EB" },
                        item.status === "Resolved" && { color: "#16A34A" },
                      ]}
                        numberOfLines={1}
  ellipsizeMode="tail"
                    >
                      {item.status}
                    </Text>
                  </View>
                )}
              </View> */}

              <View style={styles.requestTopRow}>
  
  {/* ✅ LEFT SIDE FIX */}
  <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
    
    <Text
      style={[styles.requestName, { flexShrink: 1 }]}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {item.name}
    </Text>

    {item.room && (
      <Text
        style={[styles.requestRoom, { flexShrink: 1 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        • {item.room}
      </Text>
    )}
    
  </View>

  {/* ✅ RIGHT SIDE */}
  {item.status && (
    <View style={styles.statusBadge}>
      <Text style={styles.statusText}>{item.status}</Text>
    </View>
  )}

</View>

              {/* TYPE / ISSUE */}
              {item.type && (
                <Text style={styles.requestIssue}   numberOfLines={1}
  ellipsizeMode="tail">{item.type}</Text>
              )}

              {/* BOTTOM ROW */}
              <View style={styles.requestBottomRow}>
                <Text style={styles.requestCategory}   numberOfLines={1}
  ellipsizeMode="tail">
                  {item.category || ""}
                </Text>

                <Text style={styles.requestTime}>{item.time}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* FOOTER BUTTON */}
      <TouchableOpacity style={[styles.viewRequestsBtn, { opacity: 0.7 }]} disabled>
        <Text style={styles.viewRequestsText}>{viewText}</Text>
        <Image source={arrowIcon} style={styles.arrow} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  requestsCard: {
   backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAEAEA",overflow: "hidden", 
  },

  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  requestHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  requestIconBox: {
    backgroundColor: "#EEF2FF",
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },

  requestTitle: {
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
  },
    viewRequestsBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'grey'
  },

  viewRequestsText: {
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
    // color: "#374151",
    color:'#fff',
    marginRight: 8
  },

//    monthBtn: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//   },
monthBtn: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 10,
  maxWidth: 130,   // 👈 IMPORTANT
},
monthText: {
  fontSize: 13,
  color: "#374151",
  fontWeight: "500",
  flexShrink: 1,   // 👈 IMPORTANT
},

//   monthText: {
//     fontSize: 13,
//     color: "#374151",
//     fontWeight: "500",
//   },
  requestStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  requestStatBox: {
    flex: 1,
    marginRight: 6,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  requestStatNumber: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },

  requestStatLabel: {
    fontSize: 11,
    color: "#6B7280",
  },

  requestItem: {
    marginTop: 12,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
    paddingBottom: 8,
  },

  requestTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  requestName: {
    fontSize: 14,
    fontFamily: "Gilroy-Semibold",
  },

  requestRoom: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
  },

  statusBadge: {
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 11,
    fontFamily: "Gilroy-Semibold",
  },

  requestIssue: {
    fontSize: 13,
    marginTop: 4,
    color: "#111",
  },

  requestBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  requestCategory: {
    fontSize: 11,
    color: "#6B7280",
  },

  requestTime: {
    fontSize: 11,
    color: "#9CA3AF",
  },

//   viewRequestsBtn: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 10,
//   },

//   viewRequestsText: {
//     fontSize: 13,
//     fontFamily: "Gilroy-Semibold",
//     marginRight: 5,
//   },

  arrow: {
    width: 14,
    height: 14,
  },

  empty: {
    textAlign: "center",
    marginTop: 10,
    color: "#999",
  },
});