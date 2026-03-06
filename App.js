import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PagerView from 'react-native-pager-view';
import BrewScreen from './src/screens/BrewScreen';
import YieldScreen from './src/screens/YieldScreen';

const COLORS = { bg: '#0F0F0F', accent: '#A65B3C', surface: '#1A1A1A' };

export default function App() {
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Shared state: these numbers stay the same when you swipe
  const [ratio, setRatio] = useState('16');
  const [liters, setLiters] = useState('1.5');
  const [grams, setGrams] = useState('20');

  const sanitize = (input) => {
    const normalized = input.replace(',', '.');
    let out = ''; 
    let seenDot = false;
    for (const ch of normalized) {
      if (ch >= '0' && ch <= '9') out += ch;
      else if (ch === '.' && !seenDot) { out += ch; seenDot = true; }
    }
    return out.startsWith('.') ? `0${out}` : out;
  };

  const handleToggle = () => {
    const nextPage = currentPage === 0 ? 1 : 0;
    pagerRef.current?.setPage(nextPage);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#161616', '#0F0F0F']} style={{ flex: 1 }}>
        
        <PagerView 
          ref={pagerRef}
          style={styles.pager} 
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {/* Page 0: Brew Mode */}
          <View key="1">
            <BrewScreen 
              liters={liters} setLiters={setLiters} 
              ratio={ratio} setRatio={setRatio} sanitize={sanitize} 
            />
          </View>

          {/* Page 1: Yield Mode */}
          <View key="2">
            <YieldScreen 
              grams={grams} setGrams={setGrams} 
              ratio={ratio} setRatio={setRatio} sanitize={sanitize} 
            />
          </View>
        </PagerView>

        <View style={styles.footer}>
          {/* Page indicator dots */}
          <View style={styles.dotContainer}>
            <View style={[styles.dot, currentPage === 0 && styles.activeDot]} />
            <View style={[styles.dot, currentPage === 1 && styles.activeDot]} />
          </View>

          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleToggle}
            style={styles.toggleBtn}
          >
            <Text style={styles.toggleText}>
              {currentPage === 0 ? "USE REMAINING BEANS →" : "← BACK TO BREW CALC"}
            </Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  pager: { flex: 1 },
  footer: { paddingHorizontal: 36, paddingBottom: 40 },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#333' },
  activeDot: { backgroundColor: COLORS.accent, width: 18 },
  toggleBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  toggleText: { color: COLORS.accent, fontWeight: '800', letterSpacing: 2, fontSize: 11 }
});