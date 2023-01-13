// trida ktera drzi zakladni potrebne informace
import dateUtils from "./currentVer/DateUtils.js";

export default class Context {
    // FIXME musi byt spravna url
    // url pro dotazovani
    url = "https://asteriontimelinesvisualisation.up.railway.app";
    icoUrl = "https://asteriontimelines.up.railway.app/";

    // pole zatím získaných dat ze serverové části
    data = [];
    // aktuálně zobrazené osy, zaroven drzi poradi
    active = [];
    // aktualni poradi os z active tak jak je vykreslene
    activeOrder = [];
    // minimalni a maximalni datum
    minDate = 0;
    maxDate = 0;
    // konstanty k lepsimu zamereni veskereho obsahu
    lowerEnd = -100;
    upperEnd = -50;

    // predvybrana barevna paleta pro snadné rozliseni jednotlivych os
    colorPallete = [
        {color:"#d25800", users: 0},
        {color:"#09ff00", users: 0},
        {color:"#0873b3", users: 0},
        {color:"#ffcdaa", users: 0},
        {color:"#b535ba", users: 0},
        {color:"#00fffb", users: 0},
        {color:"#ff0900", users: 0},
        {color:"#fff200", users: 0},
        {color:"#003500", users: 0},
        {color:"#0000ff", users: 0},
        {color:"#ff29ff", users: 0},
        {color:"#8a9800", users: 0},
        {color:"#009800", users: 0},
        {color:"#dc0068", users: 0},
        {color:"#fa8775", users: 0},
        {color:"#a7cc82", users: 0},
        {color:"#4b19a9", users: 0},
        {color:"#c9a600", users: 0},
        {color:"#29ade4", users: 0},
        {color:"#a400ec", users: 0},
        {color:"#38c66f", users: 0},
        {color:"#d0ade7", users: 0},
        {color:"#050067", users: 0},
        {color:"#9b709a", users: 0},
        {color:"#70ffb3", users: 0},
        {color:"#ff9bff", users: 0},
        {color:"#993f00", users: 0},
        {color:"#bfb287", users: 0},
        {color:"#92315b", users: 0},
        {color:"#8c8c8c", users: 0}
    ];

    // skalovnáni pro brush, domena je rozsah minDate - maxDate, range je rozsah 0 - width (minimapy)
    xt = d3.scaleLinear();
    // domena stejna, range je 0 az sirka plus upper end
    xt2 = d3.scaleLinear();
    // skalovani pro udalosti v minimape, vypocet aktualne zobrazovane casti os
    area = d3.area();
    // osy s datumy
    axis = d3.axisBottom(this.xt2)
        .ticks(15)
        .tickSizeInner(-900)
        .tickSizeOuter(0);
    brush = undefined;
    zoom = d3.zoom()
        .scaleExtent([1, Infinity]);

    // konstruktor tridy
    constructor() {
        this.area
            .curve(d3.curveMonotoneX)
            .x((d) => {return this.xt2(d.x)})
            .y0(0)
            .y((d) => {return(d.y)});
    }

    // prehozeni poradi v poli
    shuffelArray(arr) {
        let m = arr.length, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [arr[i], arr[m]] = [arr[m], arr[i]];
        }
        return arr;
    }

    // zprehazeni elementu pole s barvami
    shuffelColors() {
        this.colorPallete = this.shuffelArray(this.colorPallete);
    }

    // zmena vsech dilcich casti pro spravne zobrazeni - rozsahy, brush, zoom, ...
    updateScales() {
        let bound = d3.select("#minimap_Bound");
        let dates = this.active.map((item) => item.events.map((event) => event.begin)).flat()
            .sort((a,b) => a > b);
        this.minDate = dates[0]
        this.maxDate = dates[dates.length - 1];
        this.xt.domain([this.minDate + this.lowerEnd,this.maxDate])
            .range([0, Number(bound.attr("width"))]);
        this.xt2.domain(this.xt.domain())
            .range([200,Number(d3.select(".canvasDraw").node().clientWidth) + this.upperEnd]);
        d3.select("#start_time").text(dateUtils.getDateName(this.minDate));
        d3.select("#end_time").text(dateUtils.getDateName(this.maxDate));
        d3.select("#gb")
            .call(this.brush)
            .call(this.brush.move, this.xt.range().map(value => value + Number(bound.attr("x"))));
        d3.select("#zoom")
            .call(this.zoom);
        d3.select("#timestamps")
            .call(this.axis);
    }

    // nastaveni spravnych informaci pro brush
    setBrush(info, brushed) {
        this.brush = d3.brushX()
            .extent([[info.x,4],[info.x + info.width,30]])
            .on("brush", brushed);

        d3.select("#gb")
            .call(this.brush)
            .call(this.brush.move, this.xt.range().map(value => value + info.x));
    }

    // nastaveni zoom na spravne hodnoty
    setZoom(info, zoomed) {
        let trextent = [[0,0],[info.width,d3.select(".canvasDraw").node().clientHeight]];
        this.zoom
            .extent(trextent)
            .translateExtent(trextent)
            .on("zoom", zoomed);

        d3.select("#zoom")
            .attr("width", d3.select(".canvasDraw").node().clientWidth - 200)
            .attr("height", d3.select(".canvasDraw").node().clientHeight)
            .attr("transform", "translate(" + 200 + "," + 0 + ")")
            .call(this.zoom);
    }

    // aktualizace brush a zoom pro zmene okna s vizualizaci
    updateBrushZoomAxis(info){
        let trextent = [[0,0],[info.width,d3.select(".canvasDraw").node().clientHeight]];
        this.brush.extent([[info.x,4],[info.x + info.width,30]]);
        d3.select("#zoom")
            .attr("width", d3.select(".canvasDraw").node().clientWidth - 200)
            .attr("height", d3.select(".canvasDraw").node().clientHeight);
        this.zoom
            .extent(trextent)
            .translateExtent(trextent);
        this.axis.tickSizeInner(-d3.select(".canvasDraw").node().clientHeight + 230);
    }

    // kontrola volnych barev, tak aby se vzdy vybrala nektera z volnych
    getNextFreeColor() {
        for(let color of this.colorPallete) {
            if (!color.users) {
                color.users++
                return color.color;
            }
        }
        let col = d3.select("#edit_color").node().value;
        this.setColor(col);
        return col;
    }

    // nastav urcitou barvu
    setColor(color) {
        let idx = this.colorPallete.findIndex(e => e.color === color);
        if (idx !== -1)
            this.colorPallete[idx].users++;
    }

    // zrus urcitou barvu
    unsetColor(color) {
        let idx = this.colorPallete.findIndex(e => e.color === color);
        if (idx !== -1) {
            this.colorPallete[idx].users--;
            if (this.colorPallete[idx].users < 0)
                this.colorPallete[idx].users = 0;
        }
    }

    // vymen barvy u jednoho prvku
    changeColor(oldColor, newColor) {
        this.unsetColor(oldColor);
        this.setColor(newColor);
    }

    // odstran vsechno z aktivniho listu
    removeAll() {
        if (this.active.length > 0) {
            this.active = [];
            this.colorPallete.forEach(el => el.users = 0);
        }
    }

    // odstran vybrany prvek z aktviniho listu
    removeSelected(item) {
        if (item) {
            let idx = this.active.findIndex(e => e.clsName === item);
            this.active.splice(idx,1);
        }
    }
}