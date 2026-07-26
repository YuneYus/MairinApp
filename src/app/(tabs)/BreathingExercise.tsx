import { colors, globalStyles } from '@/styles/global';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TOTAL_SECONDS = 60; // total exercise length
const PHASE_SECONDS = 5; // length of each inhale / exhale

export default function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');

  const scale = useRef(new Animated.Value(1)).current;
  const isRunningRef = useRef(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const runBreathCycle = (isInhale: boolean) => {
    if (!isRunningRef.current) return;
    setPhase(isInhale ? 'inhale' : 'exhale');

    animationRef.current = Animated.timing(scale, {
      toValue: isInhale ? 1.28 : 1,
      duration: PHASE_SECONDS * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    animationRef.current.start(({ finished }) => {
      if (finished && isRunningRef.current) {
        runBreathCycle(!isInhale);
      }
    });
  };

  const reset = () => {
    isRunningRef.current = false;
    setRunning(false);
    setPhase('inhale');
    setTimeLeft(TOTAL_SECONDS);
    if (animationRef.current) animationRef.current.stop();
    scale.stopAnimation();
    scale.setValue(1);
    if (tickRef.current) clearInterval(tickRef.current);
  };

  const start = () => {
    isRunningRef.current = true;
    setRunning(true);
    setTimeLeft(TOTAL_SECONDS);
    scale.setValue(1);
    runBreathCycle(true);

    tickRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          reset();
          return TOTAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (animationRef.current) animationRef.current.stop();
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeLabel = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.titleBig, styles.title]}>
        Ejercicio De Respiración
      </Text>
      <Text style={styles.timer}>{timeLabel}</Text>

      <View style={styles.circleWrap}>
        <Animated.View
          style={[styles.outerRing, { transform: [{ scale }] }]}
        />
        <View style={styles.innerRing} />
        <View style={styles.face}>
          <Image
            source={require("@/app/assets/images/transRelaxWhite.png")}
            style={styles.faceImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {running ? (
        <>
          <Text style={styles.phaseLabel}>
            {phase === 'inhale' ? 'Inhalar' : 'Exhalar'}
          </Text>
          <TouchableOpacity
            style={[globalStyles.pillButton, styles.resetButton]}
            onPress={reset}
            activeOpacity={0.85}
          >
            <Text style={globalStyles.pillButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[globalStyles.pillButton, styles.button]}
          onPress={start}
          activeOpacity={0.85}
        >
          <Text style={globalStyles.pillButtonText}>Empezar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingTop: 120,
  },
  title: {
    marginBottom: 12,
  },
  timer: {
    fontFamily: 'LeagueSpartan_700Bold',
    color: colors.primary,
    fontSize: 18,
    marginBottom: 40,
  },
  circleWrap: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  outerRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  innerRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  face: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceImage: {
    width: 150,
    height: 150,
  },
  phaseLabel: {
    fontFamily: 'LeagueSpartan_700Bold',
    color: colors.text,
    fontSize: 22,
  },
  button: {
    paddingHorizontal: 40,
    marginTop: 0,
  },
  resetButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 12,
  },
});