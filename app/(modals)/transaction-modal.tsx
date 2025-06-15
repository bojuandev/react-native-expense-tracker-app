import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Header from "@/components/header";
import ImageUpload from "@/components/image-upload";
import ModalWrapper from "@/components/modal-wrapper";
import Typo from "@/components/typo";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import useFetchData from "@/hooks/use-fetch-data";
import { deleteWallet } from "@/services/wallet-service";
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";

import Input from "@/components/input";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const TransactionModal = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [showdatepicker, setShowdatepicker] = useState(false);

  const oldTransaction: { name: string; image: string; id: string } =
    useLocalSearchParams();

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowdatepicker(Platform.OS === "ios" ? true : false);
  };

  /*   useEffect(() => {
    if (oldTransaction.id) {
      setTransaction({
        name: oldTransaction.name,
        image: oldTransaction.image,
      });
    }
  }, []); */

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;

    if (!walletId || !date || !amount || (type === "expense" && !category)) {
      Alert.alert("Transaction", "Please fill all the fields");
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid,
    };

    console.log("submit transaction -->", transactionData)
  };

  const onDelete = async () => {
    if (!oldTransaction.id) return;

    setLoading(true);
    const res = await deleteWallet(oldTransaction.id);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to do this? \nThis action will remove all the transactions related to this wallet",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10, minHeight: 50 }}
        />
      </View>
      {/* form */}
      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
      >
        {/* Transaction Type */}
        <View style={styles.inputContainer}>
          <Typo color={colors.neutral200} size={16}>
            Type
          </Typo>
          <Dropdown
            style={styles.dropdownContainer}
            activeColor={colors.neutral700}
            selectedTextStyle={styles.dropdownSelectedText}
            iconStyle={styles.dropdownIcon}
            data={transactionTypes}
            maxHeight={300}
            labelField="label"
            valueField="value"
            itemTextStyle={styles.dropdownItemText}
            itemContainerStyle={styles.dropdownItemContainer}
            containerStyle={styles.dropdownListcontainer}
            value={transaction.type}
            onChange={(item) => {
              setTransaction({ ...transaction, type: item.value });
            }}
          />
        </View>

        {/* wallets */}
        <View style={styles.inputContainer}>
          <Typo color={colors.neutral200} size={16}>
            Wallet
          </Typo>
          <Dropdown
            style={styles.dropdownContainer}
            activeColor={colors.neutral700}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelectedText}
            iconStyle={styles.dropdownIcon}
            data={wallets.map((wallet) => ({
              label: `${wallet.name} ($${wallet.amount})`,
              value: wallet?.id,
            }))}
            maxHeight={300}
            labelField="label"
            valueField="value"
            itemTextStyle={styles.dropdownItemText}
            itemContainerStyle={styles.dropdownItemContainer}
            containerStyle={styles.dropdownListcontainer}
            placeholder="Select Wallet"
            value={transaction.walletId}
            onChange={(item) => {
              setTransaction({ ...transaction, walletId: item.value || "" });
            }}
          />
        </View>

        {/* expense category */}
        {transaction.type === "expense" && (
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Expense Category
            </Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={Object.values(expenseCategories)}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListcontainer}
              placeholder="Select Category"
              value={transaction.category}
              onChange={(item) => {
                setTransaction({ ...transaction, category: item.value || "" });
              }}
            />
          </View>
        )}

        {/* datepicker */}
        <View style={styles.inputContainer}>
          <Typo color={colors.neutral200} size={16}>
            Date
          </Typo>
          {!showdatepicker && (
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowdatepicker(true)}
            >
              <Typo size={14}>
                {(transaction.date as Date).toLocaleDateString()}
              </Typo>
            </Pressable>
          )}
          {showdatepicker && (
            <View style={Platform.OS === "ios" && styles.iosDatePicker}>
              <DateTimePicker
                themeVariant="dark"
                value={transaction.date as Date}
                textColor={colors.white}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowdatepicker(false)}
                >
                  <Typo size={15} fontWeight={"500"}>
                    Ok
                  </Typo>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* amount */}
        <View style={styles.inputContainer}>
          <Typo color={colors.neutral200} size={16}>
            Amount
          </Typo>
          <Input
            keyboardType="numeric"
            value={transaction.amount?.toString()}
            onChangeText={(value) =>
              setTransaction({
                ...transaction,
                amount: Number(value.replace(/[^0-9]/g, "")),
              })
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.flexRow}>
            <Typo color={colors.neutral200} size={16}>
              Description
            </Typo>
            <Typo color={colors.neutral200} size={14}>
              (optional)
            </Typo>
          </View>
          <Input
            value={transaction.description}
            multiline
            containerStyle={{
              flexDirection: "row",
              height: verticalScale(100),
              alignItems: "flex-start",
              paddingVertical: 15,
            }}
            onChangeText={(value) =>
              setTransaction({
                ...transaction,
                description: value,
              })
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.flexRow}>
            <Typo color={colors.neutral200} size={16}>
              Receipt
            </Typo>
            <Typo color={colors.neutral200} size={14}>
              (optional)
            </Typo>
          </View>
          {/* image input */}
          <ImageUpload
            file={transaction.image}
            placeholder="Upload Image"
            onSelect={(file) => setTransaction({ ...transaction, image: file })}
            onClear={() => {
              setTransaction({ ...transaction, image: null });
            }}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {oldTransaction.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldTransaction.id ? "Update" : "submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
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
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropDown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {},
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderCurve: "continuous",
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListcontainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
});
