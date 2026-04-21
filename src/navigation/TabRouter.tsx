import React from "react";
import { Item, TabId } from "../types/marketplace";
import { HomeScreen } from "../screens/HomeScreen";
import { ExploreScreen } from "../screens/ExploreScreen";
import { WishlistScreen } from "../screens/WishlistScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

type Props = {
  activeTab: TabId;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  featured: Item | null;
  trending: Item[];
  arrivals: Item[];
  wishlist: Set<number>;
  wishlistItems: Item[];
  onToggleWishlist: (id: number) => void;
  onOpenDetail: (item: Item) => void;
};

export function TabRouter(props: Props) {
  if (props.activeTab === "explore") {
    return <ExploreScreen />;
  }

  if (props.activeTab === "wishlist") {
    return (
      <WishlistScreen
        items={props.wishlistItems}
        onToggleWishlist={props.onToggleWishlist}
        onOpenDetail={props.onOpenDetail}
      />
    );
  }

  if (props.activeTab === "profile") {
    return <ProfileScreen wishlistCount={props.wishlistItems.length} />;
  }

  return (
    <HomeScreen
      activeCategory={props.activeCategory}
      setActiveCategory={props.setActiveCategory}
      featured={props.featured}
      trending={props.trending}
      arrivals={props.arrivals}
      wishlist={props.wishlist}
      onToggleWishlist={props.onToggleWishlist}
      onOpenDetail={props.onOpenDetail}
    />
  );
}
