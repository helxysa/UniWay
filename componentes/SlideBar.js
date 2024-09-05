import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function SlideBar() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const slides = [
    {
      id: '1',
      image: 'https://s3-alpha-sig.figma.com/img/892b/f2c2/0116cc75cc69326a9486a852794df605?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LzRfyuHyPoMX12~05SUHp-8th39oHBRklOWiYQUEVgySxbqL2n1UAHyFFphSXQdrYuLD6nLnKJnAfeI~toZhXa-gSk2niMUG-lRLNR1KWSyLNBbu8x91MUwkP9ol1GvgERHOyyOiTu15f12Qv7~6CiPiiVZ2f2R14OyL8VNOag2lDT-1QG4ACl2M-w6vEnwV~yBqLdEp4EXhKTvf9Wji1PW82fQaX32DbE38umIix79DMsGOoYKcx2YjC4mjoqe9lN2cWF7HEQDw-kn0uYCALHrJ8L9r9jUt666bmR5LWBRy0LEYlEt~5cloA295sV7hJaUOic-lPV9Ki0KryNTlAQ__',
      title: 'Encontre as melhores oportunidades de emprego e estágio, feitas sob medida para universitários como você',
    },
    {
        id: 2,
        image: 'https://s3-alpha-sig.figma.com/img/64fb/0701/f38bd913867003a09e19d7a5eccdc6ff?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GcqP3NLhRyvhX-JM~lwtL8x~U2ahYXUMCu8THIufr~~ZGKyujqIDp4jhRbLp9B-tVXsF5ZE4e1Q32YYS1uydh574YoRU3ErGsNfzZzRbTADB90dSa1oFww4LmjlHpikblhh--ykdhmVaaYz2xOppkWVSKIt8W1ww~0y~M1vfyQck8UzNtFYeHxxkhJ9GTzS0ipPim20Vg9ZFVDzHjA5LnFaxUFXvMWG87hWvFoEx1gmbvYbkp5aCFXE2PBDZ1P5PIm-BQ8JLXD78ZuKNoCZbl6zwK6Q2hINiY1ymo3IscTVyyc~hHHnDBae3RcxRhVaijkkmmevaMGIdLw83v5tt-A__',
        title: 'Fique informado sobre eventos, workshops e atividades que contam horas complementares para sua graduação.',
        
    }, {
      id: 3,
      image: 'https://s3-alpha-sig.figma.com/img/743a/58d8/286872d59d56f60be062fedfe8d05f90?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g1QJ8bc0kbQTylsg2XT6xm4882epJwVWZr24ilEy4qwiZULgbkHAabDoZoWCkzoOCaKlHp4j4NPDn5RilY2ZhV9YTKD~PEina6OF6UTrO0g~kFol~LtdVpQSUPnzEGAcGHUrkeUneg0UxCCoctTbuq~hUQ59cvfwPzyOLLGIPQtwLQ3~123zu~yYCR0gPjk8KVCCmdbAYhwP05~OgCZcnz8D6~CN9V~Y2QKpq3WXQIMq7QOQO2jjHnM-bL5HQR1CCFmUxBm1V13PKazt~Z-AVfAp96MVl3JqxuYle26xnaucNs4CAyVcW9mbDkJjoBKUv122co6u709WmVQd4-8PGQ__',
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
        source={{ uri: item.image }}
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