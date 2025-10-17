/*
Jovelyn – add componets/HighlightedRecipe
*/
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

export default function HighlightedRecipe({
  text,
  currentLineIndex,
  beforeLines,
  afterLines,
  lineHeightRef,
  scrollRef,
}) {
  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 8 }}
    >
      {beforeLines.map((line, idx) => (
        <Text key={`b-${idx}`} style={styles.completedText}>
          {line}
        </Text>
      ))}

      <View
        style={styles.highlightWrapper}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (!lineHeightRef.current && h > 0) {
            lineHeightRef.current = h;
          }
        }}
      >
        <Text style={styles.currentText}>
          {text.split("\n")[currentLineIndex] || ""}
        </Text>
      </View>

      {afterLines.map((line, idx) => (
        <Text key={`a-${idx}`} style={styles.remainingText}>
          {line}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  completedText: {
    color: "#888",
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: "#e0e0e0",
    paddingVertical: 2,
  },
  highlightWrapper: {
    backgroundColor: "#FFF9C4",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#FF9800",
  },
  currentText: {
    color: "#D84315",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
    textAlign: "center",
  },
  remainingText: {
    color: "#333",
    fontSize: 16,
    lineHeight: 24,
  },
});