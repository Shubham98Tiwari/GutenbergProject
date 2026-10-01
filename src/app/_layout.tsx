import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    useFonts,
} from "@expo-google-fonts/montserrat";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    return (
        <Stack screenOptions={{ headerShown: false, headerBackTitle: "Back" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="books" />
        </Stack>
    );
}

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) return null;

    return (
        <SafeAreaProvider>
            <ErrorBoundary>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <KeyboardProvider>
                        <RootLayoutNav />
                    </KeyboardProvider>
                </GestureHandlerRootView>
            </ErrorBoundary>
        </SafeAreaProvider>
    );
}
