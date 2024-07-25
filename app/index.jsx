import { StatusBar } from "expo-status-bar";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { wp, hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/welcome.png")}
        style={styles.bgimage}
        resizeMode="cover"
      />
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "white",
            "white",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />

        <View style={styles.contentContainer}>
          <Animated.Text entering={FadeInDown.duration(400).springify()} style={styles.title}>Pixels</Animated.Text>
          <Animated.Text entering={FadeInDown.duration(500).springify()} style={styles.punchLine}>Every Pixel Has A Story</Animated.Text>

          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <Pressable onPress={() => router.push('home')} style={styles.startButton}>
              <Text style={styles.startText}>Start Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgimage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
  },
  gradient: {
    width: wp(100),
    height: hp(65),
    bottom: 0,
    position: "absolute",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 14,
  },
  title: {
    fontSize: hp(7),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
  },
  punchLine: {
    fontSize: hp(2.5),
    letterSpacing: 1,
    marginBottom: 20,
    fontWeight: theme.fontWeights.medium,
  },
  startButton: {
    marginBottom: 50,
    backgroundColor: theme.colors.black,
    paddingVertical: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous'
  },
  startText: {
    color: theme.colors.white,
    fontSize: hp(3),
    fontWeights: theme.fontWeights.medium,
    letterSpacing: 1,
  }
});
