import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, ChevronLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="px-4 py-4 mt-8">
          <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
            <ChevronLeft size={24} color="#5f6368" />
          </Pressable>
        </View>

        <View className="flex-1 justify-center px-6 pb-12">
          <Text className="text-[32px] font-bold text-primary mb-2">Reset Password</Text>
          <Text className="text-[14px] text-on-surface-variant mb-8">
            {submitted 
              ? "If an account exists, we've sent instructions to reset your password." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </Text>

          {!submitted ? (
            <>
              <View className="mb-8">
                <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Email Address</Text>
                <View className="flex-row items-center bg-surface border border-outline-variant rounded-xl px-4 py-3">
                  <Mail size={18} color="#5f6368" />
                  <TextInput
                    className="flex-1 ml-3 text-[16px] text-on-surface"
                    placeholder="you@company.com"
                    placeholderTextColor="#7d7672"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <Pressable 
                onPress={() => setSubmitted(true)} 
                className="w-full bg-primary py-4 rounded-xl items-center shadow-sm"
              >
                <Text className="text-white font-bold text-[16px]">Send Reset Link</Text>
              </Pressable>
            </>
          ) : (
            <Pressable 
              onPress={() => navigation.navigate('Login')} 
              className="w-full bg-surface-container-high py-4 rounded-xl items-center shadow-sm"
            >
              <Text className="text-on-surface font-bold text-[16px]">Back to Login</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
