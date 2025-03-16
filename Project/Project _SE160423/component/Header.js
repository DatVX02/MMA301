import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function Header({ title }) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  return (
    <LinearGradient
      colors={["#2CAD5E", "#2CAD5E"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {canGoBack && (
        <TouchableOpacity
          style={styles.backbutton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ color: "white" }}>Quay lại </Text>
        </TouchableOpacity>
      )}

      <Text
        style={{
          position: "absolute",
          bottom: 18,
          fontSize: 24,
          fontWeight: "bold",
          color: "white",
        }}
      >
        {title || "title"}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: WIDTH,
    height: HEIGHT * 0.08,
    paddingTop: HEIGHT * 0.1,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
  },
  backbutton: {
    position: "absolute",
    left: "10%",
    bottom: 18,
  },
});
