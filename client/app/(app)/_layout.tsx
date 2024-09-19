import React from 'react'
import { Stack } from 'expo-router'

const AppLayout = () => {

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='home' options={{ headerShown: false }}></Stack.Screen>
      </Stack>
    </>
  )
}

export default AppLayout