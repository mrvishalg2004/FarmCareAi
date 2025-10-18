import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency, getCropColor } from '../utils/helpers';

const CropRecommendationResults = ({ data }) => {
  if (!data) return null;

  const { crop_recommendations, soil_treatments, rotation_plan, market_analysis, crop_advisory } = data;

  // Prepare data for charts
  const profitData = crop_recommendations
    .filter(crop => crop.status === 'Recommended')
    .slice(0, 5)
    .map(crop => ({
      name: crop.crop.charAt(0).toUpperCase() + crop.crop.slice(1),
      profit: parseFloat(crop.estimated_profit.replace(/[₹,]/g, '')),
      cost: parseFloat(crop.estimated_cost.replace(/[₹,]/g, '')),
      margin: crop.profit_margin
    }));

  const cropTypeData = rotation_plan.reduce((acc, plan) => {
    const existing = acc.find(item => item.type === plan.crop_type);
    if (existing) {
      existing.count += 1;
      existing.profit += plan.estimated_profit;
    } else {
      acc.push({
        type: plan.crop_type,
        count: 1,
        profit: plan.estimated_profit
      });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'falling':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDemandColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Crop Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Award className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Recommended Crops</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {crop_recommendations.slice(0, 6).map((crop, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                crop.status === 'Recommended'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg capitalize">{crop.crop}</h3>
                {crop.status === 'Recommended' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Suitability:</span>
                  <span className="font-medium">{crop.agronomic_score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">{crop.estimated_cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit:</span>
                  <span className={`font-medium ${
                    crop.estimated_profit !== 'N/A' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {crop.estimated_profit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Season:</span>
                  <span className="font-medium">{crop.growing_season}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Water:</span>
                  <span className="font-medium">{crop.water_requirement}</span>
                </div>
              </div>
              
              {crop.status !== 'Recommended' && (
                <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                  {crop.status}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Profit Comparison Chart */}
        {profitData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Profit Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₹${value / 1000}K`} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'profit' ? formatCurrency(value) : formatCurrency(value),
                    name === 'profit' ? 'Profit' : 'Cost'
                  ]}
                />
                <Bar dataKey="cost" fill="#ef4444" name="Cost" />
                <Bar dataKey="profit" fill="#10b981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Soil Treatment Recommendations */}
      {soil_treatments && soil_treatments.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Soil Treatment Required</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {soil_treatments.map((treatment, index) => (
              <div key={index} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                <h3 className="font-semibold text-lg mb-2">{treatment.parameter}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="font-medium">{treatment.current_value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Optimal Range:</span>
                    <span className="font-medium">
                      {treatment.optimal_range.min} - {treatment.optimal_range.max} {treatment.optimal_range.unit}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="font-medium text-orange-800">{treatment.treatment_suggestion}</p>
                    <p className="text-sm text-gray-600 mt-1">{treatment.fertilizer_recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Analysis */}
      {market_analysis && market_analysis.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Market Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {market_analysis.map((market, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold capitalize">{market.crop}</h3>
                  {getTrendIcon(market.price_trend)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Price:</span>
                    <span className="font-medium">{formatCurrency(market.current_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trend:</span>
                    <span className={`font-medium capitalize ${
                      market.price_trend === 'rising' ? 'text-green-600' :
                      market.price_trend === 'falling' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {market.price_trend}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Demand:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDemandColor(market.demand_level)}`}>
                      {market.demand_level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-Year Rotation Plan */}
      {rotation_plan && rotation_plan.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">3-Year Crop Rotation Plan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {rotation_plan.map((plan, index) => (
              <div key={index} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Year {plan.year}</h3>
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {plan.season}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium capitalize">{plan.recommended_crop}</p>
                  <p className="text-sm text-gray-600 capitalize">Type: {plan.crop_type}</p>
                  <p className="text-sm font-medium text-green-600">
                    Est. Profit: {formatCurrency(plan.estimated_profit)}
                  </p>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Benefits:</p>
                    <ul className="text-xs space-y-1">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-gray-600">• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rotation Plan Visualization */}
          {cropTypeData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Crop Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cropTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, count }) => `${type} (${count})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {cropTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Crop Advisory */}
      {crop_advisory && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Crop Advisory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crop_advisory.weather_alert && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-yellow-800">Weather Alert</h3>
                </div>
                <p className="text-yellow-700">{crop_advisory.weather_alert}</p>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Planting Recommendation</h3>
              <p className="text-blue-700">{crop_advisory.planting_recommendation}</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Irrigation Advice</h3>
              <p className="text-green-700">{crop_advisory.irrigation_advice}</p>
            </div>
            
            {crop_advisory.pest_warning && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="font-semibold text-red-800">Pest Warning</h3>
                </div>
                <p className="text-red-700">{crop_advisory.pest_warning}</p>
              </div>
            )}
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Harvest Timing</h3>
              <p className="text-purple-700">{crop_advisory.harvest_timing}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropRecommendationResults;
