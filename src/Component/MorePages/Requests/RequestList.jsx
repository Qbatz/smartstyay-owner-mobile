
import React, { useState, useRef, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image, BackHandler, Animated, PanResponder,
    ScrollView, Dimensions, Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { CommonContexts } from "../../../Context/CommonContext";
import { ComplaintContext } from "../../../Context/ComplaintContext";
import { UseSetting } from "../../../Context/SettingContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import Loader from "../../Loader/Loader"
import { useHasPermission } from "../../../Utils/useHasPermission";
import Profile from "../../../Assets/Images/Avatar.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import AddComplaint from "../../../Assets/Images/add-circle.png";
import DotsIcon from "../../../Assets/Images/3dots.png";
import BedRequestSheet from "./BedRequestSheet"
import AmenityRequestSheet from "./AmenityRequestSheet"
// import ComplaintDetails from "../Complaints/ViewCompliance";
// import AssignBottomSheet from "../Complaints/AssignCompliance";
// import CommentBottomSheet from "../Complaints/CommentBox";
// import ChangeStatus from "../../Complaints/ComplianceStatus";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import LeftArrow from "../../../Assets/Images/Arrow_left.png"
import SearchIcon from "../../../Assets/Images/SearchIcon.png";
import { useHideTabbarOnScroll } from "../../../Utils/useHideTabbarOnScroll"

export default function Complaints({ route }) {


    const { loading, complaintsList, complaintListOtherDetails, GetComplaintListDetails,
        complaintTypes, fetchComplaintTypes, getParticularComplaint } = useContext(ComplaintContext);
    const { activeHostelId } = useContext(CommonContexts);
    const { getUsersByHostel, } = UseSetting();

    console.log("complaintsList", complaintsList);

    const {
        canWriteModule: canWriteComplaints,
        canReadModule: canReadComplaints,
        canUpdateModule: canUpdateComplaints,
        canDeleteModule: canDeleteComplaints,
    } = useHasPermission("Complaints")


    const [showSheet, setShowSheet] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const [selectedUser, setSelectedUser] = useState("Select");
    const [selectedStatus, setSelectedStatus] = useState("Pending");

    const [showAssignSheet, setShowAssignSheet] = useState(false);
    const [showCommentSheet, setShowCommentSheet] = useState(false);
    const [showStatusSheet, setShowStatusSheet] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);


    // const { setShowTabBar } = route.params
    const navigation = useNavigation();
    const [showFilter, setShowFilter] = useState(false);
    const [status, setStatus] = useState("All");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [users, setUsers] = useState([])

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

    const lastScrollY = useRef(0);
    const isTabBarVisible = useRef(true)


    const [bedSheetVisible, setBedSheetVisible] = useState(false);
    const [amenitySheetVisible, setAmenitySheetVisible] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    // const {handleScroll} =useHideTabbarOnScroll(setShowTabBar);

    useEffect(() => {
        if (activeHostelId) {
            GetComplaintListDetails(activeHostelId);
        }
    }, [activeHostelId]);

    useEffect(() => {
        if (activeHostelId) {
            fetchComplaintTypes(activeHostelId);
        }
    }, [activeHostelId]);


    useEffect(() => {
        if (!activeHostelId) return;

        loadUsers();
    }, [activeHostelId]);

    const loadUsers = async () => {
        const res = await getUsersByHostel(activeHostelId);


        if (res.success) {
            setUsers(res?.data);
        }
    };

    console.log("users", users);


    const getInitialsFromName = (name = "") => {
        if (!name) return "";

        const words = name.trim().split(" ").filter(Boolean);

        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }

        return (
            words[0].charAt(0).toUpperCase() +
            words[words.length - 1].charAt(0).toUpperCase()
        );
    };


    const handleSearch = async (text) => {

        console.log("search", text);

        // if (!text?.trim()) {
        //     return GetExpenseList(activeHostelId);
        // }

        // return GetExpenseList(activeHostelId, {
        //     name: text,
        //     categoryId: selectedCategoryId || null,
        //     page: 1,
        //     size: 10,
        // })
    }


    const handleClearSearch = async () => {
        setSearchText("");
        setSearchOpen(false);

        // await GetExpenseList(activeHostelId);
    }


    const SCREEN_HEIGHT = Dimensions.get("window").height;

    const filterTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    const openFilterSheet = () => {
        Animated.spring(filterTranslateY, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    const closeFilterSheet = () => {
        Animated.timing(filterTranslateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setShowFilter(false));
    };

    const filterPan = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) filterTranslateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) closeFilterSheet();
                else openFilterSheet();
            },
        })
    ).current;

    useEffect(() => {
        if (showFilter) {
            openFilterSheet();

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                    closeFilterSheet();
                    return true;
                }
            );

            return () => backHandler.remove();
        }
    }, [showFilter])


    const requestData = [
        {
            id: "1",
            type: "Bed Change",
            requestNo: "REQ-1024",
            name: "Rajeshkumar",
            status: "NEW",
            date: "27 Oct , 4:32 PM",
            requestType: "BED"
        },
        {
            id: "2",
            type: "Amenity",
            requestNo: "REQ-1055",
            name: "Jon Snow",
            status: "NOT_ASSIGNED",
            date: "19 Oct , 08:10 AM",
            requestType: "AMENITY"
        },
        {
            id: "3",
            type: "Bed Change",
            requestNo: "REQ-1201",
            name: "Mark Antony",
            status: "IN_PROGRESS",
            date: "12 Oct , 8:32 AM",
            requestType: "BED"
        }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "NEW":
                return {
                    bg: "#EFF8FF",
                    dot: "#0096FF",
                    text: "New",
                    color: "#3B3B3B",
                };

            case "NOT_ASSIGNED":
                return {
                    bg: "#E7F1FFB2",
                    dot: "#1E45E1",
                    text: "Not Assigned",
                    color: "#3B3B3B",
                };

            case "PENDING":
                return {
                    bg: "#FFF5E8",
                    dot: "#F5A623",
                    text: "In Progress",
                    color: "#3B3B3B",
                };

            case "ASSIGNED":
                return {
                    bg: "#F3F4F6",
                    dot: "#9CA3AF",
                    text: "Assigned",
                    color: "#3B3B3B",
                }

                  case "IN_PROGRESS":
                return {
                    bg: "#FFEDCA99",
                    dot: "#FF9900",
                    text: "In progress",
                    color: "#3B3B3B",
                }

            default:
                return {
                    bg: "#EEF5FF",
                    dot: "#2F80ED",
                    text: status,
                    color: "#3B3B3B",
                };
        }
    }

    const renderItem = ({ item }) => {
        const status = getStatusStyle(item.status);

        return (
            <TouchableOpacity
                style={styles.requestCard}
                onPress={() => {
                    setSelectedItem(item)
                    if (item.requestType === "BED") {
                        setBedSheetVisible(true)
                    } else {
                        setAmenitySheetVisible(true)
                    }
                }}
            >
                <View style={styles.leftContent}>
                    <Text style={styles.requestTitle}>
                        {item.type}
                    </Text>

                    <View style={styles.bottomRow}>
                        <Text style={styles.requestId}>
                            {item.requestNo}
                        </Text>

                        {item.customerProfile ? (
                            <Image
                                source={{ uri: item.customerProfile }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {getInitialsFromName(item.name)}
                                </Text>
                            </View>
                        )}

                        <Text style={styles.customerName}>
                            {item.name}
                        </Text>
                    </View>
                </View>

                <View style={styles.rightContent}>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: status.bg },
                        ]}
                    >
                        <View
                            style={[
                                styles.statusDot,
                                { backgroundColor: status.dot },
                            ]}
                        />
                        <Text style={styles.statusText}>
                            {status.text}
                        </Text>
                    </View>

                    <Text style={styles.dateText}>
                        {item.date}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    //   const getStatusColor = (status) => {
    //     if (status === "PENDING") return "#F59E0B";
    //     if (status === "RESOLVED") return "#22C55E";
    //     if (status === "ASSIGNED") return "grey";
    //     return "#1D5DFF";
    //   };

    const getStatusText = (item) => {
        if (item?.status === "PENDING") return "Pending";
        if (item?.status === "RESOLVED") return "Resolved";
        if (item?.status === "ASSIGNED") return "ASSIGNED";
        // if (item?.assigneeName === "") return "+ Assign";

        // return item?.assigneeName;
    };


    const isAssignEnabled = (item) => {
        return item?.assigneeName === "" &&
            item?.status !== "PENDING" &&
            item?.status !== "RESOLVED" &&
            item?.status !== "ASSIGNED"
    };


    const formatDate = (date) => {
        if (!date) return "";
        return date;
    };


    const handleReset = () => {
        setStatus("All")
    }

    const handleComplaintDetails = async (item) => {
        setSelectedComplaint(item);

        await getParticularComplaint(activeHostelId, item?.complaintId);

        setBedSheetVisible(true);
    };


    const handleAddComplaint = () => {
        if (!activeHostelId) {
            setModalType("warning");
            setModalMessage("Please Add a hostel first");
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 1500);
            return;
        }
        if (!canWriteComplaints) {
            setModalType("warning");
            setModalMessage("You do not have permission to Add complaints");
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 1500);
            return;
        }
        if (complaintTypes && complaintTypes?.length === 0) {
            setModalType("warning");
            setModalMessage("Please Create Complaint Type in Settings-Complaint");
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 1500);
            return;
        }

        navigation.navigate("AddComplaint", { mode: "add" })
    }

    // const handleScroll=(event)=>{
    //   const currentY = event.nativeEvent.contentOffset.y;

    //   if(currentY>lastScrollY.current){
    //     if(isTabBarVisible.current){
    //       setShowTabBar(false);
    //       isTabBarVisible.current=false;
    //     }
    //   } else{
    //     if(!isTabBarVisible.current){
    //        setShowTabBar(true);
    //       isTabBarVisible.current=true;
    //     }
    //   }

    //     lastScrollY.current = currentY;
    // }

    // const handleScroll = (event) => {
    //   const currentY = event.nativeEvent.contentOffset.y;
    //   const diff = currentY - lastScrollY.current;

    //   if (Math.abs(diff) < 10) return;

    //   if (diff > 0 && currentY > 50) {
    //     if (isTabBarVisible.current) {
    //       setShowTabBar(false);
    //       isTabBarVisible.current = false;
    //     }
    //   } else if (diff < 0) {
    //     if (!isTabBarVisible.current) {
    //       setShowTabBar(true);
    //       isTabBarVisible.current = true;
    //     }
    //   }

    //   lastScrollY.current = currentY;
    // };

    // useLayoutEffect(() => {
    //   setShowTabBar(!showFilter && !showSheet && !showAssignSheet && !showStatusSheet && !showCommentSheet);
    // }, [showFilter, showSheet, showAssignSheet, showStatusSheet, showCommentSheet]);

    // useLayoutEffect(() => {
    //   if (
    //     showFilter ||
    //     showSheet ||
    //     showAssignSheet ||
    //     showStatusSheet ||
    //     showCommentSheet
    //   ) {
    //     setShowTabBar(false);
    //   } else {
    //     setShowTabBar(isTabBarVisible.current);
    //   }
    // }, [showFilter, showSheet, showAssignSheet, showStatusSheet, showCommentSheet]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {

                if (showFilter) {
                    setShowFilter(false);
                    return true;
                }

                if (showAssignSheet) {
                    setShowAssignSheet(false);
                    return true;
                }

                if (showSheet) {
                    setShowSheet(false);
                    return true;
                }

                if (showStatusSheet) {
                    setShowStatusSheet(false);
                    return true;
                }

                if (showCommentSheet) {
                    setShowCommentSheet(false);
                    return true;
                }

                // setShowTabBar(true);
                // isTabBarVisible.current = true;

                navigation.goBack();
                return true;
            }
        );

        return () => backHandler.remove();
    }, [showFilter, showSheet, showAssignSheet, showStatusSheet, showCommentSheet]);

    // useLayoutEffect(() => {
    //   const backAction = () => {

    //     if (showFilter) {
    //       setShowFilter(false);
    //       return true;
    //     }
    //     if (showAssignSheet) {
    //       setShowAssignSheet(false);
    //       return true;
    //     }
    //     if (showSheet) {
    //       setShowSheet(false);
    //       return true;
    //     }
    //     if (showStatusSheet) {
    //       setShowStatusSheet(false);
    //       return true;
    //     }
    //     if (showCommentSheet) {
    //       setShowCommentSheet(false);
    //       return true;
    //     }


    //     return false;
    //   };

    //   const handler = BackHandler.addEventListener(
    //     "hardwareBackPress",
    //     backAction
    //   );

    //   return () => handler.remove();
    // }, [showFilter, showSheet, showAssignSheet, showStatusSheet, showCommentSheet])

    // useEffect(() => {
    //   const backHandler = BackHandler.addEventListener(
    //     "hardwareBackPress",
    //     () => {

    //       setShowTabBar(true);
    //       isTabBarVisible.current = true;

    //       navigation.goBack();
    //       return true;
    //     }
    //   );

    //   return () => backHandler.remove();
    // }, [])






    if (!canReadComplaints && !loading) {
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Complaints</Text>
                </View>

                <View style={styles.centerContainer}>
                    <Image source={EmptyState} style={styles.image} />
                    <Text style={styles.nodataText}>
                        You do not have access to view Complaints
                    </Text>
                </View>
            </View>
        );
    }



    return (
        <>
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={modalMessage}
                type={modalType}
            />
            {loading && <Loader />}
            <View style={styles.container}>
                {/* 
      <View style={styles.headerRow}>
  {complaintsList?.length === 0 && (
    <>
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={LeftArrow}
          style={{ width: 20, height: 20, marginRight: 12 }}
        />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Complaints</Text>
      </View>
    </>
  )}
</View> */}

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={BackIcon} style={styles.backArrow} />
                    </TouchableOpacity>

                    {!searchOpen ? (
                        <>
                            <Text style={styles.headerTitle}>Requests</Text>



                            {complaintsList?.length > 0 && (
                                <TouchableOpacity
                                    style={styles.searchBtn}
                                    onPress={() => setSearchOpen(true)}
                                >
                                    <Image
                                        source={SearchIcon}
                                        style={styles.headerSearchIcon}
                                    />
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <View style={styles.searchWrapper}>
                            <TextInput
                                placeholder="Search Requests"
                                value={searchText}
                                onChangeText={(text) => {
                                    setSearchText(text);
                                    handleSearch(text);
                                }}
                                style={styles.searchInput}
                                placeholderTextColor="#9CA3AF"
                                autoFocus
                            />

                            <TouchableOpacity
                                onPress={handleClearSearch}
                            >
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>





                {/* {!loading && complaintsList && complaintsList?.length > 0 &&
      
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Image source={LeftArrow} style={{ width: 20, height: 20, marginRight: 6 }} />
  </TouchableOpacity>

  <View style={{ flex: 1 }}>
    <View style={styles.searchBox}>
      <Image
       source={SearchIcon}
        style={styles.searchIcon}
      />

      <TextInput
        placeholder="Search Complaints"
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
        editable={false}
          selectTextOnFocus={false}
  pointerEvents="none"
      />
    </View>
  </View>
</View>
        } */}

                {!loading && complaintsList && complaintsList?.length > 0 && (
                    <FlatList

                        data={requestData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        // data={complaintsList}
                        // keyExtractor={(item) => item.complaintId.toString()}
                        // renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 200 }}
                        // onScroll={handleScroll}
                        scrollEventThrottle={16}
                    />)}

                {!loading && complaintsList && complaintsList?.length === 0 && (
                    <View style={styles.centerContainer}>
                        <Image source={EmptyState} style={styles.image} />
                        <Text style={styles.nodataText}>Complaints from tenants will appear here.</Text>
                        {/* <TouchableOpacity style={[
              styles.addcomplaintBtn,
              !canWriteComplaints && { opacity: 0.6 }
            ]}
              disabled={!canWriteComplaints} onPress={handleAddComplaint}>
              <Text style={styles.addComplaintText}>+ Add Complaint</Text>
            </TouchableOpacity> */}


                    </View>
                )}

                {/* {!loading && complaintsList && complaintsList?.length > 0 &&
          <>

            <TouchableOpacity style={[
              styles.filterBtn,
              !canReadComplaints && { opacity: 0.4 }
            ]} disabled={!canReadComplaints} onPress={() => setShowFilter(true)}>
              <Image
                source={FilterIcon}
                style={{ width: 25, height: 25 }}
              />

            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.addBtn,
                !canWriteComplaints && { opacity: 0.5 }
              ]}
              disabled={!canWriteComplaints}
              onPress={handleAddComplaint}
            >
              <Image source={AddComplaint} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          </>
        } */}


<BedRequestSheet
          visible={bedSheetVisible}
          onClose={() => setBedSheetVisible(false)}
          complaint={selectedComplaint}
          onOpenAssignSheet={() => setShowAssignSheet(true)}
          onOpenCommentSheet={(complaint) => {
            setSelectedComplaint(complaint);
            setShowCommentSheet(true);
          }}
          onOpenStatusSheet={(complaint) => {
            setSelectedComplaint(complaint);
            setShowStatusSheet(true);
          }}
        />

        <AmenityRequestSheet
          visible={amenitySheetVisible}
          onClose={() => setAmenitySheetVisible(false)}
          complaint={selectedComplaint}
          onOpenAssignSheet={() => setShowAssignSheet(true)}
          onOpenCommentSheet={(complaint) => {
            setSelectedComplaint(complaint);
            setShowCommentSheet(true);
          }}
          onOpenStatusSheet={(complaint) => {
            setSelectedComplaint(complaint);
            setShowStatusSheet(true);
          }}
        />


                {/* <ComplaintDetails
          visible={showSheet}
          onClose={() => setShowSheet(false)}
          complaint={selectedComplaint}
          onOpenAssignSheet={() => setShowAssignSheet(true)}
          onOpenCommentSheet={(complaint) => {
            setSelectedComplaint(complaint);
            setShowCommentSheet(true);
          }}
          onOpenStatusSheet={(complaint) => {
            setSelectedComplaint(complaint);
            setShowStatusSheet(true);
          }}
        /> */}

                {/* <AssignBottomSheet
          visible={showAssignSheet}
          onClose={() => setShowAssignSheet(false)}
          complaint={selectedComplaint}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onAssignDone={() => {
            setShowAssignSheet(false);

            setTimeout(() => {
              setShowSheet(true);
            }, 150);
          }}
        /> */}

                {/* <CommentBottomSheet
          visible={showCommentSheet}
          onClose={() => setShowCommentSheet(false)}
          complaint={selectedComplaint}
        /> */}

                {/* <ChangeStatus
          visible={showStatusSheet}
          onClose={() => setShowStatusSheet(false)}
          complaint={selectedComplaint}
        /> */}

                {showFilter && (
                    <>
                        <TouchableOpacity
                            style={styles.filterOverlay}
                            activeOpacity={1}
                            onPress={() => closeFilterSheet()}
                        />

                        <Animated.View
                            {...filterPan.panHandlers}
                            style={[
                                styles.filterSheet,
                                { transform: [{ translateY: filterTranslateY }] },
                            ]}
                        >
                            <View style={styles.filterHandle} />

                            <View style={styles.filterHeader}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Image
                                        source={FilterIcon}
                                        style={{ width: 25, height: 25, marginRight: 8 }}
                                    />
                                    <Text style={styles.filterTitle}>Filter by</Text>
                                </View>
                            </View>

                            <Text style={styles.label}>Status</Text>
                            <View style={{ position: "relative" }}>
                                <TouchableOpacity
                                    style={styles.dropdownBox}
                                    onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                                >
                                    <Text style={styles.dropdownText}>{status}</Text>
                                    <Text style={styles.arrow}>⌄</Text>
                                </TouchableOpacity>

                                {showStatusDropdown && (
                                    <View style={styles.dropdownMenu}>
                                        <ScrollView nestedScrollEnabled={true}>
                                            {["All", "Active", "In-Active", "Checked Out", "Notice"].map(
                                                (v) => (
                                                    <TouchableOpacity
                                                        key={v}
                                                        style={styles.dropdownItem}
                                                        onPress={() => {
                                                            setStatus(v);
                                                            setShowStatusDropdown(false);
                                                        }}
                                                    >
                                                        <Text style={styles.dropdownItemText}>{v}</Text>
                                                    </TouchableOpacity>
                                                )
                                            )}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            <View style={{ height: 100 }} />

                            {/* Bottom Buttons */}
                            <View style={styles.bottomButtons}>
                                <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                                    <Text style={styles.resetText}>Reset All</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.applyBtn}>
                                    <Text style={styles.applyText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </>
                )}


            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 60
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        // paddingHorizontal: 5,
        marginBottom: 10,
    },

    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    backArrow: { width: 22, height: 22 },

    headerTitle: {
        flex: 1,
        fontSize: 22,
        color: "#111827",
        fontFamily: "Gilroy-Semibold",
    },

    searchBtn: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    headerSearchIcon: {
        width: 24,
        height: 24,
    },

    searchWrapper: {
        flex: 1,
        height: 46,
        borderWidth: 1,
        borderColor: "#DDE3F0",
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginLeft: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },

    closeIcon: {
        fontSize: 20,
        color: "#6B7280",
        fontWeight: "600",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    //   headerTitle: {
    //     fontSize: 22,
    //     fontFamily: "Gilroy-Bold",
    //     color: "#111827",
    //   },

    headerFilterIcon: {
        width: 22,
        height: 22,
        tintColor: "#111827",
    },


    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 30,
        paddingHorizontal: 14,
        height: 44,
    },

    searchIcon: { width: 20, height: 20, tintColor: "#9B9B9B", marginRight: 10 },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#000",
        fontFamily: "Gilroy-Regular",
        paddingVertical: 0,
        ...(Platform.OS === "ios" && {
            height: 40,
        }),
    },
    // searchInput: { flex: 1, fontSize: 15, color: "#000", fontFamily: "Gilroy-Regular" },

    card: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
        flexDirection: "row",
        justifyContent: "space-between",
    },

    title: { fontSize: 16, fontFamily: "Gilroy-Semibold" },
    row: { flexDirection: "row", alignItems: "center", marginTop: 5 },
    userIcon: { width: 20, height: 20, marginRight: 6 },
    user: { color: "#4B4B4B", fontFamily: "Gilroy-Medium", fontSize: 14 },

    rightSection: { alignItems: "flex-end", justifyContent: "space-between" },
    time: { fontSize: 10, color: "#9C9C9C", fontFamily: "Gilroy-Regular" },
    status: { marginTop: 6, fontSize: 14, fontFamily: "Gilroy-Semibold" },

    filterBtn: {
        position: "absolute",
        bottom: 150,
        right: 30,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 30,
        elevation: 5,
    },

    addBtn: {
        position: "absolute",
        bottom: 80,
        right: 30,
        backgroundColor: "#1D5DFF",
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },

    plus: { fontSize: 30, color: "#fff", marginTop: -3 },


    filterOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },

    filterSheet: {
        backgroundColor: "#fff",
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },


    filterHandle: {
        width: 60,
        height: 4,
        backgroundColor: "#ccc",
        alignSelf: "center",
        borderRadius: 50,
        marginBottom: 20,
    },

    filterHeader: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 20,
    },

    filterTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold"
    },

    label: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 6,
        marginTop: 10,
    },

    dropdownBox: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 12,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dropdownText: {
        color: "#111",
        fontSize: 15,
    },

    arrow: { fontSize: 18, color: "#555" },

    dateRow: { flexDirection: "row", marginTop: 10 },


    dateBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 14,
        borderRadius: 10,
        marginTop: 6,
        backgroundColor: "#fff",
    },



    quickRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,

    },

    quickBtn: {
        backgroundColor: "#F8F9FA",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 10,

    },

    quickText: { color: "#111", fontWeight: "500" },

    bottomButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25,
        marginBottom: 30
    },

    resetBtn: {
        backgroundColor: "#F2F3FF",
        paddingVertical: 12,
        borderRadius: 10,
        width: "48%",
        alignItems: "center",
    },

    resetText: {
        color: "#2D6CDF",
        fontWeight: "600",
    },

    applyBtn: {
        backgroundColor: "#2D6CDF",
        paddingVertical: 12,
        borderRadius: 10,
        width: "48%",
        alignItems: "center",
    },

    applyText: {
        color: "#fff",
        fontWeight: "600",
    },

    dropdownMenu: {
        position: "absolute",
        top: 52,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        elevation: 7,
        zIndex: 9999,
        maxHeight: 150,
        overflow: "hidden",
    },
    menuBackdrop: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 9999
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },

    dropdownItemText: {
        fontSize: 14,
        color: "#111",
    },
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 120,
    },

    image: {
        width: 250,
        height: 180,
        resizeMode: "contain",
        opacity: 0.9,
    },

    nodataText: {
        fontSize: 16,
        color: "#777",
        marginTop: 10,
    },

    addcomplaintBtn: {
        marginTop: 20,
        backgroundColor: "#1E45E1",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 12,
    },

    addComplaintText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 6,
    },

    initialCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },

    initialText: {
        fontSize: 12,
        fontFamily: "Gilroy-Bold",
        color: "#4B5563",
    },


    requestCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#ECECEC",
    },

    leftContent: {
        flex: 1,
    },

    requestTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Semibold",
        color: "#202020",
    },

    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },

    requestId: {
        fontSize: 14,
        color: "#7C7C7C",
        fontFamily: "Gilroy-Medium",
        marginRight: 10,
    },

    customerName: {
        fontSize: 15,
        color: "#444",
        fontFamily: "Gilroy-Medium",
        marginLeft: 8,
    },

    rightContent: {
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: 55,
    },

    dateText: {
        fontSize: 13,
        color: "#8A8A8A",
        marginTop: 10,
        fontFamily: "Gilroy-Regular",
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },

    statusText: {
        fontSize: 13,
        color: "#333",
        fontFamily: "Gilroy-Medium",
    },

    avatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#E6E6E6",
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        fontSize: 11,
        fontFamily: "Gilroy-Semibold",
        color: "#555",
    },

    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },

});
