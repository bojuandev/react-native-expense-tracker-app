import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Header from "@/components/header";
import ImageUpload from "@/components/image-upload";
import Input from "@/components/input";
import ModalWrapper from "@/components/modal-wrapper";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { updateUser } from "@/services/user-service";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

const WalletModal = () => {
  const router = useRouter();
  const { user, updateUserData } = useAuth();

  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    let { name, image } = wallet;

    if (!name.trim()) {
      Alert.alert("Wallet", "Please fill all the fields");
      return;
    }

    setLoading(true);
    const res = await updateUser(user?.uid as string, wallet);
    setLoading(false);

    if (res.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", res.msg);
    }
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      //setWallet({ ...wallet, image: result.assets[0] });
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="New Wallet"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
      </View>
      {/* form */}
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.inputContainer}>
          <Typo color={colors.neutral200}>Wallet Name</Typo>
          <Input
            placeholder="Salary"
            value={wallet.name}
            onChangeText={(value) => {
              setWallet({ ...wallet, name: value });
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Typo color={colors.neutral200}>Wallet Icon</Typo>
          {/* image input */}
          <ImageUpload
            file={wallet.image}
            placeholder="Upload Image"
            onSelect={(file) => setWallet({ ...wallet, image: file })}
            onClear={() => {
              setWallet({ ...wallet, image: null });
            }}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            Add wallet
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
    paddingHorizontal: spacingX._20,
  },
});
