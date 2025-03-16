import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCartActions } from "../utils/useCartActions";

export default function CheckoutScreen({ route, navigation }) {
  const { cartItems, totalCartPrice } = route.params;
  const { clearCart } = useCartActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async () => {
    if (!name || !email || !address) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return;
    }

    await clearCart(); // ✅ Xóa giỏ hàng sau khi thanh toán

    const productDetails = cartItems
      .map(
        (item) =>
          `- ${item.productName} (SL: ${
            item.quantity
          }) - ${new Intl.NumberFormat("de-DE").format(
            item.price * item.quantity
          )} VND`
      )
      .join("\n");

    Alert.alert(
      "Thanh toán thành công!",
      `Cảm ơn ${name}, đơn hàng sẽ được giao đến: ${address}.
      \nTổng tiền: ${totalCartPrice.toLocaleString()} VND
      \nSản phẩm của bạn:\n${productDetails}`,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("home", { refresh: true });
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Thông tin Thanh Toán</Text>

        <Text style={styles.label}>Họ và Tên:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên của bạn"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Địa chỉ giao hàng:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ giao hàng"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.title}>Sản phẩm thanh toán:</Text>

        {/* ✅ Danh sách sản phẩm dùng FlatList (không bọc trong ScrollView) */}
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.itemTotalText}>
                  Số lượng: {item.quantity} -{" "}
                  {new Intl.NumberFormat("de-DE").format(
                    item.price * item.quantity
                  )}{" "}
                  VND
                </Text>
              </View>
            </View>
          )}
          ListFooterComponent={
            <>
              <Text style={styles.totalText}>
                Tổng tiền: {totalCartPrice.toLocaleString()} VND
              </Text>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Hoàn tất Thanh Toán</Text>
              </TouchableOpacity>
            </>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});
