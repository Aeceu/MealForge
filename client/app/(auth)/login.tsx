import { View, SafeAreaView, Image, ScrollView } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useThemeColors } from '../../constants/constants';
import StyledText from '@/components/StyledText';
import StyledTextInput from '@/components/StyledTextInput';
import StyledPressable from '@/components/StyledPressable';
import { router } from 'expo-router';

const Login = () => {
  const { gradientColor, logoImage } = useThemeColors();

  return (
    <>
      <LinearGradient
        start={{ x: 0.9, y: 0.1 }}
        colors={gradientColor}
        className="absolute top-0 left-0 w-full h-full"
      />
      <SafeAreaView className='relative w-full h-full'>
        {/* lower left */}
        <View className="absolute -bottom-[15%] -left-[30%] w-[300] h-[300] rounded-full bg-light-dark dark:bg-dark" />

        <ScrollView>
          <View className="items-center flex-1 w-full max-h-full min-h-screen p-10 pb-4">
            <View className="items-center w-full max-h-[100px]">
              <Image source={logoImage} className="w-full h-full " resizeMode="contain" />
            </View>

            <StyledText
              type="heading-1"
              fontStyle="ChunkP"
              className="pt-3 text-center"
            >
              Welcome Back
            </StyledText>

            <StyledText
              type="subheading"
              fontStyle="default"
              className="pt-1 text-center "
            >
              Login to your account.
            </StyledText>

            <View className='flex-1'>
              <View className='w-full pt-8'>
                <StyledTextInput
                  className='w-full'
                  title="Email"
                // handleTextChange={handleTextChange}
                />
              </View>

              <View className='w-full pt-4'>
                <StyledTextInput
                  className='w-full'
                  title="Password"
                // handleTextChange={handleTextChange}
                />
              </View>

              <StyledPressable
                size="text"
                className='w-full px-5 mt-4'
              // onPress={() => router.replace('/(auth)/register')}
              >
                <StyledText
                  selectable={false}
                  fontStyle="default"
                  type="link">
                  Forgot Password?
                </StyledText>
              </StyledPressable>
            </View>

            <View className='flex-row items-end mt-12 space-x-2'>
              <StyledText
                selectable={false}
                fontStyle="default"
                type="label">
                Don't have an Account?
              </StyledText>

              <StyledPressable
                size="text"
                onPress={() => router.replace('/(auth)/register')}>
                <StyledText
                  className=''
                  selectable={false}
                  fontStyle="default"
                  type="link">
                  Sign-Up
                </StyledText>
              </StyledPressable>
            </View>

            <StyledPressable
              size="xl"
              className="mt-4 bg-main"
            // onPress={() => router.push('/(app)home')}
            >
              <StyledText
                selectable={false}
                fontStyle="Chunk"
                type="button">
                Login
              </StyledText>
            </StyledPressable>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default Login