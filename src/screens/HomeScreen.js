import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { authStorage } from "../authStorage"
import eventEmitter from './EventEmitter';

const TopicItem = ({ title, color, icon, onPress, isSelected }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.topicItem, { backgroundColor: color, opacity: isSelected ? 1 : 0.7 }]}
  >
    <Icon name={icon} size={24} color="#fff" />
    <Text style={styles.topicText}>{title}</Text>
  </TouchableOpacity>
)


const JobItem = ({ id, titulo, empresa, tipo_contrato, localizacao, salario, descricao, requisitos, curso, onSaveToggle, isSaved }) => {
  const [expandido, setExpandido] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const scaleValue = new Animated.Value(1);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSavePress = async () => {
    try {
      setIsLoading(true);
      animateButton();
      await onSaveToggle(id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.jobItem}
      onPress={() => setExpandido(!expandido)}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobIcon}>
          <Text style={styles.jobIconText}>{titulo[0]}</Text>
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{titulo}</Text>
          <Text style={styles.jobCompany}>{empresa}</Text>
          <Text style={styles.jobDetails}>
            {tipo_contrato} • {localizacao}
          </Text>
          <Text style={styles.jobSalary}>{salario}</Text>
          <Text style={styles.jobCourse}>Curso: {curso}</Text>
        </View>
        <Animated.View 
          style={[
            styles.saveButton,
            { transform: [{ scale: scaleValue }] }
          ]}
        >
          <TouchableOpacity 
            onPress={handleSavePress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#6666FF" />
            ) : (
              <Icon 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={isSaved ? "#6666FF" : "#000"} 
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {expandido && (
        <View style={styles.jobExpandedContent}>
          <Text style={styles.jobSectionTitle}>Descrição</Text>
          <Text style={styles.jobDescription}>{descricao}</Text>

          <Text style={styles.jobSectionTitle}>Requisitos</Text>
          {requisitos.map((requisito, index) => (
            <View key={index} style={styles.requisitoItem}>
              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.requisitoText}>{requisito}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  )
}

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
)

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6666FF" />
  </View>
)

const EmptyState = ({ message }) => (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyMessage}>{message}</Text>
  </View>
)

const benefitsList = [
  {
    id: 1,
    title: "Samsung para estudantes",
    description: "Faça seu cadastro na Samsung Estudantes e tenha acesso a diversas ofertas.",
    image: require("../../assets/images/graduate.png"),
    backgroundColor: "#E8E9FF",
    categoria: "Tecnologia"
  },
  {
    id: 2,
    title: "LinkedIn Premium",
    description: "O LinkedIn oferece uma opção de assinatura premium para estudantes.",
    image: require("../../assets/images/graduate.png"),
    backgroundColor: "#FFE8EC",
    categoria: "Educação"
  },
  {
    id: 3,
    title: "Apple para estudantes",
    description: "Economize com preços especiais para estudantes.",
    image: require("../../assets/images/graduate.png"),
    backgroundColor: "#FFE8E0",
    categoria: "Tecnologia"
  }
]

const categoriasBeneficios = [
  "Todas as categorias",
  "Tecnologia",
  "Educação",
  "Alimentação",
  "Transporte",
]

const cursos = [
  "Todos os cursos",
  "Ciência da Computação",
  "Engenharia Elétrica",
  "Relações Internacionais"
]

export default function HomeScreen() {
  const [vagas, setVagas] = useState([])
  const [showBenefits, setShowBenefits] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filtroSelecionado, setFiltroSelecionado] = useState("Todos os cursos")
  const [vagasFiltradas, setVagasFiltradas] = useState([])
  const [beneficiosFiltrados, setBeneficiosFiltrados] = useState(benefitsList)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [vagasSalvas, setVagasSalvas] = useState([])
  const [userId, setUserId] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();


  const fetchVagas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("https://api-uniway-firebase.vercel.app/api/vagas");
      const data = await response.json();
      
      if (data.success) {
        setVagas(data.vagas);
        const vagasFiltradas = filtroSelecionado === "Todos os cursos" 
          ? data.vagas 
          : data.vagas.filter(vaga => vaga.curso === filtroSelecionado);
        setVagasFiltradas(vagasFiltradas);
      } else {
        setError("Erro ao carregar as vagas");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor");
      console.error("Erro ao buscar vagas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filtroSelecionado]);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const userData = await authStorage.getUser();
    if (userData?.id) {
      await Promise.all([
        fetchVagas(),
        carregarVagasSalvas(userData.id)
      ]);
    } else {
      await fetchVagas();
    }
    setRefreshing(false);
  }, [fetchVagas, carregarVagasSalvas]);
  
  useEffect(() => {
    if (!showBenefits) {
      fetchVagas();
    } else {
      setIsLoading(false);
    }
  }, [showBenefits, fetchVagas]);
  
  useEffect(() => {
    if (route.params?.refresh) {
      onRefresh();
    }
  }, [route.params?.refresh, onRefresh]);


  
  const carregarUsuario = async () => {
    try {
      const userData = await authStorage.getUser();
      if (!userData?.id) {
        throw new Error("Dados do usuário inválidos");
      }
      setUserId(userData.id);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar dados do usuário. Por favor, faça login novamente.");
    }
  };
  

  const carregarVagasSalvas = useCallback(async (usuarioId) => {
    if (!usuarioId) return;
    
    try {
      const response = await fetch(`https://api-uniway-firebase.vercel.app/api/users/${usuarioId}/saved`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Falha ao carregar vagas salvas");
      }
      
      setVagasSalvas(data.vagas.map(vaga => vaga.id));
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar vagas salvas");
    }
  }, []);
  
  useEffect(() => {
    carregarUsuario();
  }, []);

  useEffect(() => {
    if (userId) {
      carregarVagasSalvas(userId);
    }
  }, [userId]);
  
  const toggleSaveVaga = async (vagaId) => {
    const userData = await authStorage.getUser();
    if (!userData?.id) {
      Alert.alert("Atenção", "Você precisa estar logado para salvar vagas");
      return;
    }

    const isSaved = vagasSalvas.includes(vagaId);
    
    setVagasSalvas(prevState => 
      isSaved 
        ? prevState.filter(id => id !== vagaId)
        : [...prevState, vagaId]
    );

    try {
      const response = await fetch(
        `https://api-uniway-firebase.vercel.app/api/users/${userData.id}/saved/${vagaId}`,
        { 
          method: isSaved ? "DELETE" : "POST",
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      if (!data.success) {
        setVagasSalvas(prevState => 
          isSaved 
            ? [...prevState, vagaId]
            : prevState.filter(id => id !== vagaId)
        );
        throw new Error(data.error || "Erro ao processar operação");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao processar operação. Por favor, tente novamente.");
    }
  };


  


  const aplicarFiltro = (cursoSelecionado) => {
    setFiltroSelecionado(cursoSelecionado)
    setModalVisible(false)
    setIsLoading(true)

    if (showBenefits) {
      if (cursoSelecionado === "Todas as categorias") {
        setBeneficiosFiltrados(benefitsList)
      } else {
        const beneficiosFiltrados = benefitsList.filter(
          (beneficio) => beneficio.categoria === cursoSelecionado
        )
        setBeneficiosFiltrados(beneficiosFiltrados)
      }
      setIsLoading(false)
    } else {
      const vagasFiltradas = cursoSelecionado === "Todos os cursos"
        ? vagas
        : vagas.filter(vaga => vaga.curso === cursoSelecionado)
      setVagasFiltradas(vagasFiltradas)
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />
    }

    if (error) {
      return <EmptyState message={error} />
    }

    if (showBenefits) {
      return beneficiosFiltrados.length > 0 ? (
        <View style={styles.benefitsContainer}>
          {beneficiosFiltrados.map(benefit => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </View>
      ) : (
        <EmptyState message="Infelizmente não há benefícios disponíveis para esta categoria :(" />
      )
    }

    return vagasFiltradas.length > 0 ? (
      vagasFiltradas.map((vaga) => (
        <JobItem
          key={vaga.id}
          id={vaga.id}
          titulo={vaga.titulo}
          empresa={vaga.empresa}
          tipo_contrato={vaga.tipo_contrato}
          localizacao={vaga.localizacao}
          salario={vaga.salario}
          descricao={vaga.descricao}
          requisitos={vaga.requisitos}
          curso={vaga.curso}
          onSaveToggle={toggleSaveVaga}
          isSaved={vagasSalvas.includes(vaga.id)}
        />
      ))
    ) : (
      <EmptyState message="Infelizmente não há vagas disponíveis para este curso :(" />
    )
  }

  // Listener para atualizações de vagas salvas
  useEffect(() => {
    const handleSavedJobsUpdate = (vagaId) => {
      setVagasSalvas(prev => prev.filter(id => id !== vagaId));
    };

    eventEmitter.on('SAVED_JOBS_UPDATED', handleSavedJobsUpdate);

    return () => {
      eventEmitter.off('SAVED_JOBS_UPDATED', handleSavedJobsUpdate);
    };
  }, []);

  // Atualizar quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      const checkForUpdates = async () => {
        const userData = await authStorage.getUser();
        if (userData?.id) {
          carregarVagasSalvas(userData.id);
        }
      };
      checkForUpdates();
    }, [carregarVagasSalvas])
  );

  return (
    <View style={styles.container}>
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#6666FF"]}
        />
      }
    >
        <Text style={styles.sectionTitle}>Tópicos</Text>
        <View style={styles.topicsContainer}>
          <TopicItem 
            title="Vagas" 
            color="#FF9966" 
            icon="briefcase-outline" 
            onPress={() => {
              setShowBenefits(false)
              setFiltroSelecionado("Todos os cursos")
            }}
            isSelected={!showBenefits}
          />
          <TopicItem 
            title="Benefícios" 
            color="#6666FF" 
            icon="gift-outline" 
            onPress={() => {
              setShowBenefits(true)
              setFiltroSelecionado("Todas as categorias")
            }}
            isSelected={showBenefits}
          />
        </View>
  
        <Text style={styles.sectionTitle}>{showBenefits ? "Benefícios" : "Vagas"}</Text>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>
            {showBenefits ? "Filtrar por categoria" : "Filtrar por curso"}
          </Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setModalVisible(true)}
          >
            <Text>{filtroSelecionado}</Text>
            <Icon name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>
        </View>
  
        {renderContent()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {showBenefits ? "Selecione a categoria" : "Selecione o curso"}
            </Text>
            {(showBenefits ? categoriasBeneficios : cursos).map((opcao, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalOption}
                onPress={() => aplicarFiltro(opcao)}
              >
                <Text style={[
                  styles.modalOptionText,
                  filtroSelecionado === opcao && styles.modalOptionSelected
                ]}>
                  {opcao}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  topicsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    width: "48%",
    height: 80,
    justifyContent: "center",
  },
  topicText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  filterButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalOptionSelected: {
    color: "#6666FF",
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#6666FF",
    borderRadius: 10,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  jobItem: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  jobIconText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  jobCompany: {
    fontSize: 16,
    color: "#666",
  },
  jobDetails: {
    fontSize: 14,
    color: "#999",
  },
  jobSalary: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 2,
  },
  jobCourse: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontStyle: "italic",
  },
  saveButton: {
    padding: 5,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobExpandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  jobSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  jobDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  requisitoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requisitoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    minHeight: 150,
  },
  cardContent: {
    flex: 1,
  },
  logoContainer: {
    width: 40,
    height: 40,
    marginBottom: 12,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    textAlign: "left",
  },
  benefitsContainer: {
    paddingHorizontal: 10,
  },
})