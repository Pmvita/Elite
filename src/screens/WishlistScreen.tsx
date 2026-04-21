import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { styles } from "../styles/appStyles";
import { Item } from "../types/marketplace";

type Props = {
  items: Item[];
  onToggleWishlist: (id: number) => void;
  onOpenDetail: (item: Item) => void;
};

export function WishlistScreen({ items, onToggleWishlist, onOpenDetail }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionHeader}>Wishlist</Text>
      {!items.length ? (
        <Text style={styles.emptyText}>No saved items yet. Tap hearts to add favorites.</Text>
      ) : (
        items.map((item) => (
          <Pressable key={item.id} style={styles.collectionCard} onPress={() => onOpenDetail(item)}>
            <MaterialCommunityIcons name={item.icon as any} size={20} color="#d4af37" />
            <View style={{ flex: 1 }}>
              <Text style={styles.collectionName}>{item.name}</Text>
              <Text style={styles.meta}>{item.price}</Text>
            </View>
            <Pressable onPress={() => onToggleWishlist(item.id)}>
              <MaterialCommunityIcons name="heart" size={20} color="#d4af37" />
            </Pressable>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
