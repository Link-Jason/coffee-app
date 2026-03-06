import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import BrewScreen from './src/screens/BrewScreen';
import YieldScreen from './src/screens/YieldScreen';

export default function App() {
  const [liters, setLiters] = useState('1.5');
  const [grams, setGrams] = useState('94');
  const [ratio, setRatio] = useState('16');
  const pagerRef = React.useRef(null);

  const sanitize = (val) => val.replace(/[^0-9.]/g, '');

  return (
    <SafeAreaView style={styles.container}>
      <PagerView style={styles.pager} initialPage={0} ref={pagerRef}>
        <View key="1">
          <BrewScreen 
            liters={liters} setLiters={setLiters} 
            ratio={ratio} setRatio={setRatio} 
            sanitize={sanitize} 
          />
        </View>
        <View key="2">
          <YieldScreen 
            grams={grams} setGrams={setGrams} 
            ratio={ratio} setRatio={setRatio} 
            sanitize={sanitize} 
          />
        </View>
      </PagerView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  pager: { flex: 1 },
});