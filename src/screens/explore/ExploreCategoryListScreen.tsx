import React from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { styles } from "../../styles/appStyles";
import { exploreStyles } from "../../styles/exploreStyles";
import { dbCategories } from "../../data/dbCategories";

type Props = {
  onOpenCategory: (categoryKey: string) => void;
};

export function ExploreCategoryListScreen({ onOpenCategory }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionHeader}>Explore</Text>
      <Text style={styles.itemDesc}>Tap a category to open its listings.</Text>

      <View style={styles.dbCategoryWrap}>
        {dbCategories.map((category) => (
          <Pressable
            key={category.key}
            onPress={() => onOpenCategory(category.key)}
            android_ripple={{ color: "rgba(212,175,55,0.15)", borderless: false }}
            style={({ pressed }) => [
              exploreStyles.categoryCard,
              Platform.OS !== "android" && pressed && exploreStyles.categoryCardPressed,
            ]}
          >
            <View style={styles.rowBetween}>
              <Text style={styles.collectionName}>{category.label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#8f8a81" />
            </View>
            <Text style={styles.meta}>{category.count} item(s)</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
