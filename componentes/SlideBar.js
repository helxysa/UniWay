import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import mulher from '../assets/mulher.png';
import chapeu from '../assets/chapeu.png';
import livro from '../assets/livro.png';


const { width, height } = Dimensions.get('window');

export default function SlideBar() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();

  const flatListRef = useRef(null);

  const slides = [
    {
      id: '1',
      image: mulher,
      title: 'Encontre as melhores oportunidades de emprego e estágio, feitas sob medida para universitários como você',
    },
    {
        id: 2,
        image: chapeu,
        title: 'Fique informado sobre eventos, workshops e atividades que contam horas complementares para sua graduação.',
        
    }, {
      id: 3,
      image: livro,
      title: 'Descubra todos os benefícios que você tem direito como estudante! Descontos, bolsas, e muito mais',
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentSlide + 1 });
    } else {
        navigation.navigate('InitialMenu');

    }
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <Image 
        source={item.image}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.indicator,
              index === currentSlide ? styles.activeIndicator : styles.inactiveIndicator
            ]}
          />
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={nextSlide}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? "Começar" : "Próximo"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  slide: {
    width: width,
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
    textAlign: 'center',
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 18,
  },
indicatorContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: height * 0.03,
},
indicator: {
  height: 8,
  borderRadius: 4,
  marginHorizontal: 4,
},
activeIndicator: {
  width: 16,
  backgroundColor: '#4F46E5', // bg-indigo-600
},
inactiveIndicator: {
  width: 8,
  backgroundColor: '#D1D5DB', // bg-gray-300
},
buttonContainer: {
  paddingHorizontal: width * 0.05,
  marginBottom: height * 0.05,
},
button: {
  backgroundColor: '#4F46E5', // bg-indigo-600
  paddingVertical: height * 0.02,
  borderRadius: 8,
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
buttonText: {
  color: 'white',
  fontWeight: '600',
  fontSize: 10,
},
});