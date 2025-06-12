import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants';

export type TabType = 'send' | 'home' | 'debin';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'send' as TabType, label: 'Send', icon: 'send' as keyof typeof MaterialIcons.glyphMap },
    { id: 'home' as TabType, label: 'Home', icon: 'home' as keyof typeof MaterialIcons.glyphMap },
    { id: 'debin' as TabType, label: 'Deb-in', icon: 'account-balance-wallet' as keyof typeof MaterialIcons.glyphMap },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabPress(tab.id)}
        >
          <MaterialIcons
            name={tab.icon}
            size={24}
            color={activeTab === tab.id ? theme.colors.text.primary : theme.colors.text.tertiary}
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === tab.id ? theme.colors.text.primary : theme.colors.text.tertiary }
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary, // Pure white
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light, // Light gray border
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
});

export default BottomNavigation; 