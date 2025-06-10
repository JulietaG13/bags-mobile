import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants';

export type TabType = 'transfer' | 'home' | 'debin';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const insets = useSafeAreaInsets();
  const getIconName = (tabId: TabType): keyof typeof MaterialIcons.glyphMap => {
    switch (tabId) {
      case 'transfer':
        return 'north-east';
      case 'home':
        return 'home';
      case 'debin':
        return 'south-west';
      default:
        return 'home';
    }
  };

  const tabs = [
    {
      id: 'transfer' as TabType,
      label: 'Send',
    },
    {
      id: 'home' as TabType,
      label: 'Home',
    },
    {
      id: 'debin' as TabType,
      label: 'Request',
    },
  ];

  const renderTab = (tab: typeof tabs[0]) => {
    const isActive = activeTab === tab.id;
    
    return (
      <TouchableOpacity
        key={tab.id}
        style={[
          localStyles.tab,
          isActive && localStyles.activeTab,
        ]}
        onPress={() => onTabChange(tab.id)}
        activeOpacity={0.6}
        testID={`tab-${tab.id}`}
      >
        <View style={localStyles.iconContainer}>
          <MaterialIcons
            name={getIconName(tab.id)}
            size={22}
            color={isActive ? theme.colors.text.primary : theme.colors.text.tertiary}
          />
        </View>
        
        <Text style={[
          localStyles.label,
          isActive && localStyles.activeLabel,
        ]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View 
      style={[
        localStyles.absoluteContainer, 
        { paddingBottom: insets.bottom }
      ]} 
      testID="bottom-navigation"
    >
      <View style={localStyles.container}>
        <View style={localStyles.navBar}>
          {tabs.map(renderTab)}
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 20,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 16,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  activeTab: {
    // Handled by container styles
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
});

export default BottomNavigation; 