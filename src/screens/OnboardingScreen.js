import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Animated, SafeAreaView, useWindowDimensions, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';

import OnboardingItem from "./OnboardingItem";
import Slides from "../components/Slides";
import Paginator from '../components/Paginator';

const { width, height } = Dimensions.get('window');

export default Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null)
  const navigation = useNavigation();

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const nextSlide = () => {
    if (currentIndex < Slides.length - 1) {
      slidesRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      navigation.navigate('InitialMenu');
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={{ flex: 3}}>
        <FlatList
          data={Slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewablityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.container}>
        <Paginator data={Slides} scrollX={scrollX} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={nextSlide}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {currentIndex === Slides.length - 1 ? "Começar" : "Próximo"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
  },
  buttonContainer: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.05,
  },
  button: {
    backgroundColor: '#4F46E5', // bg-indigo-600
    paddingVertical: height * 0.02,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
  },
});