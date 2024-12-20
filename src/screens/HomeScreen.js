import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, Dimensions, Text, Platform} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BlurView} from '@react-native-community/blur';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const scale = useSharedValue(1);
  const backgroundOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(-20);

  // Pre-calculate values for better performance
  const buttonSize = useMemo(() => width * 0.25, []);
  const buttonRadius = useMemo(() => buttonSize / 2, [buttonSize]);

  // Memoize navigation function
  const navigateToLevel = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: 'LevelScreen'}],
    });
  }, [navigation]);

  // Start animations on mount
  React.useEffect(() => {
    // Background animation
    backgroundOpacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    // Content fade in and slide up
    contentOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    });
    contentTranslateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
  }, []);

  // Optimized press handler with faster animations
  const handlePress = useCallback(() => {
    scale.value = withTiming(
      0.95,
      {
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
      () => {
        scale.value = withTiming(
          1,
          {
            duration: 100,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
          () => {
            runOnJS(navigateToLevel)();
          },
        );
      },
    );
  }, [scale, navigateToLevel]);

  // Animated styles
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundOpacity.value === 0 ? '#0F172A' : '#1E293B',
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{translateY: contentTranslateY.value}],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, animatedBackgroundStyle]} />

      <Animated.View style={[styles.content, animatedContentStyle]}>
        <Text style={styles.title}>Math Quest</Text>
        <Text style={styles.subtitle}>Master Mathematics</Text>

        <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            style={[styles.button, {width: buttonSize, height: buttonSize}]}>
            {Platform.OS === 'ios' && (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={20}
              />
            )}
            <Text style={styles.buttonText}>PLAY</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'sans-serif-medium',
    }),
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 48,
    fontFamily: Platform.select({ios: 'SF Pro Text', android: 'sans-serif'}),
  },
  buttonContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.1)',
      android: 'rgba(255, 255, 255, 0.15)',
    }),
    elevation: Platform.select({android: 4, default: 0}),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'sans-serif-medium',
    }),
  },
});

export default React.memo(HomeScreen);
