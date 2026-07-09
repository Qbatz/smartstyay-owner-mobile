import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image, ScrollView, Modal, TouchableWithoutFeedback, Linking
} from "react-native";
import Mail from "../../../Assets/Images/sms.png";
import Phone from "../../../Assets/Images/call.png";
import Home from "../../../Assets/Images/home-link.png";
// import Location from "../../../Assets/Images/sms.png";
import BedIcon from "../../../Assets/Images/BedImage.png";
import RoomIcon from "../../../Assets/Images/RoomImg.png";
import FloorIcon from "../../../Assets/Images/FloorImg.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import EditIcon from "../../../Assets/Images/edit.png";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { AmenityContext } from "../../../Context/AmenityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";
import { PGContext } from "../../../Context/PGContext";
import { useHasPermission } from "../../../Utils/useHasPermission"
import { pick } from '@react-native-documents/picker';
import SuccessModal from "../../../ToastFile/ToastPage";
import AddIcon from "../../../Assets/Images/add-circle.png"
import House from "../../../Assets/Images/house.png"
import Pin from "../../../Assets/Images/pin.png"
import Street from "../../../Assets/Images/Street.png"
import Building from "../../../Assets/Images/buildings.png"
import Location from "../../../Assets/Images/location.png"
import DocumentViewer from "./DocumentViewer"
import AdditionalContactBottomSheet from "./AdditionalContactBottomSheet"
import AmenitiesClipPath from "../../../Assets/Images/amenitiesClipPath.png";
import RequestAmenitiesIcon from "../../../Assets/Images/requestAmenitiesIcon.png"
import Loader from "../../Loader/Loader";
import KYCPendingSheet from "./KYCPendingSheet"
// import RNFS from "react-native-fs";
import LeftArrow from "../../../Assets/Images/Arrow_left.png";



export default function OverviewTab({ customerDetails,
  handleEditBasicDetails, handleEditAdressDetails, handleEditJoining, handleEditMonthlyRent, handleEditAdvance, handleShowAmenities
  , openAdditionalContact, handleshowKYCPendingSheet }) {
  const [addressTab, setAddressTab] = useState("KYC");
  const { GetAllAmenities, amenities, amenitiesAllData } = useContext(AmenityContext);
  const { activeHostelId } = useContext(CommonContexts);
  const { getParticularHostelDetails, PGDetails } = useContext(PGContext);
  const { AddManualDocument, ParticularcustomerDetails, AddAdditionalContacts,
    GetParticularCustomerDetails, deleteManualDocument, loading } = useCustomer();
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const [deletePopup, setDeletePopup] = useState(false)
  const [deleteDocumentId, setDeleteDocumentId] = useState(null);

  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  // const [showkycPendingSheet, setShowKYCPendingSheet] = useState(false);

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
  console.log(canWriteTenant)

  console.log("amenitiesAllData", amenitiesAllData)

  const [docTab, setDocTab] = useState("KYC");
  const [flat, setFlat] = useState("")
  const [area, setArea] = useState("")
  const [landmark, setLandmark] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")
  const [stateList, setStateList] = useState("")
  const [manualDoc, setManualDocs] = useState([])
  const [showSheet, setShowSheet] = useState(false);

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

  useEffect(() => {
    if (activeHostelId) {
      getParticularHostelDetails(activeHostelId);
    }
  }, [activeHostelId])

  console.log("customerDetails", customerDetails);

  // const manualDocs = customerDetails?.files?.otherDoc || [];
  const dataSource = ParticularcustomerDetails || customerDetails;
  const manualDocs = dataSource?.files?.otherDoc || [];
  const kycDocs = dataSource?.files?.kycDoc || [];

  const contacts = ParticularcustomerDetails?.additionalContacts || [];
  const hasContacts = contacts.length > 0;
  const [expandedIndex, setExpandedIndex] = useState(null);
  console.log("particularcustomer", ParticularcustomerDetails);


  const pickFiles = async () => {
    try {
      const results = await pick({
        allowMultiSelection: true,
        type: ['*/*'],
        copyTo: 'cachesDirectory',
      });

      const res = await AddManualDocument(
        activeHostelId,
        customerDetails?.customerId,
        results, "OTHER"
      );
      if (res?.success) {
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

  const HandleAddKycDocument = async () => {
    try {
      const results = await pick({
        allowMultiSelection: true,
        type: ['*/*'],
        copyTo: 'cachesDirectory',
      });
      const res = await AddManualDocument(
        activeHostelId,
        customerDetails?.customerId,
        results, "KYC"
      );

      if (res?.success) {
        await GetParticularCustomerDetails(customerDetails?.customerId)
        setModalType("success");
        setMessage("Kyc Document Added successfully");
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



  const handleshowAdditionalContact = () => {
    openAdditionalContact();
  };

  const handleshowkycsheet = () => {
    handleshowKYCPendingSheet()
  }





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
    // "NOTICE",
    "CANCELLED",
  ].includes(customerDetails?.hostelInfo?.currentStatus);
  console.log("customerDetails?.hostelInfo", customerDetails?.hostelInfo)

  const isNewRentApplied = customerDetails?.isNewRentApplied;
  const newRent = customerDetails?.newRentAmount;
  const oldRent = customerDetails?.hostelInfo?.monthlyRent;
  const newRentLabel = customerDetails?.newRentLabel;

  const isBookedTenant = customerDetails?.customerCurrentStatus === "BOOKED";
  const canEditAdvance = customerDetails?.advanceInfo?.canEditAdvance;

  const status = customerDetails?.customerCurrentStatus;

  const disableFinancialEdit =
    status === "BOOKED" ||
    status === "VACATED" ||
    status === "NOTICE" ||
    status === "CANCELLED_BOOKING"

  const disabledocEdit =
    status === "BOOKED" ||
    status === "VACATED" ||
    status === "CANCELLED_BOOKING"

  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isSubscriptionAllow = isValidSubscription



  return (
    <>
      {/* {loading && <Loader/>} */}
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


         { !["VACATED", "INACTIVE"].includes(customerDetails?.customerCurrentStatus) &&

          <View style={styles.pendingCard}>
            <View style={styles.pendingTopRow}>
              <View style={styles.pendingLeft}>
                <Image
                  source={RequestAmenitiesIcon} // document icon
                  style={styles.pendingIcon}
                />

                <Text style={styles.pendingText}>
                  <Text style={styles.pendingCount}>2</Text> Pending action(s)
                </Text>
              </View>

              <View style={styles.progressBadge}>
                <Text style={styles.progressArrow}>↑</Text>
                <Text style={styles.progressText}>30%</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.pendingBtn ,customerDetails?.customerCurrentStatus =="BOOKED" && {opacity:0.4}  ]} 
            disabled = {customerDetails?.customerCurrentStatus =="BOOKED" ? true :false}
            onPress={handleshowkycsheet}>
              <Text style={styles.pendingBtnText}>
                See Pending Actions
              </Text>
            </TouchableOpacity>
          </View>
          }

          <View style={styles.sectionBox}>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Basic Details</Text>
              {/* <Image source={EditIcon} style={styles.editIcon} /> */}

              {
                (customerDetails?.customerCurrentStatus != "VACATED" && customerDetails?.customerCurrentStatus != "CANCELLED_BOOKING") && (
                  <TouchableOpacity
                    disabled={!canUpdateTenant}
                    style={!canUpdateTenant && { opacity: 0.4 }}
                    onPress={handleEdit}>
                    <Image source={EditIcon} style={styles.editIcon} />
                  </TouchableOpacity>
                )
              }

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
                <TouchableOpacity
                  // style={{flex:1,justifyContent:'center',alignItems:'center'}} 
                  onPress={() => setAddressTab("KYC")}>
                  <Text
                    style={[
                      styles.tabText,
                      addressTab === "KYC" && styles.activeTab,
                    ]}
                  >
                    KYC Address
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  // style={{flex:1,justifyContent:'center',alignItems:'center'}} 
                  onPress={() => setAddressTab("MANUAL")}>
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


                (customerDetails?.customerCurrentStatus != "VACATED" && customerDetails?.customerCurrentStatus != "CANCELLED_BOOKING") && (
                  <TouchableOpacity
                    disabled={!canUpdateTenant}
                    style={!canUpdateTenant && { opacity: 0.4 }}
                    onPress={handleAdressEdit}>
                    <Image source={EditIcon} style={styles.editIcon} />
                  </TouchableOpacity>
                )


              )}
            </View>


            {
              addressTab === "KYC" && (
                <View >
                  <View style={styles.row}>
                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>House No / Apartment</Text>
                      <View style={styles.valueRow}>
                        <Image source={House} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.kycInfo?.permanentAddress?.houseNo || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>Street / Area</Text>
                      <View style={styles.valueRow}>
                        <Image source={Street} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.kycInfo?.permanentAddress?.streetName || "N/A"}
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
                          {customerDetails?.kycInfo?.permanentAddress?.landmark || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>Pincode</Text>
                      <View style={styles.valueRow}>
                        <Image source={Pin} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.kycInfo?.permanentAddress?.pincode || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>


                  <View style={styles.row}>
                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>City</Text>
                      <View style={styles.valueRow}>
                        <Image source={Building} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.kycInfo?.permanentAddress?.city || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>State</Text>
                      <View style={styles.valueRow}>
                        <Image source={Building} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.kycInfo?.permanentAddress?.state || "N/A"}
                        </Text>
                      </View>
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
                        <Image source={House} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.address?.houseNo || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>Street / Area</Text>
                      <View style={styles.valueRow}>
                        <Image source={Street} style={styles.icon} />
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
                      <View style={styles.valueRow}>
                        <Image source={Pin} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.address?.pincode || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>


                  <View style={styles.row}>
                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>City</Text>
                      <View style={styles.valueRow}>
                        <Image source={Building} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.address?.city || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailBlock, styles.halfBlock]}>
                      <Text style={styles.label}>State</Text>
                      <View style={styles.valueRow}>
                        <Image source={Building} style={styles.icon} />
                        <Text style={styles.value}>
                          {customerDetails?.address?.state || "N/A"}
                        </Text>
                      </View>
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
              <View style={{ width: "46%" }}>
                <Text style={styles.detailLabel}>Floor</Text>
                <View style={styles.valueWithIcon}>
                  <Image source={FloorIcon} style={styles.detailIconFloor} />
                  <Text style={styles.detailValue}>
                    {customerDetails?.hostelInfo?.floorName || "N/A"}
                  </Text>
                </View>
              </View>

              <View style={{ width: "46%" }}>
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
              <View style={{ width: '46%' }}>
                <Text style={styles.detailLabel}>Bed</Text>
                <View style={styles.valueWithIcon}>
                  <Image source={BedIcon} style={styles.detailIcon} />
                  <Text style={styles.detailValue}>
                    {customerDetails?.hostelInfo?.bedName || "N/A"}
                  </Text>
                </View>
              </View>


              <View style={{ width: '46%' }}>
                <Text style={styles.detailLabel}>Booking Date</Text>
                <View style={styles.valueWithIcon}>
                  <Image source={Home} style={styles.detailIcon} />
                  <Text style={styles.detailValue}>
                    {customerDetails?.bookingInfo?.bookingDate || "N/A"}
                  </Text>
                </View>
              </View>
            </View>





            <View style={styles.twoColumnRow}>

              {isSubscriptionAllow && (
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Joined Date</Text>
                  <View style={styles.valueWithIcon}>
                    <Image source={Home} style={styles.detailIcon} />
                    <Text style={styles.detailValue}>
                      {customerDetails?.hostelInfo?.joiningDate || "N/A"}
                    </Text>
                    {
                      ["CHECK_IN"].includes(customerDetails?.customerCurrentStatus) && (
                        <TouchableOpacity
                          onPress={handleEditJoining}
                          // disabled={!isJoiningDateEditable}
                          activeOpacity={0.7}
                          disabled={!isJoiningDateEditable || !canUpdateTenant}
                          style={(!isJoiningDateEditable || !canUpdateTenant) && { opacity: 0.4 }}
                        >
                          <Image
                            source={EditIcon}
                            style={[
                              styles.editIconSmall,
                              !isJoiningDateEditable && styles.disabledIcon,
                            ]}
                          />
                        </TouchableOpacity>
                      )

                    }

                  </View>
                </View>
              )}

              {
                customerDetails?.customerCurrentStatus === "VACATED" && (
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Checkout Date</Text>
                    <View style={styles.valueWithIcon}>
                      <Image source={Home} style={styles.detailIcon} />
                      <Text style={styles.detailValue}>
                        {customerDetails?.checkoutInfo?.checkoutDate || "N/A"}
                      </Text>
                    </View>
                  </View>
                )
              }





              {/* empty box to keep alignment */}
              {/* <View style={styles.detailBox} /> */}
            </View>


            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Financial Details</Text>


            <View style={styles.twoColumnRow}>
              <View style={styles.amountBox}>
                <View style={styles.amountValueRow}>
                  <Text style={styles.amountValue}>Monthly Rent</Text>

                  {
                    !disableFinancialEdit && isSubscriptionAllow && (
                      <>
                        {
                          !["VACATED", "NOTICE"].includes(status) && (
                            <TouchableOpacity
                              disabled={disableFinancialEdit || !canUpdateTenant || !isJoiningDateEditable}
                              style={(disableFinancialEdit || !canUpdateTenant || !isJoiningDateEditable) && { opacity: 0.4 }}
                              onPress={handleEditMonthlyRent}
                            >
                              <Image
                                source={EditIcon}
                                style={styles.editIconSmall}
                              />
                            </TouchableOpacity>
                          )
                        }
                      </>
                    )
                  }



                </View>
                <Text style={styles.amountLabel}>
                  ₹ {customerDetails?.hostelInfo?.monthlyRent || 0}
                </Text>
              </View>



              {/* Advance Amount */}

            </View>

            {isNewRentApplied && (
              <>
                <View style={styles.amountBox}>
                  <Text style={styles.amountValue}>Monthly New Rent</Text>
                  <Text style={styles.amountLabel}>₹ {newRent || 0}</Text>
                </View>

                <View style={styles.newRentBox}>
                  <Text style={styles.newRentText}>
                    {newRentLabel}
                  </Text>
                </View>
              </>
            )}


            <View style={{ width: "58%", paddingVertical: 12, paddingHorizontal: 14, }}>
              <View style={styles.amountValueRow}>
                <Text style={styles.amountValue}>Advance Amount</Text>


                {
                  !disableFinancialEdit && isSubscriptionAllow && (
                    <>

                      {
                        !["VACATED", "NOTICE"].includes(status) && (
                          <TouchableOpacity
                            disabled={
                              disableFinancialEdit || !canUpdateTenant || !canEditAdvance || !isJoiningDateEditable}
                            style={
                              (disableFinancialEdit || !canUpdateTenant || !canEditAdvance || !isJoiningDateEditable) &&
                              { opacity: 0.4 }
                            }
                            onPress={handleEditAdvance}
                          >
                            <Image
                              source={EditIcon}
                              style={styles.editIconSmall}
                            />
                          </TouchableOpacity>
                        )
                      }
                    </>

                  )
                }



              </View>
              <Text style={styles.amountLabel}>
                ₹ {customerDetails?.advanceInfo?.advanceAmount || 0}
              </Text>
            </View>


            {/* ROW 2 : Booking Amount + Maintenance */}
            <View style={styles.twoColumnRow}>
              {/* Booking Amount */}
              <View style={styles.amountBox}>
                <Text style={styles.amountValue}>Booking Amount</Text>
                <Text style={styles.amountLabel}>
                  ₹ {customerDetails?.bookingInfo?.bookingAmount || 0}
                </Text>
              </View>

              {/* Maintenance (show only if exists) */}


            </View>


            <View style={styles.amountBox}>
              <Text style={styles.amountValue}>Maintenance</Text>
              <Text style={styles.amountLabel}>
                ₹ {customerDetails.hostelInfo?.maintenance || 0}
              </Text>
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









          </View>



          <View style={styles.docContainer}>

            <View style={styles.docContentWrapper}>
              <View style={styles.docTabRow}>
                <TouchableOpacity onPress={() => setDocTab("KYC")}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.docTabText,
                      docTab === "KYC" && styles.docActiveTab,
                    ]}
                  >
                    KYC Documents
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setDocTab("MANUAL")}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                <View style={{ maxHeight: 300 }}>
                  <ScrollView nestedScrollEnabled>
                    {kycDocs.length > 0 ? (
                      kycDocs.map((doc) => (
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
                              </Text>
                            </View>
                          </View>

                          <View style={styles.docActions}>
                            {/* VIEW */}
                            <TouchableOpacity
                              disabled={!isSubscriptionAllow}
                              onPress={() => {
                                if (doc.type === "PDF") {
                                  Linking.openURL(doc.url);
                                } else {
                                  const index = kycDocs.findIndex(
                                    (item) => item.documentId === doc.documentId
                                  );
                                  setViewerIndex(index);
                                  setViewerVisible(true);
                                }
                              }}
                            >
                              <Image
                                source={require("../../../Assets/Images/Eye.png")}
                                style={[
                                  styles.actionIcon,
                                  !isSubscriptionAllow && { opacity: 0.4 },
                                ]}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              disabled={!isSubscriptionAllow || !doc?.canDelete}
                              onPress={() => {
                                setDeleteDocumentId(doc.documentId);
                                setDeletePopup(true);
                              }}>
                              <Image
                                source={require("../../../Assets/Images/trash.png")}
                                style={[
                                  styles.actionIcon,
                                  (!isSubscriptionAllow || !doc?.canDelete) && { opacity: 0.4 }
                                ]}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text style={{ textAlign: "center", color: "#9CA3AF", fontFamily: "Gilroy-Semibold" }}>
                        No KYC Documents
                      </Text>
                    )}
                  </ScrollView>

                  {/* 👇 IMPORTANT: viewer ku kycDocs pass pannunga */}
                  <DocumentViewer
                    visible={viewerVisible}
                    documents={kycDocs}
                    initialIndex={viewerIndex}
                    onClose={() => setViewerVisible(false)}
                    customerdetails={customerDetails}
                  />
                </View>
              )}




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
                              <TouchableOpacity
                                disabled={!isSubscriptionAllow}

                                onPress={() => {
                                  if (doc.type === "PDF") {
                                    Linking.openURL(doc.url);
                                  } else {
                                    const index = manualDocs.findIndex(
                                      (item) => item.documentId === doc.documentId
                                    );

                                    setViewerIndex(index);
                                    setViewerVisible(true);
                                  }
                                }}
                              >
                                <Image
                                  source={require("../../../Assets/Images/Eye.png")}
                                  style={[
                                    styles.actionIcon,
                                    (!isSubscriptionAllow) && { opacity: 0.4 }
                                  ]}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                disabled={!isSubscriptionAllow}
                                onPress={() => {
                                  setDeleteDocumentId(doc.documentId);
                                  setDeletePopup(true);
                                }}>
                                <Image
                                  source={require("../../../Assets/Images/trash.png")}
                                  style={[
                                    styles.actionIcon,
                                    (!isSubscriptionAllow) && { opacity: 0.4 }
                                  ]}
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
                    <DocumentViewer
                      visible={viewerVisible}
                      documents={manualDocs}
                      initialIndex={viewerIndex}
                      onClose={() => setViewerVisible(false)}
                      customerdetails={customerDetails}
                    />
                  </View>
                </>
              )}


            </View>
            {docTab === "KYC" && (
              <TouchableOpacity
                // style={styles.uploadFabInside}
                style={[
                  styles.uploadFabInside,
                  (!isSubscriptionAllow || disabledocEdit) && { opacity: 0.4 }
                ]}
                disabled={disableAssignBtn}
                onPress={HandleAddKycDocument}

              >
                <Image
                  source={require("../../../Assets/Images/Doc_Upload.png")}
                  style={styles.uploadIcon}
                />
              </TouchableOpacity>
            )}
            {docTab === "MANUAL" && (
              <TouchableOpacity
                // style={styles.uploadFabInside}
                style={[
                  styles.uploadFabInside,
                  (!isSubscriptionAllow || disabledocEdit) && { opacity: 0.4 }
                ]}
                disabled={disableAssignBtn}
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
              {hasContacts && contacts.length === 1 && (
                <TouchableOpacity onPress={() => handleshowAdditionalContact(contacts?.[0])} disabled>
                  <Image source={EditIcon} style={styles.editSmallIcon} />
                </TouchableOpacity>)}
              {hasContacts && contacts.length > 0 && (
                <TouchableOpacity
                  style={[
                    styles.addSmallBtn,
                    (!isSubscriptionAllow || disabledocEdit) && { opacity: 0.4 }
                  ]}
                  disabled={disableAssignBtn}
                  // style={styles.addSmallBtn}
                  onPress={handleshowAdditionalContact}>
                  <Image source={AddIcon} style={{ height: 13, width: 13 }} />
                  <Text style={{ color: '#fff' }}> Additional</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* EMPTY */}
            {!hasContacts && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No Contact Details are there!
                </Text>

                <TouchableOpacity
                  style={[
                    styles.addSmallBtn,
                    (!isSubscriptionAllow || disabledocEdit) && { opacity: 0.4 }
                  ]}
                  disabled={disableAssignBtn}
                  //  style={styles.addSmallBtn} 
                  onPress={handleshowAdditionalContact}>
                  <Image source={AddIcon} style={{ height: 13, width: 13 }} />
                  <Text style={{ color: '#fff' }}> Add</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* SINGLE CONTACT */}
            {hasContacts && contacts.length === 1 && (
              <View style={styles.singleCard}>
                <Text style={styles.subLabel}>Guardian Full Name</Text>
                <Text style={styles.name}>{contacts[0]?.fullName}</Text>

                <Text style={styles.subLabel}>Relationship</Text>
                <Text style={styles.value}>{contacts[0]?.relationship}</Text>

                <Text style={styles.subLabel}>Occupation</Text>
                <Text style={styles.value}>{contacts[0]?.occupation}</Text>
                <Text style={styles.subLabel}>Mobile no.</Text>
                <View style={styles.phoneRow}>
                  <Image source={Phone} style={styles.phoneIcon} />
                  <Text style={styles.value}>
                    +{contacts[0].country} {contacts[0]?.mobile}
                  </Text>
                </View>
              </View>
            )}

            {/* MULTIPLE CONTACTS */}
            {hasContacts && contacts.length > 1 && (
              <>
                {contacts.map((item, index) => {
                  const isOpen = expandedIndex === index;

                  return (
                    <View key={index} style={styles.accordionCard}>

                      {/* HEADER */}
                      <TouchableOpacity
                        style={styles.accordionHeader}
                        onPress={() =>
                          setExpandedIndex(isOpen ? null : index)
                        }
                      >
                        {/* LEFT SIDE */}
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.name}>{item.fullName}</Text>

                            {/* CONTACT BADGE */}
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>
                                Contact {String(index + 1).padStart(2, "0")}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.phoneRow}>
                            <Image source={Phone} style={styles.phoneIcon} />
                            <Text style={styles.phoneText}>
                              +{item.country} {item.mobile}
                            </Text>
                          </View>
                        </View>

                        {/* RIGHT SIDE */}
                        <View style={styles.rightIcons}>

                          {/* EDIT ICON */}
                          <TouchableOpacity onPress={() => handleshowAdditionalContact(item)} disabled>
                            <Image source={EditIcon} style={styles.editSmallIcon} />
                          </TouchableOpacity>

                          {/* DOWN ARROW */}
                          <Image
                            source={DownArrow}
                            style={[
                              styles.arrowIcon,
                              isOpen && { transform: [{ rotate: "180deg" }] }
                            ]}
                          />
                        </View>
                      </TouchableOpacity>

                      {/* EXPANDED */}
                      {isOpen && (
                        <View style={styles.accordionBody}>
                          <Text style={styles.subLabel}>Relationship to Tenant</Text>
                          <Text style={styles.value}>{item.relationship}</Text>

                          <Text style={styles.subLabel}>Guardian Occupation</Text>
                          <Text style={styles.value}>{item.occupation}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
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
                  (disableAssignBtn || !canWriteTenant || !isSubscriptionAllow) && { opacity: 0.4 }
                ]}
                disabled={
                  disableAssignBtn ||
                  !canWriteTenant ||
                  !isSubscriptionAllow
                }
                onPress={handleShowAmenities}
              >
                <Text style={styles.assignText}>＋ Assign</Text>
              </TouchableOpacity>
            </View>

            {Array.isArray(customerDetails?.assignedAmenities) &&
              customerDetails?.assignedAmenities?.length > 0 ? (

              customerDetails.assignedAmenities.map((item, index) => (
                <View style={[styles.amenityItem, { flexDirection: 'row', alignItems: 'center' }]} key={item.amenityId || index}>

                  <View style={{ paddingVertical: 5.93, paddingHorizontal: 5.5, backgroundColor: "#1E45E10F", borderRadius: 10 }}>
                    <Image source={AmenitiesClipPath} style={{ width: 26, height: 26 }} />
                  </View>

                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.amenityTitle}>
                      {item.amenityName}
                    </Text>

                    <Text style={styles.amenityPrice}>
                      ₹ {item.amenityAmount} / month
                    </Text>
                  </View>
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

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: "#fffbf2", paddingVertical: 5.93, paddingHorizontal: 5.5, borderRadius: 10 }}>
                      <Image source={RequestAmenitiesIcon} style={{ width: 22.43, height: 22.43 }} />
                    </View>

                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.amenityTitle}>
                        {item.amenityName}
                      </Text>

                      <Text style={styles.amenityPrice}>
                        ₹ {item.price} / month
                      </Text>

                    </View>
                  </View>

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
            setDeletePopup(false)
          }}>
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
                      setDeletePopup(false)
                    }}
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



      {/* <AdditionalContactBottomSheet
  visible={showSheet}
  onClose={() => setShowSheet(false)}
/> */}

    </>
  )

}











const Amenity = ({ title, price, children }) => (
  <View style={styles.amenityCard}>
    <Text style={styles.amenityTitle}>{title}</Text>
    <Text style={styles.amenityPrice}>{price}</Text>
    {children}
  </View>
);


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",

  },
  cardTitle: { fontSize: 15, fontFamily: "Gilroy-Semibold" },
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
  label: { fontSize: 12, color: "#6B7280", fontFamily: "Gilroy-Semibold" },
  valueRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  value: { fontSize: 14, fontFamily: "Gilroy-Medium" },
  icon: { width: 14, height: 14, marginRight: 6 },

  amount: { fontFamily: "Gilroy-Semibold", color: "#2563EB" },
  editSmall: { width: 14, height: 14, marginLeft: 6 },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 10,
  },

  tabRow: {
    flexDirection: "row",
    gap: 20,
  },


  tabText: {
    marginRight: 18,
    color: "#9CA3AF",
    fontFamily: "Gilroy-Semibold"
  },

  activeTab: {
    color: "#2563EB",
    fontFamily: "Gilroy-Semibold",
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
  amenityTitle: { fontFamily: "Gilroy-Semibold" },
  amenityPrice: { fontSize: 12, color: "#666", marginTop: 2 },

  subTitle: { marginTop: 14, fontFamily: "Gilroy-Semibold" },

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
  btnText: { color: "#fff", fontFamily: "Gilroy-Semibold" },
  detailRow: {
    marginBottom: 14,
  },

  detailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
    fontFamily: "Gilroy-Semibold"
  },

  detailValue: {
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
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
  pndngActionBox: {
    backgroundColor: '#FFF9EC', borderRadius: 8, paddingVertical: 13,
    paddingHorizontal: 16,
  },
  pendingActTitl: {
    backgroundColor: '#EB6617', borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center',
    marginTop: 14
  },
  sectionBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    elevation: 2,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    // elevation: 2, 
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Bold",
    marginBottom: 0,
    color: "#2563EB",
  },



  amountValue: {
    fontSize: 14,
    fontFamily: "Gilroy-Semibold"

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
    fontFamily: "Gilroy-Semibold",
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },


  pdfIcon: {
    width: 32,
    height: 32,
    marginRight: 6
  },

  docTitle: {
    fontSize: 14,
    fontFamily: "Gilroy-Medium"
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

    paddingBottom: 10,
    marginBottom: 12,
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
    // backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#EFF2FF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    // flexDirection:'row'
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
    fontFamily: "Gilroy-Medium"
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
    fontFamily: "Gilroy-Semibold"
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
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
    fontFamily: "Gilroy-Bold",
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
    fontFamily: "Gilroy-Semibold"
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
    fontFamily: "Gilroy-Bold"
  },
  addSmallBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: "#2563EB",
    // color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    // fontSize: 12,
  },

  singleCard: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
  },

  accordionCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },

  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    alignItems: "center",
  },

  accordionBody: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  name: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold"
  },

  phoneText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  subLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
  },

  value: {
    fontSize: 14,
    fontFamily: "Gilroy-Medium"
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  badge: {
    backgroundColor: "#FFE7D6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },

  badgeText: {
    color: "#F97316",
    fontSize: 11,
    fontFamily: "Gilroy-Semibold"
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  editSmallIcon: {
    width: 16,
    height: 16,
    tintColor: "#6B7280",
  },

  arrowIcon: {
    marginLeft: 5,
    width: 23,
    height: 23,
    // tintColor: "#6B7280",
  },
  newRentAmount: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    marginTop: 6,
    color: "#111827",
  },

  newRentBox: {
    backgroundColor: "#FFF4E5",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
  },

  newRentText: {
    color: "#C26B00",
    fontSize: 12,
    fontFamily: "Gilroy-Semibold"
  },
  pendingCard: {
    backgroundColor: "#FFF9EC",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
  },

  pendingTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  pendingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  pendingIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    tintColor: "#2F2F2F",
    marginRight: 12,
  },

  pendingText: {
    fontSize: 16,
    color: "#1F2937",
    fontFamily: "Gilroy-Medium",
  },

  pendingCount: {
    fontFamily: "Gilroy-Bold",
  },

  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  progressArrow: {
    color: "#16A34A",
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
    marginRight: 4,
  },

  progressText: {
    color: "#16A34A",
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
  },

  pendingBtn: {
    backgroundColor: "#EB6617",
    borderRadius: 12,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },

  pendingBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Gilroy-Semibold",
  },
});
