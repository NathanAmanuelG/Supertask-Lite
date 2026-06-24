const ACTIVITY_API_URL = "https://bored-api.appbrewery.com/random";

export async function fetchTaskIdeas(count = 5) {
  const requests = Array.from({ length: count }, () => fetch(ACTIVITY_API_URL));
  const responses = await Promise.all(requests);

  for (const response of responses) {
    if (!response.ok) {
      throw new Error("Failed to fetch task ideas");
    }
  }

  const data = await Promise.all(responses.map((res) => res.json()));

  return data.map((item) => ({
    title: item.activity,
    description: `Suggested ${item.type} activity`,
  }));
}
