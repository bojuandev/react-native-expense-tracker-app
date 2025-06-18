import BackButton from "@/components/back-button";
import Header from "@/components/header";
import Input from "@/components/input";
import ModalWrapper from "@/components/modal-wrapper";
import TransactionList from "@/components/transaction-list";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import useFetchData from "@/hooks/use-fetch-data";
import { TransactionType } from "@/types";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";

import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const SearchModal = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];

  const {
    data: allTransactions,
    error,
    loading: transactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  console.log("Transactions -->", allTransactions)

  const filteredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search?.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title="Search"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
      </View>
      {/* form */}
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="shoes ..."
            value={search}
            containerStyle={{ backgroundColor: colors.neutral800 }}
            placeholderTextColor={colors.neutral400}
            onChangeText={(value) => {
              setSearch(value);
            }}
          />
        </View>

        <View>
          <TransactionList
            loading={transactionsLoading}
            data={filteredTransactions}
            emptyListMessage="No transactions match our search keywords"
          />
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },

  form: {
    flex: 1,
    gap: spacingY._30,
    marginTop: spacingY._15,
    justifyContent: "flex-start",
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },

  inputContainer: {
    gap: spacingY._10,
    paddingHorizontal: spacingX._20,
  },
});
