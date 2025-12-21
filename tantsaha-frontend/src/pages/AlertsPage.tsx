 // src/pages/AlertsPage.tsx
import React, { useState } from 'react';
import { 
  FaExclamationTriangle, 
  FaBell, 
  FaFilter, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaSeedling,
  FaTree,
  FaCloudSunRain,
  FaWind,
  FaTemperatureHigh,
  FaBug,
  FaWater,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaRegBell,
  FaRegBellSlash,
  FaShareAlt,
  FaDownload,
  FaInfoCircle
} from 'react-icons/fa';

const AlertsPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Toutes');
  const [alertType, setAlertType] = useState<string>('Toutes');
  const [selectedSeason, setSelectedSeason] = useState<string>('Toutes');
  const [activeTab, setActiveTab] = useState<'active' | 'all' | 'subscriptions'>('active');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  
  // Régions malgaches
  const regions = [
    'Toutes', 'Analamanga', 'Atsinanana', 'Vakinankaratra', 'Boeny', 
    'Haute Matsiatra', 'Atsimo-Andrefana', 'Diana', 'Menabe', 'Sava', 'Bongolava'
  ];
  
  // Types d'alertes
  const alertTypes = [
    { id: 'weather', name: 'Toetrandro', color: 'bg-blue-100 text-blue-800', icon: <FaCloudSunRain /> },
    { id: 'cyclone', name: 'Rivotra mahery', color: 'bg-purple-100 text-purple-800', icon: <FaWind /> },
    { id: 'temperature', name: 'Maripana', color: 'bg-red-100 text-red-800', icon: <FaTemperatureHigh /> },
    { id: 'disease', name: 'Aretin-javamaniry', color: 'bg-yellow-100 text-yellow-800', icon: <FaBug /> },
    { id: 'water', name: 'Rano', color: 'bg-cyan-100 text-cyan-800', icon: <FaWater /> },
    { id: 'planting', name: 'Famafazana', color: 'bg-green-100 text-green-800', icon: <FaSeedling /> },
    { id: 'harvest', name: 'Fijinjana', color: 'bg-orange-100 text-orange-800', icon: <FaTree /> },
    { id: 'general', name: 'Torolalana', color: 'bg-gray-100 text-gray-800', icon: <FaInfoCircle /> }
  ];

  // Saisons agricoles à Madagascar
  const seasons = [
    'Toutes', 'Fahavaratra (Nov-Avr)', 'Ririnina (Mai-Août)', 
    'Lohataona (Sept-Oct)', 'Fararano (Mars-Avr)'
  ];

  // Données d'alertes simulées
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Rivotra mahery miandry amin\'ny faritra Atsinanana',
      description: 'Ny rivotra miady 60-80 km/h ary mety hisy fihararetana 100 km/h any ho any. Aza mivoaka an-dranomasina.',
      type: 'cyclone',
      region: 'Atsinanana',
      severity: 'critical',
      date: '2025-12-22',
      time: '14:30',
      duration: '48h',
      icon: <FaWind className="text-purple-600" />,
      crops: ['Vary', 'Mofo manga', 'Akondro'],
      action: 'Ampiaroy ny zana-kazo vao teraka. Ento ao anaty trano ny fitaovana fambolena.',
      source: 'Service Météo Malagasy',
      verified: true,
      active: true
    },
    {
      id: 2,
      title: 'Hafanana tafahoatra any amin\'ny faritra Boeny',
      description: 'Ny maripana miakatra 38°C. Mety ho simba ny ravinkazo raha tsy andoavana rano ampy.',
      type: 'temperature',
      region: 'Boeny',
      severity: 'high',
      date: '2025-12-21',
      time: '10:15',
      duration: '3 andro',
      icon: <FaTemperatureHigh className="text-red-600" />,
      crops: ['Katsaka', 'Manioka', 'Dôty'],
      action: 'Andramo ny fanondrahana rano alina na maraina. Apetaho tsara ny tany.',
      source: 'Ministère de l\'Agriculture',
      verified: true,
      active: true
    },
    {
      id: 3,
      title: 'Fitomboan\'ny valala any amin\'ny faritra Menabe',
      description: 'Hitan\'ny mpiasa ny valala maro any Menabe. Mety hihanika ny zava-maniry rehetra.',
      type: 'disease',
      region: 'Menabe',
      severity: 'high',
      date: '2025-12-20',
      time: '09:00',
      duration: '1 herinandro',
      icon: <FaBug className="text-yellow-600" />,
      crops: ['Vary', 'Voamamy', 'Legioma'],
      action: 'Mampiasà fanafody mpanefy valala. Jereo isan\'andro ny zava-maniry.',
      source: 'Centre de Recherche Agricole',
      verified: true,
      active: true
    },
    {
      id: 4,
      title: 'Andro tsara hanafarana voa karoty sy salady',
      description: 'Ny toetrandro ankehitriny mety amin\'ny famafazana voa karoty, salady, tongolo, ary anana.',
      type: 'planting',
      region: 'Analamanga',
      severity: 'info',
      date: '2025-12-19',
      time: '08:30',
      duration: '2 andro',
      icon: <FaSeedling className="text-green-600" />,
      crops: ['Karoty', 'Salady', 'Tongolo', 'Anana'],
      action: 'Ampiasao ny voa tsara. Ampetaho 2cm lalina ny voa. Ampondrao ny tany aloha.',
      source: 'Expert Agricole',
      verified: true,
      active: true
    },
    {
      id: 5,
      title: 'Tsy fahampian-drano any amin\'ny faritra Atsimo',
      description: 'Tsy nisy orana herinandro 2 lasa izay. Mety ho simba ny vokatra raha tsy ampidirina rano.',
      type: 'water',
      region: 'Atsimo-Andrefana',
      severity: 'medium',
      date: '2025-12-18',
      time: '16:45',
      duration: '1 volana',
      icon: <FaWater className="text-cyan-600" />,
      crops: ['Manioka', 'Katsaka', 'Voanjo'],
      action: 'Ampiasao ny rano amin\'ny fomba mahavoky. Aza mandondrana rano be loatra.',
      source: 'Service Hydrologique',
      verified: true,
      active: true
    },
    {
      id: 6,
      title: 'Fijinjana vary voalohany any Vakinankaratra',
      description: 'Efa maty ny vary voalohany any Vakinankaratra. Andro tsara hikarakarana ny fijinjana.',
      type: 'harvest',
      region: 'Vakinankaratra',
      severity: 'info',
      date: '2025-12-17',
      time: '11:20',
      duration: '1 herinandro',
      icon: <FaTree className="text-orange-600" />,
      crops: ['Vary'],
      action: 'Alao ny fitaovana fijinjana. Aza manemotra ny fijinjana fa mety ho latsaka ny kalitaon\'ny vary.',
      source: 'Coopérative Agricole',
      verified: true,
      active: false
    }
  ]);

  // Fonctions utilitaires pour compter les régions et cultures uniques
  const countUniqueRegions = () => {
    const activeRegions = alerts.filter(a => a.active).map(a => a.region);
    return Array.from(new Set(activeRegions)).length;
  };

  const countUniqueCrops = () => {
    const allCrops: string[] = [];
    alerts.forEach(alert => {
      allCrops.push(...alert.crops);
    });
    return Array.from(new Set(allCrops)).length;
  };

  // Filtrer les alertes selon les critères
  const filteredAlerts = alerts.filter(alert => {
    const regionMatch = selectedRegion === 'Toutes' || alert.region === selectedRegion;
    const typeMatch = alertType === 'Toutes' || alert.type === alertType;
    const seasonMatch = selectedSeason === 'Toutes';
    const activeMatch = activeTab === 'all' || (activeTab === 'active' && alert.active);
    
    return regionMatch && typeMatch && seasonMatch && activeMatch;
  });

  // Compter les alertes par type
  const getAlertCountByType = (typeId: string) => {
    return alerts.filter(alert => alert.type === typeId && alert.active).length;
  };

  // Couleur selon la sévérité
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Toggle notification settings
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    localStorage.setItem('weather_notifications', (!notificationsEnabled).toString());
  };

  // Marquer une alerte comme lue
  const markAsRead = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: false } : alert
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-red-200 shadow-sm bg-white/90 backdrop-blur-sm">
        <div className="container p-4 mx-auto md:p-6">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <h1 className="flex items-center text-2xl font-bold text-gray-800 md:text-3xl">
                <FaExclamationTriangle className="mr-3 text-red-600" />
                Fampandrenesana momba ny fambolena
              </h1>
              <p className="mt-1 text-gray-600">
                Tahiry sy torolalana ho an'ny tantsaha Malagasy
              </p>
            </div>
            
            <div className="flex items-center mt-4 space-x-4 md:mt-0">
              <button
                onClick={toggleNotifications}
                className={`flex items-center px-4 py-2 rounded-lg ${notificationsEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
              >
                {notificationsEnabled ? <FaRegBell className="mr-2" /> : <FaRegBellSlash className="mr-2" />}
                {notificationsEnabled ? 'Fampandrenesana alefa' : 'Nofoanana'}
              </button>
              
              <div className="relative">
                <FaBell className="text-2xl text-red-500" />
                {filteredAlerts.filter(a => a.active).length > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-600 rounded-full -top-2 -right-2">
                    {filteredAlerts.filter(a => a.active).length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container p-4 mx-auto md:p-6">
        {/* Statistiques rapides */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="p-4 bg-white border border-red-100 shadow rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fampandrenesana maika</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {alerts.filter(a => a.severity === 'critical' && a.active).length}
                  </p>
                </div>
                <FaExclamationTriangle className="text-2xl text-red-500" />
              </div>
            </div>
            
            <div className="p-4 bg-white border border-orange-100 shadow rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fampandrenesana ankehitriny</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {alerts.filter(a => a.active).length}
                  </p>
                </div>
                <FaBell className="text-2xl text-orange-500" />
              </div>
            </div>
            
            <div className="p-4 bg-white border border-blue-100 shadow rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faritra voakasik\'izany</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {countUniqueRegions()}
                  </p>
                </div>
                <FaMapMarkerAlt className="text-2xl text-blue-500" />
              </div>
            </div>
            
            <div className="p-4 bg-white border border-green-100 shadow rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Karazam-boly voakasik\'izany</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {countUniqueCrops()}
                  </p>
                </div>
                <FaSeedling className="text-2xl text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et navigation */}
        <div className="p-6 mb-8 bg-white shadow-lg rounded-2xl">
          <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
            <div className="flex mb-4 space-x-2 md:mb-0">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'active' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Mbola miseho ({alerts.filter(a => a.active).length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Rehetra ({alerts.length})
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <span className="text-gray-600">Sivana:</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Filtre région */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <FaMapMarkerAlt className="inline mr-2" />
                Faritra
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            {/* Filtre type */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <FaExclamationTriangle className="inline mr-2" />
                Karazana fampandrenesana
              </label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="Toutes">Rehetra</option>
                {alertTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            {/* Filtre saison */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <FaCalendarAlt className="inline mr-2" />
                Saison
              </label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Types d'alertes avec compteurs */}
          <div className="mt-6">
            <p className="mb-3 text-sm text-gray-600">Karazana fampandrenesana:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setAlertType('Toutes')}
                className={`px-3 py-1 rounded-full ${alertType === 'Toutes' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Rehetra ({alerts.length})
              </button>
              {alertTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setAlertType(type.id)}
                  className={`px-3 py-1 rounded-full flex items-center ${alertType === type.id ? type.color + ' border-2 border-gray-800' : 'bg-gray-50 text-gray-700'}`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.name} ({getAlertCountByType(type.id)})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des alertes */}
        <div className="space-y-6">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center bg-white shadow rounded-2xl">
              <FaCheckCircle className="mx-auto mb-4 text-4xl text-green-500" />
              <h3 className="text-xl font-bold text-gray-800">Tsy misy fampandrenesana</h3>
              <p className="mt-2 text-gray-600">Tsy misy fampandrenesana mifanaraka amin'ny sivana nataonao</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div key={alert.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 ${alert.severity === 'critical' ? 'border-red-500' : alert.severity === 'high' ? 'border-orange-500' : 'border-blue-500'}`}>
                <div className="p-6">
                  <div className="flex flex-col justify-between lg:flex-row lg:items-start">
                    <div className="flex-1">
                      <div className="flex items-start mb-4">
                        <div className="mt-1 mr-4">
                          {alert.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{alert.title}</h3>
                            <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${getSeverityColor(alert.severity)}`}>
                              {alert.severity === 'critical' ? 'MAIKA' : 
                               alert.severity === 'high' ? 'AVONY' : 
                               alert.severity === 'medium' ? 'ANTONONY' : 'FAMPANDREMENESANA'}
                            </span>
                            {alert.verified && (
                              <span className="flex items-center px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                                <FaCheckCircle className="mr-1" /> Nohamarinina
                              </span>
                            )}
                          </div>
                          
                          <p className="mb-4 text-gray-700">{alert.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
                            <div>
                              <p className="text-sm text-gray-600">Faritra</p>
                              <p className="flex items-center font-bold text-gray-800">
                                <FaMapMarkerAlt className="mr-2 text-red-500" /> {alert.region}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Daty</p>
                              <p className="flex items-center font-bold text-gray-800">
                                <FaCalendarAlt className="mr-2 text-blue-500" /> {alert.date}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Fotoana</p>
                              <p className="flex items-center font-bold text-gray-800">
                                <FaClock className="mr-2 text-green-500" /> {alert.time}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Faharetan\'izany</p>
                              <p className="font-bold text-gray-800">{alert.duration}</p>
                            </div>
                          </div>
                          
                          {/* Cultures affectées */}
                          <div className="mb-4">
                            <p className="mb-2 text-sm text-gray-600">Zavamaniry voakasik\'izany:</p>
                            <div className="flex flex-wrap gap-2">
                              {alert.crops.map((crop, index) => (
                                <span key={index} className="px-3 py-1 text-sm text-green-800 rounded-full bg-green-50">
                                  {crop}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Actions recommandées */}
                          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-xl">
                            <p className="mb-2 font-bold text-gray-800">🚨 Hevitra omena:</p>
                            <p className="text-gray-700">{alert.action}</p>
                          </div>
                          
                          <div className="flex items-center mt-4 text-sm text-gray-500">
                            <FaInfoCircle className="mr-2" />
                            Loharanon\'ny vaovao: {alert.source}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col mt-4 space-y-3 lg:ml-6 lg:mt-0">
                      {alert.active ? (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="flex items-center justify-center px-4 py-2 text-green-800 transition-colors bg-green-100 rounded-lg hover:bg-green-200"
                        >
                          <FaCheckCircle className="mr-2" />
                          Efa vakiana
                        </button>
                      ) : (
                        <span className="flex items-center justify-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">
                          <FaTimesCircle className="mr-2" />
                      Efa nodimandry
                        </span>
                      )}
                      
                      <button className="flex items-center justify-center px-4 py-2 text-blue-800 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200">
                        <FaShareAlt className="mr-2" />
                        Zarao
                      </button>
                      
                      <button className="flex items-center justify-center px-4 py-2 text-gray-800 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                        <FaDownload className="mr-2" />
                        Raiso
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Section abonnements */}
        <div className="p-6 mt-12 border border-blue-200 shadow-lg bg-gradient-to-r from-white to-blue-50 rounded-2xl">
          <h3 className="flex items-center mb-6 text-2xl font-bold text-gray-800">
            <FaBell className="mr-3 text-blue-600" />
            Hamando ny fampandrenesana
          </h3>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-800">Karazana fampandrenesana</h4>
              <div className="space-y-3">
                {alertTypes.map(type => (
                  <div key={type.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${type.color.replace('text-', 'text-white ').replace('bg-', 'bg-')}`}>
                        {type.icon}
                      </div>
                      <span className="font-medium">{type.name}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-800">Faritra iandrasana</h4>
              <div className="grid grid-cols-2 gap-3">
                {regions.filter(r => r !== 'Toutes').map(region => (
                  <div key={region} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
                    <input 
                      type="checkbox" 
                      id={`region-${region}`} 
                      className="w-5 h-5 mr-3 text-blue-600 rounded"
                      defaultChecked={['Analamanga', 'Atsinanana'].includes(region)}
                    />
                    <label htmlFor={`region-${region}`} className="font-medium">
                      {region}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="p-4 mt-6 bg-blue-50 rounded-xl">
                <h5 className="mb-2 font-bold text-blue-800">Fomba handraisana fampandrenesana</h5>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Antontan-taratasy</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Haika</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>SMS</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button className="px-6 py-3 font-bold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
              Tehirizo ny fanovana
            </button>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
          <div className="p-5 border border-red-200 bg-red-50 rounded-xl">
            <h4 className="mb-3 font-bold text-red-800">Inona no atao rehefa misy fampandrenesana maika?</h4>
            <ul className="space-y-2 text-red-700">
              <li className="flex items-start">
                <FaExclamationTriangle className="flex-shrink-0 mt-1 mr-2" />
                <span>Ampiova tsara ny fitaovanao fambolena</span>
              </li>
              <li className="flex items-start">
                <FaExclamationTriangle className="flex-shrink-0 mt-1 mr-2" />
                <span>Miantso ny governemanta raha ilaina</span>
              </li>
              <li className="flex items-start">
                <FaExclamationTriangle className="flex-shrink-0 mt-1 mr-2" />
                <span>Araho ny torolalana omena</span>
              </li>
            </ul>
          </div>
          
          <div className="p-5 border border-blue-200 bg-blue-50 rounded-xl">
            <h4 className="mb-3 font-bold text-blue-800">Loharano azo itokiana</h4>
            <ul className="space-y-2 text-blue-700">
              <li>Service Météo Malagasy</li>
              <li>Ministère de l'Agriculture</li>
              <li>Centre de Recherche Agricole</li>
              <li>Coopératives Agricoles</li>
            </ul>
          </div>
          
          <div className="p-5 border border-green-200 bg-green-50 rounded-xl">
            <h4 className="mb-3 font-bold text-green-800">Rohy manan-danja</h4>
            <ul className="space-y-2 text-green-700">
              <li>Làlana momba ny fiarovana</li>
              <li>Lisitry ny teny fampiasa</li>
              <li>Nomeraon\'ny vonjy taitra</li>
              <li>Tranon\'ny tantsaha</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;