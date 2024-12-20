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
import eventEmitter from '../services/events';

const {width, height} = Dimensions.get('window');
const BUTTON_SIZE = width * 0.17; // Slightly larger buttons
const LEVELS_PER_ROW = 4; // Reduced for better spacing
const TOTAL_LEVELS = 100;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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
      activeOpacity={0.7}
      onPress={handlePress}
      style={[styles.levelButtonContainer, animatedStyle]}>
      <LinearGradient
        colors={
          isUnlocked
            ? ['#3A1C71', '#D76D77', '#FFAF7B']
            : ['#2C3E50', '#34495E']
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.levelButton}>
        <Text style={styles.levelText}>{levelNum}</Text>
        {isUnlocked ? (
          <View style={styles.progressIndicator}>
            <Icon name="check" size={12} color="#FFFFFF" />
          </View>
        ) : (
          <Icon
            name="lock"
            size={14}
            color="rgba(255,255,255,0.7)"
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

    // Listen for level completion events
    const handleLevelComplete = ({nextLevel}) => {
      setUnlockedLevels(nextLevel);
    };

    // Use the imported eventEmitter instead of global
    eventEmitter.on('levelCompleted', handleLevelComplete);

    // Cleanup listener
    return () => {
      eventEmitter.removeListener('levelCompleted', handleLevelComplete);
    };
  }, []);

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
        colors={['#000428', '#004e92']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.background}
      />

      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.header}>
          <Text style={styles.headerText}>Math Quest</Text>
          <Text style={styles.subHeaderText}>Select Your Challenge</Text>
        </LinearGradient>
      </View>

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
    backgroundColor: '#000428',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginHorizontal: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  subHeaderText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 25,
  },
  levelsContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  levelButtonContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    margin: 8,
    borderRadius: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 4.5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  levelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 5,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 4,
  },
  lockIcon: {
    position: 'absolute',
    bottom: 8,
  },
});

export default LevelScreen;
