import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/appStyles";

export function SectionTitle({ title }: { title: string }) {
  return (
    <View style={[styles.rowBetween, styles.sectionGap]}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <Text style={styles.viewAll}>View All</Text>
    </View>
  );
}
