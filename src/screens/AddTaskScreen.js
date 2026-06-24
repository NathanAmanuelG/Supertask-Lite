import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../constants/colors";
import { useTasks } from "../context/TaskContext";
import { isValidTitle } from "../utils/validation";

export default function AddTaskScreen({ navigation, route }) {
  const { tasks, addTask, updateTask } = useTasks();
  const taskId = route.params?.taskId;
  const existingTask = taskId ? tasks.find((t) => t.id === taskId) : null;
  const isEditing = !!existingTask;

  const [title, setTitle] = useState(existingTask ? existingTask.title : "");
  const [description, setDescription] = useState(
    existingTask ? existingTask.description : "",
  );
  const [dueDate, setDueDate] = useState(
    existingTask?.dueDate ? new Date(existingTask.dueDate) : null,
  );
  const [showIOSPicker, setShowIOSPicker] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? "Edit Task" : "Add Task" });
  }, [isEditing]);

  function openDatePicker() {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: dueDate || new Date(),
        mode: "date",
        minimumDate: new Date(),
        onChange: (event, selectedDate) => {
          if (event.type === "dismissed" || !selectedDate) return;
          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: "time",
            is24Hour: false,
            onChange: (timeEvent, selectedTime) => {
              if (timeEvent.type === "dismissed" || !selectedTime) return;
              setDueDate(selectedTime);
            },
          });
        },
      });
    } else {
      setShowIOSPicker(true);
    }
  }

  function formatDueDate(date) {
    return (
      date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    );
  }

  function handleSave() {
    if (!isValidTitle(title)) {
      Alert.alert("Title required", "Please enter a title before saving.");
      return;
    }
    if (isEditing) {
      updateTask(taskId, title.trim(), description.trim(), dueDate);
    } else {
      addTask(title.trim(), description.trim(), dueDate);
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Buy groceries"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Optional details"
            placeholderTextColor={colors.textMuted}
            multiline
          />

          <Text style={styles.label}>Due date (optional)</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={openDatePicker}
            >
              <Ionicons name="alarm-outline" size={18} color={colors.primary} />
              <Text style={styles.dateButtonText}>
                {dueDate
                  ? formatDueDate(dueDate)
                  : "Set a due date and reminder"}
              </Text>
            </TouchableOpacity>

            {dueDate && (
              <TouchableOpacity
                onPress={() => setDueDate(null)}
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Remove due date"
              >
                <Ionicons
                  name="close-circle"
                  size={22}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          {Platform.OS === "ios" && showIOSPicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="datetime"
              display="inline"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowIOSPicker(false);
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}

          <View style={{ height: 8 }} />
          <PrimaryButton
            title={isEditing ? "Save Changes" : "Save Task"}
            onPress={handleSave}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  multiline: { height: 90, textAlignVertical: "top" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.white,
    gap: 8,
  },
  dateButtonText: { fontSize: 15, color: colors.textDark },
  clearButton: { padding: 4 },
});
