import React, {useRef} from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import Dots from '../../Component/Dots';
import {assetsImages} from '../../utils/assets';
import {calcH, calcW} from '../../utils/Common';
import {Button} from 'native-base';
import {colorSet, mainColor} from '../../utils/Color';
import routes from '../../Navigation/routes';

const {width, height} = Dimensions.get('window');

const data = [
  {
    id: 0,
    title: 'Unwrap Happiness with Every Purchase!',
    image: assetsImages.skip1,
  },
  {
    id: 1,
    title: 'Shop your dreams, one click away.',
    image: assetsImages.skip2,
  },
];

const Slider = props => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const dotPosition = Animated.divide(scrollX, width);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#010512',
      }}>
      <Animated.FlatList
        data={data}
        keyExtractor={item => item.id}
        horizontal
        snapToInterval={width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        renderItem={({item, index}) => {
          return (
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <Image
                  source={assetsImages.backImage}
                  style={styles.backImage}
                  resizeMode="contain"
                />
                <Image
                  source={item.image}
                  style={{
                    width: calcW(0.88),
                    height: calcH(0.88),
                    position: 'absolute',
                  }}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{item.title}</Text>
              </View>

              <View style={styles.dottedContainer}>
                <Dots data={data} dotPosition={dotPosition} />
              </View>
              <Button
                style={{
                  backgroundColor: mainColor,
                  width: calcW(0.2),
                  alignSelf: 'flex-end',
                }}
                onPress={() => props.navigation.navigate(routes.Drawertab)}>
                Skip
              </Button>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    width: calcW(1),
    justifyContent: 'center',
    backgroundColor: colorSet.backgroundColor,
    padding: 12,
  },
  imageContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: calcH(0.1),
  },
  titleContainer: {
    alignItems: 'center',
    padding: 2,
  },
  title: {
    fontSize: 25,
    // fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    includeFontPadding: false,
  },
  backImage: {
    width: calcW(0.58),
    height: calcH(0.58),
    marginTop: calcH(0.3),
  },
  dottedContainer: {
    height: calcH(0.15),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: height > 700 ? 24 : 20,
  },
});
