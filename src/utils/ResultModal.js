import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';

const {width} = Dimensions.get('window');

const ResultModal = ({visible, isSuccess, onContinue, currentLevel}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onContinue}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <View style={styles.modalHeader}>
            <LottieView
              autoPlay
              loop={isSuccess}
              style={styles.modalAnimation}
              source={
                isSuccess
                  ? require('../utils/right.json')
                  : require('../utils/wrong.json')
              }
            />
          </View>

          <Text style={styles.modalTitle}>
            {isSuccess ? '🎉 Excellent!' : 'Wrong'}
          </Text>
          <Text style={styles.modalMessage}>
            {isSuccess
              ? `You've completed Level ${currentLevel}! Ready for the next challenge?`
              : 'Keep trying! Use the hint if you need help.'}
          </Text>

          <View style={styles.modalButtons}>
            {!isSuccess && (
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={onContinue}>
                <Text style={styles.modalButtonTextSecondary}>Try Again</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.modalButton,
                isSuccess
                  ? styles.modalButtonSuccess
                  : styles.modalButtonPrimary,
              ]}
              onPress={onContinue}>
              <Text style={styles.modalButtonText}>
                {isSuccess ? 'Continue to Next Level' : 'Show Hint'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width * 0.85,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAnimation: {
    width: 150,
    height: 150,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'column',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalButtonSuccess: {
    backgroundColor: '#2ecc71',
  },
  modalButtonPrimary: {
    backgroundColor: '#3498db',
  },
  modalButtonSecondary: {
    backgroundColor: '#f5f6fa',
    borderWidth: 1,
    borderColor: '#dcdde1',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultModal;
