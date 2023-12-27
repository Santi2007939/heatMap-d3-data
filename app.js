const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let base;
let info = [];

var meses = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

const colors = {
    darkRed: "#8B0000",
    red: "rgb(215, 48, 39)",
    orange: "rgb(244, 109, 67)",
    orayel: "rgb(253, 174, 97)",
    darkYellow: "rgb(254, 224, 144)",
    yellow: "rgb(255, 255, 191)",
    superLightBlue: "rgb(224, 243, 248)",
    lightBlue: "rgb(171, 217, 233)",
    blue: "rgb(116, 173, 209)",
    darkBlue: "rgb(69, 117, 180)", 
    deepBlue: "#05014a"
};


let xScale;
let yScale;

let w = 1200;
let h = 600;
let p = 60;

let canvas = d3.select("#canvas");
let legend = d3.select("#legend")
let tooltip = d3.select("#tooltip");

let minYear;
let maxYear;

let genScales = () => {
    minYear = d3.min(info, (i) => {return i["year"]});
    maxYear = d3.max(info, (i) => {return i["year"]});

    xScale = d3.scaleLinear(2.8, 3.9, 5.0)
                .domain([minYear, maxYear +1])
                .range([p, w - p]);

    yScale = d3.scaleTime()
                .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
                .range([p, h - p]);

};


let genAxes = () => {
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));
    canvas.append("g")
            .call(xAxis)
            .attr("id", "x-axis")
            .attr("transform", "translate(0, " + (h - p) + ")");

    let yAXis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%B"));
    canvas.append("g")
            .call(yAXis)
            .attr("id", "y-axis")
            .attr("transform", "translate(" + p + ", 0)");
};

let cells = () => {
    canvas.selectAll("rect")
            .data(info)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("fill", (i) => {
                temperature = Number((base + i["variance"]).toFixed(1));
                if (temperature >= 12.8) {
                    return colors.darkRed;
                } else if(temperature >= 11.7) {
                    return colors.red;
                } else if (temperature >= 10.6) {
                    return colors.orange;
                } else if (temperature >= 9.5) {
                    return colors.orayel;
                } else if (temperature >= 8.3) {
                    return colors.darkYellow;
                } else if (temperature >= 7.2) {
                    return colors.yellow;
                } else if (temperature >= 6.1) {
                    return colors.superLightBlue;
                } else if (temperature >= 5.0) {
                    return colors.lightBlue;
                } else if (temperature >= 3.9) {
                    return colors.blue;
                } else if (temperature >= 2.8) {
                    return colors.darkBlue;
                } else {
                    return colors.deepBlue;
                }
            })
            .attr("data-year", (i) => {return i["year"]})
            .attr("data-month", (i) => {return i["month"] - 1})
            .attr("data-temp", (i) => {return temperature})
            .attr("height", (h - (2 * p))/12)
            .attr("y", (i) => {return yScale(new Date(0, i["month"] -1, 0, 0, 0, 0, 0))})
            .attr("width", (i) => {
                let years = maxYear - minYear;
                return (w - (2 * p))/years;
            })
            .attr("x", (i) => {
                return xScale(i["year"]);
            })
            .on("mouseover", (e, i) => {
                tooltip.transition()
                    .style("visibility", "visible");
                tooltip.select("rect")
                    .attr("x", 350)
                    .attr("y", 80)
                    .attr("height", 90)
                    .attr("width", 100)
                    .attr("fill", "black")
                    .attr("rx", 4)
    
                tooltip.select("#one")
                    .attr("x", 350)
                    .attr("y", 95)
                    .text(i["year"] + " - " + meses[i["month"] - 1]);
                tooltip.select("#two")
                    .attr("x", 380)
                    .attr("y", 125)
                    .text(temperature + "°C");
                tooltip.select("#three")
                    .attr("x", 379)
                    .attr("y", 155)
                    .text(Number(i["variance"].toFixed(1)) + "°C")
                tooltip.attr("data-year", i["year"]);
            })
            .on("mouseout", (e, i) => {
                tooltip.transition()
                    .style("visibility", "hidden");
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