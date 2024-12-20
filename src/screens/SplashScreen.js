// import React, {useEffect} from 'react';
// import {View, Image, StyleSheet, Dimensions, Animated} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import LottieView from 'lottie-react-native';

// const {width, height} = Dimensions.get('window');

// const SplashScreen = ({navigation}) => {
//   // Animation value for fade-in effect
//   const fadeAnim = React.useRef(new Animated.Value(0)).current;
//   const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

//   useEffect(() => {
//     // Start animations when component mounts
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         tension: 20,
//         friction: 7,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Navigate to Home Screen after delay
//     const timer = setTimeout(() => {
//       // Fade out before navigation
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: true,
//       }).start(() => {
//         navigation.replace('HomeScreen');
//       });
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [navigation, fadeAnim, scaleAnim]);

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#4158D0', '#C850C0', '#FFCC70']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 1}}
//         style={styles.background}
//       />

//       {/* Animated logo container */}
//       <Animated.View
//         style={[
//           styles.logoContainer,
//           {
//             opacity: fadeAnim,
//             transform: [{scale: scaleAnim}],
//           },
//         ]}>
//         <Image
//           source={require('../utils/MathQuestLogo.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />

//         {/* Loading animation */}
//         <LottieView
//           source={require('../utils/Loading.json')}
//           style={styles.loadingAnimation}
//           autoPlay
//           loop
//         />
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: width,
//     height: height,
//   },
//   background: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     borderRadius: 20,
//     padding: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//   },
//   logo: {
//     width: width * 0.6,
//     height: height * 0.3,
//   },
//   loadingAnimation: {
//     width: 100,
//     height: 100,
//     marginTop: 20,
//   },
// });

// export default SplashScreen;

import React, {useEffect} from 'react';
import {View, Image, StyleSheet, Dimensions, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  // Animation values using Reanimated
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);
  const blur = useSharedValue(0);

  const navigateToHome = () => {
    // Fade out animations before navigation
    opacity.value = withTiming(
      0,
      {
        duration: 800,
        easing: Easing.out(Easing.ease),
      },
      () => {
        runOnJS(navigation.replace)('HomeScreen');
      },
    );
  };

  useEffect(() => {
    // Initial animations
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    });

    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });

    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });

    blur.value = withSequence(
      withTiming(3, {duration: 1000}),
      withTiming(0, {duration: 1000}),
    );

    // Navigate after delay
    const timer = setTimeout(navigateToHome, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}, {translateY: translateY.value}],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1c2e', '#4158D0', '#C850C0']}
        start={{x: 0.3, y: 0}}
        end={{x: 0.8, y: 1}}
        style={styles.background}
      />

      <Animated.View style={[styles.logoContainer, containerStyle]}>
        <View style={styles.glassEffect}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientOverlay}
          />
          <Image
            source={require('../utils/MathQuestLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.loadingContainer}>
            <LottieView
              source={require('../utils/Loading.json')}
              style={styles.loadingAnimation}
              autoPlay
              loop
              speed={1.2}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    padding: 30,
    backdropFilter: 'blur(10px)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 25,
  },
  logo: {
    width: width * 0.65,
    height: height * 0.25,
    marginVertical: 20,
  },
  loadingContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 10,
  },
  loadingAnimation: {
    width: 80,
    height: 80,
  },
});

export default SplashScreen;
