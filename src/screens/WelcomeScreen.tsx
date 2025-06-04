import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, createStyles, createScreenStyles } from '../constants';
import WelcomeHeader from '../components/WelcomeHeader';
import ActionButtons from '../components/ActionButtons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  const styles = createStyles(theme);
  const screenStyles = createScreenStyles(theme);

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={localStyles.safeArea}>
        <LinearGradient
          colors={[
            theme.colors.primary.main,
            theme.colors.primary.light,
            theme.colors.background.primary
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={localStyles.gradientBackground}
        >
          <ScrollView 
            style={localStyles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={localStyles.scrollContent}
            decelerationRate="fast"
          >
            {/* Hero Section */}
            <View style={localStyles.heroSection}>
              <WelcomeHeader />
            </View>

            {/* Action Buttons */}
            <View style={localStyles.actionsSection}>
              <ActionButtons 
                onGetStarted={onGetStarted}
                onSignIn={onSignIn}
                primaryText="Get Started"
                secondaryText="Already have an account?"
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: screenHeight,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: screenHeight * 0.5,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  featuresSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xl,
    borderTopLeftRadius: theme.layout.component.radiusXLarge,
    borderTopRightRadius: theme.layout.component.radiusXLarge,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  featuresGrid: {
    gap: theme.spacing.md,
  },
  actionsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingBottom: theme.spacing['xl'],
    paddingHorizontal: theme.spacing.md,
  },
});

export default WelcomeScreen; 