import React, {memo, useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Alert,
  Modal,
  useColorScheme,
  View,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  flexDirectionRow,
  h4,
  h5,
  height100,
  height9,
  justifyContentCenter,
  marginRight10,
  marginTop10,
  padding10,
  secondaryBackgroundColor,
  gulluColor,
  primaryGulluLightBackgroundColor,
  height8,
  height83,
  gulluFont,
} from '../assets/styles';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import {readFile} from 'react-native-fs';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {imagePath} from '../services/Client';
import {get, showToast} from '../services/services';
import RNFetchBlob from 'rn-fetch-blob';
import {RNS3} from 'react-native-s3-upload';
import {S3} from 'aws-sdk';
import {launchImageLibrary} from 'react-native-image-picker';

function OrderEdit({navigation, route}): JSX.Element {
  const [item, setItem] = useState();
  const [role, setRole] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleImage, setModalVisibleImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [loadStart, setLoadStart] = useState(false);
  const [S3ProductImageUpload, setS3ProductImageUpload] = useState(false);
  const [product_video_type, setPrductVideoType] = useState('');
  const [productVideoData, setProductVideoData] = useState({});

  const [productPhoto, setProductPhoto] = useState();
  const [productMeasurement, setProductMeasurement] = useState();
  const [productVideo, setProductVideo] = useState();
  const [UplaodedImage, setUplaodedImage] = useState();
  const [showBox, setShowBox] = useState(true);
  const [uploadingAttachment, setuploadingAttachment] = useState(false);

  const videoPlayer = React.useRef();

  async function getUriToBase64(uri) {
    const base64String = await readFile(uri, 'base64');
    return base64String;
  }
  const showConfirmDialog = orderId => {
    return Alert.alert(
      'Are your sure?',
      'Are you sure you want to delete this order...?',
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            console.log('deleted');
            deleteOrder(orderId);
            setShowBox(false);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'No',
        },
      ],
    );
  };
  useEffect(() => {
    if (!dataUpdated) {
      let orderData = route.params.orderData['attachments'];
      console.log(route.params.orderData);
      setItem(route.params.orderData);
    }

    AsyncStorage.getItem('id')
      .then(token => {
        // console.log(token);
      })
      .catch(err => {});
    AsyncStorage.getItem('role')
      .then(role => {
        setRole(role);
      })
      .catch(err => {});
  }, []);

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
      console.log('response 143');
      console.log(response);
      if (response.status !== 201) {
        throw new Error('Failed to upload image to S3');
      } else {
        setuploadingAttachment(false);
        updateDeliveredImageAndStatus(3, fileName);
        setUplaodedImage(imagePath + '/' + fileName);
      }
    });
    return false;
  };
  const uploadDeliveredProductImage = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 0.5,
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
          'deliveredProduct',
        );
      } else {
        showToast('Max Video upload size is 30MB.');
      }
    });
  };
  const updateOrder = status => {
    setLoader(true);
    AsyncStorage.getItem('id')
      .then(token => {
        let postedData = {
          status: status,
          api_token: token,
          applicationId: item?.id,
        };
        get('/update/order/status', postedData)
          .then(res => {
            setItem(res.data.data.data);
            setLoader(false);
            setDataUpdated(true);
          })
          .catch(err => {
            setLoader(false);
            // console.log(err)
          });
      })
      .catch(err => {
        setLoader(false);
      });
  };
  const updateDeliveredImageAndStatus = (status, image) => {
    setLoader(true);
    AsyncStorage.getItem('id')
      .then(token => {
        let postedData = {
          status: status,
          api_token: token,
          image: image,
          applicationId: item?.id,
        };
        get('/update/order/status', postedData)
          .then(res => {
            setItem(res.data.data.data);
            setLoader(false);
            setDataUpdated(true);
          })
          .catch(err => {
            setLoader(false);
            // console.log(err)
          });
      })
      .catch(err => {
        setLoader(false);
      });
  };
  const deleteOrder = orderId => {
    setDeleteLoader(true);
    AsyncStorage.getItem('id')
      .then(token => {
        let postedData = {
          status: '-1',
          api_token: token,
          applicationId: orderId,
        };
        get('/update/order/status', postedData)
          .then(res => {
            // setItem(res.data.data.data);
            setDeleteLoader(false);
            setDataUpdated(true);

            navigation.navigate('Home');
          })
          .catch(err => {
            setDeleteLoader(false);
            // console.log(err)
          });
      })
      .catch(err => {
        setDeleteLoader(false);
      });
  };

  const downloadFile = (url, order_number) => {
    console.log(url);
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: PictureDir + '/file/' + order_number + '.mp4',
        description: 'Video',
      },
    };
    config(options)
      .fetch('GET', url)
      .then(res => {
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{backgroundColor: '#ededed'}}>
      <StatusBar backgroundColor={gulluColor} />
      <View style={[height100, primaryGulluLightBackgroundColor]}>
        <View style={[{}, height100]}>
          <View style={[{}, height8]}>
            <HeaderComponent navigation={navigation} title="order edit" />
          </View>
          <ScrollView>
            <View style={[{}, height83]}>
              {item != undefined ? (
                <View style={[{}, flexDirectionRow, padding10]}>
                  <View
                    style={[
                      marginRight10,
                      {width: '100%', overflow: 'hidden'},
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{width: '100%'}}>
                        <View style={styles.screen}>
                          {/* {showBox && <View style={styles.box}></View>} */}
                          {role == 1 ? (
                            <Button
                              title="Delete"
                              onPress={() => showConfirmDialog(item?.id)}
                            />
                          ) : null}

                          {deleteLoader ? (
                            <ActivityIndicator size={20} color={gulluColor} />
                          ) : null}
                        </View>
                        <View style={[{}, flexDirectionRow]}>
                          <Text
                            style={[
                              {fontWeight: 'bold'},
                              h4,
                              marginRight10,
                              {color: gulluColor},
                            ]}>
                            Order Number
                          </Text>
                          <Text
                            style={[{marginTop: 0}, h4, {color: gulluColor}]}>
                            {item?.order_number}
                          </Text>
                        </View>
                        <View style={[{}, flexDirectionRow]}>
                          <Text
                            style={[
                              {fontWeight: 'bold'},
                              h4,
                              marginRight10,
                              {color: gulluColor},
                            ]}>
                            Item{' '}
                          </Text>
                          <Text
                            style={[{marginTop: 0}, h4, {color: gulluColor}]}>
                            {item?.item?.name}{' '}
                          </Text>
                        </View>
                        <View style={[{}, flexDirectionRow]}>
                          <Text
                            style={[
                              {fontWeight: 'bold'},
                              h4,
                              marginRight10,
                              {color: gulluColor},
                            ]}>
                            Color
                          </Text>
                          <Text
                            style={[{marginTop: 0}, h4, {color: gulluColor}]}>
                            {item?.color}
                          </Text>
                        </View>
                        {role == 1 ? (
                          <View>
                            <View style={[{}, flexDirectionRow]}>
                              <Text
                                style={[
                                  {fontWeight: 'bold'},
                                  h5,
                                  gulluFont,
                                  marginRight10,
                                ]}>
                                Ready date
                              </Text>
                              <Text style={[{marginTop: 0}, h5, gulluFont]}>
                                {item?.ready_date}
                              </Text>
                            </View>
                            <View style={[{}, flexDirectionRow]}>
                              <Text
                                style={[
                                  {fontWeight: 'bold'},
                                  h5,
                                  gulluFont,
                                  marginRight10,
                                ]}>
                                Buffer ready date
                              </Text>
                              <Text style={[{marginTop: 0}, h5, gulluFont]}>
                                {item?.buffered_ready_date}
                              </Text>
                              {/* <Text style={[{ marginTop: 0 }, h5, gulluFont]}>{item?.pending_days} ({ item?.buffered_ready_date })</Text> */}
                            </View>

                            <View style={[{}, flexDirectionRow]}>
                              <Text
                                style={[
                                  {fontWeight: 'bold'},
                                  h5,
                                  gulluFont,
                                  marginRight10,
                                ]}>
                                Delivery Date
                              </Text>
                              <Text style={[{marginTop: 0}, h5, gulluFont]}>
                                {item?.delivery_date}
                              </Text>
                            </View>
                            <View style={[{}, flexDirectionRow]}>
                              <Text
                                style={[
                                  {fontWeight: 'bold'},
                                  h4,
                                  marginRight10,
                                  {color: gulluColor},
                                ]}>
                                Salesman
                              </Text>
                              <Text
                                style={[
                                  {marginTop: 0},
                                  h4,
                                  {color: gulluColor},
                                ]}>
                                {item?.salesman?.name}
                              </Text>
                            </View>
                            <View style={[{}, flexDirectionRow]}>
                              <Text
                                style={[
                                  {fontWeight: 'bold'},
                                  h4,
                                  marginRight10,
                                  {color: gulluColor},
                                ]}>
                                Vendor
                              </Text>
                              <Text
                                style={[
                                  {marginTop: 0},
                                  h4,
                                  {color: gulluColor},
                                ]}>
                                {item?.vendor?.name}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    {/* <View style={[{width: '100%'}, marginTop10]}>
											{( item?.attachments.length > 0)? <ImageBackground source={{uri: imagePath+''+item?.attachments[0].attachment }} resizeMode="contain" style={{height: 400 , width: '100%'}} /> : ''}
										</View> */}

                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 30,
                        color: secondaryBackgroundColor,
                      }}>
                      Order Attachments
                    </Text>
                    <View
                      style={[
                        {
                          width: '100%',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        },
                        marginTop10,
                      ]}>
                      {item?.attachments.map(attachment => {
                        return attachment.attachment_type.includes('video') ? (
                          <View style={{marginVertical: 20, width: '100%'}}>
                            <Modal
                              animationType="slide"
                              transparent={true}
                              visible={modalVisible}
                              onRequestClose={() => {
                                // Alert.alert('Modal has been closed.');
                                setModalVisible(!modalVisible);
                              }}>
                              <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                  <View
                                    style={{
                                      width: '100%',
                                      height: 400,
                                      paddingVertical: 20,
                                    }}>
                                    <Video
                                      source={{
                                        uri:
                                          imagePath +
                                          '' +
                                          attachment.attachment,
                                      }}
                                      style={styles.backgroundVideo}
                                      controls={true}
                                      ref={ref => (videoPlayer.current = ref)}
                                      resizeMode={'contain'}
                                      paused={false}
                                      onLoad={() => {
                                        console.log('jnk');
                                      }}
                                      onLoadStart={() => {
                                        setLoadStart(true);
                                      }}
                                      onBuffer={() => {
                                        console.log('onBuffer');
                                      }}
                                    />
                                    {loadStart ? (
                                      <View style={[{}, justifyContentCenter]}>
                                        <Text style={{textAlign: 'center'}}>
                                          Loading Video...
                                        </Text>
                                      </View>
                                    ) : null}
                                  </View>

                                  <View style={{flexDirection: 'row'}}>
                                    <View>
                                      <Pressable
                                        style={[
                                          styles.button,
                                          styles.buttonClose,
                                          {paddingHorizontal: 20},
                                        ]}
                                        onPress={() => {
                                          downloadFile(
                                            imagePath +
                                              '' +
                                              attachment.attachment,
                                            item?.order_number,
                                          );
                                        }}>
                                        <Text style={styles.textStyle}>
                                          Download
                                        </Text>
                                      </Pressable>
                                    </View>
                                    <View>
                                      <Pressable
                                        style={[
                                          styles.button,
                                          styles.buttonClose,
                                          {paddingHorizontal: 20},
                                        ]}
                                        onPress={() =>
                                          setModalVisible(!modalVisible)
                                        }>
                                        <Text style={styles.textStyle}>
                                          Hide
                                        </Text>
                                      </Pressable>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </Modal>
                            <Pressable
                              style={[styles.button, styles.buttonOpen]}
                              onPress={() => setModalVisible(true)}>
                              <Text style={styles.textStyle}>
                                Show video attachment
                              </Text>
                            </Pressable>
                          </View>
                        ) : attachment.attachment_type.includes('image') ? (
                          <View
                            style={[
                              {height: 200, width: '47%'},
                              marginTop10,
                              marginRight10,
                            ]}>
                            <Pressable
                              onPress={() => {
                                setSelectedImage(
                                  imagePath + '' + attachment.attachment,
                                ),
                                  setModalVisibleImage(true);
                              }}>
                              <ImageBackground
                                source={{
                                  uri: imagePath + '' + attachment.attachment,
                                }}
                                resizeMode="contain"
                                style={{height: '100%', width: '100%'}}
                              />
                            </Pressable>
                          </View>
                        ) : null;
                      })}
                    </View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisibleImage}
                      onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                        setModalVisibleImage(!modalVisibleImage);
                      }}>
                      <View style={styles.centeredView}>
                        <View
                          style={[styles.modalView, {margin: 0, padding: 10}]}>
                          <View
                            style={{
                              width: '100%',
                              height: '100%',
                              paddingVertical: 20,
                            }}>
                            {/* <Image source={{uri : selectedImage}} resizeMode='contain' resizeMethod='scale'  style={{ height: '100%', width: '100%' }} /> */}
                            <ImageViewer
                              imageUrls={[{url: selectedImage}]}
                              renderIndicator={() => null}
                            />
                          </View>
                          <Pressable
                            style={[
                              {
                                position: 'absolute',
                                backgroundColor: 'red',
                                height: 50,
                                width: 50,
                                justifyContent: 'center',
                                borderRadius: 100,
                                right: 10,
                              },
                            ]}
                            onPress={() =>
                              setModalVisibleImage(!modalVisibleImage)
                            }>
                            <Text style={[styles.textStyle, {fontSize: 20}]}>
                              X
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </Modal>
                    <View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 30,
                          color: secondaryBackgroundColor,
                        }}>
                        Order Status:{' '}
                        {item?.status == 1
                          ? 'Pending'
                          : item?.status == 2
                          ? 'Ready'
                          : 'Delivered'}
                      </Text>

                      <View style={{width: '100%'}}>
                        <Text style={{color: gulluColor, fontWeight: 'bold'}}>
                          Order Placed on {item?.date}{' '}
                        </Text>
                      </View>

                      <View style={{padding: 10}}>
                        <View
                          style={{
                            borderLeftColor: secondaryBackgroundColor,
                            borderLeftWidth: 2,
                            borderStyle: 'dashed',
                            height: 100,
                          }}></View>
                      </View>

                      {item?.status == 2 || item?.status == 3 ? (
                        <View style={{width: '100%'}}>
                          <Text style={{color: gulluColor, fontWeight: 'bold'}}>
                            Order Ready{' '}
                          </Text>
                        </View>
                      ) : null}

                      {role == 1 && item?.status == 1 ? (
                        <View style={{width: '100%'}}>
                          <Text style={{color: secondaryBackgroundColor}}>
                            Order not Ready yet.
                          </Text>
                        </View>
                      ) : null}
                      {role == 3 && item?.status == 1 ? (
                        <View style={{width: '100%'}}>
                          <Text style={{color: secondaryBackgroundColor}}>
                            Order not Ready yet.
                          </Text>
                        </View>
                      ) : null}
                      {role == 2 && item?.status == 1 ? (
                        <View>
                          <View style={{width: '100%'}}>
                            <Text style={{color: secondaryBackgroundColor}}>
                              Order not Ready yet.
                            </Text>
                          </View>
                          <View style={{width: '70%'}}>
                            <Pressable
                              style={{
                                backgroundColor: secondaryBackgroundColor,
                                paddingVertical: 10,
                                borderRadius: 10,
                              }}
                              onPress={() => updateOrder(2)}>
                              <Text style={styles.textStyle}>
                                Update order status to READY
                              </Text>
                              {loader ? (
                                <ActivityIndicator
                                  size={20}
                                  color={gulluColor}
                                />
                              ) : null}
                            </Pressable>
                          </View>
                        </View>
                      ) : null}
                      <View style={{padding: 10}}>
                        <View
                          style={{
                            borderLeftColor: secondaryBackgroundColor,
                            borderLeftWidth: 2,
                            borderStyle: 'dashed',
                            height: 100,
                          }}></View>
                      </View>
                      {item?.status == 3 ? (
                        <View style={{width: '100%'}}>
                          <Text style={{color: gulluColor, fontWeight: 'bold'}}>
                            Order Delivered{' '}
                          </Text>
                          {UplaodedImage != undefined ? (
                            <ImageBackground
                              source={{
                                uri: UplaodedImage,
                              }}
                              resizeMode="contain"
                              style={{height: '100%', width: '100%'}}
                            />
                          ) : (
                            <View
                              style={[
                                {height: 300, width: '47%'},
                                marginTop10,
                                marginRight10,
                              ]}>
                              <ImageBackground
                                source={{
                                  uri: imagePath + '' + item.delivered_image,
                                }}
                                resizeMode="contain"
                                style={{height: '100%', width: '100%'}}
                              />
                            </View>
                          )}
                        </View>
                      ) : null}

                      {item?.status != 3 ? (
                        <View style={{width: '100%'}}>
                          <Text style={{color: secondaryBackgroundColor}}>
                            Order not delivered yet.
                          </Text>
                        </View>
                      ) : null}
                      {(item?.status != 3 && role == 3) ||
                      (item?.status != 3 && role == 1) ? (
                        <View>
                          <View style={{width: '70%'}}>
                            <Pressable
                              style={{
                                backgroundColor: secondaryBackgroundColor,
                                paddingVertical: 10,
                                borderRadius: 10,
                              }}
                              // onPress={() => updateOrder(3)}
                              onPress={() => uploadDeliveredProductImage()}>
                              <Text style={styles.textStyle}>
                                Update order status to DELIVERED
                              </Text>
                              {loader ? (
                                <ActivityIndicator
                                  size={20}
                                  color={gulluColor}
                                />
                              ) : null}
                            </Pressable>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>
          <View style={[{}, height9]}>
            {/* <FooterComponent navigation={navigation} /> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: secondaryBackgroundColor,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '100%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '100%',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
    width: '100%',
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
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 300,
    height: 300,
    backgroundColor: 'red',
    marginBottom: 30,
  },
  text: {
    fontSize: 30,
  },
});
export default memo(OrderEdit);
