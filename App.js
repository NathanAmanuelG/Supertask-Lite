import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TaskProvider } from "./src/context/TaskContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { setupNotifications } from "./src/utils/notifications";

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <TaskProvider>
        <AppNavigator />
      </TaskProvider>
    </SafeAreaProvider>
  );
}
