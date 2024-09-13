import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const TopicItem = ({ title, color, icon }) => (
  <View style={[styles.topicItem, { backgroundColor: color }]}>
    <Icon name={icon} size={24} color="#fff" />
    <Text style={styles.topicText}>{title}</Text>
  </View>
);

const JobItem = ({ title, company, status, type, time }) => (
  <View style={styles.jobItem}>
    <View style={styles.jobHeader}>
      <View style={styles.jobIcon}>
        <Text style={styles.jobIconText}>{title[0]}</Text>
      </View>
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{title}</Text>
        <Text style={styles.jobCompany}>{company}</Text>
        <Text style={styles.jobDetails}>
          {status} • {type}
        </Text>
      </View>
      <TouchableOpacity style={styles.saveButton}>
        <Icon name="bookmark-outline" size={24} color="#000" />
      </TouchableOpacity>
    </View>
    <Text style={styles.jobTime}>{time}</Text>
  </View>
);

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.sectionTitle}>Tópicos</Text>
        <View style={styles.topicsContainer}>
          <TopicItem title="Vagas" color="#FF9966" icon="briefcase-outline" />
          <TopicItem title="Benefícios" color="#6666FF" icon="gift-outline" />
          <TopicItem
            title="Oportunidades"
            color="#66CCFF"
            icon="star-outline"
          />
        </View>

        <Text style={styles.sectionTitle}>Vagas</Text>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtrar por curso</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text>Ciência da Computação</Text>
            <Icon name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <JobItem
          title="Senior - UX Designer"
          company="TechCorp"
          status="Contratando"
          type="Integral"
          time="há 3d"
        />
        <JobItem
          title="Desenvolvedor Java"
          company="JavaTech"
          status="Finalizado"
          type="Estágio"
          time="há 2d"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
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
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    width: "30%",
  },
  topicText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
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
  saveButton: {
    padding: 5,
  },
  jobTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "right",
  },
});
