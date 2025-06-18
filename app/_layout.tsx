import { AuthProvider } from "@/context/auth-context";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/profile-modal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/wallet-modal"
        options={{
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="(modals)/transaction-modal"
        options={{
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="(modals)/search-modal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}

export default RootLayout;
