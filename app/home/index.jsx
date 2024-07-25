import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImageGrid from "../../components/imageGrid";
import debounce from "lodash/debounce";
import FiltersModel from "../../components/filtersModel";
import { useRouter } from "expo-router";

var page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const modelRef = useRef(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [image, setImage] = useState([]);
  const searchInputRef = useRef(null);
  const [filters, setFilters] = useState(null);
  const scrollRef = useRef(null);
  const [endIsReached, setEndIsReached] = useState(false);

  const router = useRouter();

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
    clearSearch();
    setImage([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };

    if (category) params.category = category;
    fetchImages(params, false);
  };

  const fetchImages = async (params = { page: 1 }, append = true) => {
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      if (append) setImage([...image, ...res.data.hits]);
      else setImage([...res.data.hits]);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);

    if (text.length > 2) {
      page = 1;
      setImage([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }
    if (text == "") {
      page = 1;
      searchInputRef?.current?.clear();
      setActiveCategory(null);
      setImage([]);
      fetchImages({ page, ...filters }, false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  const handleSearchDebounced = useCallback(debounce(handleSearch, 400), []);

  const openFiltersModel = () => {
    modelRef?.current?.present();
  };

  const closeFiltersModel = () => {
    modelRef?.current?.dismiss();
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImage([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModel();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImage([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModel();
  };

  const clearThisFilter = (filterName) => {
    let filterZ = { ...filters };
    delete filterZ[filterName];
    setFilters(filterZ);
    page = 1;
    setImage([]);
    let params = {
      page,
      ...filterZ,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleScoll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset > bottomPosition - 1) {
      if (!endIsReached) {
        setEndIsReached(true);
        page++;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (endIsReached) {
      setEndIsReached(false);
    }
  };

  const handelScrollUp = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handelScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModel}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScoll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            style={styles.searchInput}
            ref={searchInputRef}
            onChangeText={handleSearchDebounced}
          />
          {search && (
            <Pressable
              style={styles.closeIcon}
              onPress={() => handleSearch("")}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleCategoryPress={handleCategoryPress}
          />
        </View>

        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key == "colors" ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      ></View>
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}

                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View>{image.length > 0 && <ImageGrid images={image} router={router} />}</View>

        <View
          style={{ marginBottom: 70, marginTop: image.length > 0 ? 10 : 17 }}
        >
          <ActivityIndicator size="large" color={theme.colors.neutral(0.3)} />
        </View>
      </ScrollView>

      <FiltersModel
        modelRef={modelRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModel}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 8,
    flexDirection: "row",
    borderRadius: theme.radius.sm,
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),
    textTransform: "capitalize",
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});

export default HomeScreen;
