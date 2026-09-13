import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  DiscoveryStack: NavigatorScreenParams<DiscoveryStackParamList>;
  QCOStack: NavigatorScreenParams<any>;
  LabStack: NavigatorScreenParams<any>;
  SupportStack: NavigatorScreenParams<any>;
  AuthStack: NavigatorScreenParams<any>;
  ComparisonStack: NavigatorScreenParams<any>;
  ComplianceStack: NavigatorScreenParams<any>;
  ReportsStack: NavigatorScreenParams<any>;
  SavedStack: NavigatorScreenParams<any>;
  HistoryStack: NavigatorScreenParams<any>;
  Menu: undefined;
  Certification: undefined;
  Hallmarking: undefined;
  HelpCenter: undefined;
  Notifications: undefined;
  StandardDetail: { id: string };
};

export type MainTabParamList = {
  Home: undefined;
  Standards: undefined;
  AISathi: undefined;
  Explore: undefined;
  Profile: undefined;
};

export type DiscoveryStackParamList = {
  ProductDiscovery: undefined;
  ProductResults: { answers: Record<string, unknown> };
};
