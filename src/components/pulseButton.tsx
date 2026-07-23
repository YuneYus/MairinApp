

// components/pulseButton.tsx

import { useEffect, useRef } from "react";
import { Animated, StyleProp, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function PulseButton({ onPress, children, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}