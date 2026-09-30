import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";

export default function BooksScreen() {
    const { genre } = useLocalSearchParams<{ genre: string }>();

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <Text style={styles.title}>{genre}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        color: colors.primary,
        fontSize: 30,
        fontFamily: "Montserrat_600SemiBold",
    },
});
