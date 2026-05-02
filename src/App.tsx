import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/Layout";
import { GlobalProvider } from "./store/GlobalContext";
import { HomeScreen } from "./pages/HomeScreen";
import { AddGarmentScreen } from "./pages/AddGarmentScreen";
import { AddUserPhotoScreen } from "./pages/AddUserPhotoScreen";
import { GeneratingScreen } from "./pages/GeneratingScreen";
import { ResultScreen } from "./pages/ResultScreen";

import { WardrobeScreen } from "./pages/WardrobeScreen";
import { GarmentGalleryScreen } from "./pages/GarmentGalleryScreen";

export default function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/add-garment" element={<AddGarmentScreen />} />
            <Route path="/add-user-photo" element={<AddUserPhotoScreen />} />
            <Route path="/generating" element={<GeneratingScreen />} />
            <Route path="/result" element={<ResultScreen />} />
            <Route path="/wardrobe" element={<WardrobeScreen />} />
            <Route path="/gallery" element={<GarmentGalleryScreen />} />
          </Route>

        </Routes>
      </Router>
    </GlobalProvider>
  );
}
