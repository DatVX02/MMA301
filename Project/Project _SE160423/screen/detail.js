import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../component/Header";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFavoriteActions } from "../utils/useFavoriteActions";
import { useCartActions } from "../utils/useCartActions"; // Import quản lý giỏ hàng
import { useFocusEffect } from "@react-navigation/native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function Detail({ route }) {
  const [product, setProduct] = useState(route?.params?.product);
  const [favorIdxList, setFavorIdxList] = useState([]);
  const { loadFavorites, addProductTofavorite, removeProductTofavorite } =
    useFavoriteActions();
  const { addProductToCart } = useCartActions(); // Lấy chức năng thêm vào giỏ hàng

  useEffect(() => {
    setProduct(route?.params?.product);
  }, [route?.params?.product]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await loadFavoritesList();
      };
      fetchData();
    }, [])
  );

  const loadFavoritesList = async () => {
    const favorites = await loadFavorites();
    setFavorIdxList(favorites);
  };

  const toggleFavorite = async (item) => {
    if (favorIdxList.includes(item.id)) {
      Alert.alert(
        "Confirm Removal",
        `Are you sure you want to remove "${item.productName}" from your favorites?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: async () => {
              await removeProductTofavorite(item);
              await loadFavoritesList();
              setProduct({ ...product, favorite: false });
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      await addProductTofavorite(item);
      await loadFavoritesList();
      setProduct({ ...product, favorite: true });
    }
  };

  // ✅ Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async () => {
    await addProductToCart(product);
    Alert.alert(
      "Thành công!",
      `"${product.productName}" đã được thêm vào giỏ hàng.`
    );
  };

  function formatPrice(price) {
    return new Intl.NumberFormat("de-DE").format(price);
  }

  return (
    <View style={styles.container}>
      <Header title={"Detail"} />
      <View style={styles.detailContainer}>
        <View style={styles.imageContainer}>
          <View style={styles.imageBorder}>
            <Image
              source={{ uri: product?.image }}
              style={styles.productCardImg}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Product Name:</Text>
          <Text>{product?.productName}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>LimitTimeDeal:</Text>
          <Text>{(product?.limitTimeDeal * 100).toFixed()}%</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Cover:</Text>
          <Text>
            {product?.cover}{" "}
            {product?.packaging === "tube" || product?.packaging === "bottle"
              ? "ml"
              : "tablets"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Price:</Text>
          <Text>{formatPrice(product?.price)} VND</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Nation:</Text>
          <Text>{product?.nation}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Category:</Text>
          <Text>{product?.category}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Packaging:</Text>
          <Text>{product?.packaging}</Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* Nút Add to Favorite */}
          {/* <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(product)}
          >
            <Text style={styles.buttonText}>
              {!product?.favorite ? "Add to Favorite" : "Remove from Favorite"}
            </Text>
            <Icon
              name={
                product?.favorite ? "heart-multiple" : "heart-multiple-outline"
              }
              size={28}
              color={product?.favorite ? "red" : "#544C4C"}
            />
          </TouchableOpacity> */}

          {/* ✅ Nút Add to Cart */}
          <TouchableOpacity style={styles.cartButton} onPress={addToCart}>
            <Text style={styles.buttonText}>Add to Cart</Text>
            <Icon name={"cart"} size={28} color={"green"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  detailContainer: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  imageContainer: {
    height: HEIGHT * 0.2,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  imageBorder: {
    padding: 4,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "rgba(0,0,0,0.5)",
  },
  productCardImg: {
    height: HEIGHT * 0.18,
    width: HEIGHT * 0.18,
    borderRadius: 8,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  favoriteButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "red",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 10,
  },
  cartButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "green",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
});
