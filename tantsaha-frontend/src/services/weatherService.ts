 import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHERAPI_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
  };
  humidity: number;
  wind_kph: number;
  wind_degree: number;      // AJOUTÉ ICI
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  feelslike_c: number;
  uv: number;
  last_updated: string;
  gust_kph?: number;        // Optionnel mais utile
  cloud?: number;           // Optionnel
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalsnow_cm: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise?: string;
    moonset?: string;
    moon_phase?: string;
    moon_illumination?: number;
  };
  hour: Array<{
    time_epoch: number;
    time: string;
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    precip_mm: number;
    humidity: number;
    chance_of_rain: number;
    chance_of_snow: number;
  }>;
}

export interface WeatherResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: CurrentWeather;
  forecast: {
    forecastday: ForecastDay[];
  };
}

class WeatherService {
  async getWeatherData(city: string = 'Antananarivo', days: number = 3): Promise<WeatherResponse> {
    try {
      const response = await axios.get<WeatherResponse>(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`
      );
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données météo:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Toerana tsy hita. Hamarino ny anaran\'ny tanàna.');
          case 401:
            throw new Error('Api Key diso. Jereo ny fichier .env.');
          case 403:
            throw new Error('Tsy manan-jo haka ny angona.');
          default:
            throw new Error(`Erreur API: ${error.response.data.error?.message || 'Tsy namantatra'}`);
        }
      } else if (error.request) {
        throw new Error('Tsy misy valiny avy amin\'ny serivisy. Jereo ny fifandraisana Internet.');
      } else {
        throw new Error('Olana teo am-pamoronana ny fangatahana: ' + error.message);
      }
    }
  }

  async getCurrentWeather(city: string = 'Antananarivo'): Promise<CurrentWeather> {
    const data = await this.getWeatherData(city, 1);
    return data.current;
  }

  async getForecast(city: string = 'Antananarivo', days: number = 3): Promise<ForecastDay[]> {
    const data = await this.getWeatherData(city, days);
    return data.forecast.forecastday;
  }

  getMalagasyCities(): Array<{name: string, region: string, coordinates: {lat: number, lon: number}}> {
    return [
      { name: 'Antananarivo', region: 'Analamanga', coordinates: { lat: -18.8792, lon: 47.5079 } },
      { name: 'Toamasina', region: 'Atsinanana', coordinates: { lat: -18.1499, lon: 49.4023 } },
      { name: 'Antsirabe', region: 'Vakinankaratra', coordinates: { lat: -19.8730, lon: 47.0291 } },
      { name: 'Mahajanga', region: 'Boeny', coordinates: { lat: -15.7167, lon: 46.3167 } },
      { name: 'Fianarantsoa', region: 'Haute Matsiatra', coordinates: { lat: -21.4536, lon: 47.0858 } },
      { name: 'Toliara', region: 'Atsimo-Andrefana', coordinates: { lat: -23.3500, lon: 43.6667 } },
      { name: 'Antsiranana', region: 'Diana', coordinates: { lat: -12.2768, lon: 49.2917 } },
      { name: 'Morondava', region: 'Menabe', coordinates: { lat: -20.2833, lon: 44.2833 } },
      { name: 'Sambava', region: 'Sava', coordinates: { lat: -14.2667, lon: 50.1667 } },
      { name: 'Ambilobe', region: 'Diana', coordinates: { lat: -13.2000, lon: 49.0500 } }
    ];
  }

  getWeatherIconUrl(iconUrl: string, size: '64x64' | '128x128' = '64x64'): string {
    if (!iconUrl) return '';
    
    if (iconUrl.startsWith('//')) {
      iconUrl = `https:${iconUrl}`;
    }
    
    return iconUrl.replace('64x64', size);
  }

  formatDateMalagasy(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('mg-MG', options);
  }

  getWeekdayMalagasy(dateString: string): string {
    const date = new Date(dateString);
    const weekdays = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'];
    return weekdays[date.getDay()];
  }
}

export default new WeatherService();