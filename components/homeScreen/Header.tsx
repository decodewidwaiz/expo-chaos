import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/services/Colors";

export default function Header() {
  const user = useUser();

  return (
    <View>
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Image
            source={{ uri: user.user?.imageUrl }}
            style={{ width: 44, height: 44, borderRadius: 20 }}
          />
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Welcome,</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {user.user?.firstName || "Guest"}!
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons
            hoverColor={Colors.SECONDARY}
            name="notifications"
            size={30}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {/*  search bar */}
      <View style={styles.container}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          placeholder="Search nearby businesses"
          placeholderTextColor="#9ca3af"
          underlineColorAndroid="transparent"
          selectionColor="#6b7280"
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",

    borderWidth: 0,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111827",
    borderWidth: 0,
  },
});
