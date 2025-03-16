import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFavoriteActions } from "../utils/useFavoriteActions";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "../component/ProductCard";
import Filtler from "../component/Filtler";
import Loading from "../component/Loading";
import Header from "../component/Header";
import { getData } from "../api/apiService";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function Favorite() {
  const { loadFavorites, removeAllfavoriteList, removeProductTofavorite } =
    useFavoriteActions();
  const [productList, setProductList] = useState([]);
  const [displayProductData, setDisplayProductData] = useState([]);
  const [favorIdxList, setFavorIdxList] = useState([]);
  const [loading, setLoading] = useState(false);
  //filter
  const [searchValue, setSearchValue] = useState("");
  const [choosedBrand, setChoosedBrand] = useState("all");

  useFocusEffect(
    useCallback(() => {
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
    handleFilter();
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

  const handleFilter = () => {
    const updatedProductData = productList.filter((product) => {
      const matchesBrand =
        choosedBrand === "all" || product.packaging === choosedBrand;
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      return matchesBrand && matchesSearch && favorIdxList.includes(product.id);
    });

    setDisplayProductData(updatedProductData);
  };

  const toggleFavorite = async (item) => {
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
  };

  const deleteAll = async () => {
    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to remove all`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await removeAllfavoriteList();
            await loadFavoritesList();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Header title={"Yêu thích"} />
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
              <ProductCard
                product={item}
                toggleFavorite={toggleFavorite}
                cardType={"favorite"}
              />
            )}
            keyExtractor={(item) => item?.id}
            style={{ marginBottom: HEIGHT * 0.08 }}
          />
        ) : (
          <Text style={styles.empty}>Empty list</Text>
        )}

        {favorIdxList.length !== 0 && (
          <TouchableOpacity onPress={deleteAll} style={styles.deleteAllButton}>
            <Icon name={"delete-forever-outline"} size={28} color={"red"} />
          </TouchableOpacity>
        )}
      </>
      {loading && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
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
  deleteAllButton: {
    position: "absolute",
    right: "10%",
    bottom: HEIGHT * 0.125,
    padding: 16,
    borderRadius: 50,
    backgroundColor: "white",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
