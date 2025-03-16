import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import StackNavigate from "./router/StackNavigation";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    // <SafeAreaView>
    <NavigationContainer>
      <StackNavigate />
    </NavigationContainer>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
