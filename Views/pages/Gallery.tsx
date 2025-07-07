/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  ImageBackground,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Image,
  Share,
  Modal,
  TouchableOpacity,
} from 'react-native';

import {
  gulluColor,
  h4,
  height100,
  height8,
  height83,
  height9,
  marginTop30,
  primaryGulluLightBackgroundColor,
} from '../assets/styles';
import FooterComponent from '../components/FooterComponent';
import HeaderComponent from '../components/HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {get, getGalleryList} from '../services/services';
import apiClient, {imagePath} from '../services/Client';
import {useIsFocused} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import ImageViewer from 'react-native-image-zoom-viewer';
import NavBarComponent from '../components/NavBarComponent';
import COLOR from '../config/color';
import Toast from 'react-native-toast-message';
import LOCALSTORAGE from '../config/localStorage';
import {API_URLS} from '../services/urls';
import DIMENSIONS from '../config/dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {useImageModal} from '../hooks/CustomModal';

function Gallery({navigation}: any): JSX.Element {
  const [loader, setLoader] = useState(true);
  const [role, setRole] = useState<String | null>();
  const [OriginalPending, setOriginalPending] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [modalVisibleImage, setModalVisibleImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<String | null>('');
  const {showImageModal} = useImageModal();

  const AntDesignIcon = AntDesign as unknown as React.ComponentType<any>;

  type GalleryItem = {
    id: string | number;
  };

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.type == 'cellular') {
        console.log('You are using mobile data to upload 30MB data.');
      } else {
        if (500 > 400) {
          console.log('sixe of attachment is 2MB, this will take');
        }
      }
    });
  }, []);

  const wait = (timeout: any) => {
    return new Promise<void>(resolve => setTimeout(resolve, timeout));
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    getData();
    wait(2000).then(() => setIsRefreshing(false));
  }, []);

  useEffect(() => {
    // AsyncStorage.getItem('role')
    //   .then(roleId => {
    //     console.log(roleId);
    //     setRole(roleId);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    setLoader(true);
    try {
      AsyncStorage.getItem(LOCALSTORAGE.ID)
        .then(async id => {
          await getGalleryList(id)
            .then(res => {
              if (res.data.status) {
                setPendingList(res.data.data);
                setLoader(false);
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Something went wrong',
                });
                setPendingList([]);
                setLoader(false);
              }
            })
            .catch(err => {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong',
              });
              setLoader(false);
            });
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong',
          });
          setLoader(false);
        });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
      setLoader(false);
    }
  };

  const Item = ({item}: any) => {
    const imageLink = imagePath + '' + item?.attachments[0].attachment;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          showImageModal(imageLink);
        }}
        style={styles.galleryCardItemBaseContainer}>
        <View style={styles.galleryCardItemImageContainer}>
          {!imageLink ? (
            <Image
              source={{uri: imageLink}}
              resizeMode="center"
              resizeMethod="resize"
              style={styles.galleryCardItemImage}
            />
          ) : (
            <AntDesignIcon
              name="picture"
              size={50}
              color={COLOR.placeholderColor}
            />
          )}
        </View>
        <LinearGradient
          colors={[`${COLOR.transparentColor}`, `${COLOR.blackColor}44`]}
          style={styles.galleryCardItemContentContainer}>
          <Text style={styles.galleryCardItemContent}>
            {item?.order_number || ''}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    // <SafeAreaView style={{ backgroundColor: "#ededed" }}>
    //   <StatusBar backgroundColor={gulluColor} />
    //   <View style={[height100, primaryGulluLightBackgroundColor]}>
    //     <View style={[{}, height100]}>
    //       <View style={[{}, height8]}>
    //         <HeaderComponent navigation={navigation} title="Gallery" />
    //       </View>

    //       <View style={[{}, height83]}>
    //         <View>
    //           <Modal
    //             animationType="slide"
    //             transparent={true}
    //             visible={modalVisibleImage}
    //             onRequestClose={() => {
    //               // Alert.alert('Modal has been closed.');
    //               setModalVisibleImage(!modalVisibleImage);
    //             }}
    //           >
    //             <View style={styles.centeredView}>
    //               <View style={[styles.modalView, { margin: 0, padding: 10 }]}>
    //                 <View
    //                   style={{
    //                     width: "100%",
    //                     height: "100%",
    //                     paddingVertical: 20,
    //                   }}
    //                 >
    //                   {/* <Image source={{uri : selectedImage}} resizeMode='contain' resizeMethod='scale'  style={{ height: '100%', width: '100%' }} /> */}
    //                   <ImageViewer
    //                     imageUrls={[{ url: selectedImage }]}
    //                     renderIndicator={() => null}
    //                   />
    //                 </View>
    //                 <Pressable
    //                   style={[
    //                     {
    //                       position: "absolute",
    //                       backgroundColor: "red",
    //                       height: 50,
    //                       width: 50,
    //                       justifyContent: "center",
    //                       borderRadius: 100,
    //                       right: 10,
    //                     },
    //                   ]}
    //                   onPress={() => setModalVisibleImage(!modalVisibleImage)}
    //                 >
    //                   <Text style={[styles.textStyle, { fontSize: 20 }]}>
    //                     X
    //                   </Text>
    //                 </Pressable>
    //               </View>
    //             </View>
    //           </Modal>
    //           <View style={[{}, height100]}>
    //             {loader ? (
    //               <ActivityIndicator size={20} color={gulluColor} />
    //             ) : pending != undefined && pending != "" ? (
    //               Object.values(pending)?.length > 0 ? (
    //                 <View>
    //                   <View>
    //                     <FlatList
    //                       refreshing={isRefreshing} // Added pull to refesh state
    //                       onRefresh={onRefresh} // Added pull to refresh control
    //                       data={Object.values(pending)}
    //                       renderItem={({ item }) => <Item item={item} />}
    //                       keyExtractor={(item) => item?.id + "" + Math.random()}
    //                       showsVerticalScrollIndicator={false}
    //                       numColumns={3}
    //                     />
    //                   </View>
    //                 </View>
    //               ) : (
    //                 <View style={{ justifyContent: "center" }}>
    //                   <Text
    //                     style={[
    //                       h4,
    //                       { color: gulluColor, textAlign: "center" },
    //                       marginTop30,
    //                     ]}
    //                   >
    //                     No pending orders available
    //                   </Text>
    //                 </View>
    //               )
    //             ) : null}
    //           </View>
    //         </View>
    //       </View>
    //       <View style={[{}, height9]}>
    //         <FooterComponent navigation={navigation} />
    //       </View>
    //     </View>
    //   </View>
    // </SafeAreaView>
    <SafeAreaView style={styles.galleryBaseContainer}>
      <View style={styles.galleryHeaderBaseContainer}>
        <HeaderComponent navigation={navigation} />
      </View>
      <View style={styles.galleryNavHeaderBaseContainer}>
        <NavBarComponent
          navigation={navigation}
          backgroundColor={COLOR.whiteColor}
          title="Gallery"
          titleColor={COLOR.baseColor}
        />
      </View>
      <View style={styles.galleryContentBaseContainer}>
        {loader ? (
          <View style={styles.galleryContentLoaderContainer}>
            <ActivityIndicator size={30} color={COLOR.baseColor} />
          </View>
        ) : (
          <View style={styles.galleryContentContainer}>
            {pendingList && pendingList.length > 0 ? (
              <View style={styles.galleryContentListContainer}>
                <FlatList<GalleryItem>
                  contentContainerStyle={{padding: 20}}
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  data={Object.values(pendingList)}
                  renderItem={({item}) => <Item item={item} />}
                  keyExtractor={item => (item?.id || 0) + '' + Math.random()}
                  showsVerticalScrollIndicator={false}
                  numColumns={3}
                />
              </View>
            ) : (
              <View style={styles.galleryContentLoaderContainer}>
                <Text style={styles.noPendingListText}>
                  No pending orders available
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  galleryBaseContainer: {
    flex: 1,
  },
  galleryHeaderBaseContainer: {
    flex: 0.11,
  },
  galleryNavHeaderBaseContainer: {
    flex: 0.1,
  },
  galleryContentBaseContainer: {
    flex: 1,
  },
  galleryContentLoaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPendingListText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.placeholderColor,
    textTransform: 'capitalize',
  },
  galleryContentContainer: {
    flex: 1,
  },
  galleryContentListContainer: {
    flex: 1,
  },
  galleryCardItemBaseContainer: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1 / 3,
    height: DIMENSIONS.height / 6,
    backgroundColor: `${COLOR.lightGreyColor}`,
    margin: 8,
    borderRadius: 20,
    elevation: 15,
  },
  galleryCardItemImageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryCardItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  galleryCardItemContentContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
  },
  galleryCardItemContent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR.whiteColor,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: "600",
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: "400",
//   },
//   highlight: {
//     fontWeight: "700",
//   },
//   itemRed: {
//     backgroundColor: "red",
//     padding: 15,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 10,
//   },
//   itemYellow: {
//     backgroundColor: "yellow",
//     padding: 15,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 10,
//   },
//   itemGreen: {
//     width: "30%",
//     flexDirection: "row",
//     borderWidth: 2,
//     borderColor: "blue",
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     width: "100%",
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   textStyle: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });

export default memo(Gallery);
