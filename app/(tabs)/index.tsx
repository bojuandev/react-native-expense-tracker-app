import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { useAuth } from "@/context/auth-context";
import React from "react";
import { StyleSheet } from "react-native";

const Home = () => {
  const { user } = useAuth();

  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
