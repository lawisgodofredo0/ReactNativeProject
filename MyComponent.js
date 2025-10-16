import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as Speech from "expo-speech";
import HighlightedRecipe from "./HighlightedRecipe";

export default function RecipeWithSpeech({ recipe, onClose, styles }) {
  const [lineIndex, setLineIndex] = useState(0);
  const lines = recipe.steps.split("\n");

  const lineHeightRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    speakLine(0);
  }, []);

  const speakLine = (idx) => {
    const line = lines[idx];
    if (!line) return;
    Speech.speak(line);
  };

  const onNext = () => {
    Speech.stop();
    const next = lineIndex + 1;
    if (next < lines.length) {
      setLineIndex(next);
      speakLine(next);
      const offset = (lineHeightRef.current || 24) * next;
      scrollRef.current?.scrollTo({ y: offset, animated: true });
    }
  };

  const before = lines.slice(0, lineIndex);
  const after = lines.slice(lineIndex + 1);
  const isLastLine = lineIndex >= lines.length - 1;

  return (
    <>
      <Text style={styles.modalTitle}>{recipe.title}</Text>

      <Text style={styles.modalSub}>Ingredients:</Text>
      {recipe.ingredients.map((i, idx) => (
        <Text key={idx} style={styles.modalText}>
          • {i}
        </Text>
      ))}

      <Text style={[styles.modalSub, { marginTop: 12 }]}>Steps:</Text>
      <View style={{ flex: 1, minHeight: 200, marginVertical: 8 }}>
        <HighlightedRecipe
          text={recipe.steps}
          currentLineIndex={lineIndex}
          beforeLines={before}
          afterLines={after}
          lineHeightRef={lineHeightRef}
          scrollRef={scrollRef}
        />
      </View>

      {!isLastLine && (
        <Button
          mode="contained"
          style={[styles.btn, { marginBottom: 10 }]}
          onPress={onNext}
        >
          Next Step
        </Button>
      )}

      <Button
        mode="outlined"
        style={styles.exitBtn}
        onPress={() => {
          Speech.stop();
          onClose();
        }}
      >
        Exit
      </Button>
    </>
  );
}
