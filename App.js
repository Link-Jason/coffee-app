import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BrewScreen from './src/screens/BrewScreen';
import YieldScreen from './src/screens/YieldScreen';

const COLORS = { bg: '#0F0F0F', accent: '#A65B3C', surface: '#1A1A1A' };

export default function App() {
  const [mode, setMode] = useState('brew');
  
  const [ratio, setRatio] = useState('16');
  const [liters, setLiters] = useState('1.5');
  const [grams, setGrams] = useState('20');

  const sanitize = (input) => {
    const normalized = input.replace(',', '.');
    let out = ''; let seenDot = false;
    for (const ch of normalized) {
      if (ch >= '0' && ch <= '9') out += ch;
      else if (ch === '.' && !seenDot) { out += ch; seenDot = true; }
    }
    return out.startsWith('.') ? `0${out}` : out;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#161616', '#0F0F0F']} style={{ flex: 1 }}>
        
        <View style={{ flex: 1 }}>
          {mode === 'brew' ? (
            <BrewScreen 
              liters={liters} setLiters={setLiters} 
              ratio={ratio} setRatio={setRatio} sanitize={sanitize} 
            />
          ) : (
            <YieldScreen 
              grams={grams} setGrams={setGrams} 
              ratio={ratio} setRatio={setRatio} sanitize={sanitize} 
            />
          )}
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => setMode(mode === 'brew' ? 'yield' : 'brew')}
          style={styles.toggleWrapper}
        >
          <View style={styles.toggleBtn}>
            <Text style={styles.toggleText}>
              {mode === 'brew' ? "USE REMAINING BEANS →" : "← BACK TO BREW CALC"}
            </Text>
          </View>
        </TouchableOpacity>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  toggleWrapper: { paddingHorizontal: 36, paddingBottom: 40 },
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