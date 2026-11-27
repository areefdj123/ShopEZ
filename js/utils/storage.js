// LocalStorage mein data save karne ke liye
export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// LocalStorage se data safely nikalne ke liye
export function getData(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.log("Storage error:", error);
    return defaultValue;
  }
}
