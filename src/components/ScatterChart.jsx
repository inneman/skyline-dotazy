import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const width = 1200;
const height = 900;
const marginTop = 25;
const marginRight = 20;
const marginBottom = 35;
const marginLeft = 80;

export default function ScatterChart({
  notebooks = [],
  xAttribute,
  yAttribute,
  xAscend,
  yAscend,
  skyline = [],
}) {
  const ref = useRef();

  useEffect(() => {
    // Seřadíme notebooky podle vybraného atributu
    const sorted = [...notebooks].sort((a, b) =>
      xAscend ? a[xAttribute] - b[xAttribute] : b[xAttribute] - a[xAttribute]
    );

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    if (notebooks.length === 0) return;

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(sorted, d => d[xAttribute]))
      .nice()
      .range(xAscend ? [marginLeft, width - marginRight] : [width - marginRight, marginLeft]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(sorted, d => d[yAttribute]))
      .nice()
      .range(yAscend ? [height - marginBottom, marginTop] : [marginTop, height - marginBottom]);

    // Vykreslíme osy
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(xScale).ticks(width / 80))
      .call(g => g.select(".domain").remove())
      .call(g =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("y2", -height)
          .attr("stroke-opacity", 0.1)
      )
      .call(g =>
        g
          .append("text")
          .attr("x", width - 4)
          .attr("y", -4)
          .attr("font-weight", "bold")
          .attr("text-anchor", "end")
          .attr("fill", "currentColor")
          .text(`${xAttribute} →`)
      );

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(yScale).ticks(null))
      .call(g => g.select(".domain").remove())
      .call(g =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width)
          .attr("stroke-opacity", 0.1)
      )
      .call(g =>
        g
          .select(".tick:last-of-type text")
          .clone()
          .attr("x", 4)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(`↑ ${yAttribute}`)
      );

    // Vykreslíme body (notebooky)
    svg
      .selectAll(".dot")
      .data(sorted)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", d => xScale(d[xAttribute]))
      .attr("cy", d => yScale(d[yAttribute]))
      .style("fill", "#0000bb")
      .on("mouseover", (event, d) => {
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "1px solid #ccc")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("pointer-events", "none")
          .style("opacity", 0);

        tooltip
          .html(
            `<strong>ID:</strong> ${d.id}<br/>
             <strong>Název:</strong> ${d.nazev}<br/>
             <strong>${xAttribute}:</strong> ${d[xAttribute]}<br/>
             <strong>${yAttribute}:</strong> ${d[yAttribute]}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .style("opacity", 1);
      })
      .on("mouseout", () => d3.select(".tooltip").remove());

    // Vykreslíme Skyline, pokud existuje
    if (skyline.length > 0) {
      svg
        .selectAll(".skyline-dot")
        .data(skyline)
        .enter()
        .append("circle")
        .attr("class", "skyline-dot")
        .attr("r", 5)
        .attr("cx", d => xScale(d[xAttribute]))
        .attr("cy", d => yScale(d[yAttribute]))
        .style("fill", "red");

      svg
        .append("path")
        .datum(skyline)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveStepAfter)
            .x(d => xScale(d[xAttribute]))
            .y(d => yScale(d[yAttribute]))
        );
    }

    // Volitelně můžeme vykreslit popisky u bodů
    svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("text")
      .data(sorted)
      .join("text")
      .attr("dy", "0.35em")
      .attr("x", d => xScale(d[xAttribute]) + 7)
      .attr("y", d => yScale(d[yAttribute]))
      .text(d => d.nazev);
  }, [notebooks, xAttribute, yAttribute, xAscend, yAscend, skyline]);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    ></svg>
  );
}
