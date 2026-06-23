import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export default function TaskItem({ task, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, task.status && styles.titleDone]}>
          {task.title}
        </Text>
        <Text style={styles.date}>{task.createdDate}</Text>
      </View>
      <View style={[styles.statusDot, task.status && styles.statusDotDone]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, color: colors.text },
  titleDone: { textDecorationLine: "line-through", color: colors.textMuted },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  statusDotDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
});
