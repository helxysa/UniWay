import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function InitialMenu() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerLine} />
      <View style={styles.content}>
        <Image
          source={require('../assets/computer 1.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>Dê o primeiro passo rumo ao seu futuro profissional</Text>
        
        <TouchableOpacity style={styles.registerButton}
         onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>Cadastre-se</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton}
         onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          Ao criar sua conta, você concorda com nossos{' '}
          <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
          <Text style={styles.termsLink}>Política de Privacidade</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: height * 0.05,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: height * 0.03,
    color: '#6B7280',
  },
  registerButton: {
    backgroundColor: '#4F46E5', // Mesma cor do SlideBar
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 8,
    marginBottom: height * 0.02,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F46E5',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 16,
  },
  termsText: {
    marginTop: height * 0.03,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
  },
  termsLink: {
    color: '#4F46E5',
    textDecorationLine: 'underline',
  },
});