import React, { useEffect, useState,useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image, ScrollView , Modal , TouchableWithoutFeedback
} from "react-native";
import Mail from "../../../Assets/Images/sms.png";
import Phone from "../../../Assets/Images/call.png";
import Home from "../../../Assets/Images/home-link.png";
import Location from "../../../Assets/Images/sms.png";
import BedIcon from "../../../Assets/Images/BedImage.png";
import RoomIcon from "../../../Assets/Images/RoomImg.png";
import FloorIcon from "../../../Assets/Images/FloorImg.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import EditIcon from "../../../Assets/Images/edit.png";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import { AmenityContext } from "../../../Context/AmenityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";
import { useHasPermission } from "../../../Utils/useHasPermission"
import { pick } from '@react-native-documents/picker';
import SuccessModal from "../../../ToastFile/ToastPage";
// import RNFS from "react-native-fs";



export default function OverviewTab({ customerDetails, 
  handleEditBasicDetails, handleEditAdressDetails, handleEditJoining, handleEditMonthlyRent,handleEditAdvance,handleShowAmenities 
,}) {
  const [addressTab, setAddressTab] = useState("KYC");
   const {GetAllAmenities,amenities,amenitiesAllData} = useContext(AmenityContext);
   const { activeHostelId } = useContext(CommonContexts);
 const { AddManualDocument ,   ParticularcustomerDetails,
  GetParticularCustomerDetails , deleteManualDocument} = useCustomer();

    const [deletePopup, setDeletePopup] = useState(false)
    const [deleteDocumentId, setDeleteDocumentId] = useState(null);

   const [modalType, setModalType] = useState("success");
   const [showSuccess, setShowSuccess] = useState(false);
   const [message, setMessage] = useState("");

   console.log("customerDetails", customerDetails);
   

  const handleEdit = () => {
    handleEditBasicDetails()
  }
  const handleAdressEdit = () => {
    handleEditAdressDetails()
  }

           const {
        canWriteModule: canWriteTenant,
        canReadModule: canReadTenant,
       canUpdateModule: canUpdateTenant,
        canDeleteModule: canDeleteTenant,
      } = useHasPermission("Customers");

  console.log("amenitiesAllData", amenitiesAllData)

  const [docTab, setDocTab] = useState("KYC");
  const [flat, setFlat] = useState("")
  const [area, setArea] = useState("")
  const [landmark, setLandmark] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")
  const [stateList, setStateList] = useState("")
  const [manualDoc, setManualDocs] = useState([])

 useEffect(() => {
  if (activeHostelId) {
    GetAllAmenities(activeHostelId);

  }
}, [activeHostelId]);
  useEffect(() => {
    if (customerDetails) {
      setFlat(customerDetails?.address?.houseNo)
    }
  }, [customerDetails])

  console.log("customerDetails", customerDetails);
  
// const manualDocs = customerDetails?.files?.otherDoc || [];
const dataSource = ParticularcustomerDetails || customerDetails;
const manualDocs = dataSource?.files?.otherDoc || [];


const pickFiles = async () => {
  try {
    const results = await pick({
      allowMultiSelection: true,
      type: ['*/*'],
      copyTo: 'cachesDirectory',
    });

const res =  await AddManualDocument(
      activeHostelId,
      customerDetails?.customerId,
      results
    ); 
if(res?.success){
    await GetParticularCustomerDetails(customerDetails?.customerId)
      setModalType("success");
      setMessage("Document Added successfully");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 800);
}
    
  } catch (err) {
    console.log("Cancelled or error 👉", err);
  }
};



const handleDeleteDocument = async () => {
  if (!deleteDocumentId) return;

  const res = await deleteManualDocument(
    activeHostelId,
    customerDetails?.customerId,
    deleteDocumentId
  );

  if (res.success) {
    setDeletePopup(false);
    setDeleteDocumentId(null);

    setModalType("success");
    setMessage("Document deleted successfully");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 800);
  } else {
    console.log("Error", res.message);
  }
};






  const isJoiningDateEditable =
    !!customerDetails?.hostelInfo?.joiningDate &&
    customerDetails?.hostelInfo?.currentStatus !== "NOTICE";
    const chunkArray = (arr, size = 2) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
const hasGuardianDetails = false; 
const isDisabled = true;
// later API vandha -> customerDetails?.guardianInfo

const disableAssignBtn = [
  "BOOKED",
  "INACTIVE",
  "VACATED",
  "SETTLEMENT_GENERATED",
  "NOTICE",
].includes(customerDetails?.hostelInfo?.currentStatus);
console.log("customerDetails?.hostelInfo",customerDetails?.hostelInfo)
  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={{ paddingBottom: 30, padding: 5 }}>


          <View style={styles.sectionBox}>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Basic Details</Text>
              {/* <Image source={EditIcon} style={styles.editIcon} /> */}
              <TouchableOpacity  
                    disabled={!canUpdateTenant}
                    style={!canUpdateTenant && { opacity: 0.4 }}
              onPress={handleEdit}>
                <Image source={EditIcon} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
            {/* First Name */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>First Name</Text>
              <Text style={styles.detailValue}>
                {customerDetails?.firstName || "N/A"}
              </Text>
            </View>

            {/* Last Name */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Name</Text>
              <Text style={styles.detailValue}>
                {customerDetails?.lastName || "N/A"}
              </Text>
            </View>

            {/* Email */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <View style={styles.valueWithIcon}>
                <Image source={Mail} style={styles.detailIcon} />
                <Text style={styles.detailValue}>
                  {customerDetails?.emailId || "N/A"}
                </Text>
              </View>
            </View>

            {/* Mobile */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile no.</Text>
              <View style={styles.valueWithIcon}>
                <Image source={Phone} style={styles.detailIcon} />
                <Text style={styles.detailValue}>
                  +{customerDetails?.countryCode} {customerDetails?.mobileNo || "N/A"}
                </Text>
              </View>
            </View>

          </View>




          <View style={styles.card}>


            {/* <View style={styles.addressHeader}>
    <View style={styles.tabRow}>
      <TouchableOpacity onPress={() => setAddressTab("KYC")}>
        <Text style={[
          styles.tabText,
          addressTab === "KYC" && styles.activeTab
        ]}>
          KYC Address
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setAddressTab("MANUAL")}>
        <Text style={[
          styles.tabText,
          addressTab === "MANUAL" && styles.activeTab
        ]}>
          Manual Address
        </Text>
      </TouchableOpacity>

       {addressTab === "MANUAL" && (
     <TouchableOpacity onPress={handleAdressEdit}>
    <Image source={EditIcon} style={styles.editIcon} />
  </TouchableOpacity>
    )}
    </View>

   
   
  </View> */}
            <View style={styles.addressHeader}>
              {/* LEFT : Tabs */}
              <View style={styles.tabRow}>
                <TouchableOpacity onPress={() => setAddressTab("KYC")}>
                  <Text
                    style={[
                      styles.tabText,
                      addressTab === "KYC" && styles.activeTab,
                    ]}
                  >
                    KYC Address
                  </Text>
                </TouchableOpacity>
 
                <TouchableOpacity onPress={() => setAddressTab("MANUAL")}>
                  <Text
                    style={[
                      styles.tabText,
                      addressTab === "MANUAL" && styles.activeTab,
                    ]}
                  >
                    Manual Address
                  </Text>
                </TouchableOpacity>
              </View>

              {/* RIGHT : Edit Icon */}
              {addressTab === "MANUAL" && (
                <TouchableOpacity
                  disabled={!canUpdateTenant}
                    style={!canUpdateTenant && { opacity: 0.4 }}
                 onPress={handleAdressEdit}>
                  <Image source={EditIcon} style={styles.editIcon} />
                </TouchableOpacity>
              )}
            </View>


            {
              addressTab === "KYC" && (
                <View >
                  <View style={styles.row}>
                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>House No / Apartment</Text>
                      <View style={styles.valueRow}>
                        <Image source={Home} style={styles.icon} />
                        <Text style={styles.value}>
                          {/* {customerDetails?.address?.houseNo || "N/A"} */}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>Street / Area</Text>
                      <View style={styles.valueRow}>
                        <Image source={Location} style={styles.icon} />
                        <Text style={styles.value}>
                          {/* {customerDetails?.address?.streetName || "N/A"} */}
                        </Text>
                      </View>
                    </View>
                  </View>


                  <View style={styles.row}>
                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>Landmark</Text>
                      <View style={styles.valueRow}>
                        <Image source={Location} style={styles.icon} />
                        <Text style={styles.value}>
                          {/* {customerDetails?.address?.landmark || "N/A"} */}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>Pincode</Text>
                      <Text style={styles.value}>
                        {/* {customerDetails?.address?.pincode || "N/A"} */}
                      </Text>
                    </View>
                  </View>


                  <View style={styles.row}>
                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>City</Text>
                      <Text style={styles.value}>
                        {/* {customerDetails?.address?.city || "N/A"} */}
                      </Text>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>State</Text>
                      <Text style={styles.value}>
                        {/* {customerDetails?.address?.state || "N/A"} */}
                      </Text>
                    </View>
                  </View>


                </View>
              )}

            {
              addressTab === "MANUAL" && (

                <View>
                  <View style={styles.row}>
                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>House No / Apartment</Text>
                      <View style={styles.valueRow}>
                        <Image source={Home} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.address?.houseNo || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>Street / Area</Text>
                      <View style={styles.valueRow}>
                        <Image source={Location} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.address?.streetName || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>


                  <View style={styles.row}>
                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>Landmark</Text>
                      <View style={styles.valueRow}>
                        <Image source={Location} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.address?.landmark || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>Pincode</Text>
                      <Text style={styles.value}>
                        {customerDetails?.address?.pincode || "N/A"}
                      </Text>
                    </View>
                  </View>


                  <View style={styles.row}>
                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>City</Text>
                      <Text style={styles.value}>
                        {customerDetails?.address?.city || "N/A"}
                      </Text>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>State</Text>
                      <Text style={styles.value}>
                        {customerDetails?.address?.state || "N/A"}
                      </Text>
                    </View>
                  </View>


                </View>
              )}


          </View>



          <View style={styles.card}>


         <View style={styles.cardHeader}>
  <Text style={styles.cardTitle}>Stay Details</Text>
  {/* <Image source={EditIcon} style={styles.editIcon} /> */}
</View>

{/* ROW 1 : Floor + Room */}
<View style={styles.twoColumnRow}>
  <View style={styles.detailBox}>
    <Text style={styles.detailLabel}>Floor</Text>
    <View style={styles.valueWithIcon}>
      <Image source={FloorIcon} style={styles.detailIconFloor} />
      <Text style={styles.detailValue}>
        {customerDetails?.hostelInfo?.floorName || "N/A"}
      </Text>
    </View>
  </View>

  <View style={styles.detailBox}>
    <Text style={styles.detailLabel}>Room</Text>
    <View style={styles.valueWithIcon}>
      <Image source={RoomIcon} style={styles.detailIconFloor} />
      <Text style={styles.detailValue}>
        {customerDetails?.hostelInfo?.roomName || "N/A"}
      </Text>
    </View>
  </View>
</View>

{/* ROW 2 : Bed + Booking Date */}
<View style={styles.twoColumnRow}>
  <View style={styles.detailBox}>
    <Text style={styles.detailLabel}>Bed</Text>
    <View style={styles.valueWithIcon}>
      <Image source={BedIcon} style={styles.detailIcon} />
      <Text style={styles.detailValue}>
        {customerDetails?.hostelInfo?.bedName || "N/A"}
      </Text>
    </View>
  </View>

  <View style={styles.detailBox}>
    <Text style={styles.detailLabel}>Booking Date</Text>
    <View style={styles.valueWithIcon}>
      <Image source={CalendarIcon} style={styles.detailIcon} />
      <Text style={styles.detailValue}>
        {customerDetails?.hostelInfo?.bookingDate || "N/A"}
      </Text>
    </View>
  </View>
</View>

{/* ROW 3 : Joined Date */}
<View style={styles.twoColumnRow}>
  <View style={styles.detailBox}>
    <Text style={styles.detailLabel}>Joined Date</Text>
    <View style={styles.valueWithIcon}>
      <Text style={styles.detailValue}>
        {customerDetails?.hostelInfo?.joiningDate || "N/A"}
      </Text>
      <TouchableOpacity
        onPress={handleEditJoining}
        // disabled={!isJoiningDateEditable}
        activeOpacity={0.7}
      disabled={!isJoiningDateEditable && !canUpdateTenant}
      style={!isJoiningDateEditable && !canUpdateTenant && { opacity: 0.4 }}
      >
        <Image
          source={EditIcon}
          style={[
            styles.editIconSmall,
            !isJoiningDateEditable && styles.disabledIcon,
          ]}
        />
      </TouchableOpacity>
    </View>
  </View>

  {/* empty box to keep alignment */}
  <View style={styles.detailBox} />
</View>


            <View style={styles.divider} />

<Text style={styles.sectionTitle}>Financial Details</Text>

{/* ROW 1 : Monthly Rent + Advance */}
<View style={styles.twoColumnRow}>
  {/* Monthly Rent */}
  <View style={styles.amountBox}>
    <View style={styles.amountValueRow}>
      <Text style={styles.amountValue}>Monthly Rent</Text>
      <TouchableOpacity 
      disabled={!isJoiningDateEditable && !canUpdateTenant}
      style={!isJoiningDateEditable && !canUpdateTenant && { opacity: 0.4 }}
        onPress={handleEditMonthlyRent}
        // disabled={!isJoiningDateEditable}
      >
        <Image
          source={EditIcon}
          style={[
            styles.editIconSmall,
            !isJoiningDateEditable && styles.disabledIcon,
          ]}
        />
      </TouchableOpacity>
    </View>
    <Text style={styles.amountLabel}>
      ₹ {customerDetails?.hostelInfo?.monthlyRent || "N/A"}
    </Text>
  </View>

  {/* Advance Amount */}
  <View style={styles.amountBox}>
    <View style={styles.amountValueRow}>
      <Text style={styles.amountValue}>Advance Amount</Text>
      <TouchableOpacity
       disabled={!isJoiningDateEditable && !canUpdateTenant}
      style={!isJoiningDateEditable && !canUpdateTenant && { opacity: 0.4 }}
        onPress={handleEditAdvance}
        // disabled={!isJoiningDateEditable}
      >
        <Image
          source={EditIcon}
          style={[
            styles.editIconSmall,
            !isJoiningDateEditable && styles.disabledIcon,
          ]}
        />
      </TouchableOpacity>
    </View>
    <Text style={styles.amountLabel}>
      ₹ {customerDetails?.advanceInfo?.advanceAmount || "N/A"}
    </Text>
  </View>
</View>

{/* ROW 2 : Booking Amount + Maintenance */}
<View style={styles.twoColumnRow}>
  {/* Booking Amount */}
  <View style={styles.amountBox}>
    <Text style={styles.amountValue}>Booking Amount</Text>
    <Text style={styles.amountLabel}>
      ₹ {customerDetails?.bookingInfo?.bookingAmount || "N/A"}
    </Text>
  </View>

  {/* Maintenance (show only if exists) */}
  
    <View style={styles.amountBox}>
      <Text style={styles.amountValue}>Maintenance</Text>
      <Text style={styles.amountLabel}>
        ₹ {customerDetails.hostelInfo?.maintenance || 0}
      </Text>
    </View>

</View>

{/* ROW 3+ : Other Deductions (2 per row) */}
{Array.isArray(customerDetails?.hostelInfo?.otherDeductionsBreakup) &&
  customerDetails.hostelInfo.otherDeductionsBreakup.length > 0 &&
  chunkArray(customerDetails.hostelInfo.otherDeductionsBreakup).map(
    (pair, rowIndex) => (
      <View style={styles.twoColumnRow} key={rowIndex}>
        {pair.map((item, index) => (
          <View style={styles.amountBox} key={index}>
            <Text style={styles.amountValue}>{item.type}</Text>
            <Text style={styles.amountLabel}>₹ {item.amount}</Text>
          </View>
        ))}
      </View>
    )
  )}



            {/* <Text style={styles.sectionTitle}>Financial Details</Text>

            <View style={styles.amountRow}>
              <View style={styles.amountValueRow}>
                <Text style={styles.amountValue}>Monthly Rent</Text>
                <TouchableOpacity onPress={handleEditMonthlyRent} disabled={!isJoiningDateEditable} activeOpacity={0.7}>
                  <Image source={EditIcon} style={[
                    styles.editIconSmall,
                    !isJoiningDateEditable && styles.disabledIcon,
                  ]} />
                </TouchableOpacity>
              </View>
              <Text style={styles.amountLabel}>₹ {customerDetails?.hostelInfo?.monthlyRent || "N/A"}</Text>


            </View>

            <View style={styles.amountRow}>
              <View style={styles.amountValueRow}>
                <Text style={styles.amountValue}>Advance amount</Text>
           
                <TouchableOpacity onPress={handleEditAdvance}  disabled={!isJoiningDateEditable}
                  activeOpacity={0.7}>
  <Image source={EditIcon}   style={[
                      styles.editIconSmall,
                      !isJoiningDateEditable && styles.disabledIcon,
                    ]} />
</TouchableOpacity>

              </View>
              <Text style={styles.amountLabel}>₹ { customerDetails?.advanceInfo?.advanceAmount || "N/A"}</Text>


            </View>

            <View style={styles.amountRow}>
              <Text style={styles.amountValue}>Booking amount</Text>
              <Text style={styles.amountLabel}>₹ { customerDetails?.bookingInfo?.bookingAmount || "N/A"}</Text>
            </View>

            <View style={styles.amountRow}>
              <Text style={styles.amountValue}>Maintenance</Text>
              <Text style={styles.amountLabel}>₹{ customerDetails?.hostelInfo?.maintenance || 0}</Text>
            </View>
            {Array.isArray(customerDetails?.hostelInfo?.otherDeductionsBreakup) &&
  customerDetails.hostelInfo.otherDeductionsBreakup.length > 0 &&
  customerDetails.hostelInfo.otherDeductionsBreakup.map((item, index) => (
    <View style={styles.amountRow} key={index}>
      <Text style={styles.amountValue}>
        {item.type}
      </Text>
      <Text style={styles.amountLabel}>
        ₹ {item.amount}
      </Text>
    </View>
))} */}

           

          </View>



          <View style={styles.docContainer}>

  <View style={styles.docContentWrapper}>
            <View style={styles.docTabRow}>
              <TouchableOpacity onPress={() => setDocTab("KYC")}>
                <Text
                  style={[
                    styles.docTabText,
                    docTab === "KYC" && styles.docActiveTab,
                  ]}
                >
                  KYC Documents
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setDocTab("MANUAL")}>
                <Text
                  style={[
                    styles.docTabText,
                    docTab === "MANUAL" && styles.docActiveTab,
                  ]}
                >
                  Manual Documents
                </Text>
              </TouchableOpacity>
            </View>


            {docTab === "KYC" && (
              <>

                <View style={styles.docRow}>
                  <View style={styles.docLeft}>
                    <Image
                      source={require("../../../Assets/Images/profile.png")}
                      style={styles.pdfIcon}
                    />
                    <View>
                      <Text style={styles.docTitle}>Rental Agreement.pdf</Text>
                      <Text style={styles.docMeta}>180 KB · PDF</Text>
                    </View>
                  </View>

                  <View style={styles.docActions}>
                    <Image
                      source={require("../../../Assets/Images/Eye.png")}
                      style={styles.actionIcon}
                    />
                    <Image
                      source={require("../../../Assets/Images/download.png")}
                      style={styles.actionIcon}
                    />
                  </View>
                </View>

                {/* Aadhar */}
                <View style={styles.docRow}>
                  <View style={styles.docLeft}>
                    <Image
                      source={require("../../../Assets/Images/profile.png")}
                      style={styles.pdfIcon}
                    />
                    <View>
                      <Text style={styles.docTitle}>Aadhar.pdf</Text>
                      <Text style={styles.docMeta}>180 KB · PDF</Text>
                    </View>
                  </View>

                  <View style={styles.docActions}>
                    <Image
                      source={require("../../../Assets/Images/Eye.png")}
                      style={styles.actionIcon}
                    />
                    <Image
                      source={require("../../../Assets/Images/download.png")}
                      style={styles.actionIcon}
                    />
                  </View>
                </View>
              </>
            )}

{/* 
            {docTab === "MANUAL" && (

              <View style={styles.docRow}>
                <View style={styles.docLeft}>
                  <Image
                    source={require("../../../Assets/Images/profile.png")} // PDF icon
                    style={styles.pdfIcon}
                  />
                  <View>
                    <Text style={styles.docTitle}>Manual_Document.pdf</Text>
                    <Text style={styles.docMeta}>180 KB · PDF</Text>
                  </View>
                </View>

                <View style={styles.docActions}>
                  <Image
                    source={require("../../../Assets/Images/Eye.png")}
                    style={styles.actionIcon}
                  />
                  <Image
                    source={require("../../../Assets/Images/download.png")}
                    style={styles.actionIcon}
                  />
                </View>
              </View>

            )} */}

            {docTab === "MANUAL" && (
  <>
   <View style={{ maxHeight: 300 }}>
    <ScrollView nestedScrollEnabled>
    {manualDocs.length > 0 ? (
      manualDocs.map((doc) => (
        <View style={styles.docRow} key={doc.documentId}>
          <View style={styles.docLeft}>
           <Image
  source={
    doc.type === "PDF"
      ? require("../../../Assets/Images/pdf.png")
      : { uri: doc?.url }
  }
  style={styles.pdfIcon}
/>

            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle} numberOfLines={1}>
                 {doc.type}
                {/* {doc.url.split("/").pop()} */}
              </Text>
              {/* <Text style={styles.docMeta}>
                {doc.type}
              </Text> */}
            </View>
          </View>

          <View style={styles.docActions}>
            <TouchableOpacity onPress={() => console.log("View:", doc.url)}>
              <Image
                source={require("../../../Assets/Images/Eye.png")}
                style={styles.actionIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity  
               onPress={() => {
               setDeleteDocumentId(doc.documentId);
               setDeletePopup(true);
                }}>
              <Image
                source={require("../../../Assets/Images/trash.png")}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))
    ) : (
      <Text style={{ textAlign: "center", color: "#9CA3AF" }}>
        No Manual Documents
      </Text>
    )}
    </ScrollView>
    </View>
  </>
)}


          </View>
            {docTab === "MANUAL" && (
    <TouchableOpacity
      style={styles.uploadFabInside}
      onPress={pickFiles}
      
    >
      <Image
        source={require("../../../Assets/Images/Doc_Upload.png")}
        style={styles.uploadIcon}
      />
    </TouchableOpacity>
  )}

</View>


          {/* <View style={styles.sectionBox}>

           
            <View style={styles.sectionHeaderRowgur}>
              <Text style={styles.sectionTitle}>Parent / Guardian Details</Text>

              <TouchableOpacity>
                <Image source={EditIcon} style={styles.editIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Guardian Full Name</Text>
              <Text style={styles.detailValue}>Sivanesan R</Text>
            </View>

          
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Relationship to Tenant</Text>
              <Text style={styles.detailValue}>Parent</Text>
            </View>

          
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Guardian Occupation</Text>
              <Text style={styles.detailValue}>Private Employee</Text>
            </View>

       
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile no.</Text>
              <View style={styles.valueWithIcon}>
                <Image source={Phone} style={styles.phoneIcon} />
                <Text style={styles.detailValue}>+91 98765 43210</Text>
              </View>
            </View>

          </View> */}
<View style={styles.sectionBox}>

  {/* HEADER */}
  <View style={styles.sectionHeaderRowgur}>
    <Text style={styles.sectionTitle}>Parent / Guardian Details</Text>

    {hasGuardianDetails && (
      <TouchableOpacity>
        <Image source={EditIcon} style={styles.editIcon} />
      </TouchableOpacity>
    )}
  </View>

  {/* EMPTY STATE */}
  {!hasGuardianDetails ? (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No Contact Details are there!
      </Text>

      <TouchableOpacity  disabled={isDisabled}
  style={[
    styles.addBtn,
    isDisabled && styles.addBtnDisabled
  ]}>
        <Text   style={[
      styles.addBtnText,
      isDisabled && styles.addBtnTextDisabled
    ]} >＋ Add</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <>
      {/* FUTURE – DATA VIEW */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Guardian Full Name</Text>
        <Text style={styles.detailValue}>Sivanesan R</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Relationship to Tenant</Text>
        <Text style={styles.detailValue}>Parent</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Guardian Occupation</Text>
        <Text style={styles.detailValue}>Private Employee</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Mobile no.</Text>
        <View style={styles.valueWithIcon}>
          <Image source={Phone} style={styles.phoneIcon} />
          <Text style={styles.detailValue}>+91 98765 43210</Text>
        </View>
      </View>
    </>
  )}

</View>


          <View style={styles.sectionBox}>

            {/* HEADER */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Amenities provided</Text>
<TouchableOpacity
  style={[
    styles.assignBtn,
    disableAssignBtn && !canWriteTenant &&  { opacity: 0.4 }
  ]}
  onPress={handleShowAmenities}
  // disabled={disableAssignBtn}
   disabled={disableAssignBtn && !canWriteTenant}
  // style={!canWriteTenant && { opacity: 0.4 }}
>
  <Text style={styles.assignText}>＋ Assign</Text>
</TouchableOpacity>
            </View>

      {Array.isArray(customerDetails?.assignedAmenities) &&
customerDetails.assignedAmenities.length > 0 ? (

  customerDetails.assignedAmenities.map((item, index) => (
    <View style={styles.amenityItem} key={item.amenityId || index}>
      <Text style={styles.amenityTitle}>
        {item.amenityName}
      </Text>

      <Text style={styles.amenityPrice}>
        ₹ {item.amenityAmount} / month
      </Text>
    </View>
  ))

) : (

  <Text style={styles.noAmenityText}>
    No amenities assigned
  </Text>

)}

           

            {/* <View style={styles.amenityItem}>
              <Text style={styles.amenityTitle}>Food</Text>
              <Text style={styles.amenityPrice}>₹1,299 / month</Text>
            </View>

            <View style={styles.amenityItem}>
              <Text style={styles.amenityTitle}>Laundry</Text>
              <Text style={styles.amenityPrice}>₹299 / month</Text>
            </View> */}

            {/* REQUESTED */}
            {/* <Text style={styles.subTitle}>Requested Amenities</Text>

            <View style={styles.amenityItem}>
              <Text style={styles.amenityTitle}>Bicycle</Text>
              <Text style={styles.amenityPrice}>₹399 / month</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.approveBtn}>
                  <Text style={styles.btnText}>✓ Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.denyBtn}>
                  <Text style={styles.btnText}>✕ Deny</Text>
                </TouchableOpacity>
              </View>
            </View> */}
            <Text style={styles.subTitle}>Requested Amenities</Text>

{Array.isArray(customerDetails?.requestedAmenities) &&
customerDetails.requestedAmenities.length > 0 ? (

  customerDetails.requestedAmenities.map((item, index) => (
    <View style={styles.amenityItem} key={item.amenityId || index}>
      <Text style={styles.amenityTitle}>
        {item.amenityName}
      </Text>

      <Text style={styles.amenityPrice}>
        ₹ {item.price} / month
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.approveBtn}>
          <Text style={styles.btnText}>✓ Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.denyBtn}>
          <Text style={styles.btnText}>✕ Deny</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))

) : (

  <Text style={styles.noAmenityText}>
    No Requested Amenities
  </Text>

)}


          </View>



        </View>
      </ScrollView>

            <Modal
              transparent
              animationType="fade"
              visible={deletePopup}
              onRequestClose={() => setDeletePopup(false)}
            >
              <TouchableWithoutFeedback  
                          onPress={() => {
                          setDeleteDocumentId(null);
                          setDeletePopup(false)}}>
                <View style={styles.deleteOverlay}>
      
                  <TouchableWithoutFeedback>
                    <View style={styles.deleteBox}>
      
                      <Text style={styles.deleteTitle}>Delete Document?</Text>
                      <Text style={styles.deleteSub}>
                        Are you sure you want to delete this Document?
                      </Text>
      
                      <View style={styles.deleteBtnRow}>
                        <TouchableOpacity
                          style={styles.cancelBtn}
                          onPress={() => {
                          setDeleteDocumentId(null);
                          setDeletePopup(false)}}
                        >
                          <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
      
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={handleDeleteDocument}
                        >
                          <Text style={styles.deleteBtnText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
      
                    </View>
                  </TouchableWithoutFeedback>
      
                </View>
              </TouchableWithoutFeedback>
            </Modal>

    </>
  );
}











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
    alignItems: "center",

  },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: "grey",
    marginLeft: "auto",
  },

  assignBtn: {
    marginLeft: "auto",
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

  amount: { fontWeight: "600", color: "#2563EB" },
  editSmall: { width: 14, height: 14, marginLeft: 6 },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 🔥 left tabs + right icon
    marginBottom: 12,
    borderBottomWidth: 1,          // ✅ bottom border
    borderBottomColor: "#E0E0E0",  // light gray (or red if you want)
    paddingBottom: 10,
  },

  tabRow: {
    flexDirection: "row",
    gap: 20,
  },


  tabText: {
    marginRight: 18,
    color: "#9CA3AF",
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
  detailRow: {
    marginBottom: 14,
  },

  detailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  phoneIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: "#2563EB",
  },

  valueWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
    resizeMode: "contain",

  },
  detailIconFloor: {
    width: 18,
    height: 18,
    marginRight: 6,
    tintColor: "#2563EB"
  },
  detailBlock: {
    marginBottom: 12,
  },
  sectionBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    elevation: 2,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  amountRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: 15,
    paddingTop: 10
  },

  amountLabel: {
    fontSize: 12,

    marginBottom: 0,
    color: "#2563EB",
  },

 

  amountValue: {
    fontSize: 14,
    fontWeight: "600",

  },

  editIconSmall: {
    width: 14,
    height: 14,
    marginLeft: 6,
    tintColor: "grey",
  },
  docContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    elevation: 2,
  },

  docTabRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  docTabText: {
    marginRight: 20,
    color: "#9CA3AF",
    fontSize: 14,
  },

  docActiveTab: {
    color: "#2563EB",
    fontWeight: "600",
    borderBottomWidth: 2,
    borderColor: "#2563EB",
    paddingBottom: 4,
  },

  docRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  docLeft: {
    flexDirection: "row",              // 🔥 icon + text row
    alignItems: "center",
    flex: 1,
  },


  pdfIcon: {
    width: 32,
    height: 32,
    marginRight:6
  },

  docTitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  docMeta: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  docActions: {
    flexDirection: "row",
  },

  actionIcon: {
    width: 18,
    height: 18,
    marginLeft: 14,
    // tintColor: "#6B7280",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingBottom: 10,         // ✅ header & content gap
    marginBottom: 12,          // ✅ divider ku gap
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },


  sectionHeaderRowgur: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    justifyContent: "space-between",
     paddingBottom: 10,        
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  amenityItem: {
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  halfBlock: {
    width: "48%",
  },
twoColumnRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 14,
},

amountBox: {
  width: "48%",
 
  paddingVertical: 12,
  paddingHorizontal: 14,
},

amountValueRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},


emptyContainer: {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 30,
},

emptyText: {
  fontSize: 14,
  color: "#6B7280",
  marginBottom: 16,
  fontWeight: "500",
},

addBtn: {
  backgroundColor: "#2563EB",
  paddingHorizontal: 28,
  paddingVertical: 10,
  borderRadius: 14,
},

addBtnText: {
  color: "#0b0a0a",
  fontSize: 15,
  fontWeight: "600",
},

addBtnTextDisabled: {
 color: "#6B7280",// dark gray
},
addBtnDisabled: {
  backgroundColor: "#CBD5E1", // light gray
},
noAmenityText: {
  textAlign: "center",
  color: "#9CA3AF",
  fontSize: 14,
  marginTop: 10,
  fontStyle: "italic",
},
docContainer: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 14,
  marginTop: 14,
  elevation: 2,
  position: "relative",   // 🔥 Important
},

docContentWrapper: {
  paddingBottom: 60, // space for floating button
},

uploadFabInside: {
  position: "absolute",
  bottom: 6,
  right: 6,
  width: 36,
  height: 36,
  borderRadius: 26,
  backgroundColor: "#16A34A",
  justifyContent: "center",
  alignItems: "center",
  elevation: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
},

uploadIcon: {
  width: 22,
  height: 22,
  tintColor: "#fff",
},

  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },

  deleteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  deleteSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },

  deleteBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
  },

  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#2D6CDF",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

});
