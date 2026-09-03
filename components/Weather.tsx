import React from 'react';
import { Section as SectionKey } from '../types';
import Section from './Section';
import WeatherDashboard from './weather/WeatherDashboard';

const Weather: React.FC = () => {
  return (
    <Section
      id={SectionKey.WEATHER}
      tone="sky"
      icon="fas fa-cloud-sun"
      eyebrow="Weather Intelligence"
      title="Weather Forecast & Advisory"
      subtitle="Real-time weather, forecasts and crop-smart farming advice for your region."
    >
      <WeatherDashboard />
    </Section>
  );
};

export default Weather;
