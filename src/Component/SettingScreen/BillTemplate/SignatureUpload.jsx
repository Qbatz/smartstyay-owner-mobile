import React, { useRef, useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import { launchImageLibrary } from "react-native-image-picker";
import { CommonContexts } from "../../../Context/CommonContext";
import { BillContext } from "../../../Context/BillsContext";
import SuccessModal from "../../../ToastFile/ToastPage"


export default function SignatureUpload({ route, navigation }) {
  const ref = useRef();

  const templateId = route.params?.templateId;
  const [signature, setSignature] = useState(route.params?.signature || null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { deleteTemplateImage } = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [message, setmessage] = useState("")
    const [errorType, setErrorType] = useState("")

//   useEffect(()=> {
//     if(!signature){
//         setIsDeleted(true)
//     }
//   },[signature])

  /* ---------------- DRAW SIGNATURE ---------------- */

  console.log("signature", signature);
  console.log("signature", isDeleted);
  
// const handleOK = (sig) => {
//   console.log("SIGNATURE BASE64:", sig);

//   setSignature(sig);
//   setIsDeleted(false);

//   if (isSubmitting) {
//     setIsSubmitting(false);

//     setTimeout(() => {
//       submitFinal(sig); 
//     }, 0);
//   }
// };

const handleOK = (sig) => {
  console.log("SIGNATURE BASE64:", sig);

  if (!sig || sig === "data:,") {
    return; // empty signature
  }

  setSignature(sig);

  // 🔥 directly submit
  submitFinal(sig);
};

  /* ---------------- UPLOAD IMAGE ---------------- */
//   const handleUpload = () => {
//     launchImageLibrary({ mediaType: "photo" }, (res) => {
//       if (!res.didCancel) {
//         setSignature(res.assets[0].uri);
//         setIsDeleted(false);
//       }
//     });
//   };


  const handleUpload = () => {
  launchImageLibrary({ mediaType: "photo" }, (res) => {
    if (!res.didCancel) {
      ref.current?.clearSignature()
      setSignature(res.assets[0].uri);
      setIsDeleted(false);
    }
  });
};

  /* ---------------- DELETE ---------------- */
  const handleDeleteSignature = async () => {
    if (signature && !signature.startsWith("data:image")) {
      const res = await deleteTemplateImage({
        hostelId: activeHostelId,
        templateId,
        type: "signature",
      });

      if (res.success) {
         setShowSuccessModal(true),
          setmessage("Signature deleted Successfully"),
          setErrorType("success")

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 1000);
        setSignature(null);
        setIsDeleted(true);
      }
    } else {
         setShowSuccessModal(true),
          setmessage("Signature deleted Successfully"),
          setErrorType("success")

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 1000);
      setSignature(null);
      setIsDeleted(true);
    }
  };

  /* ---------------- FINAL SUBMIT ---------------- */
const submitFinal = (sig) => {
  const finalSignature = sig ? sig : null; // 🔥 only based on value

  route.params?.onGoBack({
    signature: finalSignature,
  });

  navigation.goBack();
};

// const handleSubmit = () => {
//   if (!signature && ref.current && !isDeleted) {
//     setIsSubmitting(true);
//     ref.current.readSignature();
//     return;
//   }

//   submitFinal(signature); 
// };

const handleSubmit = () => {
  if (!signature && ref.current) {
    ref.current.readSignature();
    return;
  }

  submitFinal(signature);
};
  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
            <SuccessModal visible={showSuccessModal} message={message} type={errorType} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Signature</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Please draw your signature as per the valid Documents
      </Text>

      {/* SIGNATURE BOX */}
      <View style={styles.signatureContainer}>

        {/* Canvas */}
        {/* <SignatureScreen
          ref={ref}
          onOK={handleOK}
          onEmpty={() => {}}
          descriptionText=""
          webStyle={`
            .m-signature-pad--footer {display: none;}
            .m-signature-pad {box-shadow: none; border: none;}
          `}
        /> */}

        {!signature && (
  <SignatureScreen
    ref={ref}
    onOK={handleOK}
    onEmpty={() => {}}
    descriptionText=""
    webStyle={`
      .m-signature-pad--footer {display: none;}
      .m-signature-pad {box-shadow: none; border: none;}
    `}
  />
)}

        {/* Overlay Image */}
        {signature && (
          <View style={styles.overlay}>
            <Image source={{ uri: signature }} style={styles.signatureImage} />
          </View>
        )}

        {/* Remove Button */}
        {/* {signature && (
          <TouchableOpacity style={styles.removeBtn} onPress={handleDeleteSignature}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )} */}

        {signature !== null && signature !== "" && (
  <TouchableOpacity style={styles.removeBtn} onPress={handleDeleteSignature}>
    <Text style={styles.removeText}>Remove</Text>
  </TouchableOpacity>
)}
      </View>

      {/* Upload */}
      <TouchableOpacity onPress={handleUpload}>
        <Text style={styles.uploadText}>
          Choose file <Text style={styles.uploadSub}>to Upload image</Text>
        </Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop:50
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 8,
  },

  signatureContainer: {
    height: "70%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
    position: "relative",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
  },

  signatureImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFEAEA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  removeText: {
    color: "red",
    fontSize: 12,
    fontWeight: "600",
  },

  uploadText: {
    color: "#3562FF",
    marginTop: 12,
    fontSize: 13,
  },

  uploadSub: {
    color: "#999",
  },

  submitBtn: {
    backgroundColor: "#3562FF",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});