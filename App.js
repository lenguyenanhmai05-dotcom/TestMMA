import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { BooksProvider } from './src/context/BooksContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BooksProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </BooksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
