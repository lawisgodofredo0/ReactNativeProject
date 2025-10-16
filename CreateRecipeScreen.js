import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import styles from "../styles";
import { recipesData } from "../data/recipesData";

export default function CreateRecipeScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  const handleSave = () => {
    if (!title || !description || !ingredients || !steps) {
      Alert.alert("Incomplete Details", "Please fill in all fields.");
      return;
    }

    // Add the new recipe to the data array
    const newRecipe = {
      id: recipesData.length + 1,
      title,
      image:
        image || "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
      description,
      ingredients: ingredients.split(",").map((i) => i.trim()),
      steps,
    };

    recipesData.push(newRecipe);

    Alert.alert("Success", "Recipe added successfully!");
    navigation.navigate("Home");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📝 Create a New Recipe</Text>

      <TextInput
        label="Recipe Title"
        mode="outlined"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Image URL"
        mode="outlined"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />

      <TextInput
        label="Short Description"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />

      <TextInput
        label="Ingredients (separate by commas)"
        mode="outlined"
        value={ingredients}
        onChangeText={setIngredients}
        style={styles.input}
        multiline
      />

      <TextInput
        label="Steps (each step on a new line)"
        mode="outlined"
        value={steps}
        onChangeText={setSteps}
        style={styles.input}
        multiline
      />

      <Button mode="contained" style={styles.btn} onPress={handleSave}>
        Save Recipe
      </Button>

      <Button
        mode="outlined"
        style={[styles.exitBtn, { marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        Cancel
      </Button>
    </ScrollView>
  );
}
