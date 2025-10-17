import React from "react";
import { TouchableOpacity } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import CreateRecipeScreen from "./screens/CreateRecipeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (  
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "#FF6F61" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: "🍴 Recipe Haven",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("CreateRecipe")}
                  style={{ marginRight: 10 }}
                >
                  <MaterialIcons name="add-circle" size={28} color="#fff" />
                </TouchableOpacity>
              ),
            })}
          />

          <Stack.Screen
            name="CreateRecipe"
            component={CreateRecipeScreen}
            options={{
              title: "📝 Create Recipe",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}





