import { colors, globalStyles } from '@/styles/global';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const FULL_COVER_SIZE = Math.max(width, height); // big enough to blanket the whole screen
const CIRCLE_SIZE = 220; // final logo circle diameter
const DURATION = 1800; // total animation length, ms

type Props = {
  onFinish?: () => void;
};

export default function AppIntro({ onFinish }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: DURATION,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false, // width/height/borderRadius can't use the native driver
    }).start(({ finished }) => {
      if (finished) {
        setTimeout(() => onFinish?.(), 2000); // hold the finished logo for 2s before handing off
      }
    });
  }, []);

  // Pink shape: starts covering the whole screen (square corners),
  // ends as a small rounded circle sitting mid-screen.
  const pinkSize = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [FULL_COVER_SIZE, CIRCLE_SIZE],
  });

  const pinkRadius = progress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0, 70, CIRCLE_SIZE / 2],
  });

  // MAIRIN title and subtitle only appear once the shape has mostly settled
  const titleOpacity = progress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });

  const subtitleOpacity = progress.interpolate({
    inputRange: [0, 0.75, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[globalStyles.titleBig, styles.title, { opacity: titleOpacity }]}>
        MAIRIN
      </Animated.Text>

      <Animated.View
        style={[
          styles.pinkShape,
          {
            width: pinkSize,
            height: pinkSize,
            borderRadius: pinkRadius,
          },
        ]}
      >
        <Image
          source={require('@/app/assets/images/transRelaxPink.png')}
          style={styles.face}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        ACOMPAÑAMIENTO FEMENINO
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    top: 110,
  },
  pinkShape: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    width: 120,
    height: 120,
  },
  subtitle: {
    position: 'absolute',
    bottom: 160,
    fontFamily: 'LeagueSpartan_700Bold',
    fontSize: 14,
    letterSpacing: 1,
    color: colors.textSecondary,
  },
});