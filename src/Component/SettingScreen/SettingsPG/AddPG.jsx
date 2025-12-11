import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Modal,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { PGContext } from "../../../Context/PGContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { getHostels } from "../../../Action/HostelAction";
import AddImageIcon from "../../../Assets/Images/blue_circle.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyProfileImage from "../../../Assets/Images/empty_pgprofile.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import DeleteIcon from "../../../Assets/Images/trash.png";

export default function AddPG({ navigation, route }) {

  const isEdit = route?.params?.mode === "edit";
  const editData = route?.params?.data || null;

  const { addPG, editPG } = useContext(PGContext);
  const { hostelList , updateHostelList , setActiveHostelId , activeHostelId  } = useContext(CommonContexts);
  const login = useContext(LoginContexts);

  // Utility to convert image into file object for FormData
  const prepareImage = (img) => {
    if (!img?.uri) return null;
    return {
      uri: img.uri,
      type: img.type || "image/jpeg",
      name: img.fileName || `image_${Date.now()}.jpg`,
    };
  };

  const reorderHostels = (list, activeId) => {
  const selected = list.find(h => (h.hostelId ?? h.id) === activeId);
  const others = list.filter(h => (h.hostelId ?? h.id) !== activeId);
  return selected ? [selected, ...others] : list;
};


  // ---------------------------
  // FORM STATES
  // ---------------------------
  const [photo, setPhoto] = useState(
    editData?.mainImage ? { uri: editData.mainImage } : null
  );

  const [img1, setImg1] = useState(editData?.images?.[0] ? { uri: editData.images[0] } : null);
  const [img2, setImg2] = useState(editData?.images?.[1] ? { uri: editData.images[1] } : null);
  const [img3, setImg3] = useState(editData?.images?.[2] ? { uri: editData.images[2] } : null);
  const [img4, setImg4] = useState(editData?.images?.[3] ? { uri: editData.images[3] } : null);

  const [hostelName, setHostelName] = useState(editData?.name || "");
  const [mobile, setMobile] = useState(editData?.mobile || "");
  const [email, setEmail] = useState(editData?.emailId || "");
  const [houseNo, setHouseNo] = useState(editData?.houseNo || "");
  const [street, setStreet] = useState(editData?.street || "");
  const [landmark, setLandmark] = useState(editData?.landmark || "");
  const [pincode, setPincode] = useState(editData?.pincode?.toString() || "");
  const [city, setCity] = useState(editData?.city || "");
  const [state, setState] = useState(editData?.state || "Select State");

  const stateList = [
    "Select State",
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Daman and Diu",
    "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
  ];

  const [stateOpen, setStateOpen] = useState(false);
  const [errors, setErrors] = useState({});


  // ---------------------------
  // Android Back Button Override
  // ---------------------------
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const closeAll = () => {
    setStateOpen(false);
  };

  // ---------------------------
  // Image Picker
  // ---------------------------
  const pickImage = async (setImage) => {
    const res = await launchImageLibrary({ mediaType: "photo", quality: 0.7 });
    if (res?.assets?.length) setImage(res.assets[0]);
  };

  const pickCamera = async (setImage) => {
    const res = await launchCamera({ mediaType: "photo", saveToPhotos: true });
    if (res?.assets?.length) setImage(res.assets[0]);
  };

  const [photoModal, setPhotoModal] = useState(false);

  // ---------------------------
  // Handle SUBMIT
  // ---------------------------

  console.log("hostelid", editData?.hostelId);
  
const handleSubmit = async () => {
  let errors = {};

  if (!hostelName.trim()) errors.hostelName = "Please Enter PG Name";
  if (!mobile.trim()) errors.mobile = "Please Enter Mobile Number";
  if (!pincode.trim()) errors.pincode = "Please Enter Pincode";
  if (!city.trim()) errors.city = "Please Enter City";
  if (state === "Select State") errors.state = "Please Select State";

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }

  setErrors({});

  // JSON payload same as web admin
  const payload = {
    hostelName,
    mobile,
    emailId: email,
    houseNo,
    street,
    landmark,
    pincode: Number(pincode),
    city,
    state,
  };

  // Prepare File objects
  const formatFile = (img) =>
    img?.uri
      ? {
          uri: img.uri,
          type: img.type || "image/jpeg",
          name: img.fileName || `img_${Date.now()}.jpg`,
        }
      : null;

  const finalPayload = {
    payloads: payload,
    mainImage: formatFile(photo),
    additionalImages: [
      formatFile(img1),
      formatFile(img2),
      formatFile(img3),
      formatFile(img4),
    ].filter(Boolean),
    hostelId: editData?.hostelId,
  };

  console.log("FINAL PG PAYLOAD ===>", finalPayload);

  if (isEdit) {
    const res = await editPG(finalPayload);
    if (res?.status === 200 || res?.status === 201) {
        const fresh = await getHostels(login.getToken);
         console.log("updateddata", fresh);
     const reordered = reorderHostels(fresh.data, activeHostelId);
     updateHostelList(reordered);
      alert("PG Updated Successfully");
      navigation.goBack();
    } else {
      alert("Update Failed");
    }
    return;
  }

  const res = await addPG(finalPayload);
  if (res?.status === 201) {
    const fresh = await getHostels(login.getToken);
    console.log("updateddata", fresh);
     const reordered = reorderHostels(fresh.data, activeHostelId);
     updateHostelList(reordered);
    alert("PG Added Successfully");
    navigation.goBack();
  } else {
    alert("Add PG Failed");
  }
};




  // ---------------------------
  // RENDER UI
  // ---------------------------
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? "Edit Paying Guest" : "Add Paying Guest"}
        </Text>
      </View>

      <TouchableWithoutFeedback onPress={closeAll}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }}>
          <View style={styles.container}>

            {/* PROFILE PHOTO */}
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <TouchableOpacity style={styles.profileBox} onPress={() => setPhotoModal(true)}>
                {photo?.uri ? (
                  <Image source={{ uri: photo.uri }} style={styles.profileImg} />
                ) : (
                  <Image source={EmptyProfileImage} style={styles.profileImg} />
                )}

                {photo?.uri && (
                  <View style={styles.editIcon}>
                    <Image source={EditIcon} style={{ width: 20, height: 20 }} />
                  </View>
                )}
              </TouchableOpacity>

              <View style={{ marginTop: 30, marginLeft: 20 }}>
                <Text style={styles.sectionLabel}>Profile Photo</Text>
                <Text style={styles.sectionSub}>Add Profile Image of PG.</Text>
                <Text style={{ fontSize: 12, color: "grey", marginTop: 3 }}>Max size 2 MB</Text>
              </View>
            </View>

            {/* IMAGE PICKER MODAL */}
            <Modal visible={photoModal} transparent animationType="fade">
              <TouchableOpacity style={styles.modalOverlay} onPress={() => setPhotoModal(false)} />
              <View style={styles.modalBox}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => { setPhotoModal(false); pickCamera(setPhoto); }}>
                  <Text style={styles.modalText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtn} onPress={() => { setPhotoModal(false); pickImage(setPhoto); }}>
                  <Text style={styles.modalText}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#eee" }]} onPress={() => setPhotoModal(false)}>
                  <Text style={[styles.modalText, { color: "#111" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            {/* INPUT FIELDS */}
            <InputField label="First Name *" value={hostelName} onChangeText={setHostelName} placeholder="Enter First name" />
            <InputField label="Mobile Number *" value={mobile} onChangeText={setMobile} placeholder="98765 43210" keyboardType="phone-pad" />
            <InputField label="Email ID" value={email} onChangeText={setEmail} placeholder="Enter Mail id" />
            <InputField label="Flat / House No / Apartment" value={houseNo} onChangeText={setHouseNo} placeholder="Enter House No" />
            <InputField label="Area / Street" value={street} onChangeText={setStreet} placeholder="Enter Street" />
            <InputField label="Landmark" value={landmark} onChangeText={setLandmark} placeholder="Near SBI" />
            <InputField label="Pincode *" value={pincode} onChangeText={setPincode} placeholder="659 741" keyboardType="numeric" />
            <InputField label="Town/City *" value={city} onChangeText={setCity} placeholder="Enter City" />

            {/* STATE DROPDOWN */}
            {renderSelect(
              "State *",
              state,
              stateOpen,
              setStateOpen,
              stateList,
              setState
            )}

            {/* ADDITIONAL IMAGES */}
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              {renderImageBox(img1, setImg1)}
              {renderImageBox(img2, setImg2)}
              {renderImageBox(img3, setImg3)}
              {renderImageBox(img4, setImg4)}
            </View>

            {/* SUBMIT BUTTON */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>{isEdit ? "Update" : "Save"}</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

/* ====================== DROPDOWN SELECT FUNCTION ===================== */

function renderSelect(label, selected, open, setOpen, list, onSelect) {
  return (
    <>
      <View style={{ flexDirection: "row", marginBottom: 5 }}>
        <Text style={styles.label}>{label.replace("*", "")}</Text>
        {label.includes("*") && <Text style={{ color: "red" }}>*</Text>}
      </View>

      <View style={{ position: "relative", marginBottom: 12 }}>
        <TouchableOpacity
          style={styles.select}
          onPress={() => setOpen(!open)}
        >
          <Text style={styles.selectText}>{selected}</Text>
          <Text style={styles.caret}>⌄</Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdownMenu}>
            <ScrollView style={{ maxHeight: 250 }}>
              {list.map((v, i) => {
                const isSelected = selected === v;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.option, isSelected && { backgroundColor: "#E3EEFF" }]}
                    onPress={() => {
                      onSelect(v);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.optionText, isSelected && { color: "#2D6CDF", fontWeight: "700" }]}>
                      {v}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
}

/* ====================== IMAGE BOX ===================== */

function renderImageBox(image, setImage) {
  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        onPress={() =>
          launchImageLibrary({ mediaType: "photo" }).then((r) =>
            r?.assets?.length && setImage(r.assets[0])
          )
        }
        style={styles.imgBox}
      >
        {image?.uri ? (
          <Image source={{ uri: image.uri }} style={styles.thumb} />
        ) : (
          <>
            <Image source={AddImageIcon} style={styles.imgPlus} />
            <Text style={styles.imgSmall}>Add Image</Text>
            <Text style={styles.imgSize}>Max size 10 MB</Text>
          </>
        )}
      </TouchableOpacity>

      {image?.uri && (
        <TouchableOpacity onPress={() => setImage(null)} style={styles.deleteIcon}>
          <Image source={DeleteIcon} style={{ width: 16, height: 16 }} />
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ====================== INPUT FIELD ===================== */

function InputField({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", marginBottom: 6 }}>
        <Text style={styles.label}>{label.replace("*", "")}</Text>
        {label.includes("*") && <Text style={{ color: "red" }}>*</Text>}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A3A3A3"
        style={styles.input}
        keyboardType={keyboardType}
      />
    </View>
  );
}

/* ====================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 85,
  },

  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    zIndex: 200,
  },

  backIcon: { width: 20, height: 20, marginRight: 10 },
  headerTitle: { fontSize: 17, fontWeight: "600" },

  sectionLabel: { fontSize: 13, fontWeight: "700" },
  sectionSub: { fontSize: 12, color: "black", marginTop: 6 },

  profileBox: {
    width: 86,
    height: 86,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },

  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 3,
  },

  profileImg: { width: 86, height: 86, borderRadius: 50 },

  label: { fontSize: 13, fontWeight: "600" },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E6E9F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  select: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E6E9F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: { fontSize: 14 },

  caret: { fontSize: 18, color: "#666" },

  dropdownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 999,
  },

  option: { padding: 12 },
  optionText: { fontSize: 15 },

  imgBox: {
    width: 86,
    height: 86,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E9F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },
  imgPlus: { width: 24, height: 24 },
  imgSmall: { fontSize: 11, color: "#2D6CDF" },
  imgSize: { fontSize: 9, color: "#999" },
  thumb: { width: 84, height: 84, borderRadius: 12 },

  deleteIcon: {
    position: "absolute",
    top: -10,
    right: 3,
    backgroundColor: "#fff",
    padding: 3,
    borderRadius: 6,
  },

  submitBtn: {
    marginTop: 25,
    backgroundColor: "#2D6CDF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

