interface BlynkResponse {
  v1: number;
  v2: number;
}

interface SensorData {
  lpgValue: number;
  ldrValue: number;
  timestamp: Date;
}

const BLYNK_API_URL = 'https://bkynk.cloud/external/api/get?token=U0RJrf4qjZ3nCjRxjH_qXMQeVKAavnuB&V1&V2';

export const fetchSensorData = async (): Promise<SensorData> => {
  try {
    const response = await fetch(BLYNK_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlynkResponse = await response.json();
    
    return {
      lpgValue: data.v1 || 0,
      ldrValue: data.v2 || 0,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    throw error;
  }
};

// Fallback dummy data generator
export const generateFallbackData = (): SensorData => {
  return {
    lpgValue: Math.random() > 0.5 ? 1 : 0, // Digital sensor (0 or 1)
    ldrValue: Math.floor(Math.random() * 1024), // LDR sensor (0-1023)
    timestamp: new Date(),
  };
};
