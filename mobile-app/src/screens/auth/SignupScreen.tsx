import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, Mail, Lock, Building2, ChevronLeft } from 'lucide-react-native';
import { signUp } from '../../features/auth/services/authService';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, name, company);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (e: any) {
      setError(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="px-4 py-4 mt-8">
          <Pressable 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.replace('MainTabs');
              }
            }} 
            className="w-10 h-10 items-center justify-center rounded-full bg-surface-container"
          >
            <ChevronLeft size={24} color="#5f6368" />
          </Pressable>
        </View>

        <View className="flex-1 justify-center px-6 pb-12">
          <Text className="text-[32px] font-bold text-primary mb-2">Create Account</Text>
          <Text className="text-[14px] text-on-surface-variant mb-6">Join the national compliance framework.</Text>

          {error ? (
            <View className="bg-[#ffdad6] p-3 rounded-lg mb-4">
              <Text className="text-[#ba1a1a] text-[13px]">{error}</Text>
            </View>
          ) : null}

          <View className="mb-4">
            <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Full Name</Text>
            <View className="flex-row items-center bg-surface border border-outline-variant rounded-xl px-4 py-3">
              <User size={18} color="#5f6368" />
              <TextInput
                className="flex-1 ml-3 text-[16px] text-on-surface"
                placeholder="Ravi Kumar"
                placeholderTextColor="#7d7672"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Email Address</Text>
            <View className="flex-row items-center bg-surface border border-outline-variant rounded-xl px-4 py-3">
              <Mail size={18} color="#5f6368" />
              <TextInput
                className="flex-1 ml-3 text-[16px] text-on-surface"
                placeholder="ravi@company.com"
                placeholderTextColor="#7d7672"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Company Name</Text>
            <View className="flex-row items-center bg-surface border border-outline-variant rounded-xl px-4 py-3">
              <Building2 size={18} color="#5f6368" />
              <TextInput
                className="flex-1 ml-3 text-[16px] text-on-surface"
                placeholder="Company Ltd."
                placeholderTextColor="#7d7672"
                value={company}
                onChangeText={setCompany}
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Password</Text>
            <View className="flex-row items-center bg-surface border border-outline-variant rounded-xl px-4 py-3">
              <Lock size={18} color="#5f6368" />
              <TextInput
                className="flex-1 ml-3 text-[16px] text-on-surface"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                placeholderTextColor="#7d7672"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <Pressable 
            onPress={handleSignup} 
            disabled={loading}
            className={`w-full py-4 rounded-xl items-center shadow-sm ${loading ? 'bg-primary/70' : 'bg-primary'}`}
          >
            <Text className="text-white font-bold text-[16px]">{loading ? 'Signing Up...' : 'Sign Up'}</Text>
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="text-[14px] text-on-surface-variant">Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text className="text-[14px] font-bold text-primary">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
