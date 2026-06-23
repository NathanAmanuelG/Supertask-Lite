import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/colors";
import { useTasks } from "../context/TaskContext";

export default function AddTaskScreen({ navigation }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSave() {
    if (title.trim() === "") {
      Alert.alert("Title required", "Please enter a title before saving.");
      return;
    }
    addTask(title.trim(), description.trim());
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Buy groceries"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder="Optional details"
        multiline
      />

      <Button title="Save Task" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  multiline: { height: 90, textAlignVertical: "top" },
});
