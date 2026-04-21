import React, { useCallback, type ComponentProps } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "../auth/AuthContext";
import type { SessionProfile } from "../types/userProfile";
import { profileStyles as p } from "../styles/profileStyles";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "É";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function membershipLabel(tier: string): string {
  const t = tier.trim();
  return t.length ? `${t} tier` : "Member";
}

function onConfirmLogout(logout: () => void | Promise<void>) {
  Alert.alert("Log out?", "You will need to sign in again to access your account details.", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Log out",
      style: "destructive",
      onPress: () => {
        void logout();
      },
    },
  ]);
}

function GuestProfile({ wishlistCount, onSignIn }: { wishlistCount: number; onSignIn: () => void }) {
  return (
    <ScrollView contentContainerStyle={[p.scroll, p.screenPad]} showsVerticalScrollIndicator={false}>
      <Text style={p.pageTitle}>PROFILE</Text>

      <View style={p.guestHero}>
        <View style={p.guestIconRing}>
          <MaterialCommunityIcons name="shield-lock-outline" size={40} color="#d4af37" />
        </View>
        <Text style={p.guestKicker}>PRIVATE ACCESS</Text>
        <Text style={p.guestTitle}>Your concierge profile</Text>
        <Text style={p.guestSubtitle}>
          Sign in to view membership status, inquiries, and saved pieces tailored to your collection.
        </Text>
      </View>

      <View style={p.benefitList}>
        <View style={p.benefitRow}>
          <MaterialCommunityIcons name="account-star-outline" size={22} color="#c9a227" />
          <View style={p.benefitTextWrap}>
            <Text style={p.benefitTitle}>Membership & status</Text>
            <Text style={p.benefitDesc}>See tier, role, and concierge-ready details in one place.</Text>
          </View>
        </View>
        <View style={p.benefitRow}>
          <MaterialCommunityIcons name="email-lock-outline" size={22} color="#c9a227" />
          <View style={p.benefitTextWrap}>
            <Text style={p.benefitTitle}>Secure account</Text>
            <Text style={p.benefitDesc}>Email or username sign-in. OAuth options where available.</Text>
          </View>
        </View>
        <View style={p.benefitRow}>
          <MaterialCommunityIcons name="heart-outline" size={22} color="#c9a227" />
          <View style={p.benefitTextWrap}>
            <Text style={p.benefitTitle}>Wishlist on this device</Text>
            <Text style={p.benefitDesc}>Your saved listings stay here until you sign in across devices.</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [p.guestCta, pressed && p.guestCtaPressed]}
        onPress={onSignIn}
        accessibilityRole="button"
        accessibilityLabel="Log in or sign up"
      >
        <Text style={p.guestCtaText}>Log in or sign up</Text>
      </Pressable>

      <Pressable style={p.guestSecondary} onPress={onSignIn} hitSlop={12}>
        <Text style={p.guestSecondaryText}>Already a member? Continue →</Text>
      </Pressable>

      <View style={p.wishlistTeaser}>
        <View style={p.wishlistTeaserLeft}>
          <Text style={p.wishlistTeaserLabel}>WISHLIST</Text>
          <Text style={p.wishlistTeaserValue}>{wishlistCount}</Text>
          <Text style={p.wishlistTeaserHint}>Items saved while browsing the marketplace</Text>
        </View>
        <MaterialCommunityIcons name="bookmark-outline" size={32} color="rgba(212,175,55,0.45)" />
      </View>
    </ScrollView>
  );
}

function DetailRow({
  icon,
  label,
  value,
  isLast,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[p.detailRow, isLast && p.detailRowLast]}>
      <View style={p.detailIconBox}>
        <Ionicons name={icon} size={20} color="#c9a227" />
      </View>
      <View style={p.detailBody}>
        <Text style={p.detailLabel}>{label}</Text>
        <Text style={p.detailValue} selectable>
          {value}
        </Text>
      </View>
    </View>
  );
}

function SignedInProfile({
  user,
  wishlistCount,
  onLogout,
}: {
  user: SessionProfile;
  wishlistCount: number;
  onLogout: () => void;
}) {
  const initials = initialsFromName(user.name);
  const showRoleChip = user.role && user.role.toLowerCase() !== "member";

  return (
    <ScrollView contentContainerStyle={[p.scroll, p.screenPad]} showsVerticalScrollIndicator={false}>
      <Text style={p.pageTitle}>PROFILE</Text>

      <View style={p.heroCard}>
        <View style={p.heroAccent} />
        <View style={[p.heroTop, { marginTop: 6 }]}>
          <View style={p.avatar} accessibilityLabel={`Avatar for ${user.name}`}>
            <Text style={p.avatarText}>{initials}</Text>
          </View>
          <View style={p.heroTextBlock}>
            <Text style={p.heroName} numberOfLines={2}>
              {user.name}
            </Text>
            <Text style={p.heroUsername}>@{user.username}</Text>
            <View style={p.chipRow}>
              <View style={p.chip}>
                <Text style={p.chipText}>{membershipLabel(user.membership)}</Text>
              </View>
              {showRoleChip ? (
                <View style={[p.chip, p.chipRole]}>
                  <Text style={p.chipRoleText}>{user.role.replace(/-/g, " ")}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>

      <Text style={p.sectionLabel}>ACTIVITY</Text>
      <View style={p.statRow}>
        <View style={p.statCard}>
          <View style={p.statIconWrap}>
            <MaterialCommunityIcons name="heart-outline" size={20} color="#d4af37" />
          </View>
          <Text style={p.statValue}>{wishlistCount}</Text>
          <Text style={p.statCaption}>Wishlist</Text>
        </View>
        <View style={p.statCard}>
          <View style={p.statIconWrap}>
            <MaterialCommunityIcons name="message-text-outline" size={20} color="#d4af37" />
          </View>
          <Text style={p.statValue}>{user.activeInquiries}</Text>
          <Text style={p.statCaption}>Active inquiries</Text>
        </View>
      </View>

      <Text style={p.sectionLabel}>CONTACT & LOCATION</Text>
      <View style={p.detailCard}>
        <DetailRow icon="mail-outline" label="Email" value={user.email || "—"} />
        <DetailRow icon="call-outline" label="Phone" value={user.phone && user.phone !== "—" ? user.phone : "—"} />
        <DetailRow icon="location-outline" label="Country" value={user.country || "—"} isLast />
      </View>

      <View style={p.signOutWrap}>
        <Pressable
          style={({ pressed }) => [p.signOutBtn, pressed && p.signOutPressed]}
          onPress={() => onConfirmLogout(() => onLogout())}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Ionicons name="log-out-outline" size={20} color="#e8a0a0" />
          <Text style={p.signOutText}>Log out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export function ProfileScreen({ wishlistCount }: { wishlistCount: number }) {
  const { loading, user, logout, openAuthModal } = useAuth();

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  if (loading) {
    return (
      <View style={p.loadWrap}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={p.loadLabel}>Loading your profile…</Text>
      </View>
    );
  }

  if (!user) {
    return <GuestProfile wishlistCount={wishlistCount} onSignIn={openAuthModal} />;
  }

  return <SignedInProfile user={user} wishlistCount={wishlistCount} onLogout={handleLogout} />;
}
