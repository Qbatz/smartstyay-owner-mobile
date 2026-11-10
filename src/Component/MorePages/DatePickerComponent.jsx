
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
    Image,
} from "react-native";

import {
    Calendar as CalendarIcon,
    ArrowLeft2,
    ArrowRight2,
} from "iconsax-react-native";

import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";

const DatePickerComponent = ({
    label,
    required = false,
    selectedDate,
    onSelect,
    minDate,
    maxDate,
    isDateDisabled,
    placeholder = "MM / DD / YYYY",
    displayFormat = "MM / DD / YYYY",
    error,
    disabled = false,
    containerStyle,
    inputStyle,
    iconSource,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const today = dayjs().format("YYYY-MM-DD");

    const [visibleMonth, setVisibleMonth] = useState(today);

    // DATE VALIDATION
    const isDisabledDate = (date) => {
        if (!date) return true;

        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;

        return isDateDisabled
            ? isDateDisabled(date)
            : false;
    };

    // OPEN CALENDAR
    const openPicker = () => {
        if (disabled) return;

        setVisibleMonth(selectedDate || today);
        setIsOpen(true);
    };

    // CLOSE CALENDAR
    const closePicker = () => {
        setIsOpen(false);
    };

    // DATE SELECT
    const handleDateSelect = (date) => {
        if (isDisabledDate(date)) return;

        // Update input immediately
        onSelect?.(date);

        // Close calendar immediately
        setIsOpen(false);
    };

    // TODAY SELECT
    const handleToday = () => {
        if (isDisabledDate(today)) return;

        handleDateSelect(today);
    };

    // MONTH NAVIGATION
    const handleMonthChange = (direction) => {
        const nextMonth = dayjs(visibleMonth)
            .add(direction, "month")
            .format("YYYY-MM-DD");

        setVisibleMonth(nextMonth);
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
        <View style={[styles.container, containerStyle]}>

            {/* LABEL */}
            {label ? (
                <Text style={styles.label}>
                    {label}
                    {required && (
                        <Text style={styles.required}> *</Text>
                    )}
                </Text>
            ) : null}

            {/* DATE INPUT */}
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={openPicker}
                disabled={disabled}
                style={[
                    styles.inputWrapper,
                    isOpen && styles.focusedInput,
                    error && styles.errorInput,
                    disabled && styles.disabledInput,
                    inputStyle,
                ]}
            >
                <Text
                    numberOfLines={1}
                    style={[
                        styles.inputText,
                        !selectedDate && styles.placeholderText,
                        disabled && styles.disabledText,
                    ]}
                >
                    {selectedDate
                        ? dayjs(selectedDate).format(displayFormat)
                        : placeholder}
                </Text>

                {iconSource ? (
                    <Image
                        source={iconSource}
                        style={[
                            styles.calendarIcon,
                            disabled && styles.disabledIcon,
                        ]}
                        resizeMode="contain"
                    />
                ) : (
                    <CalendarIcon
                        size={22}
                        color={disabled ? "#A1A1AA" : "#272F3E"}
                        variant="Linear"
                    />
                )}
            </TouchableOpacity>

            {/* ERROR */}
            {/* {error ? (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            ) : null} */}

               {error ? (
            <ErrorMessage message={error} type="error" />
          ) : null}

            {/* CALENDAR MODAL */}
            <Modal
                visible={isOpen}
                transparent
                animationType="none"
                statusBarTranslucent
                onRequestClose={closePicker}
            >
                <View style={styles.overlay}>

                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={closePicker}
                    />

                    <View style={styles.datePickerBox}>

                        <Calendar
                            key={visibleMonth}
                            current={visibleMonth}
                            minDate={minDate}
                            maxDate={maxDate}
                            hideArrows

                            // CUSTOM HEADER
                            renderHeader={() => (
                                <View style={styles.calendarHeader}>

                                    <Text style={styles.monthTitle}>
                                        {dayjs(visibleMonth).format("MMMM YYYY")}
                                    </Text>

                                    <View style={styles.monthNavigation}>

                                        {/* PREVIOUS MONTH */}
                                        <TouchableOpacity
                                            onPress={() => handleMonthChange(-1)}
                                            disabled={!!isPreviousDisabled}
                                            style={styles.arrowButton}
                                        >
                                            <ArrowLeft2
                                                size={23}
                                                color={
                                                    isPreviousDisabled
                                                        ? "#D5DDE5"
                                                        : "#1765B9"
                                                }
                                                variant="Linear"
                                            />
                                        </TouchableOpacity>

                                        {/* NEXT MONTH */}
                                        <TouchableOpacity
                                            onPress={() => handleMonthChange(1)}
                                            disabled={!!isNextDisabled}
                                            style={styles.arrowButton}
                                        >
                                            <ArrowRight2
                                                size={23}
                                                color={
                                                    isNextDisabled
                                                        ? "#D5DDE5"
                                                        : "#1765B9"
                                                }
                                                variant="Linear"
                                            />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )}

                            // DATE SELECT
                            dayComponent={({ date }) => {
                                if (!date) return null;

                                const dateString = date.dateString;

                                const isDateSelected =
                                    selectedDate === dateString;

                                const isToday =
                                    today === dateString;

                                const dateDisabled =
                                    isDisabledDate(dateString);

                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        disabled={dateDisabled}
                                        onPress={() =>
                                            handleDateSelect(dateString)
                                        }
                                        style={[
                                            styles.dayButton,
                                            isDateSelected &&
                                                styles.selectedDay,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,

                                                // TODAY BLUE
                                                isToday &&
                                                    styles.todayDateText,

                                                // DISABLED DATE
                                                dateDisabled &&
                                                    styles.disabledDayText,

                                                // SELECTED DATE
                                                isDateSelected &&
                                                    styles.selectedDayText,
                                            ]}
                                        >
                                            {date.day}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}

                            theme={{
                                backgroundColor: "#FFFFFF",
                                calendarBackground: "#FFFFFF",
                                textSectionTitleColor: "#AAB8C8",
                                monthTextColor: "#34495E",
                                arrowColor: "#1765B9",
                                textMonthFontSize: 18,
                                textMonthFontWeight: "600",
                                textDayFontSize: 15,
                                textDayHeaderFontSize: 13,
                            }}
                        />

                        {/* TODAY BUTTON */}
                        <TouchableOpacity
                            style={[
                                styles.todayButton,
                                isDisabledDate(today) && {
                                    opacity: 0.35,
                                },
                            ]}
                            disabled={isDisabledDate(today)}
                            onPress={handleToday}
                        >
                            <Text style={styles.todayText}>
                                Today
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DatePickerComponent;


// STYLES
const styles = StyleSheet.create({

    container: {
        width: "100%",
    },

    label: {
        fontSize: 14,
        color: "#18181B",
        fontFamily: "Gilroy-Semibold",
        marginBottom: 6,
    },

    required: {
        color: "#EF4444",
    },

    // INPUT
    inputWrapper: {
        height: 52,
        width: "100%",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },

    focusedInput: {
        borderColor: "#0085FF",
        borderWidth: 2,
    },

    errorInput: {
        borderColor: "#FF3333",
        borderWidth: 1,
    },

    disabledInput: {
        backgroundColor: "#F4F4F5",
        borderColor: "#EEEEEE",
        opacity: 0.75,
        elevation: 0,
        shadowOpacity: 0,
    },

    inputText: {
        flex: 1,
        fontSize: 16,
        color: "#18181B",
        fontFamily: "Gilroy-Medium",
    },

    placeholderText: {
        color: "#71717A",
    },

    disabledText: {
        color: "#A1A1AA",
    },

    calendarIcon: {
        width: 22,
        height: 22,
        tintColor: "#272F3E",
    },

    disabledIcon: {
        tintColor: "#A1A1AA",
    },

    errorText: {
        color: "#FF3333",
        fontSize: 12,
        marginTop: 5,
        fontFamily: "Gilroy-Medium",
    },

    // MODAL
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    datePickerBox: {
        width: "90%",
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        paddingHorizontal: 8,
        paddingTop: 15,
        paddingBottom: 12,

        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },

    // CUSTOM MONTH HEADER
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

    monthNavigation: {
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },

    arrowButton: {
        width: 28,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },

    // DAYS
    dayButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    dayText: {
        fontSize: 15,
        color: "#34495E",
        fontFamily: "Gilroy-Medium",
    },

    todayDateText: {
        color: "#0085FF",
        fontFamily: "Gilroy-Bold",
    },

    selectedDay: {
        backgroundColor: "#0085FF",
    },

    selectedDayText: {
        color: "#FFFFFF",
        fontFamily: "Gilroy-Bold",
    },

    disabledDayText: {
        color: "#D5DDE5",
    },

    // TODAY BUTTON
    todayButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: "#F1F1F1",
        marginTop: 5,
    },

    todayText: {
        fontSize: 15,
        fontFamily: "Gilroy-Semibold",
        color: "#0085FF",
    },
});

