// import React, {useEffect} from 'react';
// import {View, Image, StyleSheet, Dimensions} from 'react-native';

// const {width, height} = Dimensions.get('window');

// const SplashScreen = ({navigation}) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('HomeScreen');
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../utils/MathQuest.webp')} // Replace with your actual logo path
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </View>
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
//     backgroundColor: '#333333',
//   },
//   logoContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logo: {
//     width: width * 0.6, // 60% of screen width
//     height: height * 0.3, // 30% of screen height
//   },
// });

// export default SplashScreen;

import React, {useEffect} from 'react';
import {View, Image, StyleSheet, Dimensions, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  // Animation value for fade-in effect
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Home Screen after delay
    const timer = setTimeout(() => {
      // Fade out before navigation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('HomeScreen');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4158D0', '#C850C0', '#FFCC70']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.background}
      />

      {/* Animated logo container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Image
          source={require('../utils/MathQuestLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Loading animation */}
        <LottieView
          source={require('../utils/Loading.json')}
          style={styles.loadingAnimation}
          autoPlay
          loop
        />
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
  },
  loadingAnimation: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
});

export default SplashScreen;
