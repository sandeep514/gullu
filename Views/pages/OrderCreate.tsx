import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  View,
  Modal,
  ImageBackground,
  Pressable,
} from 'react-native';
import DocumentPicker, {
  isInProgress,
  types,
} from 'react-native-document-picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  flexDirectionRow,
  h3,
  h4,
  h5,
  height100,
  height9,
  inputStyleBlack,
  justifyContentCenter,
  marginLeft10,
  marginRight10,
  padding15,
  screenheight,
  secondaryBackgroundColor,
  textAlignCenter,
  gulluColor,
  primaryGulluLightBackgroundColor,
  goldenColor,
  height8,
  height83,
} from '../assets/styles';
import InputComponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import {readFile} from 'react-native-fs';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  get,
  getSalesmanList,
  getVendorList,
  showToast,
} from '../services/services';
import DatePicker from '@react-native-community/datetimepicker';
import NetInfo from '@react-native-community/netinfo';
import {S3} from 'aws-sdk';
import {RNS3} from 'react-native-s3-upload';

import {launchImageLibrary} from 'react-native-image-picker';
import NavBarComponent from '../components/NavBarComponent';
import COLOR from '../config/color';
import RadioGroup, {RadioGroupProps} from 'react-native-radio-buttons-group';

function OrderCreate({navigation}): JSX.Element {
  let salesmanData = {};
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [order_number, setOrderNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [vendor, setVendor] = useState('');
  const [salesman, setSalesman] = useState('');
  const [color, setColor] = useState('');
  const [item, setItem] = useState('');
  const [value, setValue] = useState(null);
  const [modalVisibleItem, setModalVisibleItem] = useState(false);
  const [modalVisibleVendor, setModalVisibleVendor] = useState(false);
  const [modalVisibleSalesman, setModalVisibleSalesman] = useState(false);

  const [product_photo, setPrductPhoto] = useState('');
  const [product_photo_type, setPrductPhotoType] = useState('');
  const [product_measurement, setProductMeasurement] = useState('');
  const [product_measure_type, setPrductMeasureType] = useState('');
  const [product_video, setProductVideo] = useState('');
  const [product_video_type, setPrductVideoType] = useState('');

  const [productPhotoData, setPrductPhotoData] = useState({});
  const [productMeasurementData, setPrductMeasurementData] = useState({});
  const [productVideoData, setProductVideoData] = useState({});
  const [productOriginalMeasurement, setProductOriginalMeasurement] = useState(
    {},
  );
  const [productSlipPhoto, setProductSlipPhoto] = useState({});

  const [vdCode, setVDcode] = useState('');
  const [designNumber, setDesignNumber] = useState('');
  const [prductPhotoResult, setPrductPhotoResult] = useState();
  const [productMeasurementResult, setProductMeasurementResult] = useState();
  const [productVideoResult, setProductVideoResult] = useState();
  const [apitoken, setApiToken] = useState();

  const [ItemList, SetItemList] = useState();
  const [ItemListAll, SetItemListAll] = useState();

  const [vendorList, SetVendorList] = useState();
  const [vendorListAll, SetVendorListAll] = useState();
  const [salesmanList, SetSalesmanList] = useState();
  const [salesmanListAll, SetSalesmanListAll] = useState();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [showReadyDate, setshowReadyDate] = useState(false);
  const [showBufferReadyDate, setShowBufferReadyDate] = useState(false);
  const [showDeliveryDate, setShowDeliveryDate] = useState(false);
  const [showVendorDate, setShowVendorDate] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState(
    'Generating new order',
  );

  const [selectedItemId, SetSelectedItemId] = useState();
  const [selectedVendorId, SetSelectedVendorId] = useState();
  const [selectedSalesmanId, SetSelectedSalesmanId] = useState();
  const [selectedItemName, SetSelectedItemName] = useState();
  const [selectedVendorName, SetSelectedVendorName] = useState();
  const [selectedSalesmanName, SetSelectedSalesmanName] = useState();

  const [readyDate, SetReadyDate] = useState();
  const [deliveryDate, SetDeliveryDate] = useState();
  const [vendorDate, SetVendorDate] = useState();
  const [bufferReadyDate, SetBufferReadyDate] = useState();

  const [percentage, setPercentage] = useState(0);
  const [networkType, setNetworkType] = useState();
  const [totalAttachmentSize, setTotalAttachmentSize] = useState();
  const [currentUploadingSpeed, setCurrentUploadingSpeed] = useState(0);

  const [S3ProductImageUpload, setS3ProductImageUpload] = useState(false);
  const [S3ProductMeasurementUpload, setS3ProductMeasurementUpload] =
    useState(false);
  const [
    S3ProductOriginalMeasurementUpload,
    setS3ProductOriginalMeasurementUpload,
  ] = useState(false);
  const [S3ProductSlipUpload, setS3ProductSlipUpload] = useState(false);
  const [S3ProductVideoUpload, setS3ProductVideoUpload] = useState(false);
  const [allAttachmentUpload, setAllAttachmentUpload] = useState(false);
  const [uploadingAttachment, setuploadingAttachment] = useState(false);

  const [sampleCholi, setSampleCholi] = useState<String | undefined>();
  const [pickup, setPickup] = useState<String | undefined>('');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const [orderSheetToVendor, setOrderSheetToVendor] = useState<
    String | undefined
  >();

  const radioButtonsSampleCholi = useMemo(
    () => [
      {
        id: 'Yes',
        label: 'Yes',
      },
      {
        id: 'No',
        label: 'No',
      },
    ],
    [],
  );

  const radioButtonsPickup = useMemo(
    () => [
      {
        id: 'Self Pickup',
        label: 'Self Pickup',
      },
      {
        id: 'No Trial + Shipping',
        label: 'No Trial + Shipping',
      },
    ],
    [],
  );

  const radioButtonsOrderSheetToVendor = useMemo(
    () => [
      {
        id: 'Yes',
        label: 'Yes',
      },
      {
        id: 'No',
        label: 'No',
      },
    ],
    [],
  );

  const videoPlayer = React.useRef();
  useEffect(() => {
    console.log();
    // getFileFromS3();
  }, []);
  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 0,
      base64: true,
    };
    launchImageLibrary(options, (response: any) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        return;
      } else if (response.errorCode == 'permission') {
        return;
      } else if (response.errorCode == 'others') {
        return;
      }
      if (response.assets[0].fileSize <= 30000000) {
        setPrductVideoType(response.assets[0].type);
        setProductVideoData(response.assets);
        let sourceUri = response.assets[0].uri;

        uploadFileToS3(
          sourceUri,
          response.assets[0].fileName,
          response.assets[0].fileSize,
          response.assets[0].type,
          'productVideo',
        );
      } else {
        showToast('Max Video upload size is 30MB.');
      }

      //   setFilePath(response.assets[0]);
      // RNVideoHelper.compress(response.assets[0].uri, {
      // 	startTime: 10, // optional, in seconds, defaults to 0
      // 	endTime: 100, //  optional, in seconds, defaults to video duration
      // 	quality: 'low', // default low, can be medium or high
      // 	defaultOrientation: 0 // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
      // }).progress(value => {
      // 	console.warn('progress', value); // Int with progress value from 0 to 1
      // }).then(compressedUri => {
      // 	console.warn('compressedUri', 'file:///'+compressedUri); // String with path to temporary compressed video
      // });
    });
  };
  async function getUriToBase64(uri: any) {
    const base64String = await readFile(uri, 'base64');
    return base64String;
  }
  useEffect(() => {
    getItemList();
    getVendorListData();
    getSalesmanListData();
    setshowReadyDate(false);
    setShowDeliveryDate(false);

    AsyncStorage.getItem('id')
      .then(token => {
        setApiToken(token);
      })
      .catch(err => {});

    return () => {
      setshowReadyDate(false);
      setShowDeliveryDate(false);
    };
  }, []);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      console.log(state);
      setNetworkType(state.type);
    });
  }, []);

  var current = 0;
  var interval: any;

  let saveOrder = async () => {
    let size1 = 0;
    let size2 = 0;
    let size3 = 0;
    let size4 = 0;
    let size5 = 0;
    if (productPhotoData.length > 0) {
      size1 = productPhotoData[0].size;
    }
    if (productMeasurementData.length > 0) {
      size2 = productMeasurementData[0].size;
    }
    if (productVideoData.length > 0) {
      size3 = productVideoData[0].fileSize;
    }
    if (productOriginalMeasurement.length > 0) {
      size4 = productOriginalMeasurement[0].size;
    }
    if (productSlipPhoto.length > 0) {
      size5 = productSlipPhoto[0].size;
    }

    let totalAttachmentSize = (size1 + size2 + size3 + size4 + size5) / 1000000;
    setTotalAttachmentSize(totalAttachmentSize);
    let mobileDataSize = 1;
    let wifiDataSize = 6;
    let defaultTimeInterval = 1000;

    if (networkType == 'cellular') {
      if (mobileDataSize <= 0) {
        mobileDataSize = 1;
      }
      defaultTimeInterval =
        Math.round(totalAttachmentSize / mobileDataSize) * 1000;
    } else {
      if (wifiDataSize <= 0) {
        wifiDataSize = 1;
      }
      defaultTimeInterval =
        Math.round(totalAttachmentSize / wifiDataSize) * 1000;
    }

    var dataProductVideoData =
      Object.values(productVideoData).length > 0
        ? productVideoData[0].fileName
        : '';

    var dataOrder_number = order_number;
    var dataSelectedVendorId = selectedVendorId;
    var dataSelectedSalesmanId = selectedSalesmanId;
    var dataColor = color;
    var dataItem = item;
    var dataReadyDate =
      readyDate != undefined
        ? new Date(readyDate).getFullYear() +
          '-' +
          (new Date(readyDate).getMonth() + 1) +
          '-' +
          new Date(readyDate).getDate()
        : undefined;
    var dataBufferReadyDate =
      readyDate != undefined
        ? new Date(bufferReadyDate).getFullYear() +
          '-' +
          (new Date(bufferReadyDate).getMonth() + 1) +
          '-' +
          new Date(bufferReadyDate).getDate()
        : undefined;
    var dataDeliveryDate =
      readyDate != undefined
        ? new Date(deliveryDate).getFullYear() +
          '-' +
          (new Date(deliveryDate).getMonth() + 1) +
          '-' +
          new Date(deliveryDate).getDate()
        : undefined;
    var dataVendorDate =
      vendorDate != undefined
        ? new Date(vendorDate).getFullYear() +
          '-' +
          (new Date(vendorDate).getMonth() + 1) +
          '-' +
          new Date(vendorDate).getDate()
        : undefined;

    var dataProductPhotoData =
      Object.values(productPhotoData[0].name).length > 0
        ? productPhotoData[0].name
        : '';
    var dataProductMeasurementData =
      Object.values(productMeasurementData[0].name).length > 0
        ? productMeasurementData[0].name
        : '';
    var dataProductOriginalMeasurement =
      Object.values(productOriginalMeasurement[0].name).length > 0
        ? productOriginalMeasurement[0].name
        : '';
    var dataProductUploadSlip =
      Object.values(productSlipPhoto[0].name).length > 0
        ? productSlipPhoto[0].name
        : '';
    var dataProductVideoData =
      Object.values(productVideoData).length > 0
        ? productVideoData[0].fileName
        : '';

    if (
      dataOrder_number != '' &&
      dataOrder_number != undefined &&
      dataSelectedVendorId != '' &&
      dataSelectedVendorId != undefined &&
      dataSelectedSalesmanId != '' &&
      dataSelectedSalesmanId != undefined &&
      dataColor != '' &&
      dataColor != undefined &&
      dataItem != '' &&
      dataItem != undefined &&
      dataReadyDate != '' &&
      dataReadyDate != undefined &&
      dataBufferReadyDate != '' &&
      dataBufferReadyDate != undefined &&
      dataDeliveryDate != '' &&
      dataDeliveryDate != undefined &&
      dataProductPhotoData != '' &&
      dataProductPhotoData != undefined
    ) {
      setActivityIndicator(true);

      let data = new FormData();
      data.append('order_number', dataOrder_number);
      data.append('vendor', dataSelectedVendorId);
      data.append('salesman', dataSelectedSalesmanId);
      data.append('api_token', apitoken);
      data.append('color', dataColor);
      data.append('vd_code', vdCode);
      data.append('design_number', designNumber);
      data.append('item', dataItem);
      data.append('ready_date', dataReadyDate);
      data.append('buffered_ready_date', dataBufferReadyDate);
      data.append('delivery_date', dataDeliveryDate);
      data.append('orderedBy', apitoken);
      data.append('barcode', barcode);
      data.append('vendor_date', dataVendorDate);
      data.append('pickup_shipping', pickup);
      data.append('order_sheet_to_vendor', orderSheetToVendor == 'Yes' ? 1 : 0);
      data.append('sample_choli', sampleCholi == 'Yes' ? 1 : 0);
      data.append('customer_name', customerName);
      data.append('customer_mobile', mobile);
      data.append('customer_address', address);
      data.append('customer_city', city);
      // Attach file
      data.append('product_photo', dataProductPhotoData);
      data.append('product_measurement', dataProductMeasurementData);
      if (dataProductVideoData != '') {
        data.append('product_video', dataProductVideoData);
      }
      data.append(
        'product_original_measurement',
        dataProductOriginalMeasurement,
      );
      data.append('product_slip_number', dataProductUploadSlip);

      let ress = await fetch('http://3.143.116.199/public/api/orders/create', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      });
      console.log('i am here ', JSON.stringify(ress));
      let response = await ress
        .json()
        .then(res => console.log(JSON.stringify(res)))
        .catch(err => console.log(JSON.stringify(err)));
      console.log('response');
      console.log(response);
      if (response.data.status == true || response.data.status == 'true') {
        console.log('------> order created');
        defaultTimeInterval = 5;
        interval = setInterval(function () {
          if (current < 98) {
            // let ndInt = Math.floor(Math.random() * 10) + 1;
            let ndInt = 25;
            current += ndInt;
            if (current > 20) {
              setGeneratingMessage('Uploading Attachments...' + current + '%');

              if (
                dataProductPhotoData != undefined &&
                dataProductPhotoData != ''
              ) {
                if (S3ProductImageUpload == true) {
                  setAllAttachmentUpload(true);
                } else {
                  setAllAttachmentUpload(false);
                }
              }
              if (
                dataProductMeasurementData != undefined &&
                dataProductMeasurementData != ''
              ) {
                if (S3ProductMeasurementUpload == true) {
                  setAllAttachmentUpload(true);
                } else {
                  setAllAttachmentUpload(false);
                }
              }
              if (
                dataProductVideoData != undefined &&
                dataProductVideoData != ''
              ) {
                if (S3ProductVideoUpload == true) {
                  setAllAttachmentUpload(true);
                } else {
                  setAllAttachmentUpload(false);
                }
              }

              if (allAttachmentUpload == true) {
                console.log('i am here');
                // showToast('Order generated');
                // navigation.push('orderlist');
                // setActivityIndicator(false)
              }
            }
          }
          if (current > 97) {
            setGeneratingMessage('Almost done...');
            clearInterval(interval);
            showToast('Order generated');
            navigation.push('Home');
            setActivityIndicator(false);
          }
        }, defaultTimeInterval);
      } else {
        clearInterval(interval);

        showToast('error');
        setActivityIndicator(false);
      }
    } else {
      showToast('Required fields are missing');
    }

    // if( order_number != '' && order_number != undefined && selectedVendorId != '' && selectedVendorId != undefined && selectedSalesmanId != '' && selectedSalesmanId != undefined && color != '' && color != undefined && item != '' && item != undefined && readyDate != '' && readyDate != undefined && deliveryDate != '' && deliveryDate != undefined ){
    // 	if(productPhotoData.length > 0 && productMeasurementData.length > 0){
    // 		// networkSpeed.startListenNetworkSpeed(({downLoadSpeed,downLoadSpeedCurrent,upLoadSpeed,upLoadSpeedCurrent}) => {
    // 		// 	// console.log(downLoadSpeed + 'kb/s')
    // 		// 	// console.log(downLoadSpeedCurrent + 'kb/s')
    // 		// 	// console.log(upLoadSpeed + 'kb/s')
    // 		// 	setCurrentUploadingSpeed(upLoadSpeedCurrent + 'kb/s')
    // 		// })
    // 		// networkSpeed.stopListenNetworkSpeed();
    // 		setActivityIndicator(true)
    // 		let data = new FormData();
    // 		data.append('order_number', order_number);
    // 		data.append('vendor', selectedVendorId);
    // 		data.append('salesman', selectedSalesmanId);
    // 		data.append('api_token', apitoken);
    // 		data.append('color', color);
    // 		data.append('item', item);
    // 		data.append('item', item);
    // 		data.append('item', item);
    // 		// Attach file
    // 		data.append('product_photo', productPhotoData[0]);
    // 		data.append('product_measurement', productMeasurementData[0]);
    // 		data.append('product_video', productVideoData[0]);

    // 		interval = setInterval(function(){
    // 			if( current < 98 ){
    // 				let ndInt = Math.floor(Math.random() * 1) + 1;
    // 				current+=ndInt;
    // 				setGeneratingMessage('Generating Order');
    // 				if( current > 2){
    // 					setGeneratingMessage('Uploading Attachments...'+current+'%' );
    // 				}
    // 				if( current > 97 ){
    // 					setGeneratingMessage('Almost done...');
    // 				}
    // 			}else{
    // 				clearInterval(interval);
    // 				setGeneratingMessage('Almost done...');
    // 			}

    // 		}, defaultTimeInterval);

    // 		let ress = await fetch('http://3.143.116.199/public/api/orders/create', {
    // 			method: 'POST',
    // 			body: data,
    // 			headers: {
    // 				'Content-Type': 'multipart/form-data; ',
    // 			  },
    // 		});

    // 		let response = await ress.json();
    // 		console.log('response here');
    // 		console.log(response);
    // 		if(response.data.status == true || response.data.status == 'true'){
    // 			defaultTimeInterval = 50;
    // 			interval = setInterval(function(){
    // 				if( current < 98 ){
    // 					// let ndInt = Math.floor(Math.random() * 10) + 1;
    // 					let ndInt = 25;
    // 					current+=ndInt;
    // 					if( current > 20){
    // 						setGeneratingMessage('Uploading Attachments...'+current+'%' );
    // 					}

    // 				}
    // 				if( current > 97 ){
    // 					setGeneratingMessage('Almost done...');
    // 					clearInterval(interval);
    // 					showToast('Order generated');
    // 					navigation.push('orderlist');
    // 					setActivityIndicator(false)
    // 				}
    // 				// else{
    // 				// 	clearInterval(interval);
    // 				// 	setGeneratingMessage('Almost complete...');
    // 				// }

    // 			}, defaultTimeInterval);

    // 		}else{
    // 			clearInterval(interval);

    // 			showToast('error');
    // 			setActivityIndicator(false)
    // 		}
    // 	}else{
    // 		showToast('Required fields are missing');
    // 	}

    // }else{
    // 	showToast('Required fields are missing');
    // }

    return false;
  };

  const getItemList = () => {
    AsyncStorage.getItem('id')
      .then(token => {
        let postedData = {role: 'vendor', api_token: token};
        get('item/get', postedData)
          .then(res => {
            SetItemList(res.data.data.data);
            SetItemListAll(res.data.data.data);
          })
          .catch(err => {});
      })
      .catch(err => {});
  };
  const getVendorListData = () => {
    AsyncStorage.getItem('id')
      .then(async token => {
        let postedData = {role: 'vendor', api_token: token};
        // get('users/get', postedData)
        await getVendorList('vendor', token)
          .then(res => {
            SetVendorList(res.data.data);
            SetVendorListAll(res.data.data);
            // console.log(res.data.data.data);
          })
          .catch(err => {
            // console.log(err)
          });
      })
      .catch(err => {});
  };
  const getSalesmanListData = () => {
    AsyncStorage.getItem('id')
      .then(async token => {
        let postedData = {role: 'salesman', api_token: token};
        // get('users/get', postedData)
        await getSalesmanList('salesman', token)
          .then(res => {
            SetSalesmanList(res.data.data);
            SetSalesmanListAll(res.data.data);
          })
          .catch(err => {
            // console.log(err)
          });
      })
      .catch(err => {});
  };

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {}, []);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const Item = ({item}: any) => (
    <Pressable
      onPress={() => {
        setItem(item.id),
          SetSelectedItemId(item.id),
          SetSelectedItemName(item.name),
          setModalVisibleItem(false);
      }}
      style={styles.item}>
      <View style={[{}, flexDirectionRow]}>
        <View style={[marginRight10, {width: '100%', overflow: 'hidden'}]}>
          <View style={[{}, flexDirectionRow]}>
            <Text style={[{fontWeight: 'bold'}, h5, marginRight10]}>
              {item.name}
            </Text>
            <Text style={[{marginTop: 0}, h5]}>{item.order_number}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
  const VendorItem = ({item}: any) => (
    <Pressable
      onPress={() => {
        SetSelectedVendorId(item.id),
          SetSelectedVendorName(item.name),
          setModalVisibleVendor(false);
      }}
      style={styles.item}>
      <View style={[{}, flexDirectionRow]}>
        <View style={[marginRight10, {width: '100%', overflow: 'hidden'}]}>
          <View style={[{}, flexDirectionRow]}>
            <Text style={[{fontWeight: 'bold'}, h5, marginRight10]}>
              {item.name}
            </Text>
            <Text style={[{marginTop: 0}, h5]}>{item.order_number}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
  const SalesmanListItem = ({item}: any) => (
    <Pressable
      onPress={() => {
        console.log(item),
          SetSelectedSalesmanId(item.id),
          SetSelectedSalesmanName(item.name),
          setModalVisibleSalesman(false);
      }}
      style={styles.item}>
      <View style={[{}, flexDirectionRow]}>
        <View style={[marginRight10, {width: '100%', overflow: 'hidden'}]}>
          <View style={[{}, flexDirectionRow]}>
            <Text style={[{fontWeight: 'bold'}, h5, marginRight10]}>
              {item.name}
            </Text>
            <Text style={[{marginTop: 0}, h5]}>{item.order_number}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const getAddedDate = numberOfDaysToAdd => {
    var someDate = new Date();
    var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    // console.log(new Date(result))
    return new Date(result);
  };
  const openReadyDate = () => {
    setshowReadyDate(true);
    setShowDeliveryDate(false);
    setShowBufferReadyDate(false);
    setShowVendorDate(false);
  };
  const openBufferReadyDate = () => {
    setshowReadyDate(false);
    setShowDeliveryDate(false);
    setShowBufferReadyDate(true);
    setShowVendorDate(false);
  };
  const openDeliveryDate = () => {
    setshowReadyDate(false);
    setShowDeliveryDate(true);
    setShowBufferReadyDate(false);
    setShowVendorDate(false);
  };

  const openVendorData = () => {
    setShowVendorDate(true);
    setshowReadyDate(false);
    setShowDeliveryDate(false);
    setShowBufferReadyDate(false);
  };
  const searchItem = searchedValue => {
    console.log();
    if (searchedValue.length > 0) {
      let newSearchableArray = [];
      if (ItemList.length > 0) {
        ItemList.filter(list => {
          let searchableLowercase = list.name.toLowerCase();
          if (searchableLowercase.includes(searchedValue.toLowerCase())) {
            newSearchableArray.push(list);
          }
        });
        SetItemList(newSearchableArray);
      }
    } else {
      SetItemList(ItemListAll);
    }

    // vendorList.filter
    // console.log(searchedValue);
  };
  const searchVendor = searchedValue => {
    console.log();
    if (searchedValue.length > 0) {
      let newSearchableArray = [];
      if (vendorList.length > 0) {
        vendorList.filter(list => {
          let searchableLowercase = list.name.toLowerCase();
          if (searchableLowercase.includes(searchedValue.toLowerCase())) {
            newSearchableArray.push(list);
          }
        });
        SetVendorList(newSearchableArray);
      }
    } else {
      SetVendorList(vendorListAll);
    }

    // vendorList.filter
    // console.log(searchedValue);
  };
  const searchSalesman = searchedValue => {
    console.log();
    if (searchedValue.length > 0) {
      let newSearchableArray = [];
      if (salesmanList.length > 0) {
        salesmanList.filter(list => {
          let searchableLowercase = list.name.toLowerCase();
          if (searchableLowercase.includes(searchedValue.toLowerCase())) {
            newSearchableArray.push(list);
          }
        });
        SetSalesmanList(newSearchableArray);
      }
    } else {
      SetSalesmanList(salesmanListAll);
    }

    // vendorList.filter
    // console.log(searchedValue);
  };
  const uploadFileToS3 = async (
    ImageURI,
    filename,
    fileSize,
    type,
    variant,
  ) => {
    console.log('type');
    console.log(type);
    setuploadingAttachment(true);
    const fileUri = ImageURI; // File path on the device
    const fileName = filename; // Unique name for the file on S3

    const s3 = new S3({
      region: 'us-east-2',
      accessKeyId: 'AKIA2OM62YUJYMJ6PT2E',
      secretAccessKey: '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',
    });
    const file = {
      uri: fileUri,
      name: fileName,
      type: type,
    };

    const options = {
      keyPrefix: '/',
      bucket: 'uploadbygulluapp',
      region: 'us-east-2',
      accessKey: 'AKIA2OM62YUJYMJ6PT2E',
      secretKey: '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',
      successActionStatus: 201,
    };

    RNS3.put(file, options).then(response => {
      console.log(response);
      if (response.status !== 201) {
        throw new Error('Failed to upload image to S3');
      } else {
        setuploadingAttachment(false);
        if (variant == 'productImage') {
          setS3ProductImageUpload(true);
        }
        if (variant == 'productMeasurement') {
          setS3ProductMeasurementUpload(true);
        }
        if (variant == 'productVideo') {
          setS3ProductVideoUpload(true);
        }
        if (variant == 'Product Original Measurement') {
          setS3ProductOriginalMeasurementUpload(true);
        }
        if (variant == 'Product Slip Number') {
          setS3ProductSlipUpload(true);
        }
      }

      console.log(response.body);
      /**
       * {
       *   postResponse: {
       *     bucket: "your-bucket",
       *     etag : "9f620878e06d28774406017480a59fd4",
       *     key: "uploads/image.png",
       *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
       *   }
       * }
       */
    });
    return false;
    const uploadParams = {
      Bucket: 'uploadbygulluapp',
      Key: `${file.name}`,
      Body: JSON.stringify(file),
    };

    try {
      await s3
        .putObject(uploadParams)
        .promise()
        .then(data => {
          console.log(data);
        });
      console.log(file);
      console.log('Image uploaded successfully!');
      setuploadingAttachment(false);
    } catch (error) {
      console.log('Error uploading image:', error);
    }

    return false;

    // const fileData = await RNFS.readFile(fileUri, 'base64');
    // const contentType = 'jpeg'; // Adjust the content type based on your file type

    // const params = {
    //   Bucket: 'uploadbygulluapp',
    //   Key: fileName,
    //   Body: fileData,
    //   ContentType: contentType,
    //   // ACL: 'public-read', // Adjust the access control policy as needed
    // };
    // const s3 = new S3({
    //   region: 'us-east-2',
    //   accessKeyId: 'AKIA2OM62YUJYMJ6PT2E',
    //   secretAccessKey: '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',
    // });

    // s3.upload(params, (err, data) => {
    //   if (err) {
    //     console.log('S3 upload error:', err);
    //   } else {
    //     // getFileFromS3();
    //     setuploadingAttachment(false)
    //     if (variant == 'productImage') {
    //       setS3ProductImageUpload(true)
    //     }
    //     if (variant == 'productMeasurement') {
    //       setS3ProductMeasurementUpload(true)
    //     }
    //     if (variant == 'productVideo') {
    //       setS3ProductVideoUpload(true)
    //     }
    //     console.log('S3 upload success:', data);
    //   }
    // });
  };
  const getFileFromS3 = async () => {
    const params = {
      Bucket: 'uploadbygulluapp',
      Key: 'IMG-20230518-WA0003.jpg',
    };
    const s3 = new S3({
      region: 'us-east-2',
      accessKeyId: 'AKIA2OM62YUJYMJ6PT2E',
      secretAccessKey: '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',
    });
    try {
      const response = await s3.getObject(params).promise();
      console.log('response');
      console.log(response.Body?.toString());
      // Process the response as needed
      return response.Body.toString();
    } catch (error) {
      console.error('Error retrieving file from S3:', error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.orderCreateBaseContainer}>
      <View style={styles.orderCreateHeaderBaseContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.orderCreateNavbarContainer}>
        <NavBarComponent
          title="Create Order"
          titleColor={COLOR.baseColor}
          navigation={navigation}
        />
      </View>
      <View style={styles.orderCreateContentContainer}>
        <ScrollView
          contentContainerStyle={styles.orderCreateContentListContainer}>
          <InputComponents
            placeholder="Order Number"
            onChangeText={(value: any) => {
              setOrderNumber(value);
            }}
            style={inputStyleBlack}
          />
          <InputComponents
            placeholder="Barcode"
            value={barcode}
            onChangeText={(value: any) => {
              setBarcode(value);
            }}
            style={inputStyleBlack}
          />

          {/* <InputComponents placeholder="Select Vendor" onChangeText={(value:any) => { setVendor(value) }} style={inputStyleBlack} />
    					<InputComponents placeholder="Select Salesman" onChangeText={(value:any) => { setSalesman(value) }} style={inputStyleBlack} /> */}
          <InputComponents
            placeholder="VD Code"
            onChangeText={(value: any) => {
              setVDcode(value);
            }}
            style={inputStyleBlack}
          />
          <InputComponents
            placeholder="Color"
            onChangeText={(value: any) => {
              setColor(value);
            }}
            style={inputStyleBlack}
          />

          <InputComponents
            placeholder="Design Number"
            onChangeText={(value: any) => {
              setDesignNumber(value);
            }}
            style={inputStyleBlack}
          />

          {/* <InputComponents placeholder="Item" onChangeText={(value:any) => { setItem(value) }} style={inputStyleBlack} /> */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleItem}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisibleItem(!modalVisibleItem);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{paddingBottom: 10}}>
                  <Text style={{color: COLOR.whiteColor}}>Select Item</Text>
                </View>
                <View style={{width: '100%'}}>
                  <InputComponents
                    placeholder="Search Item"
                    onChangeText={(value: any) => {
                      searchItem(value);
                    }}
                    style={inputStyleBlack}
                  />
                </View>
                <FlatList
                  data={ItemList}
                  renderItem={({item}) => {
                    return (
                      <View>
                        <Item item={item} />
                      </View>
                    );
                  }}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisibleItem(!modalVisibleItem)}>
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleVendor}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisibleVendor(!modalVisibleVendor);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{paddingBottom: 10}}>
                  <Text>Select Vendor</Text>
                </View>
                <View style={{width: '100%'}}>
                  <InputComponents
                    placeholder="Search Vendor"
                    onChangeText={(value: any) => {
                      searchVendor(value);
                    }}
                    style={inputStyleBlack}
                  />
                </View>
                <FlatList
                  data={vendorList}
                  renderItem={({item}) => {
                    return (
                      <View>
                        <VendorItem item={item} />
                      </View>
                    );
                  }}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisibleVendor(!modalVisibleVendor)}>
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleSalesman}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisibleSalesman(!modalVisibleSalesman);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{paddingBottom: 10}}>
                  <Text>Select Salesman</Text>
                </View>
                <View style={{width: '100%'}}>
                  <InputComponents
                    placeholder="Search Vendor"
                    onChangeText={(value: any) => {
                      searchSalesman(value);
                    }}
                    style={inputStyleBlack}
                  />
                </View>
                <FlatList
                  data={salesmanList}
                  renderItem={({item}) => <SalesmanListItem item={item} />}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() =>
                    setModalVisibleSalesman(!modalVisibleSalesman)
                  }>
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={{
                  backgroundColor: gulluColor,
                  padding: 20,
                  borderRadius: 10,
                  width: '50%',
                  marginBottom: 10,
                }}
                onPress={() => setModalVisibleItem(true)}>
                <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                  Select Item
                </Text>
              </Pressable>

              <Text
                style={[
                  {paddingVertical: 16, textTransform: 'capitalize'},
                  h4,
                  marginLeft10,
                  {color: gulluColor},
                ]}>
                {selectedItemName}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={{
                  backgroundColor: gulluColor,
                  padding: 20,
                  borderRadius: 10,
                  width: '50%',
                  marginBottom: 10,
                }}
                onPress={() => setModalVisibleVendor(true)}>
                <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                  Select Vendor
                </Text>
              </Pressable>

              <Text
                style={[
                  {paddingVertical: 16, textTransform: 'capitalize'},
                  h4,
                  marginLeft10,
                  {color: gulluColor},
                ]}>
                {selectedVendorName}
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={{
                  backgroundColor: gulluColor,
                  padding: 20,
                  borderRadius: 10,
                  width: '50%',
                }}
                onPress={() => setModalVisibleSalesman(true)}>
                <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                  Select Salesman
                </Text>
              </Pressable>
              <Text
                style={[
                  {paddingVertical: 16, textTransform: 'capitalize'},
                  h4,
                  marginLeft10,
                  {color: gulluColor},
                ]}>
                {selectedSalesmanName}
              </Text>
            </View>
          </View>

          {showReadyDate ? (
            <View>
              <DatePicker
                style={{width: 200}}
                date={getAddedDate(3)}
                value={getAddedDate(3)}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate={new Date()}
                maxDate="2050-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                }}
                onChange={date => {
                  setshowReadyDate(false),
                    SetReadyDate(new Date(date.nativeEvent.timestamp));
                }}
                onDateChange={date => {
                  console.log(date);
                }}
              />
            </View>
          ) : null}

          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                onPress={() => openReadyDate()}
                style={{
                  backgroundColor: gulluColor,
                  padding: 20,
                  borderRadius: 10,
                  width: '50%',
                  marginBottom: 10,
                }}>
                <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                  Select Ready Date{' '}
                </Text>
              </Pressable>
              {readyDate != undefined ? (
                <View>
                  <Text
                    style={[
                      {paddingVertical: 16, textTransform: 'capitalize'},
                      h4,
                      marginLeft10,
                      {color: gulluColor},
                    ]}>
                    {readyDate.toString().substring(4, 15)}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={{flexDirection: 'row'}}>
              <Pressable
                onPress={() => openBufferReadyDate()}
                style={{
                  backgroundColor: gulluColor,
                  padding: 20,
                  borderRadius: 10,
                  width: '50%',
                  marginBottom: 10,
                }}>
                <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                  Buffer Ready Date{' '}
                </Text>
              </Pressable>
              {bufferReadyDate != undefined ? (
                <View>
                  <Text
                    style={[
                      {paddingVertical: 16, textTransform: 'capitalize'},
                      h4,
                      marginLeft10,
                      {color: gulluColor},
                    ]}>
                    {bufferReadyDate.toString().substring(4, 15)}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={{flexDirection: 'row'}}>
              <Pressable
                onPress={() => openDeliveryDate()}
                style={{
                  backgroundColor: gulluColor,
                  padding: 20,
                  borderRadius: 10,
                  width: '50%',
                }}>
                <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                  Select Delivery Date
                </Text>
              </Pressable>
              {deliveryDate != undefined ? (
                <View>
                  <Text
                    style={[
                      {paddingVertical: 16, textTransform: 'capitalize'},
                      h4,
                      marginLeft10,
                      {color: gulluColor},
                    ]}>
                    {deliveryDate.toString().substring(4, 15)}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Pressable
                onPress={() => openVendorData()}
                style={{
                  backgroundColor: gulluColor,
                  padding: 20,
                  borderRadius: 10,
                  width: '50%',
                }}>
                <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                  Select Vendor Date
                </Text>
              </Pressable>
              {vendorDate != undefined ? (
                <View>
                  <Text
                    style={[
                      {paddingVertical: 16, textTransform: 'capitalize'},
                      h4,
                      marginLeft10,
                      {color: gulluColor},
                    ]}>
                    {vendorDate.toString().substring(4, 15)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {showDeliveryDate ? (
            <DatePicker
              style={{width: 200}}
              date={getAddedDate(6)}
              value={getAddedDate(6)}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate={new Date()}
              maxDate="2050-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onChange={date => {
                setShowDeliveryDate(false),
                  SetDeliveryDate(new Date(date.nativeEvent.timestamp));
              }}
              onDateChange={date => {
                console.log(date);
              }}
            />
          ) : null}
          {showVendorDate ? (
            <DatePicker
              style={{width: 200}}
              date={getAddedDate(6)}
              value={getAddedDate(6)}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate={new Date()}
              maxDate="2050-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onChange={date => {
                setShowVendorDate(false),
                  SetVendorDate(new Date(date.nativeEvent.timestamp));
              }}
              onDateChange={date => {
                console.log(date);
              }}
            />
          ) : null}
          {showBufferReadyDate ? (
            <DatePicker
              style={{width: 200}}
              date={getAddedDate(6)}
              value={getAddedDate(6)}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate={new Date()}
              maxDate="2050-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onChange={date => {
                setShowBufferReadyDate(false),
                  SetBufferReadyDate(new Date(date.nativeEvent.timestamp));
              }}
              onDateChange={date => {
                console.log(date);
              }}
            />
          ) : null}

          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: COLOR.blackColor,
              }}>
              Sample Choli
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <RadioGroup
                radioButtons={radioButtonsSampleCholi}
                selectedId={sampleCholi}
                onPress={e => {
                  setSampleCholi(e);
                }}
                containerStyle={{flexDirection: 'row'}}
              />
            </View>
          </View>

          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: COLOR.blackColor,
              }}>
              Pickup / Shipping
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: 10,
              }}>
              <RadioGroup
                radioButtons={radioButtonsPickup}
                selectedId={pickup}
                onPress={e => {
                  setPickup(e);
                }}
                containerStyle={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              />
            </View>
          </View>

          <View style={{gap: 20}}>
            <InputComponents
              placeholder="Customer Name"
              value={customerName}
              onChangeText={(text: string) => setCustomerName(text)}
            />
            <InputComponents
              placeholder="Mobile Number"
              value={mobile}
              onChangeText={(text: string) => setMobile(text)}
            />
            <InputComponents
              placeholder="Address"
              value={address}
              onChangeText={(text: string) => setAddress(text)}
            />
            <InputComponents
              placeholder="City"
              value={city}
              onChangeText={(text: string) => setCity(text)}
            />
          </View>

          <View style={{paddingHorizontal: 20}}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const pickerResult = await DocumentPicker.pick({
                    presentationStyle: 'fullScreen',
                    copyTo: 'cachesDirectory',
                    type: [types.images],
                  });

                  let sourceUri = pickerResult[0].fileCopyUri;
                  uploadFileToS3(
                    sourceUri,
                    pickerResult[0]['name'],
                    pickerResult[0].size,
                    pickerResult[0].type,
                    'productImage',
                  );

                  setPrductPhotoType(pickerResult[0].type);
                  setPrductPhotoData(pickerResult);
                  // if(pickerResult[0].size <= 2000000){
                  // 	setPrductPhotoType(pickerResult[0].type);
                  // 	setPrductPhotoData(pickerResult)
                  // }else{
                  // 	showToast('Image should be less than 2MB');
                  // }
                } catch (e) {
                  handleError(e);
                }
              }}
              style={[
                {
                  width: 'auto',
                  backgroundColor: gulluColor,
                  borderRadius: 10,
                  marginBottom: 10,
                },
                padding15,
                justifyContentCenter,
              ]}>
              <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                Upload Product Image
              </Text>
            </TouchableOpacity>

            {productPhotoData != undefined && productPhotoData.length > 0 ? (
              <View style={{height: 200, width: 200}}>
                <ImageBackground
                  source={{uri: productPhotoData[0].fileCopyUri}}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="center"></ImageBackground>
              </View>
            ) : // <Image source={{uri:productPhotoData[0].fileCopyUri}} style={{ height: 200,width: 200 }}/>
            null}
            <TouchableOpacity
              onPress={async () => {
                try {
                  const pickerResult = await DocumentPicker.pick({
                    presentationStyle: 'fullScreen',
                    copyTo: 'cachesDirectory',
                    type: [types.images],
                  });
                  setPrductMeasureType(pickerResult[0].type);
                  setPrductMeasurementData(pickerResult);

                  console.log('i am here');
                  console.log(pickerResult[0]);
                  let sourceUri = pickerResult[0].fileCopyUri;

                  // const fileData = {
                  // 	uri: sourceUri,
                  // 	name: pickerResult[0]['name'],
                  // 	type: pickerResult[0].type,
                  // }
                  // const options = {
                  // 	bucket : 'uploadbygulluapp',
                  // 	region: 'us-east-2',
                  // 	accessKey: 'AKIA2OM62YUJYMJ6PT2E',
                  // 	secretKey: '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',
                  // 	successActionStatus : 201
                  // }
                  uploadFileToS3(
                    sourceUri,
                    pickerResult[0]['name'],
                    pickerResult[0].size,
                    pickerResult[0].type,
                    'productMeasurement',
                  );

                  // if(pickerResult[0].size <= 2000000){
                  // 	setPrductMeasureType(pickerResult[0].type);
                  // 	setPrductMeasurementData(pickerResult)
                  // }else{
                  // 	showToast('Image should be less than 2MB');
                  // }
                } catch (e) {
                  handleError(e);
                }
              }}
              style={[
                {
                  width: 'auto',
                  backgroundColor: gulluColor,
                  borderRadius: 10,
                  marginBottom: 10,
                },
                padding15,
                justifyContentCenter,
              ]}>
              <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                Upload Product Measurement
              </Text>
            </TouchableOpacity>

            {productMeasurementData != undefined &&
            productMeasurementData.length > 0 ? (
              <View style={{height: 200, width: 200}}>
                <ImageBackground
                  source={{uri: productMeasurementData[0].fileCopyUri}}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="center"></ImageBackground>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={async () => {
                try {
                  const pickerResult = await DocumentPicker.pick({
                    presentationStyle: 'fullScreen',
                    copyTo: 'cachesDirectory',
                    type: [types.images],
                  });
                  setPrductMeasureType(pickerResult[0].type);
                  setProductOriginalMeasurement(pickerResult);

                  console.log('i am here');
                  console.log(pickerResult[0]);
                  let sourceUri = pickerResult[0].fileCopyUri;

                  // const fileData = {
                  // 	uri: sourceUri,
                  // 	name: pickerResult[0]['name'],
                  // 	type: pickerResult[0].type,
                  // }
                  // const options = {
                  // 	bucket : 'uploadbygulluapp',
                  // 	region: 'us-east-2',
                  // 	accessKey: 'AKIA2OM62YUJYMJ6PT2E',
                  // 	secretKey: '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',
                  // 	successActionStatus : 201
                  // }
                  uploadFileToS3(
                    sourceUri,
                    pickerResult[0]['name'],
                    pickerResult[0].size,
                    pickerResult[0].type,
                    'Product Original Measurement',
                  );

                  // if(pickerResult[0].size <= 2000000){
                  // 	setPrductMeasureType(pickerResult[0].type);
                  // 	setPrductMeasurementData(pickerResult)
                  // }else{
                  // 	showToast('Image should be less than 2MB');
                  // }
                } catch (e) {
                  handleError(e);
                }
              }}
              style={[
                {
                  width: 'auto',
                  backgroundColor: gulluColor,
                  borderRadius: 10,
                  marginBottom: 10,
                },
                padding15,
                justifyContentCenter,
              ]}>
              <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                Upload Original Measurement
              </Text>
            </TouchableOpacity>

            {productOriginalMeasurement != undefined &&
            productOriginalMeasurement.length > 0 ? (
              <View style={{height: 200, width: 200}}>
                <ImageBackground
                  source={{uri: productOriginalMeasurement[0].fileCopyUri}}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="center"></ImageBackground>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={async () => {
                try {
                  const pickerResult = await DocumentPicker.pick({
                    presentationStyle: 'fullScreen',
                    copyTo: 'cachesDirectory',
                    type: [types.images],
                  });
                  // setPrductMeasureType(pickerResult[0].type);
                  setProductSlipPhoto(pickerResult);

                  console.log('i am here');
                  console.log(pickerResult[0]);
                  let sourceUri = pickerResult[0].fileCopyUri;

                  // const fileData = {
                  // 	uri: sourceUri,
                  // 	name: pickerResult[0]['name'],
                  // 	type: pickerResult[0].type,
                  // }
                  // const options = {
                  // 	bucket : 'uploadbygulluapp',
                  // 	region: 'us-east-2',
                  // 	accessKey: 'AKIA2OM62YUJYMJ6PT2E',
                  // 	secretKey: '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',
                  // 	successActionStatus : 201
                  // }
                  uploadFileToS3(
                    sourceUri,
                    pickerResult[0]['name'],
                    pickerResult[0].size,
                    pickerResult[0].type,
                    'Product Slip Number',
                  );

                  // if(pickerResult[0].size <= 2000000){
                  // 	setPrductMeasureType(pickerResult[0].type);
                  // 	setPrductMeasurementData(pickerResult)
                  // }else{
                  // 	showToast('Image should be less than 2MB');
                  // }
                } catch (e) {
                  handleError(e);
                }
              }}
              style={[
                {
                  width: 'auto',
                  backgroundColor: gulluColor,
                  borderRadius: 10,
                  marginBottom: 10,
                },
                padding15,
                justifyContentCenter,
              ]}>
              <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                Upload Slip Photo
              </Text>
            </TouchableOpacity>

            {productSlipPhoto != undefined && productSlipPhoto.length > 0 ? (
              <View style={{height: 200, width: 200}}>
                <ImageBackground
                  source={{uri: productSlipPhoto[0].fileCopyUri}}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="center"></ImageBackground>
              </View>
            ) : null}

            {/* <TouchableOpacity
    							onPress={async () => {
    							try {
    								const pickerResult = await DocumentPicker.pick({
    									presentationStyle: 'fullScreen',
    									copyTo: 'cachesDirectory',

    									type: [types.video],

    								});
    								console.log("i am here");
    								console.log(pickerResult[0]);
    								let sourceUri = pickerResult[0].fileCopyUri;

    								// const fileData = {
    								// 	uri: sourceUri,
    								// 	name: pickerResult[0]['name'],
    								// 	type: pickerResult[0].type,
    								// }
    								// const options = {
    								// 	bucket : 'uploadbygulluapp',
    								// 	region: 'us-east-2',
    								// 	accessKey: 'AKIA2OM62YUJYMJ6PT2E',
    								// 	secretKey: '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',
    								// 	successActionStatus : 201
    								// }
    								uploadFileToS3(sourceUri , pickerResult[0]['name'] , pickerResult[0].size , pickerResult[0].type , 'productVideo');
    								// RNS3.put(fileData , options).progress((progress) =>{
    								// 	console.log(progress)
    								// }).then((successResponse) => {
    								// 	console.log(successResponse)
    								// }).catch((err) => {
    								// 	console.log(err)
    								// });

    								// RNVideoHelper.compress(sourceUri, {
    								// 	startTime: 10, // optional, in seconds, defaults to 0
    								// 	endTime: 100, //  optional, in seconds, defaults to video duration
    								// 	quality: 'low', // default low, can be medium or high
    								// 	defaultOrientation: 0 // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
    								// }).progress(value => {
    								// 	console.warn('progress', value); // Int with progress value from 0 to 1
    								// }).then(compressedUri => {
    								// 	console.warn('compressedUri', 'file:///'+compressedUri); // String with path to temporary compressed video
    								// 	// let fileEXT = getFileInfo('file:///'+compressedUri);

    								// 	RNFetchBlob.fs.stat('file:///'+compressedUri)

    								// 	.then((stats) => {
    								// 		console.log(stats)
    								// 	})
    								// 	.catch((err) => {
    								// 		console.log(err);
    								// 	})

    								// 	// setProductVideoData(pickerResult);
    								// });

    								setPrductVideoType(pickerResult[0].type);
    								setProductVideoData(pickerResult);

    								// if( pickerResult[0].size <= 5000000 ){
    								// 	setPrductVideoType(pickerResult[0].type);
    								// 	setProductVideoData(pickerResult);
    								// }else{
    								// 	showToast('Max file upload size is 5MB');
    								// }
    							} catch (e) {
    								handleError(e)
    							}
    							}}
    							style={[{width: 'auto',backgroundColor: gulluColor,borderRadius: 10,marginBottom: 10},padding15,justifyContentCenter]}
    						>
    							<Text style={{color: goldenColor,textAlign: 'center'}}>Upload Product Video</Text>
    						</TouchableOpacity> */}

            <View style={styles.container}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                {/* <Camera /> */}
                {/* <TouchableOpacity onPress={} style={styles.capture}>
    									<Text style={{ fontSize: 14 }}> SNAP </Text>
    								</TouchableOpacity> */}
              </View>
            </View>

            <TouchableOpacity
              style={[
                {
                  width: 'auto',
                  backgroundColor: gulluColor,
                  borderRadius: 10,
                  marginBottom: 10,
                },
                padding15,
                justifyContentCenter,
              ]}
              onPress={() => chooseFile('video')}>
              <Text style={{color: COLOR.whiteColor, textAlign: 'center'}}>
                Choose Video
              </Text>
            </TouchableOpacity>
            {productVideoData != undefined && productVideoData.length > 0 ? (
              <View style={{width: '100%', height: 400}}>
                <Video
                  source={{uri: productVideoData[0].uri}}
                  style={styles.backgroundVideo}
                  controls={false}
                  ref={ref => (videoPlayer.current = ref)}
                  resizeMode={'contain'}
                  paused={false}
                  muted={true}
                />
              </View>
            ) : null}
          </View>

          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: COLOR.blackColor,
              }}>
              Order Sheet To Vendor
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: 10,
              }}>
              <RadioGroup
                radioButtons={radioButtonsOrderSheetToVendor}
                selectedId={orderSheetToVendor}
                onPress={e => {
                  setOrderSheetToVendor(e);
                }}
                containerStyle={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              />
            </View>
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                saveOrder();
              }}
              style={[
                {
                  width: 'auto',
                  backgroundColor: gulluColor,
                  borderRadius: 10,
                },
                padding15,
                justifyContentCenter,
              ]}>
              <Text style={[h3, {color: COLOR.whiteColor}, textAlignCenter]}>
                Generate New Order
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  orderCreateBaseContainer: {
    flex: 1,
  },
  orderCreateHeaderBaseContainer: {
    flex: 0.09,
  },
  orderCreateNavbarContainer: {
    flex: 0.1,
  },
  orderCreateContentContainer: {
    flex: 0.85,
  },
  orderCreateContentListContainer: {
    padding: 20,
    gap: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },

  item: {
    backgroundColor: secondaryBackgroundColor,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },

  backgroundVideo: {
    //   position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderColor: secondaryBackgroundColor,
    borderWidth: 1,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: secondaryBackgroundColor,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  centeredView: {
    flex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    borderColor: '#ededed',
    borderWidth: 2,
    margin: 20,
    width: '80%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default memo(OrderCreate);
