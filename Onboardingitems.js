import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

const OnboardingItems = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={item.image}
        style={[styles.image, { width, resizeMode: 'contain' }]}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 10,
    color: '#486966',
    textAlign: 'center',
  },
  description: {
    fontWeight: '300',
    fontSize: 28,
    paddingHorizontal: 64,
    color: '#62656b',
    textAlign: 'center',
  },
});

export default OnboardingItems;
