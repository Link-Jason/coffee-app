import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { calculateCoffee, calculateRatio, calculateWater } from '../lib/brewEngine';

type Field = 'liters' | 'ratio' | 'grams';

const COLORS = {
  bg: '#F8F8F8',
  text: '#222222',
  muted: 'rgba(34, 34, 34, 0.55)',
  card: '#FFFFFF',
  accent: '#1ABC9C',
  border: 'rgba(34, 34, 34, 0.10)',
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

function toNumberOrNaN(text: string): number {
  if (!text.trim()) return NaN;
  const n = Number(text);
  return Number.isFinite(n) ? n : NaN;
}

function formatNumberForInput(n: number, maxDecimals: number): string {
  if (!Number.isFinite(n) || n <= 0) return '';
  const fixed = n.toFixed(maxDecimals);
  return fixed.replace(/\.0+$|(\.\d*[1-9])0+$/, '$1');
}

export default function BrewScreen() {
  const [litersText, setLitersText] = useState<string>('1.5');
  const [ratioText, setRatioText] = useState<string>('16');

  const initialGrams = useMemo(() => {
    const l = 1.5;
    const r = 16;
    return formatNumberForInput(calculateCoffee(l, r), 1);
  }, []);
  const [gramsText, setGramsText] = useState<string>(initialGrams);

  const lastTwoRef = useRef<Field[]>(['ratio', 'liters']);
  const touchField = useCallback((field: Field) => {
    const next = [field, ...lastTwoRef.current.filter((f) => f !== field)].slice(0, 2);
    lastTwoRef.current = next;
  }, []);

  const recomputeDerived = useCallback(
    (nextLitersText: string, nextRatioText: string, nextGramsText: string) => {
      const a = lastTwoRef.current[0];
      const b = lastTwoRef.current[1];
      const sources = new Set<Field>([a, b]);
      const derived: Field = sources.has('liters')
        ? sources.has('ratio')
          ? 'grams'
          : 'ratio'
        : 'liters';

      const liters = toNumberOrNaN(nextLitersText);
      const ratio = toNumberOrNaN(nextRatioText);
      const grams = toNumberOrNaN(nextGramsText);

      if (derived === 'grams') {
        const g = calculateCoffee(liters, ratio);
        if (Number.isFinite(g) && g > 0) setGramsText(formatNumberForInput(g, 1));
      } else if (derived === 'liters') {
        const l = calculateWater(grams, ratio);
        if (Number.isFinite(l) && l > 0) setLitersText(formatNumberForInput(l, 3));
      } else {
        const r = calculateRatio(liters, grams);
        if (Number.isFinite(r) && r > 0) setRatioText(formatNumberForInput(r, 2));
      }
    },
    []
  );

  const onChangeLiters = useCallback(
    (raw: string) => {
      touchField('liters');
      const next = sanitizeNumericText(raw);
      setLitersText(next);
      recomputeDerived(next, ratioText, gramsText);
    },
    [gramsText, ratioText, recomputeDerived, touchField]
  );

  const onChangeRatio = useCallback(
    (raw: string) => {
      touchField('ratio');
      const next = sanitizeNumericText(raw);
      setRatioText(next);
      recomputeDerived(litersText, next, gramsText);
    },
    [gramsText, litersText, recomputeDerived, touchField]
  );

  const onChangeGrams = useCallback(
    (raw: string) => {
      touchField('grams');
      const next = sanitizeNumericText(raw);
      setGramsText(next);
      recomputeDerived(litersText, ratioText, next);
    },
    [litersText, ratioText, recomputeDerived, touchField]
  );

  const gramsNumber = useMemo(() => toNumberOrNaN(gramsText), [gramsText]);
  const gramsDisplay = useMemo(() => {
    if (!Number.isFinite(gramsNumber) || gramsNumber <= 0) return '—';
    const rounded = Math.round(gramsNumber);
    return String(rounded);
  }, [gramsNumber]);

  const keyboardType = useMemo(() => {
    return Platform.select({
      ios: 'decimal-pad' as const,
      android: 'decimal-pad' as const,
      default: 'numeric' as const,
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Brew Calculator</Text>
        <Text style={styles.subtitle}>Dial in water, ratio, and coffee.</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Liters</Text>
            <TextInput
              value={litersText}
              onChangeText={onChangeLiters}
              placeholder="e.g. 1.5"
              placeholderTextColor={COLORS.muted}
              keyboardType={keyboardType}
              inputMode="decimal"
              style={styles.input}
              selectionColor={COLORS.accent}
              returnKeyType="done"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Ratio</Text>
            <TextInput
              value={ratioText}
              onChangeText={onChangeRatio}
              placeholder="e.g. 16"
              placeholderTextColor={COLORS.muted}
              keyboardType={keyboardType}
              inputMode="decimal"
              style={styles.input}
              selectionColor={COLORS.accent}
              returnKeyType="done"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Coffee (g)</Text>
            <TextInput
              value={gramsText}
              onChangeText={onChangeGrams}
              placeholder="e.g. 94"
              placeholderTextColor={COLORS.muted}
              keyboardType={keyboardType}
              inputMode="decimal"
              style={styles.input}
              selectionColor={COLORS.accent}
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.resultWrap}>
          <Text style={styles.resultLabel}>Coffee grams</Text>
          <Text style={styles.resultValue}>{gramsDisplay}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    backgroundColor: COLORS.bg,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    marginTop: 18,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 188, 156, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(26, 188, 156, 0.22)',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  resultWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 6,
  },
  resultLabel: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  resultValue: {
    color: COLORS.accent,
    fontSize: 64,
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

