import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "../auth/AuthContext";
import { authModalStyles as a } from "../styles/authModalStyles";

type Mode = "login" | "signup";
type SignupStep = "intro" | "personal" | "account" | "optional";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function AuthModal({ visible, onClose }: Props) {
  const { login, register, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [signupStep, setSignupStep] = useState<SignupStep>("intro");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  const reset = useCallback(() => {
    setMode("login");
    setSignupStep("intro");
    setBusy(false);
    setError(null);
    setIdentifier("");
    setPassword("");
    setName("");
    setEmail("");
    setUsername("");
    setRegPassword("");
    setConfirmPassword("");
    setPhone("");
    setCountry("");
  }, []);

  useEffect(() => {
    if (visible) reset();
  }, [visible, reset]);

  const onSubmitLogin = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await login(identifier, password);
      if (!res.ok) {
        setError(res.message ?? "Could not sign in.");
        return;
      }
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const onSubmitRegister = async () => {
    setError(null);
    if (regPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await register({
        name,
        email,
        username,
        password: regPassword,
        phone,
        country,
      });
      if (!res.ok) {
        setError(res.message ?? "Could not create account.");
        return;
      }
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const signupNext = () => {
    setError(null);
    if (signupStep === "intro") setSignupStep("personal");
    else if (signupStep === "personal") {
      if (!name.trim() || !email.trim()) {
        setError("Enter your name and email.");
        return;
      }
      setSignupStep("account");
    } else if (signupStep === "account") {
      if (!username.trim() || !regPassword) {
        setError("Choose a username and password.");
        return;
      }
      if (regPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setSignupStep("optional");
    }
  };

  const signupBack = () => {
    setError(null);
    if (signupStep === "optional") setSignupStep("account");
    else if (signupStep === "account") setSignupStep("personal");
    else if (signupStep === "personal") setSignupStep("intro");
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={a.safe} keyboardShouldPersistTaps="handled">
          <View style={a.header}>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color="#e8e0d0" />
            </Pressable>
            <Text style={a.title}>Élite access</Text>
            <View style={{ width: 26 }} />
          </View>

          <View style={a.segmentRow}>
            <Pressable
              style={[a.segment, mode === "login" && a.segmentActive]}
              onPress={() => {
                setMode("login");
                setError(null);
              }}
            >
              <Text style={[a.segmentText, mode === "login" && a.segmentTextActive]}>Log in</Text>
            </Pressable>
            <Pressable
              style={[a.segment, mode === "signup" && a.segmentActive]}
              onPress={() => {
                setMode("signup");
                setSignupStep("intro");
                setError(null);
              }}
            >
              <Text style={[a.segmentText, mode === "signup" && a.segmentTextActive]}>Sign up</Text>
            </Pressable>
          </View>

          {error ? <Text style={a.error}>{error}</Text> : null}

          {mode === "login" ? (
            <View>
              <Text style={a.subtitle}>Sign in with the email or username and password associated with your account.</Text>
              <Text style={a.label}>Email or username</Text>
              <TextInput
                style={a.input}
                placeholder="you@example.com or username"
                placeholderTextColor="#555"
                autoCapitalize="none"
                autoCorrect={false}
                value={identifier}
                onChangeText={setIdentifier}
              />
              <Text style={a.label}>Password</Text>
              <TextInput
                style={a.input}
                placeholder="Password"
                placeholderTextColor="#555"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Pressable style={a.primaryBtn} onPress={() => void onSubmitLogin()} disabled={busy}>
                {busy ? (
                  <ActivityIndicator color="#0a0a0a" />
                ) : (
                  <Text style={a.primaryBtnText}>Log in</Text>
                )}
              </Pressable>

              <View style={a.divider}>
                <View style={a.dividerLine} />
                <Text style={a.dividerText}>or</Text>
                <View style={a.dividerLine} />
              </View>

              <Pressable style={a.secondaryBtn} onPress={signInWithGoogle}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <MaterialCommunityIcons name="google" size={22} color="#e8e0d0" />
                  <Text style={a.secondaryBtnText}>Continue with Google</Text>
                </View>
              </Pressable>
            </View>
          ) : (
            <View>
              {signupStep === "intro" ? (
                <>
                  <Text style={a.subtitle}>
                    Create your Élite profile in a few steps. New accounts are saved on this device until a server is
                    connected.
                  </Text>
                  <Pressable style={a.primaryBtn} onPress={() => setSignupStep("personal")}>
                    <Text style={a.primaryBtnText}>Start onboarding</Text>
                  </Pressable>
                </>
              ) : null}

              {signupStep === "personal" ? (
                <>
                  <Text style={a.stepHint}>Step 1 of 3 — About you</Text>
                  <Text style={a.label}>Full name</Text>
                  <TextInput
                    style={a.input}
                    placeholder="Full name"
                    placeholderTextColor="#555"
                    value={name}
                    onChangeText={setName}
                  />
                  <Text style={a.label}>Email</Text>
                  <TextInput
                    style={a.input}
                    placeholder="Email"
                    placeholderTextColor="#555"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <Pressable onPress={signupBack}>
                    <Text style={a.backLink}>← Back</Text>
                  </Pressable>
                  <Pressable style={a.primaryBtn} onPress={signupNext}>
                    <Text style={a.primaryBtnText}>Continue</Text>
                  </Pressable>
                </>
              ) : null}

              {signupStep === "account" ? (
                <>
                  <Text style={a.stepHint}>Step 2 of 3 — Credentials</Text>
                  <Text style={a.label}>Username</Text>
                  <TextInput
                    style={a.input}
                    placeholder="Username"
                    placeholderTextColor="#555"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={username}
                    onChangeText={setUsername}
                  />
                  <Text style={a.label}>Password</Text>
                  <TextInput
                    style={a.input}
                    placeholder="At least 6 characters"
                    placeholderTextColor="#555"
                    secureTextEntry
                    value={regPassword}
                    onChangeText={setRegPassword}
                  />
                  <Text style={a.label}>Confirm password</Text>
                  <TextInput
                    style={a.input}
                    placeholder="Repeat password"
                    placeholderTextColor="#555"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <Pressable onPress={signupBack}>
                    <Text style={a.backLink}>← Back</Text>
                  </Pressable>
                  <Pressable style={a.primaryBtn} onPress={signupNext}>
                    <Text style={a.primaryBtnText}>Continue</Text>
                  </Pressable>
                </>
              ) : null}

              {signupStep === "optional" ? (
                <>
                  <Text style={a.stepHint}>Step 3 of 3 — Optional</Text>
                  <Text style={a.label}>Phone</Text>
                  <TextInput
                    style={a.input}
                    placeholder="Phone (optional)"
                    placeholderTextColor="#555"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                  <Text style={a.label}>Country</Text>
                  <TextInput
                    style={a.input}
                    placeholder="Country (optional)"
                    placeholderTextColor="#555"
                    value={country}
                    onChangeText={setCountry}
                  />
                  <Pressable onPress={signupBack}>
                    <Text style={a.backLink}>← Back</Text>
                  </Pressable>
                  <Pressable style={a.primaryBtn} onPress={() => void onSubmitRegister()} disabled={busy}>
                    {busy ? (
                      <ActivityIndicator color="#0a0a0a" />
                    ) : (
                      <Text style={a.primaryBtnText}>Create account</Text>
                    )}
                  </Pressable>
                </>
              ) : null}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
