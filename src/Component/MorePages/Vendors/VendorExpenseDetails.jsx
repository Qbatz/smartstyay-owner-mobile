import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function VendorExpenseDetailsSheet({
  visible,
  onClose,
  expense,
}) {
  const translateY = useRef(
    new Animated.Value(600)
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(600);
    }
  }, [visible]);

  if (!visible || !expense) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
    >
      <TouchableWithoutFeedback
        onPress={onClose}
      >
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [
              { translateY },
            ],
          },
        ]}
      >
        <View style={styles.handle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            {expense.title}
          </Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.heading}>
              Total Amount
            </Text>

            <View>
              <Text style={styles.amount}>
                {expense.amount}
              </Text>

              <Text
                style={{
                  color:
                    expense.status === "Paid"
                      ? "#16A34A"
                      : "#F59E0B",
                  marginTop: 4,
                }}
              >
                ✓ {expense.status}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text>Expense ID</Text>
            <Text>{expense.code}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text>Date</Text>
            <Text>{expense.date}</Text>
          </View>

          <Text style={styles.sectionTitle}>
            Expense Items
          </Text>

          {expense.items?.map(
            (item, index) => (
              <View
                key={index}
                style={styles.itemCard}
              >
                <Text
                  style={
                    styles.itemTitle
                  }
                >
                  {item.name}
                </Text>

                <View
                  style={
                    styles.itemRow
                  }
                >
                  <Text>
                    Quantity
                  </Text>
                  <Text>
                    {item.quantity}
                  </Text>
                </View>

                <View
                  style={
                    styles.itemRow
                  }
                >
                  <Text>
                    Unit
                  </Text>
                  <Text>
                    {item.unit}
                  </Text>
                </View>

                <View
                  style={
                    styles.itemRow
                  }
                >
                  <Text>
                    Per Unit Price
                  </Text>
                  <Text>
                    ₹ {item.rate}
                  </Text>
                </View>

                <View
                  style={
                    styles.amountFooter
                  }
                >
                  <Text>
                    Amount
                  </Text>
                  <Text
                    style={{
                      fontWeight:
                        "700",
                    }}
                  >
                    ₹ {item.amount}
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.4)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
  },

  heading: {
    fontSize: 15,
    fontWeight: "700",
  },

  amount: {
    fontSize: 15,
    fontWeight: "700",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 15,
  },

  itemCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    marginBottom: 15,
    overflow: "hidden",
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    padding: 15,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  amountFooter: {
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent:
      "space-between",
    padding: 15,
  },
});