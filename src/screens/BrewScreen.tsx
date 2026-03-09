import React, { useMemo, useContext } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { calculateCoffee } from '../lib/brewEngine';
import { CoffeeContext } from '../context/CoffeeContext';

const COLORS = { 
  textPrimary: '#FAFAFA', 
  textSecondary: '#888888', 
  accent: '#A65B3C', 
  surface: '#1A1A1A' 
};

export default function BrewScreen() {
  // Pulling the data from the central Brain (Context) instead of props
  const { liters, setLiters, ratio, setRatio, sanitize } = useContext(CoffeeContext);

  const coffeeGrams = useMemo(() => {
    if (!liters || !ratio) return '—';
    const result = calculateCoffee(parseFloat(liters), parseFloat(ratio));
    return isFinite(result) && result > 0 ? Math.round(result).toString() : '—';
  }, [liters, ratio]);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent} 
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero Result Section */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultValue}>
          {coffeeGrams}{coffeeGrams !== '—' && <Text style={styles.unit}>g</Text>}
        </Text>
        <Text style={styles.resultLabel}>Coffee Required</Text>
      </View>

      {/* Input Form Section */}
      <View style={styles.form}>
        {/* Water Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Water (Liters)</Text>
          <TextInput 
            value={liters} 
            onChangeText={(val) => setLiters(sanitize(val))} 
            keyboardType="decimal-pad" 
            style={styles.input} 
            placeholder="0.5"
            placeholderTextColor="#444"
          />
        </View>

        {/* Ratio Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Ratio</Text>
          <View style={styles.row}> 
            <Text style={styles.prefix}>1:</Text>
            <TextInput 
              value={ratio} 
              onChangeText={(val) => setRatio(sanitize(val))} 
              keyboardType="decimal-pad" 
              style={styles.inlineInput} 
              placeholder="16"
              placeholderTextColor="#444"
            />
          </View> 
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { paddingHorizontal: 36, paddingTop: 60, paddingBottom: 140 },
  resultContainer: { marginBottom: 40, alignItems: 'flex-start' },
  resultValue: { fontSize: 96, fontWeight: '900', color: COLORS.accent, letterSpacing: -3 },
  unit: { fontSize: 32, color: COLORS.textSecondary },
  resultLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginTop: 6, letterSpacing: 1 },
  form: { gap: 28 },
  inputWrapper: { 
    backgroundColor: COLORS.surface, 
    borderRadius: 16, 
    borderWidth: 1.5, 
    borderColor: COLORS.accent, 
    padding: 20 
  },
  label: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', height: 40 },
  prefix: { fontSize: 18, color: COLORS.textSecondary, marginRight: 6 },
  inlineInput: { flex: 1, fontSize: 18, color: COLORS.textPrimary, includeFontPadding: false },
  input: { fontSize: 18, color: COLORS.textPrimary, height: 40, includeFontPadding: false }
});