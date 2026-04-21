import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../styles/appStyles";

type Props = {
  onOpenSearch: () => void;
  onShowNotif: () => void;
  /** Signed-in: quick profile toast. Guest: open log in / sign up. */
  authLoading: boolean;
  isSignedIn: boolean;
  onOpenAuth: () => void;
  onShowProfileToast: () => void;
};

export function AppHeader({
  onOpenSearch,
  onShowNotif,
  authLoading,
  isSignedIn,
  onOpenAuth,
  onShowProfileToast,
}: Props) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>E</Text>
        </View>
        <Text style={styles.brandName}>Elite</Text>
      </View>
      <View style={styles.headerActions}>
        <Pressable onPress={onOpenSearch}>
          <Ionicons name="search-outline" size={20} color="#e8e0d0" />
        </Pressable>
        <Pressable onPress={onShowNotif}>
          <Ionicons name="notifications-outline" size={20} color="#e8e0d0" />
        </Pressable>
        {authLoading ? (
          <View style={styles.headerAuthSlot}>
            <ActivityIndicator size="small" color="#d4af37" />
          </View>
        ) : isSignedIn ? (
          <Pressable onPress={onShowProfileToast} hitSlop={8}>
            <Ionicons name="person-outline" size={20} color="#e8e0d0" />
          </Pressable>
        ) : (
          <Pressable onPress={onOpenAuth} hitSlop={6} style={styles.headerAuthSlot}>
            <Text style={styles.headerAuthText} numberOfLines={1}>
              Log in · Sign up
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
