import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("task-reminders", {
      name: "Task Reminders",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleTaskReminder(taskTitle, dueDate) {
  if (!dueDate || dueDate.getTime() <= Date.now()) {
    return null;
  }
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Reminder",
        body: taskTitle,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dueDate,
        channelId: "task-reminders",
      },
    });
    return id;
  } catch (error) {
    return null;
  }
}

export async function cancelTaskReminder(notificationId) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    // Already fired or cancelled, safe to ignore
  }
}
