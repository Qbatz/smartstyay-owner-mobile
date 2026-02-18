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
  Modal
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import Dots from "../../../Assets/Images/3dots.png";
import Sms from "../../../Assets/Images/sms.png";
import Call from "../../../Assets/Images/call.png";
import Buildings from "../../../Assets/Images/buildings.png";
import Edit from "../../../Assets/Images/editIcon.png";
import Delete from "../../../Assets/Images/trash.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import ChangePasswordSheet from './ChangePasswordSheet';
import { useFocusEffect } from '@react-navigation/native';
import { useGeneral } from "../../../Context/GeneralContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import { ExpensesContext } from "../../../Context/ExpensesContext";
import ThreeDots from "../../../Assets/Images/3dots.png";


export default function GeneralDetailsScreen({ navigation }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const { deleteGeneral, getAdminList } = useGeneral();
  const { profileDetails } = useContext(ExpensesContext);
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
  const [activeMenuProfile,setActiveMenuProfile]=useState(null)

  const [activeTab, setActiveTab] = useState("Masters");

  const tabs = ["Masters", "Your Activity", "Users Activity", "Managed Users"];


  const {
    canWriteModule: canWriteProfile,
    canReadModule: canReadProfile,
    canUpdateModule: canUpdateProfile,
    canDeleteModule: canDeleteProfile,
  } = useHasPermission("Profile");

  console.log(profileDetails)

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showPasswordSheet) {
          setShowPasswordSheet(false);
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
    }, [showPasswordSheet, navigation])
  );

  useFocusEffect(
    useCallback(() => {
      loadAdmins();
    }, [])
  );



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
    setDeleteId(userId);
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
    setShowDeletePopup(false)

    await loadAdmins();

    setTimeout(() => {
      setShowSuccessModal(false);
      setShowDeletePopup(false);
    }, 1500);
  };


  const renderUserCard = (u, index) => (

    <View key={u.userId} style={styles.card}>
      <View style={styles.cardHeader}>
        {u.profilePic ? <Image
          source={{ uri: u.profilePic }}
          style={styles.profileImage}
        /> :
          <View style={[styles.profileImage, { backgroundColor: "#EFF2FF", alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 14, fontWeight: 600 }}>{u.initials}</Text>
          </View>}


        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{u.firstName} {u.lastName}</Text>

          <TouchableOpacity onPress={() => {
            setSelectedUserId(u.userId);
            setShowPasswordSheet(true);
          }}>
            <Text style={styles.changePassword}>{u.roleName}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            const screenWidth = Dimensions.get("window").width;

            setPopupPos({
              top: pageY + 6,
              right: screenWidth - pageX,
            });

            setSelectedUser(u);
            setActiveMenu(u.userId);
          }}
        >
          <Image source={Dots} style={styles.dotsIcon} />
        </TouchableOpacity>

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
    </View>
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
                  <Text>No Profile</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}

            />
          </View>
        );

      case "Your Activity":
        return (
          <View>
            <Text>Your Activity Content Here</Text>
          </View>
        );

      case "Users Activity":
        return (
          <View>
            <Text>Users Activity Content Here</Text>
          </View>
        );

      default:
        return null;
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={ArrowLeft} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>General</Text>

            {profileDetails && (
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
                <Text style={styles.masterText}>+ Master</Text>
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
          <View style={styles.cards}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                {profileDetails?.profileImage ? (
                  <Image
                    source={{ uri: profileDetails.profileImage }}
                    style={styles.profileImg}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {getInitials(profileDetails)}
                  </Text>
                )}
              </View>

              <View style={{ flex: 1, marginLeft: 7 }}>
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
              </View>

              <TouchableOpacity
                ref={DotsTopRef}
                onPress={() => {
                  DotsTopRef.current.measureInWindow(
                    (x, y, width, height) => {
                      setPopupPo({
                        top: y + height + 6,
                        right: SCREEN_WIDTH - (x + width),
                      });
                    }
                  );
                  setActiveMenuProfile("box");
                }}
              >
                <Image
                  source={ThreeDots}
                  style={styles.dotsIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Image
                source={require("../../../Assets/Images/call.png")}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                +91 {profileDetails?.mobileNo || "N/A"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Image
                source={require("../../../Assets/Images/sms.png")}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                {profileDetails?.mailId || "N/A"}
              </Text>
            </View>


          </View>

          {canReadProfile && (
            <View style={{ flex: 1, marginTop: 8 }}>
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
              <TouchableOpacity
                style={styles.menuOverlay}
                onPress={() => setActiveMenuProfile(null)}
              >
                <View style={[styles.menuBox, { top: popupPo.top, right: popupPo.right }]}>
      
                  {/* EDIT */}
                  <TouchableOpacity
                    // style={styles.menuRow}
                    style={[styles.menuRow, !canUpdateProfile && { opacity: 0.4 },]}
                    disabled={!canUpdateProfile}
                    onPress={() => {
                      console.log(activeMenu + " EDIT");
                      setActiveMenuProfile(null);
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
                    onPress={() => {
                      console.log(activeMenu + " DELETE");
                      setActiveMenuProfile(null);
                    }}
                  >
                    <Image
                      source={Delete}
                      style={[styles.menuIcon, { tintColor: "red" }]}
                    />
                    <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
                  </TouchableOpacity>
      
                </View>
              </TouchableOpacity>
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
              <Image source={Edit} style={styles.menuIcon} />
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
    </>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 50 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },

  backIcon: { width: 20, height: 20, tintColor: "#000" },

  headerTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },

  masterButton: {
    backgroundColor: "#4466F2",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  masterText: { color: "#FFF", fontWeight: "600" },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 20,
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

  userName: { fontSize: 17, fontWeight: "600", color: "#000" },

  changePassword: {
    color: "#4D77FF",
    fontSize: 13,
    marginTop: 2,
  },

  dotsIcon: { width: 18, height: 18 },

  section: { marginTop: 10 },

  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#666" },

  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },

  infoIcon: { width: 18, height: 18, marginRight: 8 },

  infoText: { fontSize: 14, color: "#333", flex: 1 },
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
    fontWeight: "600",
    color: "#000",
  },
  popupOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25
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
    fontWeight: "700",
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
    fontWeight: "600"
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
    fontWeight: "700"
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
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
    fontWeight: "600",
    color: "#777",
  },

  // -----
  cards: {
    backgroundColor: "#fff",
    padding: 18,
    marginHorizontal: 10,
    borderRadius: 14,
    elevation: 2,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    position: "relative",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },

  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 25,
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
    fontWeight: "700",
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
    tintColor: "#2F80ED",
  },

  changePwdText: {
    color: "#2F80ED",
    fontSize: 13,
    fontWeight: "500",
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

    tintColor: "#2F80ED",
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
    fontWeight: "600",
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
    fontWeight: "600",
  },
  tabText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  activeText: {
    color: "#2962FF", // blue like screenshot
    fontWeight: "600",
  },


});
