/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { memo, useCallback, useEffect, useState } from "react";
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
} from "react-native";

import {
  gulluColor,
  h4,
  height100,
  height8,
  height83,
  height9,
  marginTop30,
  primaryGulluLightBackgroundColor,
} from "../assets/styles";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "../services/services";
import { imagePath } from "../services/Client";
import { useIsFocused } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import ImageViewer from "react-native-image-zoom-viewer";

function Gallery({ navigation }): JSX.Element {
  const [loader, setLoader] = useState(false);
  const [role, setRole] = useState();
  const [OriginalPending, setOriginalPending] = useState([]);
  const [pending, setPending] = useState([]);
  const [modalVisibleImage, setModalVisibleImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState();

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.type == "cellular") {
        console.log("You are using mobile data to upload 30MB data.");
      } else {
        if (500 > 400) {
          console.log("sixe of attachment is 2MB, this will take");
        }
      }
    });
  }, []);
  const wait = (timeout) => {
    // Defined the timeout function for testing purpose
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    getData();
    wait(2000).then(() => setIsRefreshing(false));
  }, []);

  const isDarkMode = useColorScheme() === "dark";
  useEffect(() => {
    AsyncStorage.getItem("role")
      .then((roleId) => {
        console.log(roleId);
        setRole(roleId);
      })
      .catch((err) => {
        // console.log(err);
      });
    getData();
  }, []);
  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = () => {
    setLoader(true);
    AsyncStorage.getItem("id")
      .then((token) => {
        let postedData = { api_token: token };
        get("/orders/list/gallery", postedData)
          .then((res) => {
            console.log('res.data');
            console.log(res.data);
            let pending = res.data.data.data;

            setPending(pending);
            setOriginalPending(pending);
            setLoader(false);
          })
          .catch((err) => {
            console.log(err);
            setLoader(false);
          });
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const Item = ({ item }: any) => (
    <Pressable
      onPress={() => {
        setSelectedImage(imagePath + "" + item?.attachments[0].attachment);
        setModalVisibleImage(true);
      }}
      style={[
        {
          flex: 1,
          flexDirection: "column",
          margin: 1,
          borderRadius: 10,
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <ImageBackground
        source={{ uri: imagePath + "" + item?.attachments[0].attachment }}
        resizeMode="center"
        resizeMethod="resize"
        style={{ height: 150, width: 100 }}
      />
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          {item?.order_number}
        </Text>
      </View>
    </Pressable>
  );
  return (
    <SafeAreaView style={{ backgroundColor: "#ededed" }}>
      <StatusBar backgroundColor={gulluColor} />
      <View style={[height100, primaryGulluLightBackgroundColor]}>
        <View style={[{}, height100]}>
          <View style={[{}, height8]}>
            <HeaderComponent navigation={navigation} title="Gallery" />
          </View>

          <View style={[{}, height83]}>
            <View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleImage}
                onRequestClose={() => {
                  // Alert.alert('Modal has been closed.');
                  setModalVisibleImage(!modalVisibleImage);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={[styles.modalView, { margin: 0, padding: 10 }]}>
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        paddingVertical: 20,
                      }}
                    >
                      {/* <Image source={{uri : selectedImage}} resizeMode='contain' resizeMethod='scale'  style={{ height: '100%', width: '100%' }} /> */}
                      <ImageViewer
                        imageUrls={[{ url: selectedImage }]}
                        renderIndicator={() => null}
                      />
                    </View>
                    <Pressable
                      style={[
                        {
                          position: "absolute",
                          backgroundColor: "red",
                          height: 50,
                          width: 50,
                          justifyContent: "center",
                          borderRadius: 100,
                          right: 10,
                        },
                      ]}
                      onPress={() => setModalVisibleImage(!modalVisibleImage)}
                    >
                      <Text style={[styles.textStyle, { fontSize: 20 }]}>
                        X
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              <View style={[{}, height100]}>
                {loader ? (
                  <ActivityIndicator size={20} color={gulluColor} />
                ) : pending != undefined && pending != "" ? (
                  Object.values(pending)?.length > 0 ? (
                    <View>
                      <View>
                        <FlatList
                          refreshing={isRefreshing} // Added pull to refesh state
                          onRefresh={onRefresh} // Added pull to refresh control
                          data={Object.values(pending)}
                          renderItem={({ item }) => <Item item={item} />}
                          keyExtractor={(item) => item?.id + "" + Math.random()}
                          showsVerticalScrollIndicator={false}
                          numColumns={3}
                        />
                      </View>
                    </View>
                  ) : (
                    <View style={{ justifyContent: "center" }}>
                      <Text
                        style={[
                          h4,
                          { color: gulluColor, textAlign: "center" },
                          marginTop30,
                        ]}
                      >
                        No pending orders available
                      </Text>
                    </View>
                  )
                ) : null}
              </View>
            </View>
          </View>
          <View style={[{}, height9]}>
            <FooterComponent navigation={navigation} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
  itemRed: {
    backgroundColor: "red",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  itemYellow: {
    backgroundColor: "yellow",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  itemGreen: {
    width: "30%",
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "blue",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "100%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default memo(Gallery);