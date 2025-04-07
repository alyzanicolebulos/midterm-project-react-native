import React, { useState, useMemo } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Provider as PaperProvider, configureFonts, DefaultTheme, DarkTheme } from 'react-native-paper';
import AppNavigator from './components/navigation/AppNavigator';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(() => {
    const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: '#4A6FA5',  // Soft blue
        accent: '#6B8C42',   // Muted green
        background: isDarkMode ? '#121212' : '#F8F9FA',
        surface: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        text: isDarkMode ? '#E0E0E0' : '#333333',
        placeholder: isDarkMode ? '#AAAAAA' : '#888888',
      },
      roundness: 12,
    };
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator theme={theme} toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;