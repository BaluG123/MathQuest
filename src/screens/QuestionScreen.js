// import React, {useState, useEffect, useCallback, useMemo} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Animated,
//   Dimensions,
//   ScrollView,
//   Platform,
//   Vibration,
//   BackHandler,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import * as Progress from 'react-native-progress';
// import {FadeInDown} from 'react-native-reanimated';
// import ResultModal from '../utils/ResultModal';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {
//   RewardedAd,
//   RewardedAdEventType,
//   TestIds,
// } from 'react-native-google-mobile-ads';
// import questions from '../utils/questions.json';

// const {width} = Dimensions.get('window');

// const adUnitId = __DEV__
//   ? TestIds.REWARDED
//   : 'ca-app-pub-2627956667785383/7230837965';

// const rewarded = RewardedAd.createForAdRequest(adUnitId, {
//   keywords: ['fashion', 'clothing'],
// });

// const QuestionScreen = ({route, navigation}) => {
//   const [uiState, setUiState] = useState({
//     selectedOption: null,
//     showHint: false,
//     showSolution: false,
//     modalVisible: false,
//     isSuccess: false,
//     isAdLoaded: false,
//     hasAnswered: false, // New state to track if user has answered
//   });

//   const [animations] = useState({
//     fade: new Animated.Value(0),
//     scale: new Animated.Value(0.95),
//   });

//   const {level} = route.params;
//   const currentQuestion = useMemo(
//     () => questions.questions.find(q => q.level === level),
//     [level],
//   );
//   const totalQuestions = questions.questions.length;
//   const progress = useMemo(
//     () => level / totalQuestions,
//     [level, totalQuestions],
//   );

//   // Add back button handler
//   useEffect(() => {
//     const backAction = () => {
//       navigation.replace('LevelScreen'); // Replace with your level screen name
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );

//     return () => backHandler.remove();
//   }, [navigation]);

//   // Add navigation options
//   useEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => (
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.replace('LevelScreen')}>
//           <Icon name="arrow-left" size={24} color="#2c3e50" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation]);

//   const animateEntrance = useCallback(() => {
//     Animated.parallel([
//       Animated.timing(animations.fade, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//       Animated.spring(animations.scale, {
//         toValue: 1,
//         friction: 8,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, [animations]);

//   useEffect(() => {
//     animateEntrance();

//     const adLoadTimeout = setTimeout(() => {
//       if (!uiState.isAdLoaded) {
//         setUiState(prev => ({...prev, isAdLoaded: true}));
//       }
//     }, 4000);

//     const unsubscribeLoaded = rewarded.addAdEventListener(
//       RewardedAdEventType.LOADED,
//       () => setUiState(prev => ({...prev, showSolution: true})),
//     );

//     const unsubscribeEarned = rewarded.addAdEventListener(
//       RewardedAdEventType.EARNED_REWARD,
//       () => setUiState(prev => ({...prev, showSolution: true})),
//     );

//     rewarded.load();

//     return () => {
//       clearTimeout(adLoadTimeout);
//       unsubscribeLoaded();
//       unsubscribeEarned();
//     };
//   }, []);

//   const handleOptionSelect = useCallback(
//     async index => {
//       // Prevent multiple selections
//       if (uiState.hasAnswered) return;

//       const isCorrect = index === currentQuestion.correctAnswer;

//       setUiState(prev => ({
//         ...prev,
//         selectedOption: index,
//         isSuccess: isCorrect,
//         modalVisible: true,
//         hasAnswered: true, // Mark as answered
//       }));

//       if (isCorrect) {
//         try {
//           const nextLevel = level + 1;
//           await AsyncStorage.setItem('unlockedLevel', nextLevel.toString());
//           // Emit event for level screen update
//           if (global.eventEmitter) {
//             global.eventEmitter.emit('levelCompleted', {
//               level: level,
//               nextLevel: nextLevel,
//             });
//           }
//         } catch (error) {
//           console.error('Error saving level:', error);
//         }
//       } else {
//         Platform.OS !== 'web' && Vibration.vibrate(500);
//       }
//     },
//     [currentQuestion, level, uiState.hasAnswered],
//   );

//   const handleModalContinue = useCallback(() => {
//     setUiState(prev => ({
//       ...prev,
//       modalVisible: false,
//       showHint: !prev.isSuccess,
//     }));

//     if (uiState.isSuccess) {
//       navigation.replace('QuestionScreen', {level: level + 1});
//     }
//   }, [uiState.isSuccess, level, navigation]);

//   const toggleSolution = useCallback(() => {
//     if (uiState.showSolution) {
//       setUiState(prev => ({...prev, showSolution: false}));
//     } else {
//       if (uiState.isAdLoaded) {
//         rewarded.show();
//       } else {
//         Alert.alert('Ad not ready', 'Please try again in a moment.');
//         rewarded.load();
//       }
//     }
//   }, [uiState.showSolution, uiState.isAdLoaded]);

//   const renderOptionButton = useCallback(
//     (option, index) => {
//       const isSelected = uiState.selectedOption === index;
//       const isCorrectAnswer = index === currentQuestion.correctAnswer;

//       return (
//         <TouchableOpacity
//           key={index}
//           style={[
//             styles.optionButton,
//             isSelected && styles.selectedOption,
//             isSelected && isCorrectAnswer && styles.correctOption,
//             isSelected && !isCorrectAnswer && styles.wrongOption,
//           ]}
//           onPress={() => handleOptionSelect(index)}
//           activeOpacity={0.7}>
//           <View style={styles.optionContent}>
//             <Text style={styles.optionLetter}>
//               {String.fromCharCode(65 + index)}
//             </Text>
//             <Text
//               style={[
//                 styles.optionText,
//                 isSelected && isCorrectAnswer && styles.correctOptionText,
//                 isSelected && !isCorrectAnswer && styles.wrongOptionText,
//               ]}>
//               {option}
//             </Text>
//             {isSelected && (
//               <Icon
//                 name={isCorrectAnswer ? 'check-circle' : 'close-circle'}
//                 size={24}
//                 color="#fff"
//                 style={styles.optionIcon}
//               />
//             )}
//           </View>
//         </TouchableOpacity>
//       );
//     },
//     [uiState.selectedOption, currentQuestion.correctAnswer, handleOptionSelect],
//   );

//   return (
//     <>
//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//         <Animated.View
//           style={[
//             styles.content,
//             {
//               opacity: animations.fade,
//               transform: [{scale: animations.scale}],
//             },
//           ]}>
//           <View style={styles.header}>
//             <View style={styles.levelInfo}>
//               <Text style={styles.levelLabel}>Level {level}</Text>
//               <Progress.Bar
//                 progress={progress}
//                 width={width * 0.4}
//                 color="#3498db"
//                 unfilledColor="#e0e0e0"
//                 borderWidth={0}
//                 height={4}
//                 style={styles.progressBar}
//               />
//             </View>
//             <Text style={styles.questionCounter}>
//               {level}/{totalQuestions}
//             </Text>
//           </View>

//           <View style={styles.questionCard}>
//             <Text style={styles.questionText}>{currentQuestion.question}</Text>

//             <View style={styles.optionsContainer}>
//               {currentQuestion.options.map(renderOptionButton)}
//             </View>

//             <View style={styles.helpButtons}>
//               <TouchableOpacity
//                 style={[
//                   styles.helpButton,
//                   uiState.showHint && styles.activeHelpButton,
//                 ]}
//                 onPress={toggleHint}>
//                 <Icon
//                   name={uiState.showHint ? 'lightbulb-on' : 'lightbulb-outline'}
//                   size={24}
//                   color={uiState.showHint ? '#fff' : '#3498db'}
//                 />
//                 <Text
//                   style={[
//                     styles.helpButtonText,
//                     uiState.showHint && styles.activeHelpButtonText,
//                   ]}>
//                   {uiState.showHint ? 'Hide Hint' : 'Need a Hint?'}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.helpButton,
//                   uiState.showSolution && styles.activeHelpButton,
//                 ]}
//                 onPress={toggleSolution}>
//                 <Icon
//                   name={uiState.showSolution ? 'eye-off' : 'eye'}
//                   size={24}
//                   color={uiState.showSolution ? '#fff' : '#3498db'}
//                 />
//                 <Text
//                   style={[
//                     styles.helpButtonText,
//                     uiState.showSolution && styles.activeHelpButtonText,
//                   ]}>
//                   {uiState.showSolution ? 'Hide Solution' : 'Show Solution'}
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {uiState.showHint && (
//               <Animated.View entering={FadeInDown} style={styles.hintContainer}>
//                 <Icon name="lightbulb-on" size={24} color="#f39c12" />
//                 <Text style={styles.hintText}>{currentQuestion.hint}</Text>
//               </Animated.View>
//             )}

//             {uiState.showSolution && (
//               <Animated.View
//                 entering={FadeInDown}
//                 style={styles.solutionContainer}>
//                 <Icon name="book-open-variant" size={24} color="#27ae60" />
//                 <Text style={styles.solutionText}>
//                   {currentQuestion.solution}
//                 </Text>
//               </Animated.View>
//             )}
//           </View>
//         </Animated.View>
//       </ScrollView>

//       <ResultModal
//         visible={uiState.modalVisible}
//         isSuccess={uiState.isSuccess}
//         onContinue={handleModalContinue}
//         currentLevel={level}
//       />
//     </>
//   );
// };

import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  Vibration,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import {FadeInDown} from 'react-native-reanimated';
import ResultModal from '../utils/ResultModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import questions from '../utils/questions.json';
import eventEmitter from '../services/events';

const {width} = Dimensions.get('window');

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-2627956667785383/7230837965';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

const QuestionScreen = ({route, navigation}) => {
  const [uiState, setUiState] = useState({
    selectedOption: null,
    showHint: false,
    showSolution: false,
    modalVisible: false,
    isSuccess: false,
    isAdLoaded: false,
    hasAnswered: false,
    isNavigating: false,
  });

  const [animations] = useState({
    fade: new Animated.Value(0),
    scale: new Animated.Value(0.95),
  });

  const {level} = route.params;
  const currentQuestion = useMemo(
    () => questions.questions.find(q => q.level === level),
    [level],
  );
  const totalQuestions = questions.questions.length;
  const progress = useMemo(
    () => level / totalQuestions,
    [level, totalQuestions],
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-left" size={24} color="#2c3e50" />
        </TouchableOpacity>
      ),
      gestureEnabled: false,
    });
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    if (!uiState.hasAnswered) {
      navigation.replace('LevelScreen');
    } else {
      Alert.alert(
        'Leave Level?',
        'Your progress on this level will be saved.',
        [
          {
            text: 'Stay',
            style: 'cancel',
          },
          {
            text: 'Leave',
            onPress: () => navigation.replace('LevelScreen'),
          },
        ],
      );
    }
  }, [uiState.hasAnswered, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBackPress();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  const animateEntrance = useCallback(() => {
    Animated.parallel([
      Animated.timing(animations.fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(animations.scale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animations]);

  useEffect(() => {
    animateEntrance();

    const adLoadTimeout = setTimeout(() => {
      if (!uiState.isAdLoaded) {
        setUiState(prev => ({...prev, isAdLoaded: true}));
      }
    }, 4000);

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setUiState(prev => ({...prev, showSolution: true})),
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => setUiState(prev => ({...prev, showSolution: true})),
    );

    rewarded.load();

    return () => {
      clearTimeout(adLoadTimeout);
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  // const handleOptionSelect = useCallback(
  //   async index => {
  //     if (uiState.hasAnswered || uiState.isNavigating) return;

  //     const isCorrect = index === currentQuestion.correctAnswer;

  //     setUiState(prev => ({
  //       ...prev,
  //       selectedOption: index,
  //       isSuccess: isCorrect,
  //       modalVisible: true,
  //       hasAnswered: true,
  //     }));

  //     if (isCorrect) {
  //       try {
  //         const nextLevel = level + 1;
  //         await AsyncStorage.setItem('unlockedLevel', nextLevel.toString());

  //         global.eventEmitter.emit('levelCompleted', {
  //           level: level,
  //           nextLevel: nextLevel,
  //         });
  //       } catch (error) {
  //         console.error('Error saving level:', error);
  //       }
  //     } else {
  //       Platform.OS !== 'web' && Vibration.vibrate(500);
  //     }
  //   },
  //   [currentQuestion, level, uiState.hasAnswered, uiState.isNavigating],
  // );

  const handleOptionSelect = useCallback(
    async index => {
      if (uiState.hasAnswered || uiState.isNavigating) return;

      const isCorrect = index === currentQuestion.correctAnswer;

      setUiState(prev => ({
        ...prev,
        selectedOption: index,
        isSuccess: isCorrect,
        modalVisible: true,
        hasAnswered: true,
      }));

      if (isCorrect) {
        try {
          const nextLevel = level + 1;
          await AsyncStorage.setItem('unlockedLevel', nextLevel.toString());

          // Use the imported eventEmitter instead of global
          eventEmitter.emit('levelCompleted', {
            level: level,
            nextLevel: nextLevel,
          });
        } catch (error) {
          console.error('Error saving level:', error);
        }
      } else {
        Platform.OS !== 'web' && Vibration.vibrate(500);
      }
    },
    [currentQuestion, level, uiState.hasAnswered, uiState.isNavigating],
  );

  const handleModalContinue = useCallback(() => {
    if (uiState.isNavigating) return;

    setUiState(prev => ({
      ...prev,
      modalVisible: false,
      showHint: !prev.isSuccess,
      isNavigating: true,
    }));

    if (uiState.isSuccess) {
      setTimeout(() => {
        navigation.replace('QuestionScreen', {level: level + 1});
      }, 100);
    }
  }, [uiState.isSuccess, uiState.isNavigating, level, navigation]);

  const toggleHint = useCallback(() => {
    setUiState(prev => ({...prev, showHint: !prev.showHint}));
  }, []);

  const toggleSolution = useCallback(() => {
    if (uiState.showSolution) {
      setUiState(prev => ({...prev, showSolution: false}));
    } else {
      if (uiState.isAdLoaded) {
        rewarded.show();
      } else {
        Alert.alert('Ad not ready', 'Please try again in a moment.');
        rewarded.load();
      }
    }
  }, [uiState.showSolution, uiState.isAdLoaded]);

  const renderOptionButton = useCallback(
    (option, index) => {
      const isSelected = uiState.selectedOption === index;
      const isCorrectAnswer = index === currentQuestion.correctAnswer;

      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            isSelected && styles.selectedOption,
            isSelected && isCorrectAnswer && styles.correctOption,
            isSelected && !isCorrectAnswer && styles.wrongOption,
          ]}
          onPress={() => handleOptionSelect(index)}
          disabled={uiState.hasAnswered}
          activeOpacity={0.7}>
          <View style={styles.optionContent}>
            <Text style={styles.optionLetter}>
              {String.fromCharCode(65 + index)}
            </Text>
            <Text
              style={[
                styles.optionText,
                isSelected && isCorrectAnswer && styles.correctOptionText,
                isSelected && !isCorrectAnswer && styles.wrongOptionText,
              ]}>
              {option}
            </Text>
            {isSelected && (
              <Icon
                name={isCorrectAnswer ? 'check-circle' : 'close-circle'}
                size={24}
                color="#fff"
                style={styles.optionIcon}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [
      uiState.selectedOption,
      currentQuestion.correctAnswer,
      handleOptionSelect,
      uiState.hasAnswered,
    ],
  );

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: animations.fade,
              transform: [{scale: animations.scale}],
            },
          ]}>
          <View style={styles.header}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Level {level}</Text>
              <Progress.Bar
                progress={progress}
                width={width * 0.4}
                color="#3498db"
                unfilledColor="#e0e0e0"
                borderWidth={0}
                height={4}
                style={styles.progressBar}
              />
            </View>
            <Text style={styles.questionCounter}>
              {level}/{totalQuestions}
            </Text>
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map(renderOptionButton)}
            </View>

            <View style={styles.helpButtons}>
              <TouchableOpacity
                style={[
                  styles.helpButton,
                  uiState.showHint && styles.activeHelpButton,
                ]}
                onPress={toggleHint}>
                <Icon
                  name={uiState.showHint ? 'lightbulb-on' : 'lightbulb-outline'}
                  size={24}
                  color={uiState.showHint ? '#fff' : '#3498db'}
                />
                <Text
                  style={[
                    styles.helpButtonText,
                    uiState.showHint && styles.activeHelpButtonText,
                  ]}>
                  {uiState.showHint ? 'Hide Hint' : 'Need a Hint?'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.helpButton,
                  uiState.showSolution && styles.activeHelpButton,
                ]}
                onPress={toggleSolution}>
                <Icon
                  name={uiState.showSolution ? 'eye-off' : 'eye'}
                  size={24}
                  color={uiState.showSolution ? '#fff' : '#3498db'}
                />
                <Text
                  style={[
                    styles.helpButtonText,
                    uiState.showSolution && styles.activeHelpButtonText,
                  ]}>
                  {uiState.showSolution ? 'Hide Solution' : 'Show Solution'}
                </Text>
              </TouchableOpacity>
            </View>

            {uiState.showHint && (
              <Animated.View entering={FadeInDown} style={styles.hintContainer}>
                <Icon name="lightbulb-on" size={24} color="#f39c12" />
                <Text style={styles.hintText}>{currentQuestion.hint}</Text>
              </Animated.View>
            )}

            {uiState.showSolution && (
              <Animated.View
                entering={FadeInDown}
                style={styles.solutionContainer}>
                <Icon name="book-open-variant" size={24} color="#27ae60" />
                <Text style={styles.solutionText}>
                  {currentQuestion.solution}
                </Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      <ResultModal
        visible={uiState.modalVisible}
        isSuccess={uiState.isSuccess}
        onContinue={handleModalContinue}
        currentLevel={level}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: wp('4%'),
  },
  backButton: {
    padding: wp('3%'),
    marginLeft: wp('2%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    paddingTop: Platform.OS === 'ios' ? hp('6%') : hp('3%'),
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: hp('1%'),
  },
  progressBar: {
    marginTop: hp('1%'),
  },
  questionCounter: {
    fontSize: wp('4.5%'),
    color: '#7f8c8d',
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    padding: wp('5%'),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: hp('0.5%')},
        shadowOpacity: 0.1,
        shadowRadius: wp('2%'),
      },
      android: {
        elevation: 4,
      },
    }),
  },
  questionText: {
    fontSize: wp('5%'),
    color: '#2c3e50',
    lineHeight: hp('3.5%'),
    marginBottom: hp('3%'),
    fontWeight: '600',
  },
  optionsContainer: {
    marginBottom: hp('3%'),
  },
  optionButton: {
    marginVertical: hp('1%'),
    borderRadius: wp('3%'),
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
  },
  optionLetter: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#95a5a6',
    marginRight: wp('3%'),
    width: wp('7%'),
  },
  optionText: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#2c3e50',
  },
  selectedOption: {
    borderColor: '#3498db',
  },
  correctOption: {
    backgroundColor: '#2ecc71',
    borderColor: '#27ae60',
  },
  wrongOption: {
    backgroundColor: '#e74c3c',
    borderColor: '#c0392b',
  },
  correctOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  wrongOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  optionIcon: {
    marginLeft: wp('3%'),
  },
  helpButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#3498db',
    flex: 0.48,
    justifyContent: 'center',
  },
  activeHelpButton: {
    backgroundColor: '#3498db',
  },
  helpButtonText: {
    marginLeft: wp('2%'),
    fontSize: wp('4%'),
    color: '#3498db',
    fontWeight: '600',
  },
  activeHelpButtonText: {
    color: '#fff',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: wp('4%'),
    backgroundColor: '#fff9c4',
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
  },
  hintText: {
    flex: 1,
    marginLeft: wp('3%'),
    color: '#666',
    fontSize: wp('4%'),
    lineHeight: hp('3%'),
  },
  solutionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: wp('4%'),
    backgroundColor: '#e8f5e9',
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
  },
  solutionText: {
    flex: 1,
    marginLeft: wp('3%'),
    color: '#2c3e50',
    fontSize: wp('4%'),
    lineHeight: hp('3%'),
  },
  successAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// export default QuestionScreen;
export default React.memo(QuestionScreen);
