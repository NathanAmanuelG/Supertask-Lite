import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmptyState from "../components/EmptyState";
import TaskItem from "../components/TaskItem";
import { colors } from "../constants/colors";
import { useTasks } from "../context/TaskContext";
import { fetchSampleTasks } from "../utils/api";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export default function TaskListScreen({ navigation }) {
  const { tasks, importTasks, loaded } = useTasks();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function handleImport() {
    setLoading(true);
    try {
      const sampleTasks = await fetchSampleTasks();
      importTasks(sampleTasks);
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not load sample tasks. Check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((t) => {
      if (statusFilter === "active") return !t.status;
      if (statusFilter === "completed") return t.status;
      return true;
    });

  if (!loaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              statusFilter === f.key && styles.filterChipActive,
            ]}
            onPress={() => setStatusFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() =>
              navigation.navigate("TaskDetails", { taskId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <EmptyState
              title="No matching tasks"
              subtitle="Try a different search or filter"
            />
          )
        }
      />

      <View style={styles.buttonWrap}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Import Sample Tasks" onPress={handleImport} />
        )}
        <View style={{ height: 8 }} />
        <Button
          title="Add Task"
          onPress={() => navigation.navigate("AddTask")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    margin: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.chipBackground,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: colors.success },
  filterText: { color: colors.textSecondary, fontSize: 13 },
  filterTextActive: { color: colors.white, fontWeight: "600" },
  buttonWrap: { padding: 16 },
});
