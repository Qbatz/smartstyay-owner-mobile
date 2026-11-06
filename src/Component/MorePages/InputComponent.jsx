
import React, { memo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from "react-native";

// ---------------- VALIDATION RULES ----------------

const validationRules = {
    mobile: (text) =>
        text.replace(/[^0-9]/g, "").slice(0, 10),

    pincode: (text) =>
        text.replace(/[^0-9]/g, "").slice(0, 6),

    email: (text) => {
        let cleaned = text.replace(/[^a-zA-Z0-9@._-]/g, "");

        const parts = cleaned.split("@");

        if (parts.length > 2) {
            cleaned = parts[0] + "@" + parts[1];
        }

        cleaned = cleaned.replace(/\.{2,}/g, ".");

        return cleaned;
    },

    numberOnly: (text) =>
        text.replace(/[^0-9]/g, ""),

    name: (text) =>
        text.replace(/[^a-zA-Z\s]/g, ""),

    description: (text) => text,

    alphaNumeric: (text) =>
        text.replace(/[^a-zA-Z0-9\s]/g, ""),

    gst: (text) =>
        text
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 15),

    pan: (text) =>
        text
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 10),
};

// ---------------- KEYBOARD TYPES ----------------

const keyboardTypes = {
    mobile: "numeric",
    pincode: "numeric",
    email: "email-address",
    numberOnly: "numeric",
    name: "default",
    description: "default",
    alphaNumeric: "default",
    gst: "default",
    pan: "default",
};

// ---------------- MAX LENGTH ----------------

const maxLengths = {
    mobile: 10,
    pincode: 6,
    numberOnly: 10,
};

// ---------------- REUSABLE INPUT ----------------

const InputComponent = ({
    label,
    type = "text",
    inputType,
    value = "",
    onChangeText,
    placeholder = "Enter value",

    error,
    disabled = false,
    required = false,

    maxLength,
    multiline = false,

    // NEW PROPS
    flex,
    width,
    autoGrow = false,
    inputHeight = 48,
    minInputHeight = 120,
    maxInputHeight = 220,

    leftIcon,
    rightIcon,
    onRightIconPress,

    containerStyle,
    inputStyle,
    style,

    onFocus,
    onBlur,

    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const [contentHeight, setContentHeight] = useState(minInputHeight);

    // ---------------- VALIDATION ----------------

    const handleChange = (text) => {
        const validator = validationRules[type];

        const validatedText = validator
            ? validator(text)
            : text;

        onChangeText?.(validatedText);
    };

    // ---------------- INPUT STATES ----------------

    //   const getBorderColor = () => {
    //     if (disabled) return "#EEEEEE";
    //     if (error) return "#FF3333";
    //     if (isFocused) return "#0085FF";

    //     return "#EAEAEA";
    //   };

    const getBorderColor = () => {
        if (disabled) return "#DEDEDE";
        if (error) return "#FF3333";
        if (isFocused) return "#0085FF";

        return "#DEDEDE";
    };

    const getBorderWidth = () => {
        if (isFocused || error) return 1.5;
        return 1;
    };

    const getBackgroundColor = () => {
        if (disabled) return "#F8F8F8";

        return "#FFFFFF";
    };

    return (
        <View
            style={[
                styles.wrapper,
                {
                    flex: flex,
                    width: width ?? (flex !== undefined ? undefined : "100%"),
                },
                containerStyle,
            ]}
        >

            {/* LABEL */}

            {label ? (
                <Text style={styles.label}>
                    {label}
                    {required && (
                        <Text style={styles.required}> *</Text>
                    )}
                </Text>
            ) : null}

            {/* INPUT CONTAINER */}

            <View
                style={[
                    styles.inputContainer,
                    style,
                    {
                        borderColor: getBorderColor(),
                        borderWidth: getBorderWidth(),
                        backgroundColor: getBackgroundColor(),

                        height: multiline
                            ? autoGrow
                                ? Math.min(
                                    maxInputHeight,
                                    Math.max(minInputHeight, contentHeight + 24)
                                )
                                : inputHeight
                            : inputHeight,
                    },
                ]}
            >

                {/* LEFT ICON */}

                {leftIcon && (
                    <View style={styles.iconContainer}>
                        {leftIcon}
                    </View>
                )}

                {/* TEXT INPUT */}

                <TextInput
                    {...props}
                    value={value == null ? "" : String(value)}
                    onChangeText={handleChange}
                    placeholder={placeholder}
                    placeholderTextColor="#A0A0A8"

                    keyboardType={keyboardTypes[type] || "default"}
                    inputMode={inputType}

                    maxLength={maxLength ?? maxLengths[type]}

                    secureTextEntry={isPassword && !showPassword}
                    editable={!disabled}
                    multiline={multiline}

                    scrollEnabled={
                        multiline && autoGrow && contentHeight >= maxInputHeight
                    }

                    onContentSizeChange={(event) => {
                        if (multiline && autoGrow) {
                            setContentHeight(
                                event.nativeEvent.contentSize.height
                            );
                        }
                    }}

                    onFocus={() => {
                        setIsFocused(true);
                        onFocus?.();
                    }}

                    onBlur={() => {
                        setIsFocused(false);
                        onBlur?.();
                    }}

                    style={[
                        styles.input,
                        multiline && styles.multiline,
                        disabled && styles.disabledText,
                        inputStyle,
                    ]}
                />

                {/* PASSWORD SHOW / HIDE */}

                {isPassword && (
                    <Pressable
                        onPress={() =>
                            setShowPassword(!showPassword)
                        }
                        hitSlop={10}
                        style={styles.iconContainer}
                    >
                        <Text style={styles.actionText}>
                            {showPassword ? "Hide" : "Show"}
                        </Text>
                    </Pressable>
                )}

                {/* RIGHT ICON */}

                {!isPassword && rightIcon && (
                    <Pressable
                        onPress={onRightIconPress}
                        disabled={!onRightIconPress}
                        style={styles.iconContainer}
                    >
                        {rightIcon}
                    </Pressable>
                )}

            </View>

            {/* ERROR MESSAGE */}

            {/* {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null} */}

        </View>
    );
};

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
wrapper: {
        width: "100%",
    },

    label: {
        fontSize: 13,
        color: "#55555F",
        marginBottom: 8,
        fontFamily: "Gilroy-Medium",
    },

    required: {
        color: "#FF3333",
    },

    inputContainer: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
    },

    input: {
        flex: 1,
        height: "100%",
        paddingVertical: 0,
        paddingHorizontal: 0,
        fontSize: 15,
        color: "#24242B",
        fontFamily: "Gilroy-Medium",
    },

    multiline: {
        textAlignVertical: "top",
        paddingVertical: 12,
        height: "100%",
    },

    disabledText: {
        color: "#BDBDC4",
    },

    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },

    actionText: {
        fontSize: 12,
        color: "#777780",
    },

    errorText: {
        fontSize: 12,
        color: "#FF3333",
        marginTop: 5,
        fontFamily: "Gilroy-Medium",
    },
});

export default memo(InputComponent)


// two input same row 
// <View style={styles.inputRow}>

//     <InputComponent
//         label="First Name"
//         type="name"
//         value={firstName}
//         onChangeText={setFirstName}
//         placeholder="Enter First Name"
//         flex={1}
//     />

//     <InputComponent
//         label="Last Name"
//         type="name"
//         value={lastName}
//         onChangeText={setLastName}
//         placeholder="Enter Last Name"
//         flex={1}
//     />

// </View>

// ==> 

//  inputRow: {
//         flexDirection: "row",
//         alignItems: "flex-start",
//         gap: 12,
//         width: "100%",
//     },


// set button ==> 

//     <InputComponent
//     label="Custom Rent Amount"
//     type="numberOnly"
//     value={customRent}
//     onChangeText={setCustomRent}
//     placeholder="Enter Rent Amount"

//     rightIcon={
//         <View style={styles.setButton}>
//             <Text style={styles.setButtonText}>
//                 ✓ Set
//             </Text>
//         </View>
//     }
//     onRightIconPress={handleSetRent}
// />


// set button style ==> 
//     setButton: {
//     backgroundColor: "#EAF0FF",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 12,
// },

// setButtonText: {
//     color: "#165DFF",
//     fontSize: 14,
//     fontFamily: "Gilroy-SemiBold",
// },



// description input 

{/* <InputComponent
    label="Description"
    type="description"
    value={description}
    onChangeText={setDescription}
    placeholder="Enter the description"
    multiline
    autoGrow
    minInputHeight={120}
    maxInputHeight={220}
/> */}

// ithu description ku fixed height vaikka style ==>   inputHeight={150}



// Same row – Input + Dropdown

{/* <View style={styles.inputRow}>

    <InputComponent
        label="Quantity"
        type="numberOnly"
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Enter Quantity"
        flex={1.1}
    />

    <View style={{ flex: 1 }}>
        <Text style={styles.label}>Unit</Text>

        <YourDropdown
            value={unit}
            onChange={setUnit}
            placeholder="Select Category"
        />
    </View>

</View> */}

// styles ==> 

// inputRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 12,
//     width: "100%",
// },



// flex={1}    // Equal width
// flex={1.5}  // More width
// flex={2}    // Double proportion
// width={150} // Fixed width






// // Name
// <ReusableInput
//   type="name"
//   value={name}
//   onChangeText={setName}
//   placeholder="Enter Name"
// />

// // Mobile
// <ReusableInput
//   type="mobile"
//   value={mobile}
//   onChangeText={setMobile}
//   placeholder="Enter Mobile"
// />

// // Email
// <ReusableInput
//   type="email"
//   value={email}
//   onChangeText={setEmail}
//   placeholder="Enter Email"
// />

// // Pincode
// <ReusableInput
//   type="pincode"
//   value={pincode}
//   onChangeText={setPincode}
//   placeholder="Enter Pincode"
// />

// // Number Only
// <ReusableInput
//   type="numberOnly"
//   value={amount}
//   onChangeText={setAmount}
//   placeholder="Enter Amount"
// />

// // Alpha Numeric
// <ReusableInput
//   type="alphaNumeric"
//   value={address}
//   onChangeText={setAddress}
//   placeholder="Enter Address"
// />

// // GST
// <ReusableInput
//   type="gst"
//   value={gst}
//   onChangeText={setGst}
//   placeholder="Enter GST Number"
// />

// // PAN
// <ReusableInput
//   type="pan"
//   value={pan}
//   onChangeText={setPan}
//   placeholder="Enter PAN Number"
// />

// // Description
// <ReusableInput
//   type="description"
//   value={description}
//   onChangeText={setDescription}
//   placeholder="Enter Description"
//   multiline
// />

// // Password
// <ReusableInput
//   type="password"
//   value={password}
//   onChangeText={setPassword}
//   placeholder="Enter Password"
// />

