import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
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

  function confirmDelete() {
    Alert.alert(
      "Delete task",
      "Are you sure you want to delete this task? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDelete },
      ],
    );
  }

  function handleDelete() {
    deleteTask(task.id);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>
        {task.description || "No description"}
      </Text>
      <Text style={styles.date}>Created: {task.createdDate}</Text>
      {task.dueDate && (
        <Text style={styles.date}>
          Due:{" "}
          {new Date(task.dueDate).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {" at "}
          {new Date(task.dueDate).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </Text>
      )}
      <Text style={styles.status}>
        Status: {task.status ? "Completed" : "Not completed"}
      </Text>

      <View style={styles.buttonWrap}>
        <PrimaryButton
          title="Edit Task"
          variant="secondary"
          onPress={() => navigation.navigate("AddTask", { taskId: task.id })}
        />
      </View>
      <View style={styles.buttonWrap}>
        <PrimaryButton
          title={task.status ? "Mark as Not Completed" : "Mark as Completed"}
          onPress={() => toggleTask(task.id)}
          variant={task.status ? "secondary" : "primary"}
        />
      </View>
      <View style={styles.buttonWrap}>
        <PrimaryButton
          title="Delete Task"
          variant="danger"
          onPress={confirmDelete}
        />
      </View>
    </SafeAreaView>
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
