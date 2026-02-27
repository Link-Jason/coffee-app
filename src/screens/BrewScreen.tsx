import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { calculateCoffee } from '../lib/brewEngine';

type Field = 'liters' | 'ratio';

// The "Premium Minimalist" Palette
const COLORS = {
  bg: '#F6F4EF',          // Soft, organic warm neutral
  text: '#1C1C1C',        // Deep, rich espresso
  muted: '#8A857C',       // Sophisticated taupe
  accent: '#2D4A3E',      // Deep, grounded forest green
  card: '#FFFFFF',        // Pure white 'paper'
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

  const keyboardType = Platform.OS === 'ios' ? 'decimal-pad' : 'numeric';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Brew</Text>
        <Text style={styles.subtitle}>Dial in your parameters.</Text>

        <View style={styles.form}>
          {/* Water Input */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Water (Liters)</Text>
            <TextInput
              value={liters}
              onChangeText={(val) => setLiters(sanitizeNumericText(val))}
              onFocus={() => setActiveField('liters')}
              onBlur={() => setActiveField(null)}
              placeholder="1.5"
              placeholderTextColor={COLORS.muted}
              keyboardType={keyboardType}
              style={[styles.input, activeField === 'liters' && styles.inputActive]}
            />
          </View>

          {/* Ratio Input */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Ratio</Text>
            <Pressable 
              onPress={() => ratioInputRef.current?.focus()} 
              style={[styles.row, activeField === 'ratio' && styles.inputActive]}
            >
              <Text style={styles.prefix}>1 :</Text>
              <TextInput
                ref={ratioInputRef}
                value={ratio}
                onChangeText={(val) => setRatio(sanitizeNumericText(val))}
                onFocus={() => setActiveField('ratio')}
                onBlur={() => setActiveField(null)}
                placeholder="16"
                placeholderTextColor={COLORS.muted}
                keyboardType={keyboardType}
                style={styles.inlineInput}
              />
            </Pressable>
          </View>
        </View>

        {/* Hero Result Section */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Coffee Required</Text>
          <Text style={styles.resultValue}>{coffeeGrams === '—' ? '—' : `${coffeeGrams}g`}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: COLORS.muted, marginTop: 4, marginBottom: 32 },
  
  form: { gap: 24 },
  fieldWrapper: { gap: 8 },
  
  label: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  
  // Input uses depth (shadow) instead of borders for 'Premium Minimalist' feel
  input: {
    height: 52,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, // Very subtle, elegant lift
    shadowRadius: 10,
    elevation: 2, 
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  prefix: { fontSize: 18, fontWeight: '600', color: COLORS.muted, marginRight: 8 },
  inlineInput: { flex: 1, fontSize: 18, fontWeight: '500', color: COLORS.text },
  
  // Subtle accent focus effect
  inputActive: { borderColor: COLORS.accent, borderWidth: 1 }, 
  
  // Hero Result Section
  resultContainer: { marginTop: 52, alignItems: 'center' },
  resultLabel: { fontSize: 13, fontWeight: '600', color: COLORS.muted, letterSpacing: 0.5 },
  resultValue: { fontSize: 80, fontWeight: '700', color: COLORS.text, letterSpacing: -3, marginTop: 4 },
});