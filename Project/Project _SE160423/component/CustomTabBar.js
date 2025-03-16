// CustomTabBar.js
import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PageList } from "../router/PageList";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const routeItem = useMemo(() => {
    return PageList[state.index];
  }, [state.index]);

  if (routeItem.hiddenBottomTab) return;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: HEIGHT * 0.08,
        // backgroundColor: "white",
      }}
    >
      {/* Gradient Background */}
      <LinearGradient
        colors={["#2CAD5E", "#2CAD5E"]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: "100%",
          alignItems: "center",
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Skip rendering if tabBarButton is hidden
          if (
            options.tabBarButton &&
            typeof options.tabBarButton === "function"
          ) {
            return null;
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: "center", ...options.iconStyles }}
            >
              {options.tabBarIcon
                ? options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused
                      ? options?.activeColor
                        ? options?.activeColor
                        : "#75E00A"
                      : options?.inactiveColor
                      ? options?.inactiveColor
                      : "#ffffff",
                    size: 32,
                  })
                : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
