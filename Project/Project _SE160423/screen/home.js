import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../component/Header";
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../component/ProductCard";
import { useFavoriteActions } from "../utils/useFavoriteActions";
import Filtler from "../component/Filtler";
import Loading from "../component/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { getData } from "../api/apiService";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function Home() {
  const { loadFavorites, addProductTofavorite, removeProductTofavorite } =
    useFavoriteActions();
  const [productList, setProductList] = useState([]);
  const [displayProductData, setDisplayProductData] = useState([]);
  const [favorIdxList, setFavorIdxList] = useState([]);
  const [loading, setLoading] = useState(false);
  //filter
  const [searchValue, setSearchValue] = useState("");
  const [choosedBrand, setChoosedBrand] = useState("all");

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true); // Start loading
        await loadProductsList();
        await loadFavoritesList();
        setLoading(false); // End loading
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    // Check if the product list has changed and if we need to filter based on search and selected brand
    const updatedProductData = productList
      .filter((product) => {
        const matchesBrand =
          choosedBrand === "all" || product.packaging === choosedBrand;
        const matchesSearch = product.productName
          ?.toLowerCase()
          ?.includes(searchValue.toLowerCase());
        return matchesBrand && matchesSearch;
      })
      .map((product) => ({
        ...product,
        favorite: favorIdxList.includes(product.id),
      }))
      .sort((a, b) => a.id - b.id); // Sort by `id` in ascending order

    setDisplayProductData(updatedProductData);
  }, [productList, favorIdxList, searchValue, choosedBrand]);

  const loadProductsList = async () => {
    const response = await getData();

    if (response?.status === 200) {
      setProductList(response?.data);
    }
  };

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
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await removeProductTofavorite(item); // Call remove function
              await loadFavoritesList(); // Reload the favorites list
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      await addProductTofavorite(item);
      await loadFavoritesList();
    }
  };

  return (
    <View style={styles.container}>
      <Header title={"Trang chủ"} />
      {/* <Text>Product List</Text> */}

      <>
        <Filtler
          productList={productList}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          choosedPackaging={choosedBrand}
          setChoosedPackaging={setChoosedBrand}
        />

        {displayProductData.length > 0 ? (
          <FlatList
            data={displayProductData}
            renderItem={({ item }) => (
              <ProductCard product={item} toggleFavorite={toggleFavorite} />
            )}
            keyExtractor={(item) => item?.id}
            style={{ marginBottom: HEIGHT * 0.08 }}
          />
        ) : (
          <Text style={styles.empty}>Empty list</Text>
        )}
      </>
      {loading && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  productCard: {
    width: "100%",
  },
  empty: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
});
