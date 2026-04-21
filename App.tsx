import React, { useMemo, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";
import { items } from "./src/data/catalogFromDb";
import { AppHeader } from "./src/components/AppHeader";
import { ToastCard } from "./src/components/ToastCard";
import { BottomNav } from "./src/navigation/BottomNav";
import { TabRouter } from "./src/navigation/TabRouter";
import { DetailModal } from "./src/modals/DetailModal";
import { SearchModal } from "./src/modals/SearchModal";
import { AuthModal } from "./src/modals/AuthModal";
import { styles } from "./src/styles/appStyles";
import { Item, TabId } from "./src/types/marketplace";

function AppShell() {
  const { user, loading, authModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [toast, setToast] = useState<null | "notif" | "profile">(null);
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const filtered = useMemo(
    () => (activeCategory === "all" ? items : items.filter((i) => i.cat === activeCategory)),
    [activeCategory]
  );
  const featured = filtered[0] ?? items[0] ?? null;
  const trending = useMemo(() => {
    if (!items.length) return [];
    if (filtered.length > 1) {
      const t = filtered.slice(1, 5);
      return t.length ? t : items.slice(0, Math.min(4, items.length));
    }
    return items.slice(1, Math.min(5, items.length));
  }, [filtered, items]);
  const arrivals = useMemo(() => {
    if (!items.length) return [];
    if (filtered.length > 3) {
      const a = filtered.slice(3);
      return a.length ? a : items.slice(3);
    }
    return items.slice(Math.min(3, items.length));
  }, [filtered, items]);
  const wishlistItems = items.filter((item) => wishlist.has(item.id));
  const searchResults = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchText.toLowerCase()) ||
      i.cat.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleWishlist = (id: number) =>
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <AppHeader
        onOpenSearch={() => setShowSearch(true)}
        onShowNotif={() => setToast("notif")}
        authLoading={loading}
        isSignedIn={!!user}
        onOpenAuth={openAuthModal}
        onShowProfileToast={() => setToast("profile")}
      />

      <TabRouter
        activeTab={activeTab}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        featured={featured}
        trending={trending}
        arrivals={arrivals}
        wishlist={wishlist}
        wishlistItems={wishlistItems}
        onToggleWishlist={toggleWishlist}
        onOpenDetail={setDetailItem}
      />

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      <SearchModal
        visible={showSearch}
        query={searchText}
        onChangeQuery={setSearchText}
        onClose={() => setShowSearch(false)}
        results={searchResults}
        onSelectItem={setDetailItem}
      />

      <DetailModal
        item={detailItem}
        wishlist={wishlist}
        onClose={() => setDetailItem(null)}
        onToggleWishlist={toggleWishlist}
      />

      <ToastCard
        toast={toast}
        wishlistCount={wishlistItems.length}
        profileHeadline={user?.name}
        onClose={() => setToast(null)}
      />

      <AuthModal visible={authModalOpen} onClose={closeAuthModal} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </SafeAreaView>
  );
}
