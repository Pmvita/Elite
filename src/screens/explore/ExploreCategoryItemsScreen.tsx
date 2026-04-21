import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { dbCategories, dbItemsByCategory, DbItemRecord } from "../../data/dbCategories";
import { exploreStyles } from "../../styles/exploreStyles";
import { DbSortMode, sortDbItems, SORT_OPTIONS } from "../../utils/sortDbItems";
import { ExploreItemDetailModal } from "./ExploreItemDetailModal";
import {
  getExploreItemTitle,
  getImageUrls,
  isHttpUrlString,
  isListingUrlField,
  openListingUrl,
} from "./exploreItemUtils";

type DisplayMode = "list" | "grid";

type Props = {
  categoryKey: string;
  onBack: () => void;
};

function itemKey(item: DbItemRecord, index: number): string {
  return String(item.id ?? item.name ?? index);
}

function SwipeImagePreview({
  urls,
  width,
  height,
}: {
  urls: string[];
  width: number;
  height: number;
}) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [urls.join("|"), width, height]);

  if (!urls.length) {
    return (
      <View style={[exploreStyles.explorePreviewWrap, exploreStyles.explorePreviewEmpty, { width, height }]}>
        <MaterialCommunityIcons name="image-off-outline" size={26} color="#555" />
      </View>
    );
  }

  return (
    <View style={[exploreStyles.explorePreviewWrap, { width, height }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width, height }}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const next = Math.round(x / width);
          if (next !== page && next >= 0 && next < urls.length) setPage(next);
        }}
        scrollEventThrottle={16}
      >
        {urls.map((uri, i) => (
          <View key={`${i}-${uri.slice(0, 48)}`} style={{ width, height }}>
            <Image source={{ uri }} style={{ width, height }} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>
      {urls.length > 1 ? <Text style={exploreStyles.explorePreviewPagerHint}>{page + 1} / {urls.length}</Text> : null}
    </View>
  );
}

function ItemCard({
  item,
  index,
  display,
  onOpenItem,
}: {
  item: DbItemRecord;
  index: number;
  display: DisplayMode;
  onOpenItem: (item: DbItemRecord) => void;
}) {
  const title = getExploreItemTitle(item, index);
  const extras = Object.entries(item)
    .filter(([k]) => k !== "name" && k !== "displayName" && k !== "id" && k !== "images")
    .slice(0, display === "grid" ? 2 : 4);

  const urls = getImageUrls(item);
  const listPreviewW = 136;
  const listPreviewH = 108;
  const gridPreviewW = 102;
  const gridPreviewH = 86;

  function renderExtraRow(key: string, value: unknown, oneLine?: boolean) {
    const str = String(value);
    if (isListingUrlField(key) && isHttpUrlString(value)) {
      return (
        <Pressable
          key={key}
          onPress={() => void openListingUrl(str)}
          accessibilityRole="link"
          hitSlop={4}
        >
          <Text
            style={[exploreStyles.exploreItemMeta, exploreStyles.exploreItemLink]}
            numberOfLines={oneLine ? 1 : undefined}
          >
            {key}: {str}
          </Text>
        </Pressable>
      );
    }
    return (
      <Text key={key} style={exploreStyles.exploreItemMeta} numberOfLines={oneLine ? 1 : undefined}>
        {key}: {str}
      </Text>
    );
  }

  const textBlock = (
    <View style={exploreStyles.exploreItemTextCol}>
      <Pressable onPress={() => onOpenItem(item)}>
        <Text style={exploreStyles.exploreItemTitle} numberOfLines={2}>
          {title}
        </Text>
      </Pressable>
      {extras.map(([key, value]) => renderExtraRow(key, value))}
      <Pressable onPress={() => onOpenItem(item)}>
        <Text style={exploreStyles.exploreTapHint}>Tap title for details · swipe images</Text>
      </Pressable>
    </View>
  );

  if (display === "grid") {
    return (
      <View style={[exploreStyles.exploreItemCard, exploreStyles.exploreItemCardGrid]}>
        <View style={exploreStyles.exploreItemGridInner}>
          <Pressable onPress={() => onOpenItem(item)}>
            <Text style={exploreStyles.exploreItemTitle} numberOfLines={2}>
              {title}
            </Text>
          </Pressable>
          <View style={exploreStyles.exploreItemGridRow}>
            <View style={{ flex: 1, minWidth: 0 }}>
              {extras.map(([key, value]) => renderExtraRow(key, value, true))}
            </View>
            <SwipeImagePreview urls={urls} width={gridPreviewW} height={gridPreviewH} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={exploreStyles.exploreItemCard}>
      <View style={exploreStyles.exploreItemListRow}>
        {textBlock}
        <SwipeImagePreview urls={urls} width={listPreviewW} height={listPreviewH} />
      </View>
    </View>
  );
}

export function ExploreCategoryItemsScreen({ categoryKey, onBack }: Props) {
  const label = dbCategories.find((c) => c.key === categoryKey)?.label ?? categoryKey;
  const rawItems = dbItemsByCategory[categoryKey] ?? [];
  const [sortMode, setSortMode] = useState<DbSortMode>("default");
  const [display, setDisplay] = useState<DisplayMode>("list");
  const [detailItem, setDetailItem] = useState<DbItemRecord | null>(null);

  useEffect(() => {
    if (categoryKey === "users") onBack();
  }, [categoryKey, onBack]);

  const sorted = useMemo(() => sortDbItems(rawItems, sortMode), [rawItems, sortMode]);

  return (
    <View style={exploreStyles.screen}>
      <View style={exploreStyles.categoryHeader}>
        <Pressable onPress={onBack} style={exploreStyles.backHit} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color="#e8e0d0" />
        </Pressable>
        <Text style={exploreStyles.categoryTitle} numberOfLines={1}>
          {label}
        </Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={exploreStyles.toolbar}>
        <View style={exploreStyles.toolbarRow}>
          <Text style={exploreStyles.toolbarLabel}>Display</Text>
          <View style={exploreStyles.displayToggle}>
            <Pressable
              onPress={() => setDisplay("list")}
              style={[exploreStyles.displayBtn, display === "list" && exploreStyles.displayBtnActive]}
            >
              <MaterialCommunityIcons name="format-list-bulleted" size={20} color={display === "list" ? "#d4af37" : "#8f8a81"} />
            </Pressable>
            <Pressable
              onPress={() => setDisplay("grid")}
              style={[exploreStyles.displayBtn, display === "grid" && exploreStyles.displayBtnActive]}
            >
              <MaterialCommunityIcons name="view-grid-outline" size={20} color={display === "grid" ? "#d4af37" : "#8f8a81"} />
            </Pressable>
          </View>
        </View>
        <View>
          <Text style={[exploreStyles.toolbarLabel, { marginBottom: 8 }]}>Sort</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={exploreStyles.sortScroll}>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.mode}
                onPress={() => setSortMode(opt.mode)}
                style={[exploreStyles.sortChip, sortMode === opt.mode && exploreStyles.sortChipActive]}
              >
                <Text style={[exploreStyles.sortChipText, sortMode === opt.mode && exploreStyles.sortChipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {!sorted.length ? (
        <Text style={exploreStyles.emptyList}>No items in this category yet.</Text>
      ) : (
        <FlatList
          key={`${categoryKey}-${display}`}
          data={sorted}
          keyExtractor={(item, i) => itemKey(item, i)}
          numColumns={display === "grid" ? 2 : 1}
          columnWrapperStyle={display === "grid" ? exploreStyles.gridRow : undefined}
          contentContainerStyle={exploreStyles.listContent}
          renderItem={({ item, index }) => (
            <ItemCard item={item} index={index} display={display} onOpenItem={setDetailItem} />
          )}
          ItemSeparatorComponent={display === "list" ? () => <View style={{ height: 10 }} /> : undefined}
          initialNumToRender={12}
          windowSize={5}
        />
      )}

      <ExploreItemDetailModal visible={!!detailItem} item={detailItem} onClose={() => setDetailItem(null)} />
    </View>
  );
}
