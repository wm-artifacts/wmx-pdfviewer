import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';

interface PDFViewerProps {
  source: { uri: string } | string;
  style?: object;
  onLoadComplete?: (numberOfPages: number, filePath: string) => void;
  onError?: (error: any) => void;
  onPageChanged?: (page: number, numberOfPages: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  source,
  style = {},
  onLoadComplete,
  onError,
  onPageChanged,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoadComplete = (numberOfPages: number, filePath: string) => {
    setLoading(false);
    setError(null);
    console.log('PDF loaded successfully:', { numberOfPages, filePath });
    onLoadComplete && onLoadComplete(numberOfPages, filePath);
  };

  const handleError = (error: any) => {
    setLoading(false);
    setError(error?.message || 'Failed to load PDF');
    console.error('PDF load error:', error);
    onError && onError(error);
  };

  const handlePageChanged = (page: number, numberOfPages: number) => {
    console.log('Page changed:', { page, numberOfPages });
    onPageChanged && onPageChanged(page, numberOfPages);
  };

  // Normalize source to ensure it's in the correct format
  const normalizedSource = typeof source === 'string' ? { uri: source } : source;

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Text style={styles.errorText}>Error loading PDF: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      )}
      
      <Pdf
        source={normalizedSource}
        style={styles.pdf}
        onLoadComplete={handleLoadComplete}
        onError={handleError}
        onPageChanged={handlePageChanged}
        trustAllCerts={false}
        enablePaging={true}
        horizontal={false}
        spacing={10}
        enableRTL={false}
        enableAnnotationRendering={true}
        fitPolicy={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
});

export default PDFViewer; 
