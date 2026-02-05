import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function SsoCallback() {
  const router = useRouter();

  useEffect(() => {
    // Immediately bounce to home
    router.replace("/(tabs)/Home");
  }, []);

  return <View />;
}
