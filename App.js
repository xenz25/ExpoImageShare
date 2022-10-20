import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as ImageManipulator from 'expo-image-manipulator';

import logo from './assets/logo.png';

export default function App() {
  // create a use state for image
  const [selectedImage, setSelectedImage] = useState(null);
  const [activity, setActivity] = useState(0);

  // call the image picker
  let openImagePickerAsync = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if(pickerResult.cancelled == true){
      return;
    }
    setSelectedImage({ localUri: pickerResult.uri });
    setActivity(1);
    console.log(pickerResult);
  };

  let openShareDialogAsync = async () => {
    if(Platform.OS === 'web'){
      alert('Sharing is not available on your platform');
      return;
    }
    const imageTemp = await ImageManipulator.manipulateAsync(selectedImage.localUri);
    await Sharing.shareAsync(imageTemp.uri);
  }

  let cancelSharingAsync = async () => {
    setActivity(0);
  }

  switch(activity){
    case 0: {
      return (
        <View style={styles.container}>
          <Image source={logo} style={styles.logo}/>
          <Text style={styles.instruction}>
            To share a photo from you phone with a friend, just press the button below!
          </Text>
    
          <TouchableOpacity
            onPress={openImagePickerAsync} style={styles.button}>
            <Text style={styles.buttonText}>Pick a photo</Text>
          </TouchableOpacity>
    
          <StatusBar style="auto" />
        </View>
      );
    } case 1:{
      if(selectedImage !== null){
        return (
          <View style={styles.container}>
            <Image source={{ uri: selectedImage.localUri }}
              style={styles.thumbnail}
            />
            <TouchableOpacity style={styles.button} onPress={openShareDialogAsync}>
              <Text style={styles.buttonText}>Share this photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonDanger} onPress={cancelSharingAsync}>
              <Text style={styles.buttonText}>Select Another</Text>
            </TouchableOpacity>
          </View>
        );
      }
      break;
    }
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center'
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10
  },
  button: {
    marginTop: 10,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  buttonDanger: {
    marginTop: 10,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'
  },
  thumbnail: {
    width: 300,
    height: 300,
    backgroundColor: '#888',
    resizeMode: 'contain'
  }
});
