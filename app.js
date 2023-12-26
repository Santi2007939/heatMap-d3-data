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
let minYear;
let maxYear;

let genScales = () => {
    minYear = d3.min(info, (i) => {return i["year"]});
    maxYear = d3.max(info, (i) => {return i["year"]});

    xScale = d3.scaleLinear()
                .domain([minYear, maxYear +1])
                .range([p, w - p]);

    yScale = d3.scaleTime()
                .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
                .range([p, h - p]);

};


let genAxes = () => {
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));
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
    svg.selectAll("rect")
            .data(info)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("fill", (i) => {
                variance = i["variance"];
                if(variance <= -1) {
                    return "SteelBlue";
                } else if (variance <= 0) {
                    return "LightSteelBlue";
                } else if (variance <= 1) {
                    return "Orange";
                } else {
                    return "#DC143C";
                }
            })
            .attr("data-year", (i) => {return i["year"]})
            .attr("data-month", (i) => {return i["month"] - 1})
            .attr("data-temp", (i) => {return Number((base + i["variance"]).toFixed(1))})
            .attr("height", (h - (2 * p))/12)
            .attr("y", (i) => {return yScale(new Date(0, i["month"] -1, 0, 0, 0, 0, 0))})
            .attr("width", (i) => {
                let years = maxYear - minYear;
                return (w - (2 * p))/years;
            })
            .attr("x", (i) => {
                return xScale(i["year"]);
            })
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