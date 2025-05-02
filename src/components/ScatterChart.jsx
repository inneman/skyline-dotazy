import React, { useState, useRef, useEffect } from 'react';
import {
  ComposedChart, Scatter, XAxis, YAxis, CartesianGrid,
  Legend, ResponsiveContainer, Line
} from 'recharts';

export default function NotebookScatterChart({
  notebooks = [],
  skyline = [],
  xAttribute,
  yAttribute,
  xAscend,
  yAscend
}) {
  const chartContainerRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    active: false,
    content: "",
    x: 0,
    y: 0
  });

  const [shouldShowSkyline, setShouldShowSkyline] = useState(true);
  const prevAttributesRef = useRef({ x: xAttribute, y: yAttribute });

  useEffect(() => {
    if (prevAttributesRef.current.x !== xAttribute ||
        prevAttributesRef.current.y !== yAttribute) {
      setShouldShowSkyline(false);
    } else {
      setShouldShowSkyline(true);
    }
    prevAttributesRef.current = { x: xAttribute, y: yAttribute };
  }, [xAttribute, yAttribute, skyline]);

  const closeTooltip = () => {
    setTooltip(prev => ({ ...prev, active: false }));
  };

  if (!notebooks || notebooks.length === 0) {
    return <div>Žádná data k zobrazení</div>;
  }

  const stairPoints = [];
  if (shouldShowSkyline && skyline.length > 0) {
    const sortedSkyline = [...skyline].sort((a, b) =>
      xAscend ? a[xAttribute] - b[xAttribute] : b[xAttribute] - a[xAttribute]
    );

    for (let i = 0; i < sortedSkyline.length; i++) {
      const current = sortedSkyline[i];
      stairPoints.push(current);
      if (i < sortedSkyline.length - 1) {
        const next = sortedSkyline[i + 1];
        stairPoints.push({
          ...current,
          [xAttribute]: next[xAttribute],
          isStepPoint: true
        });
      }
    }
  }

  const xValues = notebooks.map(nb => nb[xAttribute]);
  const yValues = notebooks.map(nb => nb[yAttribute]);
  const minX = Math.min(...xValues) * 0.95;
  const maxX = Math.max(...xValues) * 1.05;
  const minY = Math.min(...yValues) * 0.95;
  const maxY = Math.max(...yValues) * 1.05;
  const xDomain = xAscend ? [minX, maxX] : [maxX, minX];
  const yDomain = yAscend ? [minY, maxY] : [maxY, minY];

  const axisLabels = {
    vykon: 'Výkon procesoru',
    cena: 'Cena (Kč)',
    vaha: 'Váha (kg)',
    vydrz: 'Výdrž baterie (h)'
  };

  const handlePointMouseOver = (data, index, e) => {
    const { clientX, clientY } = e;
    setTooltip({
      active: true,
      content: `ID: ${data.id}`,
      x: clientX,
      y: clientY - 30
    });
  };

  return (
    <div
      ref={chartContainerRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onMouseLeave={closeTooltip}
    >
      {tooltip.active && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 'px',
            top: tooltip.y + 'px',
            backgroundColor: 'white',
            padding: '5px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            zIndex: 1000,
            pointerEvents: 'none',
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltip.content}
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%" aspect={16 / 9}>
        <ComposedChart margin={{ top: 20, right: 30, bottom: 40, left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey={xAttribute}
            domain={xDomain}
            label={{
              value: axisLabels[xAttribute] || xAttribute,
              position: 'bottom',
              offset: 20,
              fontSize: 14
            }}
          />
          <YAxis
            type="number"
            dataKey={yAttribute}
            domain={yDomain}
            label={{
              value: axisLabels[yAttribute] || yAttribute,
              angle: -90,
              position: 'left',
              offset: 10,
              fontSize: 14
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Scatter
            name="Všechny notebooky"
            data={notebooks}
            fill="#8884d8"
            fillOpacity={0.7}
            stroke="#6666aa"
            strokeWidth={1}
            shape="circle"
            legendType="circle"
            radius={5}
            onMouseOver={handlePointMouseOver}
          />
          {shouldShowSkyline && stairPoints.length > 0 && (
            <Line
              name="Skyline hranice"
              type="linear"
              dataKey={yAttribute}
              data={stairPoints}
              stroke="#ff4d4f"
              strokeWidth={2}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          )}
          {shouldShowSkyline && skyline.length > 0 && (
            <Scatter
              name="Skyline notebooky"
              data={skyline}
              fill="#ff4d4f"
              fillOpacity={0.9}
              stroke="#cc0000"
              strokeWidth={1}
              shape="circle"
              legendType="circle"
              radius={6}
              onMouseOver={handlePointMouseOver}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
