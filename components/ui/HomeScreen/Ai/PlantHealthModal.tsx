import { formatAnalysisResponse } from "@/utils/formattedAiResonse";
import { ImageAnalysis } from "@/utils/geminiImageAnalysis";
import { ImageAnalysisPrompt } from "@/utils/prompt";
import { theme } from "@/utils/theme";
import { getAddress } from "@/utils/userdata";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface ImageData {
  uri: string;
  mimetype?: string;
  base64?: string;
}

interface PlantHealthModalProps {
  visible: boolean;
  imageData: ImageData | null;
  onClose: () => void;
}

const PlantHealthModal: React.FC<PlantHealthModalProps> = ({
  visible,
  imageData,
  onClose,
}) => {
  const [analysisText, setAnalysisText] = useState<string | any>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && imageData) {
      startImageAnalysis();
    }
  }, [visible, imageData]);

  const getCountry = async () => {
    const address = await getAddress();
    return address?.country || "International";
  }

  const startImageAnalysis = async () => {
    try {
      setProcessing(true);
      setAnalysisText(null);
      setError(null);

      const imageBase = {
        inlineData: {
          data: imageData?.base64,
          mimeType: imageData?.mimetype || "image/jpeg",
        },
      };

      const result = await ImageAnalysis(imageBase, ImageAnalysisPrompt(await getCountry()));
      setAnalysisText(result?.data );
//       setAnalysisText(`Answer: 
// ### Image Analysis Results
// Here is the breakdown of the uploaded image:
// 1. Composition: The image shows a high-contrast landscape.
// 2. Lighting: Natural sunlight coming from the top-right corner.
// * Color Palette: Features deep blues and vibrant oranges.
// * Subject: A mountain range reflecting in a lake.

// Overall, the image is professionally shot. You might want to:
// * Increase the brightness slightly.
// * Crop the left edge for better symmetry.

// Thank you for using the AI Analyzer.`)
      console.log("Image analysis result:", result?.data);
    } catch (err) {
      setError("Our AI gardener is busy. Please try again shortly.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={styles.fullScreenContainer}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeArea}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#2C3E50" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Florix Bot Analysis</Text>
            <TouchableOpacity style={styles.actionButton} onPress={startImageAnalysis}>
              <Ionicons name="refresh" size={20} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Image Preview Card */}
            <View style={styles.imageContainer}>
              {imageData && (
                <Image source={{ uri: imageData.uri }} style={styles.mainImage} />
              )}
              <View
                style={[
                  styles.scanBadge,
                  { backgroundColor: error ? '#D32F2F' : '#5D8A6F' } // green if active, red if error
                ]}
              >
                <MaterialIcons name="auto-awesome" size={16} color="#FFF" />
                <Text style={styles.scanBadgeText}>
                  {error ? 'FLORIX BOT INACTIVE' : 'FLORIX BOT ACTIVE'}
                </Text>
              </View>

            </View>

            {/* Status Section */}
            {processing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Analyzing Plant Patterns...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorCard}>
                <Ionicons name="alert-circle" size={24} color="#D32F2F" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Analysis Result */}
            {analysisText && !processing && (
              <View style={styles.resultWrapper}>
                <View style={styles.resultHeader}>
                  <MaterialIcons name="psychology" size={24} color="#2C3E50" />
                  <Text style={styles.resultTitle}>Diagnosis Report</Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.resultBody}>{formatAnalysisResponse(analysisText)}</Text>

                <TouchableOpacity style={styles.doneButton} onPress={onClose} activeOpacity={0.85}>
                  <Text style={styles.doneButtonText}>Got it, thanks!</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default PlantHealthModal;

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#F0F4F0", // Soft botanical white/grey
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F0F4F0",
    marginTop: 0,
    paddingTop:6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C3E50",
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
  },
  actionButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  imageContainer: {
    width: width * 0.92,
    height: height * 0.4,
    alignSelf: "center",
    borderRadius: 28,
    overflow: "hidden",
    marginTop: 10,
    elevation: 5,
    backgroundColor: "#000",
    position: 'relative',
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scanBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  scanBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 5,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    margin: 20,
    padding: 15,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#D32F2F",
  },
  errorText: {
    marginLeft: 10,
    color: "#D32F2F",
    fontWeight: "500",
    flex: 1,
  },
  resultWrapper: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: -30, // Overlap onto the image slightly
    borderRadius: 24,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C3E50",
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F8E9",
    marginBottom: 15,
  },
  resultBody: {
    fontSize: 15,
    lineHeight: 24,
    color: "#37474F",
    textAlign: "justify",
  },
  doneButton: {
    backgroundColor: "#5D8A6F",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 25,
  },
  doneButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});