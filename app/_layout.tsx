import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#080D1B" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#080D1B" } }} />
    </>
  );
}