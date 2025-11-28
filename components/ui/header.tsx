import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>Florix</Text>
      <Feather name="settings" size={24} color="#37474F" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 45, // for status bar / Safe Area
    paddingBottom: 7,
    backgroundColor: "#FAFAFA",
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5D8A6F",
  },
});
