import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Share,
} from "react-native";
import { Card, Text, Button, Searchbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { recipesData } from "../data/recipesData";
import RecipeWithSpeech from "../components/RecipeWithSpeech";
import styles from "../styles";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const filteredRecipes = recipesData.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = async (recipe) => {
    await Share.share({
      title: recipe.title,
      message: `${recipe.title}\n\nIngredients:\n${recipe.ingredients.join(
        ", "
      )}\n\nSteps:\n${recipe.steps}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍴 Recipe Haven</Text>
      <Searchbar
        placeholder="Search recipes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} style={styles.card}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <Card.Content>
              <View style={styles.header}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <TouchableOpacity onPress={() => handleShare(recipe)}>
                  <MaterialIcons name="share" size={24} color="#FF6F61" />
                </TouchableOpacity>
              </View>
              <Text style={styles.desc}>{recipe.description}</Text>
              <Button
                mode="contained"
                style={styles.btn}
                onPress={() => setSelectedRecipe(recipe)}
              >
                View Recipe
              </Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedRecipe}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRecipe(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedRecipe && (
              <RecipeWithSpeech
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                styles={styles}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}