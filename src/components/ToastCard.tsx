import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/appStyles";

type ToastType = "notif" | "profile";

type Props = {
  toast: ToastType | null;
  wishlistCount: number;
  /** When toast is profile, shown as the headline (e.g. signed-in name). */
  profileHeadline?: string;
  onClose: () => void;
};

export function ToastCard({ toast, wishlistCount, profileHeadline, onClose }: Props) {
  if (!toast) return null;

  const profileTitle = profileHeadline?.trim() || "Your profile";

  return (
    <View style={styles.toast}>
      <Text style={styles.collectionName}>{toast === "notif" ? "New Listing Alert" : profileTitle}</Text>
      <Text style={styles.itemDesc}>
        {toast === "notif"
          ? "A rare Patek Philippe just listed. Be the first to inquire."
          : `${wishlistCount} wishlist items.`}
      </Text>
      <Pressable onPress={onClose}>
        <Text style={styles.meta}>Close</Text>
      </Pressable>
    </View>
  );
}
