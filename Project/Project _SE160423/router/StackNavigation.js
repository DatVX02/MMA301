import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "../router/TabNavigation"; // Điều hướng chính
import Addtocart from "../screen/Addtocart";
import CheckoutScreen from "../screen/CheckoutScreen"; // Đảm bảo đường dẫn đúng

const Stack = createStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Giỏ hàng " component={Addtocart} />
        <Stack.Screen name="Thanh toán" component={CheckoutScreen} />
      </Stack.Navigator>
  );
}
