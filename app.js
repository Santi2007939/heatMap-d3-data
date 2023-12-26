const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let base;
let info = [];

let xScale;
let yScale;

let w = 1200;
let h = 600;
let p = 60;

let svg = d3.select("svg");
let tooltip = d3.select("#tooltip");

let genScales = () => {
    xScale = d3.scaleLinear()
                .range([p, w - p]);

    yScale = d3.scaleTime()
                .range([p, h - p]);

};


let genAxes = () => {
    let xAxis = d3.axisBottom(xScale);
    svg.append("g")
            .call(xAxis)
            .attr("id", "x-axis")
            .attr("transform", "translate(0, " + (h - p) + ")");

    let yAXis = d3.axisLeft(yScale);
    svg.append("g")
            .call(yAXis)
            .attr("id", "y-axis")
            .attr("transform", "translate(" + p + ", 0)");
};

let cells = () => {

};

fetch(url)
    .then(response => response.json())
    .then(data => {
        base = data["baseTemperature"];
        info = data["monthlyVariance"];       
        genScales();
        genAxes();
        cells();
    })
    .catch(error => console.error("Error fetching the information:", error));


/* let points = () => {
    svg.selectAll("circle")
        .data(info)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", "5")
        .attr("data-xvalue", (i) => {return i["Year"]})
        .attr("data-yvalue", (i) => {return new Date(i["Seconds"] * 1000)})
        .attr("cx", (i) => {return xScale(i["Year"])})
        .attr("cy", (i) => {return yScale(new Date(i["Seconds"] * 1000))})
        .attr("fill", (i) => {
            return i["Doping"] != "" ? "#B2A59B" : "#DED0B6"; 
        })
        .on("mouseover", (e, i) => {
            let posX = xScale(i["Year"]);
            let posY = yScale(new Date(i["Seconds"] * 1000));

            tooltip.transition()
                .style("visibility", "visible");
            tooltip.select("rect")
                .attr("x", posX + 10)
                .attr("y", posY - 50)
                .attr("rx", 10)
                .attr("height", 90)
                .attr("fill", "#FAEED1")
                .attr("width", i["Doping"] != "" ? (i["Doping"].length * 5.8) : i["Name"].length * 7);

            tooltip.select("#one")
                .attr("x", posX + 15)
                .attr("y", posY - 30)
                .text(i["Year"]);
            tooltip.select("#two")
                .attr("x", posX + 15)
                .attr("y", posY - 10)
                .text(i["Name"]);
            tooltip.select("#three")
                .attr("x", posX + 15)
                .attr("y", posY + 10)
                .text(i["Time"]);
            tooltip.select("#four")
                .attr("x", posX + 15)
                .attr("y", posY + 30)
                .text(i["Doping"] != "" ? i["Doping"]: "No allegations");
                
            tooltip.attr("data-year", i["Year"])
        })
        .on("mouseout", (e, i) => {
            tooltip.transition()
                .style("visibility", "hidden");
        })
};
*/