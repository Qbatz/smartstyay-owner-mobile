import React,{useState} from "react";
import { View,TouchableOpacity,Text,Image,ScrollView, StyleSheet, } from "react-native";
import DownArrow from "../../../Assets/Images/direction-down.png";



const FilterDropdown = ({
    options = [],
    value,
    onSelect,
    placeholder,
    multiSelect = false,
}) => {
    const [open, setOpen] = useState(false);

    console.log("srithai",value)

    // const handleSelect = (item) => {
    //     if (multiSelect) {
           
    //         const currentValues = Array.isArray(value) ? value : [];

    //         const alreadySelected = currentValues.some(
    //             selected => selected?.id ?? selected?.type === item?.id ?? item?.type
    //         );

    //         let updatedValues;

    //         if (alreadySelected) {          
    //             updatedValues = currentValues.filter(
    //                 selected => selected?.id ?? selected?.type !== item?.id ?? item?.type
    //             );
    //         } else {            
    //             updatedValues = [...currentValues, item];
    //         }

    //         onSelect(updatedValues);

    //     } else {        
    //         onSelect(item);
    //         setOpen(false);
    //     }
    // };

     const getItemId = (item) => {
    return item?.id ?? item?.tenantId ?? item?.type ?? item?.categoryId ?? item?.subCategoryId ?? item?.userId
};
const getLabel=(item)=>{
    return item?.label ?? item?.name ?? item?.categoryName ?? item?.subCategoryName ?? item?.userName ?? item
}


    const handleSelect = (item) => {
    if (multiSelect) {
        const currentValues = Array.isArray(value) ? value : [];

        const itemId = getItemId(item);

        const alreadySelected = currentValues.some(selected => {
            const selectedId = getItemId(selected);

            return (
                selectedId != null &&
                itemId != null &&
                String(selectedId) === String(itemId)
            );
        });

        let updatedValues;

        if (alreadySelected) {
            // Remove selected item
            updatedValues = currentValues.filter(selected => {
                const selectedId = getItemId(selected);

                return String(selectedId) !== String(itemId);
            });
        } else {
            // Add selected item
            updatedValues = [...currentValues, item];
        }

        onSelect(updatedValues);

    } else {
        onSelect(item);
        setOpen(false);
    }
};

    // const isSelected = (item) => {
    //     if (!multiSelect) {
    //         return value?.id ?? value?.tenantId === item?.id ?? item?.tenantId;
    //     }

    //     return Array.isArray(value) &&
    //         value.some(selected => selected?.id === item?.id);
    // };
   
const isSelected = (item) => {
    const itemId = getItemId(item);

    if (!multiSelect) {
        const selectedId = getItemId(value);

        return (
            selectedId != null &&
            itemId != null &&
            String(selectedId) === String(itemId)
        );
    }

    return Array.isArray(value) && value.some(selected => {
        const selectedId = getItemId(selected);

        return (
            selectedId != null &&
            itemId != null &&
            String(selectedId) === String(itemId)
        );
    });
};


    return (
        <View>

           
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setOpen(!open)}
            >
                <Text style={{fontSize:14,fontFamily:'Gilroy-Medium'}}>
                    {multiSelect
                        ? value?.length
                            ?  value.map(i => getLabel(i)).join("  ")
                            : placeholder || "Select"
                        : getLabel(value) || value || placeholder || "Select"
                    } 
                </Text>
                <Image source={DownArrow} style={{width:18,height:18}}/>
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
                                onPress={() => handleSelect(item)}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>
                                        {getLabel(item) || item}
                                    </Text>

                                    {isSelected(item) && (
                                        <Text>✓</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                        {options.length ===0 && (
                            <View style={styles.dropdownItem}>
                                <Text style={styles.dropdownItemText}>No Option availbale</Text>
                            </View>
                        )}
                    </ScrollView>

                  
                    {/* {multiSelect && (
                        <TouchableOpacity
                            onPress={() => setOpen(false)}
                            style={styles.doneButton}
                        >
                            <Text>Done</Text>
                        </TouchableOpacity>
                    )} */}
                </View>
            )}

        </View>
    );
};
export default FilterDropdown;

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
        // position: "absolute",
        // top: 48,
        marginTop:5,
        left: 0,
        right: 0,

        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 10,

        elevation: 2,
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