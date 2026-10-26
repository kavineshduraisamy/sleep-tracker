import React, { useContext } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import StreakScreen from '../screens/StreakScreen';
import StatsScreen from '../screens/StatsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LogSleepScreen from '../screens/LogSleepScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabBarIcon = ({ routeName, focused, colors, isDark }) => {
  let iconName;
  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Calendar':
      iconName = focused ? 'calendar' : 'calendar-outline';
      break;
    case 'Streak':
      iconName = focused ? 'flame' : 'flame-outline';
      break;
    case 'History':
      iconName = focused ? 'time' : 'time-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = focused ? 'ellipse' : 'ellipse-outline';
  }

  const activeBg = isDark ? 'rgba(129, 140, 248, 0.22)' : 'rgba(99, 102, 241, 0.12)';
  const activeColor = colors.primary;
  const inactiveColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <View 
      style={[
        styles.tabIconWrapper, 
        focused && { backgroundColor: activeBg }
      ]}
    >
      <Ionicons 
        name={iconName} 
        size={23} 
        color={focused ? activeColor : inactiveColor} 
      />
    </View>
  );
};

const HeaderBrand = ({ colors }) => (
  <View style={styles.headerBrand}>
    <Ionicons name="moon" size={20} color={colors.primary} />
    <Text style={[styles.headerBrandText, { color: colors.text }]}>Khythms</Text>
  </View>
);

const HeaderProfileBtn = ({ onPress, colors }) => (
  <TouchableOpacity 
    style={[styles.headerBtn, { backgroundColor: colors.surfaceSubtle }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Ionicons name="person-outline" size={20} color={colors.text} />
  </TouchableOpacity>
);

const MainTabs = () => {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabBarIcon 
            routeName={route.name} 
            focused={focused} 
            colors={colors} 
            isDark={isDark} 
          />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          elevation: 12,
          shadowColor: colors.night,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
          color: colors.text,
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => ({
          title: 'Overview',
          headerLeft: () => <HeaderBrand colors={colors} />,
          headerRight: () => (
            <HeaderProfileBtn onPress={() => navigation.navigate('Profile')} colors={colors} />
          ),
        })} 
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{ title: 'Calendar' }}
      />
      <Tab.Screen 
        name="Streak" 
        component={StreakScreen} 
        options={{ title: 'Streak' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={({ navigation }) => ({
          title: 'History',
          headerRight: () => (
            <TouchableOpacity 
              style={[styles.headerBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => navigation.navigate('LogSleep')}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={22} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { hasOnboarded, loading } = useContext(SleepContext);
  const { colors, isDark } = useTheme();

  if (loading) {
    return null;
  }

  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.borderLight,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!hasOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="LogSleep" 
              component={LogSleepScreen} 
              options={{
                headerShown: true,
                title: 'Log Sleep',
                headerStyle: { 
                  backgroundColor: colors.surface,
                  borderBottomColor: colors.borderLight,
                  borderBottomWidth: 1,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                headerTitleStyle: { 
                  color: colors.text,
                  fontWeight: '800',
                  fontSize: 18,
                },
                headerTintColor: colors.primary,
              }} 
            />
            <Stack.Screen 
              name="Settings" 
              component={ProfileScreen} 
              options={{
                headerShown: true,
                title: 'Profile & Settings',
                headerStyle: { 
                  backgroundColor: colors.surface,
                  borderBottomColor: colors.borderLight,
                  borderBottomWidth: 1,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                headerTitleStyle: { 
                  color: colors.text,
                  fontWeight: '800',
                  fontSize: 18,
                },
                headerTintColor: colors.primary,
              }} 
            />
            <Stack.Screen 
              name="History" 
              component={HistoryScreen} 
              options={{
                headerShown: true,
                title: 'Sleep History',
                headerStyle: { 
                  backgroundColor: colors.surface,
                  borderBottomColor: colors.borderLight,
                  borderBottomWidth: 1,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                headerTitleStyle: { 
                  color: colors.text,
                  fontWeight: '800',
                  fontSize: 18,
                },
                headerTintColor: colors.primary,
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconWrapper: {
    width: 46,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerBrandText: {
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  }
});

export default AppNavigator;
