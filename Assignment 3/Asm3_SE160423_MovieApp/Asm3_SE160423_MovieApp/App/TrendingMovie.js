import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL, API_KEY } from "@env";

const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/trending/movie/day?api_key=${API_KEY}&language=vi-VN`
      );
      const data = await response.json();
      setTrendingMovies(data.results);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query) => {
    if (!query) {
      fetchTrendingMovies();
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=vi-VN`
      );
      const data = await response.json();
      setTrendingMovies(data.results || []);
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm phim..."
        placeholderTextColor="#AAA"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          searchMovies(text);
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FF5733" />
      ) : (
        <FlatList
          data={trendingMovies}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.movieCard}
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
              <View style={styles.movieDetails}>
                <Text style={styles.movieTitle}>{item.title}</Text>
                <Text style={styles.releaseDate}>📅 {item.release_date}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E3A5F", // Thay đổi màu nền sang xanh đậm
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFD700", // Màu vàng nổi bật
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  searchBar: {
    height: 50,
    backgroundColor: "#2C3E50",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#FFF",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  movieCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34495E",
    padding: 20,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  movieImage: {
    width: 130,
    height: 190,
    borderRadius: 20,
    marginRight: 20,
  },
  movieDetails: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  releaseDate: {
    fontSize: 16,
    color: "#FFD700",
  },
});

export default Trending;
