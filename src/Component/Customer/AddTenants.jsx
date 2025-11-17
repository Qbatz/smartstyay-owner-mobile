import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  BackHandler, // ✅ import this
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; 
import ArrowLeft from "../../Assets/Images/profile.png";
import Profile from "../../Assets/Images/profile.png";

export default function AddTenant() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);

 useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (step === 2) {
          setStep(1);
          return true;
        } else if (navigation.canGoBack()) {
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
    }, [navigation, step])
  );
 
  const [basicDetails, setBasicDetails] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
  });

  const [addressDetails, setAddressDetails] = useState({
    flat: "",
    area: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  });

  const isBasicValid =
    basicDetails.firstName.trim() !== "" && basicDetails.mobile.trim() !== "";

  const isAddressValid =
    addressDetails.flat.trim() !== "" &&
    addressDetails.pincode.trim() !== "" &&
    addressDetails.city.trim() !== "" &&
    addressDetails.state.trim() !== "";

  // ---------------- UI ----------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Tenant</Text>
        </View>

        {/* STEPPER */}
        <View style={styles.stepContainer}>
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                step === 1 && { backgroundColor: "#2D6CDF" },
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  step === 1 && { color: "#fff" },
                ]}
              >
                1
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                step === 1 && { color: "#2D6CDF", fontWeight: "600" },
              ]}
            >
              Basic Details
            </Text>
          </View>

          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                step === 2 && { backgroundColor: "#2D6CDF" },
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  step === 2 && { color: "#fff" },
                ]}
              >
                2
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                step === 2 && { color: "#2D6CDF", fontWeight: "600" },
              ]}
            >
              Address Details
            </Text>
          </View>
        </View>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <View style={styles.profileSection}>
              <Image source={Profile} style={styles.profileImage} />
              <View>
                <Text style={styles.profileTitle}>Profile Photo</Text>
                <Text style={styles.profileSub}>
                  Add Profile Image of Vendor/Business. Max size 2 MB.
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter First Name"
                value={basicDetails.firstName}
                onChangeText={(t) =>
                  setBasicDetails({ ...basicDetails, firstName: t })
                }
              />

              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 00000 00000"
                keyboardType="phone-pad"
                value={basicDetails.mobile}
                onChangeText={(t) =>
                  setBasicDetails({ ...basicDetails, mobile: t })
                }
              />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryText}>Save Info</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  !isBasicValid && { backgroundColor: "#C7D2FE" },
                ]}
                disabled={!isBasicValid}
                onPress={() => setStep(2)}
              >
                <Text style={styles.primaryText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <View style={styles.form}>
              <Text style={styles.label}>Flat, House no., Building *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Flat, House no., Building..."
                value={addressDetails.flat}
                onChangeText={(t) =>
                  setAddressDetails({ ...addressDetails, flat: t })
                }
              />

              <Text style={styles.label}>Pincode *</Text>
              <TextInput
                style={styles.input}
                placeholder="000 000"
                keyboardType="numeric"
                value={addressDetails.pincode}
                onChangeText={(t) =>
                  setAddressDetails({ ...addressDetails, pincode: t })
                }
              />

              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your City Name"
                value={addressDetails.city}
                onChangeText={(t) =>
                  setAddressDetails({ ...addressDetails, city: t })
                }
              />

              <Text style={styles.label}>State *</Text>
              <TextInput
                style={styles.input}
                placeholder="Select State"
                value={addressDetails.state}
                onChangeText={(t) =>
                  setAddressDetails({ ...addressDetails, state: t })
                }
              />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setStep(1)}
              >
                <Text style={styles.secondaryText}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  !isAddressValid && { backgroundColor: "#C7D2FE" },
                ]}
                disabled={!isAddressValid}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.primaryText}>Create Tenant</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// styles same as before...


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#2D6CDF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  stepNumber: {
    fontSize: 13,
    color: "#2D6CDF",
    fontWeight: "600",
  },
  stepLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  profileTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  profileSub: {
    fontSize: 11,
    color: "#6B7280",
    width: 220,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#111827",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  primaryBtn: {
    backgroundColor: "#2D6CDF",
    borderRadius: 8,
    paddingVertical: 12,
    width: "48%",
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 12,
    width: "48%",
    alignItems: "center",
  },
  secondaryText: {
    color: "#2D6CDF",
    fontWeight: "600",
    fontSize: 15,
  },
});
