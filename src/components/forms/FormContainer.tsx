import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../constants';

interface FormContainerProps {
  children: React.ReactNode;
  style?: any;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[localStyles.container, style]}>
      {children}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: theme.layout.component.radiusXLarge,
    borderTopRightRadius: theme.layout.component.radiusXLarge,
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingVertical: theme.spacing['3xl'],
    marginTop: theme.spacing.xl,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    gap: theme.spacing.lg,
  },
});

export default FormContainer;

 