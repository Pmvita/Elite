import React from "react";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TabId } from "../types/marketplace";
import { styles } from "../styles/appStyles";

const tabs: { id: TabId; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { id: "home", icon: "home-outline", label: "Home" },
  { id: "explore", icon: "compass-outline", label: "Explore" },
  { id: "wishlist", icon: "heart-outline", label: "Wishlist" },
  { id: "profile", icon: "person-outline", label: "Profile" },
];

type Props = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

export function BottomNav({ activeTab, onChange }: Props) {
  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab) => (
        <Pressable key={tab.id} style={styles.bottomItem} onPress={() => onChange(tab.id)}>
          <Ionicons name={tab.icon} size={16} color={activeTab === tab.id ? "#d4af37" : "#8f8a81"} />
          <Text style={[styles.bottomText, activeTab === tab.id && styles.gold]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
