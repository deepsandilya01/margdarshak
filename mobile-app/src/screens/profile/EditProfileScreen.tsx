import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Save, User, Mail, Building2, Phone } from 'lucide-react-native';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('Acme Electronics Ltd.');
  const [person, setPerson] = useState('Ravi Kumar');
  const [email, setEmail] = useState('ravi@acme.com');
  const [phone, setPhone] = useState('+91 9876543210');

  const handleSave = () => {
    // In a real app, this would hit an API endpoint to save user data
    if (Platform.OS === 'web') {
      window.alert('Profile updated successfully!');
      navigation.goBack();
    } else {
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center shadow-sm z-10 sticky top-0">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full mr-2">
          <ChevronLeft size={24} color="#5f6368" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary mb-3">
            <Building2 size={40} color="#1a73e8" />
          </View>
          <Text className="text-[14px] text-primary font-bold">Change Logo</Text>
        </View>

        <View className="mb-5">
          <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Company Name</Text>
          <View className="flex-row items-center bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:border-primary">
            <Building2 size={18} color="#5f6368" />
            <TextInput
              className="flex-1 ml-3 text-[16px] text-on-surface"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Contact Person</Text>
          <View className="flex-row items-center bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:border-primary">
            <User size={18} color="#5f6368" />
            <TextInput
              className="flex-1 ml-3 text-[16px] text-on-surface"
              value={person}
              onChangeText={setPerson}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Email Address</Text>
          <View className="flex-row items-center bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:border-primary">
            <Mail size={18} color="#5f6368" />
            <TextInput
              className="flex-1 ml-3 text-[16px] text-on-surface"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Phone Number</Text>
          <View className="flex-row items-center bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:border-primary">
            <Phone size={18} color="#5f6368" />
            <TextInput
              className="flex-1 ml-3 text-[16px] text-on-surface"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <Pressable onPress={handleSave} className="flex-row items-center justify-center gap-2 p-4 bg-primary rounded-xl mt-2">
          <Save size={20} color="#ffffff" />
          <Text className="text-white font-bold text-[16px]">Save Changes</Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
