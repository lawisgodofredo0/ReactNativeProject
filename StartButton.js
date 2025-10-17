// components/StartButton.js
import React from "react";
import { Button } from "react-native-paper";

export default function StartButton({ onStart, styles }) {
  return (
    <Button
      mode="contained"
      style={[styles.btn, { marginBottom: 10 }]}
      onPress={onStart}
    >
      Start
    </Button>
  );
}