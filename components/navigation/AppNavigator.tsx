import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import JobsScreen from '../screens/JobsScreen';
import SavedScreen from '../screens/SavedJobsScreen';

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
  theme: any;
  toggleTheme: () => void;
  isDarkMode: boolean; 
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ theme, toggleTheme, isDarkMode }) => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Available Jobs">
          {(props) => <JobsScreen {...props} theme={theme} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
        </Stack.Screen>
        <Stack.Screen name="Saved Jobs" component={SavedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;