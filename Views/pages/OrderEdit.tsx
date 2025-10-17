import React, { memo, useEffect, useState } from 'react';
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
import { Colors } from 'react-native/Libraries/NewAppScreen';
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
import { readFile } from 'react-native-fs';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imagePath } from '../services/Client';
import {
  get,
  showToast,
  updateOrderStatus,
  updateOrderStatusWithImage,
} from '../services/services';
import RNFetchBlob from 'rn-fetch-blob';
import { RNS3 } from 'react-native-s3-upload';
import { S3 } from 'aws-sdk';
import { launchImageLibrary } from 'react-native-image-picker';
import { useImageModal } from '../hooks/CustomModal';
import NavBarComponent from '../components/NavBarComponent';
import COLOR from '../config/color';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LOCALSTORAGE from '../config/localStorage';
import ROUTES from '../config/routes';

function OrderEdit({ navigation, route }: any): JSX.Element {
  const [item, setItem] = useState<any>();
  const [role, setRole] = useState<any>();
  const [name, setName] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleImage, setModalVisibleImage] = useState(false);
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
  const { showImageModal } = useImageModal();

  const videoPlayer = React.useRef();

  const MaterialIconsIcon =
    MaterialIcons as unknown as React.ComponentType<any>;

  async function getUriToBase64(uri: any) {
    const base64String = await readFile(uri, 'base64');
    return base64String;
  }
  const showConfirmDialog = (orderId: any) => {
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

    AsyncStorage.getItem(LOCALSTORAGE.ID)
      .then(token => {
        // console.log(token);
      })
      .catch(err => { });
    AsyncStorage.getItem(LOCALSTORAGE.ROLE)
      .then(role => {
        setRole(role);
      })
      .catch(err => { });
    AsyncStorage.getItem(LOCALSTORAGE.NAME)
      .then(name => {
        setName(name);
      })
      .catch(err => { });
  }, []);

  const uploadFileToS3 = async (
    ImageURI: any,
    filename: any,
    fileSize: any,
    type: any,
    variant: any,
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

    RNS3.put(file, options).then((response: any) => {
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

  const updateOrder = (status: any) => {
    setLoader(true);
    AsyncStorage.getItem(LOCALSTORAGE.ID)
      .then(async token => {
        // let postedData = {
        //   status: status,
        //   api_token: token,
        //   applicationId: item?.id,
        // };
        // get('/update/order/status', postedData)
        await updateOrderStatus(status, token, item?.id)
          .then(res => {
            setItem(res.data.data);
            setLoader(false);
            setDataUpdated(true);
          })
          .catch(err => {
            setLoader(false);
            console.log(JSON.stringify(err));
          });
      })
      .catch(err => {
        setLoader(false);
      });
  };
  const updateDeliveredImageAndStatus = (status: any, image: any) => {
    setLoader(true);
    AsyncStorage.getItem(LOCALSTORAGE.ID)
      .then(async token => {
        await updateOrderStatusWithImage(status, token, image, item?.id)
          .then(res => {
            setItem(res.data.data);
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

  const deleteOrder = (orderId: any) => {
    setDeleteLoader(true);
    AsyncStorage.getItem(LOCALSTORAGE.ID)
      .then(async token => {
        let postedData = {
          status: '-1',
          api_token: token,
          applicationId: orderId,
        };
        // get('/update/order/status', postedData)
        await updateOrderStatus('-1', token, orderId)
          .then(res => {
            // setItem(res.data.data.data);
            setDeleteLoader(false);
            setDataUpdated(true);

            navigation.reset({
              index: 0,
              routes: [{ name: ROUTES.landingPage as never }],
            });
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

  const downloadFile = (url: any, order_number: any) => {
    console.log(url);
    const { config, fs } = RNFetchBlob;
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
        Alert.alert('File Downloaded Successfully.');
      })
      .catch(err => {
        console.log(err);
      });
  };

  // console.log(`------> ORDER EDIT ${JSON.stringify(item)}`);

  return (
    <SafeAreaView style={styles.orderEditBaseContainer}>
      <View style={styles.orderEditHeaderBaseContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.orderEditNavbarBaseContainer}>
        <NavBarComponent
          title="Order Edit"
          titleColor={COLOR.baseColor}
          navigation={navigation}
        />
      </View>
      <View style={styles.orderEditContentBaseContainer}>
        <ScrollView
          contentContainerStyle={styles.orderEditContentListBaseContainer}>
          <View style={styles.orderEditContentDetailsBaseContainer}>
            <View style={styles.orderEditContentDetailsContainer}>
              <Text style={styles.orderEditContentDetailsHeaderText}>
                Order Number
              </Text>
              <Text style={styles.orderEditContentDetailsContentText}>
                {`#${item?.order_number}`}
              </Text>
            </View>
            <View style={styles.orderEditContentDetailsContainer}>
              <Text style={styles.orderEditContentDetailsHeaderText}>Item</Text>
              <Text style={styles.orderEditContentDetailsContentText}>
                {`${item && item?.item?.name
                  ? item?.item?.name
                  : (item && item.item) || ''
                  }`}
              </Text>
            </View>
            <View style={styles.orderEditContentDetailsContainer}>
              <Text style={styles.orderEditContentDetailsHeaderText}>
                Color
              </Text>
              <Text style={styles.orderEditContentDetailsContentText}>
                {`${item?.color}`}
              </Text>
            </View>
            {role == 1 && (
              <>
                <View style={styles.orderEditContentDetailsContainer}>
                  <Text style={styles.orderEditContentDetailsHeaderText}>
                    Ready Date
                  </Text>
                  <Text style={styles.orderEditContentDetailsContentText}>
                    {`${item?.ready_date}`}
                  </Text>
                </View>
                <View style={styles.orderEditContentDetailsContainer}>
                  <Text style={styles.orderEditContentDetailsHeaderText}>
                    Buffer Date
                  </Text>
                  <Text style={styles.orderEditContentDetailsContentText}>
                    {`${item?.buffered_ready_date}`}
                  </Text>
                </View>
                <View style={styles.orderEditContentDetailsContainer}>
                  <Text style={styles.orderEditContentDetailsHeaderText}>
                    Delivery Date
                  </Text>
                  <Text style={styles.orderEditContentDetailsContentText}>
                    {`${item?.delivery_date}`}
                  </Text>
                </View>
                <View style={styles.orderEditContentDetailsContainer}>
                  <Text style={styles.orderEditContentDetailsHeaderText}>
                    Consultant
                  </Text>
                  <Text style={styles.orderEditContentDetailsContentText}>
                    {`${item?.salesman?.name}`}
                  </Text>
                </View>
                <View style={styles.orderEditContentDetailsContainer}>
                  <Text style={styles.orderEditContentDetailsHeaderText}>
                    Vendor
                  </Text>
                  <Text style={styles.orderEditContentDetailsContentText}>
                    {`${item?.vendor?.name}`}
                  </Text>
                </View>
              </>
            )}
          </View>
          <View style={styles.orderEditContentAttachmentsBaseContainer}>
            <Text style={styles.orderEditContentAttachmentsHeaderText}>
              Attachments
            </Text>
            <View style={[styles.orderEditContentAttachmentContainer]}>
              {item?.attachments.map((attachment: any, index: number) => {
                return attachment.attachment_type.includes('video') ? (
                  <View style={{ marginVertical: 20, width: '100%' }}>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => {
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
                                uri: imagePath + '' + attachment.attachment,
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
                                <Text style={{ textAlign: 'center' }}>
                                  Loading Video...
                                </Text>
                              </View>
                            ) : null}
                          </View>

                          <View style={{ flexDirection: 'row' }}>
                            <View>
                              <Pressable
                                style={[
                                  styles.button,
                                  styles.buttonClose,
                                  { paddingHorizontal: 20 },
                                ]}
                                onPress={() => {
                                  downloadFile(
                                    imagePath + '' + attachment.attachment,
                                    item?.order_number,
                                  );
                                }}>
                                <Text style={styles.textStyle}>Download</Text>
                              </Pressable>
                            </View>
                            <View>
                              <Pressable
                                style={[
                                  styles.button,
                                  styles.buttonClose,
                                  { paddingHorizontal: 20 },
                                ]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Hide</Text>
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      </View>
                    </Modal>
                    <CustomButton
                      backgroundColor={COLOR.whiteColor}
                      color={COLOR.blackColor}
                      borderColor={COLOR.blackColor}
                      title="Show Video Attachment"
                      onClick={() => {
                        if (attachment.attachment) {
                          setModalVisible(true);
                        } else {
                          Toast.show({
                            type: 'error',
                            text1: 'Video not found',
                          });
                        }
                      }}
                    />
                  </View>
                ) : attachment.attachment_type.includes('image') &&
                  attachment.attachment_for != 'Product Delivered' ? (
                  <View
                    style={[
                      {
                        height: 200,
                        width: '47%',
                      },
                      marginTop10,
                      marginRight10,
                    ]}>
                    <Pressable
                      style={styles.orderEditContentAttachmentImageContainer}
                      onPress={() => {
                        if (attachment.attachment) {
                          showImageModal(
                            imagePath + '' + attachment.attachment,
                          );
                        } else {
                          Toast.show({
                            type: 'error',
                            text1: 'Image not found',
                          });
                        }
                      }}>
                      {attachment.attachment ? (
                        <ImageBackground
                          source={{
                            uri: imagePath + '' + attachment.attachment,
                          }}
                          resizeMode="contain"
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <MaterialIconsIcon
                          name="image-not-supported"
                          size={50}
                          color={COLOR.placeholderColor}
                        />
                      )}
                    </Pressable>
                  </View>
                ) : null;
              })}
            </View>
          </View>
          <View style={styles.orderEditContentCurrentStatusBaseContainer}>
            <Text style={styles.orderEditContentAttachmentsHeaderText}>
              Current Status
            </Text>
            <View style={styles.orderEditContentCurrentStatusContainer}>
              <View style={styles.orderEditContentCurrentStatusTextContainer}>
                <Text
                  style={{
                    color: item
                      ? item.status == 1
                        ? COLOR.redColor
                        : item.status == 2
                          ? COLOR.yellowColor
                          : COLOR.greenColor
                      : COLOR.placeholderColor,
                    fontWeight: 'bold',
                  }}>
                  {item?.status == 1
                    ? 'Pending'
                    : item?.status == 2
                      ? 'Ready'
                      : 'Delivered'}
                </Text>
                <Text>Order Placed on {item?.date} </Text>
              </View>

              <View style={{ padding: 10 }}>
                <View
                  style={{
                    borderLeftColor: COLOR.placeholderColor,
                    borderLeftWidth: 2,
                    borderStyle: 'dashed',
                    height: 50,
                  }}
                />
              </View>

              {(item?.status == 2 || item?.status == 3) && (
                <View style={{ width: '100%' }}>
                  <Text style={{ color: COLOR.greenColor, fontWeight: 'bold' }}>
                    Order Ready{' '}
                  </Text>
                </View>
              )}

              {role == 1 && item?.status == 1 ? (
                <View style={{ width: '100%' }}>
                  <Text style={{ color: COLOR.placeholderColor }}>
                    Order not Ready yet.
                  </Text>
                </View>
              ) : null}

              {role == 3 && item?.status == 1 ? (
                <View style={{ width: '100%' }}>
                  <Text style={{ color: COLOR.placeholderColor }}>
                    Order not Ready yet.
                  </Text>
                </View>
              ) : null}

              {item?.status == 1 && (
                <View>
                  {/* <View style={{width: '100%'}}>
                    <Text style={{color: secondaryBackgroundColor}}>
                      Order not Ready yet.
                    </Text>
                  </View> */}
                  {/* <View style={{width: '70%'}}>
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
                        <ActivityIndicator size={20} color={gulluColor} />
                      ) : null}
                    </Pressable>
                  </View> */}
                  <CustomButton
                    backgroundColor={COLOR.blackColor}
                    color={COLOR.whiteColor}
                    title="Update Order Status To Ready"
                    onClick={() => updateOrder(2)}
                    isLoading={loader}
                  />
                </View>
              )}
              <View style={{ padding: 10 }}>
                <View
                  style={{
                    borderLeftColor: COLOR.placeholderColor,
                    borderLeftWidth: 2,
                    borderStyle: 'dashed',
                    height: 50,
                  }}
                />
              </View>
              {item?.status == 3 ? (
                <View style={{ width: '100%' }}>
                  <Text style={{ color: COLOR.greenColor, fontWeight: 'bold' }}>
                    Order Delivered
                  </Text>
                  {UplaodedImage != undefined ? (
                    <ImageBackground
                      source={{
                        uri: UplaodedImage,
                      }}
                      resizeMode="contain"
                      style={{ height: '100%', width: '100%' }}
                    />
                  ) : (
                    <View
                      style={[
                        {
                          height: 300,
                          width: '100%',
                          backgroundColor: COLOR.lightGreyColor,
                          borderRadius: 20,
                        },
                        marginTop10,
                        marginRight10,
                      ]}>
                      <ImageBackground
                        source={{
                          uri:
                            imagePath +
                            '' +
                            item.attachments.filter(
                              (item: any) =>
                                item.attachment_for == 'Product Delivered',
                            )[0].attachment,
                        }}
                        resizeMode="contain"
                        style={{ height: '100%', width: '100%' }}
                      />
                    </View>
                  )}
                </View>
              ) : null}

              {item?.status != 3 && (
                <View style={{ width: '100%' }}>
                  <Text style={{ color: COLOR.placeholderColor }}>
                    Order not delivered yet.
                  </Text>
                </View>
              )}
              {(item?.status != 3 && role == 3) ||
                (item?.status != 3 && role == 1) ? (
                <View>
                  {/* <View style={{width: '70%'}}>
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
                        <ActivityIndicator size={20} color={gulluColor} />
                      ) : null}
                    </Pressable>
                  </View> */}
                  {
                    (role == 1 && name == 'admin')
                    &&
                    <CustomButton
                      backgroundColor={COLOR.baseColor}
                      color={COLOR.whiteColor}
                      title="Update Order Status To Delivered"
                      isLoading={loader}
                      onClick={() => uploadDeliveredProductImage()}
                    />
                  }
                </View>
              ) : null}
            </View>
          </View>
          {role == 1 && name == 'admin' && item?.status != 3 && (
            <View style={styles.orderEditContentDeleteBaseContainer}>
              <Text style={styles.orderEditContentAttachmentsHeaderText}>
                Delete Order
              </Text>
              <CustomButton
                title="Delete Order"
                backgroundColor={COLOR.redColor}
                color={COLOR.whiteColor}
                onClick={() => {
                  showConfirmDialog(item?.id);
                }}
                isLoading={deleteLoader}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  orderEditBaseContainer: {
    flex: 1,
  },
  orderEditHeaderBaseContainer: {
    flex: 0.09,
  },
  orderEditNavbarBaseContainer: {
    flex: 0.1,
  },
  orderEditContentBaseContainer: {
    flex: 0.85,
  },
  orderEditContentListBaseContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  orderEditContentDetailsBaseContainer: {
    gap: 10,
  },
  orderEditContentDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderEditContentDetailsHeaderText: {
    color: COLOR.placeholderColor,
  },
  orderEditContentDetailsContentText: {
    color: COLOR.blackColor,
    fontWeight: 'bold',
  },
  orderEditContentAttachmentsBaseContainer: {},
  orderEditContentAttachmentsHeaderText: {
    color: COLOR.blackColor,
    fontSize: 24,
  },
  orderEditContentAttachmentContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  orderEditContentAttachmentImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: COLOR.lightGreyColor,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderEditContentCurrentStatusBaseContainer: {
    marginBottom: 10,
    gap: 10,
  },
  orderEditContentDeleteBaseContainer: {
    marginBottom: 10,
    gap: 20,
  },
  orderEditContentCurrentStatusContainer: {
    gap: 10,
  },
  orderEditContentCurrentStatusTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

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
