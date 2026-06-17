import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const GOOGLE_CLIENT_ID = "899826716735-rn5cpog5aj1fmi9vplg1n81nt3uiaj0p.apps.googleusercontent.com";

declare global {
  interface Window {
    google: any;
    handleGoogleCredential: (response: any) => void;
  }
}

export default function AuthScreen() {
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    window.handleGoogleCredential = async (response: any) => {
      setLoading(true);
      try {
        await loginWithGoogle(response.credential);
      } catch (e: any) {
        Alert.alert("Error", e.message);
      } finally {
        setLoading(false);
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: window.handleGoogleCredential,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "filled_white", size: "large", width: 340, text: "continue_with" }
      );
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.logo}>Styabu</Text>
          <Text style={styles.tagline}>Build together</Text>
        </View>

        {Platform.OS === "web" ? (
          <View style={styles.googleWrapper}>
            <div id="google-signin-btn" />
          </View>
        ) : null}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.tabs}>
          {(["login", "register"] as const).map((m) => (
            <TouchableOpacity key={m} onPress={() => setMode(m)} style={[styles.tab, mode === m && styles.tabActive]}>
              <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                {m === "login" ? "Sign In" : "Create Account"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          {mode === "register" && (
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#555"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
            <Text style={styles.btnText}>{loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  header: { alignItems: "center", marginBottom: 32 },
  logo: { fontSize: 40, fontWeight: "900", color: "#fff", letterSpacing: -1 },
  tagline: { color: "#a855f7", fontSize: 15, marginTop: 4 },
  googleWrapper: { alignItems: "center", marginBottom: 16 },
  divider: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#ffffff15" },
  dividerText: { color: "#555", fontSize: 13 },
  tabs: { flexDirection: "row", backgroundColor: "#1a1a2e", borderRadius: 12, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: "#7c3aed" },
  tabText: { color: "#666", fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  form: { gap: 12 },
  input: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ffffff10",
  },
  btn: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
