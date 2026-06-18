import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import FeedScreen from "./src/screens/FeedScreen";
import GroupsScreen from "./src/screens/GroupsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AuthScreen from "./src/screens/AuthScreen";
import GroupDetailScreen from "./src/screens/GroupDetailScreen";
import IdeaDetailScreen from "./src/screens/IdeaDetailScreen";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

const Tab = createBottomTabNavigator();
const FeedStack = createNativeStackNavigator();
const GroupsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function FeedStackNavigator() {
  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name="FeedMain" component={FeedScreen} />
      <FeedStack.Screen name="IdeaDetail" component={IdeaDetailScreen} />
      <FeedStack.Screen name="GroupDetail" component={GroupDetailScreen} />
    </FeedStack.Navigator>
  );
}

function GroupsStackNavigator() {
  return (
    <GroupsStack.Navigator screenOptions={{ headerShown: false }}>
      <GroupsStack.Screen name="GroupsMain" component={GroupsScreen} />
      <GroupsStack.Screen name="GroupDetail" component={GroupDetailScreen} />
    </GroupsStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0f0f1a", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#a855f7",
        tabBarInactiveTintColor: "#444",
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Feed:    ["bulb",        "bulb-outline"],
            Groups:  ["people",      "people-outline"],
            Profile: ["person",      "person-outline"],
          };
          const [active, inactive] = icons[route.name] ?? ["circle", "circle-outline"];
          return (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons
                name={(focused ? active : inactive) as any}
                size={22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Feed"    component={FeedStackNavigator} />
      <Tab.Screen name="Groups"  component={GroupsStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 24 : 16,
    left: 40,
    right: 40,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#16162a",
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "#ffffff12",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    paddingBottom: 0,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "#7c3aed22",
  },
});
