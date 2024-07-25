import { Pressable, StyleSheet, Text, View } from "react-native";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";

export const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.content}>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({
  data,
  filters = {},
  setFilters,
  filterName,
}) => {
  const onselect = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          return (
            <Pressable
              key={index}
              style={[
                styles.outlineButton,
                {
                  backgroundColor: isActive
                    ? theme.colors.neutral(0.7)
                    : "white",
                },
              ]}
              onPress={() => onselect(item)}
            >
              <Text
                style={[
                  styles.outlineButtonText,
                  { color: isActive ? "white" : theme.colors.neutral(0.7) },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilterRow = ({
  data,
  filters = {},
  setFilters,
  filterName,
}) => {
  const onselect = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let borderColor = isActive ? theme.colors.neutral(0.4) : "white";
          return (
            <Pressable key={index} onPress={() => onselect(item)}>
              <View style={[styles.colorWrapper, {borderColor}]}>
                <View style={[styles.color, {backgroundColor: item}]} />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8),
    textTransform: "capitalize",
  },
  flexRowWrap: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outlineButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: theme.radius.xs,
    borderColor: theme.colors.grayBG,
    borderCurve: "continuous",
  },
  outlineButtonText: {
    textTransform: "capitalize",
  },
  color: {
    width: 40,
    height: 30,
    borderRadius: theme.radius.sm-3,
    borderCurve: "continuous",
  },
  colorWrapper: {
    padding: 3,
    borderWidth: 2,
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
  }
});
