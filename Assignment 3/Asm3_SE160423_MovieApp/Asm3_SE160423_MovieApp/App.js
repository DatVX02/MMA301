import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Trending from "./App/TrendingMovie";
import Detail from "./App/DetailMovie";
import Favorite from "./App/FavoriteMovie";
import Profile from "./App/ProfileMovie";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#181818", borderTopWidth: 0 },
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: "#BBB",
        headerStyle: { backgroundColor: "#181818" },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "bold" },
        tabBarIcon: ({ color, size }) => {
          let iconName = "";
          if (route.name === "Trending Movie") iconName = "home";
          if (route.name === "Favorite Movie") iconName = "favorite";
          if (route.name === "Profile Movie") iconName = "person";
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Trending Movie"
        component={Trending}
        
      />

      <Tab.Screen
        name="Favorite Movie"
        component={Favorite}
        
      />

      <Tab.Screen
        name="Profile Movie"
        component={Profile}
       
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#181818" },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainNavigation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="DetailMovie"
        component={Detail}
        options={{ title: "Movie details" }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
