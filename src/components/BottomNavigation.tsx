import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
            color={activeTab === tab.id ? '#007AFF' : '#8E8E93'}
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === tab.id ? '#007AFF' : '#8E8E93' }
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
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomNavigation; 