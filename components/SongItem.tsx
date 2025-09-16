// components/SongItem.tsx
import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = { title: string; onRemove: () => void };

const SongItem = ({ title, onRemove }: Props) => (
  <View style={styles.row}>
    <Text style={styles.text}>{title}</Text>
    <TouchableOpacity onPress={onRemove}>
      <Text style={styles.remove}>✖</Text>
    </TouchableOpacity>
  </View>
);

export default memo(SongItem);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 8,
  },
  text: { color: "#fff" },
  remove: { color: "#ff4d4d", fontWeight: "bold" },
});
