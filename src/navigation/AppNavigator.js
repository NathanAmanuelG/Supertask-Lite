import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";
import AddTaskScreen from "../screens/AddTaskScreen";
import TaskDetailsScreen from "../screens/TaskDetailsScreen";
import TaskListScreen from "../screens/TaskListScreen";

const Stack = createNativeStackNavigator();

function HeaderTitle() {
  return (
    <View style={styles.headerTitleRow}>
      <Image
        source={require("../../assets/images/header-icon.png")}
        style={styles.headerIcon}
        resizeMode="contain"
      />
      <Text style={styles.headerTitleText}>Supertask Lite</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TaskList"
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: "600" },
        }}
      >
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ headerTitle: () => <HeaderTitle /> }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ title: "Add Task" }}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{ title: "Task Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerTitleRow: { flexDirection: "row", alignItems: "center" },
  headerIcon: { width: 34, height: 34, marginRight: 8 },
  headerTitleText: { color: colors.white, fontWeight: "600", fontSize: 17 },
});
