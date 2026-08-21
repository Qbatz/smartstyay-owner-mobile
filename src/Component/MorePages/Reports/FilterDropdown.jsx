import React,{useState} from "react";
import { View,TouchableOpacity,Text,Image,ScrollView } from "react-native";

const FilterDropdown = ({
    options = [],
    selectedValue,
    onSelect,
    placeholder = "Select",
}) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={{ position: "relative" }}>

            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setOpen(prev => !prev)}
            >
                <Text
                    style={[
                        styles.dropdownText,
                        !selectedValue && styles.placeholderText
                    ]}
                >
                    {selectedValue?.label || placeholder}
                </Text>

                <Image
                    source={DownArrow}
                    style={[
                        styles.dropdownArrow,
                        {
                            transform: [
                                {
                                    rotate: open ? "180deg" : "0deg"
                                }
                            ]
                        }
                    ]}
                />
            </TouchableOpacity>

            {open && (
                <View style={styles.dropdownMenu}>
                    <ScrollView
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        style={{ maxHeight: 180 }}
                    >
                        {options.map((item, index) => (
                            <TouchableOpacity
                                key={item?.id ?? index}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    onSelect(item);
                                    setOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>
                                    {item?.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({

    dropdownButton: {
        height: 44,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        paddingHorizontal: 12,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        backgroundColor: "#FFFFFF",
    },

    dropdownText: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
        color: "#1E293B",
    },

    placeholderText: {
        color: "#94A3B8",
    },

    dropdownArrow: {
        width: 17,
        height: 17,
        tintColor: "#64748B",
    },

    dropdownMenu: {
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,

        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,

        elevation: 5,
        zIndex: 999,
    },

    dropdownItem: {
        paddingHorizontal: 12,
        paddingVertical: 11,
    },

    dropdownItemText: {
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
        color: "#334155",
    },

});