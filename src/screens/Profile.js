import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { authStorage } from '../authStorage';

export default function Profile({ route }) {
    const { userId, userEmail, userName } = route.params;
    
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        course: '',
        profileImage: null
    });

    const API_URL = 'https://api-uniway-firebase.vercel.app';

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/api/users/${userId}`);
            if (response.data && response.data.user) {
                setUserData({
                    name: response.data.user.name,
                    course: response.data.user.course,
                    profileImage: response.data.user.profileImage
                });
            }
        } catch (error) {
            setError('Erro ao carregar dados do usuário');
            console.error('Erro ao buscar dados do usuário:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            "Confirmação",
            "Tem certeza que deseja sair?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        await authStorage.removeUser();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }]
                        });
                    }
                }
            ]
        );
    };

    const menuItems = [
        { title: 'Home', symbol: '🏠' },
        { title: 'Saved', symbol: '💾' },
        { title: 'Sair', symbol: '🚪', onPress: handleLogout }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileSection}>
                <Image 
                    style={styles.profileImage}
                    source={userData.profileImage} 
                />
                <Text style={styles.name}>{isLoading ? 'Carregando...' : userData.name}</Text>
                <Text style={styles.role}>{isLoading ? 'Carregando...' : userData.course}</Text>
            </View>

            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.menuItem}
                        onPress={item.onPress || (() => navigation.navigate(item.title))}
                    >
                        <Text style={styles.menuSymbol}>{item.symbol}</Text>
                        <Text style={[
                            styles.menuText,
                            item.title === 'Sair' && styles.logoutText
                        ]}>{item.title}</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    role: {
        fontSize: 16,
        color: '#666666',
    },
    menuContainer: {
        paddingTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    menuSymbol: {
        fontSize: 20,
        width: 30,
        textAlign: 'center',
    },
    menuText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#333333',
    },
    logoutText: {
        color: '#FF3B30',
    },
    menuArrow: {
        fontSize: 24,
        color: '#6B4EAA',
    }
});