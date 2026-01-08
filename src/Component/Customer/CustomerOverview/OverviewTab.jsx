import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import Mail from "../../../Assets/Images/sms.png";
import Phone from "../../../Assets/Images/call.png";
import Home from "../../../Assets/Images/home-link.png";
import Location from "../../../Assets/Images/sms.png";
import BedIcon from "../../../Assets/Images/profile.png";
import RoomIcon from "../../../Assets/Images/PG_active.png";
import FloorIcon from "../../../Assets/Images/profile.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import EditIcon from "../../../Assets/Images/profile.png";

export default function OverviewTab({ customer }) {
  const [addressTab, setAddressTab] = useState("KYC");
  const [docTab, setDocTab] = useState("KYC");

  return (
    <View style={{ paddingBottom: 30 }}>

      {/* ================= BASIC DETAILS ================= */}
      <Card
        title="Basic Details"
        rightIcon
      >
        <Info label="First Name" value={customer?.firstName} />
        <Info label="Last Name" value={customer?.lastName} />
        <Info
          label="Email"
          value={customer?.emailId}
          icon={Mail}
        />
        <Info
          label="Mobile no."
          value={customer?.mobile}
          icon={Phone}
        />
      </Card>

      {/* ================= ADDRESS ================= */}
      <Card>
        <TabRow
          tabs={["KYC Address", "Manual Address"]}
          active={addressTab}
          onChange={setAddressTab}
        />

        {addressTab === "KYC" && (
          <>
            <Info label="House No / Apartment" value="24, Prestige Heights" icon={Home} />
            <Info label="Street / Area" value="Gandhi Street" icon={Location} />
            <Info label="Landmark" value="Near Apollo Hospital" icon={Location} />
            <Info label="Pincode" value="600045" />
            <Info label="City" value="Chennai" />
            <Info label="State" value="Tamilnadu" />
          </>
        )}
      </Card>

      {/* ================= STAY DETAILS ================= */}
      <Card
        title="Stay Details"
        rightIcon
      >
        <Info label="Floor" value={customer?.floorName} icon={FloorIcon} />
        <Info label="Room" value={customer?.roomName} icon={RoomIcon} />
        <Info label="Bed" value={customer?.bedName} icon={BedIcon} />
        <Info label="Joined Date" value={customer?.joiningDate || "20 Sep 2024"} icon={CalendarIcon} />
      </Card>

      {/* ================= FINANCIAL DETAILS ================= */}
      <Card title="Financial Details">
        <Amount label="Monthly Rent" value="₹ 7,500" editable />
        <Amount label="Advance amount" value="₹ 4,500" editable />
        <Amount label="Booking amount" value="₹ 4,500" />
        <Amount label="Maintenance" value="₹ 2,000" />
        <Amount label="Document Fee" value="₹ 800" />
      </Card>

      {/* ================= DOCUMENTS ================= */}
      <Card>
        <TabRow
          tabs={["KYC Documents", "Manual Documents"]}
          active={docTab}
          onChange={setDocTab}
        />

        <DocumentItem title="Rental Agreement.pdf" />
        <DocumentItem title="Aadhar.pdf" />
      </Card>

      {/* ================= AMENITIES ================= */}
      <Card
        title="Amenities provided"
        rightButton="Assign"
      >
        <Amenity title="Wi-Fi (5G)" price="₹399 / month" />
        <Amenity title="Food" price="₹1,299 / month" />
        <Amenity title="Laundry" price="₹299 / month" />

        <Text style={styles.subTitle}>Requested Amenities</Text>

        <Amenity title="Bicycle" price="₹399 / month">
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.approveBtn}>
              <Text style={styles.btnText}>✓ Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.denyBtn}>
              <Text style={styles.btnText}>✕ Deny</Text>
            </TouchableOpacity>
          </View>
        </Amenity>
      </Card>
    </View>
  );
}

/* ================= REUSABLE ================= */

const Card = ({ title, rightIcon, rightButton, children }) => (
  <View style={styles.card}>
    {(title || rightButton) && (
      <View style={styles.cardHeader}>
        {title && <Text style={styles.cardTitle}>{title}</Text>}
        {rightIcon && <Image source={EditIcon} style={styles.editIcon} />}
        {rightButton && (
          <TouchableOpacity style={styles.assignBtn}>
            <Text style={styles.assignText}>＋ {rightButton}</Text>
          </TouchableOpacity>
        )}
      </View>
    )}
    {children}
  </View>
);

const Info = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueRow}>
      {icon && <Image source={icon} style={styles.icon} />}
      <Text style={styles.value}>{value || "--"}</Text>
    </View>
  </View>
);

const Amount = ({ label, value, editable }) => (
  <View style={styles.amountRow}>
    <Text style={styles.label}>{label}</Text>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={styles.amount}>{value}</Text>
      {editable && <Image source={EditIcon} style={styles.editSmall} />}
    </View>
  </View>
);

const TabRow = ({ tabs, active, onChange }) => (
  <View style={styles.tabRow}>
    {tabs.map((t) => (
      <TouchableOpacity key={t} onPress={() => onChange(t)}>
        <Text style={[styles.tabText, active === t && styles.activeTab]}>
          {t}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const DocumentItem = ({ title }) => (
  <View style={styles.docItem}>
    <Text>{title}</Text>
    <Text style={styles.docSub}>180 KB · PDF</Text>
  </View>
);

const Amenity = ({ title, price, children }) => (
  <View style={styles.amenityCard}>
    <Text style={styles.amenityTitle}>{title}</Text>
    <Text style={styles.amenityPrice}>{price}</Text>
    {children}
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  editIcon: { width: 18, height: 18 },
  assignBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  assignText: { color: "#fff", fontSize: 12 },

  infoRow: { marginBottom: 12 },
  label: { fontSize: 12, color: "#6B7280" },
  valueRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  value: { fontSize: 14, fontWeight: "500" },
  icon: { width: 14, height: 14, marginRight: 6 },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  amount: { fontWeight: "600", color: "#2563EB" },
  editSmall: { width: 14, height: 14, marginLeft: 6 },

  tabRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tabText: {
    marginRight: 18,
    color: "#888",
  },
  activeTab: {
    color: "#2563EB",
    fontWeight: "600",
    borderBottomWidth: 2,
    borderColor: "#2563EB",
  },

  docItem: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  docSub: { fontSize: 12, color: "#666", marginTop: 4 },

  amenityCard: {
    backgroundColor: "#F8FAFF",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  amenityTitle: { fontWeight: "600" },
  amenityPrice: { fontSize: 12, color: "#666", marginTop: 2 },

  subTitle: { marginTop: 14, fontWeight: "600" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  approveBtn: {
    backgroundColor: "#16A34A",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  denyBtn: {
    backgroundColor: "#DC2626",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
