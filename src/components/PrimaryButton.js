import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

export default function PrimaryButton({
  title,
  onPress,
  variant = "primary",
  icon,
}) {
  const isSecondary = variant === "secondary";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary && styles.secondaryButton,
        isDanger && { backgroundColor: colors.danger },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={[styles.text, isSecondary && styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  text: { fontSize: 16, fontWeight: "600", color: colors.white },
  secondaryText: { color: colors.primary },
});
