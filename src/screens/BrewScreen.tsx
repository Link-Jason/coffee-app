import React, { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { calculateCoffee } from '../lib/brewEngine';

type Field = 'liters' | 'ratio';

// Studio-Level Tonal System
const COLORS = {
  bg: '#F5F5F5',            // Light neutral background
  surface: '#FFFFFF',        // Elevated card surface
  textPrimary: '#111111',    // Deep, elegant black
  textSecondary: '#7A7A7A',  // Subtle, sophisticated gray
  accent: '#2563EB',         // Minimal, cool blue for micro accents
  border: '#E6E6E6',         // Soft, subtle boundaries
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
  const [activeField, setActiveField] = useState<Field | null>(null);

  const ratioInputRef = useRef<TextInput>(null);

  const coffeeGrams = useMemo(() => {
    if (!liters || !ratio) return '—';
    const l = parseFloat(liters) || 0;
    const r = parseFloat(ratio) || 0;
    const result = calculateCoffee(l, r);
    return isFinite(result) && result > 0 ? Math.round(result).toString() : '—';
  }, [liters, ratio]);

  // Animated press effect
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Hero Result */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultValue}>
            {coffeeGrams}
            {coffeeGrams !== '—' && <Text style={styles.unit}>g</Text>}
          </Text>
          <Text style={styles.resultLabel}>Coffee Required</Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          {/* Water */}
          <Animated.View style={[styles.inputWrapper, activeField === 'liters' && styles.inputActiveWrapper]}>
            <Text style={styles.label}>Water (Liters)</Text>
            <TextInput
              value={liters}
              onChangeText={(val) => setLiters(sanitizeNumericText(val))}
              onFocus={() => setActiveField('liters')}
              onBlur={() => setActiveField(null)}
              placeholder="1.5"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </Animated.View>

          {/* Ratio */}
          <Pressable
            onPress={() => ratioInputRef.current?.focus()}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            <Animated.View style={[styles.inputWrapper, activeField === 'ratio' && styles.inputActiveWrapper]}>
              <Text style={styles.label}>Ratio</Text>
              <View style={styles.row}>
                <Text style={styles.prefix}>1 :</Text>
                <TextInput
                  ref={ratioInputRef}
                  value={ratio}
                  onChangeText={(val) => setRatio(sanitizeNumericText(val))}
                  onFocus={() => setActiveField('ratio')}
                  onBlur={() => setActiveField(null)}
                  placeholder="16"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="decimal-pad"
                  style={styles.inlineInput}
                />
              </View>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: 36, paddingTop: 72 },

  // Hero Result
  resultContainer: { marginBottom: 64, alignItems: 'center' },
  resultValue: { fontSize: 96, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -3 },
  unit: { fontSize: 32, fontWeight: '400', color: COLORS.textSecondary, lineHeight: 36 },
  resultLabel: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary, marginTop: 6, letterSpacing: 1 },

  // Form
  form: { gap: 28 },
  inputWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  inputActiveWrapper: { borderColor: COLORS.accent, borderWidth: 1.5 },

  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, letterSpacing: 0.5 },

  row: { flexDirection: 'row', alignItems: 'center' },
  prefix: { fontSize: 18, fontWeight: '600', color: COLORS.textSecondary, marginRight: 8 },
  inlineInput: { flex: 1, fontSize: 18, fontWeight: '500', color: COLORS.textPrimary },

  input: { fontSize: 18, fontWeight: '500', color: COLORS.textPrimary, height: 40 },
});