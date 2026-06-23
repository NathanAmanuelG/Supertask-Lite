const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=5";

export async function fetchSampleTasks() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await response.json();
  return data.map((item) => ({
    title: item.title,
    status: item.completed,
  }));
}
