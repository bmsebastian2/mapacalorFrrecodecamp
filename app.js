console.log('App Freecode bmsebastian2@gmail.com')


document.addEventListener('DOMContentLoaded',async()=>{

    try {
const resp = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
const data = await resp.json()


const dataset  =data.monthlyVariance
console.log(dataset)

// Configuración del mapa de calor
const width = 800;
const height = 400;
// Crear escala de colores
const colorScale = d3.scaleQuantize()
  .domain(d3.extent(dataset, d => d.variance))
  .range(["#313695", "#4575b4", "#91bfdb", "#e0f3f8", "#fee08b", "#d73027"]);


// Crear contenedor del mapa de calor
const heatmapContainer = d3.select("#heatmap")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
  

// Crear escalas para ejes x e y
const xScale = d3.scaleBand()
  .domain(dataset.map(d => d.year))
  .range([0, width]);

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];



  const yScale = d3.scaleBand()
  .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) // Reversed order
  .range([0, height]);

// Agregar ejes x e y
heatmapContainer.append("g")
  .attr("id", "x-axis")
  .call(d3.axisTop(xScale));

heatmapContainer.append("g")
  .attr("id", "y-axis")
  .call(d3.axisLeft(yScale)
    .tickFormat(d => monthNames[d - 1]) // Use month names based on the month number
  );


// Crear celdas del mapa de calor
heatmapContainer.selectAll(".cell")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("x", d => xScale(d.year))
  .attr("y", d => yScale(d.month - 1)) // Subtract 1 to adjust month values to the range 0-11
  .attr("width", xScale.bandwidth())
  .attr("height", yScale.bandwidth())
  .attr("data-month", d => d.month - 1) // Subtract 1 to adjust month values to the range 0-11
  .attr("data-year", d => d.year)
  .attr("data-temp", d => d.variance)
  .style("fill", d => colorScale(d.variance));


// Agregar leyenda
const legendContainer = d3.select("#legend")
  .append("svg")
  .attr("width", width)
  .attr("height", 50);

  const legendColors = colorScale.range();
    // Crear rectángulos de la leyenda
    legendContainer.selectAll(".legend-cell")
      .data(legendColors) // Completa con los colores de la leyenda
      .enter()
      .append("rect")
      .attr("class", "legend-cell")
      .attr("x", (d, i) =>  i * (width / legendColors.length))
      .attr("y", 0)
      .attr("width", 5)
      .attr("height", 20)
      .style("fill", d => d);

    // Agregar título y descripción
    heatmapContainer.append("text")
      .attr("id", "title")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text("Mapa de Calor de Temperaturas");

    heatmapContainer.append("text")
      .attr("id", "description")
      .attr("x", width / 2)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .text("Descripción del Mapa de Calor");
// Agregar funcionalidad de información sobre herramientas
heatmapContainer.selectAll(".cell")
  .on("mouseover", function (event, d) {
    // Seleccionar o crear el elemento tooltip
    let tooltip = d3.select("#tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
    }

 // Muestra información sobre herramientas con datos del área activa
tooltip.transition()
.duration(200)
.style("opacity", 1)
.html(`Año: ${d.year}<br>Mes: ${monthNames[d.month - 1]}<br>Temperatura: ${d.variance}`)
.style("left", (event.pageX + 10) + "px")
.style("top", (event.pageY - 30) + "px")
  })
  .on("mouseout", function () {
    // Oculta la información sobre herramientas cuando el mouse sale del área
    d3.select("#tooltip").transition()
      .duration(200)
      .style("opacity", 0);
  });
        
    } catch (error) {
        console.log(error) 
    }

    
})