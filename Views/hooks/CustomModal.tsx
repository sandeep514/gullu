import {createContext, useContext, useState} from 'react';
import {Image, Modal, Pressable, StyleSheet, View} from 'react-native';

type ModalContextType = {
  showImageModal: (uri: string) => void;
  hideImageModal: () => void;
};

const ImageModalContext = createContext<ModalContextType | undefined>(
  undefined,
);

export const useImageModal = () => {
  const context = useContext(ImageModalContext);
  if (!context)
    throw new Error('useImageModal must be used within ImageModalProvider');
  return context;
};

export const ImageModalProvider = ({children}: {children: React.ReactNode}) => {
  const [visible, setVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const showImageModal = (uri: string) => {
    setImageUri(uri);
    setVisible(true);
  };

  const hideImageModal = () => {
    setVisible(false);
    setImageUri(null);
  };

  return (
    <ImageModalContext.Provider value={{showImageModal, hideImageModal}}>
      {children}

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={hideImageModal} />
          <View style={styles.modalContainer}>
            {imageUri && (
              <Image
                source={{uri: imageUri}}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </ImageModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
