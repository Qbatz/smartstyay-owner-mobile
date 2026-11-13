
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
} from "react-native";

import {
    Calendar as CalendarIcon,
    ArrowLeft2,
    ArrowRight2,
} from "iconsax-react-native";

import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";

const DateRangePicker = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    label = "Date",
    startLabel = "Start",
    endLabel = "End",
    startPlaceholder = "Start Date",
    endPlaceholder = "End Date",
    displayFormat = "DD MMM YYYY",
    minDate,
    maxDate,
    disabled = false,
    error,
}) => {
    const today = dayjs().format("YYYY-MM-DD");

    const [isOpen, setIsOpen] = useState(false);
    const [selecting, setSelecting] = useState("start");
    const [visibleMonth, setVisibleMonth] = useState(today);

    // OPEN CALENDAR
    const openPicker = (type) => {
        if (disabled) return;

        setSelecting(type);

        const initialDate =
            type === "end"
                ? startDate || today
                : startDate || today;

        setVisibleMonth(initialDate);
        setIsOpen(true);
    };

    // CLOSE CALENDAR
    const closePicker = () => {
        setIsOpen(false);
    };

    // DATE SELECTION
    const handleDateSelect = (day) => {
        const selectedDate = day.dateString;

        if (selecting === "start") {
            onStartDateChange?.(selectedDate);

            // Clear old end date
            onEndDateChange?.(null);

            // Same calendar changes to end date selection
            setSelecting("end");

            return;
        }

        // End date must be after or equal to start date
        if (!startDate || selectedDate < startDate) {
            return;
        }

        onEndDateChange?.(selectedDate);

        // Close after selecting end date
        setIsOpen(false);
    };

    // MONTH NAVIGATION
    const handleMonthChange = (direction) => {
        const nextMonth = dayjs(visibleMonth)
            .add(direction, "month")
            .format("YYYY-MM-DD");

        setVisibleMonth(nextMonth);
    };

    // DISABLED DATE
    const isDateDisabled = (date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;

        if (
            selecting === "end" &&
            startDate &&
            date < startDate
        ) {
            return true;
        }

        return false;
    };

    // RANGE MARKING
    const getMarkedDates = () => {
        if (!startDate) return {};

        // Only start date selected
        if (!endDate) {
            return {
                [startDate]: {
                    startingDay: true,
                    endingDay: true,
                    color: "#0085FF",
                    textColor: "#FFFFFF",
                },
            };
        }

        const marked = {};

        let current = dayjs(startDate);
        const end = dayjs(endDate);

        while (
            current.isBefore(end, "day") ||
            current.isSame(end, "day")
        ) {
            const date = current.format("YYYY-MM-DD");

            marked[date] = {
                color: "#DCEEFF",
                textColor: "#18181B",
            };

            if (date === startDate) {
                marked[date] = {
                    startingDay: true,
                    color: "#0085FF",
                    textColor: "#FFFFFF",
                };
            }

            if (date === endDate) {
                marked[date] = {
                    endingDay: true,
                    color: "#0085FF",
                    textColor: "#FFFFFF",
                };
            }

            current = current.add(1, "day");
        }

        return marked;
    };

    const isPreviousDisabled =
        minDate &&
        dayjs(visibleMonth)
            .subtract(1, "month")
            .endOf("month")
            .isBefore(dayjs(minDate), "day");

    const isNextDisabled =
        maxDate &&
        dayjs(visibleMonth)
            .add(1, "month")
            .startOf("month")
            .isAfter(dayjs(maxDate), "day");

    return (
        <View style={styles.container}>

            {/* LABEL */}
            {/* {label ? (
                <Text style={styles.label}>{label}</Text>
            ) : null} */}

            <View style={styles.dateRow}>

                {/* START DATE */}
                <View style={styles.dateField}>
                    <Text style={styles.fieldLabel}>{startLabel}</Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={disabled}
                        onPress={() => openPicker("start")}
                        style={[
                            styles.dateInput,
                            selecting === "start" && isOpen && styles.focusedInput,
                            disabled && styles.disabledInput,
                            error && styles.errorInput,
                        ]}
                    >
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.dateText,
                                !startDate && styles.placeholder,
                            ]}
                        >
                            {startDate
                                ? dayjs(startDate).format(displayFormat)
                                : startPlaceholder}
                        </Text>

                        <CalendarIcon size={20} color="#71717A" variant="Linear" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.separator}>-</Text>

                {/* END DATE */}
                <View style={styles.dateField}>
                    <Text style={styles.fieldLabel}>{endLabel}</Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={disabled}
                        onPress={() => openPicker("end")}
                        style={[
                            styles.dateInput,
                            selecting === "end" && isOpen && styles.focusedInput,
                            disabled && styles.disabledInput,
                            error && styles.errorInput,
                        ]}
                    >
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.dateText,
                                !endDate && styles.placeholder,
                            ]}
                        >
                            {endDate
                                ? dayjs(endDate).format(displayFormat)
                                : endPlaceholder}
                        </Text>

                        <CalendarIcon size={20} color="#71717A" variant="Linear" />
                    </TouchableOpacity>
                </View>

            </View>



            {/* ERROR */}
            {/* {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null} */}

                 {error ? (
            <ErrorMessage message={error} type="error" />
          ) : null}

            {/* SINGLE CALENDAR MODAL */}
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={closePicker}
            >
                <View style={styles.overlay}>

                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={closePicker}
                    />

                    <View style={styles.calendarContainer}>

                        {/* SELECTION HEADER */}
                        <View style={styles.selectionHeader}>
                            <Text style={styles.selectionTitle}>
                                Select {selecting === "start"
                                    ? "Start Date"
                                    : "End Date"}
                            </Text>

                            <Text style={styles.selectionSubtitle}>
                                {selecting === "start"
                                    ? "Choose your starting date"
                                    : "Choose your ending date"}
                            </Text>
                        </View>

                        <Calendar
                            key={visibleMonth}
                            current={visibleMonth}
                            minDate={
                                selecting === "end"
                                    ? startDate || minDate
                                    : minDate
                            }
                            maxDate={maxDate}
                            markingType="period"
                            markedDates={getMarkedDates()}
                            hideArrows

                            // CUSTOM MONTH HEADER
                            renderHeader={() => (
                                <View style={styles.calendarHeader}>

                                    <Text style={styles.monthTitle}>
                                        {dayjs(visibleMonth).format(
                                            "MMMM YYYY"
                                        )}
                                    </Text>

                                    <View style={styles.navigation}>

                                        <TouchableOpacity
                                            onPress={() =>
                                                handleMonthChange(-1)
                                            }
                                            disabled={!!isPreviousDisabled}
                                        >
                                            <ArrowLeft2
                                                size={22}
                                                color={
                                                    isPreviousDisabled
                                                        ? "#D5DDE5"
                                                        : "#0085FF"
                                                }
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() =>
                                                handleMonthChange(1)
                                            }
                                            disabled={!!isNextDisabled}
                                        >
                                            <ArrowRight2
                                                size={22}
                                                color={
                                                    isNextDisabled
                                                        ? "#D5DDE5"
                                                        : "#0085FF"
                                                }
                                            />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )}

                            onDayPress={handleDateSelect}

                            theme={{
                                backgroundColor: "#FFFFFF",
                                calendarBackground: "#FFFFFF",
                                textSectionTitleColor: "#71717A",
                                monthTextColor: "#18181B",
                                dayTextColor: "#18181B",
                                textDayFontSize: 15,
                                textDayHeaderFontSize: 13,
                                textMonthFontSize: 18,
                                textDayFontFamily: "Gilroy-Medium",
                                textMonthFontFamily: "Gilroy-Semibold",
                                todayTextColor: "#0085FF",
                                arrowColor: "#0085FF",
                            }}
                        />

                        {/* FOOTER */}
                        <View style={styles.footer}>

                            <TouchableOpacity
                                onPress={() => {
                                    onStartDateChange?.(null);
                                    onEndDateChange?.(null);
                                    setSelecting("start");
                                    setVisibleMonth(today);
                                }}
                            >
                                <Text style={styles.clearText}>
                                    Clear
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={closePicker}
                            >
                                <Text style={styles.doneText}>
                                    Done
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default DateRangePicker;

const styles = StyleSheet.create({

    container: {
        width: "100%",
    },

    label: {
        fontSize: 14,
        color: "#18181B",
        fontFamily: "Gilroy-Semibold",
        marginBottom: 8,
    },

    dateRow: {
        flexDirection: "row",
        alignItems: "flex-end",
    },

    dateInput: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    focusedInput: {
        borderColor: "#0085FF",
        borderWidth: 1.5,
    },

    disabledInput: {
        backgroundColor: "#F4F4F5",
        opacity: 0.6,
    },
    dateField: {
        flex: 1,
    },


    dateText: {
        flex: 1,
        fontSize: 13,
        color: "#18181B",
        fontFamily: "Gilroy-Medium",
        marginRight: 4,
    },

    placeholder: {
        color: "#71717A",
    },

    separator: {
        marginHorizontal: 8,
        color: "#71717A",
        fontSize: 15,
    },

    errorText: {
        color: "#FF3333",
        fontSize: 12,
        marginTop: 5,
        fontFamily: "Gilroy-Medium",
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 15,
    },

    calendarContainer: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingTop: 16,
        paddingBottom: 8,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },

    selectionHeader: {
        paddingHorizontal: 14,
        paddingBottom: 8,
    },

    selectionTitle: {
        fontSize: 17,
        color: "#18181B",
        fontFamily: "Gilroy-Semibold",
    },

    selectionSubtitle: {
        fontSize: 12,
        color: "#71717A",
        fontFamily: "Gilroy-Regular",
        marginTop: 4,
    },

    calendarHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },

    monthTitle: {
        fontSize: 18,
        color: "#18181B",
        fontFamily: "Gilroy-Semibold",
    },

    navigation: {
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },

    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#F1F1F1",
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 8,
    },

    clearText: {
        color: "#71717A",
        fontSize: 14,
        fontFamily: "Gilroy-Semibold",
    },

    doneText: {
        color: "#0085FF",
        fontSize: 14,
        fontFamily: "Gilroy-Semibold",
    },
fieldLabel: {
  fontSize: 13,
  color: "#52525B",
  fontFamily: "Gilroy-Semibold",
  marginBottom: 8,
},

separator: {
  marginHorizontal: 8,
  marginBottom: 14,
  color: "#71717A",
  fontSize: 15,
},

errorInput: {
  borderColor: "#FF3333",
},

errorText: {
  color: "#FF3333",
  fontSize: 12,
  marginTop: 7,
  fontFamily: "Gilroy-Medium",
},
});
