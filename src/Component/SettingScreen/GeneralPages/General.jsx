import React, { useState, useCallback, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  BackHandler,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  PanResponder,
  Keyboard,
  Platform
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import Dots from "../../../Assets/Images/3dots.png";
import Sms from "../../../Assets/Images/sms.png";
import Call from "../../../Assets/Images/call.png";
import Buildings from "../../../Assets/Images/buildings.png";
import Edit from "../../../Assets/Images/editIcon.png";
import ChangePasswordIcon from "../../../Assets/Images/password-check.png";
import Delete from "../../../Assets/Images/trash.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import ChangePasswordSheet from './ChangePasswordSheet';
import MastersDetails from './MastersDetails'
import { useFocusEffect } from '@react-navigation/native';
import { useGeneral } from "../../../Context/GeneralContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import { ExpensesContext } from "../../../Context/ExpensesContext";
import ThreeDots from "../../../Assets/Images/3dots.png";
import AvatarType from "../../../Assets/Images/Avatar type.png"
import { CommonContexts } from "../../../Context/CommonContext";
import { UseSetting } from "../../../Context/SettingContext";
import NoResultFound from "../../../Assets/Images/NoResultFound.png"
import SheildIcon from "../../../Assets/Images/SheildIcon.png"
import Phone from "../../../Assets/Images/call.png";
import EmailIcon from "../../../Assets/Images/gmail.png";
import MaximizeIcon from "../../../Assets/Images/maximize.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import Trash from "../../../Assets/Images/trash.png";
import AddUserBottomSheet from "../Users/AddUser";
import EditProfileSheet from "../GeneralPages/EditProfileSheet"
import LogoutIcon from "../../../Assets/Images/Logout.png"
import EmailLinkIcon from "../../../Assets/Images/maximize.png"
import { removeData, storeData } from "../../../Utils/Storage";
import { LoginContexts } from "../../../Context/LoginContext";
import { ACCESS_TOKEN, ACTIVEHOSTELID, LOGGEDIN, PROFILEDETAILS, USER_ID } from "../../../Utils/Constant";
import YellowCrownIcon from "../../../Assets/Images/YellowCrownAdmin.png"
import CrownIcon from "../../../Assets/Images/crown.png"
import AdminResetPasswordSheet from "./AdminResetPasswordSheet"
import { PGContext } from "../../../Context/PGContext";
import LinearGradient from "react-native-linear-gradient";
import AddCircleIcon from "../../../Assets/Images/blue_circle.png"




export default function GeneralDetailsScreen({ navigation }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [showMasterDetails,setMasterDetails]=useState(false);
  const { deleteGeneral, getAdminList } = useGeneral();
  const { profileDetails, GetProfileDetails } = useContext(ExpensesContext);
  const [getData, setGetData] = useState([])
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const DotsTopRef = useRef(null);
  const [popupPos, setPopupPos] = useState({ top: 0, right: 0 });
  const [popupPo, setPopupPo] = useState({ top: 0, right: 0 });
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMenuProfile, setActiveMenuProfile] = useState(null)
  const { activeHostelId,setActiveHostelId } = useContext(CommonContexts);
  const { getUsersByHostel, deleteUser } = UseSetting();
  const [users, setUsers] = useState([])
  const [openMenuId, setOpenMenuId] = useState(null);
  const [managedUserBottomShet, setManagedUserBottomsheet] = useState(false)
  const [selectedManageUser, setSelectedManageUser] = useState()
  const [showAddSheet, setShowAddSheet] = React.useState(false);
  const [editData, setEditData] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [editProfileBottomSheet, setEditProfileSheet] = useState(false)
  const [showResetSheet,setShowResetSheet] = useState(false);
  const [selectedMasterDetail,setSelectedMasterDetail]=useState("")

  const loginContext = useContext(LoginContexts)
  const {setPgDetails}=useContext(PGContext)

  const { logout } = useContext(LoginContexts)

  console.log(users)

  const translateY = useRef(new Animated.Value(500)).current;

  const [activeTab, setActiveTab] = useState("Masters");
  const SCREEN_HEIGHT = Dimensions.get("window").height;


  const tabs = ["Masters", "Your Activity", "Users Activity", "Managed Users"];

  const yourActivity = [{ title: "Created new user", description: 'created new user on the jan', time: '12clck', date: '12 jan' },
  { title: "Added new user", description: 'created booking user on the Bo0001', time: '11clck', date: '12 jan' }]


  const {
    canWriteModule: canWriteProfile,
    canReadModule: canReadProfile,
    canUpdateModule: canUpdateProfile,
    canDeleteModule: canDeleteProfile,
  } = useHasPermission("Profile");
  console.log(canWriteProfile,canReadProfile,canUpdateProfile,)

  console.log(profileDetails)

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showPasswordSheet) {
          setShowPasswordSheet(false);
          return true;
        }

         if (showResetSheet) {
          setShowResetSheet(false);
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
    }, [showPasswordSheet, navigation , showResetSheet])
  );

  useFocusEffect(
    useCallback(() => {
      loadAdmins();
    }, [])
  );

  useEffect(() => {
    if (!activeHostelId) return;

    loadUsers();
  }, [activeHostelId]);



  const onClose = () => {
    setOpenMenuId(null)
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setManagedUserBottomsheet(false);

    });
  };

  useEffect(() => {
    if (!managedUserBottomShet) {
      setOpenMenuId(null);
    }
  }, [managedUserBottomShet]);


  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 60,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  // 🔥 Open / Close animation
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: managedUserBottomShet ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [managedUserBottomShet]);

  // 🔥 Swipe down close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) onClose();
        else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;






  const loadAdmins = async () => {
    const data = await getAdminList();
    console.log("data", data);
    setGetData(data)
  };
  const [deleteId, setDeleteId] = useState("")
  console.log("loadAdmins", getData)

  const handleDelete = (userId) => {
    console.log("Delete ID:", userId);
    setShowDeletePopup(true);

    setActiveMenu(null);
    setDeleteId(userId || selectedUserId);
  };
  const handleDeleteAdmin = async () => {
    const res = await deleteGeneral(deleteId);

    if (!res.success) {
      alert(res.data?.message || "Delete failed");
      return;
    }


    setModalMessage("Deleted Successfully");
    setModalType("success");
    setShowSuccessModal(true);
    setShowDeletePopup(false);
    

    await loadAdmins();

    setTimeout(() => {
      setShowSuccessModal(false);
      setShowDeletePopup(false);
      setMasterDetails(false)
    }, 1500);
  };



  const loadUsers = async () => {
    const res = await getUsersByHostel(activeHostelId);
    console.log(res)


    if (res.success) {
      setUsers(res.data);
    }
  };

  const {
    canWriteModule: canWriteUser,
    canReadModule: canReadUser,
    canUpdateModule: canUpdateUser,
    canDeleteModule: canDeleteUser,
  } = useHasPermission("User");

  const handleDeleteManagerUser = (userId) => {
    setDeletePopup(true)
    setOpenMenuId(null)
    setDeleteUserId(userId)
  }

  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;

    const res = await deleteUser(deleteUserId);
    if (res.success) {


      setModalType("success");
      setModalMessage(res.data);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false)
        setDeletePopup(false);
        setDeleteUserId(null);
        loadUsers();
      }, 800);
    } else {
      setModalType("error");
      setModalMessage(res?.message || "Failed to delete user");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1200);
    }
  };



  const renderUserCard = (u, index) => (

    <TouchableOpacity key={u.userId} style={styles.card} onPress={()=>{
      setMasterDetails(true)
      setSelectedMasterDetail(u)
      setSelectedUserId(u?.userId)}}>
      <View style={styles.cardHeader}>
        {u.profilePic ? <Image
          source={{ uri: u.profilePic }}
          style={styles.profileImage}
        /> :
          <View style={[styles.profileImage, { backgroundColor: "#EFF2FF", alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 14, fontFamily: "Gilroy-Semibold"}}>{u.initials}</Text>
          </View>}


        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{u.firstName} {u.lastName}</Text>

          <TouchableOpacity onPress={() => {
            setSelectedUserId(u.userId);
            setShowPasswordSheet(true);
          }} >
            <Text style={styles.changePassword}>{u.roleName}</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
          onPress={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            const screenWidth = Dimensions.get("window").width;

            setPopupPos({
              top: pageY + 5,
              right: screenWidth - pageX,
            });

            setSelectedUser(u);
            setActiveMenu(u.userId);
          }}
        >
          <Image source={Dots} style={styles.dotsIcon} />
        </TouchableOpacity> */}

      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Details</Text>

        <View style={styles.infoRow}>
          <Image source={Sms} style={styles.infoIcon} />
          <Text style={styles.infoText}>{u.mailId}</Text>
        </View>

        <View style={styles.infoRow}>
          <Image source={Call} style={styles.infoIcon} />
          <Text style={styles.infoText}>{"+91 " + u.mobileNo}</Text>
        </View>

        <View style={styles.infoRow}>
          <Image source={Buildings} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            {u.houseNo}, {u.street}, {u.city} - {u.pincode}
          </Text>
        </View>
      </View> */}

      {/* {activeMenu === u.userId && (
        <View style={styles.menuBox}>
          <TouchableOpacity
            // style={styles.menuRow}
            style={[styles.menuRow, !canWriteProfile && { opacity: 0.4 },]}
            disabled={!canWriteProfile}
            onPress={() => {
              setSelectedUserId(u.userId);
              setShowPasswordSheet(true);
              setActiveMenu(null);
            }}

          >
            <Image source={Edit} style={styles.menuIcon} />
            <Text style={styles.menuText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // style={styles.menuRow}
            style={[styles.menuRow, !canUpdateProfile && { opacity: 0.4 },]}
            disabled={!canUpdateProfile}
            onPress={() => {
              setActiveMenu(null);
              navigation.navigate("AddGeneralScreen", { editData: u });
            }}
          >
            <Image source={Edit} style={styles.menuIcon} />
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuRow, !canDeleteProfile && { opacity: 0.4 },]}
            disabled={!canDeleteProfile}
            onPress={() => handleDelete(u.userId)}>
            <Image source={Delete} style={[styles.menuIcon, { tintColor: "red" }]} />
            <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </TouchableOpacity>
  );

  const getFullName = (profile) => {
    if (!profile) return "";

    const first = profile.firstName?.trim() || "";
    const last = profile.lastName?.trim() || "";

    return `${first} ${last}`.trim(); // "Emima"
  };

  const getInitials = (profile) => {
    if (profile?.initial) return profile.initial;

    const first = profile?.firstName?.[0] || "";
    const last = profile?.lastName?.[0] || "";

    return (first + last).toUpperCase();
  };

  const renderItem = ({ item, index }) => {
    console.log(item)
    const isLast = index === yourActivity.length - 1;
    // const config = STATUS[item?.status];



    return (
      <View style={{ flexDirection: 'row', marginBottom: 24 }}>
        <View style={{ width: 40, alignItems: 'center' }}>
          <View style={[styles.circle,]}>
            <Image source={AvatarType} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
          </View>
          {!isLast && <View style={{ flex: 1, width: 2, backgroundColor: '#E5E7EB', marginTop: 4, }} />}
        </View>

        <View style={{ flex: 1, backgroundColor: '#fff', paddingLeft: 12, }}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold"}}>{item.title}</Text>
          <Text style={{ fontSize: 14, fontWeight: 400, lineHeight: 20, marginTop: 10 }}>{item?.description}</Text>
          <Text style={{ fontSize: 12, fontWeight: 400, color: '#475569', marginTop: 10 }}>
            Added at {item?.date}, {item?.time}</Text>

        </View>
      </View>
    );
  };

  const renderManagedUser = ({ item, index }) => {
    { console.log(item) }
    return (
      <View style={styles.Managedcard}>

        {/* Top row */}
        <TouchableOpacity onPressIn={() => {
          setManagedUserBottomsheet(true)
          setSelectedManageUser(item)
        }
        }
          style={{ flexDirection: "row", marginBottom: 10, padding: 16, }}>

          {item?.profilePic ? <Image source={{ uri: item?.profilePic }} style={{ width: 50, height: 50, borderRadius: 25, resizeMode: 'contain' }} />
            : <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F7FF', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold"}}>
                {(item.firstName?.charAt(0).toUpperCase() || "") + (item.lastName?.charAt(0).toUpperCase() || "")}
              </Text>
            </View>
          }

          <View style={{ paddingLeft: 10 }}>
            <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>{item.firstName} {item.lastName}</Text>
            <View style={{ padding: 5, backgroundColor: '#F0F7FF', flexDirection: 'row', alignItems: 'center', borderRadius: 5, marginTop: 5 }}>
              <Image source={SheildIcon} style={{ width: 12, height: 12, resizeMode: 'contain' }} />
              <Text style={{ color: '#3A90E5', fontSize: 12, fontWeight: 400, marginLeft: 4 }}>
                {item.roleName}</Text>

            </View>

          </View>

          {/* <TouchableOpacity  onPress={() => setOpenMenuId(openMenuId === index ? null : index)}>
                      <Image source={Dots} style={styles.menuIcon} />
                    </TouchableOpacity> */}



        </TouchableOpacity>
        {/* {openMenuId === i && (
                    <>
                      <TouchableWithoutFeedback onPress={() => setOpenMenuId(null)}>
                        <View style={styles.fullOverlay} />
                      </TouchableWithoutFeedback>
                      <View style={styles.dropdownBox}>
                        <TouchableOpacity 
                        // style={styles.optionRow}
                        style={[styles.optionRow, !canUpdateUser && { opacity: 0.4 },]}
                        disabled={!canUpdateUser}
                        onPress={() => {
                          setEditData(u);
                          setShowAddSheet(true);
                          setOpenMenuId(null);
                        }}>
                          <Image
                            source={EditIcon}
                            style={styles.optionIcon}
                          />
                          <Text style={styles.optionText}>Edit</Text>
                        </TouchableOpacity>
    
                        <View style={styles.divider} />
    
                        <TouchableOpacity 
                        style={[styles.optionRow, !canDeleteUser && { opacity: 0.4 },]}
                        disabled={!canDeleteUser}
                        onPress={() => handleDelete(u.userId)}>
                          <Image
                            source={Trash}
                            style={}
                          />
                          <Text >Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )} */}


        {/* <View>
          <View style={{ width: "50%" }}>
            <Text >Email ID</Text>
            <Text >{item.mailId}</Text>
          </View>

          <View>
            <Text>Contact Number</Text>
            <Text >{item.mobileNo}</Text>
          </View>
        </View> */}

      </View>
    )

  }

  const renderContent = () => {
    switch (activeTab) {

      case "Masters":
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={getData} style={{ marginTop: 18, marginHorizontal: 10 }}
              contentContainerStyle={{ paddingBottom: 65 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => renderUserCard(item, index)}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Image source={NoResultFound} style={{ width: 200, height: 180, resizeMode: 'contain' }} />
                  <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold"}}>No Profile</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}

            />

             <TouchableOpacity
                style={[
                  styles.masterButton,
                  !canWriteProfile && { opacity: 0.4 },
                ]}
                disabled={!canWriteProfile}
                onPress={() =>
                  navigation.navigate("AddGeneralScreen")
                }
              >
                <Image source={AddCircleIcon} style={{width:20,height:20,marginRight:3}}/>
                <Text style={styles.masterText}> Master</Text>
              </TouchableOpacity>
          </View>
        );

      case "Your Activity":
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={!yourActivity} style={{ marginTop: 18, marginHorizontal: 10 }}
              contentContainerStyle={{ paddingBottom: 65 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Image source={NoResultFound} style={{ width: 200, height: 180, resizeMode: 'contain' }} />
                  <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold"}}>No Profile</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}

            />
          </View>

        );

      case "Users Activity":
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={!yourActivity} style={{ marginTop: 18, marginHorizontal: 10 }}
              contentContainerStyle={{ paddingBottom: 65 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Image source={NoResultFound} style={{ width: 200, height: 180, resizeMode: 'contain' }} />
                  <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold"}}>No Profile</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}

            />
          </View>
        );

      case "Managed Users":
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={users} style={{ marginTop: 18, marginHorizontal: 10 }}
              contentContainerStyle={{ paddingBottom: 65 }}
              keyExtractor={(u, index) => index.toString()}
              renderItem={renderManagedUser}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Image source={NoResultFound} style={{ width: 200, height: 180, resizeMode: 'contain' }} />
                  <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold"}}>No Profile</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}

            />
          </View>
        );

      default:
        return null;
    }
  };

  const handleLogout = async () => {
    const res = await logout();
    console.log(res)

    if (res?.status == 200) {
      await Promise.all([
        removeData(ACCESS_TOKEN),
        storeData(LOGGEDIN, "false"),
        removeData(USER_ID),
        removeData(PROFILEDETAILS),
        removeData(ACTIVEHOSTELID)
      ])

      

      loginContext.logoutf("false")
      setActiveHostelId(null)
      setPgDetails(null)

      loginContext.updateUserId("")

      setModalType("success");
      setModalMessage("Logout successfully");
      setShowSuccessModal(true);


      setTimeout(() => {
        setShowSuccessModal(false);

        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "LoginDesign" }],
        // });
      }, 1500);

    } else {
      setModalType("error");
      setModalMessage(res?.message || "Logout failed");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    }
  };





  return (
    <>
      <View style={{ flex: 1 }}>
        {activeMenu && (
          <View
            style={StyleSheet.absoluteFillObject}
            pointerEvents="box-none"
          >
            {/* This catches outside touches */}
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={() => setActiveMenu(null)}
            />
          </View>
        )}
        <SuccessModal
          visible={showSuccessModal}
          message={modalMessage}
          type={modalType}
          onClose={() => setShowSuccessModal(false)}
        />

        <View style={styles.container}>
          <LinearGradient 
          colors={["#E2E8FF", "#FFFFFF"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.8 }}
              style={{ paddingHorizontal: 16, paddingTop: 50,}}>
            
          

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}
              style={{backgroundColor:'#FFFFFF9E',width:35,height:35,borderRadius:10,
                      justifyContent:'center',alignItems:'center'}}>
              <Image source={ArrowLeft} style={styles.backIcon} />
            </TouchableOpacity>

            {/* <Text style={styles.headerTitle}>General</Text> */}

            {profileDetails && (
              // <TouchableOpacity
              //   style={[
              //     styles.masterButton,
              //     !canWriteProfile && { opacity: 0.4 },
              //   ]}
              //   disabled={!canWriteProfile}
              //   onPress={() =>
              //     navigation.navigate("AddGeneralScreen")
              //   }
              // >
              //   <Text style={styles.masterText}>+ Master</Text>
              // </TouchableOpacity>
               <TouchableOpacity style={{marginTop:3}}
                    ref={DotsTopRef}
                    onPress={() => {
                      DotsTopRef.current.measureInWindow(
                        (x, y, width, height) => {
                          setPopupPo({
                            top: y + height + 20,
                            right: SCREEN_WIDTH - (x + width),
                          });
                        }
                      );
                      setActiveMenuProfile("box");
                    }}
                  >
                    <Image
                      source={ThreeDots}
                      style={styles.menuDotsIcon}
                    />
                  </TouchableOpacity>
            )}
          </View>

          {!canReadProfile && (
            <View style={styles.emptyContainer}>
              <Image
                source={EmptyState}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>
                You do not have access to view General
              </Text>
            </View>
          )}

          {/* ----Main profile-- */}

          {canReadProfile && (
            <View style={styles.cards}>
              <View style={{  flexDirection: 'row',width:'100%'}}>
                <View style={{flex: 1, alignItems: 'center', paddingLeft: 10}}>
                  <View style={styles.avatar}>
                    {profileDetails?.profilePic ? (
                      <Image
                        source={{ uri: profileDetails.profilePic }}
                        style={styles.profileImg}
                      />
                    ) : (
                      <Text style={styles.avatarText}>
                        {getInitials(profileDetails)}
                      </Text>
                    )}
                    <Image source={YellowCrownIcon} style={{width:30,height:30,position:'absolute',top:-8,right:-5,}}/>
                  </View>

                 
                  <Text style={[styles.name,{marginTop:16}]}>
                    {getFullName(profileDetails)}
                  </Text>

                <View
                  style={[styles.changePwdRow,{marginTop:10,paddingHorizontal:4,backgroundColor:'#FFFAF1',borderRadius:4,paddingVertical:2}]}
                  // onPress={() => setShowPasswordSheet(true)}
                >
                  <Image
                    source={CrownIcon}
                    style={styles.eyeIcon}
                  />
                  <Text style={styles.changePwdText}>
                    {profileDetails.roleName}
                  </Text>
                </View>
                </View>

                {/* <View style={{ flex: 1, marginLeft: 7 }}>
                <View style={styles.nameWrapper}>
                  <Text style={styles.name}>
                    {getFullName(profileDetails)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.changePwdRow}
                  onPress={() => setShowPasswordSheet(true)}
                >
                  <Image
                    source={require("../../../Assets/Images/Eye.png")}
                    style={styles.eyeIcon}
                  />
                  <Text style={styles.changePwdText}>
                    {profileDetails.roleName}
                  </Text>
                </TouchableOpacity>
              </View> */}
            
                 
                </View>

                 
               {/* <View style={{borderWidth:0.8,marginTop:15,marginBottom:5,borderColor:'#E5E5E5'}}/>  */}
              

              <View style={styles.infoRow}>
                <Image
                  source={require("../../../Assets/Images/call.png")}
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoText,{fontFamily:'Gilroy-Semibold'}]}>
                  +91 {profileDetails?.mobileNo || "N/A"}
                </Text>
              </View>

              {/* <View style={styles.infoRow}>
                <Image
                  source={require("../../../Assets/Images/sms.png")}
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoText,{fontFamily:'Gilroy-Medium',}]}>
                  {profileDetails?.mailId || "N/A"}
                    <Image
                  source={EmailLinkIcon}
                  style={{    width: 14,
    height: 14,
    marginRight: 10,
    marginLeft:15,

    tintColor: "#222222",}}
                />
                </Text>
              
              </View> */}

              <View style={styles.infoRow}>
  <Image
    source={require("../../../Assets/Images/sms.png")}
    style={styles.infoIcon}
  />

  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
    <Text style={[styles.infoText, { fontFamily: "Gilroy-Medium" }]}>
      {profileDetails?.mailId || "N/A"}
    </Text>

    <Image
      source={EmailLinkIcon}
      style={{
        width: 14,
        height: 14,
        marginLeft: 8, // 👈 margin will work now
        tintColor: "#1E45E1",
      }}
    />
  </View>
</View>
{/* <Text style={styles.lastUpdatedText}>
  Profile last updated - 
  <Text style={{color:'#222222', fontFamily: "Gilroy-Semibold",}}>{profileDetails?.lastUpdated || "-"}</Text> 
</Text> */}

            </View>
          )}
          </LinearGradient>

          {canReadProfile && (
            <View style={{ flex: 1, marginTop: 8,marginHorizontal:14 }}>
              {/* Tabs */}
              <View style={{ backgroundColor: "#fff" }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                  }}
                >
                  {tabs.map((tab, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        setActiveTab(tab)
                      }
                      style={{
                        marginRight: 24,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === tab &&
                          styles.activeText,
                        ]}
                      >
                        {tab}
                      </Text>

                      {activeTab === tab && (
                        <View
                          style={{
                            marginTop: 6,
                            height: 2,
                            width: "100%",
                            backgroundColor:
                              "#2962FF",
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                {renderContent()}
              </View>
            </View>
          )}
        </View>


      </View>

      {activeMenuProfile && (
        <TouchableWithoutFeedback
          onPress={() => setActiveMenuProfile(null)}
        >
          <View style={styles.menuOverlay}>
            <View style={[styles.menuBox, { top: popupPo.top, right: popupPo.right }]}>

              {/* {ChangePassword} */}

              <TouchableOpacity
                // style={styles.menuRow}
                style={[styles.menuRow, !canUpdateProfile && { opacity: 0.4 },]}
                disabled={!canUpdateProfile}
                onPress={() => {
                  setActiveMenuProfile(null);
                  setShowResetSheet(true)
                }}
                // onPress={()=>setShowResetSheet(true)}
              >
                <Image source={ChangePasswordIcon} style={styles.menuIcon} />
                <Text style={styles.menuText}>Change Password</Text>
              </TouchableOpacity>

              {/* EDIT */}
              <TouchableOpacity
                // style={styles.menuRow}
                style={[styles.menuRow, !canUpdateProfile && { opacity: 0.4 },]}
                disabled={!canUpdateProfile}
                onPress={() => {
                  console.log(activeMenu + " EDIT");
                  setActiveMenuProfile(null);
                  // setEditProfileSheet(true)
                  navigation.navigate("EditProfileSheet",{profileDetails:profileDetails})
                }}
              >
                <Image source={Edit} style={styles.menuIcon} />
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity
                // style={styles.menuRow}
                style={[styles.menuRow, !canDeleteProfile && { opacity: 0.4 },]}
                disabled={!canDeleteProfile}
                onPress={
                  handleLogout
                  // console.log(activeMenu + " DELETE");
                  // setActiveMenuProfile(null);
                }
              >
                <Image
                  source={LogoutIcon}
                  style={[styles.menuIcon, { tintColor: "red" }]}
                />
                <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
              </TouchableOpacity>

            </View>

          </View>

        </TouchableWithoutFeedback>
      )}


      <Modal
        transparent
        visible={activeMenu !== null}
        animationType="fade"
        onRequestClose={() => setActiveMenu(null)}
      >
        {/* Outside touch */}
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setActiveMenu(null)}
        />

        {/* MENU */}
        {selectedUser && (
          <View
            style={[
              styles.menuBox,
              {
                top: popupPos.top,
                right: popupPos.right,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.menuRow, !canWriteProfile && { opacity: 0.4 }]}
              disabled={!canWriteProfile}
              onPress={() => {
                setSelectedUserId(selectedUser.userId);
                setShowPasswordSheet(true);
                setActiveMenu(null);
              }}
            >
              <Image source={ChangePasswordIcon} style={styles.menuIcon} />
              <Text style={styles.menuText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuRow, !canUpdateProfile && { opacity: 0.4 }]}
              disabled={!canUpdateProfile}
              onPress={() => {
                navigation.navigate("AddGeneralScreen", {
                  editData: selectedUser,
                });
                setActiveMenu(null);
              }}
            >
              <Image source={Edit} style={styles.menuIcon} />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuRow, !canDeleteProfile && { opacity: 0.4 }]}
              disabled={!canDeleteProfile}
              onPress={() => {
                handleDelete(selectedUser.userId);
                setActiveMenu(null);
              }}
            >
              <Image
                source={Delete}
                style={[styles.menuIcon, { tintColor: "red" }]}
              />
              <Text style={[styles.menuText, { color: "red" }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>



      {showDeletePopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>
              Delete Master?
            </Text>
            <Text style={styles.popupSubtitle}>
              Are you sure you want to delete this
              Master?
            </Text>

            <View style={styles.popupBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() =>
                  setShowDeletePopup(false)
                }
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDeleteAdmin}
              >
                <Text style={styles.deleteText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <ChangePasswordSheet
        visible={showPasswordSheet}
        onClose={() =>
          setShowPasswordSheet(false)
        }
        adminId={selectedUserId}
      />

      <MastersDetails
      visible={showMasterDetails}
      onClose={()=>setMasterDetails(false)}
      masterDetail={selectedMasterDetail}
      passwordSheetOpen={()=>setShowPasswordSheet(true)}
      deletemaster={handleDelete}/>

      {managedUserBottomShet && (
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[styles.sheet, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >

            <View style={styles.handle} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

              <View style={{ flexDirection: 'row' }}>

                {selectedManageUser.profilePic ? <Image source={{ uri: selectedManageUser.profilePic }} style={{ width: 55, height: 55, borderRadius: 27, resizeMode: 'contain' }} />
                  : <View style={{ width: 55, height: 55, borderRadius: 27, backgroundColor: '#F0F7FF', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold"}}>
                      {(selectedManageUser.firstName?.charAt(0).toUpperCase() || "") + (selectedManageUser.lastName?.charAt(0).toUpperCase() || "")}
                    </Text>
                  </View>}

                <View style={{ paddingLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>{selectedManageUser?.firstName} {selectedManageUser?.lastName}</Text>
                  <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center', borderRadius: 5, backgroundColor: '#F0F7FF', marginTop: 5 }}>
                    <Image source={SheildIcon} style={{ width: 10, height: 10 }} />
                    <Text style={{ fontSize: 13, fontWeight: 400, color: '#3A90E5', marginLeft: 4 }}>{selectedManageUser?.roleName}</Text>
                  </View>
                </View>
              </View>


              <TouchableOpacity onPress={() => setOpenMenuId(true)}>
                <Image source={Dots} style={{ width: 34, height: 34, resizeMode: 'contain' }} />
              </TouchableOpacity>

              {openMenuId && (
                <>
                  <TouchableWithoutFeedback onPress={() => setOpenMenuId(null)}>
                    <View style={styles.fullOverlay} />
                  </TouchableWithoutFeedback>
                  <View style={styles.dropdownBox}>
                    <TouchableOpacity
                      // style={styles.optionRow}
                      style={[styles.optionRow, !canUpdateUser && { opacity: 0.4 },]}
                      disabled={!canUpdateUser}
                      onPress={() => {
                        setEditData(selectedManageUser);
                        setShowAddSheet(true);
                        setManagedUserBottomsheet(false)
                        setOpenMenuId(null);
                      }}>
                      <Image
                        source={EditIcon}
                        style={styles.optionIcon}
                      />
                      <Text style={styles.optionText}>Edit</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                      style={[styles.optionRow, !canDeleteUser && { opacity: 0.4 },]}
                      disabled={!canDeleteUser}
                      onPress={() => handleDeleteManagerUser(selectedManageUser.userId)}>
                      <Image
                        source={Trash}
                        style={styles.optionIcon}
                      />
                      <Text >Delete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>

            <View style={{ flexDirection: 'row', paddingTop: 25, alignItems: 'center' }}>
              <Image source={Phone} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
              <Text style={{ fontSize: 16, fontWeight: 400, marginLeft: 5 }}>
                +91 {selectedManageUser?.mobileNo}</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingTop: 25, alignItems: 'center' }}>
              <Image source={EmailIcon} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
              <Text style={{ fontSize: 16, fontWeight: 400, marginLeft: 5, textDecorationLine: 'underline', color: '#1E45E1' }} >
                {selectedManageUser?.mailId || "N/A"}</Text>
              <Image source={MaximizeIcon} style={{ width: 15, height: 15, resizeMode: 'contain', marginLeft: 6 }} />
            </View>

            <Text style={{ fontSize: 14, fontWeight: 400, marginTop: 22 }}>Description</Text>

            <Text style={{ fontSize: 14, fontWeight: 400, color: '#4B4B4B', marginTop: 15 }}>
              {selectedManageUser?.description || "N/A"}</Text>

          </Animated.View>
        </View>
      )}

      <AddUserBottomSheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        editData={editData}
        onSuccess={loadUsers}
      />

      {/* <EditProfileSheet
        visible={editProfileBottomSheet}
        onClose={() => setEditProfileSheet(false)}
        profileData={profileDetails}
      /> */}

      <Modal
        transparent
        animationType="fade"
        visible={deletePopup}
        onRequestClose={() => setDeletePopup(false)}
      >
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteBox}>

            <Text style={styles.deleteTitle}>Delete User?</Text>
            <Text style={styles.deleteSub}>
              Are you sure you want to delete this User?
            </Text>

            <View style={styles.deleteBtnRow}>


              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeletePopup(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

      <AdminResetPasswordSheet
 visible={showResetSheet}
 onClose={()=>setShowResetSheet(false)}
/>
    </>
  );



}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,justifyContent:'space-between'
  },

  backIcon: { width: 20, height: 20, tintColor: "#000" },

  headerTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 10,
    fontSize: 20,
  fontFamily: "Gilroy-Semibold",
    color: "#000",
  },

  masterButton: {
    position:'absolute',
    borderWidth:1,
    backgroundColor: "#F2F5FA",
    borderColor:'#1E45E1',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 8,
    justifyContent:'flex-end',
    bottom:60,
    right:18,
    flexDirection:'row',alignItems:'center'
  },

  masterText: { color: "#1E45E1",fontFamily: "Gilroy-Semibold",fontSize:16 },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    position: "relative",
  },
  Managedcard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    // padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    position: "relative",
  },


  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 30,
    marginRight: 12,
  },

  userName: { fontSize: 17, fontFamily: "Gilroy-Semibold", color: "#000" },

  changePassword: {
    color: "#4D77FF",
    fontSize: 13,
    marginTop: 2,
  },

  // dotsIcon: { width: 18, height: 18 },
  menuDotsIcon:{width:23,height:28.59},

  section: { marginTop: 10 },

  sectionTitle: { fontSize: 14,fontFamily: "Gilroy-Semibold", color: "#666" },

  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },

  // infoIcon: { width: 18, height: 18, marginRight: 8,tintColor:'#7C7C7C' },

  
  menuOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
  },
  menuBox: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#fff",
    width: 170,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 8,
    zIndex: 999,
  },


  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  menuIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  menuText: {
    fontSize: 14,
    fontFamily: "Gilroy-Semibold",
    color: "#000",
  },
  popupOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,zIndex:9999
  },

  popupBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 10
  },

  popupTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    textAlign: "center",
    marginBottom: 8
  },

  popupSubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25
  },

  popupBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#1E45E1",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  cancelText: {
    color: "#1E45E1",
    fontSize: 16,
    fontFamily: "Gilroy-Semibold"
  },

  deleteBtn: {
    width: "48%",
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  deleteText: {
    color: "#fff",
    fontSize: 16,
  fontFamily: "Gilroy-Bold"
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 110,
  },

  emptyImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    opacity: 0.8
  },

  emptyText: {
    marginTop: 14,
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
    color: "#777",
  },

  // -----
  cards: {
    // backgroundColor: "#fff",
    // padding: 18,
    paddingBottom: 10, 
    marginHorizontal: 10,
    // borderRadius: 14,
    // elevation: 2,
    marginBottom: 12,marginTop:15,
    // borderWidth: 1,
    // borderColor: "#EEE",
    position: "relative",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    position:'relative'
  },

  avatarText: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#374151",
  },

  profileImg: {
    width: 95,
    height: 95,
    borderRadius: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  nameWrapper: {
    flex: 1,
    marginLeft: 4,
    paddingRight: 10,
  },

  name: {
    fontSize: 16,
    fontFamily:'Gilroy-Semibold',
    color: "#111",
    flexShrink: 1,
    flexWrap: "wrap",
  },


  changePwdRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  eyeIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: "#FF9900",
  },

  changePwdText: {
    color: "#FF9900",
    fontSize: 13,
    fontFamily:'Gilroy-Medium',
  },

  dotsIcon: {
    width: 20,
    height: 20,
    tintColor: "#444",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  infoIcon: {
    width: 18,
    height: 18,
    marginRight: 10,

    tintColor: "#7C7C7C",
  },

  infoText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    flex: 1,
  },

  addressTitle: {
    marginTop: 20,
    fontSize: 14,
   fontFamily: "Gilroy-Semibold",
    color: "#444",

  },

  changeBtn: {
    marginTop: 20,
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  swapIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
    marginRight: 6,
  },

  changeBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
  },
  tabText: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Gilroy-Medium" ,
  },
  activeText: {
    color: "#2962FF", // blue like screenshot
   fontFamily: "Gilroy-Semibold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    zIndex: 999,
    // maxHeight:'90%'
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 16,
  },
  dropdownBox: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#fff",
    paddingVertical: 6,
    width: 200,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 999,
  },
  fullOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionIcon: {
    width: 18,
    height: 18,
    marginRight: 10,

  },
  optionText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Gilroy-Medium" ,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },
  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBox: {
    width: '80%',
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
   fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Bold",
  },
lastUpdatedText: {
  position: "absolute",
  bottom: 10,
  right: 15,
  fontSize: 12,
  color: "#9CA3AF",
  fontFamily: "Gilroy-Semibold",
},
infoText: {
  fontSize: 14,
  color: "#333",
  lineHeight: 20,
  flexShrink: 1, // 👈 important
}

});
