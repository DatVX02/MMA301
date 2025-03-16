import React, { useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Profile = () => {
    const userData = {
        name: "Vo Xuan Dat",
        email: "datvxse160423@fpt.edu.vn",
        phone: "0338974114",
        dob: "13/2/2002",
    };

    const [favoriteMovies, setFavoriteMovies] = useState([]);

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

    const handleLogout = () => {
        Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
            { text: "Hủy", style: "cancel" },
            { text: "Đăng xuất", onPress: () => console.log("Đăng xuất thành công!") },
        ]);
    };

    return (
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0irgjGV82yk4HfNp8xz2IZtwMVm6uzJo9KQ&s",
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <InfoItem icon="phone" label="Số Điện Thoại" value={userData.phone} />
          <InfoItem icon="cake" label="Ngày Sinh" value={userData.dob} />
          <InfoItem
            icon="favorite"
            label="Phim Yêu Thích"
            value={`${favoriteMovies.length}`}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#FFF" />
          <Text style={styles.logoutText}>Đăng Xuất</Text>
        </TouchableOpacity>
      </View>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <MaterialIcons name={icon} size={24} color="#1E90FF" />
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0D1B2A", // Xanh đậm hiện đại
    alignItems: "center",
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#1B263B", // Xanh navy
    padding: 20,
    borderRadius: 15,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#00A8E8",
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E0E1DD",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#AAB7C4",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#1B263B",
    padding: 15,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  infoLabel: {
    fontSize: 16,
    color: "#E0E1DD",
    marginLeft: 10,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: "#00A8E8", // Xanh biển sáng
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#E63946", // Đỏ hiện đại
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    justifyContent: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
});


export default Profile;
