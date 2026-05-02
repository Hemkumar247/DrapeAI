import React, { createContext, useContext, useState, ReactNode } from "react";
import { GarmentAnalysisResult, UserPhotoValidationResult } from "../services/ai";

export type GarmentInfo = {
  id: string;
  image: string;
  analysis: GarmentAnalysisResult;
};

type GlobalState = {
  garments: GarmentInfo[];
  setGarments: React.Dispatch<React.SetStateAction<GarmentInfo[]>>;
  userPhoto: string | null;
  setUserPhoto: (photo: string | null) => void;
  userPhotoValidation: UserPhotoValidationResult | null;
  setUserPhotoValidation: (v: UserPhotoValidationResult | null) => void;
  generatedImage: string | null;
  setGeneratedImage: (img: string | null) => void;
  caption: string | null;
  setCaption: (cap: string | null) => void;
};

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [garments, setGarments] = useState<GarmentInfo[]>([]);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userPhotoValidation, setUserPhotoValidation] = useState<UserPhotoValidationResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);

  return (
    <GlobalContext.Provider value={{
      garments, setGarments,
      userPhoto, setUserPhoto,
      userPhotoValidation, setUserPhotoValidation,
      generatedImage, setGeneratedImage,
      caption, setCaption
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalState() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalState must be used within GlobalProvider");
  return ctx;
}
