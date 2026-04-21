import React, { useEffect, useState } from "react";
import { Image, Modal, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DbItemRecord } from "../../data/dbCategories";
import { exploreStyles } from "../../styles/exploreStyles";
import { getExploreItemTitle, getImageUrls, isHttpUrlString, isListingUrlField, openListingUrl } from "./exploreItemUtils";

type Props = {
  visible: boolean;
  item: DbItemRecord | null;
  onClose: () => void;
};

export function ExploreItemDetailModal({ visible, item, onClose }: Props) {
  const { width } = useWindowDimensions();
  const pageW = width;
  const urls = item ? getImageUrls(item) : [];
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [item, visible]);

  if (!item) return null;

  const title = getExploreItemTitle(item);
  const rows = Object.entries(item as Record<string, unknown>).filter(
    ([k]) => k !== "images" && k !== "name" && k !== "displayName"
  );
  const imageW = Math.min(pageW - 32, 420);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : undefined}
      onRequestClose={onClose}
    >
      <View style={exploreStyles.modalRoot}>
        <View style={exploreStyles.modalHeader}>
          <Pressable onPress={onClose} style={exploreStyles.backHit} hitSlop={12}>
            <Ionicons name="close" size={26} color="#e8e0d0" />
          </Pressable>
          <Text style={exploreStyles.modalTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {urls.length > 0 ? (
          <View style={exploreStyles.modalGalleryWrap}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const x = e.nativeEvent.contentOffset.x;
                const next = Math.round(x / pageW);
                if (next !== page && next >= 0 && next < urls.length) setPage(next);
              }}
              scrollEventThrottle={16}
            >
              {urls.map((uri, i) => (
                <View
                  key={`img-${i}`}
                  style={{
                    width: pageW,
                    height: 220,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0a0a0a",
                  }}
                >
                  <Image
                    source={{ uri }}
                    style={{ width: imageW, height: 210, borderRadius: 12, backgroundColor: "#1a1a1a" }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
            <Text style={exploreStyles.modalPageHint}>
              {page + 1} / {urls.length} — swipe
            </Text>
          </View>
        ) : (
          <View style={exploreStyles.modalGalleryPlaceholder}>
            <Text style={exploreStyles.exploreItemMeta}>No images for this listing</Text>
          </View>
        )}

        <ScrollView style={exploreStyles.modalBody} contentContainerStyle={{ paddingBottom: 40 }}>
          {rows.map(([key, value]) => (
            <View key={key} style={exploreStyles.modalRow}>
              <Text style={exploreStyles.modalKey}>{key}</Text>
              {isListingUrlField(key) && isHttpUrlString(value) ? (
                <Pressable onPress={() => void openListingUrl(value)} accessibilityRole="link">
                  <Text style={exploreStyles.modalLink}>{value}</Text>
                </Pressable>
              ) : (
                <Text style={exploreStyles.modalValue}>{formatValue(value)}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
