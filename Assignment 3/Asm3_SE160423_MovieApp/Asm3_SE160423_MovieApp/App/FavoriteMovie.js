import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Favorite = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(1);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favoriteMovies");
      setFavoriteMovies(storedFavorites ? JSON.parse(storedFavorites) : []);
    } catch (error) {
      console.error("Error loading favorite movies:", error);
    }
  };

  const removeFavorite = async (movieId) => {
    try {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(async () => {
        const updatedFavorites = favoriteMovies.filter(
          (movie) => movie.id !== movieId
        );
        await AsyncStorage.setItem(
          "favoriteMovies",
          JSON.stringify(updatedFavorites)
        );
        setFavoriteMovies(updatedFavorites);
        fadeAnim.setValue(1);
      });
    } catch (error) {
      console.error("Error removing favorite movie:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorite Movie</Text>

      {favoriteMovies.length === 0 ? (
        <Text style={styles.noFavorites}>Bạn chưa có phim yêu thích nào!</Text>
      ) : (
        <FlatList
          data={favoriteMovies}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false} // ẨN THANH CUỘN
          renderItem={({ item }) => (
            <Animated.View style={[styles.movieItem, { opacity: fadeAnim }]}>
              <TouchableOpacity
                style={styles.movieDetails}
                onPress={() =>
                  navigation.navigate("DetailMovie", { movieId: item.id })
                }
              >
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  style={styles.movieImage}
                />
                <View style={styles.movieInfo}>
                  <Text style={styles.movieTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeFavorite(item.id)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={28} color="#E50914" />
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0D1B2A", // Xanh dương đậm
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E1DD", // Màu trắng xám
    textAlign: "center",
    marginBottom: 15,
  },
  noFavorites: {
    fontSize: 18,
    textAlign: "center",
    color: "#A1A1A1", // Màu xám nhẹ
    marginTop: 20,
  },
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B263B", // Xanh navy
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  movieDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  movieImage: {
    width: 90,
    height: 130,
    borderRadius: 10,
    marginRight: 14,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E0E1DD", // Màu chữ trắng xám
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#E50914",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
});

export default Favorite;
