import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import BrewScreen from './src/screens/BrewScreen';
import YieldScreen from './src/screens/YieldScreen';

export default function App() {
  const [liters, setLiters] = useState('1.5');
  const [grams, setGrams] = useState('94');
  const [ratio, setRatio] = useState('16');

  const sanitize = (val) => val.replace(/[^0-9.]/g, '');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.screenWrapper}>
          <BrewScreen 
            liters={liters} setLiters={setLiters} 
            ratio={ratio} setRatio={setRatio} 
            sanitize={sanitize} 
          />
        </View>
        <View style={styles.screenWrapper}>
          <YieldScreen 
            grams={grams} setGrams={setGrams} 
            ratio={ratio} setRatio={setRatio} 
            sanitize={sanitize} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  scrollContainer: { 
    flex: 1 
  },
  screenWrapper: {
    width: '100%',
    paddingBottom: 20
  }
});