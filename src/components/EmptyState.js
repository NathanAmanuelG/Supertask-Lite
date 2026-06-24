import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function EmptyState({
  title = "No tasks yet",
  subtitle = "Tap Add Task, or get a few ideas below",
}) {
  return (
    <View style={styles.container}>
      <Ionicons name="clipboard-outline" size={48} color={colors.textMuted} />
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
  text: { fontSize: 16, color: colors.textSecondary, marginTop: 12 },
  subText: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
});
