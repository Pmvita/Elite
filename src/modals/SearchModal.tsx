import React from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { styles } from "../styles/appStyles";
import { Item } from "../types/marketplace";

type Props = {
  visible: boolean;
  query: string;
  onChangeQuery: (value: string) => void;
  onClose: () => void;
  results: Item[];
  onSelectItem: (item: Item) => void;
};

export function SearchModal({ visible, query, onChangeQuery, onClose, results, onSelectItem }: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.modal}>
        <View style={styles.searchHeader}>
          <Pressable onPress={onClose}>
            <Ionicons name="arrow-back" size={22} color="#e8e0d0" />
          </Pressable>
          <TextInput
            placeholder="Search luxury items..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={onChangeQuery}
            style={styles.input}
          />
        </View>
        <ScrollView>
          {!query ? (
            <Text style={styles.emptyText}>Search jets, cars, watches and more</Text>
          ) : results.length ? (
            results.map((item) => (
              <Pressable
                key={item.id}
                style={styles.searchRow}
                onPress={() => {
                  onClose();
                  onSelectItem(item);
                }}
              >
                <View style={styles.cardIconWrap}>
                  <MaterialCommunityIcons name={item.icon as any} size={24} color="#d4af37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gridName}>{item.name}</Text>
                  <Text style={styles.meta}>{item.price}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={styles.emptyText}>No items found</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
