// Powered by OnSpace.AI
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

export function Wallpaper() {
  return (
    <LinearGradient
      colors={[colors.wallpaper.top, colors.wallpaper.mid, colors.wallpaper.bottom]}
      locations={[0, 0.55, 1]}
      style={StyleSheet.absoluteFill}
    >
      {/* Soft light orbs to add depth */}
      <View style={[styles.orb, styles.orbA]} />
      <View style={[styles.orb, styles.orbB]} />
      <View style={[styles.orb, styles.orbC]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 500,
    opacity: 0.35,
  },
  orbA: {
    width: 320,
    height: 320,
    top: -80,
    right: -80,
    backgroundColor: '#FFD9B8',
  },
  orbB: {
    width: 240,
    height: 240,
    bottom: 120,
    left: -60,
    backgroundColor: '#8A5CFF',
    opacity: 0.28,
  },
  orbC: {
    width: 180,
    height: 180,
    top: '35%',
    left: '55%',
    backgroundColor: '#FF7BAC',
    opacity: 0.22,
  },
});
