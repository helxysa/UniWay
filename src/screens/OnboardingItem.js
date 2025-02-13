import { View, Text, useWindowDimensions, Image, StyleSheet, SafeAreaView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'

const {width, height} = Dimensions.get('window')

export default OnboardingItem = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={[styles.container, { width }]}>
      <Image source={item.image} style={[styles.image, {resizeMode: 'contain'}]}/>
      
      <View style={{ flex: 0.45 }}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
    width: 305,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    // fontWeight: '700',
    fontSize: 24,
    lineHeight: 30,
    color: '#2A2A2A', //#493d8a
    textAlign: 'center',
    margin: 10,
    padding: 8
  },
})
