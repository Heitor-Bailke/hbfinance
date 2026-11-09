import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import styles from './styles';

const BotaoPrincipal = ({ title, onPress, loading = false, secondary = false }) => (
  <Pressable disabled={loading} onPress={onPress} style={[styles.button, secondary && styles.secondary]}>
    {loading ? <ActivityIndicator color={secondary ? '#101D35' : '#FFFFFF'} /> : <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>}
  </Pressable>
);

export default BotaoPrincipal;
