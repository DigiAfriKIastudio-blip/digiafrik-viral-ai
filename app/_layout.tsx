import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProviders } from "../components/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" backgroundColor="#080D1B" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#080D1B" },
        }}
      />
    </AppProviders>
  );
}
