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
    // Vytvoříme kopii a seřadíme všechny notebooky podle hodnoty na ose X
    const sortedNotebooks = [...notebooks].sort((a, b) =>
      xAscend ? a[xAttribute] - b[xAttribute] : b[xAttribute] - a[xAttribute]
    );

    // Seřadíme skyline body podle stejného klíče – ne podle id!
    const sortedSkyline = [...skyline].sort((a, b) =>
      xAscend ? a[xAttribute] - b[xAttribute] : b[xAttribute] - a[xAttribute]
    );

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    if (notebooks.length === 0) return;

    // Vytvoření škál na základě všech notebooků
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(sortedNotebooks, (d) => d[xAttribute]))
      .nice()
      .range(xAscend ? [marginLeft, width - marginRight] : [width - marginRight, marginLeft]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(sortedNotebooks, (d) => d[yAttribute]))
      .nice()
      .range(yAscend ? [height - marginBottom, marginTop] : [marginTop, height - marginBottom]);

    // Vykreslení os
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(xScale).ticks(width / 80))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("y2", -height)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
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
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .select(".tick:last-of-type text")
          .clone()
          .attr("x", 4)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(`↑ ${yAttribute}`)
      );

    // Vykreslení všech notebooků jako modré tečky
    svg
      .selectAll(".dot")
      .data(sortedNotebooks)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", (d) => xScale(d[xAttribute]))
      .attr("cy", (d) => yScale(d[yAttribute]))
      .style("fill", "#0000bb")
      .on("mouseover", (event, d) => {
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid 1px #ccc")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("pointer-events", "none")
          .style("opacity", 0);

        tooltip
          .html(`Notebook ID: ${d.id}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .style("opacity", 1);
      })
      .on("mouseout", () => d3.select(".tooltip").remove());

    // Vykreslení skyline čáry - ZMĚNĚNO z curveStepAfter na curveStepBefore pro schody nahoru
    if (sortedSkyline.length > 0) {
      svg
        .append("path")
        .datum(sortedSkyline)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveStepBefore) // ZMĚNA ZDE - z curveStepAfter na curveStepBefore
            .x((d) => xScale(d[xAttribute]))
            .y((d) => yScale(d[yAttribute]))
        );
      // Vykreslení červených teček pro každý bod skyline
      svg
        .selectAll(".skyline-dot")
        .data(sortedSkyline)
        .enter()
        .append("circle")
        .attr("class", "skyline-dot")
        .attr("r", 5)
        .attr("cx", (d) => xScale(d[xAttribute]))
        .attr("cy", (d) => yScale(d[yAttribute]))
        .style("fill", "red")
        .on("mouseover", (event, d) => {
          const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid 1px #ccc")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("pointer-events", "none")
            .style("opacity", 0);

          tooltip
            .html(`Notebook ID: ${d.id}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px")
            .style("opacity", 1);
        })
        .on("mouseout", () => d3.select(".tooltip").remove());
    }
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