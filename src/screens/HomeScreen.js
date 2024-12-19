// import React from 'react';
// import {View, StyleSheet, Dimensions} from 'react-native';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   withSequence,
//   runOnJS,
// } from 'react-native-reanimated';
// import LottieView from 'lottie-react-native';
// import {useNavigation} from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import {TouchableOpacity} from 'react-native-gesture-handler';

// const {width, height} = Dimensions.get('window');

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const scale = useSharedValue(1);
//   const lottieRef = React.useRef(null);

//   const handlePress = () => {
//     // Animate the scale
//     scale.value = withSequence(
//       withSpring(0.9, {damping: 2}),
//       withSpring(1.1, {damping: 2}),
//       withSpring(1, {damping: 2}),
//     );

//     // Play the Lottie animation
//     lottieRef.current?.play();

//     // Navigate after animation
//     setTimeout(() => {
//       navigation.navigate('LevelScreen');
//     }, 1500);
//   };

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{scale: scale.value}],
//     };
//   });

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#4c669f', '#3b5998', '#192f6a']}
//         style={styles.background}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 1}}
//       />

//       <Animated.View style={[styles.content, animatedStyle]}>
//         <TouchableOpacity onPress={handlePress} style={styles.buttonContainer}>
//           <LottieView
//             ref={lottieRef}
//             source={require('../utils/Play.json')} // Make sure this path points to your Lottie JSON file
//             style={styles.lottie}
//             autoPlay={false}
//             loop={false}
//             colorFilters={[
//               {
//                 keypath: 'button',
//                 color: '#FFFFFF',
//               },
//             ]}
//           />
//         </TouchableOpacity>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   background: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   },
//   content: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     width: width * 0.3,
//     height: width * 0.3,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: width * 0.15,
//   },
//   lottie: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default HomeScreen;

import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const scale = useSharedValue(1);
  const lottieRef = React.useRef(null);

  const handlePress = () => {
    // Animate the scale
    scale.value = withSequence(
      withSpring(0.9, {damping: 2}),
      withSpring(1.1, {damping: 2}),
      withSpring(1, {damping: 2}),
    );

    // Play the Lottie animation
    lottieRef.current?.play();

    // Navigate after animation
    setTimeout(() => {
      navigation.navigate('LevelScreen');
    }, 1500);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4158D0', '#C850C0', '#FFCC70']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.background}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Math Quest</Text>
        <Text style={styles.subtitle}>Begin Your Adventure!</Text>
        <Animated.View style={[styles.buttonContainer, animatedStyle]}>
          <TouchableOpacity onPress={handlePress} style={styles.button}>
            <LottieView
              ref={lottieRef}
              source={require('../utils/Play.json')}
              style={styles.lottie}
              autoPlay={false}
              loop={false}
            />
            <Text style={styles.buttonText}>PLAY</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 40,
    opacity: 0.9,
  },
  buttonContainer: {
    width: width * 0.3,
    height: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: width * 0.15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    position: 'absolute',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;