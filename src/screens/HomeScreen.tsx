import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { categories, collections } from "../data/catalogFromDb";
import { styles } from "../styles/appStyles";
import { Item } from "../types/marketplace";
import { SectionTitle } from "../components/SectionTitle";

function ListingPreview({
  previewUrl,
  icon,
  variant,
}: {
  previewUrl?: string | null;
  icon: string;
  variant: "hero" | "grid" | "arrival";
}) {
  const style =
    variant === "hero" ? styles.homePreviewHero : variant === "grid" ? styles.homePreviewGrid : styles.homePreviewArrival;

  if (previewUrl) {
    return <Image source={{ uri: previewUrl }} style={style} resizeMode="cover" accessibilityLabel="Listing preview" />;
  }

  const iconSize = variant === "hero" ? 52 : 28;
  return (
    <View style={[style, styles.homePreviewFallback]}>
      <MaterialCommunityIcons name={icon as any} size={iconSize} color="#d4af37" />
    </View>
  );
}

type Props = {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  featured: Item | null;
  trending: Item[];
  arrivals: Item[];
  wishlist: Set<number>;
  onToggleWishlist: (id: number) => void;
  onOpenDetail: (item: Item) => void;
};

export function HomeScreen({
  activeCategory,
  setActiveCategory,
  featured,
  trending,
  arrivals,
  wishlist,
  onToggleWishlist,
  onOpenDetail,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View>
        <Text style={styles.tagline}>THE WORLD'S FINEST</Text>
        <Text style={styles.title}>Discover</Text>
        <Text style={[styles.title, styles.gold]}>Extraordinary</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionGap}>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => setActiveCategory(cat.id)}
            style={[styles.categoryPill, activeCategory === cat.id && styles.categoryPillActive]}
          >
            <View style={styles.categoryContent}>
              <MaterialCommunityIcons name={cat.icon as any} size={14} color="#e8e0d0" />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {featured ? (
        <Pressable style={styles.featureCard} onPress={() => onOpenDetail(featured)}>
          <View style={styles.rowBetween}>
            <Text style={styles.badge}>{featured.tag}</Text>
            <Pressable onPress={() => onToggleWishlist(featured.id)}>
              <MaterialCommunityIcons
                name={wishlist.has(featured.id) ? "heart" : "heart-outline"}
                size={20}
                color={wishlist.has(featured.id) ? "#d4af37" : "#e8e0d0"}
              />
            </Pressable>
          </View>
          <ListingPreview previewUrl={featured.previewImageUrl} icon={featured.icon} variant="hero" />
          <Text style={styles.itemTitle}>{featured.name}</Text>
          <Text style={styles.itemDesc}>{featured.desc}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.price}>{featured.price}</Text>
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color="#8f8a81" />
              <Text style={styles.meta}>{featured.loc}</Text>
            </View>
          </View>
        </Pressable>
      ) : (
        <View style={styles.featureCard}>
          <Text style={styles.itemDesc}>No listings in your database yet. Add entries under db/*.json.</Text>
        </View>
      )}

      <SectionTitle title="Trending Now" />
      <View style={styles.grid}>
        {trending.map((item) => (
          <Pressable key={item.id} style={styles.gridCard} onPress={() => onOpenDetail(item)}>
            <View style={styles.rowBetween}>
              <Text style={styles.badgeSmall}>{item.tag}</Text>
              <Pressable onPress={() => onToggleWishlist(item.id)}>
                <MaterialCommunityIcons
                  name={wishlist.has(item.id) ? "heart" : "heart-outline"}
                  size={16}
                  color={wishlist.has(item.id) ? "#d4af37" : "#e8e0d0"}
                />
              </Pressable>
            </View>
            <ListingPreview previewUrl={item.previewImageUrl} icon={item.icon} variant="grid" />
            <Text style={styles.gridName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.gridPrice}>{item.price}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle title="New Arrivals" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {arrivals.map((item) => (
          <Pressable key={item.id} style={styles.arrivalCard} onPress={() => onOpenDetail(item)}>
            <ListingPreview previewUrl={item.previewImageUrl} icon={item.icon} variant="arrival" />
            <Text style={styles.gridName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.gridPrice}>{item.price}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={[styles.sectionHeader, styles.sectionGap]}>Curated Collections</Text>
      {collections.map((c) => (
        <View key={c.name} style={styles.collectionCard}>
          <View style={styles.collectionIconGroup}>
            {c.icons.map((name) => (
              <MaterialCommunityIcons key={name} name={name as any} size={18} color="#d4af37" />
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.collectionName}>{c.name}</Text>
            <Text style={styles.meta}>{c.count} items</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color="#8f8a81" />
        </View>
      ))}
    </ScrollView>
  );
}
