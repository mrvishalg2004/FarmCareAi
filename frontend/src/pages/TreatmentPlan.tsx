import React, { useState } from 'react';
import { 
  Container, Box, Typography, TextField, Button, 
  FormControl, InputLabel, MenuItem, Select, 
  Card, CardContent, CircularProgress, Tabs, Tab,
  Alert, Grid, Paper,
  List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ScienceIcon from '@mui/icons-material/Science';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
  organicMatter: number;
}

interface TreatmentResult {
  success: boolean;
  message: string;
  tips?: {
    sowingTime: string;
    irrigation: string;
    pestControl: string;
    fertilizer: string;
  };
  treatmentSuggestions?: string[];
}

const initialSoilData: SoilData = {
  nitrogen: 0,
  phosphorus: 0,
  potassium: 0,
  ph: 7,
  moisture: 0,
  organicMatter: 0,
};

const crops = [
  "Rice", "Wheat", "Corn", "Potatoes", "Tomatoes", 
  "Lettuce", "Carrots", "Soybeans", "Cotton", "Sugarcane"
];

const TreatmentPlan: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [soilData, setSoilData] = useState<SoilData>(initialSoilData);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TreatmentResult | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Reset result when changing input method
    setResult(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSoilData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleCropChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    setSelectedCrop(e.target.value as string);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // For demo purposes, we'll use a mock API response
      // In a real app, you would send a request to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock soil analysis logic
      const mockAnalysis = analyzeSoil(soilData, selectedCrop);
      setResult(mockAnalysis);
    } catch (error) {
      console.error("Error processing soil data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Simple mock soil analysis logic
  const analyzeSoil = (soil: SoilData, crop: string): TreatmentResult => {
    // This is placeholder logic - in a real app, you'd have more sophisticated rules
    const isSuitable = (
      (crop === "Rice" && soil.moisture > 60 && soil.ph >= 5.5 && soil.ph <= 6.5) ||
      (crop === "Wheat" && soil.ph >= 6.0 && soil.ph <= 7.5 && soil.moisture >= 15 && soil.moisture <= 45) ||
      (crop === "Corn" && soil.ph >= 5.8 && soil.ph <= 7.0 && soil.nitrogen > 20) ||
      (crop === "Potatoes" && soil.ph >= 4.8 && soil.ph <= 6.5 && soil.potassium > 20) ||
      (soil.ph >= 5.5 && soil.ph <= 7.0) // Default case for other crops
    );

    if (isSuitable) {
      return {
        success: true,
        message: `Good news! Your soil is suitable for growing ${crop}.`,
        tips: {
          sowingTime: getSowingTime(crop),
          irrigation: getIrrigationTips(crop, soil.moisture),
          pestControl: getPestControlTips(crop),
          fertilizer: getFertilizerTips(soil, crop)
        }
      };
    } else {
      return {
        success: false,
        message: `Warning: Your soil needs treatment before planting ${crop}.`,
        treatmentSuggestions: getSoilTreatmentSuggestions(soil, crop)
      };
    }
  };

  // Helper functions for generating recommendations
  const getSowingTime = (crop: string): string => {
    const cropSowingTimes: Record<string, string> = {
      "Rice": "Early spring or late summer depending on your region",
      "Wheat": "Fall for winter wheat, early spring for spring wheat",
      "Corn": "2-3 weeks after the last spring frost when soil is warm",
      "Potatoes": "Early spring, 2 weeks before the last frost date",
      "Tomatoes": "After all danger of frost has passed",
      "Lettuce": "Early spring or fall in cooler temperatures",
      "Carrots": "3 weeks before the last frost date",
      "Soybeans": "Late spring when soil temperatures reach 55-60°F",
      "Cotton": "When soil temperature is consistently above 65°F",
      "Sugarcane": "Spring planting when temperatures are consistently warm"
    };

    return cropSowingTimes[crop] || "Spring or early summer depending on your climate";
  };

  const getIrrigationTips = (crop: string, moisture: number): string => {
    if (crop === "Rice") return "Maintain flooded conditions during most growth stages";
    if (crop === "Corn" || crop === "Potatoes") return "Regular irrigation, especially during tasseling/tuber formation";
    if (moisture < 30) return "Implement frequent irrigation scheduling with moisture sensors";
    return "Water regularly, ensuring soil stays moist but not waterlogged";
  };

  const getPestControlTips = (crop: string): string => {
    const pestTips: Record<string, string> = {
      "Rice": "Monitor for rice water weevil and rice stink bugs",
      "Wheat": "Watch for aphids, Hessian fly, and wheat stem sawfly",
      "Corn": "Scout for corn earworm, European corn borer, and rootworm",
      "Potatoes": "Prevent Colorado potato beetle and potato blight",
      "Tomatoes": "Watch for hornworms, whiteflies, and early blight",
    };

    return pestTips[crop] || "Implement IPM practices: regular scouting, beneficial insects, and targeted treatments only when necessary";
  };

  const getFertilizerTips = (soil: SoilData, crop: string): string => {
    if (soil.nitrogen < 20) return `Apply nitrogen-rich fertilizer (${crop === "Legumes" ? "minimal amounts" : "higher amounts"})`;
    if (soil.phosphorus < 20) return "Add phosphorus to promote root development and flowering";
    if (soil.potassium < 20) return "Supplement with potassium for improved crop quality and disease resistance";
    return "Apply balanced fertilizer according to crop growth stage, focusing on organic options when possible";
  };

  const getSoilTreatmentSuggestions = (soil: SoilData, crop: string): string[] => {
    const suggestions = [];

    if (soil.ph < 5.5) suggestions.push("Increase soil pH by adding agricultural lime");
    if (soil.ph > 7.5) suggestions.push("Lower soil pH by adding sulfur or sulfur-containing amendments");
    
    if (soil.organicMatter < 3) suggestions.push("Add compost or well-rotted manure to improve organic matter content");
    
    if (soil.moisture < 20) suggestions.push("Improve soil structure with organic matter to increase water retention");
    if (soil.moisture > 80) suggestions.push("Improve drainage through raised beds or drainage systems");
    
    if (soil.nitrogen < 20) suggestions.push("Apply nitrogen fertilizer or plant leguminous cover crops");
    if (soil.phosphorus < 15) suggestions.push("Add phosphate fertilizers or bone meal");
    if (soil.potassium < 15) suggestions.push("Add potassium-rich amendments like wood ash or greensand");

    return suggestions.length > 0 ? suggestions : ["Conduct a comprehensive soil test for detailed treatment recommendations"];
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
          <AgricultureIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Soil Treatment Plans
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom align="center" color="textSecondary">
          Get personalized soil treatment recommendations based on soil data and your chosen crop
        </Typography>

        <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
            <Tab label="Manual Input" />
            <Tab label="File Upload" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            {/* Tab Panel for Manual Input */}
            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Soil Parameters
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nitrogen (ppm)"
                        name="nitrogen"
                        type="number"
                        value={soilData.nitrogen}
                        onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phosphorus (ppm)"
                        name="phosphorus"
                        type="number"
                        value={soilData.phosphorus}
                        onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Potassium (ppm)"
                        name="potassium"
                        type="number"
                        value={soilData.potassium}
                        onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="pH Level"
                        name="ph"
                        type="number"
                        value={soilData.ph}
                        onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 0, max: 14, step: 0.1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Moisture (%)"
                        name="moisture"
                        type="number"
                        value={soilData.moisture}
                        onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Organic Matter (%)"
                        name="organicMatter"
                        type="number"
                        value={soilData.organicMatter}
                        onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    <AgricultureIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Crop Selection
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Select Crop</InputLabel>
                    <Select
                      value={selectedCrop}
                      onChange={handleCropChange}
                      label="Select Crop"
                      required
                    >
                      {crops.map(crop => (
                        <MenuItem key={crop} value={crop}>{crop}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      type="submit"
                      size="large"
                      disabled={loading || !selectedCrop}
                      sx={{ px: 4, py: 1 }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Get Treatment Plan"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Tab Panel for File Upload */}
            {tabValue === 1 && (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    border: '2px dashed #ccc', 
                    borderRadius: 2, 
                    p: 5, 
                    mb: 3,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <input
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    id="soil-file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="soil-file-upload">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 2 }}
                    >
                      Upload Soil Test Report
                    </Button>
                  </label>
                  
                  {file && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Selected file: {file.name}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Upload soil test report (PDF or image)
                  </Typography>
                </Box>
                
                <FormControl fullWidth sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                  <InputLabel>Select Crop</InputLabel>
                  <Select
                    value={selectedCrop}
                    onChange={handleCropChange}
                    label="Select Crop"
                    required
                  >
                    {crops.map(crop => (
                      <MenuItem key={crop} value={crop}>{crop}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  size="large"
                  disabled={loading || !file || !selectedCrop}
                  sx={{ px: 4, py: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Analyze & Get Treatment Plan"}
                </Button>
                
                <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
                  Note: File upload feature is a demo only. In a production environment, this would send the file to our backend for soil analysis.
                </Typography>
              </Box>
            )}
          </form>
        </Paper>

        {/* Results Section */}
        {result && (
          <Card elevation={4} sx={{ mt: 4, borderRadius: 2, borderTop: result.success ? '5px solid #4caf50' : '5px solid #f44336' }}>
            <CardContent>
              <Alert severity={result.success ? "success" : "warning"} sx={{ mb: 3 }}>
                <Typography variant="h6">{result.message}</Typography>
              </Alert>

              {result.success ? (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', mt: 2 }}>
                    Recommendations for Better Yield
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">Sowing Time</Typography>
                          <Typography variant="body2">{result.tips?.sowingTime}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">Irrigation</Typography>
                          <Typography variant="body2">{result.tips?.irrigation}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">Pest Control</Typography>
                          <Typography variant="body2">{result.tips?.pestControl}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">Fertilizer</Typography>
                          <Typography variant="body2">{result.tips?.fertilizer}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f', mt: 2 }}>
                    Soil Treatment Suggestions
                  </Typography>
                  
                  <List>
                    {result.treatmentSuggestions?.map((suggestion, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ArrowRightIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary={suggestion} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default TreatmentPlan;
