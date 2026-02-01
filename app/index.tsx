import { axiosClient } from "@/services/GlobalApi";
import { useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  useWarmUpBrowser();
  // for the the removal of header
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const { startSSOFlow } = useSSO();

  const { isLoaded, isSignedIn, user } = useUser();
  console.log("Current User:", user);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const currentUser = user; // ✅ TS-safe snapshot
    createNewUser(currentUser);
  }, [isLoaded, isSignedIn]);

  const createNewUser = async (currentUser: UserResource) => {
    if (!currentUser) return;

    const payload = {
      data: {
        email: currentUser.primaryEmailAddress?.emailAddress,
        fullName: currentUser.fullName,
      },
    };

    console.log("Creating user with:", payload);

    try {
      const res = await axiosClient.post("/api/userlists", payload);
      console.log("User created:", res.data);
      router.replace("/(tabs)/Home");
    } catch (error: any) {
      console.log(
        "Error creating user:",
        error.response?.data || error.message,
      );
      router.replace("/(tabs)/Home");
    }
  };

  const onPress = useCallback(async () => {
    try {
      // 1. Explicitly define the redirect URL using your app scheme
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "buzzzness",
        path: "sso-callback",
      });
      console.log("redirect url", redirectUrl);

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId) {
        // 2. Use setActive to finalize the session
        await setActive!({
          session: createdSessionId,
        });

        // 3. Navigate AFTER the session is active
        router.replace("/");
      }
    } catch (err) {
      console.error("SSO Error:", JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow]);

  const handleSkip = () => {
    console.log("Skip pressed");
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#E8F6FC", "#F0F8FC", "#F8FCFF"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipTopButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.skipTopText}>Skip</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Image Container with Glow Effect */}
        <View style={styles.imageWrapper}>
          {/* <LinearGradient
            colors={[
              "rgba(16, 153, 239, 0.3)",
              "rgba(135, 206, 250, 0.1)",
              "transparent",
            ]}
            style={styles.glowEffect}
          /> */}
          <View style={styles.imageContainer}>
            {/* Replace this View with your actual image */}
            <Image
              source={require("./../assets/images/front.jpg")}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Placeholder - Remove this when you add your image */}
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Your Image Here</Text>
              <Text style={styles.placeholderSubtext}>
                (Business Illustration)
              </Text>
            </View>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>BuzZzness</Text>
          {/* <Text style={styles.title}>businesses near you</Text> */}
          <Text style={styles.subtitle}>
            Find the best businesses in your neighborhood with just a few taps.
          </Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.paginationDotActive]} />
          <View style={[styles.paginationDot, styles.paginationDotInactive]} />
          <View style={[styles.paginationDot, styles.paginationDotInactive]} />
        </View>

        {/* Next Button */}
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <LinearGradient
            colors={["#4DD0E1", "#26C6DA", "#00BCD4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButton} // Styles applied here
          >
            <Image
              source={require("./../assets/images/google.png")}
              style={styles.googleIcon} // Added a style for the icon size/margin
              resizeMode="contain" // "contain" is usually better for icons
            />
            <Text style={styles.nextButtonText}>Continue with Google</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipTopButton: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 10,
    padding: 10,
  },
  skipTopText: {
    fontSize: 17,
    color: "#7A8A99",
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 60,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 50,
  },
  glowEffect: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    top: -(width * 0.05),
    left: -(width * 0.05),
  },
  imageContainer: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 40,
    backgroundColor: "#35c5cf",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6B9B9E",
  },
  placeholderText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
  },
  titleContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#7A8A99",
    textAlign: "center",
    fontWeight: "400",
    marginTop: 16,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    gap: 10,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  paginationDotActive: {
    width: 32,
    backgroundColor: "#26C6DA",
  },
  paginationDotInactive: {
    width: 8,
    backgroundColor: "#D4E4E8",
  },
  nextButton: {
    width: width - 90,
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#26C6DA",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
