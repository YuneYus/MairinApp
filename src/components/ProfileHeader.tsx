

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    title: string;
};

export default function ProfileHeader({ title }: Props) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 55,
                marginBottom: 25,
                paddingHorizontal: 20,
            }}
        >
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                    name="chevron-back"
                    size={30}
                    color="#B11C67"
                />
            </TouchableOpacity>

            <Text
                style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#B11C67",
                    marginRight: 30,
                }}
            >
                {title}
            </Text>
        </View>
    );
}