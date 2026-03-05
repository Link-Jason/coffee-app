import React, { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { calculateWater } from '../lib/brewEngine';

const COLORS = { textPrimary: '#FAFAFA', textSecondary: '#888888', accent: '#A65B3C', surface: '#1A1A1A' };

export default function YieldScreen({ grams, setGrams, ratio, setRatio, sanitize }: any) {
  
  const waterYield = useMemo(() => {
    if (!grams || !ratio) return '—';
    const res = calculateWater(parseFloat(grams), parseFloat(ratio));
    return isFinite(res) && res > 0 ? res.toFixed(2) : '—';
  }, [grams, ratio]);

  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        <Text style={styles.resultValue}>
          {waterYield}{waterYield !== '—' && <Text style={styles.unit}>L</Text>}
        </Text>
        <Text style={styles.resultLabel}>Total Water Needed</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Beans Remaining (Grams)</Text>
          <TextInput
            value={grams}
            onChangeText={(val) => setGrams(sanitize(val))}
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Ratio</Text>
          <View style={styles.row}>
            <Text style={styles.prefix}>1:</Text>
            <TextInput
              value={ratio}
              onChangeText={(val) => setRatio(sanitize(val))}
              keyboardType="decimal-pad"
              style={styles.inlineInput}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 36, paddingTop: 72 },
  resultContainer: { marginBottom: 72, alignItems: 'flex-start' },
  resultValue: { fontSize: 96, fontWeight: '900', color: COLORS.accent, letterSpacing: -3 },
  unit: { fontSize: 32, color: COLORS.textSecondary },
  resultLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginTop: 6, letterSpacing: 1 },
  form: { gap: 28 },
  inputWrapper: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.accent, padding: 20 },
  label: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', height: 40 },
  prefix: { fontSize: 18, color: COLORS.textSecondary, marginRight: 6 },
  inlineInput: { flex: 1, fontSize: 18, color: COLORS.textPrimary, includeFontPadding: false },
  input: { fontSize: 18, color: COLORS.textPrimary, height: 40, includeFontPadding: false }
});