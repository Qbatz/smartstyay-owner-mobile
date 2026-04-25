import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { ElectricityContext } from "../../../Context/ElectricityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png"
import BedIcon from "../../../Assets/Images/Bed_Icon.png"

const EB_DATA = [
  {
    month: "September 2025",
    amount: "₹330",
    floor: "Ground Floor",
    room: "003",
    bed: "03",
    range: "01 - 31 July",
    active: true,
  },
  {
    month: "August 2025",
    amount: "₹360",
    floor: "Ground Floor",
    room: "003",
    bed: "03",
    range: "01 - 31 July",
  },
  {
    month: "July 2025",
    amount: "₹378",
    floor: "Ground Floor",
    room: "003",
    bed: "03",
    range: "01 - 30 June",
  },
  {
    month: "June 2025",
    amount: "₹267",
    floor: "Ground Floor",
    room: "003",
    bed: "03",
    range: "01 - 31 May",
  },
];

export default function EBReadingTab(customerDetails) {
  const { activeHostelId } = useContext(CommonContexts);
  const { ParticularTenantReadingDetails, particular_EbTenantReading } = useContext(ElectricityContext);
  const [ebTenantsList, setEbTenantsList] = useState([])
  console.log("customerDetails", customerDetails)
  const customerId = customerDetails.customerDetails?.customerId


  useEffect(() => {
    if (activeHostelId && customerId) {
      ParticularTenantReadingDetails(activeHostelId, customerId);

    }
  }, [activeHostelId, customerId]);

  const ebList = particular_EbTenantReading || [];
  const historyList = ebList?.electricityHistory || [];
  console.log("ebList", ebList)

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [day, month, year] = dateStr.split("/");

    const date = new Date(`${year}-${month}-${day}`);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };
  return (
    <View>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      {historyList.length === 0 ? (

        <View style={styles.emptyContainer}>
          <Image source={EmptyState} style={styles.image} resizeMode="contain" />
          <Text style={styles.emptyText}>
            No EB readings found
          </Text>
        </View>

      ) : (
        historyList.map((item, index) => {
          const getMonthYear = (dateStr) => {
            if (!dateStr) return "";

            const [day, month, year] = dateStr.split("/");

            const date = new Date(year, month - 1, day);

            return date.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            });
          };

          return (


            <View key={item.id || index} style={styles.rowBox}>
              {/* LEFT */}
              <View style={{ flex: 1 }}>
                <View style={styles.monthRow}>
                  <Text style={styles.monthText}>
                    <Text style={styles.monthText}>
                      {getMonthYear(item.startDate)}
                    </Text>
                  </Text>
                </View>

                <View style={[styles.metaRow, {flex: 1 }]}>
                  <View style={styles.floorBadge}>
                    <Text style={styles.floorText}>
                      {item.floorName}
                    </Text>
                  </View>

                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={RoomIcon} style={{ width: 21, height: 17, resizeMode: 'contain' }} />
                    <Text numberOfLines={1} style={[styles.iconText, { flexShrink: 1 }]}> {item.roomName}</Text>
                  </View>

                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={BedIcon} style={{ width: 21, height: 17, resizeMode: 'contain' }} />
                    <Text numberOfLines={1} style={[styles.iconText, { flexShrink: 1 }]}> {item.bedName}</Text>
                  </View>

                </View>
              </View>

              {/* RIGHT */}
              <View style={styles.rightBox}>
                <Text style={styles.amount}>₹{item?.amount}</Text>
                <Text style={[styles.range,{marginTop:12}]}>
                  {formatDate(item.startDate)} → {formatDate(item.endDate)}
                </Text>
              </View>
            </View>
          )
        })
      )}
    </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  rowBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
             shadowColor: "#000",        
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16A34A",
    marginRight: 8,
  },
  monthText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  floorBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  floorText: {
    fontSize: 11,
    color: "#92400E",
  },
  iconText: {
    fontSize: 12,
    color: "#2563EB",
    marginRight: 10,
  },
  rightBox: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 15,
    fontWeight: "600",
  },
  range: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
  },
  image: {
    width: 180,
    height: 180,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80, // little push to center nicely
  },

  emptyText: {
    marginTop: 20,
    fontSize: 15,
    color: "#6B7280",
  },

});
