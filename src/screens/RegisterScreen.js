import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const courses = ['Ciência da Computação', 'Engenharia Elétrica', 'Relações Internacionais'];

  const handleRegister = async () => {
    console.log('Iniciando registro...');
    if (!name || !course || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const newUser = { name, email, course, password };
    console.log('Dados de registro:', JSON.stringify(newUser, null, 2));

    try {
      console.log('Fazendo requisição para:', 'https://api-uniway.onrender.com/users');
      const response = await axios.post('https://api-uniway.onrender.com/users', newUser);
      console.log('Resposta recebida:', response.data);

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      setName('');
      setEmail('');
      setCourse('');
      setPassword('');
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Erro detalhado:', error.response ? error.response.data : error.message);
      if (error.response) {
        Alert.alert('Erro', 'Falha ao cadastrar usuário. ' + (error.response.data.message || 'Tente novamente.'));
      } else if (error.request) {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o usuário. Tente novamente mais tarde.');
      }
    }
  };

  const renderPicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            Alert.alert(
              "Selecione um curso",
              "",
              courses.map(course => ({
                text: course,
                onPress: () => setCourse(course)
              }))
            );
          }}
        >
          <Text style={styles.pickerButtonText}>
            {course || "Selecione um curso"}
          </Text>
          <Icon name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={course}
            onValueChange={(itemValue) => setCourse(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um curso" value="" />
            {courses.map((c, index) => (
              <Picker.Item key={index} label={c} value={c} />
            ))}
          </Picker>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Crie uma conta</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ada Lovelace"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Curso</Text>
          {renderPicker()}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="ada@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#7C3AED',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});