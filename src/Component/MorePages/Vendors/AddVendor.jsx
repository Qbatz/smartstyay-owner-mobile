import React, { useRef, useState ,useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,BackHandler
} from "react-native";


import ProfilePlaceholder from "../../../Assets/Images/userAdd.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import {launchImageLibrary} from 'react-native-image-picker';


export default function AddVendorSheet({onClose, vendorData }) {
  const translateY = useRef(new Animated.Value(0)).current;

    const [selectedImage, setSelectedImage] = useState(null);
   
  
      useEffect(() => {
        const backAction = () => {
          onClose();   
          return true;
        };
      
        const handler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
      
        return () => handler.remove();
      }, [onClose]);
  
  
 const pickImage = () => {
  let options = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.7,
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log("Cancelled");
    } else if (response.errorMessage) {
      console.log("Error:", response.errorMessage);
    } else {
      setSelectedImage(response.assets[0]);   // store full object
    }
  });
};


   const [open, setOpen] = useState(false);
   const [value, setValue] = useState(null);

    //  const vendors = ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4", "Vendor 5"];
       const [vendorOpen, setVendorOpen] = useState(false);
       const [vendorSelected, setVendorSelected] = useState("Select a Vendor");
const vendors = [
  { label: "Andhra Pradesh", value: "Andhra Pradesh" },
  { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
  { label: "Assam", value: "Assam" },
  { label: "Bihar", value: "Bihar" },
  { label: "Chhattisgarh", value: "Chhattisgarh" },
  { label: "Goa", value: "Goa" },
  { label: "Gujarat", value: "Gujarat" },
  { label: "Haryana", value: "Haryana" },
  { label: "Himachal Pradesh", value: "Himachal Pradesh" },
  { label: "Jharkhand", value: "Jharkhand" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Kerala", value: "Kerala" },
  { label: "Madhya Pradesh", value: "Madhya Pradesh" },
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Manipur", value: "Manipur" },
  { label: "Meghalaya", value: "Meghalaya" },
  { label: "Mizoram", value: "Mizoram" },
  { label: "Nagaland", value: "Nagaland" },
  { label: "Odisha", value: "Odisha" },
  { label: "Punjab", value: "Punjab" },
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Sikkim", value: "Sikkim" },
  { label: "Tamil Nadu", value: "Tamil Nadu" },
  { label: "Telangana", value: "Telangana" },
  { label: "Tripura", value: "Tripura" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh" },
  { label: "Uttarakhand", value: "Uttarakhand" },
  { label: "West Bengal", value: "West Bengal" },
];

 
  
 const SCREEN_HEIGHT = Dimensions.get("window").height;

const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 8,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > SCREEN_HEIGHT * 0.20) {
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          onClose();   // ← correct place
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  })
).current;




  

  return (
    <View style={styles.overlay}>
    <TouchableWithoutFeedback
  onPress={() => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  }}
>

        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

     <Animated.View
  {...panResponder.panHandlers}
  style={[styles.sheet, { transform: [{ translateY }] }]}
>
        <View style={styles.handle} />

       <ScrollView
   showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    scrollEnabled={!vendorOpen}
                    nestedScrollEnabled={true}  // ⭐ important
>

          <Text style={styles.title}>
           {vendorData ? "Update Vendor" : "Add Vendor"}
            </Text>

       
     
<View style={styles.profileRow}>
  <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
    <View style={styles.profileCircle}>

     
      <Image
        source={selectedImage ? { uri: selectedImage.uri } : ProfilePlaceholder}
        style={styles.profileImg}
      />

      {/* Edit Icon Over Image */}
      <View style={styles.editBadge}>
        <Image
          source={require("../../../Assets/Images/edit.png")}
          style={styles.editIcon}
        />
      </View>

    </View>
  </TouchableOpacity>

  <View style={{ marginLeft: 14 }}>
    <Text style={styles.profileTitle}>Profile Photo</Text>
    <Text style={styles.profileSub}>
      Add Profile Image of Vendor / Business.{"\n"}Max size 2MB
    </Text>
  </View>
</View>



          {/* Form Fields */}
          <Text style={styles.label}>First Name *</Text>
          <TextInput style={styles.input} placeholder="Enter First name" />

          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} placeholder="Enter last Name" />

          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput style={styles.input} placeholder="+91" keyboardType="numeric" />

          <Text style={styles.label}>Email ID</Text>
          <TextInput style={styles.input} placeholder="Enter Email" />

          <Text style={styles.label}>Business Name *</Text>
          <TextInput style={styles.input} placeholder="Enter Business Name" />

          <Text style={styles.label}>Flat, House No., Building...</Text>
          <TextInput style={styles.input} placeholder="Enter Street" />

          <Text style={styles.label}>Landmark</Text>
          <TextInput style={styles.input} placeholder="Eg: Near SBI Bank" />

          <Text style={styles.label}>Town/City *</Text>
          <TextInput style={styles.input} placeholder="Enter City" />

          <Text style={styles.label}>Pincode *</Text>
          <TextInput style={styles.input} placeholder="Enter Pincode" keyboardType="numeric" />

          {/* <Text style={styles.label}>State *</Text>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>Select State</Text>
            <Image source={DownArrow} style={styles.arrow} />
          </TouchableOpacity> */}
{/* <View style={{ zIndex: 2000, elevation: 2000 }}>
  <Text style={styles.label}>State *</Text>

  <DropDownPicker
    open={open}
    value={value}
    items={items}
    setOpen={setOpen}
    setValue={setValue}
    setItems={setItems}
    
    placeholder="Select State"
    listMode="SCROLLVIEW"
    
    scrollViewProps={{
      nestedScrollEnabled: true,
    }}

    style={{
      borderColor: "#DDD",
      height: 48,
      borderRadius: 12,
      zIndex: 2000,
    }}

    dropDownContainerStyle={{
      borderColor: "#DDD",
      maxHeight: 250,  
      elevation: 20,
      zIndex: 3000,
      overflow: 'auto',
      height:250
    }}
  />
</View> */}

<Text style={styles.label}>Vendor name</Text>

                  <View style={{ position: "relative" }}>
    <TouchableOpacity
        style={styles.select}
        onPress={() => setVendorOpen(!vendorOpen)}
        activeOpacity={0.9}
    >
        <Text style={styles.selectText}>
            {vendorSelected || "Select a Vendor"}
        </Text>
        <Image source={DownArrow} style={styles.arrow} />
    </TouchableOpacity>

    {vendorOpen && (
        <View style={styles.dropdownMenu}>
            <ScrollView style={{ maxHeight: 160 }}>
                {vendors.map((v, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.option}
                        onPress={() => {
                            setVendorSelected(v.label);   
                            setVendorOpen(false);
                        }}
                    >
                        <Text style={styles.optionText}>{v.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )}
</View>






          <Text style={styles.label}>Country *</Text>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>Enter Country</Text>
            <Image source={DownArrow} style={styles.arrow} />
          </TouchableOpacity>

          {/* Footer Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>Add Vendor</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  handle: {
    width: 80,
    height: 5,
    backgroundColor: "#CFCFCF",
    alignSelf: "center",
    borderRadius: 20,
    marginBottom: 15,
  },

  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },

 profileRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 6,
},

profileContainer: {
  justifyContent: "center",
  alignItems: "center",
},

 
   profileCircle: {
        width: 75,
        height: 75,
        borderRadius: 75 / 2,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },


profileIcon: {
  width: 70,
  height: 70,
  borderRadius: 35,
  resizeMode: "cover",
},

plusBadge: {
  position: "absolute",
  bottom: 2,
  right: 2,
  width: 22,
  height: 22,
  borderRadius: 11,
 
  borderWidth: 1,
  borderColor: "#D6D6D6",
  justifyContent: "center",
  alignItems: "center",
},

plusText: {
  fontSize: 16,
  fontWeight: "700",
  color: "#000",
},

profileTitle: {
  fontSize: 14,
  fontWeight: "700",
  color: "#000",
},

profileSub: {
  fontSize: 12,
  color: "#777",
  marginTop: 4,
  lineHeight: 16,
},


  profileImg: { width: 60, height: 60, borderRadius: 30 ,backgroundColor:"#737373",},
 

  profileText: { fontSize: 14, fontWeight: "700" },
  subText: { color: "#777", fontSize: 12, lineHeight: 16, marginTop: 4 },

  label: { marginTop: 18, marginBottom: 6, fontSize: 14, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },

  selectBox: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { color: "#444" },
  arrow: { width: 18, height: 18, tintColor: "#444" },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
 sheet: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: "88%",
    },


  cancel: { color: "#777", fontSize: 16 },
  addBtn: {
    backgroundColor: "#4662FF",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  profileCircle: {
  width: 70,
  height: 70,
  borderRadius: 35,
  backgroundColor: "#E6E6E6",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
},

profileImg: {
  width: "100%",
  height: "100%",
  borderRadius: 35,
},

editBadge: {
  position: "absolute",
  width: 32,
  height: 32,
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  top: "50%",
  left: "50%",
  transform: [{ translateX: -16 }, { translateY: -16 }],
  elevation: 0
},


editIcon: {
  width: 20,
  height: 20,
 
},
  input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        paddingHorizontal: 12,
    },

    select: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
     dropdownMenu: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        zIndex: 999,
        elevation: 10,
    },

    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    optionText: {
        fontSize: 15,
        color: "#000",
    },


});
