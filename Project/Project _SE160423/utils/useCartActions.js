import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_STORAGE_KEY = "cart_items";

export const useCartActions = () => {
  // ✅ Lấy giỏ hàng từ AsyncStorage
  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      return [];
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addProductToCart = async (product) => {
    try {
      let cart = await loadCart();

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingIndex = cart.findIndex((item) => item.id === product.id);

      if (existingIndex !== -1) {
        // Nếu sản phẩm đã có, tăng số lượng
        cart[existingIndex].quantity += 1;
      } else {
        // Nếu chưa có, thêm vào giỏ hàng với số lượng ban đầu là 1
        cart.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };
  // ✅ Xóa sản phẩm khỏi giỏ hàng
  const removeProductFromCart = async (product) => {
    try {
      let cart = await loadCart();

      // Lọc bỏ sản phẩm khỏi giỏ hàng
      cart = cart.filter((item) => item.id !== product.id);

      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    }
  };

  
  // ✅ Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
    }
  };


  // ✅ Thêm hàm cập nhật số lượng sản phẩm
  const updateProductQuantity = async (product, newQuantity) => {
    try {
      let cart = await loadCart();

      // Tìm sản phẩm cần cập nhật
      const index = cart.findIndex((item) => item.id === product.id);
      if (index !== -1) {
        cart[index].quantity = newQuantity;
      }

      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
    }
  };

  return {
    loadCart,
    addProductToCart,
    removeProductFromCart,
    clearCart,
    updateProductQuantity,
  };
};
