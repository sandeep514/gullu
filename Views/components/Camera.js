'use strict';
import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const PendingView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Waiting</Text>
    </View>
  );
export default class Camera extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          isRecording: false
        };
      }
    render() {
      return (
        <View style={styles.container}>
          <RNCamera            
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              defaultVideoQuality='480p'
              
          >
            {({ camera, status, recordAudioPermissionStatus }) => {
              if (status !== 'READY') return <PendingView />;
              return (
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    {(this.state.isRecording != true)?
                      <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}> Record </Text>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity onPress={() => this.stopVideo(camera)} style={styles.capture}>
                            <Text style={{ fontSize: 14 }}> Remove </Text>
                        </TouchableOpacity>                    
                    }
                </View>
              );
            }}
          </RNCamera>
        </View>
      );
    }

  takePicture = async function(camera) {
    this.setState({isRecording : true});
    const options = { quality: RNCamera.Constants.VideoQuality["4:3"], base64: true ,maxDuration: 20 ,  maxFileSize : (3*1024*1024), VideoQuality: 0.4,defaultVideoQuality: 0.4,videoBitrate: (2*1000*1000) };
    const data = await camera.recordAsync(options);
    console.log("i am here");
    console.log(data.uri);
  };
  stopVideo = async function(camera) {
    this.setState({isRecording : false});
    const data = await camera.stopRecording();
  };

}
const styles = StyleSheet.create({
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
  });

AppRegistry.registerComponent('App', () => Camera);