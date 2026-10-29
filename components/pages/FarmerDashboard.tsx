import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '../../types';
import { ROUTES } from '../../constants';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useWeatherData } from '../../hooks/useWeatherData';
import { useMLPredictions } from '../../hooks/useMLPredictions';
import { useAgriNews } from '../../hooks/useAgriNews';
import { getDashboardSummary, getLivePrices, getPricePrediction } from '../../services/mandi/mandiApi';
import { getPopularSchemes } from '../../services/schemeService';
import { INDIAN_CITIES, weatherCodeToDescription } from '../../services/weather/openMeteo';
import { LivePrice, MandiDashboardSummary, PriceForecast } from '../../types/mandi';
import { Scheme } from '../../types/scheme';
import { WeatherAlert } from '../../types/weather';

const QUICK_ACTIONS = [
  { label: 'Weather', icon: 'fas fa-cloud-sun', section: Section.WEATHER, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { label: 'Crop Advice', icon: 'fas fa-seedling', section: Section.CROP_RECOMMENDER, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { label: 'Disease Check', icon: 'fas fa-bug', section: Section.DISEASE_DETECTION, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  { label: 'Mandi Prices', icon: 'fas fa-store', section: Section.MANDI, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  { label: 'Govt Schemes', icon: 'fas fa-landmark', section: Section.SCHEMES, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  { label: 'Equipment', icon: 'fas fa-tractor', section: Section.EQUIPMENT_RECOMMENDER, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
];

const PRICE_COLORS = ['#10b981', '#f59e0b', '#8b5cf6'];

interface DashboardAlert {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getCurrentSeason(): { label: string; key: 'Kharif' | 'Rabi' | 'Zaid' } {
  const month = new Date().getMonth();
  if (month >= 5 && month <= 9) return { label: 'Kharif (Jun-Oct)', key: 'Kharif' };
  if (month >= 10 || month <= 1) return { label: 'Rabi (Oct-Mar)', key: 'Rabi' };
  return { label: 'Zaid (Mar-Jun)', key: 'Zaid' };
}

function timeAgo(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diff) || diff < 0) return 'Just now';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function newsIcon(category?: string): { icon: string; color: string } {
  switch (category) {
    case 'government': return { icon: 'fas fa-landmark', color: 'text-emerald-600' };
    case 'market': return { icon: 'fas fa-chart-line', color: 'text-amber-600' };
    case 'weather': return { icon: 'fas fa-cloud-rain', color: 'text-blue-600' };
    case 'technology': return { icon: 'fas fa-robot', color: 'text-purple-600' };
    case 'schemes': return { icon: 'fas fa-hand-holding-dollar', color: 'text-indigo-600' };
    case 'crop-disease': return { icon: 'fas fa-bug', color: 'text-red-600' };
    default: return { icon: 'fas fa-newspaper', color: 'text-gray-500' };
  }
}

function CircularProgress({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500';
  const label = score >= 75 ? 'Healthy' : score >= 50 ? 'Moderate' : 'Needs Attention';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={color}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-semibold ${color}`}>{label}</span>
    </div>
  );
}

const FarmerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { weatherData, loading: weatherLoading, error: weatherError, fetchWeather } = useWeatherData();
  const predictions = useMLPredictions(weatherData);
  const { articles: newsArticles } = useAgriNews();

  const [mandiSummary, setMandiSummary] = useState<MandiDashboardSummary | null>(null);
  const [livePrices, setLivePrices] = useState<LivePrice[]>([]);
  const [priceForecasts, setPriceForecasts] = useState<PriceForecast[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [mandiLoading, setMandiLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const greeting = useMemo(() => getGreeting(), []);
  const today = useMemo(() => formatDate(), []);
  const season = useMemo(() => getCurrentSeason(), []);

  const location = useMemo(() => {
    const district = user?.district?.toLowerCase();
    const state = user?.state?.toLowerCase();
    return (
      INDIAN_CITIES.find((city) => city.name.toLowerCase() === district) ??
      INDIAN_CITIES.find((city) => city.admin1?.toLowerCase() === state) ??
      INDIAN_CITIES[0]
    );
  }, [user?.district, user?.state]);

  useEffect(() => {
    fetchWeather(location.latitude, location.longitude);
  }, [fetchWeather, location.latitude, location.longitude]);

  useEffect(() => {
    let active = true;

    const loadMandi = async () => {
      setMandiLoading(true);
      try {
        const [summary, prices] = await Promise.all([getDashboardSummary(), getLivePrices()]);
        if (!active) return;

        setMandiSummary(summary);
        setLivePrices(prices);

        const uniqueCrops = Array.from(new Set(
          [...prices]
            .sort((a, b) => b.modalPrice - a.modalPrice)
            .map((price) => price.crop)
        )).slice(0, 3);

        const forecasts = await Promise.all(uniqueCrops.map((crop) => {
          const price = prices.find((item) => item.crop === crop)!;
          return getPricePrediction(crop, price.modalPrice, {
            state: price.state,
            district: price.district,
            season: season.key,
            month: new Date().toLocaleString('en-US', { month: 'long' }),
          });
        }));

        if (active) setPriceForecasts(forecasts);
      } catch {
        if (active) {
          setMandiSummary(null);
          setLivePrices([]);
          setPriceForecasts([]);
        }
      } finally {
        if (active) setMandiLoading(false);
      }
    };

    loadMandi();
    return () => { active = false; };
  }, [season.key]);

  useEffect(() => {
    setSchemes(getPopularSchemes(user?.state).slice(0, 3));
  }, [user?.state]);

  const current = weatherData?.current;
  const todayWeather = weatherData?.daily[0];
  const topDisease = predictions?.diseaseRisks[0];

  const topPrices = useMemo(() => {
    const seen = new Set<string>();
    return [...livePrices]
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .filter((price) => {
        if (seen.has(price.crop)) return false;
        seen.add(price.crop);
        return true;
      })
      .slice(0, 4);
  }, [livePrices]);

  const priceChartData = useMemo(() => {
    if (priceForecasts.length === 0) return [];
    const points = Math.min(...priceForecasts.map((forecast) => forecast.history.length));
    const start = Math.max(0, points - 7);

    return Array.from({ length: 7 }, (_, index) => {
      const row: Record<string, string | number> = {
        date: priceForecasts[0].history[start + index]?.date ?? '',
      };
      priceForecasts.forEach((forecast, forecastIndex) => {
        row[`crop${forecastIndex}`] = forecast.history[start + index]?.price ?? 0;
      });
      return row;
    });
  }, [priceForecasts]);

  const rainChartData = useMemo(() => {
    return (weatherData?.daily ?? []).slice(0, 7).map((day) => ({
      day: new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' }),
      rainfall: Number(day.rainSum.toFixed(1)),
    }));
  }, [weatherData]);

  const conditionRadarData = useMemo(() => {
    if (!current || !todayWeather) return [];

    const tempScore = current.temperature >= 18 && current.temperature <= 32
      ? 100
      : current.temperature >= 10 && current.temperature <= 38
        ? 65
        : 30;
    const humidityScore = current.humidity >= 40 && current.humidity <= 80
      ? 100
      : current.humidity >= 30 && current.humidity <= 90
        ? 65
        : 30;
    const windScore = current.windSpeed < 20 ? 100 : current.windSpeed < 35 ? 60 : 25;
    const rainScore = 100 - todayWeather.precipitationProbabilityMax;
    const uvScore = clampScore(100 - current.uvIndex * 10);

    return [
      { subject: 'Temperature', value: tempScore, full: 100 },
      { subject: 'Humidity', value: humidityScore, full: 100 },
      { subject: 'Wind', value: windScore, full: 100 },
      { subject: 'Rain safety', value: rainScore, full: 100 },
      { subject: 'UV safety', value: uvScore, full: 100 },
      { subject: 'Farm health', value: predictions?.agricultureHealthScore ?? 0, full: 100 },
    ];
  }, [current, todayWeather, predictions?.agricultureHealthScore]);

  const alerts = useMemo(() => {
    const list: DashboardAlert[] = [];

    const severityStyles: Record<WeatherAlert['severity'], Pick<DashboardAlert, 'color' | 'bg' | 'border'>> = {
      high: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500' },
      medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-amber-500' },
      low: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' },
    };

    (predictions?.alerts ?? []).forEach((alert) => {
      const styles = severityStyles[alert.severity];
      list.push({
        id: alert.id,
        icon: alert.type === 'rain' ? 'fas fa-cloud-showers-heavy'
          : alert.type === 'wind' ? 'fas fa-wind'
            : alert.type === 'heat' ? 'fas fa-temperature-high'
              : alert.type === 'cold' ? 'fas fa-snowflake'
                : alert.type === 'uv' ? 'fas fa-sun'
                  : 'fas fa-cloud',
        title: alert.title,
        desc: alert.message,
        ...styles,
      });
    });

    const topMover = topPrices[0];
    if (topMover && Math.abs(topMover.change) >= 3) {
      list.push({
        id: `mandi-${topMover.id}`,
        icon: topMover.change >= 0 ? 'fas fa-arrow-trend-up' : 'fas fa-arrow-trend-down',
        title: `${topMover.crop} price ${topMover.change >= 0 ? 'up' : 'down'} ${Math.abs(topMover.change)}%`,
        desc: `Modal price is ₹${topMover.modalPrice.toLocaleString('en-IN')}/quintal at ${topMover.mandi}.`,
        color: topMover.change >= 0 ? 'text-emerald-600' : 'text-red-600',
        bg: topMover.change >= 0 ? 'bg-emerald-50' : 'bg-red-50',
        border: topMover.change >= 0 ? 'border-l-emerald-500' : 'border-l-red-500',
      });
    }

    if (topDisease?.risk === 'high') {
      list.push({
        id: `disease-${topDisease.disease}`,
        icon: 'fas fa-bug',
        title: `${topDisease.disease} risk is high`,
        desc: `${topDisease.probability}% risk based on current humidity and temperature. Inspect crops and consider preventive action.`,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-l-red-500',
      });
    }

    return list;
  }, [predictions?.alerts, topPrices, topDisease]);

  const tips = useMemo(() => {
    if (!predictions) return [];
    const advisory = predictions.advisory;
    return [
      { tip: advisory.irrigation.recommendation, icon: 'fas fa-droplet', color: 'text-blue-600', bg: 'bg-blue-50' },
      { tip: advisory.spraying.recommendation, icon: 'fas fa-spray-can-sparkles', color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { tip: advisory.harvesting.recommendation, icon: 'fas fa-wheat-awn', color: 'text-amber-600', bg: 'bg-amber-50' },
      { tip: advisory.planting.recommendation, icon: 'fas fa-seedling', color: 'text-purple-600', bg: 'bg-purple-50' },
    ];
  }, [predictions]);

  const activities = useMemo(() => {
    const items: { text: string; time: string; icon: string; color: string }[] = [];

    if (weatherData) {
      items.push({
        text: `Weather updated for ${weatherData.location.name}`,
        time: 'Just now',
        icon: 'fas fa-cloud-sun',
        color: 'text-blue-600',
      });
    }
    if (mandiSummary) {
      items.push({
        text: `Mandi prices synced — ${mandiSummary.highestPriceCrop} leads at ₹${mandiSummary.highestPriceValue.toLocaleString('en-IN')}`,
        time: 'Just now',
        icon: 'fas fa-store',
        color: 'text-emerald-600',
      });
    }
    if (schemes.length > 0) {
      items.push({
        text: `${schemes.length} government schemes matched for your profile`,
        time: 'Just now',
        icon: 'fas fa-landmark',
        color: 'text-indigo-600',
      });
    }
    if (predictions) {
      items.push({
        text: `AI advisory generated — ${predictions.rainPrediction.recommendation}`,
        time: 'Just now',
        icon: 'fas fa-wand-magic-sparkles',
        color: 'text-purple-600',
      });
    }
    if (newsArticles.length > 0) {
      items.push({
        text: `Latest news: ${newsArticles[0].title}`,
        time: timeAgo(newsArticles[0].pubDate),
        icon: 'fas fa-newspaper',
        color: 'text-amber-600',
      });
    }

    return items.slice(0, 5);
  }, [weatherData, mandiSummary, schemes, predictions, newsArticles]);

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.id));

  const goToSection = (sectionId: string) => {
    navigate(ROUTES.HOME, { state: { scrollTo: sectionId } });
  };

  const dismissAlert = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  const exportDashboard = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Farmer', user?.name ?? 'Farmer'],
      ['Location', weatherData?.location.name ?? location.name],
      ['Date', today],
      ['Season', season.label],
      ['Temperature', current ? `${current.temperature}°C` : 'N/A'],
      ['Humidity', current ? `${current.humidity}%` : 'N/A'],
      ['Rain chance', todayWeather ? `${todayWeather.precipitationProbabilityMax}%` : 'N/A'],
      ['Farm health score', String(predictions?.agricultureHealthScore ?? 'N/A')],
      ['Highest mandi crop', mandiSummary ? `${mandiSummary.highestPriceCrop} (₹${mandiSummary.highestPriceValue})` : 'N/A'],
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'growsmart-dashboard.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Dashboard data exported');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <div className="bg-gradient-to-r from-emerald-700 to-green-700 text-white px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{greeting}, {user?.name?.split(' ')[0] || 'Farmer'}!</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-emerald-100">
                <span>{today}</span>
                <span className="inline-flex items-center gap-1 bg-white/15 rounded-full px-3 py-0.5 text-xs font-medium">
                  <i className="fas fa-calendar-days text-[10px]"></i> {season.label}
                </span>
                <span className="inline-flex items-center gap-1 bg-white/15 rounded-full px-3 py-0.5 text-xs font-medium">
                  <i className="fas fa-location-dot text-[10px]"></i> {weatherData?.location.name ?? location.name}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 text-white text-sm font-medium rounded-full px-4 py-2 min-h-[48px] transition-colors self-start"
            >
              <i className="fas fa-arrow-left text-xs"></i> Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {weatherError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
            <i className="fas fa-triangle-exclamation mr-2"></i>{weatherError} Showing the last available data.
          </div>
        )}

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => goToSection(action.section)}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border ${action.bg} ${action.border} ${action.text} p-4 min-h-[48px] active:scale-95 transition-transform hover:shadow-md`}
              >
                <i className={`${action.icon} text-xl`}></i>
                <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className="fas fa-cloud-sun text-2xl"></i>
                <div>
                  <h3 className="text-lg font-semibold">Weather Now</h3>
                  <p className="text-blue-100 text-sm">
                    {current ? weatherCodeToDescription(current.weatherCode) : weatherLoading ? 'Loading weather...' : 'Weather unavailable'}
                  </p>
                </div>
              </div>
              <span className="text-3xl font-bold">{current ? `${Math.round(current.temperature)}°C` : '--'}</span>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <i className="fas fa-droplet text-blue-400"></i>
                  <span>Humidity: <strong>{current ? `${current.humidity}%` : '--'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-wind text-blue-400"></i>
                  <span>Wind: <strong>{current ? `${Math.round(current.windSpeed)} km/h` : '--'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-cloud-rain text-blue-400"></i>
                  <span>Rain: <strong>{todayWeather ? `${todayWeather.precipitationProbabilityMax}%` : '--'}</strong></span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-sm text-blue-700">
                  <i className="fas fa-seedling mr-1"></i>
                  <strong>Farming Advisory:</strong>{' '}
                  {predictions ? predictions.advisory.irrigation.recommendation : 'Waiting for live weather data to generate advice.'}
                </p>
              </div>
              <button
                onClick={() => goToSection(Section.WEATHER)}
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                Details →
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-4 text-white">
              <h3 className="text-lg font-semibold">
                <i className="fas fa-store mr-2"></i>Mandi Price Alert
              </h3>
              <p className="text-teal-100 text-sm">
                {mandiSummary ? `${mandiSummary.priceTrend} market · ${mandiSummary.trendChange >= 0 ? '+' : ''}${mandiSummary.trendChange}% average change` : 'Top crops today'}
              </p>
            </div>
            <div className="px-5 py-4">
              <div className="space-y-3">
                {topPrices.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-seedling text-gray-400"></i>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{item.crop}</p>
                        <p className="text-xs text-gray-400">{item.mandi}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₹{item.modalPrice.toLocaleString('en-IN')}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        item.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        <i className={`fas ${item.change >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[10px]`}></i>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                  </div>
                ))}
                {topPrices.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">
                    {mandiLoading ? 'Loading live mandi prices...' : 'Mandi prices unavailable right now.'}
                  </p>
                )}
              </div>
              <button
                onClick={() => goToSection(Section.MANDI)}
                className="mt-3 w-full text-center text-teal-600 text-sm font-medium hover:underline"
              >
                View All Mandi Prices →
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-landmark text-indigo-500 mr-2"></i>Government Schemes
            </h3>
            <div className="space-y-3">
              {schemes.map((scheme) => (
                <div key={scheme.id} className="bg-gray-50 rounded-xl p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-hand-holding-dollar text-indigo-600 text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{scheme.schemeName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{scheme.description}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    scheme.matchScore >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {scheme.matchScore}% match
                  </span>
                </div>
              ))}
              {schemes.length === 0 && <p className="text-sm text-gray-400 text-center py-6">Loading schemes...</p>}
            </div>
            <button
              onClick={() => goToSection(Section.SCHEMES)}
              className="mt-3 w-full text-center text-indigo-600 text-sm font-medium hover:underline"
            >
              View All Schemes →
            </button>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-heart-pulse text-red-400 mr-2"></i>Farm Health Score
            </h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
              <CircularProgress score={predictions?.agricultureHealthScore ?? 0} />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-gray-600">Temperature: <strong className="text-gray-800">{current ? `${Math.round(current.temperature)}°C` : '--'}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="text-gray-600">Humidity: <strong className="text-gray-800">{current ? `${current.humidity}%` : '--'}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-gray-600">Rain chance: <strong className="text-gray-800">{todayWeather ? `${todayWeather.precipitationProbabilityMax}%` : '--'}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span className="text-gray-600">Disease risk: <strong className="text-gray-800 capitalize">{topDisease?.risk ?? '--'}</strong></span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="bg-white rounded-2xl shadow-sm p-5 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-chart-line text-emerald-500 mr-2"></i>Weekly Mandi Price Trend
            </h3>
            <div className="h-72">
              {priceChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceChartData}>
                    <defs>
                      {priceForecasts.map((forecast, index) => (
                        <linearGradient key={forecast.crop} id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={PRICE_COLORS[index % PRICE_COLORS.length]} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={PRICE_COLORS[index % PRICE_COLORS.length]} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    {priceForecasts.map((forecast, index) => (
                      <Area
                        key={forecast.crop}
                        type="monotone"
                        dataKey={`crop${index}`}
                        stroke={PRICE_COLORS[index % PRICE_COLORS.length]}
                        fill={`url(#grad-${index})`}
                        strokeWidth={2}
                        name={forecast.crop}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  {mandiLoading ? 'Loading price trends...' : 'Price trend data unavailable.'}
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-cloud-rain text-blue-500 mr-2"></i>Rainfall Forecast
            </h3>
            <div className="h-72">
              {rainChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rainChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" unit=" mm" />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [`${value} mm`, 'Rainfall']}
                    />
                    <Bar dataKey="rainfall" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  {weatherLoading ? 'Loading rainfall forecast...' : 'Rainfall data unavailable.'}
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-flask text-emerald-500 mr-2"></i>Live Farm Conditions
          </h3>
          <div className="h-80">
            {conditionRadarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={conditionRadarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Full" dataKey="full" stroke="#e5e7eb" fill="transparent" strokeWidth={1} strokeDasharray="4 4" />
                  <Radar name="Current" dataKey="value" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                {weatherLoading ? 'Loading farm conditions...' : 'Condition data unavailable.'}
              </div>
            )}
          </div>
        </section>

        {visibleAlerts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              <i className="fas fa-bell text-amber-500 mr-2"></i>Alerts & Notifications
            </h2>
            <div className="space-y-2">
              {visibleAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`${alert.bg} ${alert.border} border-l-4 rounded-xl p-4 flex items-start gap-3`}
                >
                  <i className={`${alert.icon} ${alert.color} text-lg mt-0.5`}></i>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{alert.desc}</p>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    <i className="fas fa-xmark text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-clock-rotate-left text-gray-400 mr-2"></i>Recent Activity
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 border-l-2 border-dotted border-gray-200"></div>
              <div className="space-y-5">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 z-10">
                      <i className={`${activity.icon} ${activity.color} text-xs`}></i>
                    </div>
                    <div className="pt-1">
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && <p className="text-sm text-gray-400">Syncing your farm data...</p>}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-lightbulb text-amber-500 mr-2"></i>Weather-based Tips
            </h3>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div key={index} className={`flex items-start gap-3 rounded-xl ${tip.bg} p-3`}>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className={`${tip.icon} ${tip.color} text-sm`}></i>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{tip.tip}</p>
                </div>
              ))}
              {tips.length === 0 && <p className="text-sm text-gray-400">Waiting for live weather data...</p>}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-newspaper text-gray-400 mr-2"></i>Recent News
            </h3>
            <div className="space-y-3">
              {newsArticles.slice(0, 3).map((article, index) => {
                const meta = newsIcon(article.agriCategory);
                return (
                  <a
                    key={article.article_id ?? article.link ?? index}
                    href={article.link || '#'}
                    target={article.link && article.link !== '#' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <i className={`${meta.icon} ${meta.color} text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-snug">{article.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>{article.source_name}</span>
                        <span>·</span>
                        <span>{timeAgo(article.pubDate)}</span>
                      </div>
                    </div>
                  </a>
                );
              })}
              {newsArticles.length === 0 && <p className="text-sm text-gray-400">Loading latest agriculture news...</p>}
            </div>
          </section>
        </div>

        <section className="text-center">
          <button
            onClick={exportDashboard}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-6 py-3 text-sm transition-colors shadow-sm"
          >
            <i className="fas fa-file-export"></i> Export Dashboard Data
          </button>
        </section>
      </div>
    </div>
  );
};

export default FarmerDashboard;
