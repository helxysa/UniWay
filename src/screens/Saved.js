import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert 
} from 'react-native';
import axios from 'axios';
import { authStorage } from '../authStorage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import eventEmitter from './EventEmitter';

const SavedCard = ({ item, onPress, onUnsave }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUnsave = async () => {
    try {
      setIsRemoving(true);
      await onUnsave(item.id);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          <TouchableOpacity 
            style={styles.unsaveButton} 
            onPress={handleUnsave}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <ActivityIndicator size="small" color="#FF0000" />
            ) : (
              <Icon name="bookmark-remove" size={24} color="#FF0000" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.cardCompany}>{item.empresa}</Text>
        <Text style={styles.cardDescription}>{item.descricao}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardSalary}>R$ {item.salario}</Text>
          <Text style={styles.cardLocation}>{item.localizacao}</Text>
        </View>
        <Text style={styles.cardType}>{item.tipo_contrato}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Saved = () => {
  const navigation = useNavigation();
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedJobs = async () => {
    try {
      const user = await authStorage.getUser();
      
      if (!user || !user.id) {
        throw new Error('Usuário não autenticado');
      }

      const response = await axios.get(`https://api-uniway-firebase.vercel.app/api/users/${user.id}/saved`);
      
      if (response.data.success) {
        setSavedJobs(response.data.vagas);
      } else {
        throw new Error(response.data.error || 'Erro ao carregar vagas salvas');
      }
    } catch (error) {
      setError(error.message);
      Alert.alert('Erro', 'Não foi possível carregar as vagas salvas');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleUnsave = async (vagaId) => {
    try {
      const user = await authStorage.getUser();
      
      if (!user || !user.id) {
        throw new Error('Usuário não autenticado');
      }

      setSavedJobs(prevJobs => prevJobs.filter(job => job.id !== vagaId));

      const response = await axios.delete(`https://api-uniway-firebase.vercel.app/api/users/${user.id}/saved/${vagaId}`);
      
      if (response.data.success) {
        eventEmitter.emit('SAVED_JOBS_UPDATED', vagaId);
      } else {
        setSavedJobs(prevJobs => [...prevJobs]);
        throw new Error(response.data.error || 'Erro ao remover vaga dos salvos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a vaga dos salvos');
      console.error(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSavedJobs();
  };

  const handleJobPress = (job) => {
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6B4EAA" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Ocorreu um erro ao carregar as vagas</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSavedJobs}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vagas Salvas</Text>
      <FlatList
        data={savedJobs}
        renderItem={({ item }) => (
          <SavedCard 
            item={item} 
            onPress={handleJobPress}
            onUnsave={handleUnsave}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma vaga salva</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  unsaveButton: {
    padding: 4,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCompany: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardSalary: {
    fontSize: 14,
    color: '#6B4EAA',
    fontWeight: 'bold',
  },
  cardLocation: {
    fontSize: 14,
    color: '#666666',
  },
  cardType: {
    fontSize: 12,
    color: '#999999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6B4EAA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Saved;