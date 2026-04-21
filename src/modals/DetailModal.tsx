import React from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { styles } from "../styles/appStyles";
import { Item } from "../types/marketplace";

type Props = {
  item: Item | null;
  wishlist: Set<number>;
  onClose: () => void;
  onToggleWishlist: (id: number) => void;
};

export function DetailModal({ item, wishlist, onClose, onToggleWishlist }: Props) {
  return (
    <Modal visible={!!item} animationType="slide">
      <SafeAreaView style={styles.modal}>
        {item && (
          <ScrollView>
            <View style={styles.rowBetween}>
              <Pressable onPress={onClose}>
                <Ionicons name="arrow-back" size={22} color="#e8e0d0" />
              </Pressable>
              <Pressable onPress={() => onToggleWishlist(item.id)}>
                <MaterialCommunityIcons
                  name={wishlist.has(item.id) ? "heart" : "heart-outline"}
                  size={20}
                  color={wishlist.has(item.id) ? "#d4af37" : "#e8e0d0"}
                />
              </Pressable>
            </View>
            <View style={styles.bigIconWrap}>
              <MaterialCommunityIcons name={item.icon as any} size={90} color="#d4af37" />
            </View>
            <Text style={styles.badge}>{item.tag}</Text>
            <Text style={styles.detailTitle}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="store-outline" size={14} color="#8f8a81" />
              <Text style={styles.meta}>{item.seller}</Text>
            </View>
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color="#8f8a81" />
              <Text style={styles.meta}>{item.loc}</Text>
            </View>
            <View style={styles.descriptionCard}>
              <Text style={styles.collectionName}>Description</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
            <Pressable style={styles.ctaButton} onPress={onClose}>
              <Text style={styles.ctaText}>Inquire Now</Text>
            </Pressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}
