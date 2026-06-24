import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../components/EmptyState";
import PrimaryButton from "../components/PrimaryButton";
import TaskItem from "../components/TaskItem";
import { colors } from "../constants/colors";
import { useTasks } from "../context/TaskContext";
import { fetchTaskIdeas } from "../utils/api";

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

  async function handleGetIdeas() {
    const needed = 5 - tasks.length;
    if (needed <= 0) return;
    setLoading(true);
    try {
      const ideas = await fetchTaskIdeas(needed);
      importTasks(ideas);
    } catch (error) {
      Alert.alert("Error", "Could not load task ideas. Check your connection.");
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

  const showIdeasButton = tasks.length < 5;

  if (!loaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.searchRow}>
        <Ionicons
          name="search"
          size={18}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title"
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

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
        {showIdeasButton && (
          <>
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <PrimaryButton
                title="Get Task Ideas"
                variant="secondary"
                onPress={handleGetIdeas}
              />
            )}
            <View style={{ height: 8 }} />
          </>
        )}
        <PrimaryButton
          title="Add Task"
          onPress={() => navigation.navigate("AddTask")}
          icon={<Ionicons name="add" size={20} color={colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16 },
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
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { color: colors.textSecondary, fontSize: 13 },
  filterTextActive: { color: colors.white, fontWeight: "600" },
  buttonWrap: { padding: 16 },
});
