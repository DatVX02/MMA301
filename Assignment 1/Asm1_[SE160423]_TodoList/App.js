import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

export default function App() {
  const [data, setData] = useState([
    
    {
      id: "1",
      header_task: "Task 1",
      subscription: "Task 1 done",
      completed: false,
    },
    {
      id: "2",
      header_task: "Task 2",
      subscription: "Task 2 in progress",
      completed: false,
    },
    {
      id: "3",
      header_task: "Task 3",
      subscription: "Task 3 pending",
      completed: false,
    },
  ]);

  useEffect(() => {
    loadTasks();
  }, []);


  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setData(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };

  const [taskInput, setTaskInput] = useState("");
  const [descInput, setDescInput] = useState("");

  const addTask = async () => {
    if (taskInput.trim() === "" || descInput.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Task name and description cannot be empty",
      });
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      header_task: taskInput,
      subscription: descInput,
      completed: false,
    };

    const updatedTasks = [...data, newTask];
    setData(updatedTasks);
    await saveTasks(updatedTasks);

    setTaskInput("");
    setDescInput("");

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Task added successfully!",
    });
  };


  const toggleComplete = async (id) => {
    const updatedTasks = data.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setData(updatedTasks);
    await saveTasks(updatedTasks);
  };


  const deleteTask = async (id) => {
    const updatedTasks = data.filter((task) => task.id !== id);
    setData(updatedTasks);
    await saveTasks(updatedTasks);

    Toast.show({
      type: "info",
      text1: "Task Deleted",
      text2: "The task has been removed successfully.",
    });
  };


  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleComplete(item.id)}>
      <View
        style={[styles.taskContainer, item.completed && styles.completedTask]}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.title, item.completed && styles.completedText]}>
            {item.header_task}
          </Text>
          <Text style={item.completed && styles.completedText}>
            {item.subscription}
          </Text>
          {item.completed && (
            <Text style={styles.completedLabel}>✔ Completed</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Todo List</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task name..."
          value={taskInput}
          onChangeText={setTaskInput}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task description..."
          value={descInput}
          onChangeText={setDescInput}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6D7EF",
    padding: 20,
  },

  headerContainer: {
    backgroundColor: "#9395D3",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  header: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "white",
  },

  inputContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  input: {
    fontSize: 16,
    paddingHorizontal: 10,
  },

  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  listContainer: {
    paddingBottom: 20,
  },

  taskContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  completedTask: {
    backgroundColor: "#33CC66",
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },

  completedText: {
    color: "black",
  },

  completedLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    marginTop: 5,
  },

  deleteButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
