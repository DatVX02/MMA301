import React, { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../component/Header";
import { useCartActions } from "../utils/useCartActions";
import Loading from "../component/Loading";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function Addtocart({ route }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // ✅ Kiểm tra nếu màn hình được focus lại
  const { loadCart, removeProductFromCart, clearCart, updateProductQuantity } =
    useCartActions();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused || route.params?.refresh) {
      // ✅ Làm mới giỏ hàng khi quay lại từ Checkout
      fetchCart();
    }
  }, [isFocused, route.params?.refresh]);

  const fetchCart = async () => {
    setLoading(true);
    const cart = await loadCart();
    setCartItems(cart);
    setLoading(false);
  };

  const changeQuantity = async (product, action) => {
    let newQuantity = product.quantity;
    if (action === "increase") {
      newQuantity += 1;
    } else if (action === "decrease" && product.quantity > 1) {
      newQuantity -= 1;
    }

    await updateProductQuantity(product, newQuantity);
    setCartItems(await loadCart());
  };

  const removeItem = async (product) => {
    await removeProductFromCart(product);
    setCartItems((prevCartItems) =>
      prevCartItems.filter((cartItem) => cartItem.id !== product.id)
    );
  };

  const totalCartPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigation.navigate("Thanh toán", { cartItems, totalCartPrice });
  };

  return (
    <View style={styles.container}>
      <Header title={"Giỏ hàng"} />
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.productName}</Text>
                  <View style={styles.quantityContainer}>
                    {/* Nút Giảm số lượng */}
                    <TouchableOpacity
                      onPress={() => changeQuantity(item, "decrease")}
                    >
                      <Icon name="minus-circle-outline" size={28} color="red" />
                    </TouchableOpacity>

                    {/* Hiển thị số lượng */}
                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    {/* Nút Tăng số lượng */}
                    <TouchableOpacity
                      onPress={() => changeQuantity(item, "increase")}
                    >
                      <Icon
                        name="plus-circle-outline"
                        size={28}
                        color="green"
                      />
                    </TouchableOpacity>

                    <Text style={styles.itemTotalText}>
                      {new Intl.NumberFormat("de-DE").format(
                        item.price * item.quantity
                      )}{" "}
                      VND
                    </Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item?.id}
          />

          <View style={styles.cartSummary}>
            <Text style={styles.totalText}>
              Tổng: {new Intl.NumberFormat("de-DE").format(totalCartPrice)} VND
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Thanh Toán</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.empty}>Giỏ hàng trống</Text>
      )}
      {loading && <Loading />}
    </View>
  );
}

// ✅ Styles cho giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  empty: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    margin: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  itemTotalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 130
  },
  cartSummary: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  checkoutButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
