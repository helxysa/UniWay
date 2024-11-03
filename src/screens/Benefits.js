import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const benefitsList = [
  {
    id: 1,
    title: 'Samsung para estudantes',
    description: 'Faça seu cadastro na Samsung Estudantes e tenha acesso a diversas ofertas.',
    image: require('../../assets/images/graduate.png'),
    backgroundColor: '#E8E9FF'
  },
  {
    id: 2,
    title: 'LinkedIn Premium',
    description: 'O LinkedIn oferece uma opção de assinatura premium para estudantes.',
    image: require('../../assets/images/graduate.png'),
    backgroundColor: '#FFE8EC'
  },
  {
    id: 3,
    title: 'Apple para estudantes',
    description: 'Economize com preços especiais para estudantes.',
    image: require('../../assets/images/graduate.png'),
    backgroundColor: '#FFE8E0'
  }
];

const TopicItem = ({ title, color, icon, onPress }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.topicItem, { backgroundColor: color }]}
  >
    <Icon name={icon} size={24} color="#fff" />
    <Text style={styles.topicText}>{title}</Text>
  </TouchableOpacity>
);

const BenefitCard = ({ benefit }) => (
  <View style={[styles.card, { backgroundColor: benefit.backgroundColor }]}>
    <View style={styles.cardContent}>
      <View style={styles.logoContainer}>
        <Image source={benefit.image} style={styles.logo} />
      </View>
      <Text style={styles.cardTitle}>{benefit.title}</Text>
      <Text style={styles.cardDescription}>{benefit.description}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>ACESSE AQUI</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Benefits = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Tópicos</Text>
        <View style={styles.topicsContainer}>
          <TopicItem 
            title="Vagas" 
            color="#FF9966" 
            icon="briefcase-outline" 
            onPress={() => navigation.navigate('Home')}
          />
          <TopicItem 
            title="Benefícios" 
            color="#6666FF" 
            icon="gift-outline" 
            onPress={() => navigation.navigate('Benefits')}
          />
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Vagas</Text>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filtrar por curso</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Ciência da Computação</Text>
              <Icon name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.header}>Benefícios</Text>
        <View style={styles.benefitsContainer}>
          {benefitsList.map(benefit => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000'
  },
  topicsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  topicItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8
  },
  topicText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600'
  },
  filterSection: {
    marginBottom: 24
  },
  filterContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12
  },
  filterLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filterText: {
    fontSize: 16,
    color: '#000000'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000'
  },
  benefitsContainer: {
    flex: 1
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    minHeight: 150
  },
  cardContent: {
    flex: 1
  },
  logoContainer: {
    width: 40,
    height: 40,
    marginBottom: 12
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20
  },
  button: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    marginTop: 8
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'left'
  }
});

export default Benefits;