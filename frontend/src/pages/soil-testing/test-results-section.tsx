{/* Test details and results */}
                    {test.status === 'completed' && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium text-gray-800 mb-2">Test Results</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {test.ph_level && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">pH Level:</span>
                              <span className="text-sm font-medium">
                                {test.ph_level} 
                                {test.ph_level < 6 ? ' (Acidic)' : test.ph_level > 7.5 ? ' (Alkaline)' : ' (Good)'}
                              </span>
                            </div>
                          )}
                          {test.nitrogen_level && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Nitrogen:</span>
                              <span className="text-sm font-medium">
                                {test.nitrogen_level < 40 ? 'Low' : test.nitrogen_level < 80 ? 'Medium' : 'High'}
                              </span>
                            </div>
                          )}
                          {test.phosphorus_level && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Phosphorus:</span>
                              <span className="text-sm font-medium">
                                {test.phosphorus_level < 20 ? 'Low' : test.phosphorus_level < 40 ? 'Medium' : 'High'}
                              </span>
                            </div>
                          )}
                          {test.potassium_level && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Potassium:</span>
                              <span className="text-sm font-medium">
                                {test.potassium_level < 150 ? 'Low' : test.potassium_level < 250 ? 'Medium' : 'High'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No soil tests scheduled yet.</p>
              <p className="mt-2">Schedule your first test to get started.</p>
            </div>
          )}
        </motion.div>
