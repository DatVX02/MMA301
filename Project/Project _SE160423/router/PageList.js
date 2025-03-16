import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Detail from "../screen/detail";
import Favorite from "../screen/favorite";
import Home from "../screen/home";
import Addtocart from "../screen/Addtocart";

export const PageList = [
  {
    name: "home",
    component: Home,
    options: {
      tabBarIcon: ({ color, focused }) => (
        <Icon name="home-outline" size={32} color={color} />
      ),
      headerShown: false,
    },
  },
  {
    name: "detail",
    component: Detail,
    options: {
      tabBarButton: () => null,
    },
    hiddenBottomTab: true,
  },

  {
    name: "favorite",
    component: Favorite,
    options: {
      tabBarIcon: ({ color, focused }) => (
        <Icon name="heart-multiple-outline" size={32} color={color} />
      ),
      headerShown: false,
      // iconStyles: { transform: [{ translateX: -25 }] },
    },
  },
  {
    name: "Cart",
    component: Addtocart,
    options: {
      tabBarIcon: ({ color, focused }) => (
        <Icon name="cart" size={32} color={color} />
      ),
      headerShown: false,
      // iconStyles: { transform: [{ translateX: -25 }] },
    },
  },
];
