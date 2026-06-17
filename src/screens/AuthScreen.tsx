import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const GOOGLE_CLIENT_ID = "899826716735-rn5cpog5aj1fmi9vplg1n81nt3uiaj0p.apps.googleusercontent.com";

declare global {
  interface Window { google: any; handleGoogleCredential: (r: any) => void; }
}

export default function AuthScreen() {
  const { login, register, loginWithGoogle } = useAuth();
  const [screen, setScreen] = useState<"landing" | "signup" | "signin">("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    window.handleGoogleCredential = async (response: any) => {
      setLoading(true);
      try { await loginWithGoogle(response.credential); }
      catch (e: any) { Alert.alert("Error", e.message); }
      finally { setLoading(false); }
    };
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: window.handleGoogleCredential,
      });
      const btn = document.getElementById("google-btn");
      if (btn) window.google.accounts.id.renderButton(btn, {
        theme: "filled_white", size: "large", width: 320, text: "continue_with",
      });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleSignUp = async () => {
    if (!name || !email || !password) return Alert.alert("Fill in all fields");
    setLoading(true);
    try { await register(name, email, password); }
    catch (e: any) { Alert.alert("Error", e.message); }
    finally { setLoading(false); }
  };

  const handleSignIn = async () => {
    if (!email || !password) return Alert.alert("Fill in all fields");
    setLoading(true);
    try { await login(email, password); }
    catch (e: any) { Alert.alert("Error", e.message); }
    finally { setLoading(false); }
  };

  // ── Landing ──────────────────────────────────────────
  if (screen === "landing") return (
    <SafeAreaView style={s.container}>
      <View style={s.landingInner}>
        <View style={s.header}>
          <Text style={s.logo}>Styabu</Text>
          <Text style={s.tagline}>Build together</Text>
          <Text style={s.sub}>Post your idea. Find co-founders.{"\n"}Ship your first product.</Text>
        </View>

        <View style={s.actions}>
          {Platform.OS === "web" && <View style={s.googleWrap}><div id="google-btn" /></View>}

          <TouchableOpacity style={s.primaryBtn} onPress={() => setScreen("signup")}>
            <Text style={s.primaryBtnText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryBtn} onPress={() => setScreen("signin")}>
            <Text style={s.secondaryBtnText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  // ── Sign Up ──────────────────────────────────────────
  if (screen === "signup") return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.formOuter}>
        <ScrollView contentContainerStyle={s.formInner}>
          <TouchableOpacity onPress={() => setScreen("landing")} style={s.back}>
            <Text style={s.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={s.formTitle}>Create Account</Text>
          <Text style={s.formSub}>Join Styabu and start building</Text>

          <TextInput style={s.input} placeholder="Your name" placeholderTextColor="#555"
            value={name} onChangeText={setName} autoCapitalize="words" />
          <TextInput style={s.input} placeholder="Email" placeholderTextColor="#555"
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={s.input} placeholder="Password" placeholderTextColor="#555"
            value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={s.primaryBtn} onPress={handleSignUp} disabled={loading}>
            <Text style={s.primaryBtnText}>{loading ? "Creating account..." : "Create Account"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen("signin")} style={s.switchLink}>
            <Text style={s.switchLinkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  // ── Sign In ──────────────────────────────────────────
  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.formOuter}>
        <ScrollView contentContainerStyle={s.formInner}>
          <TouchableOpacity onPress={() => setScreen("landing")} style={s.back}>
            <Text style={s.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={s.formTitle}>Sign In</Text>
          <Text style={s.formSub}>Welcome back</Text>

          <TextInput style={s.input} placeholder="Email" placeholderTextColor="#555"
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={s.input} placeholder="Password" placeholderTextColor="#555"
            value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={s.primaryBtn} onPress={handleSignIn} disabled={loading}>
            <Text style={s.primaryBtnText}>{loading ? "Signing in..." : "Sign In"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen("signup")} style={s.switchLink}>
            <Text style={s.switchLinkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  landingInner: { flex: 1, justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 48 },
  header: { alignItems: "center", marginTop: 40 },
  logo: { fontSize: 48, fontWeight: "900", color: "#fff", letterSpacing: -1 },
  tagline: { color: "#a855f7", fontSize: 16, marginTop: 6, fontWeight: "600" },
  sub: { color: "#888", fontSize: 15, marginTop: 16, textAlign: "center", lineHeight: 22 },
  actions: { gap: 12 },
  googleWrap: { alignItems: "center", marginBottom: 4 },
  primaryBtn: { backgroundColor: "#7c3aed", borderRadius: 14, padding: 17, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondaryBtn: { borderRadius: 14, padding: 17, alignItems: "center", borderWidth: 1, borderColor: "#ffffff20" },
  secondaryBtnText: { color: "#aaa", fontWeight: "600", fontSize: 15 },
  formOuter: { flex: 1 },
  formInner: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40, gap: 12 },
  back: { marginBottom: 8 },
  backText: { color: "#a855f7", fontSize: 15 },
  formTitle: { fontSize: 30, fontWeight: "900", color: "#fff", marginBottom: 4 },
  formSub: { color: "#666", fontSize: 15, marginBottom: 8 },
  input: {
    backgroundColor: "#1a1a2e", borderRadius: 12, padding: 14,
    color: "#fff", fontSize: 15, borderWidth: 1, borderColor: "#ffffff10",
  },
  switchLink: { alignItems: "center", paddingTop: 8 },
  switchLinkText: { color: "#a855f7", fontSize: 14 },
});
