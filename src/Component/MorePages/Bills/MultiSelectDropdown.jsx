import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";

const CloseIcon = require("../../../Assets/Images/close_circle.png")
const DownArrow = require("../../../Assets/Images/direction_down.png");

export default function MultiSelectDropdown({
  label,
  options = [],
  selected = [],
  onChange,
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);

 const toggleItem = (item) => {
  if (selected.includes(item.value)) {
    onChange(selected.filter((v) => v !== item.value));
  } else {
    onChange([...selected, item.value]);
  }
};

const removeChip = (value) => {
  onChange(selected.filter((v) => v !== value));
};


  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.selectBox} onPress={() => setOpen(!open)}>
        <View style={styles.chipWrap}>
         {selected.length === 0 ? (
  <Text style={styles.placeholder}>{placeholder}</Text>
) : (
  selected.map((val) => {
    const label = options.find((o) => o.value === val)?.label;
    return (
      <View key={val} style={styles.chip}>
        <Text style={styles.chipText}>{label}</Text>
        <TouchableOpacity onPress={() => removeChip(val)}>
         <TouchableOpacity onPress={() => removeChip(val)}>
  <Image source={CloseIcon} style={{ width: 16, height: 16 }} />
</TouchableOpacity>

        </TouchableOpacity>
      </View>
    );
  })
)}

        </View>

        <Image source={DownArrow} style={styles.arrow} />
      </TouchableOpacity>

      {/* DROPDOWN */}
      {open && (
        <View style={styles.dropdown}>
          <ScrollView>
   {options.map((item) => {
  const checked = selected.includes(item.value);
  return (
    <TouchableOpacity
      key={item.value}
      style={styles.optionRow}
      onPress={() => toggleItem(item)}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );
})}


          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  selectBox: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    padding: 10,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  placeholder: {
    color: "#9E9E9E",
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },

  chipText: {
    fontSize: 13,
    marginRight: 6,
  },

  remove: {
    fontSize: 14,
    color: "red",
  },

  arrow: {
    width: 18,
    height: 18,
    tintColor: "#6F6F6F",
    marginLeft: 8,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 180,
    backgroundColor: "#fff",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },

  checkbox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  optionText: {
    fontSize: 15,
  },
  checkbox: {
  width: 20,
  height: 20,
  borderWidth: 1.5,
  borderColor: "#A0A0A0",
  borderRadius: 4,
  alignItems: "center",
  justifyContent: "center",
},

checkboxChecked: {
  backgroundColor: "#16a34a",
  borderColor: "#16a34a",
},

tick: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "700",
},
optionText: {
  fontSize: 15,
  marginLeft: 8,
},

});

