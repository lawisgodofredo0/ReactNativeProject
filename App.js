import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
} from "react-native";
import * as Speech from "expo-speech";

const { height: screenHeight } = Dimensions.get("window");

const App = () => {
  const [recipeText, setRecipeText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [pausePosition, setPausePosition] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [basePosition, setBasePosition] = useState(0);

  const progressScrollRef = useRef(null);
  const progressTimer = useRef(null);

  const lineHeightRef = useRef(null);
  const highlightContainerHeightRef = useRef(null);

  const speakOptions = {
    rate: 0.8,
    language: "en-US",
  };

  const CHARS_PER_SECOND = 10;
  const UPDATE_INTERVAL = 200;

  const getCurrentLineIndex = (text, pos) => {
    if (!text || pos <= 0) return 0;
    const lines = text.split("\n");
    let cumulative = 0;
    for (let i = 0; i < lines.length; i++) {
      cumulative += lines[i].length + (i < lines.length - 1 ? 1 : 0);
      if (pos <= cumulative) return i;
    }
    return lines.length - 1;
  };

  const startProgressTimer = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    progressTimer.current = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const elapsedSec = elapsedMs / 1000;
      let sessionEstimate = elapsedSec * CHARS_PER_SECOND * speakOptions.rate;
      let estPos = basePosition + sessionEstimate;
      if (estPos > recipeText.length) estPos = recipeText.length;
      setCurrentPosition(Math.floor(estPos));

      if (progressScrollRef.current && recipeText) {
        const est = Math.floor(estPos);
        const lineIdx = getCurrentLineIndex(recipeText, est);

        const lh = lineHeightRef.current || 24;
        const containerH = highlightContainerHeightRef.current || 150;

        let scrollY = lineIdx * lh - containerH / 2 + lh / 2;
        if (scrollY < 0) scrollY = 0;

        progressScrollRef.current.scrollTo({ y: scrollY, animated: true });
      }
    }, UPDATE_INTERVAL);
  };

  const clearProgressTimer = () => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };

  const speakFromPosition = (textToSpeak, startPos = 0) => {
    if (!textToSpeak.trim()) {
      Alert.alert("Error", "Nothing to speak");
      return;
    }
    setIsSpeaking(true);
    setIsPaused(false);
    setStartTime(Date.now());
    setBasePosition(startPos);
    setCurrentPosition(startPos);
    startProgressTimer();
    Speech.speak(textToSpeak, speakOptions);
  };

  const speakRecipe = () => {
    if (!recipeText.trim()) {
      Alert.alert("No Recipe", "Enter recipe text first");
      return;
    }
    setPausePosition(0);
    setBasePosition(0);
    setCurrentPosition(0);
    speakFromPosition(recipeText, 0);
  };

  const pauseSpeaking = () => {
    Speech.stop();
    clearProgressTimer();
    const elapsedMs = Date.now() - startTime;
    const elapsedSec = elapsedMs / 1000;
    let spoken =
      basePosition + elapsedSec * CHARS_PER_SECOND * speakOptions.rate;
    if (spoken > recipeText.length) spoken = recipeText.length;
    const newPause = Math.floor(spoken);
    setPausePosition(newPause);
    setCurrentPosition(newPause);
    setIsPaused(true);
    setIsSpeaking(false);
  };

  const resumeSpeaking = () => {
    const remaining = recipeText.substring(pausePosition);
    speakFromPosition(remaining, pausePosition);
  };

  const fullStop = () => {
    Speech.stop();
    clearProgressTimer();
    setIsSpeaking(false);
    setIsPaused(false);
    setPausePosition(0);
    setCurrentPosition(0);
    setBasePosition(0);
    setStartTime(0);
  };

  useEffect(() => {
    return () => {
      clearProgressTimer();
      Speech.stop();
    };
  }, []);

  const getCurrentPos = () => (isPaused ? pausePosition : currentPosition);

  const HighlightedRecipe = ({ text, pos }) => {
    if (!text) return null;
    const currentPos = Math.min(pos, text.length);
    const lines = text.split("\n");
    const currentLineIndex = getCurrentLineIndex(text, currentPos);
    const before = lines.slice(0, currentLineIndex);
    const currentLine = lines[currentLineIndex] || "";
    const after = lines.slice(currentLineIndex + 1);

    return (
      <ScrollView
        ref={progressScrollRef}
        style={styles.highlightContainer}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 8 }}
        showsVerticalScrollIndicator={true}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0) highlightContainerHeightRef.current = h;
        }}
      >
        {before.map((line, idx) => (
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
          <Text style={styles.currentText}>{currentLine}</Text>
        </View>

        {after.map((line, idx) => (
          <Text key={`a-${idx}`} style={styles.remainingText}>
            {line}
          </Text>
        ))}
      </ScrollView>
    );
  };

  const progressPercent = recipeText
    ? ((getCurrentPos() / recipeText.length) * 100).toFixed(1)
    : "0";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f8ff" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Cooking TTS Assistant</Text>
          <Text style={styles.subtitle}>
            Enter your recipe and listen while cooking!
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Enter your recipe or cooking steps..."
            value={recipeText}
            onChangeText={setRecipeText}
            editable={!(isSpeaking || isPaused)}
          />
        </View>

        {recipeText !== "" && (
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Recipe Progress</Text>
            <HighlightedRecipe text={recipeText} pos={getCurrentPos()} />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              (isSpeaking || isPaused) && styles.buttonDisabled,
            ]}
            onPress={speakRecipe}
            disabled={isSpeaking || isPaused}
          >
            <Text style={styles.buttonText}>Speak</Text>
          </TouchableOpacity>

          {isSpeaking && (
            <TouchableOpacity
              style={[styles.button, styles.pauseButton]}
              onPress={pauseSpeaking}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          )}

          {isPaused && (
            <TouchableOpacity
              style={[styles.button, styles.resumeButton]}
              onPress={resumeSpeaking}
            >
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={fullStop}
          >
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tip: Watch the highlighted area to follow along.
          </Text>
          {recipeText !== "" && (
            <Text style={[styles.footerText, { fontSize: 12, color: "#999" }]}>
              Progress: {progressPercent}% ({getCurrentPos()} /{" "}
              {recipeText.length} chars)
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#4CAF50",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  inputContainer: {
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "white",
    minHeight: 150,
    textAlignVertical: "top",
  },
  progressSection: {
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    // Give enough height to be visible and scrollable
    height: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
    textAlign: "center",
  },
  highlightContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
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
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    margin: 5,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  pauseButton: {
    backgroundColor: "#FF9800",
  },
  resumeButton: {
    backgroundColor: "#2196F3",
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default App;
