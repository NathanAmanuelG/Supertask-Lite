import { Button, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { useTasks } from "../context/TaskContext";

export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { tasks, toggleTask, deleteTask } = useTasks();

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>This task no longer exists.</Text>
      </View>
    );
  }

  function handleDelete() {
    deleteTask(task.id);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>
        {task.description || "No description"}
      </Text>
      <Text style={styles.date}>Created: {task.createdDate}</Text>
      <Text style={styles.status}>
        Status: {task.status ? "Completed" : "Not completed"}
      </Text>

      <View style={styles.buttonWrap}>
        <Button
          title={task.status ? "Mark as Not Completed" : "Mark as Completed"}
          onPress={() => toggleTask(task.id)}
        />
      </View>
      <View style={styles.buttonWrap}>
        <Button title="Delete Task" color="#d9534f" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
  },
  description: { fontSize: 16, color: colors.textBody, marginBottom: 16 },
  date: { fontSize: 13, color: colors.textLight, marginBottom: 4 },
  status: { fontSize: 14, color: colors.textDark, marginBottom: 20 },
  buttonWrap: { marginBottom: 12 },
});
