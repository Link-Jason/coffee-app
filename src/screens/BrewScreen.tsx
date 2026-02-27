import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { calculateCoffee } from '../lib/brewEngine';

type Field = 'liters' | 'ratio';

const COLORS = {
  bg: '#FFFFFF',
  text: '#111111',
  muted: '#888888',
  accent: '#2563EB',
  border: '#E5E5E5',
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
  
  // Ref to programmatically focus the Ratio input
  const ratioInputRef = useRef<TextInput>(null);

  const coffeeGrams = useMemo(() => {
    // Return empty state if values are missing
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

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Ratio</Text>
            {/* Wrapped in Pressable to make the whole row interactive */}
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

        {/* Hero Result Section - Anchored to form with margin */}
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
  subtitle: { fontSize: 17, color: COLORS.muted, marginTop: 4, marginBottom: 28 },
  
  form: { gap: 24 },
  fieldWrapper: { gap: 8 },
  
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  prefix: { fontSize: 18, fontWeight: '600', color: COLORS.muted, marginRight: 8 },
  inlineInput: { flex: 1, fontSize: 18, fontWeight: '500', color: COLORS.text },
  
  inputActive: { borderColor: COLORS.accent },
  
  resultContainer: { marginTop: 40, alignItems: 'center' },
  resultLabel: { fontSize: 14, fontWeight: '500', color: COLORS.muted },
  resultValue: { fontSize: 72, fontWeight: '800', color: COLORS.text, letterSpacing: -2, marginTop: 4 },
});