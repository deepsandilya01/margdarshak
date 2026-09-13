import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BookOpen, Sparkles, Search, User } from 'lucide-react-native';

import GlobalHeader from '../components/layout/GlobalHeader';
import HomeScreen from '../screens/home/HomeScreen';
import StandardsExplorerScreen from '../screens/standards/StandardsExplorerScreen';
import AISathiScreen from '../screens/ai-sathi/AISathiScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

import MenuScreen from '../screens/menu/MenuScreen';
import ReportsListScreen from '../screens/reports/ReportsListScreen';
import ReportPreviewScreen from '../screens/reports/ReportPreviewScreen';
import SavedScreen from '../screens/saved/SavedScreen';

import ProductDiscoveryScreen from '../screens/products/ProductDiscoveryScreen';
import ProductResultsScreen from '../screens/products/ProductResultsScreen';
import QCOExplorerScreen from '../screens/qco/QCOExplorerScreen';
import QCODetailScreen from '../screens/qco/QCODetailScreen';
import LabFinderScreen from '../screens/laboratories/LabFinderScreen';
import LabDetailScreen from '../screens/laboratories/LabDetailScreen';
import ResourcesScreen from '../screens/resources/ResourcesScreen';
import ResourceDetailScreen from '../screens/resources/ResourceDetailScreen';
import AboutScreen from '../screens/about/AboutScreen';
import StandardDetailScreen from '../screens/standards/StandardDetailScreen';
import CertificationScreen from '../screens/certification/CertificationScreen';
import HallmarkingScreen from '../screens/hallmarking/HallmarkingScreen';
import HelpCenterScreen from '../screens/consumer/HelpCenterScreen';
import ResearchHistoryScreen from '../screens/research/ResearchHistoryScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ComparisonScreen from '../screens/comparison/ComparisonScreen';
import ComplianceWorkspaceScreen from '../screens/compliance/ComplianceWorkspaceScreen';
import ComplianceJourneyDetailScreen from '../screens/compliance/ComplianceJourneyDetailScreen';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Secondary Stacks
const DiscoveryStack = createNativeStackNavigator();
function DiscoveryNavigator() {
  return (
    <DiscoveryStack.Navigator screenOptions={{ headerShown: false }}>
      <DiscoveryStack.Screen name="ProductDiscovery" component={ProductDiscoveryScreen} />
      <DiscoveryStack.Screen name="ProductResults" component={ProductResultsScreen} />
    </DiscoveryStack.Navigator>
  );
}

const QCOStackScreen = createNativeStackNavigator();
function QCONavigator() {
  return (
    <QCOStackScreen.Navigator screenOptions={{ headerShown: false }}>
      <QCOStackScreen.Screen name="QCOExplorer" component={QCOExplorerScreen} />
      <QCOStackScreen.Screen name="QCODetail" component={QCODetailScreen} />
    </QCOStackScreen.Navigator>
  );
}

const LabStackScreen = createNativeStackNavigator();
function LabNavigator() {
  return (
    <LabStackScreen.Navigator screenOptions={{ headerShown: false }}>
      <LabStackScreen.Screen name="LabFinder" component={LabFinderScreen} />
      <LabStackScreen.Screen name="LabDetail" component={LabDetailScreen} />
    </LabStackScreen.Navigator>
  );
}

const SupportStackScreen = createNativeStackNavigator();
function SupportNavigator() {
  return (
    <SupportStackScreen.Navigator screenOptions={{ headerShown: false }}>
      <SupportStackScreen.Screen name="Resources" component={ResourcesScreen} />
      <SupportStackScreen.Screen name="ResourceDetail" component={ResourceDetailScreen} />
      <SupportStackScreen.Screen name="About" component={AboutScreen} />
    </SupportStackScreen.Navigator>
  );
}

const ComparisonStack = createNativeStackNavigator();
function ComparisonNavigator() {
  return (
    <ComparisonStack.Navigator screenOptions={{ headerShown: false }}>
      <ComparisonStack.Screen name="ComparisonWorkspace" component={ComparisonScreen} />
    </ComparisonStack.Navigator>
  );
}

const ComplianceStack = createNativeStackNavigator();
function ComplianceNavigator() {
  return (
    <ComplianceStack.Navigator screenOptions={{ headerShown: false }}>
      <ComplianceStack.Screen name="ComplianceWorkspace" component={ComplianceWorkspaceScreen} />
      <ComplianceStack.Screen name="ComplianceJourneyDetail" component={ComplianceJourneyDetailScreen} />
    </ComplianceStack.Navigator>
  );
}

const ReportStack = createNativeStackNavigator();
function ReportNavigator() {
  return (
    <ReportStack.Navigator screenOptions={{ headerShown: false }}>
      <ReportStack.Screen name="ReportsList" component={ReportsListScreen} />
      <ReportStack.Screen name="ReportPreview" component={ReportPreviewScreen} />
    </ReportStack.Navigator>
  );
}

// Main Tab Navigator with all standard pages included to preserve the bottom bar
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e65c00',
        tabBarInactiveTintColor: '#4a4643',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#cfcac5',
          height: 68,
          minHeight: 68,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        }
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tab.Screen name="Standards" component={StandardsExplorerScreen} options={{ tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} /> }} />
      <Tab.Screen name="AISathi" component={AISathiScreen} options={{ tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} /> }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ tabBarIcon: ({ color, size }) => <Search color={color} size={size} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />

      {/* Hidden from Tab Bar but preserving Bottom Nav */}
      <Tab.Screen name="DiscoveryStack" component={DiscoveryNavigator} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="QCOStack" component={QCONavigator} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="LabStack" component={LabNavigator} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="SupportStack" component={SupportNavigator} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="ComparisonStack" component={ComparisonNavigator} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="ComplianceStack" component={ComplianceNavigator} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="ReportsStack" component={ReportNavigator} options={{ tabBarItemStyle: { display: 'none' } }} />
      
      <Tab.Screen name="StandardDetail" component={StandardDetailScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="Certification" component={CertificationScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="Hallmarking" component={HallmarkingScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="HelpCenter" component={HelpCenterScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="SavedStack" component={SavedScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="HistoryStack" component={ResearchHistoryScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="EditProfile" component={EditProfileScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
    </Tab.Navigator>
  );
}

// Root Navigator
const AuthStack = createNativeStackNavigator();
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: true, header: () => <GlobalHeader /> }} />
      <Stack.Screen name="AuthStack" component={AuthNavigator} />
    </Stack.Navigator>
  );
}
