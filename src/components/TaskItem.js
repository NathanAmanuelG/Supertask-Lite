import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

function getMinutesUntil(dueDateString) {
  return Math.round((new Date(dueDateString).getTime() - Date.now()) / 60000);
}

function formatCountdown(dueDateString) {
  const totalMinutes = getMinutesUntil(dueDateString);
  if (totalMinutes <= 0) return "Overdue";
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  return `in ${minutes}m`;
}

export default function TaskItem({ task, onPress }) {
  const isOverdue = task.dueDate && getMinutesUntil(task.dueDate) <= 0;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Ionicons
        name={task.status ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={task.status ? colors.success : colors.textMuted}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.title, task.status && styles.titleDone]}>
          {task.title}
        </Text>
        <Text style={styles.date}>{task.createdDate}</Text>
      </View>

      {task.dueDate && (
        <View style={styles.dueColumn}>
          <Text
            style={[styles.countdown, isOverdue && styles.countdownOverdue]}
          >
            {formatCountdown(task.dueDate)}
          </Text>
          <Text style={styles.dueDateTime}>
            {new Date(task.dueDate).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })}
            {", "}
            {new Date(task.dueDate).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: { marginRight: 12 },
  textContainer: { flex: 1 },
  title: { fontSize: 16, color: colors.text },
  titleDone: { textDecorationLine: "line-through", color: colors.textMuted },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  dueColumn: { alignItems: "flex-end", marginLeft: 8 },
  countdown: { fontSize: 13, fontWeight: "600", color: colors.primary },
  countdownOverdue: { color: colors.danger },
  dueDateTime: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
