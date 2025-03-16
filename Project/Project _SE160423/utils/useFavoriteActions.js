import AsyncStorage from "@react-native-async-storage/async-storage";

export const useFavoriteActions = () => {
  const loadFavorites = async () => {
    try {
      const storedFavorList = await AsyncStorage.getItem("favorList");
      return storedFavorList ? JSON.parse(storedFavorList) : [];
    } catch (error) {
      console.log("Error loading favorList from AsyncStorage:", error);
      return [];
    }
  };

  const addProductTofavorite = async (item) => {
    try {
      const favorList = await loadFavorites();
      if (!favorList.includes(item)) {
        const updatedList = [...favorList, item.id];
        await AsyncStorage.setItem("favorList", JSON.stringify(updatedList));
      }
    } catch (error) {
      console.log("Error saving favorList to AsyncStorage:", error);
    }
  };

  const removeProductTofavorite = async (item) => {
    try {
      const favorList = await loadFavorites();
      const updatedList = favorList?.filter((id) => id !== item.id);
      await AsyncStorage.setItem("favorList", JSON.stringify(updatedList));
    } catch (error) {
      console.log("Error saving favorList to AsyncStorage:", error);
    }
  };

  const removeAllfavoriteList = async () => {
    try {
      await AsyncStorage.removeItem("favorList");
    } catch (error) {
      console.log("Error saving favorList to AsyncStorage:", error);
    }
  };

  return {
    loadFavorites,
    addProductTofavorite,
    removeProductTofavorite,
    removeAllfavoriteList,
  };
};
