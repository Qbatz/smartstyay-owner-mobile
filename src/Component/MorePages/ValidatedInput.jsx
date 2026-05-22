import React from "react";
import { TextInput } from "react-native";

const validationRules = {
  mobile: (text) => {
    let cleaned = text.replace(/[^0-9]/g, "");
    return cleaned.slice(0, 10);
  },

  pincode: (text) => {
    let cleaned = text.replace(/[^0-9]/g, "");
    return cleaned.slice(0, 6);
  },

  email: (text) => {
    let cleaned = text.replace(/[^a-zA-Z0-9@._-]/g, "");

    const parts = cleaned.split("@");
    if (parts.length > 2) {
      cleaned = parts[0] + "@" + parts[1];
    }

    cleaned = cleaned.replace(/\.{2,}/g, ".");

    return cleaned;
  },

    numberOnly: (text) => {
    return text.replace(/[^0-9]/g, "");
  },

  name: (text) => {
    return text.replace(/[^a-zA-Z\s]/g, "");
  },

  description: (text) => {
    return text;
  },
};

const keyboardTypes = {
  mobile: "numeric",
  pincode: "numeric",
  email: "email-address",
  numberOnly: "numeric",
  name: "default",
  description: "default",
};

const maxLengths = {
  mobile: 10,
  pincode: 6,
  numberOnly: 10,
};

const ValidatedInput = ({
  type = "text",
  inputType, 
  value,
  onChangeText,
  style,
  ...props
}) => {
  const handleChange = (text) => {
    const validator = validationRules[type];
    const validatedText = validator ? validator(text) : text;
    onChangeText(validatedText);
  };

  return (
    <TextInput
      {...props}
      style={style}
      value={value}
      keyboardType={keyboardTypes[type] || "default"}
      maxLength={maxLengths[type]}
      onChangeText={handleChange}
      inputMode={inputType} 
    />
  );
};

export default ValidatedInput;



{/* <ValidatedInput
  type="name"
  inputType="text"
  value={name}
  onChangeText={setName}
  placeholder="Enter Name"
/>

<ValidatedInput
  type="mobile"
  inputType="numeric"
  value={mobile}
  onChangeText={setMobile}
  placeholder="Enter Mobile"
/>

<ValidatedInput
  type="email"
  inputType="email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter Email"
/>

<ValidatedInput
  type="description"
  inputType="text"
  value={desc}
  onChangeText={setDesc}
  placeholder="Enter Description"
  multiline
/>

<ValidatedInput
  type="pincode"
  inputType="numeric"
  value={pincode}
  onChangeText={setPincode}
  placeholder="Enter Pincode"
/> */}