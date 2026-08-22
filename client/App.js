import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { colors } from './src/theme/colors';
import Header from './src/components/Header';
import HomeScreen from './src/screens/HomeScreen';
import JobsScreen from './src/screens/JobsScreen';
import TalentScreen from './src/screens/TalentScreen';
import PostJobScreen from './src/screens/PostJobScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen setActiveTab={setActiveTab} />;
      case 'jobs':
        return <JobsScreen />;
      case 'talent':
        return <TalentScreen />;
      case 'post':
        return <PostJobScreen setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardScreen />;
      default:
        return <HomeScreen setActiveTab={setActiveTab} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <View style={styles.body}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
});
