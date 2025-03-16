import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Fontisto";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function Filtler({
  productList = [],
  searchValue,
  setSearchValue,
  choosedPackaging,
  setChoosedPackaging,
}) {
  const [packagingList, setPackagingList] = useState([]);

  useEffect(() => {
    setPackagingList([
      "all",
      ...new Set(productList.map((item) => item.packaging)),
    ]);
  }, [productList]);

  const PackagingItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => setChoosedPackaging(item)}
        style={{
          ...styles.packagingItem,
          backgroundColor: choosedPackaging === item ? "#2CAD5E" : "white",
          borderColor: choosedPackaging === item ? "#2CAD5E" : "black",
        }}
      >
        <Text
          style={
            choosedPackaging === item
              ? styles.selectedPackaging
              : styles.packagingText
          }
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Icon name={"search"} size={28} color={"#544C4C"} />
        <TextInput
          style={styles.searchInputField}
          placeholder="Search"
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
      <FlatList
        data={packagingList}
        renderItem={({ item }) => <PackagingItem item={item} />}
        keyExtractor={(item) => item}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: HEIGHT * 0.02, width: WIDTH }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
    paddingHorizontal: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    height: WIDTH * 0.12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#002140",
    marginVertical: 12,
    alignItems: "center",
    gap: 12,
  },
  searchInputField: {
    flex: 1,
  },
  packagingItem: {
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 50,
  },
  packagingText: {
    fontWeight: "semibold",
    textTransform: "capitalize",
  },
  selectedPackaging: {
    fontWeight: "semibold",
    color: "white",
    textTransform: "capitalize",
  },
});
