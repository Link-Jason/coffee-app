import React, { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateCoffee } from '../lib/brewEngine';

// The "Midnight Rust" Palette: Inky darks + Artisan Rust
const COLORS = {
  bg: '#0F0F0F',           // Near-black background
  surface: '#1A1A1A',      // Charcoal card
  textPrimary: '#FAFAFA',  // Bright white
  textSecondary: '#888888',// Neutral mid-grey
  accent: '#A65B3C',       // Artisan Rust
  border: '#333333',
};

function sanitizeNumericText(input: string): string {
  const normalized = input.replace(',', '.');
  let out = '';
  let seenDot = false;
  for (const ch of normalized) {
    if (ch >= '0' && ch <= '9') out += ch;
    else if (ch === '.' && !seenDot) {
      out += ch;
      seenDot = true;
    }
  }
  if (out.startsWith('.')) out = `0${out}`;
  return out;
}

export default function BrewScreen() {
  const [liters, setLiters] = useState<string>('1.5');
  const [ratio, setRatio] = useState<string>('16');
  const ratioInputRef = useRef<TextInput>(null);

  const coffeeGrams = useMemo(() => {
    if (!liters || !ratio) return '—';
    const l = parseFloat(liters) || 0;
    const r = parseFloat(ratio) || 0;
    const result = calculateCoffee(l, r);
    return isFinite(result) && result > 0 ? Math.round(result).toString() : '—';
  }, [liters, ratio]);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#161616', '#0F0F0F']} style={{ flex: 1 }}>
        <View style={styles.container}>

          {/* Hero Result Section */}
          <View style={styles.resultContainer}>
            <Text style={styles.resultValue}>
              {coffeeGrams}
              {coffeeGrams !== '—' && <Text style={styles.unit}>g</Text>}
            </Text>
            <Text style={styles.resultLabel}>Coffee Required</Text>
          </View>

          {/* Input Form */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Water (Liters)</Text>
              <TextInput
                value={liters}
                onChangeText={(val) => setLiters(sanitizeNumericText(val))}
                placeholder="1.5"
                placeholderTextColor="#444444"
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </View>

            <Pressable
              onPress={() => ratioInputRef.current?.focus()}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={{ transform: [{ scale: scaleAnim }] }}
            >
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Ratio</Text>
                <View style={styles.row}>
                  <Text style={styles.prefix}>1 :</Text>
                  <TextInput
                    ref={ratioInputRef}
                    value={ratio}
                    onChangeText={(val) => setRatio(sanitizeNumericText(val))}
                    placeholder="16"
                    placeholderTextColor="#444444"
                    keyboardType="decimal-pad"
                    style={styles.inlineInput}
                  />
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: 36, paddingTop: 72 },

  // Result Section
  resultContainer: { marginBottom: 72, alignItems: 'flex-start' },
  resultValue: { fontSize: 96, fontWeight: '900', color: COLORS.accent, letterSpacing: -3 },
  unit: { fontSize: 32, fontWeight: '500', color: COLORS.textSecondary },
  resultLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginTop: 6, letterSpacing: 1 },

  // Inputs
  form: { gap: 28 },
  inputWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5, // Thicker border for the Rust
    borderColor: COLORS.accent, // Permanent Rust border
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, letterSpacing: 0.5 },
  
  row: { flexDirection: 'row', alignItems: 'center' },
  prefix: { fontSize: 18, fontWeight: '600', color: COLORS.textSecondary, marginRight: 8 },
  inlineInput: { flex: 1, fontSize: 18, fontWeight: '500', color: COLORS.textPrimary },
  input: { fontSize: 18, fontWeight: '500', color: COLORS.textPrimary, height: 40 },
});