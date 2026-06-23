import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function EmptyState({
  title = "No tasks yet",
  subtitle = 'Tap "Add Task" to create one',
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.subText}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  text: { fontSize: 16, color: colors.textSecondary },
  subText: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
});
