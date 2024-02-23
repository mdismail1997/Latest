import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {AppText, SafeView} from '../../../Component';
import HeaderComponent from '../../../Component/Header';
import MatIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/dist/AntDesign';
import {tabBarIcon} from '../../../Component/ScreenComponenet/BottomTabItem';
import {Select, FormControl, Box, Fab, Icon} from 'native-base';
import {Font} from '../../../utils/font';
import {calcH, calcW} from '../../../utils/Common';
import {useDispatch, useSelector} from 'react-redux';
import routes from '../../../Navigation/routes';
import {colorSet, mainColor} from '../../../utils/Color';
import {assetsImages} from '../../../utils/assets';
import {getProductList} from '../../../reduxToolkit/slices/Product/getProductSlice';
import {AppForm, AppFormField} from '../../../Component/Form';
import * as Yup from 'yup';
import SubmitButton from '../../../Component/Form/SubmitButton';
import {PERMISSIONS, request} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {addProductData} from '../../../reduxToolkit/slices/Product/addproductSlice';
import {toasterr} from '../../../utils/commonToast';
import {ErrorMessage, useFormik} from 'formik';
import {deleteProductData} from '../../../reduxToolkit/slices/Product/deleteProductSlice';
import HomeLoader from '../../../Component/ScreenComponenet/LoadingScreen';
import {editProductData} from '../../../reduxToolkit/slices/Product/editproductSlice';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').label('Name'),
  // type: Yup.string().required('Type is required').label('Type'),
  regular_price: Yup.string()
    .required('Regular Price is required')
    .label('Regular Price'),
  sale_price: Yup.string()
    .required('Sale Price is required')
    .label('Sale Price'),
  description: Yup.string()
    .required('Description is required')
    .label('Description'),
  short_description: Yup.string()
    .required('Short Description is required')
    .label('Short Description'),
  // image_url: Yup.string().required('Image is required').label('Image'),
  sku: Yup.string().required('SKU is required').label('SKU'),
  // tags: Yup.string().required('Tags is required').label('Tags'),
  // categories: Yup.string()
  //   .required('Categories is required')
  //   .label('Categories'),
});

const initialValues = {
  name: '',
  type: '',
  regular_price: '',
  sale_price: '',
  description: '',
  short_description: '',
  image_url: '', // You may set a default image URL if needed
  sku: '',
  tags: '',
  categories: '',
};
const EditProduct = props => {
  const {productList} = useSelector(state => state.myProductListData);

  const dispatch = useDispatch();
  useEffect(() => {
    setloadings(true);
    dispatch(getProductList());
    console.log('product list data==========>', productList);
    setloadings(false);
    // dispatch(getProductdata());
    // getProduct();
  }, []);

  const [product, setProduct] = useState(false);
  const [eproduct, seteProduct] = useState(false);
  const [loading, setloading] = useState(false);
  const [loadings, setloadings] = useState(false);
  const {isLoggedIn} = useSelector(state => state.User);
  const [selectedType, setSelectedType] = useState('');
  const [image, setImage] = useState(null);
  const [images, setImages] = useState(null);
  const [images111, setImages111] = useState(null);
  const [typeError, setTypeError] = useState('');
  const [editdata, setEditdata] = useState(initialValues);
  const [productId, setProductId] = useState('');

  const onCamera = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(result => {
        //setPermissionResult(result)
        console.log(result);
        if (result == 'granted') {
          onCamera1();
        } else if (result == 'denied') {
          Alert.alert(
            'Camera Permission Denied',
            'Please give permission to access Camera through Setting',
          );
        } else if (
          result == 'blocked' ||
          result == 'limited' ||
          result == 'unavailable'
        ) {
          Alert.alert(
            `Camera Permission ${result}`,
            'Please grant permission to access Camera through Setting',
          );
        }
      })
      .catch(error => {
        console.log('Error===>', error);
        Alert.alert(error);
      });
  };
  const onCamera1 = () => {
    ImagePicker.openCamera({
      width: 1100,
      height: 1000,
      mediaType: 'photo',
      cropping: true,
      //compressImageQuality: 0.5,
    })
      .then(image => {
        console.log('Image==>', image);
        setImage(image.path);
        setImages(image);
        // setImageModal(false);
      })
      .catch(error => {
        console.log('User cancelled image selection from the Camera');
        console.log('Image Cancel error===>', error);
      });
  };
  const onGallery = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    )
      .then(result => {
        //setPermissionResult(result)
        console.log('==========>', result);

        if (result == 'granted') {
          onGallery1();
        } else if (result == 'denied') {
          Alert.alert(
            'Read Media Permission Denied',
            'Please give permission to access Media through Setting',
          );
        } else if (
          result == 'blocked' ||
          result == 'limited' ||
          result == 'unavailable'
        ) {
          console.log('=======>', result);
          Alert.alert(
            `Read Media Permission ${result}`,
            'Please grant permission to access Media through Setting',
          );
        }
      })
      .catch(error => {
        console.log('Error===>', error);
        Alert.alert(error);
      });
  };
  const onGallery1 = () => {
    ImagePicker.openPicker({
      width: 1100,
      height: 1000,
      mediaType: 'photo',
      cropping: true,
      //compressImageQuality: 0.5,
    })
      .then(image => {
        console.log('Image==>', image);

        setImage(image.path);
        setImages(image);
        // setImageModal(false);
      })
      .catch(error => {
        console.log('User cancelled image selection from the gallery');
        console.log('Image Cancel error===>', error);
      });
  };
  const uploadImageOption = async () => {
    Alert.alert(
      //title
      'Upload Image',
      //body
      'From where you want to upload?',
      [
        {text: 'Cancel', onPress: () => setImage(''), style: 'cancel'},
        {text: 'Camera', onPress: () => onCamera()},
        {text: 'Gallery', onPress: () => onGallery()},
      ],
      {cancelable: true},
      //clicking out side of alert will not cancel
    );
  };
  const handleSelectType = itemValue => {
    setTypeError('');
    setSelectedType(itemValue);
    // Reset the error message when a type is selected
  };
  const editDetails = item => {
    console.log('*********%%%%', item);
    seteProduct(true);
    setEditdata({
      name: item.name,
      type: item.type,
      regular_price: JSON.stringify(item.regular_price),
      sale_price: JSON.stringify(item.sale_price),
      description: item.description,
      short_description: item.short_description,
      sku: item.sku,
      tags: item.tags.toString(),
      categories: item.categories.toString(),
    });
    setSelectedType(item.type);
    setImage(item.main_image);
    setImages111(item.main_image);
    setProductId(item.id);
  };
  const handleChange = (name, value) => {
    console.log(name, ':', value);
    setEditdata(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async ({
    name,
    type,
    regular_price,
    sale_price,
    description,
    short_description,
    image_url,
    sku,
    tags,
    categories,
  }) => {
    console.log('working==========>');
    if (!selectedType) {
      setTypeError('Type is required');
      return;
    }

    if (!image) {
      toasterr.showToast('Please upload product image');
      return;
    }
    const formdata = new FormData();

    formdata.append('name', editdata.name);
    formdata.append('type', selectedType.toLowerCase());
    formdata.append('regular_price', Number(editdata.regular_price));
    formdata.append('sale_price', editdata.sale_price);
    formdata.append('description', editdata.description);
    formdata.append('short_description', editdata.short_description);
    {
      !images
        ? formdata.append('image_url', images111)
        : formdata.append('image_url', {
            uri: images.path,
            type: images.mime,
            name: images.path.split('/').pop(),
            size: images.size,
          });
    }

    formdata.append('sku', editdata.sku);
    formdata.append('tags', editdata.tags);
    formdata.append('categories', editdata.categories);
    console.log('data input for adding new product', formdata);
    if (eproduct === true) {
      setloading(true);
      await dispatch(
        editProductData(
          formdata,
          formdata.append('product_id', JSON.stringify(productId)),
        ),
      ).then(async res => {
        console.log('add product data', res);
        setloading(false);
        if (res.payload.status == true) {
          //   await AsyncStorage.setItem(TOKEN, res.payload.token);
          //   setToken(res.payload.token);
          // props.navigation.navigate(routes.Drawertab);
          seteProduct(false);
          dispatch(getProductList());
        } else {
          console.log('routing is not done');
        }
      });
    } else {
      formdata.append('name', name);
      formdata.append('type', selectedType.toLowerCase());
      formdata.append('regular_price', regular_price);
      formdata.append('sale_price', sale_price);
      formdata.append('description', description);
      formdata.append('short_description', short_description);
      formdata.append('image_url', {
        uri: images.path,
        type: images.mime,
        name: images.path.split('/').pop(),
        size: images.size,
      });
      formdata.append('sku', sku);
      formdata.append('tags', tags);
      formdata.append('categories', categories);
      console.log('data input for adding new product', formdata);
      setloading(true);
      await dispatch(addProductData(formdata)).then(async res => {
        console.log('add product data', res);
        setloading(false);
        if (res.payload.status == true) {
          //   await AsyncStorage.setItem(TOKEN, res.payload.token);
          //   setToken(res.payload.token);
          props.navigation.navigate(routes.Drawertab);
        } else {
          console.log('routing is not done');
        }
      });
    }
  };

  const removeItem = async id => {
    console.log('*****', id);
    await dispatch(
      deleteProductData({
        id: id,
      }),
    ).then(async res => {
      // setLoading(false);
      console.log('remove item data', res);
      dispatch(getProductList());
    });
  };

  const renderWishlistItem = ({item}) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Icons name="closecircleo" size={20} color={'#000'} />
      </TouchableOpacity>
      <Image
        source={
          item?.main_image == false
            ? {
                uri: assetsImages.noImage,
              }
            : {
                uri: item.main_image,
              }
        }
        style={styles.cardImage}
      />
      <Text numberOfLines={1} style={styles.cardText}>
        {item.name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.cardText}>
          ${Number(item.regular_price).toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => editDetails(item)}>
          <Icons name="edit" size={18} color={'#000'} />
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity onPress={() => addCartItem(item.id)}>
        <Text style={styles.removeButton}>Add to cart</Text>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <SafeView>
      <HeaderComponent
        headingName={'My Products'}
        arrow={tabBarIcon('arrow-left')}
        onPress={() => props.navigation.goBack()}
        searchPress={() => props.navigation.navigate(routes.SearchItem)}
        navigation={props.navigation}
      />
      <HomeLoader visible={loadings} color="blue" />
      {product !== true && eproduct === false ? (
        <View style={styles.mainContainer}>
          <Box height={20} shadow="2" rounded="lg">
            <Fab
              renderInPortal={false}
              shadow={2}
              placement="top-right"
              size="sm"
              backgroundColor={mainColor}
              icon={
                <Icon color="white" as={Icons} name="pluscircle" size="4" />
              }
              label="New Product"
              onPress={() => setProduct(true)}
            />
          </Box>
          <View style={{marginTop: calcH(0.02), paddingHorizontal: 15}}>
            <View style={{marginBottom: calcH(0.07)}}>
              {productList !== 'No products found.' ? (
                <FlatList
                  data={productList}
                  keyExtractor={item => item.id}
                  renderItem={renderWishlistItem}
                  numColumns={2} // Adjust the number of columns as needed
                />
              ) : (
                <Text style={[styles.text, {margin: calcW(0.25)}]}>
                  Your wishlist is empty
                </Text>
              )}
            </View>
          </View>
        </View>
      ) : (
        <>
          {eproduct === true ? (
            <View style={styles.inputContainer}>
              {/* <Text style={{color: '#fff'}}>&&&&&&&&&&&&&&&&&edit</Text> */}
              <AppForm
                initialValues={editdata}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                <AppFormField
                  label="Name"
                  placeholder="Enter product name"
                  name="name"
                  initialValue={editdata.name}
                  onChangeText={value => handleChange('name', value)}
                />

                <FormControl.Label
                  name="type"
                  _text={{
                    fontFamily: Font.Bold,
                    fontSize: calcW(0.05),
                    color: '#fff',
                  }}>
                  Choose Type
                </FormControl.Label>
                <Select
                  name="type"
                  minWidth="200"
                  color={'#fff'}
                  placeholder="Choose Type"
                  selectedValue={editdata.type}
                  onValueChange={handleSelectType}
                  _selectedItem={{
                    bg: 'teal.600',
                  }}
                  mt="1">
                  <Select.Item label="Simple" value="Simple" />
                  <Select.Item label="Variable" value="Variable" />
                </Select>
                {!selectedType ? (
                  <ErrorMessage
                    name="type"
                    component={Text}
                    style={styles.errorText}>
                    {typeError}
                  </ErrorMessage>
                ) : null}

                {console.log('*******', selectedType)}
                <AppFormField
                  label="Regular Price"
                  placeholder="Enter regular price"
                  name="regular_price"
                  initialValue={editdata.regular_price}
                  onChangeText={value => handleChange('regular_price', value)}
                />
                <AppFormField
                  label="Sale Price"
                  placeholder="Enter sale price"
                  name="sale_price"
                  initialValue={editdata.sale_price}
                  onChangeText={value => handleChange('sale_price', value)}
                />
                <AppFormField
                  label="Description"
                  placeholder="Enter product description"
                  name="description"
                  initialValue={editdata.description}
                  onChangeText={value => handleChange('description', value)}
                />
                <AppFormField
                  label="Short Description"
                  placeholder="Enter short description"
                  name="short_description"
                  initialValue={editdata.short_description}
                  onChangeText={value =>
                    handleChange('short_description', value)
                  }
                />
                <AppFormField
                  label="SKU"
                  placeholder="Enter SKU"
                  name="sku"
                  initialValue={editdata.sku}
                  onChangeText={value => handleChange('sku', value)}
                />
                <AppFormField
                  label="Tags"
                  placeholder="Enter tags (comma-separated)"
                  name="tags"
                  initialValue={editdata.tags}
                  onChangeText={value => handleChange('tags', value)}
                />
                <AppFormField
                  label="Categories"
                  placeholder="Enter categories (comma-separated)"
                  name="categories"
                  initialValue={editdata.categories}
                  onChangeText={value => handleChange('categories', value)}
                />
                <TouchableOpacity onPress={uploadImageOption}>
                  <View style={styles.secondContainer}>
                    <MatIcons name="attachment" size={25} color={'#fff'} />
                    <Text style={[styles.text, {left: calcW(0.02)}]}>
                      Upload image
                    </Text>
                  </View>
                </TouchableOpacity>
                {image && (
                  <Image
                    source={{uri: image}}
                    style={{width: 100, height: 100}}
                  />
                )}
                <SubmitButton title={'Submit'} loading={loading} />
              </AppForm>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <AppForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                <AppFormField
                  label="Name"
                  placeholder="Enter product name"
                  name="name"
                />

                <FormControl.Label
                  name="type"
                  _text={{
                    fontFamily: Font.Bold,
                    fontSize: calcW(0.05),
                    color: '#fff',
                  }}>
                  Choose Type
                </FormControl.Label>
                <Select
                  name="type"
                  minWidth="200"
                  color={'#fff'}
                  placeholder="Choose Type"
                  onValueChange={handleSelectType}
                  _selectedItem={{
                    bg: 'teal.600',
                  }}
                  mt="1">
                  <Select.Item label="Simple" value="Simple" />
                  <Select.Item label="Variable" value="Variable" />
                </Select>
                {!selectedType ? (
                  <ErrorMessage
                    name="type"
                    component={Text}
                    style={styles.errorText}>
                    {typeError}
                  </ErrorMessage>
                ) : null}

                {console.log('*******', selectedType)}
                <AppFormField
                  label="Regular Price"
                  placeholder="Enter regular price"
                  name="regular_price"
                />
                <AppFormField
                  label="Sale Price"
                  placeholder="Enter sale price"
                  name="sale_price"
                />
                <AppFormField
                  label="Description"
                  placeholder="Enter product description"
                  name="description"
                />
                <AppFormField
                  label="Short Description"
                  placeholder="Enter short description"
                  name="short_description"
                />
                <AppFormField label="SKU" placeholder="Enter SKU" name="sku" />
                <AppFormField
                  label="Tags"
                  placeholder="Enter tags (comma-separated)"
                  name="tags"
                />
                <AppFormField
                  label="Categories"
                  placeholder="Enter categories (comma-separated)"
                  name="categories"
                />
                <TouchableOpacity onPress={uploadImageOption}>
                  <View style={styles.secondContainer}>
                    <MatIcons name="attachment" size={25} color={'#fff'} />
                    <Text style={[styles.text, {left: calcW(0.02)}]}>
                      Upload image
                    </Text>
                  </View>
                </TouchableOpacity>
                {image && (
                  <Image
                    source={{uri: image}}
                    style={{width: 100, height: 100}}
                  />
                )}
                <SubmitButton title={'Submit'} loading={loading} />
              </AppForm>
            </View>
          )}
        </>
      )}
    </SafeView>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // padding: 12,
  },
  heading: {
    fontFamily: Font.Bold,
    fontSize: calcW(0.05),
    color: mainColor,
  },
  card: {
    flex: 0.5,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    padding: 5,
  },
  cardImage: {
    height: calcH(0.2),
    resizeMode: 'contain',
  },
  cardText: {
    padding: 8,
    fontSize: 16,
    fontFamily: Font.Regular,
    color: '#000',
  },
  removeButton: {
    color: '#fff',
    fontFamily: Font.Bold,
    padding: 8,
    textAlign: 'center',
    fontSize: 15,
    backgroundColor: mainColor,
  },
  inputContainer: {
    backgroundColor: colorSet.backgroundColor,
    flex: 1,
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    // elevation: 5,
    // shadowColor: '#064681',
    padding: 25,

    // marginTop: calcH(0.1)
  },
  secondContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
    marginTop: calcH(0.02),
  },
  text: {
    fontFamily: Font.Bold,
    color: '#fff',
  },
  iconStyle: {marginRight: 7},
  errorText: {
    color: 'red',
    fontSize: calcW(0.04),
    marginTop: 2.5,
    marginBottom: 2.5,
    fontFamily: Platform.OS === 'android' ? Font.Medium : 'Avenir',
  },
});
