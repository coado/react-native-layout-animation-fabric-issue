import React, {useEffect, useState, useRef, useCallback} from 'react';

import {
  View,
  TextInput,
  LayoutAnimation,
  UIManager,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Platform,
  Pressable,
  Text,
  SafeAreaView,
} from 'react-native';
import type {KeyboardEvent} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const animationSettings = {
  duration: 500,
  create: {
    duration: 300,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    duration: 300,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

const App = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [toggle, setToggle] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onKeyboardShow = (event: KeyboardEvent) => {
    LayoutAnimation.configureNext(animationSettings);

    setKeyboardHeight(event.endCoordinates.height);
  };

  const onKeyboardHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    const showListener = Keyboard.addListener(
      'keyboardWillShow',
      onKeyboardShow,
    );
    const hideListener = Keyboard.addListener(
      'keyboardWillHide',
      onKeyboardHide,
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim]);

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (keyboardHeight !== 0) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [keyboardHeight, fadeIn, fadeOut]);

  const fadeInStyles = {
    innerContainer: {
      backgroundColor: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#A167FF', '#67FFC4'],
      }),
    },
  };

  const fadeOutStyles = {
    innerContainer: {
      backgroundColor: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#67FFC4', '#A167FF'],
      }),
    },
  };

  const isKeyboardOpen = keyboardHeight !== 0;

  const shadowStyles = {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    elevation: 5,
  };

  const toggleShadow = () => {
    console.log('toggle shadow');
    setToggle(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.inputWrapper}>
            <View
              // collapsable={false}
              style={[
                styles.inputContainer,
                isKeyboardOpen && {marginBottom: keyboardHeight},
                toggle && shadowStyles,
              ]}>
              <Animated.View
                style={[
                  styles.animatedContainer,
                  fadeInStyles.innerContainer,
                  fadeOutStyles.innerContainer,
                ]}>
                <TextInput
                  style={[styles.input]}
                  placeholderTextColor={'rgba(0, 0, 0, 0.6)'}
                  placeholder="Text..."
                />
              </Animated.View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.pressableContainer}>
        <Pressable onPress={toggleShadow} style={styles.pressable}>
          <Text style={styles.pressableText}>Toggle shadow</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  inputWrapper: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  animatedContainer: {
    width: '100%',
    borderRadius: 4,
  },
  input: {
    height: 47,
    padding: 3,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    opacity: 0.2,
  },
  pressableContainer: {
    width: '100%',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    backgroundColor: '#4D45FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  pressableText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
