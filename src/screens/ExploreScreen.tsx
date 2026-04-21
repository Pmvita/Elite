import React, { useState } from "react";
import { ExploreCategoryItemsScreen } from "./explore/ExploreCategoryItemsScreen";
import { ExploreCategoryListScreen } from "./explore/ExploreCategoryListScreen";

export function ExploreScreen() {
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null);

  if (openCategoryKey) {
    return <ExploreCategoryItemsScreen categoryKey={openCategoryKey} onBack={() => setOpenCategoryKey(null)} />;
  }

  return <ExploreCategoryListScreen onOpenCategory={setOpenCategoryKey} />;
}
