import React, { useState } from "react";
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
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import AddImageIcon from "../../../Assets/Images/blue_circle.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyProfileImage from "../../../Assets/Images/empty_pgprofile.png";
import EditIcon from  "../../../Assets/Images/editIcon.png" 
import DeleteIcon from  "../../../Assets/Images/trash.png"

export default function AddPG({ navigation }) {
  /* ====================== STATES ===================== */

  const [photo, setPhoto] = useState(null);

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [img3, setImg3] = useState(null);
  const [img4, setImg4] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");

  /* DROPDOWNS */
  const townList = ["Select Type", "Chennai", "Coimbatore", "Bengaluru"];
  const stateList = ["Select State", "Tamil Nadu", "Karnataka", "Kerala"];

  const [city, setCity] = useState("");
  const [state, setState] = useState("Select State");

  const [townOpen, setTownOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  // Close dropdowns when tapping outside
  const closeAll = () => {
    setTownOpen(false);
    setStateOpen(false);
  };

  /* ====================== IMAGE PICKER ===================== */

  const pickImage = async (setImage) => {
    const res = await launchImageLibrary({ mediaType: "photo", quality: 0.7 });
    if (res?.assets && res.assets.length) setImage(res.assets[0]);
  };

  const pickCamera = async (setImage) => {
    const res = await launchCamera({ mediaType: "photo", saveToPhotos: true });
    if (res?.assets && res.assets.length) setImage(res.assets[0]);
  };

  /* MODAL FOR PROFILE PICTURE */
  const [photoModal, setPhotoModal] = useState(false);
  const openPhotoPicker = () => setPhotoModal(true);

  /* ====================== RENDER DROPDOWN ===================== */

  const renderSelect = (label, selected, open, setOpen, list, onSelect) => (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Text style={styles.label}>{label.replace("*", "")}</Text>
        {label.includes("*") && <Text style={{ color: "red" }}>*</Text>}
      </View>

      <View style={{ position: "relative", marginBottom: 12 }}>
        <TouchableOpacity
          style={styles.select}
          onPress={() => {
            closeAll();
            setOpen(!open);
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.selectText}>{selected}</Text>
          <Text style={styles.caret}>⌄</Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdownMenu}>
            <ScrollView style={{ maxHeight: 160 }}>
              {list.map((v, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.option}
                  onPress={() => {
                    onSelect(v);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{v}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );

  /* ====================== SUBMIT ===================== */

  const handleSubmit = () => {
    console.log("SUBMIT DATA:", {
      firstName,
      mobile,
      email,
      houseNo,
      street,
      landmark,
      pincode,
      town,
      state,
      profilePhoto: photo,
      images: [img1, img2, img3, img4],
    });
  };

  /* ===================================================== */

  return (
    <TouchableWithoutFeedback onPress={closeAll}>
     
        
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.container}>

          {/* HEADER */}
        <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={ArrowLeft} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}> Add Paying Guest</Text>
            </View>

          
          <View style={{display:'flex',flexDirection:'row' , marginBottom:20}}>

        <TouchableOpacity
  style={styles.profileBox}
  onPress={openPhotoPicker}
  activeOpacity={0.9}
>
  {photo?.uri ? (
    <Image source={{ uri: photo.uri }} style={styles.profileImg} />
  ) : (
    <Image source={EmptyProfileImage} style={styles.profileImg} />
  )}

  {
    photo?.uri && (
        <View style={styles.editIcon}>
    <Image  source={EditIcon} style={{width: 20,
  height: 20,}}/>
  </View>
    )
  }
  
</TouchableOpacity>

             <View style={{display:'flex', flexDirection:'column', marginTop:30, marginLeft:20}}>
           <Text style={styles.sectionLabel}>Profile Photo</Text>
          <Text style={styles.sectionSub}>Add Profile Image of PG. </Text>
          <Text style={{fontSize:12 , color:'grey', marginTop:3}}>Max size 2 MB</Text>
          </View>
          </View>

          {/* PROFILE PHOTO MODAL */}
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

          {/* FORM FIELDS */}
          <InputField label="First Name *" value={firstName} onChangeText={setFirstName} placeholder="Enter First name" />
          <InputField label="Mobile Number *" value={mobile} onChangeText={setMobile} placeholder="98765 43210" keyboardType="phone-pad" />
          <InputField label="Email ID" value={email} onChangeText={setEmail} placeholder="Enter Mail id" />
          <InputField label="Flat / House No / Apartment" value={houseNo} onChangeText={setHouseNo} placeholder="Enter House No" />
          <InputField label="Area / Street" value={street} onChangeText={setStreet} placeholder="Enter Street" />
          <InputField label="Landmark" value={landmark} onChangeText={setLandmark} placeholder="Near SBI" />
          <InputField label="Pincode *" value={pincode} onChangeText={setPincode} placeholder="659 741" keyboardType="numeric" />
          <InputField label="Town/City *" value={city} onChangeText={setCity} placeholder="Enter City"  />
          {/* DROPDOWNS */}
          {/* {renderSelect("Town/City *", town, townOpen, setTownOpen, townList, setTown)} */}
          {renderSelect("State *", state, stateOpen, setStateOpen, stateList, setState)}

          {/* IMAGE UPLOAD ROW */}
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            {renderImageBox(img1, setImg1)}
            {renderImageBox(img2, setImg2)}
            {renderImageBox(img3, setImg3)}
            {renderImageBox(img4, setImg4)}
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Save</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
       
    </TouchableWithoutFeedback>
  );
}

/* ====================== IMAGE BOX RENDERER ===================== */

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
        activeOpacity={0.8}
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

      {/* DELETE ICON */}
      {image?.uri && (
        <TouchableOpacity
          onPress={() => setImage(null)}
          style={styles.deleteIcon}
        >
          <Image source={DeleteIcon} style={{height:16, width:16}}/>
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
 container: {   flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40, },



  header: { flexDirection: "row", alignItems: "center", marginTop:30 },
  backIcon: { width: 20, height: 20, marginRight: 10 },
  headerTitle: { fontSize: 17, fontWeight: "600" },
   headerTitle: { fontSize: 17, fontWeight: "600" },

  sectionLabel: { fontSize: 13, fontWeight: "700" },
  sectionSub: { fontSize: 12, color: "black", marginTop: 6 , fontWeight:400 },

  profileBox: {
    width: 86,
    height: 86,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 50,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  editIcon: {
  position: "absolute",
  height: 22,
  width: 22,
  borderRadius: 22,
  justifyContent: "center",
  alignItems: "center",

},


  plus: { fontSize: 32, color: "#2F80ED", fontWeight: "700" },
  profileImg: { width: 86, height: 86, borderRadius: 50 },

  /* DROPDOWN */
  label: { fontSize: 13, fontWeight: "600", color: "#111827" },
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectText: { fontSize: 14, color: "#222" },
  caret: { fontSize: 18, color: "#555" },

  dropdownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 50,
    elevation: 20,
  },
  option: { padding: 12 },
  optionText: { color: "#111", fontSize: 15 },

  /* IMAGE BOX */
  imgBox: {
    width: 86,
    height: 86,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E9F0",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },
  imgPlus: { height:24 , width:24 },
  imgSmall: { fontSize: 11, marginTop: 4, color:"#2D6CDF" , fontWeight:500},
  imgSize: { fontSize: 9, color: "#999", marginTop: 2 },
  thumb: { width: 84, height: 84, borderRadius: 12 },

  /* BUTTON */
  submitBtn: {
    marginTop: 18,
    backgroundColor: "#2D6CDF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  modalBox: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  modalBtn: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  modalText: { color: "#2F80ED", fontWeight: "700" },
  deleteIcon: {
  position: "absolute",
  top: -10,
  right: 3,
  backgroundColor: "#fff",
  height: 20,
  width: 20,
  borderRadius: 5,
  justifyContent: "center",
  alignItems: "center",
//   borderWidth: 1.5,
//   borderColor: "#fff",
  zIndex: 10,
},

});
