// // import {View, Text} from 'react-native';
// // import React from 'react';

// // const LevelScreen = () => {
// //   return (
// //     <View>
// //       <Text>LevelScreen</Text>
// //     </View>
// //   );
// // };

// // export default LevelScreen;

// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   withSequence,
// } from 'react-native-reanimated';

// const {width, height} = Dimensions.get('window');
// const ITEM_SIZE = width * 0.15; // Size for each level button
// const GRID_PADDING = 20;
// const ITEMS_PER_ROW = 5;

// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// const LevelScreen = ({navigation}) => {
//   // Create an array of 100 levels
//   const levels = Array.from({length: 100}, (_, i) => i + 1);

//   const handleLevelPress = level => {
//     navigation.navigate('QuestionScreen', {level});
//   };

//   const renderLevelButton = level => {
//     const scale = useSharedValue(1);

//     const handlePress = () => {
//       scale.value = withSequence(
//         withSpring(0.9, {damping: 2}),
//         withSpring(1.1, {damping: 2}),
//         withSpring(1, {damping: 2}),
//       );
//       handleLevelPress(level);
//     };

//     const animatedStyle = useAnimatedStyle(() => ({
//       transform: [{scale: scale.value}],
//     }));

//     return (
//       <AnimatedTouchable
//         key={level}
//         style={[styles.levelButton, animatedStyle]}
//         onPress={handlePress}>
//         <LinearGradient
//           colors={['#4158D0', '#C850C0']}
//           start={{x: 0, y: 0}}
//           end={{x: 1, y: 1}}
//           style={styles.buttonGradient}>
//           <Text style={styles.levelText}>{level}</Text>
//         </LinearGradient>
//       </AnimatedTouchable>
//     );
//   };

//   const renderRow = startIndex => {
//     const rowLevels = levels.slice(startIndex, startIndex + ITEMS_PER_ROW);
//     return (
//       <View key={startIndex} style={styles.row}>
//         {rowLevels.map(level => renderLevelButton(level))}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#4158D0', '#C850C0', '#FFCC70']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 1}}
//         style={styles.background}
//       />

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Select Level</Text>
//       </View>

//       {/* Levels Grid */}
//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}>
//         <View style={styles.gridContainer}>
//           {Array.from(
//             {length: Math.ceil(levels.length / ITEMS_PER_ROW)},
//             (_, i) => renderRow(i * ITEMS_PER_ROW),
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   background: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   },
//   header: {
//     padding: 20,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   headerText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: {width: 2, height: 2},
//     textShadowRadius: 5,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   gridContainer: {
//     padding: GRID_PADDING,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 15,
//   },
//   levelButton: {
//     width: ITEM_SIZE,
//     height: ITEM_SIZE,
//     margin: 5,
//     borderRadius: ITEM_SIZE / 2,
//     overflow: 'hidden',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   buttonGradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   levelText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: {width: 1, height: 1},
//     textShadowRadius: 2,
//   },
// });

// export default LevelScreen;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const BUTTON_SIZE = width * 0.15;
const LEVELS_PER_ROW = 5;
const TOTAL_LEVELS = 100;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Memoized Level Button Component
const LevelButton = React.memo(({levelNum, isUnlocked, onPress}) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (isUnlocked) {
      scale.value = withSequence(
        withSpring(0.9, {damping: 2}),
        withSpring(1.1, {damping: 2}),
        withSpring(1, {damping: 2}),
      );
      onPress(levelNum);
    } else {
      Alert.alert(
        'Level Locked',
        'Complete previous levels to unlock this one!',
      );
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <AnimatedTouchable
      activeOpacity={0.8}
      onPress={handlePress}
      style={[styles.levelButtonContainer, animatedStyle]}>
      <LinearGradient
        colors={isUnlocked ? ['#4158D0', '#C850C0'] : ['#BDC3C7', '#95A5A6']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.levelButton}>
        <Text style={styles.levelText}>{levelNum}</Text>
        {isUnlocked ? (
          <View style={styles.progressDot} />
        ) : (
          <Icon
            name="lock"
            size={12}
            color="rgba(255,255,255,0.5)"
            style={styles.lockIcon}
          />
        )}
      </LinearGradient>
    </AnimatedTouchable>
  );
});

const LevelScreen = () => {
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    loadUnlockedLevels();
  }, []);

  const loadUnlockedLevels = async () => {
    try {
      const level = await AsyncStorage.getItem('unlockedLevel');
      if (level) {
        setUnlockedLevels(parseInt(level));
      }
    } catch (error) {
      console.error('Error loading levels:', error);
    }
  };

  const handleLevelPress = level => {
    if (level <= unlockedLevels) {
      navigation.navigate('QuestionScreen', {level});
    }
  };

  const renderLevelRows = () => {
    const rows = [];
    const totalRows = Math.ceil(TOTAL_LEVELS / LEVELS_PER_ROW);

    for (let i = 0; i < totalRows; i++) {
      const rowButtons = [];
      for (let j = 0; j < LEVELS_PER_ROW; j++) {
        const levelNum = i * LEVELS_PER_ROW + j + 1;
        if (levelNum <= TOTAL_LEVELS) {
          rowButtons.push(
            <LevelButton
              key={levelNum}
              levelNum={levelNum}
              isUnlocked={levelNum <= unlockedLevels}
              onPress={handleLevelPress}
            />,
          );
        }
      }
      rows.push(
        <View key={i} style={styles.row}>
          {rowButtons}
        </View>,
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4158D0', '#C850C0', '#FFCC70']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.background}
      />

      <LinearGradient
        colors={['#4158D0', '#C850C0']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>
        <Text style={styles.headerText}>Math Quest Levels</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.levelsContainer}>{renderLevelRows()}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  levelsContainer: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  levelButtonContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    margin: 5,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  levelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BUTTON_SIZE / 2,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  progressDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  lockIcon: {
    position: 'absolute',
    bottom: 4,
  },
});

export default LevelScreen;
