import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, API_KEY } from "@env";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { WebView } from "react-native-webview";

const Detail = () => {
  const route = useRoute();
  const { movieId } = route.params;
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    fetchMovieDetail();
    fetchMovieTrailer();
    loadFavorites();
  }, []);

  const fetchMovieDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=vi-VN`
      );
      const data = await response.json();
      setMovieDetail(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setLoading(false);
    }
  };

  const fetchMovieTrailer = async () => {
    try {
      const response = await fetch(
        `${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=vi-VN`
      );
      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favoriteMovies");
      setFavoriteMovies(storedFavorites ? JSON.parse(storedFavorites) : []);
    } catch (error) {
      console.error("Error loading favorite movies:", error);
    }
  };

  const isFavorite = favoriteMovies.some((movie) => movie.id === movieId);

  const toggleFavorite = async () => {
    try {
      let updatedFavorites = [...favoriteMovies];
      if (isFavorite) {
        updatedFavorites = updatedFavorites.filter(
          (movie) => movie.id !== movieId
        );
      } else {
        updatedFavorites.push({
          id: movieDetail.id,
          title: movieDetail.title,
          poster_path: movieDetail.poster_path,
        });
      }
      await AsyncStorage.setItem(
        "favoriteMovies",
        JSON.stringify(updatedFavorites)
      );
      setFavoriteMovies(updatedFavorites);
    } catch (error) {
      console.error("Error updating favorite movies:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movieDetail && (
        <>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`,
            }}
            style={styles.movieImage}
          />
          <View style={styles.header}>
            <Text style={styles.title}>{movieDetail.title}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              {isFavorite ? (
                <MaterialIcons name="favorite" size={30} color="#E50914" />
              ) : (
                <MaterialIcons name="favorite-border" size={30} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            📅 Ngày phát hành: {movieDetail.release_date}
          </Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={24} color="#FFD700" />
            <Text style={styles.ratingText}>
              {movieDetail.vote_average.toFixed(1)} / 10 (
              {movieDetail.vote_count} đánh giá)
            </Text>
          </View>
          <Text style={styles.overview}>{movieDetail.overview}</Text>
          {trailerKey && (
            <View style={styles.trailerContainer}>
              <Text style={styles.trailerTitle}>🎬 Trailer</Text>
              <WebView
                source={{ uri: `https://www.youtube.com/embed/${trailerKey}` }}
                style={styles.trailer}
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0A192F", // Xanh đậm hiện đại
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  movieImage: {
    width: "100%",
    height: 450,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E0E1DD", // Màu trắng xám
    flex: 1,
  },
  subtitle: {
    fontSize: 17,
    color: "#AAB7C4", // Màu xám nhạt
    marginVertical: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#F8F9FA", // Màu trắng sáng hơn
    marginLeft: 6,
  },
  overview: {
    fontSize: 17,
    color: "#D1D5DB", // Màu trắng nhạt hơn để dễ đọc
    marginVertical: 12,
    lineHeight: 24,
  },
  trailerContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  trailerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E0E1DD",
    marginBottom: 12,
  },
  trailer: {
    width: "100%",
    height: 260,
    borderRadius: 10,
  },
});

export default Detail;
