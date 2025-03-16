import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function Loading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="rgba(0,0,0,0.5)" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    top: 0,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
