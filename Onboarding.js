import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import Onboardingitems from './Onboardingitems';
import Paginator from './Paginator';
import React, { useRef, useEffect, useState } from 'react';
import slides from '../slides';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NextButton from '../components/NextButton';

const Onboarding = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const [currentIndex, setcurrentIndex] = useState(0);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setcurrentIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem('@viewedOnboarding', 'true');
      } catch (err) {
        console.log('Error @setItem: ', err);
      }
    }
  };
  return (
    <View style={{ flex: 3 }}>
      <FlatList
        data={slides}
        renderItem={({ item }) => <Onboardingitems item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      <Paginator data={slides} scrollX={scrollX} />
      <NextButton
        scrollTo={scrollTo}
        percentage={(currentIndex + 1) * (100 / slides.length)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Onboarding;
