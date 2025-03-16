import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert, // Thêm Alert để hiển thị thông báo
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useCartActions } from "../utils/useCartActions";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function ProductCard({ product, toggleFavorite, cardType }) {
  const navigation = useNavigation();
  const [productDetail, setProductDetail] = useState(product || {});
  const { addProductToCart } = useCartActions();

  useEffect(() => {
    setProductDetail(product);
  }, [product]);

  function formatPrice(price) {
    return new Intl.NumberFormat("de-DE").format(price);
  }

  // Hàm xử lý khi thêm vào giỏ hàng
  const handleAddToCart = async () => {
    await addProductToCart(productDetail);
    Alert.alert(
      "Thành công!",
      `"${productDetail.productName}" đã được thêm vào giỏ hàng.`
    );
  };

  return (
    <View style={styles.productCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate("detail", { product: product })}
      >
        <Image
          source={{ uri: productDetail?.image }}
          style={styles.productCardImg}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.productCardInfo}>
        <TouchableOpacity
          onPress={() => navigation.navigate("detail", { product: product })}
        >
          <Text style={styles.productCardInfoTitle}>
            {productDetail?.productName}
          </Text>
        </TouchableOpacity>
        <Text style={styles.productCardInfoLimited}>
          Price: {formatPrice(productDetail?.price)} VND
        </Text>
        <Text style={styles.productCardInfoLimited}>
          LimitTimeDeal: {(productDetail?.limitTimeDeal * 100).toFixed()}%
        </Text>

        <View style={styles.productCardActions}>
          {/* Nút Favorite */}
          {/* <TouchableOpacity
            style={styles.productCardInfoFavor}
            onPress={() => toggleFavorite(productDetail)}
          >
            <Icon
              name={
                productDetail?.favorite
                  ? "heart-multiple"
                  : "heart-multiple-outline"
              }
              size={28}
              color={productDetail?.favorite ? "red" : "#544C4C"}
            />
          </TouchableOpacity> */}

          {/* Nút Add to Cart */}
          <TouchableOpacity
            style={styles.productCardInfoAdd}
            onPress={handleAddToCart}
          >
            <Icon name={"cart"} size={28} color={"green"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    flex: 1,
    flexDirection: "row",
    height: HEIGHT * 0.2,
    padding: 12,
    borderRadius: 12,
    margin: 12,
    gap: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productCardImg: {
    height: HEIGHT * 0.2 - 24,
    width: HEIGHT * 0.2 - 24,
  },
  productCardInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  productCardInfoTitle: {
    fontWeight: "bold",
  },
  productCardInfoFavor: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "red",
    backgroundColor: "#fff",
    marginRight: 10,
  },
  productCardInfoAdd: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "green",
    backgroundColor: "#fff",
  },
  productCardActions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
  },
});
