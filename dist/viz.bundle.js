/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./build.js":
/*!******************!*\
  !*** ./build.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Build)
/* harmony export */ });
/* harmony import */ var _currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./currentVer/DateUtils.js */ "./currentVer/DateUtils.js");
// trida pro vystvabu cele stranky plus zmeny a aktualizace
// utilita z bp Zimmermanova - prepocet pozice na casovou znacku


class Build {
    // minimalni velikost obrazku udalosti
    minWidthEvent = 50;
    //konstruktor tridi build
    constructor(context, order) {
        this.context = context;
        this.order = order;
        this.header = document.createElement("div");
        this.minimap = document.createElement("div");
        this.canvas = document.createElement("div");
        this.modal_menu = document.createElement("div");
        this.footer = document.createElement("div");
        this.viz = document.createElement("div");

        // zmena velikosti okna s vizualizaci
        window.addEventListener("resize", () => {
            let tmp = d3.select(".minimapDraw");
            tmp.remove(tmp.firstElementChild);
            this.buildMinimap();
            if (context.active.length > 0) {
                this.context.updateBrushZoomAxis(this.getMinimapInfo());
                this.context.updateScales();
                d3.select("#timestamps").attr("transform", `translate(0,${d3.select(".canvasDraw").node().clientHeight - 160})`);
                this.drawRes(this.order.makeView());
            }
            this.moveButtons();
        });

        // vytvoreni cele vizualizace, zatim jen virtualne
        this.buildViz();
        // pripojeni vizualizace do okna prohlizece
        document.body.append(this.viz);
        // prepocitani pozice tlacitek pro pridani/odebrani
        this.moveButtons();
        // nacteni velikosti
        this.minimapX = Number(d3.select("#minimap_Bound").attr("x"));
        this.minimapW = Number(d3.select("#minimap_Bound").attr("width"));
    }

    // vraci x a width minimapy
    getMinimapInfo() {
        let tmp = d3.select(".minimapDraw #minimap_Bound");
        this.minimapX = Number(tmp.attr("x"));
        this.minimapW = Number(tmp.attr("width"));
        return {x:Number(tmp.attr("x")), width: Number(tmp.attr("width"))};
    }

    //------------------------------------------------------------------
    //------------------build-whole-viz---------------------------------
    // postav hlavni element vizualizace, div kontejner s jednotlivymi podcastmi
    buildViz() {
        // pridej atributy
        d3.select(this.viz).attr("id", "viz");
        // postav a pridej header
        this.buildHeader();
        this.viz.append(this.header);
        // postav a pridej minimapu
        this.buildMinimap();
        this.viz.append(this.minimap);
        // postav a pridej platno
        this.buildCnvs();
        this.viz.append(this.canvas);
        // postav a pridej modal menu
        this.buildModal();
        this.viz.append(this.modal_menu);
        // postav a pridej konec
        this.buildFooter();
        this.viz.append(this.footer);
    }

    // vytvor zahlavi
    buildHeader() {
        d3.select(this.header).attr("id", "header");
        const title = d3.select(this.header).append("div");
        title.attr("class", "title")
            .append("h1")
            .text("Asterion Timelines");
        const links = d3.select(this.header).append("div");
        links.attr("class", "links");
        // links.append("a")
        //     .text("Upravit");
        links.append("a")
            .attr("href", "./help.html")
            .append("img")
                .attr("src", __webpack_require__(/*! ./img/help.png */ "./img/help.png"));
        links.append("a")
            .attr("href", "https://discord.com/invite/vAzSaYc")
            .append("img")
                .attr("src", __webpack_require__(/*! ./img/discord.png */ "./img/discord.png"));
        links.append("a")
            .attr("href", "https://asterionrpg.cz/")
            .append("img")
                .attr("src", __webpack_require__(/*! ./img/asterionrpg.png */ "./img/asterionrpg.png"));
    }

    // vytvor minimapu
    buildMinimap() {
        d3.select(this.minimap).attr("class", "minimap");
        let starttime = this.BrowserText.getWidth(_currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getDateName(0), 16 ,"Arial Black")/3;
        let endtime = this.BrowserText.getWidth(_currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getDateName(3699999), 16 ,"Arial Black")/3;
        const focus_begin = 0.12 * window.innerWidth;
        const boundWidth = 0.76 * window.innerWidth;
        // const dateWidth = 0.15 * (window.innerWidth - boundWidth)/2;
        const dateWidth = (window.innerWidth - boundWidth)/4;
        const yDatePosition = 65;
        // console.log(dateWidth);
        const svg = d3.select(this.minimap)
            .append("svg")
            .attr("class", "minimapDraw");
        svg.append("text")
            .attr("id", "start_time")
            .attr("x", `${dateWidth - starttime}`)
            .attr("y", `${yDatePosition}%`)
            .text(_currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getDateName(0));
        svg.append("rect")
            .attr("id", "minimap_Bound")
            .attr("x", `${focus_begin}`)
            .attr("y","5")
            .attr("height", "25")
            .attr("width", `${boundWidth}`);
        svg.append("text")
            .attr("id", "end_time")
            .attr("x", `${focus_begin + boundWidth + dateWidth - endtime}`)
            .attr("y", `${yDatePosition}%`)
            .text(_currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getDateName(3699999));
        svg.append("g")
            .attr("id", "gb");
    }

    // vytvor hlavni zobrazovaci plochu
    buildCnvs() {
        d3.select(this.canvas)
            .attr("class", "canvas");
        const svg = d3.select(this.canvas)
            .append("svg")
            .attr("class", "canvasDraw")
            .attr("height", "100%")
            .attr("width", "100%");
        svg.append("rect")
            .attr("id", "zoom");
        svg.append("g")
            .attr("id", "timestamps")
            .attr("transform", "translate(0,960)");
        const cnvs = svg.append("g").attr("transform", "translate(0,0)");
        let tmp = cnvs.append("g").attr("id", "timelines");
        tmp = tmp.append("g").attr("id", "timeline_els");
        tmp.append("g").attr("id", "paths");
        cnvs.append("rect")
            .attr("id", "lampshade")
            .attr("x", "0")
            .attr("y", "-2000")
            .attr("height", "900%")
            .attr("width", "200");
        cnvs.append("image")
            .attr("id", "selected")
            .attr("x", "40")
            .attr("y", "0")
            .attr("width", "100")
            .attr("height", "100")
            .attr("href", __webpack_require__(/*! ./img/selection.png */ "./img/selection.png"));
        cnvs.append("g")
            .attr("id", "emblems")
            .attr("transform", "translate(90,-50)");

        this.addButtonCnvs(svg, 0, "add", __webpack_require__(/*! ./img/add.png */ "./img/add.png"), 60, 10, "Přidej", "příběh", 10);
        this.addButtonCnvs(svg, 100, "remove", __webpack_require__(/*! ./img/delete.png */ "./img/delete.png"), 60, 110, "Smaž", "vše", 125);
    }

    // pridej svg tlacitko do hlavni zobrazovaci plochy
    addButtonCnvs(to,xCoord, groupId, img, imgWidth, imgX, textA, textB, textX) {
        let button = to.append("g")
            .attr("id", groupId);
        button.append("rect")
            .attr("width","100")
            .attr("height", "100")
            .attr("x", xCoord)
            .attr("y", "0");
        button.append("image")
            .attr("href", img)
            .attr("width", imgWidth)
            .attr("y", "5")
            .attr("x", imgX);
        button.append("text")
            .text(textA)
            .attr("y", "65")
            .attr("x", textX);
        button.append("text")
            .text(textB)
            .attr("y", "90")
            .attr("x", textX);
    }

    // pridej tlacitko do modalniho okna
    addButtonModal(to, clss, text) {
        to.append("button")
            .attr("class", clss)
            .text(text);
    }

    // vytvor modalni okno pro pridavani os
    buildModal() {
        const content = d3.select(this.modal_menu).attr("id", "modal_menu").append("div").attr("class", "content");
        let tmp = content.append("div")
            .attr("id", "buttons");
        this.addButtonModal(tmp, "close", "X");
        const tabs = content.append("div")
            .attr("class", "tabs");
        tmp = tabs.append("div")
            .attr("id", "modal_add");
        tmp.append("p").text("Vyhledávání časových os:");
        let form = tmp.append("div").attr("class", "dropdown");
        form.append("input")
            .attr("class", "form_control")
            .attr("type", "text")
            .attr("value", "")
            .attr("placeholder", "Začněte psát");
        form.append("ul")
            .attr("id", "content")
            .style("visibility", "hidden");
        tmp.append("button")
            .attr("id", "add_confirm")
            .text("Přidat osu");
        tmp.append("button")
            .attr("id", "add_example")
            .text("Ukázka časových os");
        tmp.append("button")
            .attr("id", "frequency")
            .text("Frekvenční metoda");
        tmp.append("button")
            .attr("id", "force")
            .text("Silova metoda");
        tmp.append("button")
            .attr("id", "random_order")
            .text("Náhodné pořadí");
    }

    // vytvor zapati s prislusnymi informacemi
    buildFooter() {
        const date = new Date();
        d3.select(this.footer).attr("id","footer");
        d3.select(this.footer).append("p")
            .text(`2021 - ${date.getFullYear()} ©`)
            .append("a")
            .attr("href", "./about.html")
            .text("O nás")
    }

    // prepocitej pozici tlacitek
    moveButtons() {
        let y = d3.select(this.canvas).node().clientHeight;
        let node = d3.select("#add");
        node.attr("transform", `translate(0,${y - node.node().firstChild.attributes["height"].value})`)
        node = d3.select("#remove");
        node.attr("transform", `translate(0,${y - node.node().firstChild.attributes["height"].value})`)
    }

    //--------------------------------------------------------------------------------------------
    //--------------------------Draw-timelines----------------------------------------------------
    // pridej zadany obrazek ke skupine g na urcitych souradnicich
    addImg(g, cls, imgPath, x, y, h, w, transf) {
        const newImg = g.append("image")
            .attr("class", cls)
            .attr("href", imgPath)
            .attr("x",x)
            .attr("y",y)
            .attr("height", h)
            .attr("width", w);
        if (transf !== undefined)
            newImg.attr("transform", transf);
    }

    // prenastav osu v item na zadane parametry
    setPath(item, datum, cls, color) {
        item.datum(datum)
            .attr("class", cls)
            .attr("stroke", color)
            .attr("d", this.context.area);
    }

    // pridej/zmen/odstran casove osy tak, aby se setrilo vytvareni novych prvku a mazani starych
    fillPaths(list, data) {
        let child = list.node() !== null ? list.node().firstElementChild : null;
        let i = 0;
        for (i; i < data.length; i++) {
            if (child !== null) {
                this.setPath(d3.select(child), data[i].datum, data[i].clsName, data[i].color);
                child = child.nextElementSibling;
                this.setPath(d3.select(child), [data[i].datum[0], data[i].datum[data[i].datum.length - 1]],
                    data[i].clsName + " sec_path", data[i].color);
                child = child.nextElementSibling;
            } else {
                this.setPath(list.append("path"), data[i].datum, data[i].clsName, data[i].color);
                this.setPath(list.append("path"), [data[i].datum[0], data[i].datum[data[i].datum.length - 1]],
                    data[i].clsName + " sec_path", data[i].color);
            }
        }
        if (i === data.length && child) {

            child = child.previousElementSibling;
            while (list.node().lastElementChild !== child)
                list.node().removeChild(list.node().lastElementChild);
        }
    }

    // pridej/uprav/smaz reprezentace casovych os (erby) dle potreby
    fillEmblems(list, data) {
        let child = list.node() !== null ? list.node().firstElementChild : null;
        let i = 0;
        for (i; i < data.length; i++) {
            if (child !== null) {
                let tmp = d3.select(child);
                tmp.attr("class", data[i].clsName)
                    .attr("transform", `translate(0,${data[i].start})`);
                tmp.select(".item").attr("href", data[i].imgPath);
                tmp.select("text").text(data[i].name);
                tmp.select(".colorPicker").attr("fill", data[i].color);
                if (i + 1 < data.length)
                    child = child.nextElementSibling;
            } else
                this.addEmblem(data[i].name, data[i].clsName, data[i].start, data[i].imgPath, data[i].color);
        }
        if (i === data.length && child)
            while (list.node().lastElementChild !== child)
                list.node().removeChild(list.node().lastElementChild);
    }

    // pridej reprezentaci casove osy
    addEmblem(name, clsName, y, path, color) {
        const embls = d3.select("#emblems");
        const newGroup = embls.append("g")
            .attr("class", `${clsName}`)
            .attr("transform", `translate(0,${y})`);
        newGroup.append("rect")
            .attr("class", "background")
            .attr("x", "-90")
            .attr("y", "-15")
            .attr("width", "190")
            .attr("height", "130");
        newGroup.append("text")
            .attr("x", "-70")
            .attr("y", "0")
            .text(name);
        // tlacitka skupiny
        this.addImg(newGroup, "item", path, "-35", "10", "100", "100")
        this.addImg(newGroup, "up hideable", __webpack_require__(/*! ../../../../img/smallArrow.png */ "./img/smallArrow.png"), "-75", "5", "30", "30");
        this.addImg(newGroup, "down hideable", __webpack_require__(/*! ../../../../img/smallArrow.png */ "./img/smallArrow.png"), "45", "-65", "30", "30", "rotate(180)");
        this.addImg(newGroup, "remove", __webpack_require__(/*! ../../../../img/remove.png */ "./img/remove.png"), "-100", "-5", "20", "20", "rotate(180)");
        // dummy vyber barev
        newGroup.append("circle")
            .attr("class", "colorPicker hideable")
            .attr("fill",color)
            .attr("cx", "-60")
            .attr("cy", "90")
            .attr("r", "20")
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        // element pro vlastni vyber a zmenu barev
        d3.select(this.canvas)
            .append("input")
            .attr("type", "color")
            .attr("class", `inputPicker ${clsName}`);
    }
    //------------------------
    // okenko pro napovedu u jednotlivych udalosti
    makeDescr(info) {
        let descr = d3.select(document.createElement("div"));
        descr.attr("id", "tooltip")
            .style("position", "absolute")
            .style("opacity", 0);
        let tmp = descr.append("div")
            .attr("class", "left");
        tmp.append("h2").text(info.name);
        tmp.append("p")
            .attr("class", "desc_date")
            .text(_currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getDateName(info.bck_x));
        tmp.append("p").text(info.desc);
        if (info.filters.length > 1) {
            tmp = descr.append("div")
                .attr("class", "right");
            tmp.append("h2")
                .text("Související časové linky");
            tmp = tmp.append("ul");
            for (let i = 0; i < info.filters.length; i++ )
                tmp.append("li").text(info.filters[i]);
        }
        return descr;
    }

    // spojeni obrazku udalosti s jeho popisem
    appendInfoTo(item, event) {
        event.attr("class", this.getClass(item.cls))
            .attr("href", item.icon)
            .attr("y",item.y)
            .attr("bckp-x", item.bck_x)
            .attr("x", this.context.xt2(item.bck_x))
            .attr("height", this.minWidthEvent)
            .attr("width", this.minWidthEvent)
            .attr("transform", "translate(-" + this.minWidthEvent / 2 + ",0)");
        const desc = this.makeDescr(item);
        tippy(event.node(), {
            content: desc.node().innerHTML,
            allowHTML: true,
            theme: "tooltip",
            placement: "left",
            duration: [500,200],
        });
    }

    // tecka v minimape
    appendMinimapMark(item) {
        // console.log(item);
        d3.select(".minimapDraw").append("circle")
            .attr("class", `miniEvent ${this.getClass(item.cls)}`)
            .attr("r", "5")
            .attr("cx", `${this.context.xt(item.bck_x) + this.minimapX}`)
            .attr("cy", "17.5")
            .attr("fill", d3.select(`#paths .${this.getClass(item.cls)}`).attr("stroke"));
    }

    // umisteni udalosti
    placeEvents(appendTo, events) {
        for (let item of events) {
            // console.log(item);
            this.appendInfoTo(item, appendTo.append("image"));
            this.appendMinimapMark(item);
        }
    }

    // umisteni skupiny nekolika udalosti v jednom miste
    placeGroup(appendTo, x, y, l) {
        let g = appendTo.append("g")
            .attr("class", "group")
            .on("mouseover", (d) => {
                const tmp = d3.select(d.target.parentNode).select("rect");
                const l = tmp.attr("length");
                tmp.attr("width",l*50);
                d3.select(d.target.parentNode).select(".placeholder").attr("display", "none");
                d3.select(d.target.parentNode).selectAll(".hideable").nodes().forEach(d => d3.select(d).attr("display", "inherit"));
            })
            .on("mouseout", (d) => {
                d3.select(d.target.parentNode).select("rect").attr("width", this.minWidthEvent);
                d3.select(d.target.parentNode).select(".placeholder").attr("display", "inherit");
                d3.select(d.target.parentNode).selectAll(".hideable").nodes().forEach(d => d3.select(d).attr("display", "none"));
            });
        g.append("rect")
            .attr("x", x)
            .attr("bckp-x", x)
            .attr("y", y)
            .attr("width", this.minWidthEvent)
            .attr("fill", "antiquewhite")
            .attr("length", l)
            .attr("transform", "translate(-" + this.minWidthEvent / 2 + ",0)");
        g.append("image")
            .attr("href", __webpack_require__(/*! ../../../../img/group.png */ "./img/group.png"))
            .attr("class", "placeholder")
            .attr("x", x)
            .attr("bckp-x", x)
            .attr("y", y)
            .attr("transform", "translate(-" + this.minWidthEvent / 2 + ",0)");
        return g;
    }

    // umisti event nebo skupinu do vizualizace
    placeCommonEvents(appendTo, events) {
        for (let item of events) {
            if (item.eventlist.length === 1)
                this.appendInfoTo(item.eventlist[0], appendTo.append("image"));
            else {
                // console.log(item.eventlist);
                // udelej skupinu
                let group = this.placeGroup(appendTo, item.eventlist[0].x,item.eventlist[0].y,item.eventlist.length);
                // vloz udalosti se vsemi daty
                for (let [idx, event] in item.eventlist.entries()) {
                    event.bck_x = event.bck_x + idx * this.minWidthEvent;
                    this.appendInfoTo(event, group.append("image"));
                }
            }
            this.appendMinimapMark(item.eventlist[0]);
        }
    }

    // vykresli vsechny vybrane casove osy
    drawRes(res) {
        this.fillPaths(d3.select("#paths"), res.paths);
        this.fillEmblems(d3.select("#emblems"), res.paths);
        let svgTarget = d3.select("#timeline_els");
        d3.selectAll("#timeline_els .group").remove();
        d3.selectAll("#timeline_els image").remove();
        d3.selectAll(".minimapDraw .miniEvent").remove();
        this.placeEvents(svgTarget, res.events);
        this.placeCommonEvents(svgTarget, res.commonEvents);
    }

    //--------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------

    // odstrani specifikovanou mnozinu elementu
    // potrebuje jako vstup pole prvku
    removeSpecificItems(items) {
        for(let item of items) {
            d3.selectAll(item).remove();
        }
    }

    // odstrani definovanou sadu prvku
    removeItems() {
        for(let item of ["#timeline_els .group", "#timeline_els image",".minimapDraw .miniEvent","#paths path",
            "#emblems g", ".inputPicker"]) {
            d3.selectAll(item).remove();
        }
    }

    // --------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------

    // Helper functions
    // preskaluj casove osy dle aktualniho priblizeni
    rescaleTimeline() {
        d3.select("#timelines").selectAll("image").nodes().forEach((d,i) => {
            const x = Number(d3.select(d).attr("bckp-x"));
            d3.select(d).attr("x", `${this.context.xt2(x)}`);
        });
    }

    // preskalovani skupin
    rescaleGroups(ctx) {
        let x = Number(d3.select(this).attr("bckp-x"));
        d3.select(this).attr("x", `${this.context.xt2(x)}`);
        x = d3.select(this).select(".placehlder").attr("bckp-x");
        d3.select(this).select(".placehlder").attr("x", `${this.context.xt2(x)}`);
    }

    // uprav zadanou tridu na pouzitelnou podobu
    getClass(cls) {
        return cls.split(" ").join("").replaceAll(".", "");
    }

    //--------------------------------------------------------------------------------------------
    //---------------------------------Selection utils--------------------------------------------

    // nasteveni stylu zadanemu prvku
    setStyle(target, style, value) {
        d3.select(target).style(style, value);
    }

    // ziskani stylu zadaneho prvku
    getStyle(target, style) {
        return d3.select(target).style(style);
    }

    // nastaveni atributu zadanemu prvku
    setAttrib(target, attrib, value) {
        d3.select(target).attr(attrib, value);
    }

    // ziskani atributu zadaneho prvku
    getAttrib(target, value) {
        return d3.select(target).attr(value);
    }

    // nastaveni callbacku zadanemu prvku s určitou akci
    setCallBack(target, action, cb) {
        d3.select(target).on(action, cb);
    }

    // nacteni elementu z vizualizace
    getElement(target) {
        return d3.select(target);
    }

    // nacteni vsech specifikovanych elementu z vizualizace
    getAllElements(target) {
        return d3.selectAll(target);
    }

    //--------------------------------------------------------------------------------------------
    //--------utils------------------------
    //https://stackoverflow.com/questions/29031659/calculate-width-of-text-before-drawing-the-text
    // vypocet sirky textu z velikosti fontu a typu fontu
    BrowserText = (function () {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        /**
         * Measures the rendered width of arbitrary text given the font size and font face
         * @param {string} text The text to measure
         * @param {number} fontSize The font size in pixels
         * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
         * @returns {number} The width of the text
         **/
        function getWidth(text, fontSize, fontFace) {
            ctx.font = fontSize + 'px ' + fontFace;
            return ctx.measureText(text).width;
        }

        return {
            getWidth: getWidth
        };
    })();

}

/***/ }),

/***/ "./communication.js":
/*!**************************!*\
  !*** ./communication.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Communication)
/* harmony export */ });
// trida pro komunikaci se serverovou casti

class Communication {
    constructor(context) {
        this.context = context;
    }

    // drzi informace k vybranemu prvku v input okenku pod kategoriemi
    searchItem = {name: "", id: -1};

    // nastav searchItem na zadane hodnoty
    fillSearchItem(name, id, cat){
        this.searchItem.name = name;
        this.searchItem.id = Number(id);
        // console.log(this.searchItem);
    }

    // zmena v dropdown menu pro pridavani
    changeSearched(e, sup) {
        // console.log(e.target);
        e = e.target;
        d3.selectAll("#content .searchSel").nodes().forEach((el) => {if (el.attributes.class.value === "searchSel") el.attributes.class.value = "";});
        sup.fillSearchItem(e.textContent, e.attributes.ida.value, e.attributes.cat.value);
        e.attributes["class"].value = "searchSel";
        d3.select(".form_control").node().value = e.textContent;
        d3.select("#content").style("visibility", "hidden");
    }

    // vypln drop down list
    fillDropDown(list, data) {
        // vem prvni element
        let child = list.node().firstElementChild;
        let i = 0;
        // projdi data
        for (i; i < data.length; i++) {
            // pokud je pritomny dalsi element tak ho vypln
            if (child) {
                d3.select(child).attr("ida", data[i].id);
                d3.select(child).attr("cat", data[i].category.id);
                d3.select(child).text(data[i].name);
                if (i + 1 < data.length)
                    child = child.nextElementSibling;
            } else { // jinak pridej dalsi a nastav ho
                list.append("li")
                    .attr("ida", data[i].id)
                    .attr("cat", data[i].category.id)
                    .attr("class", "")
                    .on("click", (e) => {this.changeSearched(e, this)})
                    .text(data[i].name);
            }
        }
        // pokud neco prebyva tak to odstran
        if (i === data.length && child)
            while (list.node().lastElementChild !== child)
                list.node().removeChild(list.node().lastElementChild);
        // pokud se nic nevyplnuje tak to cele smaz
        if (data.length === 0)
            while (list.node().lastElementChild)
                list.node().removeChild(list.node().lastElementChild);
    }

    // ziskej ze serveru vse se zadanym vyrazem searchFor
    async fetchTags(searchFor, data) {
        // doptej se na server
        let resp = await fetch(this.context.url + `/tag/byContent?search=${searchFor}`);
        // parse
        data = await resp.json();
        // uloz ziskana data
        for (const item of data) {
            if (!this.context.data.some(el => el.name === item.name))
                this.context.data.push({
                    name: item.name,
                    clsName: item.name.split(" ").join("").replaceAll(".", ""),
                    id:item.id,
                    category:{id: item.category.id, icon: item.category.icon},
                    icon: item.icon ? item.icon.path : undefined,
                    events:undefined
                });
        }
    }

    // najdi polozky z databaze odpovidajici psanemu textu
    async searchCats() {
        // vyber dropdown
        const list = d3.select("#content");
        // console.log(selected);
        // ziskje hledanou frazi
        const searchFor = d3.select(".form_control").node().value;
        // pokud neni prazdna
        if (searchFor !== "") {
            // zobraz dropdown
            d3.select("#content").style("visibility", "inherit");
            // let data = this.context.data.filter(item => item.name.includes(searchFor) && (item.category.id === Number(selected.value) || Number(selected.value) === 0));
            // nacti data z bufferu
            let data = this.context.data.filter(item => item.name.includes(searchFor));
            // pokud je to prvni nacitani, tak nektera data nemusi byt pritomna, nacti je ze serveru
            if (!data.length) {
                await this.fetchTags(searchFor, data);
                // data = this.context.data.filter(item => item.name.includes(searchFor) && (item.category.id === Number(selected.value) || Number(selected.value) === 0));
                data = this.context.data.filter(item => item.name.includes(searchFor));
            }
            // filtruj data
            this.fillDropDown(list, data)
        }
        else {
            // schovej dropdown
            d3.select("#content").style("visibility", "hidden");
            d3.selectAll("#content").each(function (d,i) {d3.select(this).attr["class"] = "";});
            // vycisti search item
            this.fillSearchItem("", -1, -1);
        }
    }

    // uklada do databufferu eventy osy vybrane z dropdown menu
    async saveToBuffer() {
        // najdi dany element
        let el = this.context.data.findIndex(e => e.id === this.searchItem.id);
        let item = this.context.data[el];
        // console.log(this.searchItem);
        // pokud jeste nemame jeho data
        if (el !== -1) {
            // pokud nemame udalsti pak je ziskej
            if (item.events === undefined){
                let resp = await fetch(this.context.url + `/event/byFilterId?id=${this.searchItem.id}`);
                item.events = await resp.json();
            }
            // pokud je ma a neni v aktivnim listu
            if (item.events.length !== 0 &&
                this.context.active.find(e => e.id === this.searchItem.id) === undefined) {
                // console.log(item);
                // pridej danou osu a jeji informace k aktivnim prvkum
                this.context.active.push({
                    name:this.searchItem.name,
                    clsName: item.clsName,
                    id:this.searchItem.id,
                    events:item.events,
                    color: this.context.getNextFreeColor(),
                    iconPath: item.icon !== undefined ? item.icon :
                        (item.category.icon !== undefined ? item.category.icon.path : "/img/tags/black-box.png")
                });
            }
        }
        // console.log(this.context.active);
    }

    //-----------------------debugging part
    clearElement(name) {
        const events = d3.select(name);
        while (events.node().firstElementChild)
            events.node().removeChild(events.node().lastElementChild);
    }

    iterateEvents(name, data) {
        const events = d3.select("#eventsResult");
        events.append("h2").text(name + " - počet událostí:" + data.length);
        for (const item of data) {
            const list = events.append("ul");
            list.append("li").text("id: " + item["id"]);
            list.append("li").text("Nazev: " + item["name"]);
            list.append("li").text("Popis: " + item["description"]);
            list.append("li").text("Zacatek: " + item["begin"]);
            list.append("li").text("IconsPath: " + item["icon"]["path"]);
        }
        events.append("hr");
    }

    async showEventsToId() {
        // console.log(`${control.value}`);
        this.clearElement("#eventsResult");
        // console.log(text);
        // doptat se na eventy
        let resp = await fetch(this.context.url + `/event/byFilterId?id=${searchItem.id}`);
        let data = await resp.json();
        // vypsat vysledek
        this.iterateEvents(this.searchItem.name, data);
    }
    //-----------------------\debugging part
}

/***/ }),

/***/ "./context.js":
/*!********************!*\
  !*** ./context.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Context)
/* harmony export */ });
/* harmony import */ var _currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./currentVer/DateUtils.js */ "./currentVer/DateUtils.js");
// trida ktera drzi zakladni potrebne informace


class Context {
    // FIXME musi byt spravna url
    // url pro dotazovani
    url = "https://asteriontimelinesvisualisation.up.railway.app";
    icoUrl = "https://asteriontimelines.up.railway.app";

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
        d3.select("#start_time").text(_currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getDateName(this.minDate));
        d3.select("#end_time").text(_currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getDateName(this.maxDate));
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

/***/ }),

/***/ "./currentVer/DateUtils.js":
/*!*********************************!*\
  !*** ./currentVer/DateUtils.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class DateUtils {
    // return array with all months names and holiday label
    static getMonthsWithHolidays() {
        let months = this.months.map(m => { return m.name; });
        months.push(DateUtils.holidaysLabel);
        return months;
    }
    // if the day in year is holiday, returns true 
    static isHoliday(dayInYear) {
        return DateUtils.holidays.has(dayInYear);
    }
    ;
    // returns month in which the day takes place
    static getMonthByDay(dayInYear) {
        return DateUtils.months.find((month) => {
            return dayInYear >= month.firstDay && dayInYear <= month.lastDay;
        });
    }
    // returns year in which the day takes place
    static getYear(daysFromZero) {
        return Math.floor(daysFromZero / DateUtils.daysInYear);
    }
    // returns day in year (0-370) from count of days from day 0
    static getDayInYear(daysFromZero) {
        let dayInYear = daysFromZero % DateUtils.daysInYear;
        if (dayInYear < 0)
            dayInYear = DateUtils.daysInYear + dayInYear;
        return dayInYear;
    }
    // return name of month in which day takes place, day is represented by count og days from day 0
    static getMonth(daysFromZero) {
        let dayInYear = DateUtils.getDayInYear(daysFromZero);
        if (DateUtils.isHoliday(dayInYear))
            return DateUtils.holidaysLabel;
        return DateUtils.getMonthByDay(dayInYear).name;
    }
    // returns array with name of days in wantad month or list of all holidays
    static getDaysList(month) {
        if (month === DateUtils.holidaysLabel)
            return [...this.holidays.values()];
        return [...Array(30).keys()].map(i => { return (i + 1).toString(); });
    }
    // returns day represented as count of days in year
    // parameter daysFromZero is day represented as count od days from day 0 in year 0
    static getDay(daysFromZero) {
        let dayInYear = DateUtils.getDayInYear(daysFromZero);
        if (DateUtils.isHoliday(dayInYear))
            return DateUtils.holidays.get(dayInYear);
        return (dayInYear - DateUtils.getMonthByDay(dayInYear).firstDay + 1).toString();
    }
    // returns 
    static getDayFromZero(day, month, year) {
        let dayInYear;
        if (month === DateUtils.holidaysLabel) {
            dayInYear = [...DateUtils.holidays.entries()].find(([date, name]) => name == day)[0];
        }
        else {
            let monthData = DateUtils.months.find((m) => month == m.name);
            dayInYear = monthData.firstDay + parseInt(day) - 1;
        }
        let yearDays = year * DateUtils.daysInYear;
        return yearDays + dayInYear;
    }
    static getDateName(daysFromZero) {
        let year = DateUtils.getYear(daysFromZero);
        let dayInYear = DateUtils.getDayInYear(daysFromZero);
        if (DateUtils.isHoliday(dayInYear)) {
            let day = DateUtils.holidays.get(dayInYear);
            return day + " " + year;
        }
        else {
            let month = this.getMonthByDay(dayInYear);
            let day = dayInYear - month.firstDay + 1;
            return day + ". " + month.name + " " + year;
        }
    }
}
// count of days in Asterion's year
DateUtils.daysInYear = 370;
DateUtils.holidaysLabel = "Svátky";
// array with Month objects. Month object contains numbers of month's first day in year and month's last day in year and name of year   
DateUtils.months = [
    { firstDay: 0, lastDay: 29, name: "Chladen" },
    { firstDay: 30, lastDay: 59, name: "Kliden" },
    { firstDay: 61, lastDay: 90, name: "Novorost" },
    { firstDay: 92, lastDay: 121, name: "Rozkvet" },
    { firstDay: 122, lastDay: 151, name: "Zelenec" },
    { firstDay: 154, lastDay: 183, name: "Ploden" },
    { firstDay: 185, lastDay: 214, name: "Žluten" },
    { firstDay: 215, lastDay: 244, name: "Úmor" },
    { firstDay: 246, lastDay: 275, name: "Traven" },
    { firstDay: 277, lastDay: 306, name: "Ovocen" },
    { firstDay: 307, lastDay: 336, name: "Větrnec" },
    { firstDay: 339, lastDay: 368, name: "Dešten" }
];
// map of all Asterion's holidays with day in which the holiday takes place in year and name of holiday  
DateUtils.holidays = new Map([
    [60, "Den pústu"],
    [91, "Den očištění"],
    [152, "Sv. letních duchů 1"],
    [153, "Sv. letních duchů 2"],
    [184, "Sv. mladých srdcí"],
    [245, "Den hojnosti"],
    [276, "Den zákonů"],
    [337, "Sv. zimních duchů 1"],
    [338, "Sv. zimních duchů 2"],
    [369, "Sv. proroků"]
]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DateUtils);
//# sourceMappingURL=DateUtils.js.map

/***/ }),

/***/ "./intersections.js":
/*!**************************!*\
  !*** ./intersections.js ***!
  \**************************/
/***/ ((module) => {

(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c=undefined;if(!f&&c)return require(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u=undefined,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// expose classes

exports.Point2D = require('./lib/Point2D');
exports.Vector2D = require('./lib/Vector2D');
exports.Matrix2D = require('./lib/Matrix2D');

},{"./lib/Matrix2D":2,"./lib/Point2D":3,"./lib/Vector2D":4}],2:[function(require,module,exports){
/**
 *   Matrix2D.js
 *
 *   copyright 2001-2002, 2013 Kevin Lindsey
 */

/**
 *  Matrix2D
 *
 *  [a c e]
 *  [b d f]
 *  [0 0 1]
 *
 *  @param {Number} a
 *  @param {Number} b
 *  @param {Number} c
 *  @param {Number} d
 *  @param {Number} e
 *  @param {Number} f
 *  @returns {Matrix2D}
 */
function Matrix2D(a, b, c, d, e, f) {
    Object.defineProperties(this, {
        "a": {
            value: (a !== undefined) ? a : 1,
            writable: false,
            enumerable: true,
            configurable: false
        },
        "b": {
            value: (b !== undefined) ? b : 0,
            writable: false,
            enumerable: true,
            configurable: false
        },
        "c": {
            value: (c !== undefined) ? c : 0,
            writable: false,
            enumerable: true,
            configurable: false
        },
        "d": {
            value: (d !== undefined) ? d : 1,
            writable: false,
            enumerable: true,
            configurable: false
        },
        "e": {
            value: (e !== undefined) ? e : 0,
            writable: false,
            enumerable: true,
            configurable: false
        },
        "f": {
            value: (f !== undefined) ? f : 0,
            writable: false,
            enumerable: true,
            configurable: false
        }
    });
}

/**
 *  Identity matrix
 *
 *  @returns {Matrix2D}
 */
// TODO: consider using Object#defineProperty to make this read-only
Matrix2D.IDENTITY = new Matrix2D(1, 0, 0, 1, 0, 0);
Matrix2D.IDENTITY.isIdentity = function () { return true; };

/**
 *  multiply
 *
 *  @pararm {Matrix2D} that
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.multiply = function (that) {
    if (this.isIdentity()) {
        return that;
    }

    if (that.isIdentity()) {
        return this;
    }

    return new this.constructor(
        this.a * that.a + this.c * that.b,
        this.b * that.a + this.d * that.b,
        this.a * that.c + this.c * that.d,
        this.b * that.c + this.d * that.d,
        this.a * that.e + this.c * that.f + this.e,
        this.b * that.e + this.d * that.f + this.f
    );
};

/**
 *  inverse
 *
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.inverse = function () {
    if (this.isIdentity()) {
        return this;
    }

    var det1 = this.a * this.d - this.b * this.c;

    if ( det1 === 0.0 ) {
        throw("Matrix is not invertible");
    }

    var idet = 1.0 / det1;
    var det2 = this.f * this.c - this.e * this.d;
    var det3 = this.e * this.b - this.f * this.a;

    return new this.constructor(
        this.d * idet,
       -this.b * idet,
       -this.c * idet,
        this.a * idet,
          det2 * idet,
          det3 * idet
    );
};

/**
 *  translate
 *
 *  @param {Number} tx
 *  @param {Number} ty
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.translate = function(tx, ty) {
    return new this.constructor(
        this.a,
        this.b,
        this.c,
        this.d,
        this.a * tx + this.c * ty + this.e,
        this.b * tx + this.d * ty + this.f
    );
};

/**
 *  scale
 *
 *  @param {Number} scale
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.scale = function(scale) {
    return new this.constructor(
        this.a * scale,
        this.b * scale,
        this.c * scale,
        this.d * scale,
        this.e,
        this.f
    );
};

/**
 *  scaleAt
 *
 *  @param {Number} scale
 *  @param {Point2D} center
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.scaleAt = function(scale, center) {
    var dx = center.x - scale * center.x;
    var dy = center.y - scale * center.y;

    return new this.constructor(
        this.a * scale,
        this.b * scale,
        this.c * scale,
        this.d * scale,
        this.a * dx + this.c * dy + this.e,
        this.b * dx + this.d * dy + this.f
    );
};

/**
 *  scaleNonUniform
 *
 *  @param {Number} scaleX
 *  @param {Number} scaleY
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.scaleNonUniform = function(scaleX, scaleY) {
    return new this.constructor(
        this.a * scaleX,
        this.b * scaleX,
        this.c * scaleY,
        this.d * scaleY,
        this.e,
        this.f
    );
};

/**
 *  scaleNonUniformAt
 *
 *  @param {Number} scaleX
 *  @param {Number} scaleY
 *  @param {Point2D} center
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.scaleNonUniformAt = function(scaleX, scaleY, center) {
    var dx = center.x - scaleX * center.x;
    var dy = center.y - scaleY * center.y;

    return new this.constructor(
        this.a * scaleX,
        this.b * scaleX,
        this.c * scaleY,
        this.d * scaleY,
        this.a * dx + this.c * dy + this.e,
        this.b * dx + this.d * dy + this.f
    );
};

/**
 *  rotate
 *
 *  @param {Number} radians
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.rotate = function(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);

    return new this.constructor(
        this.a *  c + this.c * s,
        this.b *  c + this.d * s,
        this.a * -s + this.c * c,
        this.b * -s + this.d * c,
        this.e,
        this.f
    );
};

/**
 *  rotateAt
 *
 *  @param {Number} radians
 *  @param {Point2D} center
 *  @result {Matrix2D}
 */
Matrix2D.prototype.rotateAt = function(radians, center) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    var t1 = -center.x + center.x * c - center.y * s;
    var t2 = -center.y + center.y * c + center.x * s;

    return new this.constructor(
        this.a *  c + this.c * s,
        this.b *  c + this.d * s,
        this.a * -s + this.c * c,
        this.b * -s + this.d * c,
        this.a * t1 + this.c * t2 + this.e,
        this.b * t1 + this.d * t2 + this.f
    );
};

/**
 *  rotateFromVector
 *
 *  @param {Vector2D}
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.rotateFromVector = function(vector) {
    var unit = vector.unit();
    var c = unit.x; // cos
    var s = unit.y; // sin

    return new this.constructor(
        this.a *  c + this.c * s,
        this.b *  c + this.d * s,
        this.a * -s + this.c * c,
        this.b * -s + this.d * c,
        this.e,
        this.f
    );
};

/**
 *  flipX
 *
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.flipX = function() {
    return new this.constructor(
        -this.a,
        -this.b,
         this.c,
         this.d,
         this.e,
         this.f
    );
};

/**
 *  flipY
 *
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.flipY = function() {
    return new this.constructor(
         this.a,
         this.b,
        -this.c,
        -this.d,
         this.e,
         this.f
    );
};

/**
 *  skewX
 *
 *  @pararm {Number} radians
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.skewX = function(radians) {
    var t = Math.tan(radians);

    return new this.constructor(
        this.a,
        this.b,
        this.a * t + this.c,
        this.b * t + this.d,
        this.e,
        this.f
    );
};

// TODO: skewXAt

/**
 *  skewY
 *
 *  @pararm {Number} radians
 *  @returns {Matrix2D}
 */
Matrix2D.prototype.skewY = function(radians) {
    var t = Math.tan(radians);

    return new this.constructor(
        this.a + this.c * t,
        this.b + this.d * t,
        this.c,
        this.d,
        this.e,
        this.f
    );
};

// TODO: skewYAt

/**
 *  isIdentity
 *
 *  @returns {Boolean}
 */
Matrix2D.prototype.isIdentity = function() {
    return (
        this.a === 1.0 &&
        this.b === 0.0 &&
        this.c === 0.0 &&
        this.d === 1.0 &&
        this.e === 0.0 &&
        this.f === 0.0
    );
};

/**
 *  isInvertible
 *
 *  @returns {Boolean}
 */
Matrix2D.prototype.isInvertible = function() {
    return this.a * this.d - this.b * this.c !== 0.0;
};

/**
 *  getScale
 *
 *  @returns {{ scaleX: Number, scaleY: Number }}
 */
Matrix2D.prototype.getScale = function() {
    return {
        scaleX: Math.sqrt(this.a * this.a + this.c * this.c),
        scaleY: Math.sqrt(this.b * this.b + this.d * this.d)
    };
};

/**
 *  getDecomposition
 *
 *  Calculates matrix Singular Value Decomposition
 *
 *  The resulting matrices, translation, rotation, scale, and rotation0, return
 *  this matrix when they are muliplied together in the listed order
 *
 *  @see Jim Blinn's article {@link http://dx.doi.org/10.1109/38.486688}
 *  @see {@link http://math.stackexchange.com/questions/861674/decompose-a-2d-arbitrary-transform-into-only-scaling-and-rotation}
 *
 *  @returns {{ translation: Matrix2D, rotation: Matrix2D, scale: Matrix2D, rotation0: Matrix2D }}
 */
Matrix2D.prototype.getDecomposition = function () {
    var E      = (this.a + this.d) * 0.5;
    var F      = (this.a - this.d) * 0.5;
    var G      = (this.b + this.c) * 0.5;
    var H      = (this.b - this.c) * 0.5;

    var Q      = Math.sqrt(E * E + H * H);
    var R      = Math.sqrt(F * F + G * G);
    var scaleX = Q + R;
    var scaleY = Q - R;

    var a1     = Math.atan2(G, F);
    var a2     = Math.atan2(H, E);
    var theta  = (a2 - a1) * 0.5;
    var phi    = (a2 + a1) * 0.5;

    // TODO: Add static methods to generate translation, rotation, etc.
    // matrices directly

    return {
        translation: new this.constructor(1, 0, 0, 1, this.e, this.f),
        rotation:    this.constructor.IDENTITY.rotate(phi),
        scale:       new this.constructor(scaleX, 0, 0, scaleY, 0, 0),
        rotation0:   this.constructor.IDENTITY.rotate(theta)
    };
};

/**
 *  equals
 *
 *  @param {Matrix2D} that
 *  @returns {Boolean}
 */
Matrix2D.prototype.equals = function(that) {
    return (
        this.a === that.a &&
        this.b === that.b &&
        this.c === that.c &&
        this.d === that.d &&
        this.e === that.e &&
        this.f === that.f
    );
};

/**
 *  toString
 *
 *  @returns {String}
 */
Matrix2D.prototype.toString = function() {
    return "matrix(" + [this.a, this.b, this.c, this.d, this.e, this.f].join(",") + ")";
};

if (typeof module !== "undefined") {
    module.exports = Matrix2D;
}

},{}],3:[function(require,module,exports){
/**
 *
 *   Point2D.js
 *
 *   copyright 2001-2002, 2013 Kevin Lindsey
 *
 */

/**
 *  Point2D
 *
 *  @param {Number} x
 *  @param {Number} y
 *  @returns {Point2D}
 */
function Point2D(x, y) {
    Object.defineProperties(this, {
        "x": {
            value: x,
            writable: false,
            enumerable: true,
            configurable: false
        },
        "y": {
            value: y,
            writable: false,
            enumerable: true,
            configurable: false
        }
    });
    // this.x = x;
    // this.y = y;
}

/**
 *  clone
 *
 *  @returns {Point2D}
 */
Point2D.prototype.clone = function() {
    return new this.constructor(this.x, this.y);
};

/**
 *  add
 *
 *  @param {Point2D|Vector2D} that
 *  @returns {Point2D}
 */
Point2D.prototype.add = function(that) {
    return new this.constructor(this.x+that.x, this.y+that.y);
};

/**
 *  subtract
 *
 *  @param { Vector2D | Point2D } that
 *  @returns {Point2D}
 */
Point2D.prototype.subtract = function(that) {
    return new this.constructor(this.x-that.x, this.y-that.y);
};

/**
 *  multiply
 *
 *  @param {Number} scalar
 *  @returns {Point2D}
 */
Point2D.prototype.multiply = function(scalar) {
    return new this.constructor(this.x*scalar, this.y*scalar);
};

/**
 *  divide
 *
 *  @param {Number} scalar
 *  @returns {Point2D}
 */
Point2D.prototype.divide = function(scalar) {
    return new this.constructor(this.x/scalar, this.y/scalar);
};

/**
 *  equals
 *
 *  @param {Point2D} that
 *  @returns {Boolean}
 */
Point2D.prototype.equals = function(that) {
    return ( this.x === that.x && this.y === that.y );
};

// utility methods

/**
 *  lerp
 *
 *  @param { Vector2D | Point2D } that
 *  @param {Number} t
 @  @returns {Point2D}
 */
Point2D.prototype.lerp = function(that, t) {
    var omt = 1.0 - t;

    return new this.constructor(
        this.x * omt + that.x * t,
        this.y * omt + that.y * t
    );
};

/**
 *  distanceFrom
 *
 *  @param {Point2D} that
 *  @returns {Number}
 */
Point2D.prototype.distanceFrom = function(that) {
    var dx = this.x - that.x;
    var dy = this.y - that.y;

    return Math.sqrt(dx*dx + dy*dy);
};

/**
 *  min
 *
 *  @param {Point2D} that
 *  @returns {Number}
 */
Point2D.prototype.min = function(that) {
    return new this.constructor(
        Math.min( this.x, that.x ),
        Math.min( this.y, that.y )
    );
};

/**
 *  max
 *
 *  @param {Point2D} that
 *  @returns {Number}
 */
Point2D.prototype.max = function(that) {
    return new this.constructor(
        Math.max( this.x, that.x ),
        Math.max( this.y, that.y )
    );
};

/**
 *  transform
 *
 *  @param {Matrix2D}
 *  @result {Point2D}
 */
Point2D.prototype.transform = function(matrix) {
    return new this.constructor(
        matrix.a * this.x + matrix.c * this.y + matrix.e,
        matrix.b * this.x + matrix.d * this.y + matrix.f
    );
};

/**
 *  toString
 *
 *  @returns {String}
 */
Point2D.prototype.toString = function() {
    return "point(" + this.x + "," + this.y + ")";
};

if (typeof module !== "undefined") {
    module.exports = Point2D;
}

},{}],4:[function(require,module,exports){
/**
 *
 *   Vector2D.js
 *
 *   copyright 2001-2002, 2013 Kevin Lindsey
 *
 */

/**
 *  Vector2D
 *
 *  @param {Number} x
 *  @param {Number} y
 *  @returns {Vector2D}
 */
function Vector2D(x, y) {
    Object.defineProperties(this, {
        "x": {
            value: x,
            writable: false,
            enumerable: true,
            configurable: false
        },
        "y": {
            value: y,
            writable: false,
            enumerable: true,
            configurable: false
        }
    });
    // this.x = x;
    // this.y = y;
}

/**
 *  fromPoints
 *
 *  @param {Point2D} p1
 *  @param {Point2D} p2
 *  @returns {Vector2D}
 */
Vector2D.fromPoints = function(p1, p2) {
    return new Vector2D(
        p2.x - p1.x,
        p2.y - p1.y
    );
};

/**
 *  length
 *
 *  @returns {Number}
 */
Vector2D.prototype.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
};

/**
 *  magnitude
 *
 *  @returns {Number}
 */
Vector2D.prototype.magnitude = function() {
    return this.x*this.x + this.y*this.y;
};

/**
 *  dot
 *
 *  @param {Vector2D} that
 *  @returns {Number}
 */
Vector2D.prototype.dot = function(that) {
    return this.x*that.x + this.y*that.y;
};

/**
 *  cross
 *
 *  @param {Vector2D} that
 *  @returns {Number}
 */
Vector2D.prototype.cross = function(that) {
    return this.x*that.y - this.y*that.x;
};

/**
 *  determinant
 *
 *  @param {Vector2D} that
 *  @returns {Number}
 */
Vector2D.prototype.determinant = function(that) {
    return this.x*that.y - this.y*that.x;
};

/**
 *  unit
 *
 *  @returns {Vector2D}
 */
Vector2D.prototype.unit = function() {
    return this.divide( this.length() );
};

/**
 *  add
 *
 *  @param {Vector2D} that
 *  @returns {Vector2D}
 */
Vector2D.prototype.add = function(that) {
    return new this.constructor(this.x + that.x, this.y + that.y);
};

/**
 *  subtract
 *
 *  @param {Vector2D} that
 *  @returns {Vector2D}
 */
Vector2D.prototype.subtract = function(that) {
    return new this.constructor(this.x - that.x, this.y - that.y);
};

/**
 *  multiply
 *
 *  @param {Number} scalar
 *  @returns {Vector2D}
 */
Vector2D.prototype.multiply = function(scalar) {
    return new this.constructor(this.x * scalar, this.y * scalar);
};

/**
 *  divide
 *
 *  @param {Number} scalar
 *  @returns {Vector2D}
 */
Vector2D.prototype.divide = function(scalar) {
    return new this.constructor(this.x / scalar, this.y / scalar);
};

/**
 *  angleBetween
 *
 *  @param {Vector2D} that
 *  @returns {Number}
 */
Vector2D.prototype.angleBetween = function(that) {
    var cos = this.dot(that) / (this.length() * that.length());
    cos = Math.max(-1, Math.min(cos, 1));
    var radians = Math.acos(cos);

    return (this.cross(that) < 0.0) ? -radians : radians;
};

/**
 *  Find a vector is that is perpendicular to this vector
 *
 *  @returns {Vector2D}
 */
Vector2D.prototype.perp = function() {
    return new this.constructor(-this.y, this.x);
};

/**
 *  Find the component of the specified vector that is perpendicular to
 *  this vector
 *
 *  @param {Vector2D} that
 *  @returns {Vector2D}
 */
Vector2D.prototype.perpendicular = function(that) {
    return this.subtract(this.project(that));
};

/**
 *  project
 *
 *  @param {Vector2D} that
 *  @returns {Vector2D}
 */
Vector2D.prototype.project = function(that) {
    var percent = this.dot(that) / that.dot(that);

    return that.multiply(percent);
};

/**
 *  transform
 *
 *  @param {Matrix2D}
 *  @returns {Vector2D}
 */
Vector2D.prototype.transform = function(matrix) {
    return new this.constructor(
        matrix.a * this.x + matrix.c * this.y,
        matrix.b * this.x + matrix.d * this.y
    );
};

/**
 *  equals
 *
 *  @param {Vector2D} that
 *  @returns {Boolean}
 */
Vector2D.prototype.equals = function(that) {
    return (
        this.x === that.x &&
        this.y === that.y
    );
};

/**
 *  toString
 *
 *  @returns {String}
 */
Vector2D.prototype.toString = function() {
    return "vector(" + this.x + "," + this.y + ")";
};

if (typeof module !== "undefined") {
    module.exports = Vector2D;
}

},{}],5:[function(require,module,exports){
// expose classes

exports.Polynomial = require('./lib/Polynomial');
exports.SqrtPolynomial = require('./lib/SqrtPolynomial');

},{"./lib/Polynomial":6,"./lib/SqrtPolynomial":7}],6:[function(require,module,exports){
/**
 *
 *   Polynomial.js
 *
 *   copyright 2002, 2013 Kevin Lindsey
 * 
 *   contribution {@link http://github.com/Quazistax/kld-polynomial}
 *       @copyright 2015 Robert Benko (Quazistax) <quazistax@gmail.com>
 *       @license MIT
 */

Polynomial.TOLERANCE = 1e-6;
Polynomial.ACCURACY  = 15;


/**
 *  interpolate
 *
 *  @param {Array<Number>} xs
 *  @param {Array<Number>} ys
 *  @param {Number} n
 *  @param {Number} offset
 *  @param {Number} x
 *
 *  @returns {y:Number, dy:Number}
 */
Polynomial.interpolate = function(xs, ys, n, offset, x) {
    if ( xs.constructor !== Array || ys.constructor !== Array )
        throw new Error("Polynomial.interpolate: xs and ys must be arrays");
    if ( isNaN(n) || isNaN(offset) || isNaN(x) )
        throw new Error("Polynomial.interpolate: n, offset, and x must be numbers");

    var y  = 0;
    var dy = 0;
    var c = new Array(n);
    var d = new Array(n);
    var ns = 0;
    var result;

    var diff = Math.abs(x - xs[offset]);
    for ( var i = 0; i < n; i++ ) {
        var dift = Math.abs(x - xs[offset+i]);

        if ( dift < diff ) {
            ns = i;
            diff = dift;
        }
        c[i] = d[i] = ys[offset+i];
    }
    y = ys[offset+ns];
    ns--;

    for ( var m = 1; m < n; m++ ) {
        for ( var i = 0; i < n-m; i++ ) {
            var ho = xs[offset+i] - x;
            var hp = xs[offset+i+m] - x;
            var w = c[i+1]-d[i];
            var den = ho - hp;

            if ( den == 0.0 ) {
                result = { y: 0, dy: 0};
                break;
            }

            den = w / den;
            d[i] = hp*den;
            c[i] = ho*den;
        }
        dy = (2*(ns+1) < (n-m)) ? c[ns+1] : d[ns--];
        y += dy;
    }

    return { y: y, dy: dy };
};


/**
 *  Polynomial
 *
 *  @returns {Polynomial}
 */
function Polynomial() {
    this.init( arguments );
}


/**
 *  init
 */
Polynomial.prototype.init = function(coefs) {
    this.coefs = new Array();

    for ( var i = coefs.length - 1; i >= 0; i-- )
        this.coefs.push( coefs[i] );

    this._variable = "t";
    this._s = 0;
};


/**
 *  eval
 */
Polynomial.prototype.eval = function(x) {
    if ( isNaN(x) )
        throw new Error("Polynomial.eval: parameter must be a number");

    var result = 0;

    for ( var i = this.coefs.length - 1; i >= 0; i-- )
        result = result * x + this.coefs[i];

    return result;
};


/**
 *  add
 */
Polynomial.prototype.add = function(that) {
    var result = new Polynomial();
    var d1 = this.getDegree();
    var d2 = that.getDegree();
    var dmax = Math.max(d1,d2);

    for ( var i = 0; i <= dmax; i++ ) {
        var v1 = (i <= d1) ? this.coefs[i] : 0;
        var v2 = (i <= d2) ? that.coefs[i] : 0;

        result.coefs[i] = v1 + v2;
    }

    return result;
};


/**
 *  multiply
 */
Polynomial.prototype.multiply = function(that) {
    var result = new Polynomial();

    for ( var i = 0; i <= this.getDegree() + that.getDegree(); i++ )
        result.coefs.push(0);

    for ( var i = 0; i <= this.getDegree(); i++ )
        for ( var j = 0; j <= that.getDegree(); j++ )
            result.coefs[i+j] += this.coefs[i] * that.coefs[j];

    return result;
};


/**
 *  divide_scalar
 */
Polynomial.prototype.divide_scalar = function(scalar) {
    for ( var i = 0; i < this.coefs.length; i++ )
        this.coefs[i] /= scalar;
};


/**
 *  simplify
 */
Polynomial.prototype.simplify = function() {
    var TOLERANCE = 1e-15;
    for ( var i = this.getDegree(); i >= 0; i-- ) {
        if ( Math.abs( this.coefs[i] ) <= TOLERANCE )
            this.coefs.pop();
        else
            break;
    }
};


/**
 *  bisection
 */
Polynomial.prototype.bisection = function(min, max) {
    var minValue = this.eval(min);
    var maxValue = this.eval(max);
    var result;

    if ( Math.abs(minValue) <= Polynomial.TOLERANCE )
        result = min;
    else if ( Math.abs(maxValue) <= Polynomial.TOLERANCE )
        result = max;
    else if ( minValue * maxValue <= 0 ) {
        var tmp1  = Math.log(max - min);
        var tmp2  = Math.LN10 * Polynomial.ACCURACY;
        var iters = Math.ceil( (tmp1+tmp2) / Math.LN2 );

        for ( var i = 0; i < iters; i++ ) {
            result = 0.5 * (min + max);
            var value = this.eval(result);

            if ( Math.abs(value) <= Polynomial.TOLERANCE ) {
                break;
            }

            if ( value * minValue < 0 ) {
                max = result;
                maxValue = value;
            } else {
                min = result;
                minValue = value;
            }
        }
    }

    return result;
};


/**
 *  toString
 */
Polynomial.prototype.toString = function() {
    var coefs = new Array();
    var signs = new Array();

    for ( var i = this.coefs.length - 1; i >= 0; i-- ) {
        var value = Math.round(this.coefs[i]*1000)/1000;
        //var value = this.coefs[i];

        if ( value != 0 ) {
            var sign = ( value < 0 ) ? " - " : " + ";

            value = Math.abs(value);
            if ( i > 0 )
                if ( value == 1 )
                    value = this._variable;
                else
                    value += this._variable;
            if ( i > 1 ) value += "^" + i;

            signs.push( sign );
            coefs.push( value );
        }
    }

    signs[0] = ( signs[0] == " + " ) ? "" : "-";

    var result = "";
    for ( var i = 0; i < coefs.length; i++ )
        result += signs[i] + coefs[i];

    return result;
};


/**
 *  trapezoid
 *  Based on trapzd in "Numerical Recipes in C", page 137
 */
Polynomial.prototype.trapezoid = function(min, max, n) {
    if ( isNaN(min) || isNaN(max) || isNaN(n) )
        throw new Error("Polynomial.trapezoid: parameters must be numbers");

    var range = max - min;
    var TOLERANCE = 1e-7;

    if ( n == 1 ) {
        var minValue = this.eval(min);
        var maxValue = this.eval(max);
        this._s = 0.5*range*( minValue + maxValue );
    } else {
        var it = 1 << (n-2);
        var delta = range / it;
        var x = min + 0.5*delta;
        var sum = 0;

        for ( var i = 0; i < it; i++ ) {
            sum += this.eval(x);
            x += delta;
        }
        this._s = 0.5*(this._s + range*sum/it);
    }

    if ( isNaN(this._s) )
        throw new Error("Polynomial.trapezoid: this._s is NaN");

    return this._s;
};


/**
 *  simpson
 *  Based on trapzd in "Numerical Recipes in C", page 139
 */
Polynomial.prototype.simpson = function(min, max) {
    if ( isNaN(min) || isNaN(max) )
        throw new Error("Polynomial.simpson: parameters must be numbers");

    var range = max - min;
    var st = 0.5 * range * ( this.eval(min) + this.eval(max) );
    var t = st;
    var s = 4.0*st/3.0;
    var os = s;
    var ost = st;
    var TOLERANCE = 1e-7;

    var it = 1;
    for ( var n = 2; n <= 20; n++ ) {
        var delta = range / it;
        var x     = min + 0.5*delta;
        var sum   = 0;

        for ( var i = 1; i <= it; i++ ) {
            sum += this.eval(x);
            x += delta;
        }

        t = 0.5 * (t + range * sum / it);
        st = t;
        s = (4.0*st - ost)/3.0;

        if ( Math.abs(s-os) < TOLERANCE*Math.abs(os) )
            break;

        os = s;
        ost = st;
        it <<= 1;
    }

    return s;
};


/**
 *  romberg
 */
Polynomial.prototype.romberg = function(min, max) {
    if ( isNaN(min) || isNaN(max) )
        throw new Error("Polynomial.romberg: parameters must be numbers");

    var MAX = 20;
    var K = 3;
    var TOLERANCE = 1e-6;
    var s = new Array(MAX+1);
    var h = new Array(MAX+1);
    var result = { y: 0, dy: 0 };

    h[0] = 1.0;
    for ( var j = 1; j <= MAX; j++ ) {
        s[j-1] = this.trapezoid(min, max, j);
        if ( j >= K ) {
            result = Polynomial.interpolate(h, s, K, j-K, 0.0);
            if ( Math.abs(result.dy) <= TOLERANCE*result.y) break;
        }
        s[j] = s[j-1];
        h[j] = 0.25 * h[j-1];
    }

    return result.y;
};

// getters and setters

/**
 *  get degree
 */
Polynomial.prototype.getDegree = function() {
    return this.coefs.length - 1;
};


/**
 *  getDerivative
 */
Polynomial.prototype.getDerivative = function() {
    var derivative = new Polynomial();

    for ( var i = 1; i < this.coefs.length; i++ ) {
        derivative.coefs.push(i*this.coefs[i]);
    }

    return derivative;
};


/**
 *  getRoots
 */
Polynomial.prototype.getRoots = function() {
    var result;

    this.simplify();
    switch ( this.getDegree() ) {
        case 0: result = new Array();              break;
        case 1: result = this.getLinearRoot();     break;
        case 2: result = this.getQuadraticRoots(); break;
        case 3: result = this.getCubicRoots();     break;
        case 4: result = this.getQuarticRoots();   break;
        default:
            result = new Array();
            // should try Newton's method and/or bisection
    }

    return result;
};


/**
 *  getRootsInInterval
 */
Polynomial.prototype.getRootsInInterval = function(min, max) {
    var roots = new Array();
    var root;

    if ( this.getDegree() == 1 ) {
        root = this.bisection(min, max);
        if ( root != null ) roots.push(root);
    } else {
        // get roots of derivative
        var deriv  = this.getDerivative();
        var droots = deriv.getRootsInInterval(min, max);

        if ( droots.length > 0 ) {
            // find root on [min, droots[0]]
            root = this.bisection(min, droots[0]);
            if ( root != null ) roots.push(root);

            // find root on [droots[i],droots[i+1]] for 0 <= i <= count-2
            for (var i = 0; i <= droots.length-2; i++ ) {
                root = this.bisection(droots[i], droots[i+1]);
                if ( root != null ) roots.push(root);
            }

            // find root on [droots[count-1],xmax]
            root = this.bisection(droots[droots.length-1], max);
            if ( root != null ) roots.push(root);
        } else {
            // polynomial is monotone on [min,max], has at most one root
            root = this.bisection(min, max);
            if ( root != null ) roots.push(root);
        }
    }

    return roots;
};


/**
 *  getLinearRoot
 */
Polynomial.prototype.getLinearRoot = function() {
    var result = new Array();
    var a = this.coefs[1];

    if ( a != 0 )
        result.push( -this.coefs[0] / a );

    return result;
};


/**
 *  getQuadraticRoots
 */
Polynomial.prototype.getQuadraticRoots = function() {
    var results = new Array();

    if ( this.getDegree() == 2 ) {
        var a = this.coefs[2];
        var b = this.coefs[1] / a;
        var c = this.coefs[0] / a;
        var d = b*b - 4*c;

        if ( d > 0 ) {
            var e = Math.sqrt(d);

            results.push( 0.5 * (-b + e) );
            results.push( 0.5 * (-b - e) );
        } else if ( d == 0 ) {
            // really two roots with same value, but we only return one
            results.push( 0.5 * -b );
        }
    }

    return results;
};


/**
 *  getCubicRoots
 *
 *  This code is based on MgcPolynomial.cpp written by David Eberly.  His
 *  code along with many other excellent examples are avaiable at his site:
 *  http://www.geometrictools.com
 */
Polynomial.prototype.getCubicRoots = function() {
    var results = new Array();

    if ( this.getDegree() == 3 ) {
        var c3 = this.coefs[3];
        var c2 = this.coefs[2] / c3;
        var c1 = this.coefs[1] / c3;
        var c0 = this.coefs[0] / c3;

        var a       = (3*c1 - c2*c2) / 3;
        var b       = (2*c2*c2*c2 - 9*c1*c2 + 27*c0) / 27;
        var offset  = c2 / 3;
        var discrim = b*b/4 + a*a*a/27;
        var halfB   = b / 2;

        var ZEROepsilon = this.zeroErrorEstimate();
        if (Math.abs(discrim) <= ZEROepsilon) discrim = 0;

        if ( discrim > 0 ) {
            var e = Math.sqrt(discrim);
            var tmp;
            var root;

            tmp = -halfB + e;
            if ( tmp >= 0 )
                root = Math.pow(tmp, 1/3);
            else
                root = -Math.pow(-tmp, 1/3);

            tmp = -halfB - e;
            if ( tmp >= 0 )
                root += Math.pow(tmp, 1/3);
            else
                root -= Math.pow(-tmp, 1/3);

            results.push( root - offset );
        } else if ( discrim < 0 ) {
            var distance = Math.sqrt(-a/3);
            var angle    = Math.atan2( Math.sqrt(-discrim), -halfB) / 3;
            var cos      = Math.cos(angle);
            var sin      = Math.sin(angle);
            var sqrt3    = Math.sqrt(3);

            results.push( 2*distance*cos - offset );
            results.push( -distance * (cos + sqrt3 * sin) - offset);
            results.push( -distance * (cos - sqrt3 * sin) - offset);
        } else {
            var tmp;

            if ( halfB >= 0 )
                tmp = -Math.pow(halfB, 1/3);
            else
                tmp = Math.pow(-halfB, 1/3);

            results.push( 2*tmp - offset );
            // really should return next root twice, but we return only one
            results.push( -tmp - offset );
        }
    }

    return results;
};

/**
    Sign of a number (+1, -1, +0, -0).
 */
var sign = function (x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? x : NaN : NaN;
};


///////////////////////////////////////////////////////////////////
/**
    Calculates roots of quartic polynomial. <br/>
    First, derivative roots are found, then used to split quartic polynomial 
    into segments, each containing one root of quartic polynomial.
    Segments are then passed to newton's method to find roots.

    @returns {Array<Number>} roots
*/
Polynomial.prototype.getQuarticRoots = function () {
    var results = [];

    var n = this.getDegree();
    if (n == 4) {

        var poly = new Polynomial();
        poly.coefs = this.coefs.slice();
        poly.divide_scalar(poly.coefs[n]);
        var ERRF = 1e-15;
        if (Math.abs(poly.coefs[0]) < 10 * ERRF * Math.abs(poly.coefs[3]))
            poly.coefs[0] = 0;
        var poly_d = poly.getDerivative();
        var derrt = poly_d.getRoots().sort(function (a, b) { return a - b; });
        var dery = [];
        var nr = derrt.length - 1;
        var i;
        var rb = this.bounds();
        maxabsX = Math.max(Math.abs(rb.minX), Math.abs(rb.maxX));
        var ZEROepsilon = this.zeroErrorEstimate(maxabsX);
        
        for (i = 0; i <= nr; i++) {
            dery.push(poly.eval(derrt[i]));
        }

        for (i = 0; i <= nr; i++) {
            if (Math.abs(dery[i]) < ZEROepsilon)
                dery[i] = 0;
        }

        i = 0;
        var dx = Math.max(0.1 * (rb.maxX - rb.minX) / n, ERRF);
        var guesses = [];
        var minmax = [];
        if (nr > -1) {
            if (dery[0] != 0) {
                if (sign(dery[0]) != sign(poly.eval(derrt[0] - dx) - dery[0])) {
                    guesses.push(derrt[0] - dx);
                    minmax.push([rb.minX, derrt[0]]);
                }
            }
            else {
                results.push(derrt[0], derrt[0]);
                i++;
            }

            for (; i < nr; i++) {
                if (dery[i + 1] == 0) {
                    results.push(derrt[i + 1], derrt[i + 1]);
                    i++;
                }
                else if (sign(dery[i]) != sign(dery[i + 1])) {
                    guesses.push((derrt[i] + derrt[i + 1]) / 2);
                    minmax.push([derrt[i], derrt[i + 1]]);
                }
            }
            if (dery[nr] != 0 && sign(dery[nr]) != sign(poly.eval(derrt[nr] + dx) - dery[nr])) {
                guesses.push(derrt[nr] + dx);
                minmax.push([derrt[nr], rb.maxX]);
            }
        }

        var f = function (x) { return poly.eval(x); };
        var df = function (x) { return poly_d.eval(x); };
        if (guesses.length > 0) {
            for (i = 0; i < guesses.length; i++) {
                guesses[i] = Polynomial.newton_secant_bisection(guesses[i], f, df, 32, minmax[i][0], minmax[i][1]);
            }
        }

        results = results.concat(guesses);
    }
    return results;
};

///////////////////////////////////////////////////////////////////
/**
    Estimate what is the maximum polynomial evaluation error value under which polynomial evaluation could be in fact 0.
    
    @returns {Number} 
*/
Polynomial.prototype.zeroErrorEstimate = function (maxabsX) {
    var poly = this;
    var ERRF = 1e-15;
    if (typeof maxabsX === 'undefined') {
        var rb = poly.bounds();
        maxabsX = Math.max(Math.abs(rb.minX), Math.abs(rb.maxX));
    }
    if (maxabsX < 0.001) {
        return 2*Math.abs(poly.eval(ERRF));
    }
    var n = poly.coefs.length - 1;
    var an = poly.coefs[n];
    return 10 * ERRF * poly.coefs.reduce(function (m, v, i) {
        var nm = v / an * Math.pow(maxabsX, i);
        return nm > m ? nm : m;
    }, 0);
}

///////////////////////////////////////////////////////////////////
/**
    Calculates upper Real roots bounds. <br/>
    Real roots are in interval [negX, posX]. Determined by Fujiwara method.
    @see {@link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots}

    @returns {{ negX: Number, posX: Number }}
*/
Polynomial.prototype.bounds_UpperReal_Fujiwara = function () {
    var a = this.coefs;
    var n = a.length - 1;
    var an = a[n];
    if (an != 1) {
        a = this.coefs.map(function (v) { return v / an; });
    }
    var b = a.map(function (v, i) { return (i < n) ? Math.pow(Math.abs((i == 0) ? v / 2 : v), 1 / (n - i)) : v; });

    var coefSelectionFunc;
    var find2Max = function (acc, bi, i) {
        if (coefSelectionFunc(i)) {
            if (acc.max < bi) {
                acc.nearmax = acc.max;
                acc.max = bi;
            }
            else if (acc.nearmax < bi) {
                acc.nearmax = bi;
            }
        }
        return acc;
    };

    coefSelectionFunc = function (i) { return i < n && a[i] < 0; };
    var max_nearmax_pos = b.reduce(find2Max, { max: 0, nearmax: 0 });

    coefSelectionFunc = function (i) { return i < n && ((n % 2 == i % 2) ? a[i] < 0 : a[i] > 0); };
    var max_nearmax_neg = b.reduce(find2Max, { max: 0, nearmax: 0 });

    return {
        negX: -2 * max_nearmax_neg.max,
        posX: 2 * max_nearmax_pos.max
    };
};


///////////////////////////////////////////////////////////////////
/** 
    Calculates lower Real roots bounds. <br/>
    There are no Real roots in interval <negX, posX>. Determined by Fujiwara method.
    @see {@link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots}

    @returns {{ negX: Number, posX: Number }}
*/
Polynomial.prototype.bounds_LowerReal_Fujiwara = function () {
    var poly = new Polynomial();
    poly.coefs = this.coefs.slice().reverse();
    var res = poly.bounds_UpperReal_Fujiwara();
    res.negX = 1 / res.negX;
    res.posX = 1 / res.posX;
    return res;
};


///////////////////////////////////////////////////////////////////
/** 
    Calculates left and right Real roots bounds. <br/>
    Real roots are in interval [minX, maxX]. Combines Fujiwara lower and upper bounds to get minimal interval.
    @see {@link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots}

    @returns {{ minX: Number, maxX: Number }}
*/
Polynomial.prototype.bounds = function () {
    var urb = this.bounds_UpperReal_Fujiwara();
    var rb = { minX: urb.negX, maxX: urb.posX };
    if (urb.negX === 0 && urb.posX === 0)
        return rb;
    if (urb.negX === 0) {
        rb.minX = this.bounds_LowerReal_Fujiwara().posX;
    }
    else if (urb.posX === 0) {
        rb.maxX = this.bounds_LowerReal_Fujiwara().negX;
    }
    if (rb.minX > rb.maxX) {
        //console.log('Polynomial.prototype.bounds: poly has no real roots? or floating point error?');
        rb.minX = rb.maxX = 0;
    }
    return rb;
    // TODO: if sure that there are no complex roots 
    // (maybe by using Sturm's theorem) use:
    //return this.bounds_Real_Laguerre();
};


/////////////////////////////////////////////////////////////////// 
/**
    Newton's (Newton-Raphson) method for finding Real roots on univariate function. <br/>
    When using bounds, algorithm falls back to secant if newton goes out of range.
    Bisection is fallback for secant when determined secant is not efficient enough.
    @see {@link http://en.wikipedia.org/wiki/Newton%27s_method}
    @see {@link http://en.wikipedia.org/wiki/Secant_method}
    @see {@link http://en.wikipedia.org/wiki/Bisection_method}

    @param {Number} x0 - Inital root guess
    @param {function(x)} f - Function which root we are trying to find
    @param {function(x)} df - Derivative of function f
    @param {Number} max_iterations - Maximum number of algorithm iterations
    @param {Number} [min_x] - Left bound value
    @param {Number} [max_x] - Right bound value
    @returns {Number} - root
*/
Polynomial.newton_secant_bisection = function (x0, f, df, max_iterations, min, max) {
    var x, prev_dfx = 0, dfx, prev_x_ef_correction = 0, x_correction, x_new;
    var v, y_atmin, y_atmax;
    x = x0;
    var ACCURACY = 14;
    var min_correction_factor = Math.pow(10, -ACCURACY);
    var isBounded = (typeof min === 'number' && typeof max === 'number');
    if (isBounded) {
        if (min > max)
            throw new Error("newton root finding: min must be greater than max");
        y_atmin = f(min);
        y_atmax = f(max);
        if (sign(y_atmin) ==  sign(y_atmax))
            throw new Error("newton root finding: y values of bounds must be of opposite sign");
    }

    var isEnoughCorrection = function () {
        // stop if correction is too small
        // or if correction is in simple loop
        return (Math.abs(x_correction) <= min_correction_factor * Math.abs(x))
            || (prev_x_ef_correction == (x - x_correction) - x);
    };

    var i;
    //var stepMethod;
    //var details = [];
    for (i = 0; i < max_iterations; i++) {
        dfx = df(x);
        if (dfx == 0) {
            if (prev_dfx == 0) {
                // error
                throw new Error("newton root finding: df(x) is zero");
                //return null;
            }
            else {
                // use previous derivation value
                dfx = prev_dfx;
            }
            // or move x a little?
            //dfx = df(x != 0 ? x + x * 1e-15 : 1e-15);
        }
        //stepMethod = 'newton';
        prev_dfx = dfx;
        y = f(x);
        x_correction = y / dfx;
        x_new = x - x_correction;
        if (isEnoughCorrection()) {
            break;
        }

        if (isBounded) {
            if (sign(y) == sign(y_atmax)) {
                max = x;
                y_atmax = y;
            }
            else if (sign(y) == sign(y_atmin)) {
                min = x;
                y_atmin = y;
            }
            else {
                x = x_new;
                //console.log("newton root finding: sign(y) not matched.");
                break;
            }

            if ((x_new < min) || (x_new > max)) {
                if (sign(y_atmin) == sign(y_atmax)) {
                    break;
                }

                var RATIO_LIMIT = 50;
                var AIMED_BISECT_OFFSET = 0.25; // [0, 0.5)
                var dy = y_atmax - y_atmin;
                var dx = max - min;

                if (dy == 0) {
                    //stepMethod = 'bisect';
                    x_correction = x - (min + dx * 0.5);
                }
                else if (Math.abs(dy / Math.min(y_atmin, y_atmax)) > RATIO_LIMIT) {
                    //stepMethod = 'aimed bisect';
                    x_correction = x - (min + dx * (0.5 + (Math.abs(y_atmin) < Math.abs(y_atmax) ? -AIMED_BISECT_OFFSET : AIMED_BISECT_OFFSET)));
                }
                else {
                    //stepMethod = 'secant'; 
                    x_correction = x - (min - y_atmin / dy * dx);
                }
                x_new = x - x_correction;

                if (isEnoughCorrection()) {
                    break;
                }
            }
        }
        //details.push([stepMethod, i, x, x_new, x_correction, min, max, y]);
        prev_x_ef_correction = x - x_new;
        x = x_new;
    }
    //details.push([stepMethod, i, x, x_new, x_correction, min, max, y]);
    //console.log(details.join('\r\n'));
    //if (i == max_iterations)
    //    console.log('newt: steps=' + ((i==max_iterations)? i:(i + 1)));
    return x;
};

if (typeof module !== "undefined") {
    module.exports = Polynomial;
}

},{}],7:[function(require,module,exports){
/**
 *
 *   SqrtPolynomial.js
 *
 *   copyright 2003, 2013 Kevin Lindsey
 *
 */

if (typeof module !== "undefined") {
    var Polynomial = require("./Polynomial");
}

/**
 *   class variables
 */
SqrtPolynomial.VERSION = 1.0;

// setup inheritance
SqrtPolynomial.prototype             = new Polynomial();
SqrtPolynomial.prototype.constructor = SqrtPolynomial;
SqrtPolynomial.superclass            = Polynomial.prototype;


/**
 *  SqrtPolynomial
 */
function SqrtPolynomial() {
    this.init( arguments );
}


/**
 *  eval
 *
 *  @param {Number} x
 *  @returns {Number}
 */
SqrtPolynomial.prototype.eval = function(x) {
    var TOLERANCE = 1e-7;
    var result = SqrtPolynomial.superclass.eval.call(this, x);

    // NOTE: May need to change the following.  I added these to capture
    // some really small negative values that were being generated by one
    // of my Bezier arcLength functions
    if ( Math.abs(result) < TOLERANCE ) result = 0;
    if ( result < 0 )
        throw new Error("SqrtPolynomial.eval: cannot take square root of negative number");

    return Math.sqrt(result);
};

SqrtPolynomial.prototype.toString = function() {
    var result = SqrtPolynomial.superclass.toString.call(this);

    return "sqrt(" + result + ")";
};

if (typeof module !== "undefined") {
    module.exports = SqrtPolynomial;
}

},{"./Polynomial":6}],8:[function(require,module,exports){
// expose module classes

exports.intersect = require('./lib/intersect');
exports.shape = require('./lib/IntersectionParams').newShape;
},{"./lib/IntersectionParams":10,"./lib/intersect":12}],9:[function(require,module,exports){
/**
 *  Intersection
 */
function Intersection(status) {
    this.init(status);
}

/**
 *  init
 *
 *  @param {String} status
 *  @returns {Intersection}
 */
Intersection.prototype.init = function(status) {
    this.status = status;
    this.points = [];
};

/**
 *  appendPoint
 *
 *  @param {Point2D} point
 */
Intersection.prototype.appendPoint = function(point) {
    this.points.push(point);
};

/**
 *  appendPoints
 *
 *  @param {Array<Point2D>} points
 */
Intersection.prototype.appendPoints = function(points) {
    this.points = this.points.concat(points);
};

module.exports = Intersection;

},{}],10:[function(require,module,exports){
var Point2D = require('kld-affine').Point2D;


/**
    getArcParameters

    @param {Point2D} startPoint
    @param {Point2D} endPoint
    @param {Number} rx
    @param {Number} ry
    @param {Number} angle - in degrees
    @param {Boolean} arcFlag
    @param {Boolean} sweepFlag
    @returns {{ center: Point2D, rx: Number, ry: Number, theta1: Number, deltaTheta: Number }}
*/
function getArcParameters(startPoint, endPoint, rx, ry, angle, arcFlag, sweepFlag) {
    function radian(ux, uy, vx, vy) {
        var dot = ux * vx + uy * vy;
        var mod = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
        var rad = Math.acos(dot / mod);
        if (ux * vy - uy * vx < 0.0) rad = -rad;
        return rad;
    }
    angle = angle * Math.PI / 180;
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var TOLERANCE = 1e-6;
    var halfDiff = startPoint.subtract(endPoint).divide(2);
    var x1p = halfDiff.x * c + halfDiff.y * s;
    var y1p = halfDiff.x * -s + halfDiff.y * c;
    var x1px1p = x1p * x1p;
    var y1py1p = y1p * y1p;
    var lambda = (x1px1p / (rx * rx)) + (y1py1p / (ry * ry));
    var factor;
    if (lambda > 1) {
        factor = Math.sqrt(lambda);
        rx *= factor;
        ry *= factor;
    }
    var rxrx = rx * rx;
    var ryry = ry * ry;
    var rxy1 = rxrx * y1py1p;
    var ryx1 = ryry * x1px1p;
    factor = (rxrx * ryry - rxy1 - ryx1) / (rxy1 + ryx1);
    if (Math.abs(factor) < TOLERANCE) factor = 0;
    var sq = Math.sqrt(factor);
    if (arcFlag == sweepFlag) sq = -sq;
    var mid = startPoint.add(endPoint).divide(2);
    var cxp = sq * rx * y1p / ry;
    var cyp = sq * -ry * x1p / rx;
    //return new Point2D(cxp * c - cyp * s + mid.x, cxp * s + cyp * c + mid.y);

    var xcr1 = (x1p - cxp) / rx;
    var xcr2 = (x1p + cxp) / rx;
    var ycr1 = (y1p - cyp) / ry;
    var ycr2 = (y1p + cyp) / ry;

    var theta1 = radian(1.0, 0.0, xcr1, ycr1);

    var deltaTheta = radian(xcr1, ycr1, -xcr2, -ycr2);
    var PIx2 = Math.PI * 2.0;
    while (deltaTheta > PIx2) deltaTheta -= PIx2;
    while (deltaTheta < 0.0) deltaTheta += PIx2;
    if (sweepFlag == false) deltaTheta -= PIx2;

    return {
        center: new Point2D(cxp * c - cyp * s + mid.x, cxp * s + cyp * c + mid.y),
        rx: rx,
        ry: ry,
        theta1: theta1,
        deltaTheta: deltaTheta
    };
}


/**
 *  IntersectionParams
 *
 *  @param {String} name
 *  @param {Array<Point2D} params
 *  @returns {IntersectionParams}
 */
function IntersectionParams(name, params) {
    this.init(name, params);
}

/**
 *  init
 *
 *  @param {String} type
 *  @param {Array<Point2D>} params
 */
IntersectionParams.prototype.init = function (type, params) {
    this.type = type;
    this.params = params;
    this.meta = {};
};

IntersectionParams.TYPE = {};
var IPTYPE = IntersectionParams.TYPE;
IPTYPE.LINE = 'Line';
IPTYPE.RECT = 'Rectangle';
IPTYPE.ROUNDRECT = 'RoundRectangle';
IPTYPE.CIRCLE = 'Circle';
IPTYPE.ELLIPSE = 'Ellipse';
IPTYPE.POLYGON = 'Polygon';
IPTYPE.POLYLINE = 'Polyline';
IPTYPE.PATH = 'Path';
IPTYPE.ARC = 'Arc';
IPTYPE.BEZIER2 = 'Bezier2';
IPTYPE.BEZIER3 = 'Bezier3';


function parsePointsString(points) {
    return points.split(" ").map(function(point) {
        point = point.split(",");
        return new Point2D(point[0], point[1]);
    });
}

IntersectionParams.newShape = function(svgElementName, props) {
    svgElementName = svgElementName.toLowerCase();

    if(svgElementName === "line") {
        return IntersectionParams.newLine(
            new Point2D(props.x1, props.y1),
            new Point2D(props.x2, props.y2)
        );
    }

    if(svgElementName === "rect") {
        if(props.rx > 0 || props.ry > 0) {
            return IntersectionParams.newRoundRect(
                props.x, props.y,
                props.width, props.height,
                props.rx, props.ry
            );
        } else {
            return IntersectionParams.newRect(
                props.x, props.y,
                props.width, props.height
            );
        }
    }

    if(svgElementName === "circle") {
        return IntersectionParams.newCircle(
            new Point2D(props.cx, props.cy),
            props.r
        );
    }

    if(svgElementName === "ellipse") {
        return IntersectionParams.newEllipse(
            new Point2D(props.cx, props.cy),
            props.rx, props.ry
        );
    }

    if(svgElementName === "polygon") {
        return IntersectionParams.newPolygon(
            parsePointsString(props.points)
        );
    }

    if(svgElementName === "polyline") {
        return IntersectionParams.newPolyline(
            parsePointsString(props.points)
        );
    }

    if(svgElementName === "path") {
        return IntersectionParams.newPath(
            props.d
        );
    }

}


///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for arc.

    @param {Point2D} startPoint - arc start point
    @param {Point2D} endPoint - arc end point
    @param {Number} rx - arc ellipse x radius
    @param {Number} ry - arc ellipse y radius
    @param {Number} angle - arc ellipse rotation in degrees
    @param {Boolean} largeArcFlag
    @param {Boolean} sweepFlag
    @returns {IntersectionParams}
*/
IntersectionParams.newArc = function (startPoint, endPoint, rx, ry, angle, largeArcFlag, sweepFlag) {
    var p = getArcParameters(startPoint, endPoint, rx, ry, angle, largeArcFlag, sweepFlag);
    return new IntersectionParams(IPTYPE.ARC, [p.center, p.rx, p.ry, (angle * Math.PI / 180), p.theta1, p.deltaTheta]);
};

///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for bezier2.

    @param {Point2D} p1
    @param {Point2D} p2
    @param {Point2D} p3
    @returns {IntersectionParams}
*/
IntersectionParams.newBezier2 = function (p1, p2, p3) {
    return new IntersectionParams(IPTYPE.BEZIER2, [p1, p2, p3]);
};

///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for bezier3.

    @param {Point2D} p1
    @param {Point2D} p2
    @param {Point2D} p3
    @param {Point2D} p4
    @returns {IntersectionParams}
*/
IntersectionParams.newBezier3 = function (p1, p2, p3, p4) {
    return new IntersectionParams(IPTYPE.BEZIER3, [p1, p2, p3, p4]);
};

///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for circle.

    @param {Point2D} c
    @param {Number} r
    @returns {IntersectionParams}
*/
IntersectionParams.newCircle = function (c, r) {
    return new IntersectionParams(IPTYPE.CIRCLE, [c, r]);
};

///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for ellipse.

    @param {Point2D} c
    @param {Number} rx
    @param {Number} ry
    @returns {IntersectionParams}
*/
IntersectionParams.newEllipse = function (c, rx, ry) {
    return new IntersectionParams(IPTYPE.ELLIPSE, [c, rx, ry]);
};

///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for line.

    @param {Point2D} a1
    @param {Point2D} a2
    @returns {IntersectionParams}
*/
IntersectionParams.newLine = function (a1, a2) {
    return new IntersectionParams(IPTYPE.LINE, [a1, a2]);
};

///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for polygon.

    @param {Array<Point2D>} points
    @returns {IntersectionParams}
*/
IntersectionParams.newPolygon = function (points) {
    return new IntersectionParams(IPTYPE.POLYGON, [points]);
};

///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for polyline.

     @param {Array<Point2D>} points
    @returns {IntersectionParams}
*/
IntersectionParams.newPolyline = function (points) {
    return new IntersectionParams(IPTYPE.POLYLINE, [points]);
};


///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for rectangle.

    @param {Number} x
    @param {Number} y
    @param {Number} width
    @param {Number} height
    @returns {IntersectionParams}
*/
IntersectionParams.newRect = function (x, y, width, height) {
    var points = [];
    points.push(new Point2D(x, y));
    points.push(new Point2D(x + width, y));
    points.push(new Point2D(x + width, y + height));
    points.push(new Point2D(x, y + height));
    return new IntersectionParams(IPTYPE.RECT, [points]);
};

var degreesToRadians = function (angle) {
    return angle * Math.PI / 180;
};
///////////////////////////////////////////////////////////////////
/**
    Creates IntersectionParams for round rectangle, or for rectangle if rx and ry are 0.

    @param {Number} x
    @param {Number} y
    @param {Number} width
    @param {Number} height
    @param {Number} rx
    @param {Number} ry
    @returns {IntersectionParams}
*/
IntersectionParams.newRoundRect = function (x, y, width, height, rx, ry) {
    if (rx === 0 && ry === 0)
        return IntersectionParams.newRect(x, y, width, height);
    if (rx === 0)
        rx = ry;
    if (ry === 0)
        ry = rx;
    if (rx > width / 2)
        rx = width / 2;
    if (ry > height / 2)
        rx = height / 2;
    var shape = [];
    var x0 = x, x1 = x + rx, x2 = x + width - rx, x3 = x + width;
    var y0 = y, y1 = y + ry, y2 = y + height - ry, y3 = y + height;
    shape.push(new IntersectionParams(IPTYPE.ARC, [new Point2D(x1, y1), rx, ry, 0, degreesToRadians(180), degreesToRadians(90)]));
    shape.push(new IntersectionParams(IPTYPE.LINE, [new Point2D(x1, y0), new Point2D(x2, y0)]));
    shape.push(new IntersectionParams(IPTYPE.ARC, [new Point2D(x2, y1), rx, ry, 0, degreesToRadians(-90), degreesToRadians(90)]));
    shape.push(new IntersectionParams(IPTYPE.LINE, [new Point2D(x3, y1), new Point2D(x3, y2)]));
    shape.push(new IntersectionParams(IPTYPE.ARC, [new Point2D(x2, y2), rx, ry, 0, degreesToRadians(0), degreesToRadians(90)]));
    shape.push(new IntersectionParams(IPTYPE.LINE, [new Point2D(x2, y3), new Point2D(x1, y3)]));
    shape.push(new IntersectionParams(IPTYPE.ARC, [new Point2D(x1, y2), rx, ry, 0, degreesToRadians(90), degreesToRadians(90)]));
    shape.push(new IntersectionParams(IPTYPE.LINE, [new Point2D(x0, y2), new Point2D(x0, y1)]));
    shape[shape.length - 1].meta.closePath = true;
    return new IntersectionParams(IPTYPE.ROUNDRECT, [shape]);
};




function Token(type, text) {
    if (arguments.length > 0) {
        this.init(type, text);
    }
}
Token.prototype.init = function(type, text) {
    this.type = type;
    this.text = text;
};
Token.prototype.typeis = function(type) {
    return this.type == type;
}
var Path = {};
Path.COMMAND = 0;
Path.NUMBER = 1;
Path.EOD = 2;
Path.PARAMS = {
    A: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
    a: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
    C: ["x1", "y1", "x2", "y2", "x", "y"],
    c: ["x1", "y1", "x2", "y2", "x", "y"],
    H: ["x"],
    h: ["x"],
    L: ["x", "y"],
    l: ["x", "y"],
    M: ["x", "y"],
    m: ["x", "y"],
    Q: ["x1", "y1", "x", "y"],
    q: ["x1", "y1", "x", "y"],
    S: ["x2", "y2", "x", "y"],
    s: ["x2", "y2", "x", "y"],
    T: ["x", "y"],
    t: ["x", "y"],
    V: ["y"],
    v: ["y"],
    Z: [],
    z: []
};

function tokenize(d) {
    var tokens = new Array();
    while (d != "") {
        if (d.match(/^([ \t\r\n,]+)/)) {
            d = d.substr(RegExp.$1.length);
        } else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {
            tokens[tokens.length] = new Token(Path.COMMAND, RegExp.$1);
            d = d.substr(RegExp.$1.length);
        } else if (d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {
            tokens[tokens.length] = new Token(Path.NUMBER, parseFloat(RegExp.$1));
            d = d.substr(RegExp.$1.length);
        } else {
            throw new Error("Unrecognized segment command: " + d);
        }
    }
    tokens[tokens.length] = new Token(Path.EOD, null);
    return tokens;
}

IntersectionParams.newPath = function(d) {
    var tokens = tokenize(d);
    var index = 0;
    var token = tokens[index];
    var mode = "BOD";
    var segments = [];

    while (!token.typeis(Path.EOD)) {
        var param_length;
        var params = new Array();
        if (mode == "BOD") {
            if (token.text == "M" || token.text == "m") {
                index++;
                param_length = Path.PARAMS[token.text].length;
                mode = token.text;
            } else {
                throw new Error("Path data must begin with a moveto command");
            }
        } else {
            if (token.typeis(Path.NUMBER)) {
                param_length = Path.PARAMS[mode].length;
            } else {
                index++;
                param_length = Path.PARAMS[token.text].length;
                mode = token.text;
            }
        }
        if ((index + param_length) < tokens.length) {
            for (var i = index; i < index + param_length; i++) {
                var number = tokens[i];
                if (number.typeis(Path.NUMBER)) params[params.length] = number.text;
                else throw new Error("Parameter type is not a number: " + mode + "," + number.text);
            }
            var segment;
            var length = segments.length;
            var previous = (length == 0) ? null : segments[length - 1];
            switch (mode) {
                case "A":
                    segment = new AbsoluteArcPath(params, previous);
                    break;
                case "C":
                    segment = new AbsoluteCurveto3(params, previous);
                    break;
                case "c":
                    segment = new RelativeCurveto3(params, previous);
                    break;
                case "H":
                    segment = new AbsoluteHLineto(params, previous);
                    break;
                case "V":
                    segment = new AbsoluteVLineto(params, previous);
                    break;
                case "L":
                    segment = new AbsoluteLineto(params, previous);
                    break;
                case "l":
                    segment = new RelativeLineto(params, previous);
                    break;
                case "M":
                    segment = new AbsoluteMoveto(params, previous);
                    break;
                case "m":
                    segment = new RelativeMoveto(params, previous);
                    break;
                case "Q":
                    segment = new AbsoluteCurveto2(params, previous);
                    break;
                case "q":
                    segment = new RelativeCurveto2(params, previous);
                    break;
                case "S":
                    segment = new AbsoluteSmoothCurveto3(params, previous);
                    break;
                case "s":
                    segment = new RelativeSmoothCurveto3(params, previous);
                    break;
                case "T":
                    segment = new AbsoluteSmoothCurveto2(params, previous);
                    break;
                case "t":
                    segment = new RelativeSmoothCurveto2(params, previous);
                    break;
                case "Z":
                    segment = new RelativeClosePath(params, previous);
                    break;
                case "z":
                    segment = new RelativeClosePath(params, previous);
                    break;
                default:
                    throw new Error("Unsupported segment type: " + mode);
            };
            segments.push(segment);
            index += param_length;
            token = tokens[index];
            if (mode == "M") mode = "L";
            if (mode == "m") mode = "l";
        } else {
            throw new Error("Path data ended before all parameters were found");
        }
    }

    var segmentParams = [];
    for(i=0; i<segments.length; i++) {
        var ip = segments[i].getIntersectionParams();
        if(ip) {
            segmentParams.push(ip);
        }
    }

    return new IntersectionParams(IPTYPE.PATH, [segmentParams]);
}


function AbsolutePathSegment(command, params, previous) {
    if (arguments.length > 0) this.init(command, params, previous);
};
AbsolutePathSegment.prototype.init = function(command, params, previous) {
    this.command = command;
    this.previous = previous;
    this.points = [];
    var index = 0;
    while (index < params.length) {
        this.points.push(new Point2D(params[index], params[index + 1]));
        index += 2;
    }
};
AbsolutePathSegment.prototype.getLastPoint = function() {
    return this.points[this.points.length - 1];
};
AbsolutePathSegment.prototype.getIntersectionParams = function() {
    return null;
};



function AbsoluteArcPath(params, previous) {
    if (arguments.length > 0) {
        this.init("A", params, previous);
    }
}
AbsoluteArcPath.prototype = new AbsolutePathSegment();
AbsoluteArcPath.prototype.constructor = AbsoluteCurveto2;
AbsoluteArcPath.superclass = AbsolutePathSegment.prototype;

AbsoluteArcPath.prototype.init = function(command, params, previous) {
    var point = new Array();
    var y = params.pop();
    var x = params.pop();
    point.push(x, y);
    AbsoluteArcPath.superclass.init.call(this, command, point, previous);
    this.rx = parseFloat(params.shift());
    this.ry = parseFloat(params.shift());
    this.angle = parseFloat(params.shift());
    this.arcFlag = parseFloat(params.shift());
    this.sweepFlag = parseFloat(params.shift());
};
AbsoluteArcPath.prototype.getIntersectionParams = function() {
    return IntersectionParams.newArc(this.previous.getLastPoint(),
                                     this.points[0],
                                     this.rx,
                                     this.ry,
                                     this.angle,
                                     this.arcFlag,
                                     this.sweepFlag);
};


function AbsoluteCurveto2(params, previous) {
    if (arguments.length > 0) {
        this.init("Q", params, previous);
    }
}
AbsoluteCurveto2.prototype = new AbsolutePathSegment();
AbsoluteCurveto2.prototype.constructor = AbsoluteCurveto2;
AbsoluteCurveto2.superclass = AbsolutePathSegment.prototype;

AbsoluteCurveto2.prototype.getIntersectionParams = function() {
    return IntersectionParams.newBezier2(this.previous.getLastPoint(), this.points[0], this.points[1]);
};



function AbsoluteCurveto3(params, previous) {
    if (arguments.length > 0) {
        this.init("C", params, previous);
    }
}
AbsoluteCurveto3.prototype = new AbsolutePathSegment();
AbsoluteCurveto3.prototype.constructor = AbsoluteCurveto3;
AbsoluteCurveto3.superclass = AbsolutePathSegment.prototype;

AbsoluteCurveto3.prototype.getLastControlPoint = function() {
    return this.points[1];
};
AbsoluteCurveto3.prototype.getIntersectionParams = function() {
    return IntersectionParams.newBezier3(this.previous.getLastPoint(), this.points[0], this.points[1], this.points[2]);
};


function AbsoluteHLineto(params, previous) {
    if (arguments.length > 0) {
        this.init("H", params, previous);
    }
}
AbsoluteHLineto.prototype = new AbsolutePathSegment();
AbsoluteHLineto.prototype.constructor = AbsoluteHLineto;
AbsoluteHLineto.superclass = AbsolutePathSegment.prototype;

AbsoluteHLineto.prototype.init = function(command, params, previous) {
    var prevPoint = previous.getLastPoint();
    var point = new Array();
    point.push(params.pop(), prevPoint.y);
    AbsoluteHLineto.superclass.init.call(this, command, point, previous);
};

function AbsoluteVLineto(params, previous) {
    if (arguments.length > 0) {
        this.init("V", params, previous);
    }
}
AbsoluteVLineto.prototype = new AbsolutePathSegment();
AbsoluteVLineto.prototype.constructor = AbsoluteVLineto;
AbsoluteVLineto.superclass = AbsolutePathSegment.prototype;

AbsoluteVLineto.prototype.init = function(command, params, previous) {
    var prevPoint = previous.getLastPoint();
    var point = new Array();
    point.push(prevPoint.x, params.pop());
    AbsoluteVLineto.superclass.init.call(this, command, point, previous);
};


function AbsoluteLineto(params, previous) {
    if (arguments.length > 0) {
        this.init("L", params, previous);
    }
}
AbsoluteLineto.prototype = new AbsolutePathSegment();
AbsoluteLineto.prototype.constructor = AbsoluteLineto;
AbsoluteLineto.superclass = AbsolutePathSegment.prototype;

AbsoluteLineto.prototype.getIntersectionParams = function() {
    return IntersectionParams.newLine(this.previous.getLastPoint(), this.points[0]);
};



function AbsoluteMoveto(params, previous) {
    if (arguments.length > 0) {
        this.init("M", params, previous);
    }
}
AbsoluteMoveto.prototype = new AbsolutePathSegment();
AbsoluteMoveto.prototype.constructor = AbsoluteMoveto;
AbsoluteMoveto.superclass = AbsolutePathSegment.prototype;


function AbsoluteSmoothCurveto2(params, previous) {
    if (arguments.length > 0) {
        this.init("T", params, previous);
    }
}
AbsoluteSmoothCurveto2.prototype = new AbsolutePathSegment();
AbsoluteSmoothCurveto2.prototype.constructor = AbsoluteSmoothCurveto2;
AbsoluteSmoothCurveto2.superclass = AbsolutePathSegment.prototype;

AbsoluteSmoothCurveto2.prototype.getControlPoint = function() {
    var lastPoint = this.previous.getLastPoint();
    var point;
    if (this.previous.command.match(/^[QqTt]$/)) {
        var ctrlPoint = this.previous.getControlPoint();
        var diff = ctrlPoint.subtract(lastPoint);
        point = lastPoint.subtract(diff);
    } else {
        point = lastPoint;
    }
    return point;
};
AbsoluteSmoothCurveto2.prototype.getIntersectionParams = function() {
    return IntersectionParams.newBezier2(this.previous.getLastPoint(), this.getControlPoint(), this.points[0]);
};


function AbsoluteSmoothCurveto3(params, previous) {
    if (arguments.length > 0) {
        this.init("S", params, previous);
    }
}
AbsoluteSmoothCurveto3.prototype = new AbsolutePathSegment();
AbsoluteSmoothCurveto3.prototype.constructor = AbsoluteSmoothCurveto3;
AbsoluteSmoothCurveto3.superclass = AbsolutePathSegment.prototype;

AbsoluteSmoothCurveto3.prototype.getFirstControlPoint = function() {
    var lastPoint = this.previous.getLastPoint();
    var point;
    if (this.previous.command.match(/^[SsCc]$/)) {
        var lastControl = this.previous.getLastControlPoint();
        var diff = lastControl.subtract(lastPoint);
        point = lastPoint.subtract(diff);
    } else {
        point = lastPoint;
    }
    return point;
};
AbsoluteSmoothCurveto3.prototype.getLastControlPoint = function() {
    return this.points[0];
};
AbsoluteSmoothCurveto3.prototype.getIntersectionParams = function() {
    return IntersectionParams.newBezier3(this.previous.getLastPoint(), this.getFirstControlPoint(), this.points[0], this.points[1]);
};


function RelativePathSegment(command, params, previous) {
    if (arguments.length > 0) this.init(command, params, previous);
}
RelativePathSegment.prototype = new AbsolutePathSegment();
RelativePathSegment.prototype.constructor = RelativePathSegment;
RelativePathSegment.superclass = AbsolutePathSegment.prototype;

RelativePathSegment.prototype.init = function(command, params, previous) {
    this.command = command;
    this.previous = previous;
    this.points = [];
    var lastPoint;
    if (this.previous) lastPoint = this.previous.getLastPoint();
    else lastPoint = new Point2D(0, 0);
    var index = 0;
    while (index < params.length) {
        var point = new Point2D(lastPoint.x + params[index], lastPoint.y + params[index + 1]);
        this.points.push(point);
        index += 2;
    }
};

function RelativeClosePath(params, previous) {
    if (arguments.length > 0) {
        this.init("z", params, previous);
    }
}
RelativeClosePath.prototype = new RelativePathSegment();
RelativeClosePath.prototype.constructor = RelativeClosePath;
RelativeClosePath.superclass = RelativePathSegment.prototype;
RelativeClosePath.prototype.getLastPoint = function() {
    var current = this.previous;
    var point;
    while (current) {
        if (current.command.match(/^[mMzZ]$/)) {
            point = current.getLastPoint();
            break;
        }
        current = current.previous;
    }
    return point;
};
RelativeClosePath.prototype.getIntersectionParams = function() {
    return IntersectionParams.newLine(this.previous.getLastPoint(), this.getLastPoint());
};


function RelativeCurveto2(params, previous) {
    if (arguments.length > 0) {
        this.init("q", params, previous);
    }
}
RelativeCurveto2.prototype = new RelativePathSegment();
RelativeCurveto2.prototype.constructor = RelativeCurveto2;
RelativeCurveto2.superclass = RelativePathSegment.prototype;

RelativeCurveto2.prototype.getControlPoint = function() {
    return this.points[0];
};
RelativeCurveto2.prototype.getIntersectionParams = function() {
    return IntersectionParams.newBezier2(this.previous.getLastPoint(), this.points[0], this.points[1]);
};


function RelativeCurveto3(params, previous) {
    if (arguments.length > 0) {
        this.init("c", params, previous);
    }
}
RelativeCurveto3.prototype = new RelativePathSegment();
RelativeCurveto3.prototype.constructor = RelativeCurveto3;
RelativeCurveto3.superclass = RelativePathSegment.prototype;

RelativeCurveto3.prototype.getLastControlPoint = function() {
    return this.points[1];
};
RelativeCurveto3.prototype.getIntersectionParams = function() {
    return IntersectionParams.newBezier3(this.previous.getLastPoint(), this.points[0], this.points[1], this.points[2]);
};


function RelativeLineto(params, previous) {
    if (arguments.length > 0) {
        this.init("l", params, previous);
    }
}
RelativeLineto.prototype = new RelativePathSegment();
RelativeLineto.prototype.constructor = RelativeLineto;
RelativeLineto.superclass = RelativePathSegment.prototype;

RelativeLineto.prototype.toString = function() {
    var points = new Array();
    var command = "";
    var lastPoint;
    var point;
    if (this.previous) lastPoint = this.previous.getLastPoint();
    else lastPoint = new Point(0, 0);
    point = this.points[0].subtract(lastPoint);
    if (this.previous.constructor != this.constuctor)
        if (this.previous.constructor != RelativeMoveto) cmd = this.command;
    return cmd + point.toString();
};
RelativeLineto.prototype.getIntersectionParams = function() {
    return IntersectionParams.newLine(this.previous.getLastPoint(), this.points[0]);
};



function RelativeMoveto(params, previous) {
    if (arguments.length > 0) {
        this.init("m", params, previous);
    }
}
RelativeMoveto.prototype = new RelativePathSegment();
RelativeMoveto.prototype.constructor = RelativeMoveto;
RelativeMoveto.superclass = RelativePathSegment.prototype;



function RelativeSmoothCurveto2(params, previous) {
    if (arguments.length > 0) {
        this.init("t", params, previous);
    }
}
RelativeSmoothCurveto2.prototype = new RelativePathSegment();
RelativeSmoothCurveto2.prototype.constructor = RelativeSmoothCurveto2;
RelativeSmoothCurveto2.superclass = RelativePathSegment.prototype;

RelativeSmoothCurveto2.prototype.getControlPoint = function() {
    var lastPoint = this.previous.getLastPoint();
    var point;
    if (this.previous.command.match(/^[QqTt]$/)) {
        var ctrlPoint = this.previous.getControlPoint();
        var diff = ctrlPoint.subtract(lastPoint);
        point = lastPoint.subtract(diff);
    } else {
        point = lastPoint;
    }
    return point;
};
RelativeSmoothCurveto2.prototype.getIntersectionParams = function() {
    return IntersectionParams.newBezier2(this.previous.getLastPoint(), this.getControlPoint(), this.points[0]);
};



function RelativeSmoothCurveto3(params, previous) {
    if (arguments.length > 0) {
        this.init("s", params, previous);
    }
}
RelativeSmoothCurveto3.prototype = new RelativePathSegment();
RelativeSmoothCurveto3.prototype.constructor = RelativeSmoothCurveto3;
RelativeSmoothCurveto3.superclass = RelativePathSegment.prototype;

RelativeSmoothCurveto3.prototype.getFirstControlPoint = function() {
    var lastPoint = this.previous.getLastPoint();
    var point;
    if (this.previous.command.match(/^[SsCc]$/)) {
        var lastControl = this.previous.getLastControlPoint();
        var diff = lastControl.subtract(lastPoint);
        point = lastPoint.subtract(diff);
    } else {
        point = lastPoint;
    }
    return point;
};
RelativeSmoothCurveto3.prototype.getLastControlPoint = function() {
    return this.points[0];
};
RelativeSmoothCurveto3.prototype.getIntersectionParams = function() {
    return IntersectionParams.newBezier3(this.previous.getLastPoint(), this.getFirstControlPoint(), this.points[0], this.points[1]);
};


module.exports = IntersectionParams;

},{"kld-affine":1}],11:[function(require,module,exports){
var Intersection = require('../Intersection');

var affine = require('kld-affine');
var Point2D = affine.Point2D;
var Vector2D = affine.Vector2D;

var Polynomial = require('kld-polynomial').Polynomial;

function removeMultipleRootsIn01(roots) {
    var ZEROepsilon = 1e-15;
    roots.sort(function (a, b) { return a - b; });
    for (var i = 1; i < roots.length;) {
        if (Math.abs(roots[i] - roots[i - 1]) < ZEROepsilon) {
            roots.splice(i, 1);
        }
        else {
            i++;
        }
    }
}

module.exports = {};

/**
 *  intersectBezier2Bezier2
 *
 *  @param {Point2D} a1
 *  @param {Point2D} a2
 *  @param {Point2D} a3
 *  @param {Point2D} b1
 *  @param {Point2D} b2
 *  @param {Point2D} b3
 *  @returns {Intersection}
 */
module.exports.intersectBezier2Bezier2 = function(a1, a2, a3, b1, b2, b3) {
    var a, b;
    var c12, c11, c10;
    var c22, c21, c20;
    var result = new Intersection();
    var poly;

    a = a2.multiply(-2);
    c12 = a1.add(a.add(a3));

    a = a1.multiply(-2);
    b = a2.multiply(2);
    c11 = a.add(b);

    c10 = new Point2D(a1.x, a1.y);

    a = b2.multiply(-2);
    c22 = b1.add(a.add(b3));

    a = b1.multiply(-2);
    b = b2.multiply(2);
    c21 = a.add(b);

    c20 = new Point2D(b1.x, b1.y);

    var v0, v1, v2, v3, v4, v5, v6;
    if ( c12.y === 0 ) {
        v0 = c12.x*(c10.y - c20.y);
        v1 = v0 - c11.x*c11.y;
        v2 = v0 + v1;
        v3 = c11.y*c11.y;

        poly = new Polynomial(
            c12.x*c22.y*c22.y,
            2*c12.x*c21.y*c22.y,
            c12.x*c21.y*c21.y - c22.x*v3 - c22.y*v0 - c22.y*v1,
            -c21.x*v3 - c21.y*v0 - c21.y*v1,
            (c10.x - c20.x)*v3 + (c10.y - c20.y)*v1
        );
    } else {
        v0 = c12.x*c22.y - c12.y*c22.x;
        v1 = c12.x*c21.y - c21.x*c12.y;
        v2 = c11.x*c12.y - c11.y*c12.x;
        v3 = c10.y - c20.y;
        v4 = c12.y*(c10.x - c20.x) - c12.x*v3;
        v5 = -c11.y*v2 + c12.y*v4;
        v6 = v2*v2;

        poly = new Polynomial(
            v0*v0,
            2*v0*v1,
            (-c22.y*v6 + c12.y*v1*v1 + c12.y*v0*v4 + v0*v5) / c12.y,
            (-c21.y*v6 + c12.y*v1*v4 + v1*v5) / c12.y,
            (v3*v6 + v4*v5) / c12.y
        );
    }

    var roots = poly.getRoots();
    for ( var i = 0; i < roots.length; i++ ) {
        var s = roots[i];

        if ( 0 <= s && s <= 1 ) {
            var xRoots = new Polynomial(
                c12.x,
                c11.x,
                c10.x - c20.x - s*c21.x - s*s*c22.x
            ).getRoots();
            var yRoots = new Polynomial(
                c12.y,
                c11.y,
                c10.y - c20.y - s*c21.y - s*s*c22.y
            ).getRoots();

            if ( xRoots.length > 0 && yRoots.length > 0 ) {
                var TOLERANCE = 1e-4;

                checkRoots:
                    for ( var j = 0; j < xRoots.length; j++ ) {
                        var xRoot = xRoots[j];

                        if ( 0 <= xRoot && xRoot <= 1 ) {
                            for ( var k = 0; k < yRoots.length; k++ ) {
                                if ( Math.abs( xRoot - yRoots[k] ) < TOLERANCE ) {
                                    result.points.push( c22.multiply(s*s).add(c21.multiply(s).add(c20)) );
                                    break checkRoots;
                                }
                            }
                        }
                    }
            }
        }
    }

    return result;
};


/**
 *  intersectBezier2Bezier3
 *
 *  @param {Point2D} a1
 *  @param {Point2D} a2
 *  @param {Point2D} a3
 *  @param {Point2D} b1
 *  @param {Point2D} b2
 *  @param {Point2D} b3
 *  @param {Point2D} b4
 *  @returns {Intersection}
 */
module.exports.intersectBezier2Bezier3 = function(a1, a2, a3, b1, b2, b3, b4) {
    var a, b,c, d;
    var c12, c11, c10;
    var c23, c22, c21, c20;
    var result = new Intersection();

    a = a2.multiply(-2);
    c12 = a1.add(a.add(a3));

    a = a1.multiply(-2);
    b = a2.multiply(2);
    c11 = a.add(b);

    c10 = new Point2D(a1.x, a1.y);

    a = b1.multiply(-1);
    b = b2.multiply(3);
    c = b3.multiply(-3);
    d = a.add(b.add(c.add(b4)));
    c23 = new Vector2D(d.x, d.y);

    a = b1.multiply(3);
    b = b2.multiply(-6);
    c = b3.multiply(3);
    d = a.add(b.add(c));
    c22 = new Vector2D(d.x, d.y);

    a = b1.multiply(-3);
    b = b2.multiply(3);
    c = a.add(b);
    c21 = new Vector2D(c.x, c.y);

    c20 = new Vector2D(b1.x, b1.y);

    var c10x2 = c10.x*c10.x;
    var c10y2 = c10.y*c10.y;
    var c11x2 = c11.x*c11.x;
    var c11y2 = c11.y*c11.y;
    var c12x2 = c12.x*c12.x;
    var c12y2 = c12.y*c12.y;
    var c20x2 = c20.x*c20.x;
    var c20y2 = c20.y*c20.y;
    var c21x2 = c21.x*c21.x;
    var c21y2 = c21.y*c21.y;
    var c22x2 = c22.x*c22.x;
    var c22y2 = c22.y*c22.y;
    var c23x2 = c23.x*c23.x;
    var c23y2 = c23.y*c23.y;

    var poly = new Polynomial(
        -2*c12.x*c12.y*c23.x*c23.y + c12x2*c23y2 + c12y2*c23x2,
        -2*c12.x*c12.y*c22.x*c23.y - 2*c12.x*c12.y*c22.y*c23.x + 2*c12y2*c22.x*c23.x +
            2*c12x2*c22.y*c23.y,
        -2*c12.x*c21.x*c12.y*c23.y - 2*c12.x*c12.y*c21.y*c23.x - 2*c12.x*c12.y*c22.x*c22.y +
            2*c21.x*c12y2*c23.x + c12y2*c22x2 + c12x2*(2*c21.y*c23.y + c22y2),
        2*c10.x*c12.x*c12.y*c23.y + 2*c10.y*c12.x*c12.y*c23.x + c11.x*c11.y*c12.x*c23.y +
            c11.x*c11.y*c12.y*c23.x - 2*c20.x*c12.x*c12.y*c23.y - 2*c12.x*c20.y*c12.y*c23.x -
            2*c12.x*c21.x*c12.y*c22.y - 2*c12.x*c12.y*c21.y*c22.x - 2*c10.x*c12y2*c23.x -
            2*c10.y*c12x2*c23.y + 2*c20.x*c12y2*c23.x + 2*c21.x*c12y2*c22.x -
            c11y2*c12.x*c23.x - c11x2*c12.y*c23.y + c12x2*(2*c20.y*c23.y + 2*c21.y*c22.y),
        2*c10.x*c12.x*c12.y*c22.y + 2*c10.y*c12.x*c12.y*c22.x + c11.x*c11.y*c12.x*c22.y +
            c11.x*c11.y*c12.y*c22.x - 2*c20.x*c12.x*c12.y*c22.y - 2*c12.x*c20.y*c12.y*c22.x -
            2*c12.x*c21.x*c12.y*c21.y - 2*c10.x*c12y2*c22.x - 2*c10.y*c12x2*c22.y +
            2*c20.x*c12y2*c22.x - c11y2*c12.x*c22.x - c11x2*c12.y*c22.y + c21x2*c12y2 +
            c12x2*(2*c20.y*c22.y + c21y2),
        2*c10.x*c12.x*c12.y*c21.y + 2*c10.y*c12.x*c21.x*c12.y + c11.x*c11.y*c12.x*c21.y +
            c11.x*c11.y*c21.x*c12.y - 2*c20.x*c12.x*c12.y*c21.y - 2*c12.x*c20.y*c21.x*c12.y -
            2*c10.x*c21.x*c12y2 - 2*c10.y*c12x2*c21.y + 2*c20.x*c21.x*c12y2 -
            c11y2*c12.x*c21.x - c11x2*c12.y*c21.y + 2*c12x2*c20.y*c21.y,
        -2*c10.x*c10.y*c12.x*c12.y - c10.x*c11.x*c11.y*c12.y - c10.y*c11.x*c11.y*c12.x +
            2*c10.x*c12.x*c20.y*c12.y + 2*c10.y*c20.x*c12.x*c12.y + c11.x*c20.x*c11.y*c12.y +
            c11.x*c11.y*c12.x*c20.y - 2*c20.x*c12.x*c20.y*c12.y - 2*c10.x*c20.x*c12y2 +
            c10.x*c11y2*c12.x + c10.y*c11x2*c12.y - 2*c10.y*c12x2*c20.y -
            c20.x*c11y2*c12.x - c11x2*c20.y*c12.y + c10x2*c12y2 + c10y2*c12x2 +
            c20x2*c12y2 + c12x2*c20y2
    );
    var roots = poly.getRootsInInterval(0,1);
    removeMultipleRootsIn01(roots);

    for ( var i = 0; i < roots.length; i++ ) {
        var s = roots[i];
        var xRoots = new Polynomial(
            c12.x,
            c11.x,
            c10.x - c20.x - s*c21.x - s*s*c22.x - s*s*s*c23.x
        ).getRoots();
        var yRoots = new Polynomial(
            c12.y,
            c11.y,
            c10.y - c20.y - s*c21.y - s*s*c22.y - s*s*s*c23.y
        ).getRoots();

        if ( xRoots.length > 0 && yRoots.length > 0 ) {
            var TOLERANCE = 1e-4;

            checkRoots:
                for ( var j = 0; j < xRoots.length; j++ ) {
                    var xRoot = xRoots[j];

                    if ( 0 <= xRoot && xRoot <= 1 ) {
                        for ( var k = 0; k < yRoots.length; k++ ) {
                            if ( Math.abs( xRoot - yRoots[k] ) < TOLERANCE ) {
                                var v = c23.multiply(s * s * s).add(c22.multiply(s * s).add(c21.multiply(s).add(c20)));
                                result.points.push(new Point2D(v.x, v.y));
                                break checkRoots;
                            }
                        }
                    }
                }
        }
    }

    return result;

};

/**
 *  intersectBezier2Ellipse
 *
 *  @param {Point2D} p1
 *  @param {Point2D} p2
 *  @param {Point2D} p3
 *  @param {Point2D} ec
 *  @param {Number} rx
 *  @param {Number} ry
 *  @returns {Intersection}
 */
module.exports.intersectBezier2Ellipse = function(p1, p2, p3, ec, rx, ry) {
    var a, b;       // temporary variables
    var c2, c1, c0; // coefficients of quadratic
    var result = new Intersection();

    a = p2.multiply(-2);
    c2 = p1.add(a.add(p3));

    a = p1.multiply(-2);
    b = p2.multiply(2);
    c1 = a.add(b);

    c0 = new Point2D(p1.x, p1.y);

    var rxrx  = rx*rx;
    var ryry  = ry*ry;
    var roots = new Polynomial(
        ryry*c2.x*c2.x + rxrx*c2.y*c2.y,
        2*(ryry*c2.x*c1.x + rxrx*c2.y*c1.y),
        ryry*(2*c2.x*c0.x + c1.x*c1.x) + rxrx*(2*c2.y*c0.y+c1.y*c1.y) -
            2*(ryry*ec.x*c2.x + rxrx*ec.y*c2.y),
        2*(ryry*c1.x*(c0.x-ec.x) + rxrx*c1.y*(c0.y-ec.y)),
        ryry*(c0.x*c0.x+ec.x*ec.x) + rxrx*(c0.y*c0.y + ec.y*ec.y) -
            2*(ryry*ec.x*c0.x + rxrx*ec.y*c0.y) - rxrx*ryry
    ).getRoots();

    for ( var i = 0; i < roots.length; i++ ) {
        var t = roots[i];

        if ( 0 <= t && t <= 1 )
            result.points.push( c2.multiply(t*t).add(c1.multiply(t).add(c0)) );
    }

    return result;
};


/**
 *  intersectBezier2Line
 *
 *  @param {Point2D} p1
 *  @param {Point2D} p2
 *  @param {Point2D} p3
 *  @param {Point2D} a1
 *  @param {Point2D} a2
 *  @returns {Intersection}
 */
module.exports.intersectBezier2Line = function(p1, p2, p3, a1, a2) {
    var a, b;             // temporary variables
    var c2, c1, c0;       // coefficients of quadratic
    var cl;               // c coefficient for normal form of line
    var n;                // normal for normal form of line
    var min = a1.min(a2); // used to determine if point is on line segment
    var max = a1.max(a2); // used to determine if point is on line segment
    var result = new Intersection();

    a = p2.multiply(-2);
    c2 = p1.add(a.add(p3));

    a = p1.multiply(-2);
    b = p2.multiply(2);
    c1 = a.add(b);

    c0 = new Point2D(p1.x, p1.y);

    // Convert line to normal form: ax + by + c = 0
    // Find normal to line: negative inverse of original line's slope
    n = new Vector2D(a1.y - a2.y, a2.x - a1.x);

    // Determine new c coefficient
    cl = a1.x*a2.y - a2.x*a1.y;

    // Transform cubic coefficients to line's coordinate system and find roots
    // of cubic
    roots = new Polynomial(
        n.dot(c2),
        n.dot(c1),
        n.dot(c0) + cl
    ).getRoots();

    // Any roots in closed interval [0,1] are intersections on Bezier, but
    // might not be on the line segment.
    // Find intersections and calculate point coordinates
    for ( var i = 0; i < roots.length; i++ ) {
        var t = roots[i];

        if ( 0 <= t && t <= 1 ) {
            // We're within the Bezier curve
            // Find point on Bezier
            var p4 = p1.lerp(p2, t);
            var p5 = p2.lerp(p3, t);

            var p6 = p4.lerp(p5, t);

            // See if point is on line segment
            // Had to make special cases for vertical and horizontal lines due
            // to slight errors in calculation of p6
            if ( a1.x == a2.x ) {
                if ( min.y <= p6.y && p6.y <= max.y ) {
                    result.appendPoint( p6 );
                }
            } else if ( a1.y == a2.y ) {
                if ( min.x <= p6.x && p6.x <= max.x ) {
                    result.appendPoint( p6 );
                }
            } else if (min.x <= p6.x && p6.x <= max.x && min.y <= p6.y && p6.y <= max.y) {
                result.appendPoint( p6 );
            }
        }
    }

    return result;
};


/**
 *  intersectBezier3Bezier3
 *
 *  @param {Point2D} a1
 *  @param {Point2D} a2
 *  @param {Point2D} a3
 *  @param {Point2D} a4
 *  @param {Point2D} b1
 *  @param {Point2D} b2
 *  @param {Point2D} b3
 *  @param {Point2D} b4
 *  @returns {Intersection}
 */
module.exports.intersectBezier3Bezier3 = function(a1, a2, a3, a4, b1, b2, b3, b4) {
    var a, b, c, d;         // temporary variables
    var c13, c12, c11, c10; // coefficients of cubic
    var c23, c22, c21, c20; // coefficients of cubic
    var result = new Intersection();

    // Calculate the coefficients of cubic polynomial
    a = a1.multiply(-1);
    b = a2.multiply(3);
    c = a3.multiply(-3);
    d = a.add(b.add(c.add(a4)));
    c13 = new Vector2D(d.x, d.y);

    a = a1.multiply(3);
    b = a2.multiply(-6);
    c = a3.multiply(3);
    d = a.add(b.add(c));
    c12 = new Vector2D(d.x, d.y);

    a = a1.multiply(-3);
    b = a2.multiply(3);
    c = a.add(b);
    c11 = new Vector2D(c.x, c.y);

    c10 = new Vector2D(a1.x, a1.y);

    a = b1.multiply(-1);
    b = b2.multiply(3);
    c = b3.multiply(-3);
    d = a.add(b.add(c.add(b4)));
    c23 = new Vector2D(d.x, d.y);

    a = b1.multiply(3);
    b = b2.multiply(-6);
    c = b3.multiply(3);
    d = a.add(b.add(c));
    c22 = new Vector2D(d.x, d.y);

    a = b1.multiply(-3);
    b = b2.multiply(3);
    c = a.add(b);
    c21 = new Vector2D(c.x, c.y);

    c20 = new Vector2D(b1.x, b1.y);

    var c10x2 = c10.x*c10.x;
    var c10x3 = c10.x*c10.x*c10.x;
    var c10y2 = c10.y*c10.y;
    var c10y3 = c10.y*c10.y*c10.y;
    var c11x2 = c11.x*c11.x;
    var c11x3 = c11.x*c11.x*c11.x;
    var c11y2 = c11.y*c11.y;
    var c11y3 = c11.y*c11.y*c11.y;
    var c12x2 = c12.x*c12.x;
    var c12x3 = c12.x*c12.x*c12.x;
    var c12y2 = c12.y*c12.y;
    var c12y3 = c12.y*c12.y*c12.y;
    var c13x2 = c13.x*c13.x;
    var c13x3 = c13.x*c13.x*c13.x;
    var c13y2 = c13.y*c13.y;
    var c13y3 = c13.y*c13.y*c13.y;
    var c20x2 = c20.x*c20.x;
    var c20x3 = c20.x*c20.x*c20.x;
    var c20y2 = c20.y*c20.y;
    var c20y3 = c20.y*c20.y*c20.y;
    var c21x2 = c21.x*c21.x;
    var c21x3 = c21.x*c21.x*c21.x;
    var c21y2 = c21.y*c21.y;
    var c22x2 = c22.x*c22.x;
    var c22x3 = c22.x*c22.x*c22.x;
    var c22y2 = c22.y*c22.y;
    var c23x2 = c23.x*c23.x;
    var c23x3 = c23.x*c23.x*c23.x;
    var c23y2 = c23.y*c23.y;
    var c23y3 = c23.y*c23.y*c23.y;
    var poly = new Polynomial(
        -c13x3*c23y3 + c13y3*c23x3 - 3*c13.x*c13y2*c23x2*c23.y +
            3*c13x2*c13.y*c23.x*c23y2,
        -6*c13.x*c22.x*c13y2*c23.x*c23.y + 6*c13x2*c13.y*c22.y*c23.x*c23.y + 3*c22.x*c13y3*c23x2 -
            3*c13x3*c22.y*c23y2 - 3*c13.x*c13y2*c22.y*c23x2 + 3*c13x2*c22.x*c13.y*c23y2,
        -6*c21.x*c13.x*c13y2*c23.x*c23.y - 6*c13.x*c22.x*c13y2*c22.y*c23.x + 6*c13x2*c22.x*c13.y*c22.y*c23.y +
            3*c21.x*c13y3*c23x2 + 3*c22x2*c13y3*c23.x + 3*c21.x*c13x2*c13.y*c23y2 - 3*c13.x*c21.y*c13y2*c23x2 -
            3*c13.x*c22x2*c13y2*c23.y + c13x2*c13.y*c23.x*(6*c21.y*c23.y + 3*c22y2) + c13x3*(-c21.y*c23y2 -
            2*c22y2*c23.y - c23.y*(2*c21.y*c23.y + c22y2)),
        c11.x*c12.y*c13.x*c13.y*c23.x*c23.y - c11.y*c12.x*c13.x*c13.y*c23.x*c23.y + 6*c21.x*c22.x*c13y3*c23.x +
            3*c11.x*c12.x*c13.x*c13.y*c23y2 + 6*c10.x*c13.x*c13y2*c23.x*c23.y - 3*c11.x*c12.x*c13y2*c23.x*c23.y -
            3*c11.y*c12.y*c13.x*c13.y*c23x2 - 6*c10.y*c13x2*c13.y*c23.x*c23.y - 6*c20.x*c13.x*c13y2*c23.x*c23.y +
            3*c11.y*c12.y*c13x2*c23.x*c23.y - 2*c12.x*c12y2*c13.x*c23.x*c23.y - 6*c21.x*c13.x*c22.x*c13y2*c23.y -
            6*c21.x*c13.x*c13y2*c22.y*c23.x - 6*c13.x*c21.y*c22.x*c13y2*c23.x + 6*c21.x*c13x2*c13.y*c22.y*c23.y +
            2*c12x2*c12.y*c13.y*c23.x*c23.y + c22x3*c13y3 - 3*c10.x*c13y3*c23x2 + 3*c10.y*c13x3*c23y2 +
            3*c20.x*c13y3*c23x2 + c12y3*c13.x*c23x2 - c12x3*c13.y*c23y2 - 3*c10.x*c13x2*c13.y*c23y2 +
            3*c10.y*c13.x*c13y2*c23x2 - 2*c11.x*c12.y*c13x2*c23y2 + c11.x*c12.y*c13y2*c23x2 - c11.y*c12.x*c13x2*c23y2 +
            2*c11.y*c12.x*c13y2*c23x2 + 3*c20.x*c13x2*c13.y*c23y2 - c12.x*c12y2*c13.y*c23x2 -
            3*c20.y*c13.x*c13y2*c23x2 + c12x2*c12.y*c13.x*c23y2 - 3*c13.x*c22x2*c13y2*c22.y +
            c13x2*c13.y*c23.x*(6*c20.y*c23.y + 6*c21.y*c22.y) + c13x2*c22.x*c13.y*(6*c21.y*c23.y + 3*c22y2) +
            c13x3*(-2*c21.y*c22.y*c23.y - c20.y*c23y2 - c22.y*(2*c21.y*c23.y + c22y2) - c23.y*(2*c20.y*c23.y + 2*c21.y*c22.y)),
        6*c11.x*c12.x*c13.x*c13.y*c22.y*c23.y + c11.x*c12.y*c13.x*c22.x*c13.y*c23.y + c11.x*c12.y*c13.x*c13.y*c22.y*c23.x -
            c11.y*c12.x*c13.x*c22.x*c13.y*c23.y - c11.y*c12.x*c13.x*c13.y*c22.y*c23.x - 6*c11.y*c12.y*c13.x*c22.x*c13.y*c23.x -
            6*c10.x*c22.x*c13y3*c23.x + 6*c20.x*c22.x*c13y3*c23.x + 6*c10.y*c13x3*c22.y*c23.y + 2*c12y3*c13.x*c22.x*c23.x -
            2*c12x3*c13.y*c22.y*c23.y + 6*c10.x*c13.x*c22.x*c13y2*c23.y + 6*c10.x*c13.x*c13y2*c22.y*c23.x +
            6*c10.y*c13.x*c22.x*c13y2*c23.x - 3*c11.x*c12.x*c22.x*c13y2*c23.y - 3*c11.x*c12.x*c13y2*c22.y*c23.x +
            2*c11.x*c12.y*c22.x*c13y2*c23.x + 4*c11.y*c12.x*c22.x*c13y2*c23.x - 6*c10.x*c13x2*c13.y*c22.y*c23.y -
            6*c10.y*c13x2*c22.x*c13.y*c23.y - 6*c10.y*c13x2*c13.y*c22.y*c23.x - 4*c11.x*c12.y*c13x2*c22.y*c23.y -
            6*c20.x*c13.x*c22.x*c13y2*c23.y - 6*c20.x*c13.x*c13y2*c22.y*c23.x - 2*c11.y*c12.x*c13x2*c22.y*c23.y +
            3*c11.y*c12.y*c13x2*c22.x*c23.y + 3*c11.y*c12.y*c13x2*c22.y*c23.x - 2*c12.x*c12y2*c13.x*c22.x*c23.y -
            2*c12.x*c12y2*c13.x*c22.y*c23.x - 2*c12.x*c12y2*c22.x*c13.y*c23.x - 6*c20.y*c13.x*c22.x*c13y2*c23.x -
            6*c21.x*c13.x*c21.y*c13y2*c23.x - 6*c21.x*c13.x*c22.x*c13y2*c22.y + 6*c20.x*c13x2*c13.y*c22.y*c23.y +
            2*c12x2*c12.y*c13.x*c22.y*c23.y + 2*c12x2*c12.y*c22.x*c13.y*c23.y + 2*c12x2*c12.y*c13.y*c22.y*c23.x +
            3*c21.x*c22x2*c13y3 + 3*c21x2*c13y3*c23.x - 3*c13.x*c21.y*c22x2*c13y2 - 3*c21x2*c13.x*c13y2*c23.y +
            c13x2*c22.x*c13.y*(6*c20.y*c23.y + 6*c21.y*c22.y) + c13x2*c13.y*c23.x*(6*c20.y*c22.y + 3*c21y2) +
            c21.x*c13x2*c13.y*(6*c21.y*c23.y + 3*c22y2) + c13x3*(-2*c20.y*c22.y*c23.y - c23.y*(2*c20.y*c22.y + c21y2) -
            c21.y*(2*c21.y*c23.y + c22y2) - c22.y*(2*c20.y*c23.y + 2*c21.y*c22.y)),
        c11.x*c21.x*c12.y*c13.x*c13.y*c23.y + c11.x*c12.y*c13.x*c21.y*c13.y*c23.x + c11.x*c12.y*c13.x*c22.x*c13.y*c22.y -
            c11.y*c12.x*c21.x*c13.x*c13.y*c23.y - c11.y*c12.x*c13.x*c21.y*c13.y*c23.x - c11.y*c12.x*c13.x*c22.x*c13.y*c22.y -
            6*c11.y*c21.x*c12.y*c13.x*c13.y*c23.x - 6*c10.x*c21.x*c13y3*c23.x + 6*c20.x*c21.x*c13y3*c23.x +
            2*c21.x*c12y3*c13.x*c23.x + 6*c10.x*c21.x*c13.x*c13y2*c23.y + 6*c10.x*c13.x*c21.y*c13y2*c23.x +
            6*c10.x*c13.x*c22.x*c13y2*c22.y + 6*c10.y*c21.x*c13.x*c13y2*c23.x - 3*c11.x*c12.x*c21.x*c13y2*c23.y -
            3*c11.x*c12.x*c21.y*c13y2*c23.x - 3*c11.x*c12.x*c22.x*c13y2*c22.y + 2*c11.x*c21.x*c12.y*c13y2*c23.x +
            4*c11.y*c12.x*c21.x*c13y2*c23.x - 6*c10.y*c21.x*c13x2*c13.y*c23.y - 6*c10.y*c13x2*c21.y*c13.y*c23.x -
            6*c10.y*c13x2*c22.x*c13.y*c22.y - 6*c20.x*c21.x*c13.x*c13y2*c23.y - 6*c20.x*c13.x*c21.y*c13y2*c23.x -
            6*c20.x*c13.x*c22.x*c13y2*c22.y + 3*c11.y*c21.x*c12.y*c13x2*c23.y - 3*c11.y*c12.y*c13.x*c22x2*c13.y +
            3*c11.y*c12.y*c13x2*c21.y*c23.x + 3*c11.y*c12.y*c13x2*c22.x*c22.y - 2*c12.x*c21.x*c12y2*c13.x*c23.y -
            2*c12.x*c21.x*c12y2*c13.y*c23.x - 2*c12.x*c12y2*c13.x*c21.y*c23.x - 2*c12.x*c12y2*c13.x*c22.x*c22.y -
            6*c20.y*c21.x*c13.x*c13y2*c23.x - 6*c21.x*c13.x*c21.y*c22.x*c13y2 + 6*c20.y*c13x2*c21.y*c13.y*c23.x +
            2*c12x2*c21.x*c12.y*c13.y*c23.y + 2*c12x2*c12.y*c21.y*c13.y*c23.x + 2*c12x2*c12.y*c22.x*c13.y*c22.y -
            3*c10.x*c22x2*c13y3 + 3*c20.x*c22x2*c13y3 + 3*c21x2*c22.x*c13y3 + c12y3*c13.x*c22x2 +
            3*c10.y*c13.x*c22x2*c13y2 + c11.x*c12.y*c22x2*c13y2 + 2*c11.y*c12.x*c22x2*c13y2 -
            c12.x*c12y2*c22x2*c13.y - 3*c20.y*c13.x*c22x2*c13y2 - 3*c21x2*c13.x*c13y2*c22.y +
            c12x2*c12.y*c13.x*(2*c21.y*c23.y + c22y2) + c11.x*c12.x*c13.x*c13.y*(6*c21.y*c23.y + 3*c22y2) +
            c21.x*c13x2*c13.y*(6*c20.y*c23.y + 6*c21.y*c22.y) + c12x3*c13.y*(-2*c21.y*c23.y - c22y2) +
            c10.y*c13x3*(6*c21.y*c23.y + 3*c22y2) + c11.y*c12.x*c13x2*(-2*c21.y*c23.y - c22y2) +
            c11.x*c12.y*c13x2*(-4*c21.y*c23.y - 2*c22y2) + c10.x*c13x2*c13.y*(-6*c21.y*c23.y - 3*c22y2) +
            c13x2*c22.x*c13.y*(6*c20.y*c22.y + 3*c21y2) + c20.x*c13x2*c13.y*(6*c21.y*c23.y + 3*c22y2) +
            c13x3*(-2*c20.y*c21.y*c23.y - c22.y*(2*c20.y*c22.y + c21y2) - c20.y*(2*c21.y*c23.y + c22y2) -
            c21.y*(2*c20.y*c23.y + 2*c21.y*c22.y)),
        -c10.x*c11.x*c12.y*c13.x*c13.y*c23.y + c10.x*c11.y*c12.x*c13.x*c13.y*c23.y + 6*c10.x*c11.y*c12.y*c13.x*c13.y*c23.x -
            6*c10.y*c11.x*c12.x*c13.x*c13.y*c23.y - c10.y*c11.x*c12.y*c13.x*c13.y*c23.x + c10.y*c11.y*c12.x*c13.x*c13.y*c23.x +
            c11.x*c11.y*c12.x*c12.y*c13.x*c23.y - c11.x*c11.y*c12.x*c12.y*c13.y*c23.x + c11.x*c20.x*c12.y*c13.x*c13.y*c23.y +
            c11.x*c20.y*c12.y*c13.x*c13.y*c23.x + c11.x*c21.x*c12.y*c13.x*c13.y*c22.y + c11.x*c12.y*c13.x*c21.y*c22.x*c13.y -
            c20.x*c11.y*c12.x*c13.x*c13.y*c23.y - 6*c20.x*c11.y*c12.y*c13.x*c13.y*c23.x - c11.y*c12.x*c20.y*c13.x*c13.y*c23.x -
            c11.y*c12.x*c21.x*c13.x*c13.y*c22.y - c11.y*c12.x*c13.x*c21.y*c22.x*c13.y - 6*c11.y*c21.x*c12.y*c13.x*c22.x*c13.y -
            6*c10.x*c20.x*c13y3*c23.x - 6*c10.x*c21.x*c22.x*c13y3 - 2*c10.x*c12y3*c13.x*c23.x + 6*c20.x*c21.x*c22.x*c13y3 +
            2*c20.x*c12y3*c13.x*c23.x + 2*c21.x*c12y3*c13.x*c22.x + 2*c10.y*c12x3*c13.y*c23.y - 6*c10.x*c10.y*c13.x*c13y2*c23.x +
            3*c10.x*c11.x*c12.x*c13y2*c23.y - 2*c10.x*c11.x*c12.y*c13y2*c23.x - 4*c10.x*c11.y*c12.x*c13y2*c23.x +
            3*c10.y*c11.x*c12.x*c13y2*c23.x + 6*c10.x*c10.y*c13x2*c13.y*c23.y + 6*c10.x*c20.x*c13.x*c13y2*c23.y -
            3*c10.x*c11.y*c12.y*c13x2*c23.y + 2*c10.x*c12.x*c12y2*c13.x*c23.y + 2*c10.x*c12.x*c12y2*c13.y*c23.x +
            6*c10.x*c20.y*c13.x*c13y2*c23.x + 6*c10.x*c21.x*c13.x*c13y2*c22.y + 6*c10.x*c13.x*c21.y*c22.x*c13y2 +
            4*c10.y*c11.x*c12.y*c13x2*c23.y + 6*c10.y*c20.x*c13.x*c13y2*c23.x + 2*c10.y*c11.y*c12.x*c13x2*c23.y -
            3*c10.y*c11.y*c12.y*c13x2*c23.x + 2*c10.y*c12.x*c12y2*c13.x*c23.x + 6*c10.y*c21.x*c13.x*c22.x*c13y2 -
            3*c11.x*c20.x*c12.x*c13y2*c23.y + 2*c11.x*c20.x*c12.y*c13y2*c23.x + c11.x*c11.y*c12y2*c13.x*c23.x -
            3*c11.x*c12.x*c20.y*c13y2*c23.x - 3*c11.x*c12.x*c21.x*c13y2*c22.y - 3*c11.x*c12.x*c21.y*c22.x*c13y2 +
            2*c11.x*c21.x*c12.y*c22.x*c13y2 + 4*c20.x*c11.y*c12.x*c13y2*c23.x + 4*c11.y*c12.x*c21.x*c22.x*c13y2 -
            2*c10.x*c12x2*c12.y*c13.y*c23.y - 6*c10.y*c20.x*c13x2*c13.y*c23.y - 6*c10.y*c20.y*c13x2*c13.y*c23.x -
            6*c10.y*c21.x*c13x2*c13.y*c22.y - 2*c10.y*c12x2*c12.y*c13.x*c23.y - 2*c10.y*c12x2*c12.y*c13.y*c23.x -
            6*c10.y*c13x2*c21.y*c22.x*c13.y - c11.x*c11.y*c12x2*c13.y*c23.y - 2*c11.x*c11y2*c13.x*c13.y*c23.x +
            3*c20.x*c11.y*c12.y*c13x2*c23.y - 2*c20.x*c12.x*c12y2*c13.x*c23.y - 2*c20.x*c12.x*c12y2*c13.y*c23.x -
            6*c20.x*c20.y*c13.x*c13y2*c23.x - 6*c20.x*c21.x*c13.x*c13y2*c22.y - 6*c20.x*c13.x*c21.y*c22.x*c13y2 +
            3*c11.y*c20.y*c12.y*c13x2*c23.x + 3*c11.y*c21.x*c12.y*c13x2*c22.y + 3*c11.y*c12.y*c13x2*c21.y*c22.x -
            2*c12.x*c20.y*c12y2*c13.x*c23.x - 2*c12.x*c21.x*c12y2*c13.x*c22.y - 2*c12.x*c21.x*c12y2*c22.x*c13.y -
            2*c12.x*c12y2*c13.x*c21.y*c22.x - 6*c20.y*c21.x*c13.x*c22.x*c13y2 - c11y2*c12.x*c12.y*c13.x*c23.x +
            2*c20.x*c12x2*c12.y*c13.y*c23.y + 6*c20.y*c13x2*c21.y*c22.x*c13.y + 2*c11x2*c11.y*c13.x*c13.y*c23.y +
            c11x2*c12.x*c12.y*c13.y*c23.y + 2*c12x2*c20.y*c12.y*c13.y*c23.x + 2*c12x2*c21.x*c12.y*c13.y*c22.y +
            2*c12x2*c12.y*c21.y*c22.x*c13.y + c21x3*c13y3 + 3*c10x2*c13y3*c23.x - 3*c10y2*c13x3*c23.y +
            3*c20x2*c13y3*c23.x + c11y3*c13x2*c23.x - c11x3*c13y2*c23.y - c11.x*c11y2*c13x2*c23.y +
            c11x2*c11.y*c13y2*c23.x - 3*c10x2*c13.x*c13y2*c23.y + 3*c10y2*c13x2*c13.y*c23.x - c11x2*c12y2*c13.x*c23.y +
            c11y2*c12x2*c13.y*c23.x - 3*c21x2*c13.x*c21.y*c13y2 - 3*c20x2*c13.x*c13y2*c23.y + 3*c20y2*c13x2*c13.y*c23.x +
            c11.x*c12.x*c13.x*c13.y*(6*c20.y*c23.y + 6*c21.y*c22.y) + c12x3*c13.y*(-2*c20.y*c23.y - 2*c21.y*c22.y) +
            c10.y*c13x3*(6*c20.y*c23.y + 6*c21.y*c22.y) + c11.y*c12.x*c13x2*(-2*c20.y*c23.y - 2*c21.y*c22.y) +
            c12x2*c12.y*c13.x*(2*c20.y*c23.y + 2*c21.y*c22.y) + c11.x*c12.y*c13x2*(-4*c20.y*c23.y - 4*c21.y*c22.y) +
            c10.x*c13x2*c13.y*(-6*c20.y*c23.y - 6*c21.y*c22.y) + c20.x*c13x2*c13.y*(6*c20.y*c23.y + 6*c21.y*c22.y) +
            c21.x*c13x2*c13.y*(6*c20.y*c22.y + 3*c21y2) + c13x3*(-2*c20.y*c21.y*c22.y - c20y2*c23.y -
            c21.y*(2*c20.y*c22.y + c21y2) - c20.y*(2*c20.y*c23.y + 2*c21.y*c22.y)),
        -c10.x*c11.x*c12.y*c13.x*c13.y*c22.y + c10.x*c11.y*c12.x*c13.x*c13.y*c22.y + 6*c10.x*c11.y*c12.y*c13.x*c22.x*c13.y -
            6*c10.y*c11.x*c12.x*c13.x*c13.y*c22.y - c10.y*c11.x*c12.y*c13.x*c22.x*c13.y + c10.y*c11.y*c12.x*c13.x*c22.x*c13.y +
            c11.x*c11.y*c12.x*c12.y*c13.x*c22.y - c11.x*c11.y*c12.x*c12.y*c22.x*c13.y + c11.x*c20.x*c12.y*c13.x*c13.y*c22.y +
            c11.x*c20.y*c12.y*c13.x*c22.x*c13.y + c11.x*c21.x*c12.y*c13.x*c21.y*c13.y - c20.x*c11.y*c12.x*c13.x*c13.y*c22.y -
            6*c20.x*c11.y*c12.y*c13.x*c22.x*c13.y - c11.y*c12.x*c20.y*c13.x*c22.x*c13.y - c11.y*c12.x*c21.x*c13.x*c21.y*c13.y -
            6*c10.x*c20.x*c22.x*c13y3 - 2*c10.x*c12y3*c13.x*c22.x + 2*c20.x*c12y3*c13.x*c22.x + 2*c10.y*c12x3*c13.y*c22.y -
            6*c10.x*c10.y*c13.x*c22.x*c13y2 + 3*c10.x*c11.x*c12.x*c13y2*c22.y - 2*c10.x*c11.x*c12.y*c22.x*c13y2 -
            4*c10.x*c11.y*c12.x*c22.x*c13y2 + 3*c10.y*c11.x*c12.x*c22.x*c13y2 + 6*c10.x*c10.y*c13x2*c13.y*c22.y +
            6*c10.x*c20.x*c13.x*c13y2*c22.y - 3*c10.x*c11.y*c12.y*c13x2*c22.y + 2*c10.x*c12.x*c12y2*c13.x*c22.y +
            2*c10.x*c12.x*c12y2*c22.x*c13.y + 6*c10.x*c20.y*c13.x*c22.x*c13y2 + 6*c10.x*c21.x*c13.x*c21.y*c13y2 +
            4*c10.y*c11.x*c12.y*c13x2*c22.y + 6*c10.y*c20.x*c13.x*c22.x*c13y2 + 2*c10.y*c11.y*c12.x*c13x2*c22.y -
            3*c10.y*c11.y*c12.y*c13x2*c22.x + 2*c10.y*c12.x*c12y2*c13.x*c22.x - 3*c11.x*c20.x*c12.x*c13y2*c22.y +
            2*c11.x*c20.x*c12.y*c22.x*c13y2 + c11.x*c11.y*c12y2*c13.x*c22.x - 3*c11.x*c12.x*c20.y*c22.x*c13y2 -
            3*c11.x*c12.x*c21.x*c21.y*c13y2 + 4*c20.x*c11.y*c12.x*c22.x*c13y2 - 2*c10.x*c12x2*c12.y*c13.y*c22.y -
            6*c10.y*c20.x*c13x2*c13.y*c22.y - 6*c10.y*c20.y*c13x2*c22.x*c13.y - 6*c10.y*c21.x*c13x2*c21.y*c13.y -
            2*c10.y*c12x2*c12.y*c13.x*c22.y - 2*c10.y*c12x2*c12.y*c22.x*c13.y - c11.x*c11.y*c12x2*c13.y*c22.y -
            2*c11.x*c11y2*c13.x*c22.x*c13.y + 3*c20.x*c11.y*c12.y*c13x2*c22.y - 2*c20.x*c12.x*c12y2*c13.x*c22.y -
            2*c20.x*c12.x*c12y2*c22.x*c13.y - 6*c20.x*c20.y*c13.x*c22.x*c13y2 - 6*c20.x*c21.x*c13.x*c21.y*c13y2 +
            3*c11.y*c20.y*c12.y*c13x2*c22.x + 3*c11.y*c21.x*c12.y*c13x2*c21.y - 2*c12.x*c20.y*c12y2*c13.x*c22.x -
            2*c12.x*c21.x*c12y2*c13.x*c21.y - c11y2*c12.x*c12.y*c13.x*c22.x + 2*c20.x*c12x2*c12.y*c13.y*c22.y -
            3*c11.y*c21x2*c12.y*c13.x*c13.y + 6*c20.y*c21.x*c13x2*c21.y*c13.y + 2*c11x2*c11.y*c13.x*c13.y*c22.y +
            c11x2*c12.x*c12.y*c13.y*c22.y + 2*c12x2*c20.y*c12.y*c22.x*c13.y + 2*c12x2*c21.x*c12.y*c21.y*c13.y -
            3*c10.x*c21x2*c13y3 + 3*c20.x*c21x2*c13y3 + 3*c10x2*c22.x*c13y3 - 3*c10y2*c13x3*c22.y + 3*c20x2*c22.x*c13y3 +
            c21x2*c12y3*c13.x + c11y3*c13x2*c22.x - c11x3*c13y2*c22.y + 3*c10.y*c21x2*c13.x*c13y2 -
            c11.x*c11y2*c13x2*c22.y + c11.x*c21x2*c12.y*c13y2 + 2*c11.y*c12.x*c21x2*c13y2 + c11x2*c11.y*c22.x*c13y2 -
            c12.x*c21x2*c12y2*c13.y - 3*c20.y*c21x2*c13.x*c13y2 - 3*c10x2*c13.x*c13y2*c22.y + 3*c10y2*c13x2*c22.x*c13.y -
            c11x2*c12y2*c13.x*c22.y + c11y2*c12x2*c22.x*c13.y - 3*c20x2*c13.x*c13y2*c22.y + 3*c20y2*c13x2*c22.x*c13.y +
            c12x2*c12.y*c13.x*(2*c20.y*c22.y + c21y2) + c11.x*c12.x*c13.x*c13.y*(6*c20.y*c22.y + 3*c21y2) +
            c12x3*c13.y*(-2*c20.y*c22.y - c21y2) + c10.y*c13x3*(6*c20.y*c22.y + 3*c21y2) +
            c11.y*c12.x*c13x2*(-2*c20.y*c22.y - c21y2) + c11.x*c12.y*c13x2*(-4*c20.y*c22.y - 2*c21y2) +
            c10.x*c13x2*c13.y*(-6*c20.y*c22.y - 3*c21y2) + c20.x*c13x2*c13.y*(6*c20.y*c22.y + 3*c21y2) +
            c13x3*(-2*c20.y*c21y2 - c20y2*c22.y - c20.y*(2*c20.y*c22.y + c21y2)),
        -c10.x*c11.x*c12.y*c13.x*c21.y*c13.y + c10.x*c11.y*c12.x*c13.x*c21.y*c13.y + 6*c10.x*c11.y*c21.x*c12.y*c13.x*c13.y -
            6*c10.y*c11.x*c12.x*c13.x*c21.y*c13.y - c10.y*c11.x*c21.x*c12.y*c13.x*c13.y + c10.y*c11.y*c12.x*c21.x*c13.x*c13.y -
            c11.x*c11.y*c12.x*c21.x*c12.y*c13.y + c11.x*c11.y*c12.x*c12.y*c13.x*c21.y + c11.x*c20.x*c12.y*c13.x*c21.y*c13.y +
            6*c11.x*c12.x*c20.y*c13.x*c21.y*c13.y + c11.x*c20.y*c21.x*c12.y*c13.x*c13.y - c20.x*c11.y*c12.x*c13.x*c21.y*c13.y -
            6*c20.x*c11.y*c21.x*c12.y*c13.x*c13.y - c11.y*c12.x*c20.y*c21.x*c13.x*c13.y - 6*c10.x*c20.x*c21.x*c13y3 -
            2*c10.x*c21.x*c12y3*c13.x + 6*c10.y*c20.y*c13x3*c21.y + 2*c20.x*c21.x*c12y3*c13.x + 2*c10.y*c12x3*c21.y*c13.y -
            2*c12x3*c20.y*c21.y*c13.y - 6*c10.x*c10.y*c21.x*c13.x*c13y2 + 3*c10.x*c11.x*c12.x*c21.y*c13y2 -
            2*c10.x*c11.x*c21.x*c12.y*c13y2 - 4*c10.x*c11.y*c12.x*c21.x*c13y2 + 3*c10.y*c11.x*c12.x*c21.x*c13y2 +
            6*c10.x*c10.y*c13x2*c21.y*c13.y + 6*c10.x*c20.x*c13.x*c21.y*c13y2 - 3*c10.x*c11.y*c12.y*c13x2*c21.y +
            2*c10.x*c12.x*c21.x*c12y2*c13.y + 2*c10.x*c12.x*c12y2*c13.x*c21.y + 6*c10.x*c20.y*c21.x*c13.x*c13y2 +
            4*c10.y*c11.x*c12.y*c13x2*c21.y + 6*c10.y*c20.x*c21.x*c13.x*c13y2 + 2*c10.y*c11.y*c12.x*c13x2*c21.y -
            3*c10.y*c11.y*c21.x*c12.y*c13x2 + 2*c10.y*c12.x*c21.x*c12y2*c13.x - 3*c11.x*c20.x*c12.x*c21.y*c13y2 +
            2*c11.x*c20.x*c21.x*c12.y*c13y2 + c11.x*c11.y*c21.x*c12y2*c13.x - 3*c11.x*c12.x*c20.y*c21.x*c13y2 +
            4*c20.x*c11.y*c12.x*c21.x*c13y2 - 6*c10.x*c20.y*c13x2*c21.y*c13.y - 2*c10.x*c12x2*c12.y*c21.y*c13.y -
            6*c10.y*c20.x*c13x2*c21.y*c13.y - 6*c10.y*c20.y*c21.x*c13x2*c13.y - 2*c10.y*c12x2*c21.x*c12.y*c13.y -
            2*c10.y*c12x2*c12.y*c13.x*c21.y - c11.x*c11.y*c12x2*c21.y*c13.y - 4*c11.x*c20.y*c12.y*c13x2*c21.y -
            2*c11.x*c11y2*c21.x*c13.x*c13.y + 3*c20.x*c11.y*c12.y*c13x2*c21.y - 2*c20.x*c12.x*c21.x*c12y2*c13.y -
            2*c20.x*c12.x*c12y2*c13.x*c21.y - 6*c20.x*c20.y*c21.x*c13.x*c13y2 - 2*c11.y*c12.x*c20.y*c13x2*c21.y +
            3*c11.y*c20.y*c21.x*c12.y*c13x2 - 2*c12.x*c20.y*c21.x*c12y2*c13.x - c11y2*c12.x*c21.x*c12.y*c13.x +
            6*c20.x*c20.y*c13x2*c21.y*c13.y + 2*c20.x*c12x2*c12.y*c21.y*c13.y + 2*c11x2*c11.y*c13.x*c21.y*c13.y +
            c11x2*c12.x*c12.y*c21.y*c13.y + 2*c12x2*c20.y*c21.x*c12.y*c13.y + 2*c12x2*c20.y*c12.y*c13.x*c21.y +
            3*c10x2*c21.x*c13y3 - 3*c10y2*c13x3*c21.y + 3*c20x2*c21.x*c13y3 + c11y3*c21.x*c13x2 - c11x3*c21.y*c13y2 -
            3*c20y2*c13x3*c21.y - c11.x*c11y2*c13x2*c21.y + c11x2*c11.y*c21.x*c13y2 - 3*c10x2*c13.x*c21.y*c13y2 +
            3*c10y2*c21.x*c13x2*c13.y - c11x2*c12y2*c13.x*c21.y + c11y2*c12x2*c21.x*c13.y - 3*c20x2*c13.x*c21.y*c13y2 +
            3*c20y2*c21.x*c13x2*c13.y,
        c10.x*c10.y*c11.x*c12.y*c13.x*c13.y - c10.x*c10.y*c11.y*c12.x*c13.x*c13.y + c10.x*c11.x*c11.y*c12.x*c12.y*c13.y -
            c10.y*c11.x*c11.y*c12.x*c12.y*c13.x - c10.x*c11.x*c20.y*c12.y*c13.x*c13.y + 6*c10.x*c20.x*c11.y*c12.y*c13.x*c13.y +
            c10.x*c11.y*c12.x*c20.y*c13.x*c13.y - c10.y*c11.x*c20.x*c12.y*c13.x*c13.y - 6*c10.y*c11.x*c12.x*c20.y*c13.x*c13.y +
            c10.y*c20.x*c11.y*c12.x*c13.x*c13.y - c11.x*c20.x*c11.y*c12.x*c12.y*c13.y + c11.x*c11.y*c12.x*c20.y*c12.y*c13.x +
            c11.x*c20.x*c20.y*c12.y*c13.x*c13.y - c20.x*c11.y*c12.x*c20.y*c13.x*c13.y - 2*c10.x*c20.x*c12y3*c13.x +
            2*c10.y*c12x3*c20.y*c13.y - 3*c10.x*c10.y*c11.x*c12.x*c13y2 - 6*c10.x*c10.y*c20.x*c13.x*c13y2 +
            3*c10.x*c10.y*c11.y*c12.y*c13x2 - 2*c10.x*c10.y*c12.x*c12y2*c13.x - 2*c10.x*c11.x*c20.x*c12.y*c13y2 -
            c10.x*c11.x*c11.y*c12y2*c13.x + 3*c10.x*c11.x*c12.x*c20.y*c13y2 - 4*c10.x*c20.x*c11.y*c12.x*c13y2 +
            3*c10.y*c11.x*c20.x*c12.x*c13y2 + 6*c10.x*c10.y*c20.y*c13x2*c13.y + 2*c10.x*c10.y*c12x2*c12.y*c13.y +
            2*c10.x*c11.x*c11y2*c13.x*c13.y + 2*c10.x*c20.x*c12.x*c12y2*c13.y + 6*c10.x*c20.x*c20.y*c13.x*c13y2 -
            3*c10.x*c11.y*c20.y*c12.y*c13x2 + 2*c10.x*c12.x*c20.y*c12y2*c13.x + c10.x*c11y2*c12.x*c12.y*c13.x +
            c10.y*c11.x*c11.y*c12x2*c13.y + 4*c10.y*c11.x*c20.y*c12.y*c13x2 - 3*c10.y*c20.x*c11.y*c12.y*c13x2 +
            2*c10.y*c20.x*c12.x*c12y2*c13.x + 2*c10.y*c11.y*c12.x*c20.y*c13x2 + c11.x*c20.x*c11.y*c12y2*c13.x -
            3*c11.x*c20.x*c12.x*c20.y*c13y2 - 2*c10.x*c12x2*c20.y*c12.y*c13.y - 6*c10.y*c20.x*c20.y*c13x2*c13.y -
            2*c10.y*c20.x*c12x2*c12.y*c13.y - 2*c10.y*c11x2*c11.y*c13.x*c13.y - c10.y*c11x2*c12.x*c12.y*c13.y -
            2*c10.y*c12x2*c20.y*c12.y*c13.x - 2*c11.x*c20.x*c11y2*c13.x*c13.y - c11.x*c11.y*c12x2*c20.y*c13.y +
            3*c20.x*c11.y*c20.y*c12.y*c13x2 - 2*c20.x*c12.x*c20.y*c12y2*c13.x - c20.x*c11y2*c12.x*c12.y*c13.x +
            3*c10y2*c11.x*c12.x*c13.x*c13.y + 3*c11.x*c12.x*c20y2*c13.x*c13.y + 2*c20.x*c12x2*c20.y*c12.y*c13.y -
            3*c10x2*c11.y*c12.y*c13.x*c13.y + 2*c11x2*c11.y*c20.y*c13.x*c13.y + c11x2*c12.x*c20.y*c12.y*c13.y -
            3*c20x2*c11.y*c12.y*c13.x*c13.y - c10x3*c13y3 + c10y3*c13x3 + c20x3*c13y3 - c20y3*c13x3 -
            3*c10.x*c20x2*c13y3 - c10.x*c11y3*c13x2 + 3*c10x2*c20.x*c13y3 + c10.y*c11x3*c13y2 +
            3*c10.y*c20y2*c13x3 + c20.x*c11y3*c13x2 + c10x2*c12y3*c13.x - 3*c10y2*c20.y*c13x3 - c10y2*c12x3*c13.y +
            c20x2*c12y3*c13.x - c11x3*c20.y*c13y2 - c12x3*c20y2*c13.y - c10.x*c11x2*c11.y*c13y2 +
            c10.y*c11.x*c11y2*c13x2 - 3*c10.x*c10y2*c13x2*c13.y - c10.x*c11y2*c12x2*c13.y + c10.y*c11x2*c12y2*c13.x -
            c11.x*c11y2*c20.y*c13x2 + 3*c10x2*c10.y*c13.x*c13y2 + c10x2*c11.x*c12.y*c13y2 +
            2*c10x2*c11.y*c12.x*c13y2 - 2*c10y2*c11.x*c12.y*c13x2 - c10y2*c11.y*c12.x*c13x2 + c11x2*c20.x*c11.y*c13y2 -
            3*c10.x*c20y2*c13x2*c13.y + 3*c10.y*c20x2*c13.x*c13y2 + c11.x*c20x2*c12.y*c13y2 - 2*c11.x*c20y2*c12.y*c13x2 +
            c20.x*c11y2*c12x2*c13.y - c11.y*c12.x*c20y2*c13x2 - c10x2*c12.x*c12y2*c13.y - 3*c10x2*c20.y*c13.x*c13y2 +
            3*c10y2*c20.x*c13x2*c13.y + c10y2*c12x2*c12.y*c13.x - c11x2*c20.y*c12y2*c13.x + 2*c20x2*c11.y*c12.x*c13y2 +
            3*c20.x*c20y2*c13x2*c13.y - c20x2*c12.x*c12y2*c13.y - 3*c20x2*c20.y*c13.x*c13y2 + c12x2*c20y2*c12.y*c13.x
    );
    var roots = poly.getRootsInInterval(0,1);
    removeMultipleRootsIn01(roots);

    for ( var i = 0; i < roots.length; i++ ) {
        var s = roots[i];
        var xRoots = new Polynomial(
            c13.x,
            c12.x,
            c11.x,
            c10.x - c20.x - s*c21.x - s*s*c22.x - s*s*s*c23.x
        ).getRoots();
        var yRoots = new Polynomial(
            c13.y,
            c12.y,
            c11.y,
            c10.y - c20.y - s*c21.y - s*s*c22.y - s*s*s*c23.y
        ).getRoots();

        if ( xRoots.length > 0 && yRoots.length > 0 ) {
            var TOLERANCE = 1e-4;

            checkRoots:
                for ( var j = 0; j < xRoots.length; j++ ) {
                    var xRoot = xRoots[j];

                    if ( 0 <= xRoot && xRoot <= 1 ) {
                        for ( var k = 0; k < yRoots.length; k++ ) {
                            if ( Math.abs( xRoot - yRoots[k] ) < TOLERANCE ) {
                                var v = c23.multiply(s * s * s).add(c22.multiply(s * s).add(c21.multiply(s).add(c20)));
                                result.points.push(new Point2D(v.x, v.y));
                                break checkRoots;
                            }
                        }
                    }
                }
        }
    }

    return result;
};

/**
 *  intersectBezier3Ellipse
 *
 *  @param {Point2D} p1
 *  @param {Point2D} p2
 *  @param {Point2D} p3
 *  @param {Point2D} p4
 *  @param {Point2D} ec
 *  @param {Number} rx
 *  @param {Number} ry
 *  @returns {Intersection}
 */
module.exports.intersectBezier3Ellipse = function(p1, p2, p3, p4, ec, rx, ry) {
    var a, b, c, d;       // temporary variables
    var c3, c2, c1, c0;   // coefficients of cubic
    var result = new Intersection();

    // Calculate the coefficients of cubic polynomial
    a = p1.multiply(-1);
    b = p2.multiply(3);
    c = p3.multiply(-3);
    d = a.add(b.add(c.add(p4)));
    c3 = new Vector2D(d.x, d.y);

    a = p1.multiply(3);
    b = p2.multiply(-6);
    c = p3.multiply(3);
    d = a.add(b.add(c));
    c2 = new Vector2D(d.x, d.y);

    a = p1.multiply(-3);
    b = p2.multiply(3);
    c = a.add(b);
    c1 = new Vector2D(c.x, c.y);

    c0 = new Vector2D(p1.x, p1.y);

    var rxrx  = rx*rx;
    var ryry  = ry*ry;
    var poly = new Polynomial(
        c3.x*c3.x*ryry + c3.y*c3.y*rxrx,
        2*(c3.x*c2.x*ryry + c3.y*c2.y*rxrx),
        2*(c3.x*c1.x*ryry + c3.y*c1.y*rxrx) + c2.x*c2.x*ryry + c2.y*c2.y*rxrx,
        2*c3.x*ryry*(c0.x - ec.x) + 2*c3.y*rxrx*(c0.y - ec.y) +
            2*(c2.x*c1.x*ryry + c2.y*c1.y*rxrx),
        2*c2.x*ryry*(c0.x - ec.x) + 2*c2.y*rxrx*(c0.y - ec.y) +
            c1.x*c1.x*ryry + c1.y*c1.y*rxrx,
        2*c1.x*ryry*(c0.x - ec.x) + 2*c1.y*rxrx*(c0.y - ec.y),
        c0.x*c0.x*ryry - 2*c0.y*ec.y*rxrx - 2*c0.x*ec.x*ryry +
            c0.y*c0.y*rxrx + ec.x*ec.x*ryry + ec.y*ec.y*rxrx - rxrx*ryry
    );
    var roots = poly.getRootsInInterval(0,1);
    removeMultipleRootsIn01(roots);

    for ( var i = 0; i < roots.length; i++ ) {
        var t = roots[i];
        var v = c3.multiply(t * t * t).add(c2.multiply(t * t).add(c1.multiply(t).add(c0)));
        result.points.push(new Point2D(v.x, v.y));
    }

    return result;
};


/**
 *  intersectBezier3Line
 *
 *  Many thanks to Dan Sunday at SoftSurfer.com.  He gave me a very thorough
 *  sketch of the algorithm used here.  Without his help, I'm not sure when I
 *  would have figured out this intersection problem.
 *
 *  @param {Point2D} p1
 *  @param {Point2D} p2
 *  @param {Point2D} p3
 *  @param {Point2D} p4
 *  @param {Point2D} a1
 *  @param {Point2D} a2
 *  @returns {Intersection}
 */
module.exports.intersectBezier3Line = function(p1, p2, p3, p4, a1, a2) {
    var a, b, c, d;       // temporary variables
    var c3, c2, c1, c0;   // coefficients of cubic
    var cl;               // c coefficient for normal form of line
    var n;                // normal for normal form of line
    var min = a1.min(a2); // used to determine if point is on line segment
    var max = a1.max(a2); // used to determine if point is on line segment
    var result = new Intersection();

    // Start with Bezier using Bernstein polynomials for weighting functions:
    //     (1-t^3)P1 + 3t(1-t)^2P2 + 3t^2(1-t)P3 + t^3P4
    //
    // Expand and collect terms to form linear combinations of original Bezier
    // controls.  This ends up with a vector cubic in t:
    //     (-P1+3P2-3P3+P4)t^3 + (3P1-6P2+3P3)t^2 + (-3P1+3P2)t + P1
    //             /\                  /\                /\       /\
    //             ||                  ||                ||       ||
    //             c3                  c2                c1       c0

    // Calculate the coefficients
    a = p1.multiply(-1);
    b = p2.multiply(3);
    c = p3.multiply(-3);
    d = a.add(b.add(c.add(p4)));
    c3 = new Vector2D(d.x, d.y);

    a = p1.multiply(3);
    b = p2.multiply(-6);
    c = p3.multiply(3);
    d = a.add(b.add(c));
    c2 = new Vector2D(d.x, d.y);

    a = p1.multiply(-3);
    b = p2.multiply(3);
    c = a.add(b);
    c1 = new Vector2D(c.x, c.y);

    c0 = new Vector2D(p1.x, p1.y);

    // Convert line to normal form: ax + by + c = 0
    // Find normal to line: negative inverse of original line's slope
    n = new Vector2D(a1.y - a2.y, a2.x - a1.x);

    // Determine new c coefficient
    cl = a1.x*a2.y - a2.x*a1.y;

    // ?Rotate each cubic coefficient using line for new coordinate system?
    // Find roots of rotated cubic
    var roots = new Polynomial(
        n.dot(c3),
        n.dot(c2),
        n.dot(c1),
        n.dot(c0) + cl
    ).getRoots();

    // Any roots in closed interval [0,1] are intersections on Bezier, but
    // might not be on the line segment.
    // Find intersections and calculate point coordinates
    for ( var i = 0; i < roots.length; i++ ) {
        var t = roots[i];

        if ( 0 <= t && t <= 1 ) {
            // We're within the Bezier curve
            // Find point on Bezier
            var p5 = p1.lerp(p2, t);
            var p6 = p2.lerp(p3, t);
            var p7 = p3.lerp(p4, t);

            var p8 = p5.lerp(p6, t);
            var p9 = p6.lerp(p7, t);

            var p10 = p8.lerp(p9, t);

            // See if point is on line segment
            // Had to make special cases for vertical and horizontal lines due
            // to slight errors in calculation of p10
            if ( a1.x == a2.x ) {
                if ( min.y <= p10.y && p10.y <= max.y ) {
                    result.appendPoint( p10 );
                }
            } else if ( a1.y == a2.y ) {
                if ( min.x <= p10.x && p10.x <= max.x ) {
                    result.appendPoint( p10 );
                }
            } else if (min.x <= p10.x && p10.x <= max.x && min.y <= p10.y && p10.y <= max.y) {
                result.appendPoint( p10 );
            }
        }
    }

    return result;
};


},{"../Intersection":9,"kld-affine":1,"kld-polynomial":5}],12:[function(require,module,exports){
/**
 *
 *  Intersection.js
 *
 *  copyright 2002, 2013 Kevin Lindsey
 *
 *  contribution {@link http://github.com/Quazistax/kld-intersections}
 *      @copyright 2015 Robert Benko (Quazistax) <quazistax@gmail.com>
 *      @license MIT
 */

var Point2D = require('kld-affine').Point2D;
var Vector2D = require('kld-affine').Vector2D;
var Matrix2D = require('kld-affine').Matrix2D;
var Polynomial = require('kld-polynomial').Polynomial;
var IntersectionParams = require('./IntersectionParams');
var Intersection = require('./Intersection');
var bezierIntersectionFunctions = require('./functions/bezier')

var IPTYPE = IntersectionParams.TYPE;



/**
 *  bezout
 *
 *  This code is based on MgcIntr2DElpElp.cpp written by David Eberly.  His
 *  code along with many other excellent examples are avaiable at his site:
 *  http://www.geometrictools.com
 *
 *  @param {Array<Point2D>} e1
 *  @param {Array<Point2D>} e2
 *  @returns {Polynomial}
 */
function bezout(e1, e2) {
    var AB    = e1[0]*e2[1] - e2[0]*e1[1];
    var AC    = e1[0]*e2[2] - e2[0]*e1[2];
    var AD    = e1[0]*e2[3] - e2[0]*e1[3];
    var AE    = e1[0]*e2[4] - e2[0]*e1[4];
    var AF    = e1[0]*e2[5] - e2[0]*e1[5];
    var BC    = e1[1]*e2[2] - e2[1]*e1[2];
    var BE    = e1[1]*e2[4] - e2[1]*e1[4];
    var BF    = e1[1]*e2[5] - e2[1]*e1[5];
    var CD    = e1[2]*e2[3] - e2[2]*e1[3];
    var DE    = e1[3]*e2[4] - e2[3]*e1[4];
    var DF    = e1[3]*e2[5] - e2[3]*e1[5];
    var BFpDE = BF + DE;
    var BEmCD = BE - CD;

    return new Polynomial(
        AB*BC - AC*AC,
        AB*BEmCD + AD*BC - 2*AC*AE,
        AB*BFpDE + AD*BEmCD - AE*AE - 2*AC*AF,
        AB*DF + AD*BFpDE - 2*AE*AF,
        AD*DF - AF*AF
    );
}

/**
    Removes from intersection points those points that are not between two rays determined by arc parameters.
    Rays begin at ellipse center and go through arc startPoint/endPoint.

    @param {Intersection} intersection - will be modified and returned
    @param {Point2D} c - center of arc ellipse
    @param {Number} rx
    @param {Number} ry
    @param {Number} phi - in radians
    @param {Number} th1 - in radians
    @param {Number} dth - in radians
    @param {Matrix2D} [m] - arc transformation matrix
    @returns {Intersection}
*/
function removePointsNotInArc(intersection, c, rx, ry, phi, th1, dth, m) {
    if (intersection.points.length === 0) return intersection;
    if (m && !m.isIdentity())
        var mp = m.inverse();
    var np = [];
    var vx = new Vector2D(1, 0);
    var pi2 = Math.PI * 2;
    var wasNeg = dth < 0;
    var wasBig = Math.abs(dth) > Math.PI;
    var m1 = new Matrix2D().scaleNonUniform(1, ry / rx).rotate(th1);
    var m2 = new Matrix2D().scaleNonUniform(1, ry / rx).rotate(th1 + dth);

    th1 = (vx.angleBetween(vx.transform(m1)) + pi2) % pi2;
    dth = vx.transform(m1).angleBetween(vx.transform(m2));
    dth = (wasBig ? pi2 - Math.abs(dth) : Math.abs(dth)) * (wasNeg ? -1 : 1);
    var m3 = new Matrix2D().rotate(phi).multiply(m1);

    for (var i = 0, p, a; i < intersection.points.length; i++) {
        p = intersection.points[i];
        a = vx.transform(m3).angleBetween(Vector2D.fromPoints(c, (mp) ? p.transform(mp) : p));
        if (dth >= 0) {
            a = (a + 2 * pi2) % pi2;
            if (a <= dth)
                np.push(p);
        } else {
            a = (a - 2 * pi2) % pi2;
            if (a >= dth)
                np.push(p);
        }
    }
    intersection.points = np;
    return intersection;
};

/**
    points1 will be modified, points close (almost identical) to any point in points2 will be removed

    @param {Array<Point2D>} points1 - will be modified, points close to any point in points2 will be removed
    @param {Array<Point2D>} points2
*/
function removeClosePoints(points1, points2) {
    if (points1.length === 0 || points2.length === 0)
        return;
    var maxf = function (p, v) { if (p < v.x) p = v.x; if (p < v.y) p = v.y; return p; };
    var max = points1.reduce(maxf, 0);
    max = points2.reduce(maxf, max);
    var ERRF = 1e-15;
    var ZEROepsilon = 100 * max * ERRF * Math.SQRT2;
    var j;
    for (var i = 0; i < points1.length;) {
        for (j = 0; j < points2.length; j++) {
            if (points1[i].distanceFrom(points2[j]) <= ZEROepsilon) {
                points1.splice(i, 1);
                break;
            }
        }
        if (j == points2.length)
            i++;
    }
}

var intersectionFunctions = {

    /**
        intersectPathShape

        @param {IntersectionParams} path
        @param {IntersectionParams} shape
        @param {Matrix2D} [m1]
        @param {Matrix2D} [m2]
        @returns {Intersection}
    */
    intersectPathShape: function (path, shape, m1, m2) {
        var result = new Intersection();
        var pathParams = path.params[0];
        var inter0;
        var previnter;
        for (var inter, i = 0; i < pathParams.length; i++) {
            inter = intersect(pathParams[i], shape, m1, m2);
            if (!inter0)
                inter0 = inter;
            if (previnter) {
                removeClosePoints(previnter.points, inter.points);
                result.appendPoints(previnter.points);
            }
            previnter = inter;
        }
        if (previnter) {
            result.appendPoints(previnter.points);
        }
        return result;
    },


    /**
        intersectLinesShape

        @param {IntersectionParams} lines - IntersectionParams with points as first parameter (like types RECT, POLYLINE or POLYGON)
        @param {IntersectionParams} shape - IntersectionParams of other shape
        @param {Matrix2D} [m1]
        @param {Matrix2D} [m2]
        @param {Boolean} [closed] - if set, determines if line between first and last point will be taken into callculation too. If not set, it's true for RECT and POLYGON, false for other <b>lines</b> types.
        @returns {Intersection}
    */
    intersectLinesShape: function (lines, shape, m1, m2, closed) {
        var IPTYPE = IntersectionParams.TYPE;
        var line_points = lines.params[0];
        var ip = new IntersectionParams(IPTYPE.LINE, [0, 0]);
        var result = new Intersection();
        var inter, i;
        var intersectLine = function (i1, i2) {
            ip.params[0] = line_points[i1];
            ip.params[1] = line_points[i2];
            inter = intersect(ip, shape, m1, m2);
            removeClosePoints(inter.points, [line_points[i2]]);
            result.appendPoints(inter.points);
        }
        for (i = 0; i < line_points.length - 1; i++) {
            intersectLine(i, i + 1);
        }
        if (typeof closed !== 'undefined' && closed || lines.type === IPTYPE.RECT || lines.type === IPTYPE.POLYGON) {
            intersectLine(line_points.length - 1, 0);
        }
        return result;
    },

    ///////////////////////////////////////////////////////////////////
    /**
        intersectArcShape

        @param {IntersectionParams} arc
        @param {IntersectionParams} shape
        @param {Matrix2D} [m1]
        @param {Matrix2D} [m2]
        @returns {Intersection}
    */
    intersectArcShape: function (arc, shape, m1, m2) {
        m1 = m1 || Matrix2D.IDENTITY;
        m2 = m2 || Matrix2D.IDENTITY;
        var c1 = arc.params[0],
            rx1 = arc.params[1],
            ry1 = arc.params[2],
            phi1 = arc.params[3],
            th1 = arc.params[4],
            dth1 = arc.params[5];

        var res;
        if (m1.isIdentity() && phi1 === 0) {
            res = intersect(IntersectionParams.newEllipse(c1, rx1, ry1), shape, m1, m2);
        }
        else {
            m1 = m1.multiply(Matrix2D.IDENTITY.translate(c1.x, c1.y).rotate(phi1));
            c1 = new Point2D(0, 0);
            phi1 = 0;
            res = intersect(IntersectionParams.newEllipse(c1, rx1, ry1), shape, m1, m2);
        }
        res = removePointsNotInArc(res, c1, rx1, ry1, phi1, th1, dth1, m1);
        return res;
    },

    /**
     *  Finds intersection points of two ellipses. <br/>
     *
     *  This code is based on MgcIntr2DElpElp.cpp written by David Eberly. His
     *  code along with many other excellent examples are avaiable at his site:
     *  http://www.geometrictools.com
     *
     *  Changes - 2015 Robert Benko (Quazistax)
     *
     *  @param {Point2D} c1
     *  @param {Number} rx1
     *  @param {Number} ry1
     *  @param {Point2D} c2
     *  @param {Number} rx2
     *  @param {Number} ry2
     *  @returns {Intersection}
     */
    intersectEllipseEllipse: function (c1, rx1, ry1, c2, rx2, ry2) {
        var a = [
            ry1 * ry1, 0, rx1 * rx1, -2 * ry1 * ry1 * c1.x, -2 * rx1 * rx1 * c1.y,
            ry1 * ry1 * c1.x * c1.x + rx1 * rx1 * c1.y * c1.y - rx1 * rx1 * ry1 * ry1
        ];
        var b = [
            ry2 * ry2, 0, rx2 * rx2, -2 * ry2 * ry2 * c2.x, -2 * rx2 * rx2 * c2.y,
            ry2 * ry2 * c2.x * c2.x + rx2 * rx2 * c2.y * c2.y - rx2 * rx2 * ry2 * ry2
        ];

        var yPoly = bezout(a, b);
        var yRoots = yPoly.getRoots();
        var epsilon = 1e-3;
        var norm0 = (a[0] * a[0] + 2 * a[1] * a[1] + a[2] * a[2]) * epsilon;
        var norm1 = (b[0] * b[0] + 2 * b[1] * b[1] + b[2] * b[2]) * epsilon;
        var result = new Intersection();

        var i;
        //Handling root calculation error causing not detecting intersection
        var clip = function (val, min, max) { return Math.max(min, Math.min(max, val)); };
        for (i = 0 ; i < yRoots.length; i++) {
            yRoots[i] = clip(yRoots[i], c1.y - ry1, c1.y + ry1);
            yRoots[i] = clip(yRoots[i], c2.y - ry2, c2.y + ry2);
        }

        //For detection of multiplicated intersection points
        yRoots.sort(function (a, b) { return a - b; });
        var rootPointsN = [];

        for (var y = 0; y < yRoots.length; y++) {
            var xPoly = new Polynomial(
                a[0],
                a[3] + yRoots[y] * a[1],
                a[5] + yRoots[y] * (a[4] + yRoots[y] * a[2])
            );
            var ERRF = 1e-15;
            if (Math.abs(xPoly.coefs[0]) < 10 * ERRF * Math.abs(xPoly.coefs[2]))
                xPoly.coefs[0] = 0;
            var xRoots = xPoly.getRoots();

            rootPointsN.push(0);
            for (var x = 0; x < xRoots.length; x++) {
                var test =
                    (a[0] * xRoots[x] + a[1] * yRoots[y] + a[3]) * xRoots[x] +
                    (a[2] * yRoots[y] + a[4]) * yRoots[y] + a[5];
                if (Math.abs(test) < norm0) {
                    test =
                        (b[0] * xRoots[x] + b[1] * yRoots[y] + b[3]) * xRoots[x] +
                        (b[2] * yRoots[y] + b[4]) * yRoots[y] + b[5];
                    if (Math.abs(test) < norm1) {
                        result.appendPoint(new Point2D(xRoots[x], yRoots[y]));
                        rootPointsN[y] += 1;
                    }
                }
            }
        }

        if (result.points.length <= 0)
            return result;

        //Removal of multiplicated intersection points
        var pts = result.points;
        if (pts.length == 8) {
            pts = pts.splice(0, 6);
            pts.splice(2, 2);
        }
        else if (pts.length == 7) {
            pts = pts.splice(0, 6);
            pts.splice(2, 2);
            pts.splice(rootPointsN.indexOf(1), 1);
        }
        else if (pts.length == 6) {
            pts.splice(2, 2);
            //console.log('ElEl 6pts: N: ' + rootPointsN.toString());
            if (rootPointsN.indexOf(0) > -1) {
                if (pts[0].distanceFrom(pts[1]) < pts[2].distanceFrom(pts[3])) {
                    pts.splice(0, 1);
                }
                else {
                    pts.splice(2, 1);
                }
            }
            else if (rootPointsN[0] == rootPointsN[3]) {
                pts.splice(1, 2);
            }
        }
        else if (pts.length == 4) {
            if (
                (yRoots.length == 2)
            || (yRoots.length == 4 && (rootPointsN[0] == 2 && rootPointsN[1] == 2 || rootPointsN[2] == 2 && rootPointsN[3] == 2))
            ) {
                pts.splice(2, 2);
            }
        }
        else if (pts.length == 3 || pts.length == 5) {
            i = rootPointsN.indexOf(2);
            if (i > -1) {
                if (pts.length == 3)
                    i = i % 2;
                var ii = i + (i % 2 ? -1 : 2);
                var d1, d2, d3;
                d1 = pts[i].distanceFrom(pts[i + 1]);
                d2 = pts[i].distanceFrom(pts[ii]);
                d3 = pts[i + 1].distanceFrom(pts[ii]);
                if (d1 < d2 && d1 < d3) {
                    pts.splice(i, 1);
                }
                else {
                    pts.splice(ii, 1);
                }
            }
        }

        var poly = yPoly;
        var ZEROepsilon = yPoly.zeroErrorEstimate();
        ZEROepsilon *= 100 * Math.SQRT2;
        for (i = 0; i < pts.length - 1;) {
            if (pts[i].distanceFrom(pts[i + 1]) < ZEROepsilon) {
                pts.splice(i + 1, 1);
                continue;
            }
            i++;
        }

        result.points = pts;
        return result;
    },


    /**
     *  intersectEllipseLine
     *
     *  NOTE: Rotation will need to be added to this function
     *
     *  @param {Point2D} c
     *  @param {Number} rx
     *  @param {Number} ry
     *  @param {Point2D} a1
     *  @param {Point2D} a2
     *  @returns {Intersection}
     */
    intersectEllipseLine: function(c, rx, ry, a1, a2) {
        var result;
        var origin = new Vector2D(a1.x, a1.y);
        var dir    = Vector2D.fromPoints(a1, a2);
        var center = new Vector2D(c.x, c.y);
        var diff   = origin.subtract(center);
        var mDir   = new Vector2D( dir.x/(rx*rx),  dir.y/(ry*ry)  );
        var mDiff  = new Vector2D( diff.x/(rx*rx), diff.y/(ry*ry) );

        var a = dir.dot(mDir);
        var b = dir.dot(mDiff);
        var c = diff.dot(mDiff) - 1.0;
        var d = b*b - a*c;

        var ERRF = 1e-15;
        var ZEROepsilon = 10 * Math.max(Math.abs(a), Math.abs(b), Math.abs(c)) * ERRF;
        if (Math.abs(d) < ZEROepsilon) {
            d = 0;
        }

        if ( d < 0 ) {
            result = new Intersection("Outside");
        } else if ( d > 0 ) {
            var root = Math.sqrt(d);
            var t_a  = (-b - root) / a;
            var t_b  = (-b + root) / a;

            t_b = (t_b > 1) ? t_b - ERRF : (t_b < 0) ? t_b + ERRF : t_b;
            t_a = (t_a > 1) ? t_a - ERRF : (t_a < 0) ? t_a + ERRF : t_a;

            if ( (t_a < 0 || 1 < t_a) && (t_b < 0 || 1 < t_b) ) {
                if ( (t_a < 0 && t_b < 0) || (t_a > 1 && t_b > 1) )
                    result = new Intersection("Outside");
                else
                    result = new Intersection("Inside");
            } else {
                result = new Intersection();
                if ( 0 <= t_a && t_a <= 1 )
                    result.appendPoint( a1.lerp(a2, t_a) );
                if ( 0 <= t_b && t_b <= 1 )
                    result.appendPoint( a1.lerp(a2, t_b) );
            }
        } else {
            var t = -b/a;
            if ( 0 <= t && t <= 1 ) {
                result = new Intersection();
                result.appendPoint( a1.lerp(a2, t) );
            } else {
                result = new Intersection("Outside");
            }
        }

        return result;
    },


    /**
     *  intersectLineLine
     *
     *  @param {Point2D} a1
     *  @param {Point2D} a2
     *  @param {Point2D} b1
     *  @param {Point2D} b2
     *  @returns {Intersection}
     */
    intersectLineLine: function(a1, a2, b1, b2) {
        var result;
        var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
        var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
        var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

        if ( u_b !== 0 ) {
            var ua = ua_t / u_b;
            var ub = ub_t / u_b;

            if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
                result = new Intersection();
                result.points.push(
                    new Point2D(
                        a1.x + ua * (a2.x - a1.x),
                        a1.y + ua * (a2.y - a1.y)
                    )
                );
            } else {
                result = new Intersection();
            }
        } else {
            if ( ua_t === 0 || ub_t === 0 ) {
                result = new Intersection("Coincident");
            } else {
                result = new Intersection("Parallel");
            }
        }

        return result;
    },


    /**
     *  intersectRayRay
     *
     *  @param {Point2D} a1
     *  @param {Point2D} a2
     *  @param {Point2D} b1
     *  @param {Point2D} b2
     *  @returns {Intersection}
     */
    intersectRayRay: function(a1, a2, b1, b2) {
        var result;

        var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
        var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
        var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

        if ( u_b !== 0 ) {
            var ua = ua_t / u_b;

            result = new Intersection();
            result.points.push(
                new Point2D(
                    a1.x + ua * (a2.x - a1.x),
                    a1.y + ua * (a2.y - a1.y)
                )
            );
        } else {
            if ( ua_t === 0 || ub_t === 0 ) {
                result = new Intersection("Coincident");
            } else {
                result = new Intersection("Parallel");
            }
        }

        return result;
    }
};

var composedShapeMethods = {};
composedShapeMethods[IPTYPE.PATH] = intersectionFunctions.intersectPathShape;
composedShapeMethods[IPTYPE.POLYLINE] = intersectionFunctions.intersectLinesShape;
composedShapeMethods[IPTYPE.POLYGON] = intersectionFunctions.intersectLinesShape;
composedShapeMethods[IPTYPE.RECT] = intersectionFunctions.intersectLinesShape;
composedShapeMethods[IPTYPE.ROUNDRECT] = intersectionFunctions.intersectPathShape;
composedShapeMethods[IPTYPE.ARC] = intersectionFunctions.intersectArcShape;



function intersect(shape1, shape2, m1, m2) {
    var ip1 = shape1;
    var ip2 = shape2;
    var result;

    if (ip1 !== null && ip2 !== null) {
        var method;
        if (method = composedShapeMethods[ip1.type]) {
            result = method(ip1, ip2, m1, m2);
        }
        else if (method = composedShapeMethods[ip2.type]) {
            result = method(ip2, ip1, m2, m1);
        }
        else {
            var params;

            var params1, params2, type1, type2;

            if (ip1.type === IPTYPE.CIRCLE) {
                params1 = [ip1.params[0], ip1.params[1], ip1.params[1]];
                type1 = IPTYPE.ELLIPSE;
            }
            else {
                params1 = ip1.params.slice();
                type1 = ip1.type;
            }

            if (ip2.type === IPTYPE.CIRCLE) {
                params2 = [ip2.params[0], ip2.params[1], ip2.params[1]];
                type2 = IPTYPE.ELLIPSE;
            }
            else {
                params2 = ip2.params.slice();
                type2 = ip2.type;
            }

            //var m1 = new Matrix2D(), m2 = new Matrix2D();
            var SMF = 1;
            var itm;
            var useCTM = (m1 instanceof Matrix2D && m2 instanceof Matrix2D);// && (!m1.isIdentity() || !m2.isIdentity()));
            if (useCTM) {
                if (type1 === IPTYPE.ELLIPSE && type2 === IPTYPE.ELLIPSE) {
                    var m1_, m2_;
                    var d2;
                    var c1 = params1[0], rx1 = params1[1], ry1 = params1[2];
                    var c2 = params2[0], rx2 = params2[1], ry2 = params2[2];

                    m1 = m1.multiply(Matrix2D.IDENTITY.translate(c1.x, c1.y).scaleNonUniform(rx1 / SMF, ry1 / SMF));
                    c1 = new Point2D(0, 0);
                    rx1 = ry1 = SMF;

                    m2 = m2.multiply(Matrix2D.IDENTITY.translate(c2.x, c2.y).scaleNonUniform(rx2, ry2));
                    c2 = new Point2D(0, 0);
                    rx2 = ry2 = 1;

                    d2 = m1.inverse().multiply(m2).getDecomposition();
                    m1_ = d2.rotation.inverse().multiply(d2.translation.inverse());
                    m2_ = d2.scale;

                    rx2 = m2_.a;
                    ry2 = m2_.d;
                    c1 = c1.transform(m1_);
                    itm = m1.multiply(m1_.inverse());

                    params1[0] = c1;
                    params1[1] = rx1;
                    params1[2] = ry1;
                    params2[0] = c2;
                    params2[1] = rx2;
                    params2[2] = ry2;
                }
                else {
                    var transParams = function (type, params, m) {
                        var transParam = function (i) {
                            params[i] = params[i].transform(m);
                        }

                        if (type === IPTYPE.LINE) {
                            transParam(0);
                            transParam(1);
                        }
                        else if (type === IPTYPE.BEZIER2) {
                            transParam(0);
                            transParam(1);
                            transParam(2);
                        }
                        else if (type === IPTYPE.BEZIER3) {
                            transParam(0);
                            transParam(1);
                            transParam(2);
                            transParam(3);
                        }
                        else {
                            throw new Error('Unknown shape: ' + type);
                        }
                    }

                    if (type2 === IPTYPE.ELLIPSE) {
                        var tmp;
                        tmp = params2; params2 = params1; params1 = tmp;
                        tmp = type2; type2 = type1; type1 = tmp;
                        tmp = m2; m2 = m1; m1 = tmp;
                    }

                    if (type1 === IPTYPE.ELLIPSE) {
                        var c1 = params1[0], rx1 = params1[1], ry1 = params1[2];

                        m1 = m1.multiply(Matrix2D.IDENTITY.translate(c1.x, c1.y).scaleNonUniform(rx1 / SMF, ry1 / SMF));
                        c1 = new Point2D(0, 0);
                        rx1 = ry1 = SMF;

                        m2_ = m1.inverse().multiply(m2);
                        transParams(type2, params2, m2_);

                        itm = m1;

                        params1[0] = c1;
                        params1[1] = rx1;
                        params1[2] = ry1;
                    }
                    else {
                        transParams(type1, params1, m1);
                        transParams(type2, params2, m2);
                        itm = Matrix2D.IDENTITY;
                    }
                }
            }

            if (type1 < type2) {
                method = "intersect" + type1 + type2;
                params = params1.concat(params2);
            } else {
                method = "intersect" + type2 + type1;
                params = params2.concat(params1);
            }

            result = intersectionFunctions[method].apply(null, params);

            if (useCTM) {
                for (var i = 0; i < result.points.length; i++) {
                    result.points[i] = result.points[i].transform(itm);
                }
            }
        }
    } else {
        result = new Intersection();
    }

    return result;
}

for(var key in bezierIntersectionFunctions) {
    if(bezierIntersectionFunctions.hasOwnProperty(key)) {
        intersectionFunctions[key] = bezierIntersectionFunctions[key];
    }
}

module.exports = intersect;

},{"./Intersection":9,"./IntersectionParams":10,"./functions/bezier":11,"kld-affine":1,"kld-polynomial":5}]},{},[8])(8)
});


/***/ }),

/***/ "./styles.css":
/*!********************!*\
  !*** ./styles.css ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./order.js":
/*!******************!*\
  !*** ./order.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Order)
/* harmony export */ });
/* harmony import */ var _intersections_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./intersections.js */ "./intersections.js");
/* harmony import */ var _intersections_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_intersections_js__WEBPACK_IMPORTED_MODULE_0__);


class Order {
    // od kdy se zacne jedno osa priblizovat k druhe, nebo jedna oddalovat od druhe
    pathShift = 50;
    // rozdil mezi umistenim os
    diff = 150;
    //
    connShift = 25;
    // minimalni datum
    min = 0;
    // maximalni datum
    max = 0;
    // zatim budou take nekonecne vsechny, TODO: dodelat metody makePathI... makePathOther
    extend = 30000;

    constructor(context) {
        this.context = context;
    }

    // vrat element, ktery byl umisten jako prvni do vizualizace
    getMinIdxFrom(common, placedCommon) {
        return placedCommon.indexOf(common.reduce((prev, curr) => {
            let prevI = placedCommon.indexOf(prev);
            let currI = placedCommon.indexOf(curr);
            let res;
            if (prevI === -1 && currI === -1)
                res = prev;
            else if (prevI !== -1 && currI === -1 || prevI === -1 && currI !== -1)
                res = (prevI === -1) ? curr : prev;
            else
                res = (prevI < currI) ? prev : curr;
            return res;
        }));
    }

    // Z dat typu predmet osobnost zvire udela specialne cesty
    makePathItemPerson() {

    }
    // pro vsechny ostatni tagy
    makePathOther() {

    }

    // vytvor osu na zaklade udalosti, ktere se na ni odehravaji a jejich souvislosti s ostatnimi osami
    makePathEvents(item, levels, names, start, datum, events, commonEvents) {
        // projdi vsechny udalosti dane osy
        for (let event of item.events) {
            // zjisti s kym souvisi a jeste neni umisten
            let common = event.filters.map((item) => item.name);
            // souvisi s temito umistenymi
            let placedCommon = levels.map((item) => item.name);
            // minimalni index, ke kteremu se priblizi dana osa ve zkoumane udalosti
            let minIdx = this.getMinIdxFrom(common, placedCommon);
            // vytvor prislusny event
            let tmpEv = {
                id: event.id,
                name: event.name,
                desc: event.description,
                icon: event.icon.path,
                filters: common,
                cls: item.name,
                bck_x: event.begin,
                y: undefined
            }
            // sdili nekdo kdo uz je umisten tuto udalost? A nekdo z cekajicich? NE| nikdo z umistenych ani cekajicich ji nema
            if (common.some(r => placedCommon.indexOf(r) >= 0)) {
                // delka dane udalosti
                let dur = event.end !== undefined ? event.end - event.begin : 1;
                // kterym smerem je nutne poslat osu
                let dir = (levels[minIdx].start > start ? -1 : 1);
                // zkonstruuj oblouk
                datum.push(
                    {x: event.begin - this.pathShift, y: start},
                    {x: event.begin, y: levels[minIdx].start + dir * this.connShift},
                    {x: event.begin + dur, y: levels[minIdx].start + dir * this.connShift},
                    {x: event.begin + dur + this.pathShift, y: start});
                // uprav konec a zacatek osy
                if (event.begin + this.pathShift > this.max)
                    this.max = event.begin + this.pathShift;
                if (event.begin - this.pathShift < this.min)
                    this.min = event.begin - this.pathShift;
                // pri umisteni udalosti bude jine y, protoze uz ji nekdo se mnou sdili a ja se musim dostat k nemu
                if ((!common.some(r => names.indexOf(r) >= 0))) {
                    let yShift = levels[minIdx].start + ((dir === -1) ? dir * this.connShift * 3 : this.connShift);
                    let res = commonEvents.find((el) => el.x === tmpEv.begin && el.y === yShift && el.id !== event.id);
                    tmpEv.y = yShift;
                    if (res === undefined)
                        commonEvents.push({x:event.begin, y:yShift, eventlist:[tmpEv]});
                    else
                        res.eventlist.push(tmpEv);
                }
            }
            else {// nic spolecneho
                // pokud neni zadny dalsi spolecny umisti, jinak nech na dalsim
                if (!common.some(r => names.indexOf(r) >= 0)) {
                    tmpEv.y = start - this.connShift;
                    events.push(tmpEv);
                }
            }
        }
    }

// vezme predavana data a udela prubeh cesty pro jednotlive osy, pokud maji alespon nejake udalosti
    makeView() {
        // pole udalosti
        let events = [];
        // pole urovni jednotlivych casovych os
        let levels = [];
        // kde se ma zacit
        let start = d3.select(".canvasDraw").node().clientHeight / 2;
        // spolecne udalosti
        let commonEvents = [];
        // poradi pro prohazovani os
        this.context.activeOrder = [];
        // seznam jmen os, ktere se budou vykreslovat
        let names = this.context.active.map((item) => item.name);
        // projdi vsechy aktivni osy
        for (let [idx,item] of this.context.active.entries()) {
            // zjisti zacatky a konce
            this.min = this.context.minDate - this.pathShift;
            this.max = this.context.maxDate + this.pathShift;
            // odstran z cekajicich na zpracovani
            names.splice(names.indexOf(item.name), 1);
            // kde bude dana osa zacinat?
            start += (((idx % 2) === 0) ? idx : -idx) * this.diff;
            // pridej danou osu do pole na prohazovani
            (idx % 2) === 0 ? this.context.activeOrder.push(item.clsName) : this.context.activeOrder.unshift(item.clsName);
            // urci pocatecni bod casove osy
            let datum = [{x: this.min - this.extend, y: start}];
            // projdi eventy a zjisti jak je spravne umistit
            this.makePathEvents(item, levels, names, start, datum, events, commonEvents);
            // vloz posledni bod casove osy
            datum.push({x: this.max + this.extend, y: start});
            // uloz vsechny dulezite casti do levels
            levels.push({name: item.name, clsName: item.clsName, start: start, datum: datum, color: item.color, imgPath:item.iconPath});
        }
        return {paths: levels, events: events, commonEvents: commonEvents};
    }
//----------------------------------------------------------------------------------------------------------------------
    // metoda pro nahodne poradi os
    randomOrder(b) {
        this.context.updateScales();
        const entriesCount = this.context.active.length;
        let idxs = [...Array(entriesCount).keys()];
        idxs = this.context.shuffelArray(idxs);
        this.context.active = idxs.map(i => this.context.active[i]);
        b.drawRes(this.makeView());
    }
//----------------------------------------------------------------------------------------------------------------------
    // vezme pole indexu a vrati vsechny mozne permutace
    permutate(idxArray, idxCount) {
        let c = new Array(idxCount).fill(0);
        let res = [[...idxArray]];
        let i = 1;
        while (i < idxCount) {
            if (c[i] < i) {
                if (i % 2 === 0)
                    [idxArray[0], idxArray[i]] = [idxArray[i], idxArray[0]];
                else
                    [idxArray[c[i]], idxArray[i]] = [idxArray[i], idxArray[c[i]]];
                res.push([...idxArray]);
                c[i]++;
                i = 1;
            } else {
                c[i] = 0;
                i++;
            }
        }
        return res;
    }

    // spocti kolik maji zadane osy pruseciku
    getNumberOfIntersection(data) {
        let paths = data.map(item => item.datum);
        let pairs = [];
        let numInt = 0;
        // ziskej vsechny dvojice
        for (let i = 0; i < paths.length; i++)
            for (let j = i + 1; j < paths.length; j++)
                pairs.push([i,j]);
        // spocitej vsechny pruseciky
        for (let [i,j] of pairs){
            let res = _intersections_js__WEBPACK_IMPORTED_MODULE_0__.intersect(_intersections_js__WEBPACK_IMPORTED_MODULE_0__.shape("path", {d: this.context.area(paths[i])}),
                _intersections_js__WEBPACK_IMPORTED_MODULE_0__.shape("path", {d: this.context.area(paths[j])}));
            numInt += res.points.length;
        }
        return numInt;
    }

    // metoda pro zjisteni optimalniho poradi os, brute force verze
    bruteForceOrder(b) {
        this.context.updateScales();
        const entriesCount = this.context.active.length;
        const idxs = [...Array(entriesCount).keys()];
        const permutations = this.permutate(idxs, entriesCount);
        // obsahuje nejlepsi permutaci v poctu krizeni
        let bestPerm = undefined;
        // zjisti ktera permutace ma nejmene pruniku
        for (let perm of permutations) {
            // mam nove poradi
            this.context.active = perm.map(r => this.context.active[r]);
            // zjisti prubeh cest pro dane poradi
            let tmpPaths = this.makeView(this.context.active);
            // zjisti # pruseciku pro aktualni prubehy
            let numInt = this.getNumberOfIntersection(tmpPaths.paths);
            // console.log(perm, numInt);
            // urci novnou nejlepsi permutaci nebo zachovej puvodni
            if (bestPerm === undefined || bestPerm.numInt > numInt)
                bestPerm = {numInt: numInt, perm: perm, res: tmpPaths};
        }
        // zprehazej osy
        this.context.active = bestPerm.perm.map(r => this.context.active[r]);
        // vykresli
        b.drawRes(bestPerm.res);
    }

//----------------------------------------------------------------------------------------------------------------------
    // vytvor vztahy mezi osami
    getEdges(filtEvents, names) {
        // vysledne hrany
        let edges = []
        // projdi udalosti
        filtEvents.forEach( event => {
            let filters = event.filters.map( item => item.name);
            // projdi filtry a vytvor spojnice
            filters.forEach( (source) => {
                filters.forEach( (target) => {
                    if (source !== target && names.indexOf(source) !== -1 && names.indexOf(target) !== -1) {
                        edges.push({"source":names.indexOf(source), "target":names.indexOf(target)});
                    }
                })
            })
        });
        return edges;
    }

    // ziskej vsechny eventy a nech za kazdy duplicitni jen jeden
    getEvents(buffer) {
        let events = buffer.map(r => r.events).flat();
        events = events.filter((value, index, self) => index === self.findIndex(
            (t) => t.place === value.place && t.id === value.id));
        return events;
    }

    // vytvor frekvencni tabulku
    makeFrequencyTable(names) {
        // data frekvenci vyskytu
        let freqData = [];
        // ziskej vsechny eventy
        let filtEvents = this.getEvents(this.context.active);
        // vytvor frekvencni tabulku pro dane osy
        this.context.active.forEach((item) => freqData.push({"idx": this.context.active.indexOf(item), "freq": Array(names.length + 1).fill(0)}));
        // najdi spojeni os
        let edges = this.getEdges(filtEvents, names);
        // spocitej frekvence
        edges.forEach(item => {freqData[item.source].freq[item.target]++; freqData[item.target].freq[names.length]++});
        return freqData;
    }

    // frekvencni metoda
    frequencyTable(b) {
        // zaktualizuj rozsahy
        this.context.updateScales();
        // console.log(this.context.active);
        // nacti jmena
        const names = this.context.active.map((item) => item.name);
        // pole 2d s nulami, v datech a jmena budou jmena z this.context.active
        let freqData = this.makeFrequencyTable(names);
        // serazeni vysledne tabulky
        freqData.sort((a,b) => {
            if (a.freq[names.length] < b.freq[names.length])
                return 1;
            else if (a.freq[names.length] === b.freq[names.length]) {
                for (let idx = 0; idx < names.length; idx++)
                    if (a.freq[idx] !== b.freq[idx] && freqData.indexOf(a) !== idx && freqData.indexOf(b) !== idx)
                        return a.freq[idx] > b.freq[idx];
            }
            else
                return -1
        });
        // vytvor nove poradi a aplikuj ho
        const order = freqData.map( (item) => item.idx);
        this.context.active = order.map(i => this.context.active[i]);
        // zjisti prubeh cest pro dane poradi a vykresli
        b.drawRes(this.makeView());
    }
//----------------------------------------------------------------------------------------------------------------------
    // vrat nahodne cislo mezi min a max
    getRndNumber(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
    // https://observablehq.com/@ben-tanen/a-tutorial-to-using-d3-force-from-someone-who-just-learned-ho

    // pomocna funkce pro vizualizaci prace silove metody
    drawNodes = (svg, node_data, edge_data) => {
        let edge = null;
        if (edge_data) {
            edge = svg.selectAll(".edge")
                .data(edge_data).enter()
                .append("line")
                .classed("edge", true)
                .attr("x1", d => node_data[d.source].x)
                .attr("y1", d => node_data[d.source].y)
                .attr("x2", d => node_data[d.target].x)
                .attr("y2", d => node_data[d.target].y)
                .style("stroke", "#bbb");
        }

        const node = svg.selectAll(".node")
            .data(node_data).enter()
            .append("circle")
            .classed("node", true)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", "10");

        return [node, edge];
    }

    //https://stackoverflow.com/questions/13463053/calm-down-initial-tick-of-a-force-layout
    //https://www.airpair.com/javascript/posts/d3-force-layout-internals
    //https://stackoverflow.com/questions/39379299/how-do-you-customize-the-d3-link-strength-as-a-function-of-the-links-and-nodes-c
    //https://stackoverflow.com/questions/14407069/how-find-out-if-force-layout-done-placing-the-nodes
    // autolayout,layered digraph layout, silova metoda s vyuzitim knihovny d3
    forceMethod(b) {
        // aktualizace rozmeru
        this.context.updateScales();
        // ziskej pritomne osy
        const names = this.context.active.map((item) => item.name);
        // jednotlive osy jako uzly
        let nodes = [];
        // vytvor reprezentaci uzlu
        names.forEach(item => nodes.push({"id":item.index, "x": 150, "y":this.getRndNumber(200,600)}));
        // ziskej zaklad techto uzlu
        let freqData = this.makeFrequencyTable(names);
        // spojnice mezi uzly
        let links = [];
        for (let i = 0; i < names.length; i++) {
            for (let j = i + 1; j < names.length; j++) {
                if (freqData[i].freq[j])
                    links.push({source: i, target: j, weight: freqData[i].freq[j]});
            }
        }
        // urci vahy jednotlivych spoju
        let weightScale = d3.scaleLinear()
            .domain(d3.extent(links,  (d) => { return d.weight }))
            .range([.1, 1])
        // zacni simulaci
        d3.forceSimulation().nodes(nodes)
            .force("link",d3.forceLink(links).strength((e) => weightScale(e.weight)).distance(0))
            .force("x", d3.forceX(150))
            .force("collide", d3.forceCollide().radius(10))
            .force("charge", d3.forceManyBody().strength(1))
            .on("end", () => { // po skonceni udelej nasledujici
                // serad uzly dle y
                nodes.sort((a,b) => a.y - b.y);
                // ziskej dane poradi
                const order = nodes.map(item => item.index);
                // na jeho zaklade uprav aktivni uzly
                this.context.active = order.map(i => this.context.active[i]);
                // zjisti prubeh cest pro dane poradi a vykresli
                b.drawRes(this.makeView());
            });
    }
}


/***/ }),

/***/ "./img/add.png":
/*!*********************!*\
  !*** ./img/add.png ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ea173d9e64c008dd274d.png";

/***/ }),

/***/ "./img/asterionrpg.png":
/*!*****************************!*\
  !*** ./img/asterionrpg.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "16f0522a0fcf41367022.png";

/***/ }),

/***/ "./img/delete.png":
/*!************************!*\
  !*** ./img/delete.png ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "eae2b997bc7cd8d6f454.png";

/***/ }),

/***/ "./img/discord.png":
/*!*************************!*\
  !*** ./img/discord.png ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "667df059ddf407979d68.png";

/***/ }),

/***/ "./img/group.png":
/*!***********************!*\
  !*** ./img/group.png ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "11b155596f538bb35fa8.png";

/***/ }),

/***/ "./img/help.png":
/*!**********************!*\
  !*** ./img/help.png ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8723143bca4c2d5b26c1.png";

/***/ }),

/***/ "./img/remove.png":
/*!************************!*\
  !*** ./img/remove.png ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5ac95bba9400fe31bb36.png";

/***/ }),

/***/ "./img/selection.png":
/*!***************************!*\
  !*** ./img/selection.png ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2706ff2394c6059a891e.png";

/***/ }),

/***/ "./img/smallArrow.png":
/*!****************************!*\
  !*** ./img/smallArrow.png ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "982cc6948f5cd7af3b90.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./styles.css");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context.js */ "./context.js");
/* harmony import */ var _build_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./build.js */ "./build.js");
/* harmony import */ var _order_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./order.js */ "./order.js");
/* harmony import */ var _communication_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./communication.js */ "./communication.js");
/* harmony import */ var _currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./currentVer/DateUtils.js */ "./currentVer/DateUtils.js");







// Tento soubor obsahuje veskera zpetna volani
// nastav potrebne promenne pro vsechny casti interakci
// aktualni vyber
let selection = null;
// ovladani z klavesnice
let keys = {shift: false, ctrl:false, up: false, down: false, d:false, a:false, esc:false};
// promenna drzici veskere potrebne informace
let context = new _context_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
// vypocty poradi os
let order = new _order_js__WEBPACK_IMPORTED_MODULE_3__["default"](context);
// vystavba cele vizualizace
let build = new _build_js__WEBPACK_IMPORTED_MODULE_2__["default"](context, order);
// komunikace se serverem
let comm = new _communication_js__WEBPACK_IMPORTED_MODULE_4__["default"](context);
// modalni okno
let modal = build.getElement("#modal_menu");
let modalActive = false;

// nastaveni callbacku
build.setCallBack(".form_control"
    ,"keyup", (e) => {
    if (e.key !== "Escape" && e.key !== "ArrowUp" && e.key !== "ArrowDown"
        && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Enter")
        comm.searchCats();
});

//callback pro klávesnici/klávesové zkratky
build.setCallBack(".dropdown","keyup", dropDownKeys);
build.setCallBack("#modal_menu","keyup", (e) => {
    if (e.key === "Escape") {
        build.setStyle("#content","visibility", "hidden");
    }
})

// nastav callback pro prvni tlacitko - upravy
build.setCallBack("#add","click",() => {
    activateModal();
    showAdd();
});

// ovladani pomoci klavesnice
build.setCallBack("body", "keydown", keyboardControlDown)
build.setCallBack("body", "keyup", keyboardControlUp)
// prirad callbacky modalnimu oknu
build.setCallBack("#buttons .close","click", closeModal);
build.setCallBack("#add_confirm","click", addPath); // pujde do komunikace
build.setCallBack("#frequency","click", calcFRQShowPaths); // prepocitej dle dane metody - frekvencni
build.setCallBack("#force","click", calcFMShowPaths); // prepocitej dle dane metody - silova
build.setCallBack("#random_order","click", getRandomOrderShowPaths); // prepocitej dle dane metody - nahodne poradi
build.setCallBack("#add_example", "click", autofill); // samo plnici metoda pro ukazku
build.setCallBack("#remove", "click", deleteAllTimeLines); // odstran vse

// vykresleni elmentu vizualizace, pripadne vycisteni zobrazovaci plochy
function orderCbs() {
    if (context.active.length > 0) {
        calcFRQShowPaths();
        build.getAllElements("#emblems .item").nodes().forEach((el) => build.setCallBack(el,"click", selectItem));
        build.getAllElements("#emblems .up").nodes().forEach((el) => build.setCallBack(el,"click", moveUp));
        build.getAllElements("#emblems .down").nodes().forEach((el) => build.setCallBack(el,"click", moveDown));
        build.getAllElements("#emblems .remove").nodes().forEach((el) => build.setCallBack(el,"click", deleteTimeLine));
        build.getAllElements(".colorPicker").nodes().forEach((el) => build.setCallBack(el, "click", editColor));
        build.getAllElements(".inputPicker").nodes().forEach((el) => build.setCallBack(el, "input", changeColor));
    }
    else {
        build.removeItems();
    }
}

// pridani aktualne hledane osy do vizualizace a zobrazeni
async function addPath() {
    // nactu z repre co chci pridat
    await comm.saveToBuffer();
    // necham spocitat poradi a necham zobrazit
    orderCbs();
}

// vycisteni cele vizualizace
function deleteAllTimeLines() {
    build.removeItems();
    context.removeAll();
}

// odstraneni jedne casove osy
function deleteTimeLine(event) {
    let itemClass = event.target.parentElement.className.baseVal;
    context.removeSelected(itemClass);
    build.removeSpecificItems([`.inputPicker.${itemClass}`]);
    if (selection?.className.baseVal === itemClass)
        unselectItem();
    orderCbs();
}

// zmena barvy u osy
function editColor(event) {
    let clsName = event.target.parentNode.attributes["class"].value;
    // console.log(build.getElement(`.inputPicker.${clsName}`));
    let picker = build.getElement(`.inputPicker.${clsName}`);
    picker.attr("value", event.target.attributes["fill"].value);
    // console.log(picker);
    picker.node().click();
}

// postupna aktualizace barvy vsech elementu meneneho prvku
function changeColor(event) {
    // nacti novou barvu
    let newColor = event.target.value;
    // meneny prvek
    let clsName = event.target.classList[event.target.classList.length - 1];
    // zmena barev v datech
    context.changeColor(event.target.defaultValue, newColor);
    // zmena barvy ve vsech dilcich castech
    event.target.defaultValue = newColor;
    let idx = context.active.findIndex(d => d.name === clsName);
    context.active[idx].color = newColor;
    build.getAllElements(`.minimapDraw .${clsName}`).nodes().forEach((d) => {build.setAttrib(d,"fill", newColor)});
    build.getAllElements(`#paths .${clsName}`).nodes().forEach((d) => {build.setAttrib(d,"stroke", newColor)});
    build.setAttrib(`#emblems .${clsName} .colorPicker`,"fill",newColor);
}

// ovladani modalniho okna s moznostmi na pridani nebo vytvoreni ukazky
function activateModal() {
    modalActive = true;
    modal.style("display","inherit");
}

// zavreni modalniho okna
function closeModal() {
    build.getElement(".dropdown .form_control").node().value = "";
    modalActive = false;
    modal.style("display","none");
}

// polozka na pridavani
function showAdd() {
    build.setStyle("#modal_add","visibility", "inherit");
    build.setStyle("#add_confirm","visibility", "inherit");
    build.setStyle("#add_example","visibility", "inherit");
}

// brush event callback
function brushed(event) { // move
    if (event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    // ziskej vyber
    let s = event.selection || context.xt.range();
    // zjisti zmeny ve vyberu
    s = s.map(value => value - build.minimapX);
    context.xt2.domain(s.map(context.xt.invert, context.xt));
    // aktualizuj cesty
    for(let child of build.getElement("#paths").node().children)
        build.getElement(child).attr("d", context.area);
    // prepocitej vizualizaci a zavolej zoom
    build.rescaleTimeline();
    build.getElement("#timestamps").call(context.axis);
    build.getElement("#zoom").call(context.zoom.transform,
        d3.zoomIdentity
        .scale((build.minimapW) / ((s[1]) - (s[0])))
        .translate(-s[0], 0),
        null,
        event);
}
// zoom event callback
function zoomed(event) { // zoom
    if (event.sourceEvent && event.sourceEvent.type === "brush") return;
    // nacti transformaci
    let t = event.transform;
    // spocitej zmenu
    context.xt2.domain(t.rescaleX(context.xt).domain());
    // uprav cesty
    for(let child of build.getElement("#paths").node().children)
        build.getElement(child).attr("d", context.area);
    // posun co je treba
    if (event.sourceEvent) {
        let par = build.getElement(build.getElement("#timelines").node().parentNode);
        let y = Number(par.node().transform.baseVal.consolidate().matrix.f);
        par.attr("transform", `translate(0,${y + event.sourceEvent.movementY})`);
    }
    // prepocitej vizualizaci a zavolej brush
    build.rescaleTimeline();
    build.getElement("#timestamps").call(context.axis);
    build.getElement("#gb").call(context.brush.move, context.xt.range().map(t.invertX, t).map(value => value + build.minimapX), event);
}

// vyber urcitou casovou osu
function selectItem(event) {
    // console.log(event);
    const selIcon = build.getElement("#selected");
    if (selection === null)
        selIcon.style("display", "inherit")
    selection = build.getElement(this.parentNode).node();
    const nY = Number(selection.transform.baseVal.consolidate().matrix.f); // nova y souradnice
    selIcon.attr("y", `${nY - 30}`);
}
// zrus vyber
function unselectItem() {
    selection = null;
    build.setStyle("#selected","display","none");
}

// prohod dve skupiny v reprezentaci
function swapGroups(idx, otherIdx) {
    let clicked = context.activeOrder[idx];
    let other = context.activeOrder[otherIdx];
    let sel = selection ? selection.className.baseVal : undefined;
    let clkedAIdx = context.active.findIndex(e => e.clsName === clicked);
    let abvAIdx = context.active.findIndex(e => e.clsName === other);
    // prohod dve casove osy
    [context.active[clkedAIdx], context.active[abvAIdx]] = [context.active[abvAIdx], context.active[clkedAIdx]];
    [context.activeOrder[idx], context.activeOrder[otherIdx]] = [context.activeOrder[otherIdx], context.activeOrder[idx]];
    // prekresli
    build.drawRes(order.makeView());
    if (sel === clicked)
        moveSelectionTo(clicked);
    if (sel === other)
        moveSelectionTo(other);
}

// pohnu uzlem, posunu ho o jednu nahoru v aktivnim listu, prekreslim
function moveUp() {
    let idx = context.activeOrder.findIndex(e => e === this.parentNode.className.baseVal);
    if (idx !== 0)
        swapGroups(idx, idx - 1);
}

// pohnu uzlem, posunu ho o jednu dolu v aktivnim listu, prekreslim
function moveDown() {
    let idx = context.activeOrder.findIndex(e => e === this.parentNode.className.baseVal);
    if (idx !== context.active.length - 1)
        swapGroups(idx, idx + 1);
}

// pohnu s vyberem linky
function moveSelectionTo(clss) {
    if (selection !== null)
        build.getElement(`#emblems .${clss} .item`).dispatch("click");
}

// vezme data z databufferu a zkusi je zobrazit
function showPaths () {
    context.updateScales();
    build.drawRes(order.makeView());
}

// metoda hrube sily
async function calcBFShowPaths() {
    order.bruteForceOrder(build);
}

// nahodne poradi
async function getRandomOrderShowPaths() {
    let tmpCls = selection?.className.baseVal;
    order.randomOrder(build);
    if (tmpCls)
        clickEmblemItem(tmpCls);
}

// frekvencni tabulka
async function calcFRQShowPaths() {
    let tmpCls = selection?.className.baseVal;
    order.frequencyTable(build);
    if(tmpCls)
        clickEmblemItem(tmpCls);
}

// silova metoda
async function calcFMShowPaths() {
    let tmpCls = selection?.className.baseVal;
    order.forceMethod(build);
    if (tmpCls)
        clickEmblemItem(tmpCls);
}

// automatické testovani / priklad vizualizace
async function autofill() {
    const ids = [3,19,88,71,40,13,69,21];
    const names = ["Almendor", "Danérie", "Storabsko", "Podzemní říše", "Keledor", "Boševal", "Plavena", "Detreon"];
    for (let i = 0; i < names.length; i++) {
        comm.searchItem.id = ids[i];
        comm.searchItem.name = names[i];
        await comm.fetchTags(names[i],[]);
        await addPath();
    }
    comm.searchItem.id = -1;
    comm.searchItem.name = "";
}

// callback pro kliknuti na emblem daneho prvku
function clickEmblemItem(cls) {
    build.getElement(`#emblems .${cls} .item`).dispatch("click");
}

// ovladani klavesnice
function keyboardControlDown(e) {
    if (e.key === "Shift")
        keys.shift = true;
    if (e.key === "Control")
        keys.ctrl = true;
    if (e.key === "ArrowUp")
        keys.up = true;
    if (e.key === "ArrowDown")
        keys.down = true;
    if (e.key === "a")
        keys.a = true;
    if (e.key === "d")
        keys.d = true;
    if (e.key === "Escape")
        keys.esc = true;

    if (keys.esc && modalActive && build.getStyle("#content","visibility") === "hidden"){
        closeModal();
    }
    else if (keys.esc && selection !== null && build.getStyle("#content","visibility") === "hidden") {
        unselectItem();
    }
    if (keys.shift && keys.up && selection !== null && build.getStyle("#content","visibility") === "hidden") {
        e.preventDefault();
        build.getElement(selection).select(".up").dispatch("click");
    }
    if (keys.shift && keys.down && selection !== null && build.getStyle("#content","visibility") === "hidden") {
        e.preventDefault();
        build.getElement(selection).select(".down").dispatch("click");
    }
    if (keys.ctrl && keys.a) {
        e.preventDefault();
        activateModal();
        showAdd();
    }
    if (keys.up && !keys.shift && selection !== null && build.getStyle("#content","visibility") === "hidden"){
        e.preventDefault();
        if (context.activeOrder.length) {
            const sel = context.activeOrder.findIndex(e => e === selection.className.baseVal) - 1;
            if (sel !== -1)
                build.getElement(`#emblems .${context.activeOrder[sel]} .item`).dispatch("click");
        }
    }
    if (keys.up && !keys.shift && selection === null && build.getStyle("#content","visibility") === "hidden"){
        e.preventDefault();
        if (context.activeOrder.length) {
            const sel = context.activeOrder.length - 1;
            build.getElement(`#emblems .${context.activeOrder[sel]} .item`).dispatch("click");
        }
    }
    if (keys.down && !keys.shift && selection !== null && build.getStyle("#content","visibility") === "hidden"){
        e.preventDefault();
        if (context.activeOrder.length) {
            const sel = context.activeOrder.findIndex(e => e === selection.className.baseVal) + 1;
            if (sel !== context.activeOrder.length)
                build.getElement(`#emblems .${context.activeOrder[sel]} .item`).dispatch("click");
        }
    }
    if (keys.down && !keys.shift && selection === null && build.getStyle("#content","visibility") === "hidden"){
        e.preventDefault();
        if (context.activeOrder.length) {
            build.getElement(`#emblems .${context.activeOrder[0]} .item`).dispatch("click");
        }
    }
}

function keyboardControlUp(e) {
    if (e.key === "Shift")
        keys.shift = false;
    if (e.key === "Control")
        keys.ctrl = false;
    if (e.key === "ArrowUp")
        keys.up = false;
    if (e.key === "ArrowDown")
        keys.down = false;
    if (e.key === "a")
        keys.a = false;
    if (e.key === "d")
        keys.d = false;
    if (e.key === "Escape")
        keys.esc = false;
}

// ovladani dropdown nabidky pri pridavani jednotlivych polozek
function dropDownKeys (e){
    e.preventDefault();
    if (build.getElement(".form_control").node().value !== "" &&
        (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter")) {
        const list = build.getElement("#content").node();
        let sel = build.getElement("#content .searchSel").node();
        // console.log(sel);
        if (e.key === "ArrowUp") {
            // console.log(e.key);
            if (!sel){
                list.lastElementChild.attributes["class"].value = "searchSel";
            }
            else {
                sel.attributes["class"].value = "";
                if (sel.previousElementSibling)
                    sel.previousElementSibling.attributes["class"].value = "searchSel";
                else
                    list.lastElementChild.attributes["class"].value = "searchSel";
            }
            sel = build.getElement("#content .searchSel").node();
            sel.scrollIntoView(true);
        }
        if (e.key === "ArrowDown") {
            // console.log(e.key);
            if (!sel){
                list.firstElementChild.attributes["class"].value = "searchSel";
            }
            else {
                sel.attributes["class"].value = "";
                if (sel.nextElementSibling)
                    sel.nextElementSibling.attributes["class"].value = "searchSel";
                else
                    list.firstElementChild.attributes["class"].value = "searchSel";
            }
            sel = build.getElement("#content .searchSel").node();
            sel.scrollIntoView(true);
        }
        if (e.key === "Enter") {
            // console.log(e.key);
            build.getElement(sel).dispatch("click");
            build.setStyle("#content","visibility", "hidden");
        }
    }
}

// nastartovani vsech podcasti - vykresleni, ziskani poradi barev, informaci o minimape, ...
let info = build.getMinimapInfo();
context.shuffelColors();

context.setBrush(info, brushed);
context.setZoom(info, zoomed);

context.axis.tickFormat((d) => {return _currentVer_DateUtils_js__WEBPACK_IMPORTED_MODULE_5__["default"].getDateName(d)});
context.updateBrushZoomAxis(info);
build.getElement("#timestamps").attr("transform", `translate(0,${build.getElement(".canvasDraw").node().clientHeight - 160})`);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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MEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUJBQXFCO0FBQzVDO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsNEVBQXFCO0FBQzNELG9DQUFvQyw0RUFBcUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQy9NQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsZ0JBQWdCO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELDRCQUE0QjtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBMkM7QUFDakQsTUFBTSwyQ0FBMkM7QUFDakQsTUFBTSw2Q0FBNkM7QUFDbkQsTUFBTSw2Q0FBNkM7QUFDbkQsTUFBTSw4Q0FBOEM7QUFDcEQsTUFBTSw2Q0FBNkM7QUFDbkQsTUFBTSw2Q0FBNkM7QUFDbkQsTUFBTSwyQ0FBMkM7QUFDakQsTUFBTSw2Q0FBNkM7QUFDbkQsTUFBTSw2Q0FBNkM7QUFDbkQsTUFBTSw4Q0FBOEM7QUFDcEQsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxTQUFTLEVBQUM7QUFDekI7Ozs7Ozs7Ozs7QUM3R0EsYUFBYSxHQUFHLElBQXNELEVBQUUsbUJBQW1CLEtBQUssVUFBcU8sQ0FBQyxhQUFhLDBCQUEwQixtQkFBbUIsa0JBQWtCLGdCQUFnQixVQUFVLFVBQVUsTUFBTSxTQUFtQyxDQUFDLGdCQUFnQixPQUFDLE9BQU8sb0JBQW9CLDhDQUE4QyxrQ0FBa0MsWUFBWSxZQUFZLG1DQUFtQyxpQkFBaUIsZUFBZSxzQkFBc0Isb0JBQW9CLFVBQVUsU0FBbUMsS0FBSyxXQUFXLFlBQVksU0FBUyxTQUFTLEtBQUs7QUFDajBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBRSx3REFBd0Q7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsVUFBVTtBQUN2QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxTQUFTO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksU0FBUztBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxTQUFTO0FBQ3JCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEIsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCLFVBQVU7QUFDVjtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksVUFBVTtBQUN0QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsR0FBRztBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxrQkFBa0I7QUFDOUIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHFCQUFxQjtBQUNsQyxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHFCQUFxQjtBQUNsQyxZQUFZLFFBQVE7QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsR0FBRztBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQixZQUFZLFNBQVM7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxVQUFVO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxVQUFVO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxVQUFVO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFVBQVU7QUFDdEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFVBQVU7QUFDdEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFVBQVU7QUFDdEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFVBQVU7QUFDdEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFVBQVU7QUFDdEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsc0JBQXNCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxlQUFlO0FBQzdCO0FBQ0E7QUFD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QkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxlQUFlO0FBQzNCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCLFlBQVksZ0JBQWdCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFNBQVM7QUFDckIsWUFBWSxTQUFTO0FBQ3JCLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksU0FBUztBQUNyQixZQUFZLFNBQVM7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLFlBQVksU0FBUztBQUNyQixZQUFZLFNBQVM7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQixZQUFZLFNBQVM7QUFDckIsWUFBWSxTQUFTO0FBQ3JCLFlBQVksU0FBUztBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLFlBQVksUUFBUTtBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQixZQUFZLFNBQVM7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksZ0JBQWdCO0FBQzVCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLGdCQUFnQjtBQUM3QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQywwQkFBMEI7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQW1CO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsa0JBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQixZQUFZLFNBQVM7QUFDckIsWUFBWSxTQUFTO0FBQ3JCLFlBQVksU0FBUztBQUNyQixZQUFZLFNBQVM7QUFDckIsWUFBWSxTQUFTO0FBQ3JCLFlBQVksU0FBUztBQUNyQixZQUFZLFNBQVM7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCLGdCQUFnQixTQUFTO0FBQ3pCLGdCQUFnQixTQUFTO0FBQ3pCLGdCQUFnQixTQUFTO0FBQ3pCLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1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QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyx3QkFBd0I7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxPQUFPLDRFQUFxQixJQUFJO0FBQ2hFO0FBQ0EsaUVBQWlFLDBEQUEwRCIsInNvdXJjZXMiOlsid2VicGFjazovL2FzdGVyaW9uX3RpbWV2aXovLi9idWlsZC5qcyIsIndlYnBhY2s6Ly9hc3Rlcmlvbl90aW1ldml6Ly4vY29tbXVuaWNhdGlvbi5qcyIsIndlYnBhY2s6Ly9hc3Rlcmlvbl90aW1ldml6Ly4vY29udGV4dC5qcyIsIndlYnBhY2s6Ly9hc3Rlcmlvbl90aW1ldml6Ly4vY3VycmVudFZlci9EYXRlVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0ZXJpb25fdGltZXZpei8uL2ludGVyc2VjdGlvbnMuanMiLCJ3ZWJwYWNrOi8vYXN0ZXJpb25fdGltZXZpei8uL3N0eWxlcy5jc3M/MDdkMiIsIndlYnBhY2s6Ly9hc3Rlcmlvbl90aW1ldml6Ly4vb3JkZXIuanMiLCJ3ZWJwYWNrOi8vYXN0ZXJpb25fdGltZXZpei93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hc3Rlcmlvbl90aW1ldml6L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2FzdGVyaW9uX3RpbWV2aXovd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2FzdGVyaW9uX3RpbWV2aXovd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9hc3Rlcmlvbl90aW1ldml6L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXN0ZXJpb25fdGltZXZpei93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2FzdGVyaW9uX3RpbWV2aXovd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYXN0ZXJpb25fdGltZXZpei8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHRyaWRhIHBybyB2eXN0dmFidSBjZWxlIHN0cmFua3kgcGx1cyB6bWVueSBhIGFrdHVhbGl6YWNlXHJcbi8vIHV0aWxpdGEgeiBicCBaaW1tZXJtYW5vdmEgLSBwcmVwb2NldCBwb3ppY2UgbmEgY2Fzb3ZvdSB6bmFja3VcclxuaW1wb3J0IGRhdGVVdGlscyBmcm9tIFwiLi9jdXJyZW50VmVyL0RhdGVVdGlscy5qc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGQge1xyXG4gICAgLy8gbWluaW1hbG5pIHZlbGlrb3N0IG9icmF6a3UgdWRhbG9zdGlcclxuICAgIG1pbldpZHRoRXZlbnQgPSA1MDtcclxuICAgIC8va29uc3RydWt0b3IgdHJpZGkgYnVpbGRcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQsIG9yZGVyKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLm9yZGVyID0gb3JkZXI7XHJcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMubWluaW1hcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMubW9kYWxfbWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5mb290ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMudml6ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgLy8gem1lbmEgdmVsaWtvc3RpIG9rbmEgcyB2aXp1YWxpemFjaVxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRtcCA9IGQzLnNlbGVjdChcIi5taW5pbWFwRHJhd1wiKTtcclxuICAgICAgICAgICAgdG1wLnJlbW92ZSh0bXAuZmlyc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkTWluaW1hcCgpO1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5hY3RpdmUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnVwZGF0ZUJydXNoWm9vbUF4aXModGhpcy5nZXRNaW5pbWFwSW5mbygpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC51cGRhdGVTY2FsZXMoKTtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0aW1lc3RhbXBzXCIpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7ZDMuc2VsZWN0KFwiLmNhbnZhc0RyYXdcIikubm9kZSgpLmNsaWVudEhlaWdodCAtIDE2MH0pYCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdSZXModGhpcy5vcmRlci5tYWtlVmlldygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1vdmVCdXR0b25zKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHZ5dHZvcmVuaSBjZWxlIHZpenVhbGl6YWNlLCB6YXRpbSBqZW4gdmlydHVhbG5lXHJcbiAgICAgICAgdGhpcy5idWlsZFZpeigpO1xyXG4gICAgICAgIC8vIHByaXBvamVuaSB2aXp1YWxpemFjZSBkbyBva25hIHByb2hsaXplY2VcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0aGlzLnZpeik7XHJcbiAgICAgICAgLy8gcHJlcG9jaXRhbmkgcG96aWNlIHRsYWNpdGVrIHBybyBwcmlkYW5pL29kZWJyYW5pXHJcbiAgICAgICAgdGhpcy5tb3ZlQnV0dG9ucygpO1xyXG4gICAgICAgIC8vIG5hY3RlbmkgdmVsaWtvc3RpXHJcbiAgICAgICAgdGhpcy5taW5pbWFwWCA9IE51bWJlcihkMy5zZWxlY3QoXCIjbWluaW1hcF9Cb3VuZFwiKS5hdHRyKFwieFwiKSk7XHJcbiAgICAgICAgdGhpcy5taW5pbWFwVyA9IE51bWJlcihkMy5zZWxlY3QoXCIjbWluaW1hcF9Cb3VuZFwiKS5hdHRyKFwid2lkdGhcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZyYWNpIHggYSB3aWR0aCBtaW5pbWFweVxyXG4gICAgZ2V0TWluaW1hcEluZm8oKSB7XHJcbiAgICAgICAgbGV0IHRtcCA9IGQzLnNlbGVjdChcIi5taW5pbWFwRHJhdyAjbWluaW1hcF9Cb3VuZFwiKTtcclxuICAgICAgICB0aGlzLm1pbmltYXBYID0gTnVtYmVyKHRtcC5hdHRyKFwieFwiKSk7XHJcbiAgICAgICAgdGhpcy5taW5pbWFwVyA9IE51bWJlcih0bXAuYXR0cihcIndpZHRoXCIpKTtcclxuICAgICAgICByZXR1cm4ge3g6TnVtYmVyKHRtcC5hdHRyKFwieFwiKSksIHdpZHRoOiBOdW1iZXIodG1wLmF0dHIoXCJ3aWR0aFwiKSl9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLWJ1aWxkLXdob2xlLXZpei0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gcG9zdGF2IGhsYXZuaSBlbGVtZW50IHZpenVhbGl6YWNlLCBkaXYga29udGVqbmVyIHMgamVkbm90bGl2eW1pIHBvZGNhc3RtaVxyXG4gICAgYnVpbGRWaXooKSB7XHJcbiAgICAgICAgLy8gcHJpZGVqIGF0cmlidXR5XHJcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMudml6KS5hdHRyKFwiaWRcIiwgXCJ2aXpcIik7XHJcbiAgICAgICAgLy8gcG9zdGF2IGEgcHJpZGVqIGhlYWRlclxyXG4gICAgICAgIHRoaXMuYnVpbGRIZWFkZXIoKTtcclxuICAgICAgICB0aGlzLnZpei5hcHBlbmQodGhpcy5oZWFkZXIpO1xyXG4gICAgICAgIC8vIHBvc3RhdiBhIHByaWRlaiBtaW5pbWFwdVxyXG4gICAgICAgIHRoaXMuYnVpbGRNaW5pbWFwKCk7XHJcbiAgICAgICAgdGhpcy52aXouYXBwZW5kKHRoaXMubWluaW1hcCk7XHJcbiAgICAgICAgLy8gcG9zdGF2IGEgcHJpZGVqIHBsYXRub1xyXG4gICAgICAgIHRoaXMuYnVpbGRDbnZzKCk7XHJcbiAgICAgICAgdGhpcy52aXouYXBwZW5kKHRoaXMuY2FudmFzKTtcclxuICAgICAgICAvLyBwb3N0YXYgYSBwcmlkZWogbW9kYWwgbWVudVxyXG4gICAgICAgIHRoaXMuYnVpbGRNb2RhbCgpO1xyXG4gICAgICAgIHRoaXMudml6LmFwcGVuZCh0aGlzLm1vZGFsX21lbnUpO1xyXG4gICAgICAgIC8vIHBvc3RhdiBhIHByaWRlaiBrb25lY1xyXG4gICAgICAgIHRoaXMuYnVpbGRGb290ZXIoKTtcclxuICAgICAgICB0aGlzLnZpei5hcHBlbmQodGhpcy5mb290ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZ5dHZvciB6YWhsYXZpXHJcbiAgICBidWlsZEhlYWRlcigpIHtcclxuICAgICAgICBkMy5zZWxlY3QodGhpcy5oZWFkZXIpLmF0dHIoXCJpZFwiLCBcImhlYWRlclwiKTtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IGQzLnNlbGVjdCh0aGlzLmhlYWRlcikuYXBwZW5kKFwiZGl2XCIpO1xyXG4gICAgICAgIHRpdGxlLmF0dHIoXCJjbGFzc1wiLCBcInRpdGxlXCIpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJoMVwiKVxyXG4gICAgICAgICAgICAudGV4dChcIkFzdGVyaW9uIFRpbWVsaW5lc1wiKTtcclxuICAgICAgICBjb25zdCBsaW5rcyA9IGQzLnNlbGVjdCh0aGlzLmhlYWRlcikuYXBwZW5kKFwiZGl2XCIpO1xyXG4gICAgICAgIGxpbmtzLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtzXCIpO1xyXG4gICAgICAgIC8vIGxpbmtzLmFwcGVuZChcImFcIilcclxuICAgICAgICAvLyAgICAgLnRleHQoXCJVcHJhdml0XCIpO1xyXG4gICAgICAgIGxpbmtzLmFwcGVuZChcImFcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJocmVmXCIsIFwiLi9oZWxwLmh0bWxcIilcclxuICAgICAgICAgICAgLmFwcGVuZChcImltZ1wiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJzcmNcIiwgcmVxdWlyZShcIi4vaW1nL2hlbHAucG5nXCIpKTtcclxuICAgICAgICBsaW5rcy5hcHBlbmQoXCJhXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaHJlZlwiLCBcImh0dHBzOi8vZGlzY29yZC5jb20vaW52aXRlL3ZBelNhWWNcIilcclxuICAgICAgICAgICAgLmFwcGVuZChcImltZ1wiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJzcmNcIiwgcmVxdWlyZShcIi4vaW1nL2Rpc2NvcmQucG5nXCIpKTtcclxuICAgICAgICBsaW5rcy5hcHBlbmQoXCJhXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaHJlZlwiLCBcImh0dHBzOi8vYXN0ZXJpb25ycGcuY3ovXCIpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJpbWdcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwic3JjXCIsIHJlcXVpcmUoXCIuL2ltZy9hc3RlcmlvbnJwZy5wbmdcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZ5dHZvciBtaW5pbWFwdVxyXG4gICAgYnVpbGRNaW5pbWFwKCkge1xyXG4gICAgICAgIGQzLnNlbGVjdCh0aGlzLm1pbmltYXApLmF0dHIoXCJjbGFzc1wiLCBcIm1pbmltYXBcIik7XHJcbiAgICAgICAgbGV0IHN0YXJ0dGltZSA9IHRoaXMuQnJvd3NlclRleHQuZ2V0V2lkdGgoZGF0ZVV0aWxzLmdldERhdGVOYW1lKDApLCAxNiAsXCJBcmlhbCBCbGFja1wiKS8zO1xyXG4gICAgICAgIGxldCBlbmR0aW1lID0gdGhpcy5Ccm93c2VyVGV4dC5nZXRXaWR0aChkYXRlVXRpbHMuZ2V0RGF0ZU5hbWUoMzY5OTk5OSksIDE2ICxcIkFyaWFsIEJsYWNrXCIpLzM7XHJcbiAgICAgICAgY29uc3QgZm9jdXNfYmVnaW4gPSAwLjEyICogd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgY29uc3QgYm91bmRXaWR0aCA9IDAuNzYgKiB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICAvLyBjb25zdCBkYXRlV2lkdGggPSAwLjE1ICogKHdpbmRvdy5pbm5lcldpZHRoIC0gYm91bmRXaWR0aCkvMjtcclxuICAgICAgICBjb25zdCBkYXRlV2lkdGggPSAod2luZG93LmlubmVyV2lkdGggLSBib3VuZFdpZHRoKS80O1xyXG4gICAgICAgIGNvbnN0IHlEYXRlUG9zaXRpb24gPSA2NTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRlV2lkdGgpO1xyXG4gICAgICAgIGNvbnN0IHN2ZyA9IGQzLnNlbGVjdCh0aGlzLm1pbmltYXApXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1pbmltYXBEcmF3XCIpO1xyXG4gICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJzdGFydF90aW1lXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBgJHtkYXRlV2lkdGggLSBzdGFydHRpbWV9YClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGAke3lEYXRlUG9zaXRpb259JWApXHJcbiAgICAgICAgICAgIC50ZXh0KGRhdGVVdGlscy5nZXREYXRlTmFtZSgwKSk7XHJcbiAgICAgICAgc3ZnLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcIm1pbmltYXBfQm91bmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGAke2ZvY3VzX2JlZ2lufWApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLFwiNVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBcIjI1XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgYCR7Ym91bmRXaWR0aH1gKTtcclxuICAgICAgICBzdmcuYXBwZW5kKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiZW5kX3RpbWVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGAke2ZvY3VzX2JlZ2luICsgYm91bmRXaWR0aCArIGRhdGVXaWR0aCAtIGVuZHRpbWV9YClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGAke3lEYXRlUG9zaXRpb259JWApXHJcbiAgICAgICAgICAgIC50ZXh0KGRhdGVVdGlscy5nZXREYXRlTmFtZSgzNjk5OTk5KSk7XHJcbiAgICAgICAgc3ZnLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImdiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZ5dHZvciBobGF2bmkgem9icmF6b3ZhY2kgcGxvY2h1XHJcbiAgICBidWlsZENudnMoKSB7XHJcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMuY2FudmFzKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiY2FudmFzXCIpO1xyXG4gICAgICAgIGNvbnN0IHN2ZyA9IGQzLnNlbGVjdCh0aGlzLmNhbnZhcylcclxuICAgICAgICAgICAgLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiY2FudmFzRHJhd1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBcIjEwMCVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBcIjEwMCVcIik7XHJcbiAgICAgICAgc3ZnLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInpvb21cIik7XHJcbiAgICAgICAgc3ZnLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInRpbWVzdGFtcHNcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCw5NjApXCIpO1xyXG4gICAgICAgIGNvbnN0IGNudnMgPSBzdmcuYXBwZW5kKFwiZ1wiKS5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMClcIik7XHJcbiAgICAgICAgbGV0IHRtcCA9IGNudnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiaWRcIiwgXCJ0aW1lbGluZXNcIik7XHJcbiAgICAgICAgdG1wID0gdG1wLmFwcGVuZChcImdcIikuYXR0cihcImlkXCIsIFwidGltZWxpbmVfZWxzXCIpO1xyXG4gICAgICAgIHRtcC5hcHBlbmQoXCJnXCIpLmF0dHIoXCJpZFwiLCBcInBhdGhzXCIpO1xyXG4gICAgICAgIGNudnMuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwibGFtcHNoYWRlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBcIjBcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIFwiLTIwMDBcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgXCI5MDAlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgXCIyMDBcIik7XHJcbiAgICAgICAgY252cy5hcHBlbmQoXCJpbWFnZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwic2VsZWN0ZWRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIFwiNDBcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIFwiMFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIFwiMTAwXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiMTAwXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaHJlZlwiLCByZXF1aXJlKFwiLi9pbWcvc2VsZWN0aW9uLnBuZ1wiKSk7XHJcbiAgICAgICAgY252cy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJlbWJsZW1zXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDkwLC01MClcIik7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQnV0dG9uQ252cyhzdmcsIDAsIFwiYWRkXCIsIHJlcXVpcmUoXCIuL2ltZy9hZGQucG5nXCIpLCA2MCwgMTAsIFwiUMWZaWRlalwiLCBcInDFmcOtYsSbaFwiLCAxMCk7XHJcbiAgICAgICAgdGhpcy5hZGRCdXR0b25DbnZzKHN2ZywgMTAwLCBcInJlbW92ZVwiLCByZXF1aXJlKFwiLi9pbWcvZGVsZXRlLnBuZ1wiKSwgNjAsIDExMCwgXCJTbWHFvlwiLCBcInbFoWVcIiwgMTI1KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcmlkZWogc3ZnIHRsYWNpdGtvIGRvIGhsYXZuaSB6b2JyYXpvdmFjaSBwbG9jaHlcclxuICAgIGFkZEJ1dHRvbkNudnModG8seENvb3JkLCBncm91cElkLCBpbWcsIGltZ1dpZHRoLCBpbWdYLCB0ZXh0QSwgdGV4dEIsIHRleHRYKSB7XHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9IHRvLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBncm91cElkKTtcclxuICAgICAgICBidXR0b24uYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsXCIxMDBcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgXCIxMDBcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIHhDb29yZClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIFwiMFwiKTtcclxuICAgICAgICBidXR0b24uYXBwZW5kKFwiaW1hZ2VcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJocmVmXCIsIGltZylcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBpbWdXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIFwiNVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgaW1nWCk7XHJcbiAgICAgICAgYnV0dG9uLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLnRleHQodGV4dEEpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBcIjY1XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCB0ZXh0WCk7XHJcbiAgICAgICAgYnV0dG9uLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLnRleHQodGV4dEIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBcIjkwXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCB0ZXh0WCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpZGVqIHRsYWNpdGtvIGRvIG1vZGFsbmlobyBva25hXHJcbiAgICBhZGRCdXR0b25Nb2RhbCh0bywgY2xzcywgdGV4dCkge1xyXG4gICAgICAgIHRvLmFwcGVuZChcImJ1dHRvblwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGNsc3MpXHJcbiAgICAgICAgICAgIC50ZXh0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZ5dHZvciBtb2RhbG5pIG9rbm8gcHJvIHByaWRhdmFuaSBvc1xyXG4gICAgYnVpbGRNb2RhbCgpIHtcclxuICAgICAgICBjb25zdCBjb250ZW50ID0gZDMuc2VsZWN0KHRoaXMubW9kYWxfbWVudSkuYXR0cihcImlkXCIsIFwibW9kYWxfbWVudVwiKS5hcHBlbmQoXCJkaXZcIikuYXR0cihcImNsYXNzXCIsIFwiY29udGVudFwiKTtcclxuICAgICAgICBsZXQgdG1wID0gY29udGVudC5hcHBlbmQoXCJkaXZcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImJ1dHRvbnNcIik7XHJcbiAgICAgICAgdGhpcy5hZGRCdXR0b25Nb2RhbCh0bXAsIFwiY2xvc2VcIiwgXCJYXCIpO1xyXG4gICAgICAgIGNvbnN0IHRhYnMgPSBjb250ZW50LmFwcGVuZChcImRpdlwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidGFic1wiKTtcclxuICAgICAgICB0bXAgPSB0YWJzLmFwcGVuZChcImRpdlwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwibW9kYWxfYWRkXCIpO1xyXG4gICAgICAgIHRtcC5hcHBlbmQoXCJwXCIpLnRleHQoXCJWeWhsZWTDoXbDoW7DrSDEjWFzb3bDvWNoIG9zOlwiKTtcclxuICAgICAgICBsZXQgZm9ybSA9IHRtcC5hcHBlbmQoXCJkaXZcIikuYXR0cihcImNsYXNzXCIsIFwiZHJvcGRvd25cIik7XHJcbiAgICAgICAgZm9ybS5hcHBlbmQoXCJpbnB1dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiZm9ybV9jb250cm9sXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHlwZVwiLCBcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ2YWx1ZVwiLCBcIlwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiWmHEjW7Em3RlIHBzw6F0XCIpO1xyXG4gICAgICAgIGZvcm0uYXBwZW5kKFwidWxcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImNvbnRlbnRcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBcImhpZGRlblwiKTtcclxuICAgICAgICB0bXAuYXBwZW5kKFwiYnV0dG9uXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJhZGRfY29uZmlybVwiKVxyXG4gICAgICAgICAgICAudGV4dChcIlDFmWlkYXQgb3N1XCIpO1xyXG4gICAgICAgIHRtcC5hcHBlbmQoXCJidXR0b25cIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImFkZF9leGFtcGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KFwiVWvDoXprYSDEjWFzb3bDvWNoIG9zXCIpO1xyXG4gICAgICAgIHRtcC5hcHBlbmQoXCJidXR0b25cIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImZyZXF1ZW5jeVwiKVxyXG4gICAgICAgICAgICAudGV4dChcIkZyZWt2ZW7EjW7DrSBtZXRvZGFcIik7XHJcbiAgICAgICAgdG1wLmFwcGVuZChcImJ1dHRvblwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiZm9yY2VcIilcclxuICAgICAgICAgICAgLnRleHQoXCJTaWxvdmEgbWV0b2RhXCIpO1xyXG4gICAgICAgIHRtcC5hcHBlbmQoXCJidXR0b25cIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInJhbmRvbV9vcmRlclwiKVxyXG4gICAgICAgICAgICAudGV4dChcIk7DoWhvZG7DqSBwb8WZYWTDrVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB2eXR2b3IgemFwYXRpIHMgcHJpc2x1c255bWkgaW5mb3JtYWNlbWlcclxuICAgIGJ1aWxkRm9vdGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGQzLnNlbGVjdCh0aGlzLmZvb3RlcikuYXR0cihcImlkXCIsXCJmb290ZXJcIik7XHJcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMuZm9vdGVyKS5hcHBlbmQoXCJwXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGAyMDIxIC0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9IMKpYClcclxuICAgICAgICAgICAgLmFwcGVuZChcImFcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJocmVmXCIsIFwiLi9hYm91dC5odG1sXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KFwiTyBuw6FzXCIpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJlcG9jaXRlaiBwb3ppY2kgdGxhY2l0ZWtcclxuICAgIG1vdmVCdXR0b25zKCkge1xyXG4gICAgICAgIGxldCB5ID0gZDMuc2VsZWN0KHRoaXMuY2FudmFzKS5ub2RlKCkuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIGxldCBub2RlID0gZDMuc2VsZWN0KFwiI2FkZFwiKTtcclxuICAgICAgICBub2RlLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7eSAtIG5vZGUubm9kZSgpLmZpcnN0Q2hpbGQuYXR0cmlidXRlc1tcImhlaWdodFwiXS52YWx1ZX0pYClcclxuICAgICAgICBub2RlID0gZDMuc2VsZWN0KFwiI3JlbW92ZVwiKTtcclxuICAgICAgICBub2RlLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7eSAtIG5vZGUubm9kZSgpLmZpcnN0Q2hpbGQuYXR0cmlidXRlc1tcImhlaWdodFwiXS52YWx1ZX0pYClcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRHJhdy10aW1lbGluZXMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBwcmlkZWogemFkYW55IG9icmF6ZWsga2Ugc2t1cGluZSBnIG5hIHVyY2l0eWNoIHNvdXJhZG5pY2ljaFxyXG4gICAgYWRkSW1nKGcsIGNscywgaW1nUGF0aCwgeCwgeSwgaCwgdywgdHJhbnNmKSB7XHJcbiAgICAgICAgY29uc3QgbmV3SW1nID0gZy5hcHBlbmQoXCJpbWFnZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGNscylcclxuICAgICAgICAgICAgLmF0dHIoXCJocmVmXCIsIGltZ1BhdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLHgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLHkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdyk7XHJcbiAgICAgICAgaWYgKHRyYW5zZiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBuZXdJbWcuYXR0cihcInRyYW5zZm9ybVwiLCB0cmFuc2YpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByZW5hc3RhdiBvc3UgdiBpdGVtIG5hIHphZGFuZSBwYXJhbWV0cnlcclxuICAgIHNldFBhdGgoaXRlbSwgZGF0dW0sIGNscywgY29sb3IpIHtcclxuICAgICAgICBpdGVtLmRhdHVtKGRhdHVtKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGNscylcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgY29sb3IpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCB0aGlzLmNvbnRleHQuYXJlYSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpZGVqL3ptZW4vb2RzdHJhbiBjYXNvdmUgb3N5IHRhaywgYWJ5IHNlIHNldHJpbG8gdnl0dmFyZW5pIG5vdnljaCBwcnZrdSBhIG1hemFuaSBzdGFyeWNoXHJcbiAgICBmaWxsUGF0aHMobGlzdCwgZGF0YSkge1xyXG4gICAgICAgIGxldCBjaGlsZCA9IGxpc3Qubm9kZSgpICE9PSBudWxsID8gbGlzdC5ub2RlKCkuZmlyc3RFbGVtZW50Q2hpbGQgOiBudWxsO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBmb3IgKGk7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQYXRoKGQzLnNlbGVjdChjaGlsZCksIGRhdGFbaV0uZGF0dW0sIGRhdGFbaV0uY2xzTmFtZSwgZGF0YVtpXS5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UGF0aChkMy5zZWxlY3QoY2hpbGQpLCBbZGF0YVtpXS5kYXR1bVswXSwgZGF0YVtpXS5kYXR1bVtkYXRhW2ldLmRhdHVtLmxlbmd0aCAtIDFdXSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2ldLmNsc05hbWUgKyBcIiBzZWNfcGF0aFwiLCBkYXRhW2ldLmNvbG9yKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQYXRoKGxpc3QuYXBwZW5kKFwicGF0aFwiKSwgZGF0YVtpXS5kYXR1bSwgZGF0YVtpXS5jbHNOYW1lLCBkYXRhW2ldLmNvbG9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UGF0aChsaXN0LmFwcGVuZChcInBhdGhcIiksIFtkYXRhW2ldLmRhdHVtWzBdLCBkYXRhW2ldLmRhdHVtW2RhdGFbaV0uZGF0dW0ubGVuZ3RoIC0gMV1dLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbaV0uY2xzTmFtZSArIFwiIHNlY19wYXRoXCIsIGRhdGFbaV0uY29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpID09PSBkYXRhLmxlbmd0aCAmJiBjaGlsZCkge1xyXG5cclxuICAgICAgICAgICAgY2hpbGQgPSBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICB3aGlsZSAobGlzdC5ub2RlKCkubGFzdEVsZW1lbnRDaGlsZCAhPT0gY2hpbGQpXHJcbiAgICAgICAgICAgICAgICBsaXN0Lm5vZGUoKS5yZW1vdmVDaGlsZChsaXN0Lm5vZGUoKS5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpZGVqL3VwcmF2L3NtYXogcmVwcmV6ZW50YWNlIGNhc292eWNoIG9zIChlcmJ5KSBkbGUgcG90cmVieVxyXG4gICAgZmlsbEVtYmxlbXMobGlzdCwgZGF0YSkge1xyXG4gICAgICAgIGxldCBjaGlsZCA9IGxpc3Qubm9kZSgpICE9PSBudWxsID8gbGlzdC5ub2RlKCkuZmlyc3RFbGVtZW50Q2hpbGQgOiBudWxsO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBmb3IgKGk7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRtcCA9IGQzLnNlbGVjdChjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB0bXAuYXR0cihcImNsYXNzXCIsIGRhdGFbaV0uY2xzTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKDAsJHtkYXRhW2ldLnN0YXJ0fSlgKTtcclxuICAgICAgICAgICAgICAgIHRtcC5zZWxlY3QoXCIuaXRlbVwiKS5hdHRyKFwiaHJlZlwiLCBkYXRhW2ldLmltZ1BhdGgpO1xyXG4gICAgICAgICAgICAgICAgdG1wLnNlbGVjdChcInRleHRcIikudGV4dChkYXRhW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdG1wLnNlbGVjdChcIi5jb2xvclBpY2tlclwiKS5hdHRyKFwiZmlsbFwiLCBkYXRhW2ldLmNvbG9yKTtcclxuICAgICAgICAgICAgICAgIGlmIChpICsgMSA8IGRhdGEubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkRW1ibGVtKGRhdGFbaV0ubmFtZSwgZGF0YVtpXS5jbHNOYW1lLCBkYXRhW2ldLnN0YXJ0LCBkYXRhW2ldLmltZ1BhdGgsIGRhdGFbaV0uY29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaSA9PT0gZGF0YS5sZW5ndGggJiYgY2hpbGQpXHJcbiAgICAgICAgICAgIHdoaWxlIChsaXN0Lm5vZGUoKS5sYXN0RWxlbWVudENoaWxkICE9PSBjaGlsZClcclxuICAgICAgICAgICAgICAgIGxpc3Qubm9kZSgpLnJlbW92ZUNoaWxkKGxpc3Qubm9kZSgpLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaWRlaiByZXByZXplbnRhY2kgY2Fzb3ZlIG9zeVxyXG4gICAgYWRkRW1ibGVtKG5hbWUsIGNsc05hbWUsIHksIHBhdGgsIGNvbG9yKSB7XHJcbiAgICAgICAgY29uc3QgZW1ibHMgPSBkMy5zZWxlY3QoXCIjZW1ibGVtc1wiKTtcclxuICAgICAgICBjb25zdCBuZXdHcm91cCA9IGVtYmxzLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBgJHtjbHNOYW1lfWApXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwke3l9KWApO1xyXG4gICAgICAgIG5ld0dyb3VwLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImJhY2tncm91bmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIFwiLTkwXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBcIi0xNVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIFwiMTkwXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiMTMwXCIpO1xyXG4gICAgICAgIG5ld0dyb3VwLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIFwiLTcwXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBcIjBcIilcclxuICAgICAgICAgICAgLnRleHQobmFtZSk7XHJcbiAgICAgICAgLy8gdGxhY2l0a2Egc2t1cGlueVxyXG4gICAgICAgIHRoaXMuYWRkSW1nKG5ld0dyb3VwLCBcIml0ZW1cIiwgcGF0aCwgXCItMzVcIiwgXCIxMFwiLCBcIjEwMFwiLCBcIjEwMFwiKVxyXG4gICAgICAgIHRoaXMuYWRkSW1nKG5ld0dyb3VwLCBcInVwIGhpZGVhYmxlXCIsIHJlcXVpcmUoXCIvaW1nL3NtYWxsQXJyb3cucG5nXCIpLCBcIi03NVwiLCBcIjVcIiwgXCIzMFwiLCBcIjMwXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkSW1nKG5ld0dyb3VwLCBcImRvd24gaGlkZWFibGVcIiwgcmVxdWlyZShcIi9pbWcvc21hbGxBcnJvdy5wbmdcIiksIFwiNDVcIiwgXCItNjVcIiwgXCIzMFwiLCBcIjMwXCIsIFwicm90YXRlKDE4MClcIik7XHJcbiAgICAgICAgdGhpcy5hZGRJbWcobmV3R3JvdXAsIFwicmVtb3ZlXCIsIHJlcXVpcmUoXCIvaW1nL3JlbW92ZS5wbmdcIiksIFwiLTEwMFwiLCBcIi01XCIsIFwiMjBcIiwgXCIyMFwiLCBcInJvdGF0ZSgxODApXCIpO1xyXG4gICAgICAgIC8vIGR1bW15IHZ5YmVyIGJhcmV2XHJcbiAgICAgICAgbmV3R3JvdXAuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjb2xvclBpY2tlciBoaWRlYWJsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIixjb2xvcilcclxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBcIi02MFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImN5XCIsIFwiOTBcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJyXCIsIFwiMjBcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJibGFja1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCBcIjFweFwiKTtcclxuXHJcbiAgICAgICAgLy8gZWxlbWVudCBwcm8gdmxhc3RuaSB2eWJlciBhIHptZW51IGJhcmV2XHJcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMuY2FudmFzKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwiaW5wdXRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0eXBlXCIsIFwiY29sb3JcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBgaW5wdXRQaWNrZXIgJHtjbHNOYW1lfWApO1xyXG4gICAgfVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIG9rZW5rbyBwcm8gbmFwb3ZlZHUgdSBqZWRub3RsaXZ5Y2ggdWRhbG9zdGlcclxuICAgIG1ha2VEZXNjcihpbmZvKSB7XHJcbiAgICAgICAgbGV0IGRlc2NyID0gZDMuc2VsZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xyXG4gICAgICAgIGRlc2NyLmF0dHIoXCJpZFwiLCBcInRvb2x0aXBcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgIGxldCB0bXAgPSBkZXNjci5hcHBlbmQoXCJkaXZcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxlZnRcIik7XHJcbiAgICAgICAgdG1wLmFwcGVuZChcImgyXCIpLnRleHQoaW5mby5uYW1lKTtcclxuICAgICAgICB0bXAuYXBwZW5kKFwicFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiZGVzY19kYXRlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGRhdGVVdGlscy5nZXREYXRlTmFtZShpbmZvLmJja194KSk7XHJcbiAgICAgICAgdG1wLmFwcGVuZChcInBcIikudGV4dChpbmZvLmRlc2MpO1xyXG4gICAgICAgIGlmIChpbmZvLmZpbHRlcnMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB0bXAgPSBkZXNjci5hcHBlbmQoXCJkaXZcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJyaWdodFwiKTtcclxuICAgICAgICAgICAgdG1wLmFwcGVuZChcImgyXCIpXHJcbiAgICAgICAgICAgICAgICAudGV4dChcIlNvdXZpc2Vqw61jw60gxI1hc292w6kgbGlua3lcIik7XHJcbiAgICAgICAgICAgIHRtcCA9IHRtcC5hcHBlbmQoXCJ1bFwiKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmZvLmZpbHRlcnMubGVuZ3RoOyBpKysgKVxyXG4gICAgICAgICAgICAgICAgdG1wLmFwcGVuZChcImxpXCIpLnRleHQoaW5mby5maWx0ZXJzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc2NyO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNwb2plbmkgb2JyYXprdSB1ZGFsb3N0aSBzIGplaG8gcG9waXNlbVxyXG4gICAgYXBwZW5kSW5mb1RvKGl0ZW0sIGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuYXR0cihcImNsYXNzXCIsIHRoaXMuZ2V0Q2xhc3MoaXRlbS5jbHMpKVxyXG4gICAgICAgICAgICAuYXR0cihcImhyZWZcIiwgaXRlbS5pY29uKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIixpdGVtLnkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiYmNrcC14XCIsIGl0ZW0uYmNrX3gpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCB0aGlzLmNvbnRleHQueHQyKGl0ZW0uYmNrX3gpKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLm1pbldpZHRoRXZlbnQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGhpcy5taW5XaWR0aEV2ZW50KVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgtXCIgKyB0aGlzLm1pbldpZHRoRXZlbnQgLyAyICsgXCIsMClcIik7XHJcbiAgICAgICAgY29uc3QgZGVzYyA9IHRoaXMubWFrZURlc2NyKGl0ZW0pO1xyXG4gICAgICAgIHRpcHB5KGV2ZW50Lm5vZGUoKSwge1xyXG4gICAgICAgICAgICBjb250ZW50OiBkZXNjLm5vZGUoKS5pbm5lckhUTUwsXHJcbiAgICAgICAgICAgIGFsbG93SFRNTDogdHJ1ZSxcclxuICAgICAgICAgICAgdGhlbWU6IFwidG9vbHRpcFwiLFxyXG4gICAgICAgICAgICBwbGFjZW1lbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogWzUwMCwyMDBdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRlY2thIHYgbWluaW1hcGVcclxuICAgIGFwcGVuZE1pbmltYXBNYXJrKGl0ZW0pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtKTtcclxuICAgICAgICBkMy5zZWxlY3QoXCIubWluaW1hcERyYXdcIikuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgYG1pbmlFdmVudCAke3RoaXMuZ2V0Q2xhc3MoaXRlbS5jbHMpfWApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCBcIjVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBgJHt0aGlzLmNvbnRleHQueHQoaXRlbS5iY2tfeCkgKyB0aGlzLm1pbmltYXBYfWApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgXCIxNy41XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBkMy5zZWxlY3QoYCNwYXRocyAuJHt0aGlzLmdldENsYXNzKGl0ZW0uY2xzKX1gKS5hdHRyKFwic3Ryb2tlXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1bWlzdGVuaSB1ZGFsb3N0aVxyXG4gICAgcGxhY2VFdmVudHMoYXBwZW5kVG8sIGV2ZW50cykge1xyXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgZXZlbnRzKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZEluZm9UbyhpdGVtLCBhcHBlbmRUby5hcHBlbmQoXCJpbWFnZVwiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kTWluaW1hcE1hcmsoaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHVtaXN0ZW5pIHNrdXBpbnkgbmVrb2xpa2EgdWRhbG9zdGkgdiBqZWRub20gbWlzdGVcclxuICAgIHBsYWNlR3JvdXAoYXBwZW5kVG8sIHgsIHksIGwpIHtcclxuICAgICAgICBsZXQgZyA9IGFwcGVuZFRvLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImdyb3VwXCIpXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG1wID0gZDMuc2VsZWN0KGQudGFyZ2V0LnBhcmVudE5vZGUpLnNlbGVjdChcInJlY3RcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsID0gdG1wLmF0dHIoXCJsZW5ndGhcIik7XHJcbiAgICAgICAgICAgICAgICB0bXAuYXR0cihcIndpZHRoXCIsbCo1MCk7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoZC50YXJnZXQucGFyZW50Tm9kZSkuc2VsZWN0KFwiLnBsYWNlaG9sZGVyXCIpLmF0dHIoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChkLnRhcmdldC5wYXJlbnROb2RlKS5zZWxlY3RBbGwoXCIuaGlkZWFibGVcIikubm9kZXMoKS5mb3JFYWNoKGQgPT4gZDMuc2VsZWN0KGQpLmF0dHIoXCJkaXNwbGF5XCIsIFwiaW5oZXJpdFwiKSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoZC50YXJnZXQucGFyZW50Tm9kZSkuc2VsZWN0KFwicmVjdFwiKS5hdHRyKFwid2lkdGhcIiwgdGhpcy5taW5XaWR0aEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChkLnRhcmdldC5wYXJlbnROb2RlKS5zZWxlY3QoXCIucGxhY2Vob2xkZXJcIikuYXR0cihcImRpc3BsYXlcIiwgXCJpbmhlcml0XCIpO1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KGQudGFyZ2V0LnBhcmVudE5vZGUpLnNlbGVjdEFsbChcIi5oaWRlYWJsZVwiKS5ub2RlcygpLmZvckVhY2goZCA9PiBkMy5zZWxlY3QoZCkuYXR0cihcImRpc3BsYXlcIiwgXCJub25lXCIpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZy5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCB4KVxyXG4gICAgICAgICAgICAuYXR0cihcImJja3AteFwiLCB4KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgeSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB0aGlzLm1pbldpZHRoRXZlbnQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcImFudGlxdWV3aGl0ZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImxlbmd0aFwiLCBsKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgtXCIgKyB0aGlzLm1pbldpZHRoRXZlbnQgLyAyICsgXCIsMClcIik7XHJcbiAgICAgICAgZy5hcHBlbmQoXCJpbWFnZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImhyZWZcIiwgcmVxdWlyZShcIi9pbWcvZ3JvdXAucG5nXCIpKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwicGxhY2Vob2xkZXJcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIHgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiYmNrcC14XCIsIHgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCB5KVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgtXCIgKyB0aGlzLm1pbldpZHRoRXZlbnQgLyAyICsgXCIsMClcIik7XHJcbiAgICAgICAgcmV0dXJuIGc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdW1pc3RpIGV2ZW50IG5lYm8gc2t1cGludSBkbyB2aXp1YWxpemFjZVxyXG4gICAgcGxhY2VDb21tb25FdmVudHMoYXBwZW5kVG8sIGV2ZW50cykge1xyXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgZXZlbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmV2ZW50bGlzdC5sZW5ndGggPT09IDEpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZEluZm9UbyhpdGVtLmV2ZW50bGlzdFswXSwgYXBwZW5kVG8uYXBwZW5kKFwiaW1hZ2VcIikpO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW0uZXZlbnRsaXN0KTtcclxuICAgICAgICAgICAgICAgIC8vIHVkZWxlaiBza3VwaW51XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXAgPSB0aGlzLnBsYWNlR3JvdXAoYXBwZW5kVG8sIGl0ZW0uZXZlbnRsaXN0WzBdLngsaXRlbS5ldmVudGxpc3RbMF0ueSxpdGVtLmV2ZW50bGlzdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdmxveiB1ZGFsb3N0aSBzZSB2c2VtaSBkYXR5XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBbaWR4LCBldmVudF0gaW4gaXRlbS5ldmVudGxpc3QuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuYmNrX3ggPSBldmVudC5iY2tfeCArIGlkeCAqIHRoaXMubWluV2lkdGhFdmVudDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZEluZm9UbyhldmVudCwgZ3JvdXAuYXBwZW5kKFwiaW1hZ2VcIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kTWluaW1hcE1hcmsoaXRlbS5ldmVudGxpc3RbMF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB2eWtyZXNsaSB2c2VjaG55IHZ5YnJhbmUgY2Fzb3ZlIG9zeVxyXG4gICAgZHJhd1JlcyhyZXMpIHtcclxuICAgICAgICB0aGlzLmZpbGxQYXRocyhkMy5zZWxlY3QoXCIjcGF0aHNcIiksIHJlcy5wYXRocyk7XHJcbiAgICAgICAgdGhpcy5maWxsRW1ibGVtcyhkMy5zZWxlY3QoXCIjZW1ibGVtc1wiKSwgcmVzLnBhdGhzKTtcclxuICAgICAgICBsZXQgc3ZnVGFyZ2V0ID0gZDMuc2VsZWN0KFwiI3RpbWVsaW5lX2Vsc1wiKTtcclxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIjdGltZWxpbmVfZWxzIC5ncm91cFwiKS5yZW1vdmUoKTtcclxuICAgICAgICBkMy5zZWxlY3RBbGwoXCIjdGltZWxpbmVfZWxzIGltYWdlXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIi5taW5pbWFwRHJhdyAubWluaUV2ZW50XCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMucGxhY2VFdmVudHMoc3ZnVGFyZ2V0LCByZXMuZXZlbnRzKTtcclxuICAgICAgICB0aGlzLnBsYWNlQ29tbW9uRXZlbnRzKHN2Z1RhcmdldCwgcmVzLmNvbW1vbkV2ZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8vIG9kc3RyYW5pIHNwZWNpZmlrb3Zhbm91IG1ub3ppbnUgZWxlbWVudHVcclxuICAgIC8vIHBvdHJlYnVqZSBqYWtvIHZzdHVwIHBvbGUgcHJ2a3VcclxuICAgIHJlbW92ZVNwZWNpZmljSXRlbXMoaXRlbXMpIHtcclxuICAgICAgICBmb3IobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0QWxsKGl0ZW0pLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBvZHN0cmFuaSBkZWZpbm92YW5vdSBzYWR1IHBydmt1XHJcbiAgICByZW1vdmVJdGVtcygpIHtcclxuICAgICAgICBmb3IobGV0IGl0ZW0gb2YgW1wiI3RpbWVsaW5lX2VscyAuZ3JvdXBcIiwgXCIjdGltZWxpbmVfZWxzIGltYWdlXCIsXCIubWluaW1hcERyYXcgLm1pbmlFdmVudFwiLFwiI3BhdGhzIHBhdGhcIixcclxuICAgICAgICAgICAgXCIjZW1ibGVtcyBnXCIsIFwiLmlucHV0UGlja2VyXCJdKSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdEFsbChpdGVtKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvLyBIZWxwZXIgZnVuY3Rpb25zXHJcbiAgICAvLyBwcmVza2FsdWogY2Fzb3ZlIG9zeSBkbGUgYWt0dWFsbmlobyBwcmlibGl6ZW5pXHJcbiAgICByZXNjYWxlVGltZWxpbmUoKSB7XHJcbiAgICAgICAgZDMuc2VsZWN0KFwiI3RpbWVsaW5lc1wiKS5zZWxlY3RBbGwoXCJpbWFnZVwiKS5ub2RlcygpLmZvckVhY2goKGQsaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gTnVtYmVyKGQzLnNlbGVjdChkKS5hdHRyKFwiYmNrcC14XCIpKTtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KGQpLmF0dHIoXCJ4XCIsIGAke3RoaXMuY29udGV4dC54dDIoeCl9YCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJlc2thbG92YW5pIHNrdXBpblxyXG4gICAgcmVzY2FsZUdyb3VwcyhjdHgpIHtcclxuICAgICAgICBsZXQgeCA9IE51bWJlcihkMy5zZWxlY3QodGhpcykuYXR0cihcImJja3AteFwiKSk7XHJcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ4XCIsIGAke3RoaXMuY29udGV4dC54dDIoeCl9YCk7XHJcbiAgICAgICAgeCA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3QoXCIucGxhY2VobGRlclwiKS5hdHRyKFwiYmNrcC14XCIpO1xyXG4gICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3QoXCIucGxhY2VobGRlclwiKS5hdHRyKFwieFwiLCBgJHt0aGlzLmNvbnRleHQueHQyKHgpfWApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwcmF2IHphZGFub3UgdHJpZHUgbmEgcG91eml0ZWxub3UgcG9kb2J1XHJcbiAgICBnZXRDbGFzcyhjbHMpIHtcclxuICAgICAgICByZXR1cm4gY2xzLnNwbGl0KFwiIFwiKS5qb2luKFwiXCIpLnJlcGxhY2VBbGwoXCIuXCIsIFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tU2VsZWN0aW9uIHV0aWxzLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvLyBuYXN0ZXZlbmkgc3R5bHUgemFkYW5lbXUgcHJ2a3VcclxuICAgIHNldFN0eWxlKHRhcmdldCwgc3R5bGUsIHZhbHVlKSB7XHJcbiAgICAgICAgZDMuc2VsZWN0KHRhcmdldCkuc3R5bGUoc3R5bGUsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB6aXNrYW5pIHN0eWx1IHphZGFuZWhvIHBydmt1XHJcbiAgICBnZXRTdHlsZSh0YXJnZXQsIHN0eWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0YXJnZXQpLnN0eWxlKHN0eWxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBuYXN0YXZlbmkgYXRyaWJ1dHUgemFkYW5lbXUgcHJ2a3VcclxuICAgIHNldEF0dHJpYih0YXJnZXQsIGF0dHJpYiwgdmFsdWUpIHtcclxuICAgICAgICBkMy5zZWxlY3QodGFyZ2V0KS5hdHRyKGF0dHJpYiwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHppc2thbmkgYXRyaWJ1dHUgemFkYW5laG8gcHJ2a3VcclxuICAgIGdldEF0dHJpYih0YXJnZXQsIHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0YXJnZXQpLmF0dHIodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG5hc3RhdmVuaSBjYWxsYmFja3UgemFkYW5lbXUgcHJ2a3UgcyB1csSNaXRvdSBha2NpXHJcbiAgICBzZXRDYWxsQmFjayh0YXJnZXQsIGFjdGlvbiwgY2IpIHtcclxuICAgICAgICBkMy5zZWxlY3QodGFyZ2V0KS5vbihhY3Rpb24sIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBuYWN0ZW5pIGVsZW1lbnR1IHogdml6dWFsaXphY2VcclxuICAgIGdldEVsZW1lbnQodGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG5hY3RlbmkgdnNlY2ggc3BlY2lmaWtvdmFueWNoIGVsZW1lbnR1IHogdml6dWFsaXphY2VcclxuICAgIGdldEFsbEVsZW1lbnRzKHRhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBkMy5zZWxlY3RBbGwodGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLy0tLS0tLS0tdXRpbHMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkwMzE2NTkvY2FsY3VsYXRlLXdpZHRoLW9mLXRleHQtYmVmb3JlLWRyYXdpbmctdGhlLXRleHRcclxuICAgIC8vIHZ5cG9jZXQgc2lya3kgdGV4dHUgeiB2ZWxpa29zdGkgZm9udHUgYSB0eXB1IGZvbnR1XHJcbiAgICBCcm93c2VyVGV4dCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLFxyXG4gICAgICAgICAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWVhc3VyZXMgdGhlIHJlbmRlcmVkIHdpZHRoIG9mIGFyYml0cmFyeSB0ZXh0IGdpdmVuIHRoZSBmb250IHNpemUgYW5kIGZvbnQgZmFjZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIG1lYXN1cmVcclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gZm9udFNpemUgVGhlIGZvbnQgc2l6ZSBpbiBwaXhlbHNcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZm9udEZhY2UgVGhlIGZvbnQgZmFjZSAoXCJBcmlhbFwiLCBcIkhlbHZldGljYVwiLCBldGMuKVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSB3aWR0aCBvZiB0aGUgdGV4dFxyXG4gICAgICAgICAqKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRXaWR0aCh0ZXh0LCBmb250U2l6ZSwgZm9udEZhY2UpIHtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCAnICsgZm9udEZhY2U7XHJcbiAgICAgICAgICAgIHJldHVybiBjdHgubWVhc3VyZVRleHQodGV4dCkud2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXRXaWR0aDogZ2V0V2lkdGhcclxuICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxuXHJcbn0iLCIvLyB0cmlkYSBwcm8ga29tdW5pa2FjaSBzZSBzZXJ2ZXJvdm91IGNhc3RpXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tdW5pY2F0aW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyemkgaW5mb3JtYWNlIGsgdnlicmFuZW11IHBydmt1IHYgaW5wdXQgb2tlbmt1IHBvZCBrYXRlZ29yaWVtaVxyXG4gICAgc2VhcmNoSXRlbSA9IHtuYW1lOiBcIlwiLCBpZDogLTF9O1xyXG5cclxuICAgIC8vIG5hc3RhdiBzZWFyY2hJdGVtIG5hIHphZGFuZSBob2Rub3R5XHJcbiAgICBmaWxsU2VhcmNoSXRlbShuYW1lLCBpZCwgY2F0KXtcclxuICAgICAgICB0aGlzLnNlYXJjaEl0ZW0ubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hJdGVtLmlkID0gTnVtYmVyKGlkKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnNlYXJjaEl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHptZW5hIHYgZHJvcGRvd24gbWVudSBwcm8gcHJpZGF2YW5pXHJcbiAgICBjaGFuZ2VTZWFyY2hlZChlLCBzdXApIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhlLnRhcmdldCk7XHJcbiAgICAgICAgZSA9IGUudGFyZ2V0O1xyXG4gICAgICAgIGQzLnNlbGVjdEFsbChcIiNjb250ZW50IC5zZWFyY2hTZWxcIikubm9kZXMoKS5mb3JFYWNoKChlbCkgPT4ge2lmIChlbC5hdHRyaWJ1dGVzLmNsYXNzLnZhbHVlID09PSBcInNlYXJjaFNlbFwiKSBlbC5hdHRyaWJ1dGVzLmNsYXNzLnZhbHVlID0gXCJcIjt9KTtcclxuICAgICAgICBzdXAuZmlsbFNlYXJjaEl0ZW0oZS50ZXh0Q29udGVudCwgZS5hdHRyaWJ1dGVzLmlkYS52YWx1ZSwgZS5hdHRyaWJ1dGVzLmNhdC52YWx1ZSk7XHJcbiAgICAgICAgZS5hdHRyaWJ1dGVzW1wiY2xhc3NcIl0udmFsdWUgPSBcInNlYXJjaFNlbFwiO1xyXG4gICAgICAgIGQzLnNlbGVjdChcIi5mb3JtX2NvbnRyb2xcIikubm9kZSgpLnZhbHVlID0gZS50ZXh0Q29udGVudDtcclxuICAgICAgICBkMy5zZWxlY3QoXCIjY29udGVudFwiKS5zdHlsZShcInZpc2liaWxpdHlcIiwgXCJoaWRkZW5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdnlwbG4gZHJvcCBkb3duIGxpc3RcclxuICAgIGZpbGxEcm9wRG93bihsaXN0LCBkYXRhKSB7XHJcbiAgICAgICAgLy8gdmVtIHBydm5pIGVsZW1lbnRcclxuICAgICAgICBsZXQgY2hpbGQgPSBsaXN0Lm5vZGUoKS5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgLy8gcHJvamRpIGRhdGFcclxuICAgICAgICBmb3IgKGk7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIHBva3VkIGplIHByaXRvbW55IGRhbHNpIGVsZW1lbnQgdGFrIGhvIHZ5cGxuXHJcbiAgICAgICAgICAgIGlmIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KGNoaWxkKS5hdHRyKFwiaWRhXCIsIGRhdGFbaV0uaWQpO1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KGNoaWxkKS5hdHRyKFwiY2F0XCIsIGRhdGFbaV0uY2F0ZWdvcnkuaWQpO1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KGNoaWxkKS50ZXh0KGRhdGFbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSArIDEgPCBkYXRhLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gamluYWsgcHJpZGVqIGRhbHNpIGEgbmFzdGF2IGhvXHJcbiAgICAgICAgICAgICAgICBsaXN0LmFwcGVuZChcImxpXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJpZGFcIiwgZGF0YVtpXS5pZClcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImNhdFwiLCBkYXRhW2ldLmNhdGVnb3J5LmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJcIilcclxuICAgICAgICAgICAgICAgICAgICAub24oXCJjbGlja1wiLCAoZSkgPT4ge3RoaXMuY2hhbmdlU2VhcmNoZWQoZSwgdGhpcyl9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KGRhdGFbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcG9rdWQgbmVjbyBwcmVieXZhIHRhayB0byBvZHN0cmFuXHJcbiAgICAgICAgaWYgKGkgPT09IGRhdGEubGVuZ3RoICYmIGNoaWxkKVxyXG4gICAgICAgICAgICB3aGlsZSAobGlzdC5ub2RlKCkubGFzdEVsZW1lbnRDaGlsZCAhPT0gY2hpbGQpXHJcbiAgICAgICAgICAgICAgICBsaXN0Lm5vZGUoKS5yZW1vdmVDaGlsZChsaXN0Lm5vZGUoKS5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgICAgICAvLyBwb2t1ZCBzZSBuaWMgbmV2eXBsbnVqZSB0YWsgdG8gY2VsZSBzbWF6XHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB3aGlsZSAobGlzdC5ub2RlKCkubGFzdEVsZW1lbnRDaGlsZClcclxuICAgICAgICAgICAgICAgIGxpc3Qubm9kZSgpLnJlbW92ZUNoaWxkKGxpc3Qubm9kZSgpLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHppc2tlaiB6ZSBzZXJ2ZXJ1IHZzZSBzZSB6YWRhbnltIHZ5cmF6ZW0gc2VhcmNoRm9yXHJcbiAgICBhc3luYyBmZXRjaFRhZ3Moc2VhcmNoRm9yLCBkYXRhKSB7XHJcbiAgICAgICAgLy8gZG9wdGVqIHNlIG5hIHNlcnZlclxyXG4gICAgICAgIGxldCByZXNwID0gYXdhaXQgZmV0Y2godGhpcy5jb250ZXh0LnVybCArIGAvdGFnL2J5Q29udGVudD9zZWFyY2g9JHtzZWFyY2hGb3J9YCk7XHJcbiAgICAgICAgLy8gcGFyc2VcclxuICAgICAgICBkYXRhID0gYXdhaXQgcmVzcC5qc29uKCk7XHJcbiAgICAgICAgLy8gdWxveiB6aXNrYW5hIGRhdGFcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5kYXRhLnNvbWUoZWwgPT4gZWwubmFtZSA9PT0gaXRlbS5uYW1lKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5kYXRhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBjbHNOYW1lOiBpdGVtLm5hbWUuc3BsaXQoXCIgXCIpLmpvaW4oXCJcIikucmVwbGFjZUFsbChcIi5cIiwgXCJcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6aXRlbS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTp7aWQ6IGl0ZW0uY2F0ZWdvcnkuaWQsIGljb246IGl0ZW0uY2F0ZWdvcnkuaWNvbn0sXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogaXRlbS5pY29uID8gaXRlbS5pY29uLnBhdGggOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOnVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIG5hamRpIHBvbG96a3kgeiBkYXRhYmF6ZSBvZHBvdmlkYWppY2kgcHNhbmVtdSB0ZXh0dVxyXG4gICAgYXN5bmMgc2VhcmNoQ2F0cygpIHtcclxuICAgICAgICAvLyB2eWJlciBkcm9wZG93blxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBkMy5zZWxlY3QoXCIjY29udGVudFwiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhzZWxlY3RlZCk7XHJcbiAgICAgICAgLy8gemlza2plIGhsZWRhbm91IGZyYXppXHJcbiAgICAgICAgY29uc3Qgc2VhcmNoRm9yID0gZDMuc2VsZWN0KFwiLmZvcm1fY29udHJvbFwiKS5ub2RlKCkudmFsdWU7XHJcbiAgICAgICAgLy8gcG9rdWQgbmVuaSBwcmF6ZG5hXHJcbiAgICAgICAgaWYgKHNlYXJjaEZvciAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAvLyB6b2JyYXogZHJvcGRvd25cclxuICAgICAgICAgICAgZDMuc2VsZWN0KFwiI2NvbnRlbnRcIikuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIFwiaW5oZXJpdFwiKTtcclxuICAgICAgICAgICAgLy8gbGV0IGRhdGEgPSB0aGlzLmNvbnRleHQuZGF0YS5maWx0ZXIoaXRlbSA9PiBpdGVtLm5hbWUuaW5jbHVkZXMoc2VhcmNoRm9yKSAmJiAoaXRlbS5jYXRlZ29yeS5pZCA9PT0gTnVtYmVyKHNlbGVjdGVkLnZhbHVlKSB8fCBOdW1iZXIoc2VsZWN0ZWQudmFsdWUpID09PSAwKSk7XHJcbiAgICAgICAgICAgIC8vIG5hY3RpIGRhdGEgeiBidWZmZXJ1XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5jb250ZXh0LmRhdGEuZmlsdGVyKGl0ZW0gPT4gaXRlbS5uYW1lLmluY2x1ZGVzKHNlYXJjaEZvcikpO1xyXG4gICAgICAgICAgICAvLyBwb2t1ZCBqZSB0byBwcnZuaSBuYWNpdGFuaSwgdGFrIG5la3RlcmEgZGF0YSBuZW11c2kgYnl0IHByaXRvbW5hLCBuYWN0aSBqZSB6ZSBzZXJ2ZXJ1XHJcbiAgICAgICAgICAgIGlmICghZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZmV0Y2hUYWdzKHNlYXJjaEZvciwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAvLyBkYXRhID0gdGhpcy5jb250ZXh0LmRhdGEuZmlsdGVyKGl0ZW0gPT4gaXRlbS5uYW1lLmluY2x1ZGVzKHNlYXJjaEZvcikgJiYgKGl0ZW0uY2F0ZWdvcnkuaWQgPT09IE51bWJlcihzZWxlY3RlZC52YWx1ZSkgfHwgTnVtYmVyKHNlbGVjdGVkLnZhbHVlKSA9PT0gMCkpO1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuY29udGV4dC5kYXRhLmZpbHRlcihpdGVtID0+IGl0ZW0ubmFtZS5pbmNsdWRlcyhzZWFyY2hGb3IpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBmaWx0cnVqIGRhdGFcclxuICAgICAgICAgICAgdGhpcy5maWxsRHJvcERvd24obGlzdCwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHNjaG92ZWogZHJvcGRvd25cclxuICAgICAgICAgICAgZDMuc2VsZWN0KFwiI2NvbnRlbnRcIikuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICBkMy5zZWxlY3RBbGwoXCIjY29udGVudFwiKS5lYWNoKGZ1bmN0aW9uIChkLGkpIHtkMy5zZWxlY3QodGhpcykuYXR0cltcImNsYXNzXCJdID0gXCJcIjt9KTtcclxuICAgICAgICAgICAgLy8gdnljaXN0aSBzZWFyY2ggaXRlbVxyXG4gICAgICAgICAgICB0aGlzLmZpbGxTZWFyY2hJdGVtKFwiXCIsIC0xLCAtMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHVrbGFkYSBkbyBkYXRhYnVmZmVydSBldmVudHkgb3N5IHZ5YnJhbmUgeiBkcm9wZG93biBtZW51XHJcbiAgICBhc3luYyBzYXZlVG9CdWZmZXIoKSB7XHJcbiAgICAgICAgLy8gbmFqZGkgZGFueSBlbGVtZW50XHJcbiAgICAgICAgbGV0IGVsID0gdGhpcy5jb250ZXh0LmRhdGEuZmluZEluZGV4KGUgPT4gZS5pZCA9PT0gdGhpcy5zZWFyY2hJdGVtLmlkKTtcclxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuY29udGV4dC5kYXRhW2VsXTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnNlYXJjaEl0ZW0pO1xyXG4gICAgICAgIC8vIHBva3VkIGplc3RlIG5lbWFtZSBqZWhvIGRhdGFcclxuICAgICAgICBpZiAoZWwgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIHBva3VkIG5lbWFtZSB1ZGFsc3RpIHBhayBqZSB6aXNrZWpcclxuICAgICAgICAgICAgaWYgKGl0ZW0uZXZlbnRzID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3AgPSBhd2FpdCBmZXRjaCh0aGlzLmNvbnRleHQudXJsICsgYC9ldmVudC9ieUZpbHRlcklkP2lkPSR7dGhpcy5zZWFyY2hJdGVtLmlkfWApO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ldmVudHMgPSBhd2FpdCByZXNwLmpzb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBwb2t1ZCBqZSBtYSBhIG5lbmkgdiBha3Rpdm5pbSBsaXN0dVxyXG4gICAgICAgICAgICBpZiAoaXRlbS5ldmVudHMubGVuZ3RoICE9PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuYWN0aXZlLmZpbmQoZSA9PiBlLmlkID09PSB0aGlzLnNlYXJjaEl0ZW0uaWQpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgLy8gcHJpZGVqIGRhbm91IG9zdSBhIGplamkgaW5mb3JtYWNlIGsgYWt0aXZuaW0gcHJ2a3VtXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuYWN0aXZlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6dGhpcy5zZWFyY2hJdGVtLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xzTmFtZTogaXRlbS5jbHNOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkOnRoaXMuc2VhcmNoSXRlbS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBldmVudHM6aXRlbS5ldmVudHMsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29udGV4dC5nZXROZXh0RnJlZUNvbG9yKCksXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvblBhdGg6IGl0ZW0uaWNvbiAhPT0gdW5kZWZpbmVkID8gaXRlbS5pY29uIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW0uY2F0ZWdvcnkuaWNvbiAhPT0gdW5kZWZpbmVkID8gaXRlbS5jYXRlZ29yeS5pY29uLnBhdGggOiBcIi9pbWcvdGFncy9ibGFjay1ib3gucG5nXCIpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbnRleHQuYWN0aXZlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tZGVidWdnaW5nIHBhcnRcclxuICAgIGNsZWFyRWxlbWVudChuYW1lKSB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRzID0gZDMuc2VsZWN0KG5hbWUpO1xyXG4gICAgICAgIHdoaWxlIChldmVudHMubm9kZSgpLmZpcnN0RWxlbWVudENoaWxkKVxyXG4gICAgICAgICAgICBldmVudHMubm9kZSgpLnJlbW92ZUNoaWxkKGV2ZW50cy5ub2RlKCkubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXRlcmF0ZUV2ZW50cyhuYW1lLCBkYXRhKSB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRzID0gZDMuc2VsZWN0KFwiI2V2ZW50c1Jlc3VsdFwiKTtcclxuICAgICAgICBldmVudHMuYXBwZW5kKFwiaDJcIikudGV4dChuYW1lICsgXCIgLSBwb8SNZXQgdWTDoWxvc3TDrTpcIiArIGRhdGEubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gZXZlbnRzLmFwcGVuZChcInVsXCIpO1xyXG4gICAgICAgICAgICBsaXN0LmFwcGVuZChcImxpXCIpLnRleHQoXCJpZDogXCIgKyBpdGVtW1wiaWRcIl0pO1xyXG4gICAgICAgICAgICBsaXN0LmFwcGVuZChcImxpXCIpLnRleHQoXCJOYXpldjogXCIgKyBpdGVtW1wibmFtZVwiXSk7XHJcbiAgICAgICAgICAgIGxpc3QuYXBwZW5kKFwibGlcIikudGV4dChcIlBvcGlzOiBcIiArIGl0ZW1bXCJkZXNjcmlwdGlvblwiXSk7XHJcbiAgICAgICAgICAgIGxpc3QuYXBwZW5kKFwibGlcIikudGV4dChcIlphY2F0ZWs6IFwiICsgaXRlbVtcImJlZ2luXCJdKTtcclxuICAgICAgICAgICAgbGlzdC5hcHBlbmQoXCJsaVwiKS50ZXh0KFwiSWNvbnNQYXRoOiBcIiArIGl0ZW1bXCJpY29uXCJdW1wicGF0aFwiXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2ZW50cy5hcHBlbmQoXCJoclwiKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzaG93RXZlbnRzVG9JZCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHtjb250cm9sLnZhbHVlfWApO1xyXG4gICAgICAgIHRoaXMuY2xlYXJFbGVtZW50KFwiI2V2ZW50c1Jlc3VsdFwiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZXh0KTtcclxuICAgICAgICAvLyBkb3B0YXQgc2UgbmEgZXZlbnR5XHJcbiAgICAgICAgbGV0IHJlc3AgPSBhd2FpdCBmZXRjaCh0aGlzLmNvbnRleHQudXJsICsgYC9ldmVudC9ieUZpbHRlcklkP2lkPSR7c2VhcmNoSXRlbS5pZH1gKTtcclxuICAgICAgICBsZXQgZGF0YSA9IGF3YWl0IHJlc3AuanNvbigpO1xyXG4gICAgICAgIC8vIHZ5cHNhdCB2eXNsZWRla1xyXG4gICAgICAgIHRoaXMuaXRlcmF0ZUV2ZW50cyh0aGlzLnNlYXJjaEl0ZW0ubmFtZSwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxkZWJ1Z2dpbmcgcGFydFxyXG59IiwiLy8gdHJpZGEga3RlcmEgZHJ6aSB6YWtsYWRuaSBwb3RyZWJuZSBpbmZvcm1hY2VcclxuaW1wb3J0IGRhdGVVdGlscyBmcm9tIFwiLi9jdXJyZW50VmVyL0RhdGVVdGlscy5qc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGV4dCB7XHJcbiAgICAvLyBGSVhNRSBtdXNpIGJ5dCBzcHJhdm5hIHVybFxyXG4gICAgLy8gdXJsIHBybyBkb3Rhem92YW5pXHJcbiAgICB1cmwgPSBcImh0dHBzOi8vYXN0ZXJpb250aW1lbGluZXN2aXN1YWxpc2F0aW9uLnVwLnJhaWx3YXkuYXBwXCI7XHJcbiAgICBpY29VcmwgPSBcImh0dHBzOi8vYXN0ZXJpb250aW1lbGluZXMudXAucmFpbHdheS5hcHBcIjtcclxuXHJcbiAgICAvLyBwb2xlIHphdMOtbSB6w61za2Fuw71jaCBkYXQgemUgc2VydmVyb3bDqSDEjcOhc3RpXHJcbiAgICBkYXRhID0gW107XHJcbiAgICAvLyBha3R1w6FsbsSbIHpvYnJhemVuw6kgb3N5LCB6YXJvdmVuIGRyemkgcG9yYWRpXHJcbiAgICBhY3RpdmUgPSBbXTtcclxuICAgIC8vIGFrdHVhbG5pIHBvcmFkaSBvcyB6IGFjdGl2ZSB0YWsgamFrIGplIHZ5a3Jlc2xlbmVcclxuICAgIGFjdGl2ZU9yZGVyID0gW107XHJcbiAgICAvLyBtaW5pbWFsbmkgYSBtYXhpbWFsbmkgZGF0dW1cclxuICAgIG1pbkRhdGUgPSAwO1xyXG4gICAgbWF4RGF0ZSA9IDA7XHJcbiAgICAvLyBrb25zdGFudHkgayBsZXBzaW11IHphbWVyZW5pIHZlc2tlcmVobyBvYnNhaHVcclxuICAgIGxvd2VyRW5kID0gLTEwMDtcclxuICAgIHVwcGVyRW5kID0gLTUwO1xyXG5cclxuICAgIC8vIHByZWR2eWJyYW5hIGJhcmV2bmEgcGFsZXRhIHBybyBzbmFkbsOpIHJvemxpc2VuaSBqZWRub3RsaXZ5Y2ggb3NcclxuICAgIGNvbG9yUGFsbGV0ZSA9IFtcclxuICAgICAgICB7Y29sb3I6XCIjZDI1ODAwXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjMDlmZjAwXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjMDg3M2IzXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjZmZjZGFhXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjYjUzNWJhXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjMDBmZmZiXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjZmYwOTAwXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjZmZmMjAwXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjMDAzNTAwXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjMDAwMGZmXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjZmYyOWZmXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjOGE5ODAwXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjMDA5ODAwXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjZGMwMDY4XCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjZmE4Nzc1XCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjYTdjYzgyXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjNGIxOWE5XCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjYzlhNjAwXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjMjlhZGU0XCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjYTQwMGVjXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjMzhjNjZmXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjZDBhZGU3XCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjMDUwMDY3XCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjOWI3MDlhXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjNzBmZmIzXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjZmY5YmZmXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjOTkzZjAwXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjYmZiMjg3XCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjOTIzMTViXCIsIHVzZXJzOiAwfSxcclxuICAgICAgICB7Y29sb3I6XCIjOGM4YzhjXCIsIHVzZXJzOiAwfVxyXG4gICAgXTtcclxuXHJcbiAgICAvLyBza2Fsb3Zuw6FuaSBwcm8gYnJ1c2gsIGRvbWVuYSBqZSByb3pzYWggbWluRGF0ZSAtIG1heERhdGUsIHJhbmdlIGplIHJvenNhaCAwIC0gd2lkdGggKG1pbmltYXB5KVxyXG4gICAgeHQgPSBkMy5zY2FsZUxpbmVhcigpO1xyXG4gICAgLy8gZG9tZW5hIHN0ZWpuYSwgcmFuZ2UgamUgMCBheiBzaXJrYSBwbHVzIHVwcGVyIGVuZFxyXG4gICAgeHQyID0gZDMuc2NhbGVMaW5lYXIoKTtcclxuICAgIC8vIHNrYWxvdmFuaSBwcm8gdWRhbG9zdGkgdiBtaW5pbWFwZSwgdnlwb2NldCBha3R1YWxuZSB6b2JyYXpvdmFuZSBjYXN0aSBvc1xyXG4gICAgYXJlYSA9IGQzLmFyZWEoKTtcclxuICAgIC8vIG9zeSBzIGRhdHVteVxyXG4gICAgYXhpcyA9IGQzLmF4aXNCb3R0b20odGhpcy54dDIpXHJcbiAgICAgICAgLnRpY2tzKDE1KVxyXG4gICAgICAgIC50aWNrU2l6ZUlubmVyKC05MDApXHJcbiAgICAgICAgLnRpY2tTaXplT3V0ZXIoMCk7XHJcbiAgICBicnVzaCA9IHVuZGVmaW5lZDtcclxuICAgIHpvb20gPSBkMy56b29tKClcclxuICAgICAgICAuc2NhbGVFeHRlbnQoWzEsIEluZmluaXR5XSk7XHJcblxyXG4gICAgLy8ga29uc3RydWt0b3IgdHJpZHlcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYXJlYVxyXG4gICAgICAgICAgICAuY3VydmUoZDMuY3VydmVNb25vdG9uZVgpXHJcbiAgICAgICAgICAgIC54KChkKSA9PiB7cmV0dXJuIHRoaXMueHQyKGQueCl9KVxyXG4gICAgICAgICAgICAueTAoMClcclxuICAgICAgICAgICAgLnkoKGQpID0+IHtyZXR1cm4oZC55KX0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByZWhvemVuaSBwb3JhZGkgdiBwb2xpXHJcbiAgICBzaHVmZmVsQXJyYXkoYXJyKSB7XHJcbiAgICAgICAgbGV0IG0gPSBhcnIubGVuZ3RoLCBpO1xyXG4gICAgICAgIHdoaWxlIChtKSB7XHJcbiAgICAgICAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtLS0pO1xyXG4gICAgICAgICAgICBbYXJyW2ldLCBhcnJbbV1dID0gW2FyclttXSwgYXJyW2ldXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICAvLyB6cHJlaGF6ZW5pIGVsZW1lbnR1IHBvbGUgcyBiYXJ2YW1pXHJcbiAgICBzaHVmZmVsQ29sb3JzKCkge1xyXG4gICAgICAgIHRoaXMuY29sb3JQYWxsZXRlID0gdGhpcy5zaHVmZmVsQXJyYXkodGhpcy5jb2xvclBhbGxldGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHptZW5hIHZzZWNoIGRpbGNpY2ggY2FzdGkgcHJvIHNwcmF2bmUgem9icmF6ZW5pIC0gcm96c2FoeSwgYnJ1c2gsIHpvb20sIC4uLlxyXG4gICAgdXBkYXRlU2NhbGVzKCkge1xyXG4gICAgICAgIGxldCBib3VuZCA9IGQzLnNlbGVjdChcIiNtaW5pbWFwX0JvdW5kXCIpO1xyXG4gICAgICAgIGxldCBkYXRlcyA9IHRoaXMuYWN0aXZlLm1hcCgoaXRlbSkgPT4gaXRlbS5ldmVudHMubWFwKChldmVudCkgPT4gZXZlbnQuYmVnaW4pKS5mbGF0KClcclxuICAgICAgICAgICAgLnNvcnQoKGEsYikgPT4gYSA+IGIpO1xyXG4gICAgICAgIHRoaXMubWluRGF0ZSA9IGRhdGVzWzBdXHJcbiAgICAgICAgdGhpcy5tYXhEYXRlID0gZGF0ZXNbZGF0ZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgdGhpcy54dC5kb21haW4oW3RoaXMubWluRGF0ZSArIHRoaXMubG93ZXJFbmQsdGhpcy5tYXhEYXRlXSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCBOdW1iZXIoYm91bmQuYXR0cihcIndpZHRoXCIpKV0pO1xyXG4gICAgICAgIHRoaXMueHQyLmRvbWFpbih0aGlzLnh0LmRvbWFpbigpKVxyXG4gICAgICAgICAgICAucmFuZ2UoWzIwMCxOdW1iZXIoZDMuc2VsZWN0KFwiLmNhbnZhc0RyYXdcIikubm9kZSgpLmNsaWVudFdpZHRoKSArIHRoaXMudXBwZXJFbmRdKTtcclxuICAgICAgICBkMy5zZWxlY3QoXCIjc3RhcnRfdGltZVwiKS50ZXh0KGRhdGVVdGlscy5nZXREYXRlTmFtZSh0aGlzLm1pbkRhdGUpKTtcclxuICAgICAgICBkMy5zZWxlY3QoXCIjZW5kX3RpbWVcIikudGV4dChkYXRlVXRpbHMuZ2V0RGF0ZU5hbWUodGhpcy5tYXhEYXRlKSk7XHJcbiAgICAgICAgZDMuc2VsZWN0KFwiI2diXCIpXHJcbiAgICAgICAgICAgIC5jYWxsKHRoaXMuYnJ1c2gpXHJcbiAgICAgICAgICAgIC5jYWxsKHRoaXMuYnJ1c2gubW92ZSwgdGhpcy54dC5yYW5nZSgpLm1hcCh2YWx1ZSA9PiB2YWx1ZSArIE51bWJlcihib3VuZC5hdHRyKFwieFwiKSkpKTtcclxuICAgICAgICBkMy5zZWxlY3QoXCIjem9vbVwiKVxyXG4gICAgICAgICAgICAuY2FsbCh0aGlzLnpvb20pO1xyXG4gICAgICAgIGQzLnNlbGVjdChcIiN0aW1lc3RhbXBzXCIpXHJcbiAgICAgICAgICAgIC5jYWxsKHRoaXMuYXhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbmFzdGF2ZW5pIHNwcmF2bnljaCBpbmZvcm1hY2kgcHJvIGJydXNoXHJcbiAgICBzZXRCcnVzaChpbmZvLCBicnVzaGVkKSB7XHJcbiAgICAgICAgdGhpcy5icnVzaCA9IGQzLmJydXNoWCgpXHJcbiAgICAgICAgICAgIC5leHRlbnQoW1tpbmZvLngsNF0sW2luZm8ueCArIGluZm8ud2lkdGgsMzBdXSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hcIiwgYnJ1c2hlZCk7XHJcblxyXG4gICAgICAgIGQzLnNlbGVjdChcIiNnYlwiKVxyXG4gICAgICAgICAgICAuY2FsbCh0aGlzLmJydXNoKVxyXG4gICAgICAgICAgICAuY2FsbCh0aGlzLmJydXNoLm1vdmUsIHRoaXMueHQucmFuZ2UoKS5tYXAodmFsdWUgPT4gdmFsdWUgKyBpbmZvLngpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBuYXN0YXZlbmkgem9vbSBuYSBzcHJhdm5lIGhvZG5vdHlcclxuICAgIHNldFpvb20oaW5mbywgem9vbWVkKSB7XHJcbiAgICAgICAgbGV0IHRyZXh0ZW50ID0gW1swLDBdLFtpbmZvLndpZHRoLGQzLnNlbGVjdChcIi5jYW52YXNEcmF3XCIpLm5vZGUoKS5jbGllbnRIZWlnaHRdXTtcclxuICAgICAgICB0aGlzLnpvb21cclxuICAgICAgICAgICAgLmV4dGVudCh0cmV4dGVudClcclxuICAgICAgICAgICAgLnRyYW5zbGF0ZUV4dGVudCh0cmV4dGVudClcclxuICAgICAgICAgICAgLm9uKFwiem9vbVwiLCB6b29tZWQpO1xyXG5cclxuICAgICAgICBkMy5zZWxlY3QoXCIjem9vbVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQzLnNlbGVjdChcIi5jYW52YXNEcmF3XCIpLm5vZGUoKS5jbGllbnRXaWR0aCAtIDIwMClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZDMuc2VsZWN0KFwiLmNhbnZhc0RyYXdcIikubm9kZSgpLmNsaWVudEhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAyMDAgKyBcIixcIiArIDAgKyBcIilcIilcclxuICAgICAgICAgICAgLmNhbGwodGhpcy56b29tKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBha3R1YWxpemFjZSBicnVzaCBhIHpvb20gcHJvIHptZW5lIG9rbmEgcyB2aXp1YWxpemFjaVxyXG4gICAgdXBkYXRlQnJ1c2hab29tQXhpcyhpbmZvKXtcclxuICAgICAgICBsZXQgdHJleHRlbnQgPSBbWzAsMF0sW2luZm8ud2lkdGgsZDMuc2VsZWN0KFwiLmNhbnZhc0RyYXdcIikubm9kZSgpLmNsaWVudEhlaWdodF1dO1xyXG4gICAgICAgIHRoaXMuYnJ1c2guZXh0ZW50KFtbaW5mby54LDRdLFtpbmZvLnggKyBpbmZvLndpZHRoLDMwXV0pO1xyXG4gICAgICAgIGQzLnNlbGVjdChcIiN6b29tXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZDMuc2VsZWN0KFwiLmNhbnZhc0RyYXdcIikubm9kZSgpLmNsaWVudFdpZHRoIC0gMjAwKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBkMy5zZWxlY3QoXCIuY2FudmFzRHJhd1wiKS5ub2RlKCkuY2xpZW50SGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnpvb21cclxuICAgICAgICAgICAgLmV4dGVudCh0cmV4dGVudClcclxuICAgICAgICAgICAgLnRyYW5zbGF0ZUV4dGVudCh0cmV4dGVudCk7XHJcbiAgICAgICAgdGhpcy5heGlzLnRpY2tTaXplSW5uZXIoLWQzLnNlbGVjdChcIi5jYW52YXNEcmF3XCIpLm5vZGUoKS5jbGllbnRIZWlnaHQgKyAyMzApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGtvbnRyb2xhIHZvbG55Y2ggYmFyZXYsIHRhayBhYnkgc2UgdnpkeSB2eWJyYWxhIG5la3RlcmEgeiB2b2xueWNoXHJcbiAgICBnZXROZXh0RnJlZUNvbG9yKCkge1xyXG4gICAgICAgIGZvcihsZXQgY29sb3Igb2YgdGhpcy5jb2xvclBhbGxldGUpIHtcclxuICAgICAgICAgICAgaWYgKCFjb2xvci51c2Vycykge1xyXG4gICAgICAgICAgICAgICAgY29sb3IudXNlcnMrK1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yLmNvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb2wgPSBkMy5zZWxlY3QoXCIjZWRpdF9jb2xvclwiKS5ub2RlKCkudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRDb2xvcihjb2wpO1xyXG4gICAgICAgIHJldHVybiBjb2w7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbmFzdGF2IHVyY2l0b3UgYmFydnVcclxuICAgIHNldENvbG9yKGNvbG9yKSB7XHJcbiAgICAgICAgbGV0IGlkeCA9IHRoaXMuY29sb3JQYWxsZXRlLmZpbmRJbmRleChlID0+IGUuY29sb3IgPT09IGNvbG9yKTtcclxuICAgICAgICBpZiAoaWR4ICE9PSAtMSlcclxuICAgICAgICAgICAgdGhpcy5jb2xvclBhbGxldGVbaWR4XS51c2VycysrO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHpydXMgdXJjaXRvdSBiYXJ2dVxyXG4gICAgdW5zZXRDb2xvcihjb2xvcikge1xyXG4gICAgICAgIGxldCBpZHggPSB0aGlzLmNvbG9yUGFsbGV0ZS5maW5kSW5kZXgoZSA9PiBlLmNvbG9yID09PSBjb2xvcik7XHJcbiAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5jb2xvclBhbGxldGVbaWR4XS51c2Vycy0tO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb2xvclBhbGxldGVbaWR4XS51c2VycyA8IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yUGFsbGV0ZVtpZHhdLnVzZXJzID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdnltZW4gYmFydnkgdSBqZWRub2hvIHBydmt1XHJcbiAgICBjaGFuZ2VDb2xvcihvbGRDb2xvciwgbmV3Q29sb3IpIHtcclxuICAgICAgICB0aGlzLnVuc2V0Q29sb3Iob2xkQ29sb3IpO1xyXG4gICAgICAgIHRoaXMuc2V0Q29sb3IobmV3Q29sb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG9kc3RyYW4gdnNlY2hubyB6IGFrdGl2bmlobyBsaXN0dVxyXG4gICAgcmVtb3ZlQWxsKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JQYWxsZXRlLmZvckVhY2goZWwgPT4gZWwudXNlcnMgPSAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb2RzdHJhbiB2eWJyYW55IHBydmVrIHogYWt0dmluaWhvIGxpc3R1XHJcbiAgICByZW1vdmVTZWxlY3RlZChpdGVtKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMuYWN0aXZlLmZpbmRJbmRleChlID0+IGUuY2xzTmFtZSA9PT0gaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlLnNwbGljZShpZHgsMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiY2xhc3MgRGF0ZVV0aWxzIHtcclxuICAgIC8vIHJldHVybiBhcnJheSB3aXRoIGFsbCBtb250aHMgbmFtZXMgYW5kIGhvbGlkYXkgbGFiZWxcclxuICAgIHN0YXRpYyBnZXRNb250aHNXaXRoSG9saWRheXMoKSB7XHJcbiAgICAgICAgbGV0IG1vbnRocyA9IHRoaXMubW9udGhzLm1hcChtID0+IHsgcmV0dXJuIG0ubmFtZTsgfSk7XHJcbiAgICAgICAgbW9udGhzLnB1c2goRGF0ZVV0aWxzLmhvbGlkYXlzTGFiZWwpO1xyXG4gICAgICAgIHJldHVybiBtb250aHM7XHJcbiAgICB9XHJcbiAgICAvLyBpZiB0aGUgZGF5IGluIHllYXIgaXMgaG9saWRheSwgcmV0dXJucyB0cnVlIFxyXG4gICAgc3RhdGljIGlzSG9saWRheShkYXlJblllYXIpIHtcclxuICAgICAgICByZXR1cm4gRGF0ZVV0aWxzLmhvbGlkYXlzLmhhcyhkYXlJblllYXIpO1xyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgLy8gcmV0dXJucyBtb250aCBpbiB3aGljaCB0aGUgZGF5IHRha2VzIHBsYWNlXHJcbiAgICBzdGF0aWMgZ2V0TW9udGhCeURheShkYXlJblllYXIpIHtcclxuICAgICAgICByZXR1cm4gRGF0ZVV0aWxzLm1vbnRocy5maW5kKChtb250aCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF5SW5ZZWFyID49IG1vbnRoLmZpcnN0RGF5ICYmIGRheUluWWVhciA8PSBtb250aC5sYXN0RGF5O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJucyB5ZWFyIGluIHdoaWNoIHRoZSBkYXkgdGFrZXMgcGxhY2VcclxuICAgIHN0YXRpYyBnZXRZZWFyKGRheXNGcm9tWmVybykge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKGRheXNGcm9tWmVybyAvIERhdGVVdGlscy5kYXlzSW5ZZWFyKTtcclxuICAgIH1cclxuICAgIC8vIHJldHVybnMgZGF5IGluIHllYXIgKDAtMzcwKSBmcm9tIGNvdW50IG9mIGRheXMgZnJvbSBkYXkgMFxyXG4gICAgc3RhdGljIGdldERheUluWWVhcihkYXlzRnJvbVplcm8pIHtcclxuICAgICAgICBsZXQgZGF5SW5ZZWFyID0gZGF5c0Zyb21aZXJvICUgRGF0ZVV0aWxzLmRheXNJblllYXI7XHJcbiAgICAgICAgaWYgKGRheUluWWVhciA8IDApXHJcbiAgICAgICAgICAgIGRheUluWWVhciA9IERhdGVVdGlscy5kYXlzSW5ZZWFyICsgZGF5SW5ZZWFyO1xyXG4gICAgICAgIHJldHVybiBkYXlJblllYXI7XHJcbiAgICB9XHJcbiAgICAvLyByZXR1cm4gbmFtZSBvZiBtb250aCBpbiB3aGljaCBkYXkgdGFrZXMgcGxhY2UsIGRheSBpcyByZXByZXNlbnRlZCBieSBjb3VudCBvZyBkYXlzIGZyb20gZGF5IDBcclxuICAgIHN0YXRpYyBnZXRNb250aChkYXlzRnJvbVplcm8pIHtcclxuICAgICAgICBsZXQgZGF5SW5ZZWFyID0gRGF0ZVV0aWxzLmdldERheUluWWVhcihkYXlzRnJvbVplcm8pO1xyXG4gICAgICAgIGlmIChEYXRlVXRpbHMuaXNIb2xpZGF5KGRheUluWWVhcikpXHJcbiAgICAgICAgICAgIHJldHVybiBEYXRlVXRpbHMuaG9saWRheXNMYWJlbDtcclxuICAgICAgICByZXR1cm4gRGF0ZVV0aWxzLmdldE1vbnRoQnlEYXkoZGF5SW5ZZWFyKS5uYW1lO1xyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJucyBhcnJheSB3aXRoIG5hbWUgb2YgZGF5cyBpbiB3YW50YWQgbW9udGggb3IgbGlzdCBvZiBhbGwgaG9saWRheXNcclxuICAgIHN0YXRpYyBnZXREYXlzTGlzdChtb250aCkge1xyXG4gICAgICAgIGlmIChtb250aCA9PT0gRGF0ZVV0aWxzLmhvbGlkYXlzTGFiZWwpXHJcbiAgICAgICAgICAgIHJldHVybiBbLi4udGhpcy5ob2xpZGF5cy52YWx1ZXMoKV07XHJcbiAgICAgICAgcmV0dXJuIFsuLi5BcnJheSgzMCkua2V5cygpXS5tYXAoaSA9PiB7IHJldHVybiAoaSArIDEpLnRvU3RyaW5nKCk7IH0pO1xyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJucyBkYXkgcmVwcmVzZW50ZWQgYXMgY291bnQgb2YgZGF5cyBpbiB5ZWFyXHJcbiAgICAvLyBwYXJhbWV0ZXIgZGF5c0Zyb21aZXJvIGlzIGRheSByZXByZXNlbnRlZCBhcyBjb3VudCBvZCBkYXlzIGZyb20gZGF5IDAgaW4geWVhciAwXHJcbiAgICBzdGF0aWMgZ2V0RGF5KGRheXNGcm9tWmVybykge1xyXG4gICAgICAgIGxldCBkYXlJblllYXIgPSBEYXRlVXRpbHMuZ2V0RGF5SW5ZZWFyKGRheXNGcm9tWmVybyk7XHJcbiAgICAgICAgaWYgKERhdGVVdGlscy5pc0hvbGlkYXkoZGF5SW5ZZWFyKSlcclxuICAgICAgICAgICAgcmV0dXJuIERhdGVVdGlscy5ob2xpZGF5cy5nZXQoZGF5SW5ZZWFyKTtcclxuICAgICAgICByZXR1cm4gKGRheUluWWVhciAtIERhdGVVdGlscy5nZXRNb250aEJ5RGF5KGRheUluWWVhcikuZmlyc3REYXkgKyAxKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJucyBcclxuICAgIHN0YXRpYyBnZXREYXlGcm9tWmVybyhkYXksIG1vbnRoLCB5ZWFyKSB7XHJcbiAgICAgICAgbGV0IGRheUluWWVhcjtcclxuICAgICAgICBpZiAobW9udGggPT09IERhdGVVdGlscy5ob2xpZGF5c0xhYmVsKSB7XHJcbiAgICAgICAgICAgIGRheUluWWVhciA9IFsuLi5EYXRlVXRpbHMuaG9saWRheXMuZW50cmllcygpXS5maW5kKChbZGF0ZSwgbmFtZV0pID0+IG5hbWUgPT0gZGF5KVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBtb250aERhdGEgPSBEYXRlVXRpbHMubW9udGhzLmZpbmQoKG0pID0+IG1vbnRoID09IG0ubmFtZSk7XHJcbiAgICAgICAgICAgIGRheUluWWVhciA9IG1vbnRoRGF0YS5maXJzdERheSArIHBhcnNlSW50KGRheSkgLSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgeWVhckRheXMgPSB5ZWFyICogRGF0ZVV0aWxzLmRheXNJblllYXI7XHJcbiAgICAgICAgcmV0dXJuIHllYXJEYXlzICsgZGF5SW5ZZWFyO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldERhdGVOYW1lKGRheXNGcm9tWmVybykge1xyXG4gICAgICAgIGxldCB5ZWFyID0gRGF0ZVV0aWxzLmdldFllYXIoZGF5c0Zyb21aZXJvKTtcclxuICAgICAgICBsZXQgZGF5SW5ZZWFyID0gRGF0ZVV0aWxzLmdldERheUluWWVhcihkYXlzRnJvbVplcm8pO1xyXG4gICAgICAgIGlmIChEYXRlVXRpbHMuaXNIb2xpZGF5KGRheUluWWVhcikpIHtcclxuICAgICAgICAgICAgbGV0IGRheSA9IERhdGVVdGlscy5ob2xpZGF5cy5nZXQoZGF5SW5ZZWFyKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRheSArIFwiIFwiICsgeWVhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBtb250aCA9IHRoaXMuZ2V0TW9udGhCeURheShkYXlJblllYXIpO1xyXG4gICAgICAgICAgICBsZXQgZGF5ID0gZGF5SW5ZZWFyIC0gbW9udGguZmlyc3REYXkgKyAxO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF5ICsgXCIuIFwiICsgbW9udGgubmFtZSArIFwiIFwiICsgeWVhcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLy8gY291bnQgb2YgZGF5cyBpbiBBc3RlcmlvbidzIHllYXJcclxuRGF0ZVV0aWxzLmRheXNJblllYXIgPSAzNzA7XHJcbkRhdGVVdGlscy5ob2xpZGF5c0xhYmVsID0gXCJTdsOhdGt5XCI7XHJcbi8vIGFycmF5IHdpdGggTW9udGggb2JqZWN0cy4gTW9udGggb2JqZWN0IGNvbnRhaW5zIG51bWJlcnMgb2YgbW9udGgncyBmaXJzdCBkYXkgaW4geWVhciBhbmQgbW9udGgncyBsYXN0IGRheSBpbiB5ZWFyIGFuZCBuYW1lIG9mIHllYXIgICBcclxuRGF0ZVV0aWxzLm1vbnRocyA9IFtcclxuICAgIHsgZmlyc3REYXk6IDAsIGxhc3REYXk6IDI5LCBuYW1lOiBcIkNobGFkZW5cIiB9LFxyXG4gICAgeyBmaXJzdERheTogMzAsIGxhc3REYXk6IDU5LCBuYW1lOiBcIktsaWRlblwiIH0sXHJcbiAgICB7IGZpcnN0RGF5OiA2MSwgbGFzdERheTogOTAsIG5hbWU6IFwiTm92b3Jvc3RcIiB9LFxyXG4gICAgeyBmaXJzdERheTogOTIsIGxhc3REYXk6IDEyMSwgbmFtZTogXCJSb3prdmV0XCIgfSxcclxuICAgIHsgZmlyc3REYXk6IDEyMiwgbGFzdERheTogMTUxLCBuYW1lOiBcIlplbGVuZWNcIiB9LFxyXG4gICAgeyBmaXJzdERheTogMTU0LCBsYXN0RGF5OiAxODMsIG5hbWU6IFwiUGxvZGVuXCIgfSxcclxuICAgIHsgZmlyc3REYXk6IDE4NSwgbGFzdERheTogMjE0LCBuYW1lOiBcIsW9bHV0ZW5cIiB9LFxyXG4gICAgeyBmaXJzdERheTogMjE1LCBsYXN0RGF5OiAyNDQsIG5hbWU6IFwiw5ptb3JcIiB9LFxyXG4gICAgeyBmaXJzdERheTogMjQ2LCBsYXN0RGF5OiAyNzUsIG5hbWU6IFwiVHJhdmVuXCIgfSxcclxuICAgIHsgZmlyc3REYXk6IDI3NywgbGFzdERheTogMzA2LCBuYW1lOiBcIk92b2NlblwiIH0sXHJcbiAgICB7IGZpcnN0RGF5OiAzMDcsIGxhc3REYXk6IDMzNiwgbmFtZTogXCJWxJt0cm5lY1wiIH0sXHJcbiAgICB7IGZpcnN0RGF5OiAzMzksIGxhc3REYXk6IDM2OCwgbmFtZTogXCJEZcWhdGVuXCIgfVxyXG5dO1xyXG4vLyBtYXAgb2YgYWxsIEFzdGVyaW9uJ3MgaG9saWRheXMgd2l0aCBkYXkgaW4gd2hpY2ggdGhlIGhvbGlkYXkgdGFrZXMgcGxhY2UgaW4geWVhciBhbmQgbmFtZSBvZiBob2xpZGF5ICBcclxuRGF0ZVV0aWxzLmhvbGlkYXlzID0gbmV3IE1hcChbXHJcbiAgICBbNjAsIFwiRGVuIHDDunN0dVwiXSxcclxuICAgIFs5MSwgXCJEZW4gb8SNacWhdMSbbsOtXCJdLFxyXG4gICAgWzE1MiwgXCJTdi4gbGV0bsOtY2ggZHVjaMWvIDFcIl0sXHJcbiAgICBbMTUzLCBcIlN2LiBsZXRuw61jaCBkdWNoxa8gMlwiXSxcclxuICAgIFsxODQsIFwiU3YuIG1sYWTDvWNoIHNyZGPDrVwiXSxcclxuICAgIFsyNDUsIFwiRGVuIGhvam5vc3RpXCJdLFxyXG4gICAgWzI3NiwgXCJEZW4gesOha29uxa9cIl0sXHJcbiAgICBbMzM3LCBcIlN2LiB6aW1uw61jaCBkdWNoxa8gMVwiXSxcclxuICAgIFszMzgsIFwiU3YuIHppbW7DrWNoIGR1Y2jFryAyXCJdLFxyXG4gICAgWzM2OSwgXCJTdi4gcHJvcm9rxa9cIl1cclxuXSk7XHJcbmV4cG9ydCBkZWZhdWx0IERhdGVVdGlscztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGF0ZVV0aWxzLmpzLm1hcCIsIihmdW5jdGlvbihmKXtpZih0eXBlb2YgZXhwb3J0cz09PVwib2JqZWN0XCImJnR5cGVvZiBtb2R1bGUhPT1cInVuZGVmaW5lZFwiKXttb2R1bGUuZXhwb3J0cz1mKCl9ZWxzZSBpZih0eXBlb2YgZGVmaW5lPT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kKXtkZWZpbmUoW10sZil9ZWxzZXt2YXIgZztpZih0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIil7Zz13aW5kb3d9ZWxzZSBpZih0eXBlb2YgZ2xvYmFsIT09XCJ1bmRlZmluZWRcIil7Zz1nbG9iYWx9ZWxzZSBpZih0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCIpe2c9c2VsZn1lbHNle2c9dGhpc31nLmludGVyc2VjdGlvbiA9IGYoKX19KShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xyXG4vLyBleHBvc2UgY2xhc3Nlc1xyXG5cclxuZXhwb3J0cy5Qb2ludDJEID0gcmVxdWlyZSgnLi9saWIvUG9pbnQyRCcpO1xyXG5leHBvcnRzLlZlY3RvcjJEID0gcmVxdWlyZSgnLi9saWIvVmVjdG9yMkQnKTtcclxuZXhwb3J0cy5NYXRyaXgyRCA9IHJlcXVpcmUoJy4vbGliL01hdHJpeDJEJyk7XHJcblxyXG59LHtcIi4vbGliL01hdHJpeDJEXCI6MixcIi4vbGliL1BvaW50MkRcIjozLFwiLi9saWIvVmVjdG9yMkRcIjo0fV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiAgIE1hdHJpeDJELmpzXHJcbiAqXHJcbiAqICAgY29weXJpZ2h0IDIwMDEtMjAwMiwgMjAxMyBLZXZpbiBMaW5kc2V5XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqICBNYXRyaXgyRFxyXG4gKlxyXG4gKiAgW2EgYyBlXVxyXG4gKiAgW2IgZCBmXVxyXG4gKiAgWzAgMCAxXVxyXG4gKlxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IGFcclxuICogIEBwYXJhbSB7TnVtYmVyfSBiXHJcbiAqICBAcGFyYW0ge051bWJlcn0gY1xyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IGRcclxuICogIEBwYXJhbSB7TnVtYmVyfSBlXHJcbiAqICBAcGFyYW0ge051bWJlcn0gZlxyXG4gKiAgQHJldHVybnMge01hdHJpeDJEfVxyXG4gKi9cclxuZnVuY3Rpb24gTWF0cml4MkQoYSwgYiwgYywgZCwgZSwgZikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xyXG4gICAgICAgIFwiYVwiOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAoYSAhPT0gdW5kZWZpbmVkKSA/IGEgOiAxLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiYlwiOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAoYiAhPT0gdW5kZWZpbmVkKSA/IGIgOiAwLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY1wiOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAoYyAhPT0gdW5kZWZpbmVkKSA/IGMgOiAwLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZFwiOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAoZCAhPT0gdW5kZWZpbmVkKSA/IGQgOiAxLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZVwiOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAoZSAhPT0gdW5kZWZpbmVkKSA/IGUgOiAwLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZlwiOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAoZiAhPT0gdW5kZWZpbmVkKSA/IGYgOiAwLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqICBJZGVudGl0eSBtYXRyaXhcclxuICpcclxuICogIEByZXR1cm5zIHtNYXRyaXgyRH1cclxuICovXHJcbi8vIFRPRE86IGNvbnNpZGVyIHVzaW5nIE9iamVjdCNkZWZpbmVQcm9wZXJ0eSB0byBtYWtlIHRoaXMgcmVhZC1vbmx5XHJcbk1hdHJpeDJELklERU5USVRZID0gbmV3IE1hdHJpeDJEKDEsIDAsIDAsIDEsIDAsIDApO1xyXG5NYXRyaXgyRC5JREVOVElUWS5pc0lkZW50aXR5ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfTtcclxuXHJcbi8qKlxyXG4gKiAgbXVsdGlwbHlcclxuICpcclxuICogIEBwYXJhcm0ge01hdHJpeDJEfSB0aGF0XHJcbiAqICBAcmV0dXJucyB7TWF0cml4MkR9XHJcbiAqL1xyXG5NYXRyaXgyRC5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbiAodGhhdCkge1xyXG4gICAgaWYgKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoYXQuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHRoaXMuYSAqIHRoYXQuYSArIHRoaXMuYyAqIHRoYXQuYixcclxuICAgICAgICB0aGlzLmIgKiB0aGF0LmEgKyB0aGlzLmQgKiB0aGF0LmIsXHJcbiAgICAgICAgdGhpcy5hICogdGhhdC5jICsgdGhpcy5jICogdGhhdC5kLFxyXG4gICAgICAgIHRoaXMuYiAqIHRoYXQuYyArIHRoaXMuZCAqIHRoYXQuZCxcclxuICAgICAgICB0aGlzLmEgKiB0aGF0LmUgKyB0aGlzLmMgKiB0aGF0LmYgKyB0aGlzLmUsXHJcbiAgICAgICAgdGhpcy5iICogdGhhdC5lICsgdGhpcy5kICogdGhhdC5mICsgdGhpcy5mXHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBpbnZlcnNlXHJcbiAqXHJcbiAqICBAcmV0dXJucyB7TWF0cml4MkR9XHJcbiAqL1xyXG5NYXRyaXgyRC5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkZXQxID0gdGhpcy5hICogdGhpcy5kIC0gdGhpcy5iICogdGhpcy5jO1xyXG5cclxuICAgIGlmICggZGV0MSA9PT0gMC4wICkge1xyXG4gICAgICAgIHRocm93KFwiTWF0cml4IGlzIG5vdCBpbnZlcnRpYmxlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpZGV0ID0gMS4wIC8gZGV0MTtcclxuICAgIHZhciBkZXQyID0gdGhpcy5mICogdGhpcy5jIC0gdGhpcy5lICogdGhpcy5kO1xyXG4gICAgdmFyIGRldDMgPSB0aGlzLmUgKiB0aGlzLmIgLSB0aGlzLmYgKiB0aGlzLmE7XHJcblxyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHRoaXMuZCAqIGlkZXQsXHJcbiAgICAgICAtdGhpcy5iICogaWRldCxcclxuICAgICAgIC10aGlzLmMgKiBpZGV0LFxyXG4gICAgICAgIHRoaXMuYSAqIGlkZXQsXHJcbiAgICAgICAgICBkZXQyICogaWRldCxcclxuICAgICAgICAgIGRldDMgKiBpZGV0XHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICB0cmFuc2xhdGVcclxuICpcclxuICogIEBwYXJhbSB7TnVtYmVyfSB0eFxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHR5XHJcbiAqICBAcmV0dXJucyB7TWF0cml4MkR9XHJcbiAqL1xyXG5NYXRyaXgyRC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24odHgsIHR5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXHJcbiAgICAgICAgdGhpcy5hLFxyXG4gICAgICAgIHRoaXMuYixcclxuICAgICAgICB0aGlzLmMsXHJcbiAgICAgICAgdGhpcy5kLFxyXG4gICAgICAgIHRoaXMuYSAqIHR4ICsgdGhpcy5jICogdHkgKyB0aGlzLmUsXHJcbiAgICAgICAgdGhpcy5iICogdHggKyB0aGlzLmQgKiB0eSArIHRoaXMuZlxyXG4gICAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgc2NhbGVcclxuICpcclxuICogIEBwYXJhbSB7TnVtYmVyfSBzY2FsZVxyXG4gKiAgQHJldHVybnMge01hdHJpeDJEfVxyXG4gKi9cclxuTWF0cml4MkQucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24oc2NhbGUpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcclxuICAgICAgICB0aGlzLmEgKiBzY2FsZSxcclxuICAgICAgICB0aGlzLmIgKiBzY2FsZSxcclxuICAgICAgICB0aGlzLmMgKiBzY2FsZSxcclxuICAgICAgICB0aGlzLmQgKiBzY2FsZSxcclxuICAgICAgICB0aGlzLmUsXHJcbiAgICAgICAgdGhpcy5mXHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBzY2FsZUF0XHJcbiAqXHJcbiAqICBAcGFyYW0ge051bWJlcn0gc2NhbGVcclxuICogIEBwYXJhbSB7UG9pbnQyRH0gY2VudGVyXHJcbiAqICBAcmV0dXJucyB7TWF0cml4MkR9XHJcbiAqL1xyXG5NYXRyaXgyRC5wcm90b3R5cGUuc2NhbGVBdCA9IGZ1bmN0aW9uKHNjYWxlLCBjZW50ZXIpIHtcclxuICAgIHZhciBkeCA9IGNlbnRlci54IC0gc2NhbGUgKiBjZW50ZXIueDtcclxuICAgIHZhciBkeSA9IGNlbnRlci55IC0gc2NhbGUgKiBjZW50ZXIueTtcclxuXHJcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXHJcbiAgICAgICAgdGhpcy5hICogc2NhbGUsXHJcbiAgICAgICAgdGhpcy5iICogc2NhbGUsXHJcbiAgICAgICAgdGhpcy5jICogc2NhbGUsXHJcbiAgICAgICAgdGhpcy5kICogc2NhbGUsXHJcbiAgICAgICAgdGhpcy5hICogZHggKyB0aGlzLmMgKiBkeSArIHRoaXMuZSxcclxuICAgICAgICB0aGlzLmIgKiBkeCArIHRoaXMuZCAqIGR5ICsgdGhpcy5mXHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBzY2FsZU5vblVuaWZvcm1cclxuICpcclxuICogIEBwYXJhbSB7TnVtYmVyfSBzY2FsZVhcclxuICogIEBwYXJhbSB7TnVtYmVyfSBzY2FsZVlcclxuICogIEByZXR1cm5zIHtNYXRyaXgyRH1cclxuICovXHJcbk1hdHJpeDJELnByb3RvdHlwZS5zY2FsZU5vblVuaWZvcm0gPSBmdW5jdGlvbihzY2FsZVgsIHNjYWxlWSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHRoaXMuYSAqIHNjYWxlWCxcclxuICAgICAgICB0aGlzLmIgKiBzY2FsZVgsXHJcbiAgICAgICAgdGhpcy5jICogc2NhbGVZLFxyXG4gICAgICAgIHRoaXMuZCAqIHNjYWxlWSxcclxuICAgICAgICB0aGlzLmUsXHJcbiAgICAgICAgdGhpcy5mXHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBzY2FsZU5vblVuaWZvcm1BdFxyXG4gKlxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHNjYWxlWFxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHNjYWxlWVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBjZW50ZXJcclxuICogIEByZXR1cm5zIHtNYXRyaXgyRH1cclxuICovXHJcbk1hdHJpeDJELnByb3RvdHlwZS5zY2FsZU5vblVuaWZvcm1BdCA9IGZ1bmN0aW9uKHNjYWxlWCwgc2NhbGVZLCBjZW50ZXIpIHtcclxuICAgIHZhciBkeCA9IGNlbnRlci54IC0gc2NhbGVYICogY2VudGVyLng7XHJcbiAgICB2YXIgZHkgPSBjZW50ZXIueSAtIHNjYWxlWSAqIGNlbnRlci55O1xyXG5cclxuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcclxuICAgICAgICB0aGlzLmEgKiBzY2FsZVgsXHJcbiAgICAgICAgdGhpcy5iICogc2NhbGVYLFxyXG4gICAgICAgIHRoaXMuYyAqIHNjYWxlWSxcclxuICAgICAgICB0aGlzLmQgKiBzY2FsZVksXHJcbiAgICAgICAgdGhpcy5hICogZHggKyB0aGlzLmMgKiBkeSArIHRoaXMuZSxcclxuICAgICAgICB0aGlzLmIgKiBkeCArIHRoaXMuZCAqIGR5ICsgdGhpcy5mXHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICByb3RhdGVcclxuICpcclxuICogIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5zXHJcbiAqICBAcmV0dXJucyB7TWF0cml4MkR9XHJcbiAqL1xyXG5NYXRyaXgyRC5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24ocmFkaWFucykge1xyXG4gICAgdmFyIGMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHRoaXMuYSAqICBjICsgdGhpcy5jICogcyxcclxuICAgICAgICB0aGlzLmIgKiAgYyArIHRoaXMuZCAqIHMsXHJcbiAgICAgICAgdGhpcy5hICogLXMgKyB0aGlzLmMgKiBjLFxyXG4gICAgICAgIHRoaXMuYiAqIC1zICsgdGhpcy5kICogYyxcclxuICAgICAgICB0aGlzLmUsXHJcbiAgICAgICAgdGhpcy5mXHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICByb3RhdGVBdFxyXG4gKlxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHJhZGlhbnNcclxuICogIEBwYXJhbSB7UG9pbnQyRH0gY2VudGVyXHJcbiAqICBAcmVzdWx0IHtNYXRyaXgyRH1cclxuICovXHJcbk1hdHJpeDJELnByb3RvdHlwZS5yb3RhdGVBdCA9IGZ1bmN0aW9uKHJhZGlhbnMsIGNlbnRlcikge1xyXG4gICAgdmFyIGMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcbiAgICB2YXIgdDEgPSAtY2VudGVyLnggKyBjZW50ZXIueCAqIGMgLSBjZW50ZXIueSAqIHM7XHJcbiAgICB2YXIgdDIgPSAtY2VudGVyLnkgKyBjZW50ZXIueSAqIGMgKyBjZW50ZXIueCAqIHM7XHJcblxyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHRoaXMuYSAqICBjICsgdGhpcy5jICogcyxcclxuICAgICAgICB0aGlzLmIgKiAgYyArIHRoaXMuZCAqIHMsXHJcbiAgICAgICAgdGhpcy5hICogLXMgKyB0aGlzLmMgKiBjLFxyXG4gICAgICAgIHRoaXMuYiAqIC1zICsgdGhpcy5kICogYyxcclxuICAgICAgICB0aGlzLmEgKiB0MSArIHRoaXMuYyAqIHQyICsgdGhpcy5lLFxyXG4gICAgICAgIHRoaXMuYiAqIHQxICsgdGhpcy5kICogdDIgKyB0aGlzLmZcclxuICAgICk7XHJcbn07XHJcblxyXG4vKipcclxuICogIHJvdGF0ZUZyb21WZWN0b3JcclxuICpcclxuICogIEBwYXJhbSB7VmVjdG9yMkR9XHJcbiAqICBAcmV0dXJucyB7TWF0cml4MkR9XHJcbiAqL1xyXG5NYXRyaXgyRC5wcm90b3R5cGUucm90YXRlRnJvbVZlY3RvciA9IGZ1bmN0aW9uKHZlY3Rvcikge1xyXG4gICAgdmFyIHVuaXQgPSB2ZWN0b3IudW5pdCgpO1xyXG4gICAgdmFyIGMgPSB1bml0Lng7IC8vIGNvc1xyXG4gICAgdmFyIHMgPSB1bml0Lnk7IC8vIHNpblxyXG5cclxuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcclxuICAgICAgICB0aGlzLmEgKiAgYyArIHRoaXMuYyAqIHMsXHJcbiAgICAgICAgdGhpcy5iICogIGMgKyB0aGlzLmQgKiBzLFxyXG4gICAgICAgIHRoaXMuYSAqIC1zICsgdGhpcy5jICogYyxcclxuICAgICAgICB0aGlzLmIgKiAtcyArIHRoaXMuZCAqIGMsXHJcbiAgICAgICAgdGhpcy5lLFxyXG4gICAgICAgIHRoaXMuZlxyXG4gICAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgZmxpcFhcclxuICpcclxuICogIEByZXR1cm5zIHtNYXRyaXgyRH1cclxuICovXHJcbk1hdHJpeDJELnByb3RvdHlwZS5mbGlwWCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIC10aGlzLmEsXHJcbiAgICAgICAgLXRoaXMuYixcclxuICAgICAgICAgdGhpcy5jLFxyXG4gICAgICAgICB0aGlzLmQsXHJcbiAgICAgICAgIHRoaXMuZSxcclxuICAgICAgICAgdGhpcy5mXHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBmbGlwWVxyXG4gKlxyXG4gKiAgQHJldHVybnMge01hdHJpeDJEfVxyXG4gKi9cclxuTWF0cml4MkQucHJvdG90eXBlLmZsaXBZID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXHJcbiAgICAgICAgIHRoaXMuYSxcclxuICAgICAgICAgdGhpcy5iLFxyXG4gICAgICAgIC10aGlzLmMsXHJcbiAgICAgICAgLXRoaXMuZCxcclxuICAgICAgICAgdGhpcy5lLFxyXG4gICAgICAgICB0aGlzLmZcclxuICAgICk7XHJcbn07XHJcblxyXG4vKipcclxuICogIHNrZXdYXHJcbiAqXHJcbiAqICBAcGFyYXJtIHtOdW1iZXJ9IHJhZGlhbnNcclxuICogIEByZXR1cm5zIHtNYXRyaXgyRH1cclxuICovXHJcbk1hdHJpeDJELnByb3RvdHlwZS5za2V3WCA9IGZ1bmN0aW9uKHJhZGlhbnMpIHtcclxuICAgIHZhciB0ID0gTWF0aC50YW4ocmFkaWFucyk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHRoaXMuYSxcclxuICAgICAgICB0aGlzLmIsXHJcbiAgICAgICAgdGhpcy5hICogdCArIHRoaXMuYyxcclxuICAgICAgICB0aGlzLmIgKiB0ICsgdGhpcy5kLFxyXG4gICAgICAgIHRoaXMuZSxcclxuICAgICAgICB0aGlzLmZcclxuICAgICk7XHJcbn07XHJcblxyXG4vLyBUT0RPOiBza2V3WEF0XHJcblxyXG4vKipcclxuICogIHNrZXdZXHJcbiAqXHJcbiAqICBAcGFyYXJtIHtOdW1iZXJ9IHJhZGlhbnNcclxuICogIEByZXR1cm5zIHtNYXRyaXgyRH1cclxuICovXHJcbk1hdHJpeDJELnByb3RvdHlwZS5za2V3WSA9IGZ1bmN0aW9uKHJhZGlhbnMpIHtcclxuICAgIHZhciB0ID0gTWF0aC50YW4ocmFkaWFucyk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHRoaXMuYSArIHRoaXMuYyAqIHQsXHJcbiAgICAgICAgdGhpcy5iICsgdGhpcy5kICogdCxcclxuICAgICAgICB0aGlzLmMsXHJcbiAgICAgICAgdGhpcy5kLFxyXG4gICAgICAgIHRoaXMuZSxcclxuICAgICAgICB0aGlzLmZcclxuICAgICk7XHJcbn07XHJcblxyXG4vLyBUT0RPOiBza2V3WUF0XHJcblxyXG4vKipcclxuICogIGlzSWRlbnRpdHlcclxuICpcclxuICogIEByZXR1cm5zIHtCb29sZWFufVxyXG4gKi9cclxuTWF0cml4MkQucHJvdG90eXBlLmlzSWRlbnRpdHkgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5hID09PSAxLjAgJiZcclxuICAgICAgICB0aGlzLmIgPT09IDAuMCAmJlxyXG4gICAgICAgIHRoaXMuYyA9PT0gMC4wICYmXHJcbiAgICAgICAgdGhpcy5kID09PSAxLjAgJiZcclxuICAgICAgICB0aGlzLmUgPT09IDAuMCAmJlxyXG4gICAgICAgIHRoaXMuZiA9PT0gMC4wXHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBpc0ludmVydGlibGVcclxuICpcclxuICogIEByZXR1cm5zIHtCb29sZWFufVxyXG4gKi9cclxuTWF0cml4MkQucHJvdG90eXBlLmlzSW52ZXJ0aWJsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYSAqIHRoaXMuZCAtIHRoaXMuYiAqIHRoaXMuYyAhPT0gMC4wO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBnZXRTY2FsZVxyXG4gKlxyXG4gKiAgQHJldHVybnMge3sgc2NhbGVYOiBOdW1iZXIsIHNjYWxlWTogTnVtYmVyIH19XHJcbiAqL1xyXG5NYXRyaXgyRC5wcm90b3R5cGUuZ2V0U2NhbGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2NhbGVYOiBNYXRoLnNxcnQodGhpcy5hICogdGhpcy5hICsgdGhpcy5jICogdGhpcy5jKSxcclxuICAgICAgICBzY2FsZVk6IE1hdGguc3FydCh0aGlzLmIgKiB0aGlzLmIgKyB0aGlzLmQgKiB0aGlzLmQpXHJcbiAgICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBnZXREZWNvbXBvc2l0aW9uXHJcbiAqXHJcbiAqICBDYWxjdWxhdGVzIG1hdHJpeCBTaW5ndWxhciBWYWx1ZSBEZWNvbXBvc2l0aW9uXHJcbiAqXHJcbiAqICBUaGUgcmVzdWx0aW5nIG1hdHJpY2VzLCB0cmFuc2xhdGlvbiwgcm90YXRpb24sIHNjYWxlLCBhbmQgcm90YXRpb24wLCByZXR1cm5cclxuICogIHRoaXMgbWF0cml4IHdoZW4gdGhleSBhcmUgbXVsaXBsaWVkIHRvZ2V0aGVyIGluIHRoZSBsaXN0ZWQgb3JkZXJcclxuICpcclxuICogIEBzZWUgSmltIEJsaW5uJ3MgYXJ0aWNsZSB7QGxpbmsgaHR0cDovL2R4LmRvaS5vcmcvMTAuMTEwOS8zOC40ODY2ODh9XHJcbiAqICBAc2VlIHtAbGluayBodHRwOi8vbWF0aC5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvODYxNjc0L2RlY29tcG9zZS1hLTJkLWFyYml0cmFyeS10cmFuc2Zvcm0taW50by1vbmx5LXNjYWxpbmctYW5kLXJvdGF0aW9ufVxyXG4gKlxyXG4gKiAgQHJldHVybnMge3sgdHJhbnNsYXRpb246IE1hdHJpeDJELCByb3RhdGlvbjogTWF0cml4MkQsIHNjYWxlOiBNYXRyaXgyRCwgcm90YXRpb24wOiBNYXRyaXgyRCB9fVxyXG4gKi9cclxuTWF0cml4MkQucHJvdG90eXBlLmdldERlY29tcG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgRSAgICAgID0gKHRoaXMuYSArIHRoaXMuZCkgKiAwLjU7XHJcbiAgICB2YXIgRiAgICAgID0gKHRoaXMuYSAtIHRoaXMuZCkgKiAwLjU7XHJcbiAgICB2YXIgRyAgICAgID0gKHRoaXMuYiArIHRoaXMuYykgKiAwLjU7XHJcbiAgICB2YXIgSCAgICAgID0gKHRoaXMuYiAtIHRoaXMuYykgKiAwLjU7XHJcblxyXG4gICAgdmFyIFEgICAgICA9IE1hdGguc3FydChFICogRSArIEggKiBIKTtcclxuICAgIHZhciBSICAgICAgPSBNYXRoLnNxcnQoRiAqIEYgKyBHICogRyk7XHJcbiAgICB2YXIgc2NhbGVYID0gUSArIFI7XHJcbiAgICB2YXIgc2NhbGVZID0gUSAtIFI7XHJcblxyXG4gICAgdmFyIGExICAgICA9IE1hdGguYXRhbjIoRywgRik7XHJcbiAgICB2YXIgYTIgICAgID0gTWF0aC5hdGFuMihILCBFKTtcclxuICAgIHZhciB0aGV0YSAgPSAoYTIgLSBhMSkgKiAwLjU7XHJcbiAgICB2YXIgcGhpICAgID0gKGEyICsgYTEpICogMC41O1xyXG5cclxuICAgIC8vIFRPRE86IEFkZCBzdGF0aWMgbWV0aG9kcyB0byBnZW5lcmF0ZSB0cmFuc2xhdGlvbiwgcm90YXRpb24sIGV0Yy5cclxuICAgIC8vIG1hdHJpY2VzIGRpcmVjdGx5XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0cmFuc2xhdGlvbjogbmV3IHRoaXMuY29uc3RydWN0b3IoMSwgMCwgMCwgMSwgdGhpcy5lLCB0aGlzLmYpLFxyXG4gICAgICAgIHJvdGF0aW9uOiAgICB0aGlzLmNvbnN0cnVjdG9yLklERU5USVRZLnJvdGF0ZShwaGkpLFxyXG4gICAgICAgIHNjYWxlOiAgICAgICBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzY2FsZVgsIDAsIDAsIHNjYWxlWSwgMCwgMCksXHJcbiAgICAgICAgcm90YXRpb24wOiAgIHRoaXMuY29uc3RydWN0b3IuSURFTlRJVFkucm90YXRlKHRoZXRhKVxyXG4gICAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgZXF1YWxzXHJcbiAqXHJcbiAqICBAcGFyYW0ge01hdHJpeDJEfSB0aGF0XHJcbiAqICBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICovXHJcbk1hdHJpeDJELnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuYSA9PT0gdGhhdC5hICYmXHJcbiAgICAgICAgdGhpcy5iID09PSB0aGF0LmIgJiZcclxuICAgICAgICB0aGlzLmMgPT09IHRoYXQuYyAmJlxyXG4gICAgICAgIHRoaXMuZCA9PT0gdGhhdC5kICYmXHJcbiAgICAgICAgdGhpcy5lID09PSB0aGF0LmUgJiZcclxuICAgICAgICB0aGlzLmYgPT09IHRoYXQuZlxyXG4gICAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgdG9TdHJpbmdcclxuICpcclxuICogIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAqL1xyXG5NYXRyaXgyRC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBcIm1hdHJpeChcIiArIFt0aGlzLmEsIHRoaXMuYiwgdGhpcy5jLCB0aGlzLmQsIHRoaXMuZSwgdGhpcy5mXS5qb2luKFwiLFwiKSArIFwiKVwiO1xyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gTWF0cml4MkQ7XHJcbn1cclxuXHJcbn0se31dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICpcclxuICogICBQb2ludDJELmpzXHJcbiAqXHJcbiAqICAgY29weXJpZ2h0IDIwMDEtMjAwMiwgMjAxMyBLZXZpbiBMaW5kc2V5XHJcbiAqXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqICBQb2ludDJEXHJcbiAqXHJcbiAqICBAcGFyYW0ge051bWJlcn0geFxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHlcclxuICogIEByZXR1cm5zIHtQb2ludDJEfVxyXG4gKi9cclxuZnVuY3Rpb24gUG9pbnQyRCh4LCB5KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XHJcbiAgICAgICAgXCJ4XCI6IHtcclxuICAgICAgICAgICAgdmFsdWU6IHgsXHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJ5XCI6IHtcclxuICAgICAgICAgICAgdmFsdWU6IHksXHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gdGhpcy54ID0geDtcclxuICAgIC8vIHRoaXMueSA9IHk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAgY2xvbmVcclxuICpcclxuICogIEByZXR1cm5zIHtQb2ludDJEfVxyXG4gKi9cclxuUG9pbnQyRC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLngsIHRoaXMueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogIGFkZFxyXG4gKlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfFZlY3RvcjJEfSB0aGF0XHJcbiAqICBAcmV0dXJucyB7UG9pbnQyRH1cclxuICovXHJcblBvaW50MkQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLngrdGhhdC54LCB0aGlzLnkrdGhhdC55KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgc3VidHJhY3RcclxuICpcclxuICogIEBwYXJhbSB7IFZlY3RvcjJEIHwgUG9pbnQyRCB9IHRoYXRcclxuICogIEByZXR1cm5zIHtQb2ludDJEfVxyXG4gKi9cclxuUG9pbnQyRC5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy54LXRoYXQueCwgdGhpcy55LXRoYXQueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogIG11bHRpcGx5XHJcbiAqXHJcbiAqICBAcGFyYW0ge051bWJlcn0gc2NhbGFyXHJcbiAqICBAcmV0dXJucyB7UG9pbnQyRH1cclxuICovXHJcblBvaW50MkQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24oc2NhbGFyKSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy54KnNjYWxhciwgdGhpcy55KnNjYWxhcik7XHJcbn07XHJcblxyXG4vKipcclxuICogIGRpdmlkZVxyXG4gKlxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHNjYWxhclxyXG4gKiAgQHJldHVybnMge1BvaW50MkR9XHJcbiAqL1xyXG5Qb2ludDJELnByb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbihzY2FsYXIpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLngvc2NhbGFyLCB0aGlzLnkvc2NhbGFyKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgZXF1YWxzXHJcbiAqXHJcbiAqICBAcGFyYW0ge1BvaW50MkR9IHRoYXRcclxuICogIEByZXR1cm5zIHtCb29sZWFufVxyXG4gKi9cclxuUG9pbnQyRC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgcmV0dXJuICggdGhpcy54ID09PSB0aGF0LnggJiYgdGhpcy55ID09PSB0aGF0LnkgKTtcclxufTtcclxuXHJcbi8vIHV0aWxpdHkgbWV0aG9kc1xyXG5cclxuLyoqXHJcbiAqICBsZXJwXHJcbiAqXHJcbiAqICBAcGFyYW0geyBWZWN0b3IyRCB8IFBvaW50MkQgfSB0aGF0XHJcbiAqICBAcGFyYW0ge051bWJlcn0gdFxyXG4gQCAgQHJldHVybnMge1BvaW50MkR9XHJcbiAqL1xyXG5Qb2ludDJELnByb3RvdHlwZS5sZXJwID0gZnVuY3Rpb24odGhhdCwgdCkge1xyXG4gICAgdmFyIG9tdCA9IDEuMCAtIHQ7XHJcblxyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHRoaXMueCAqIG9tdCArIHRoYXQueCAqIHQsXHJcbiAgICAgICAgdGhpcy55ICogb210ICsgdGhhdC55ICogdFxyXG4gICAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgZGlzdGFuY2VGcm9tXHJcbiAqXHJcbiAqICBAcGFyYW0ge1BvaW50MkR9IHRoYXRcclxuICogIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAqL1xyXG5Qb2ludDJELnByb3RvdHlwZS5kaXN0YW5jZUZyb20gPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB2YXIgZHggPSB0aGlzLnggLSB0aGF0Lng7XHJcbiAgICB2YXIgZHkgPSB0aGlzLnkgLSB0aGF0Lnk7XHJcblxyXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCpkeCArIGR5KmR5KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgbWluXHJcbiAqXHJcbiAqICBAcGFyYW0ge1BvaW50MkR9IHRoYXRcclxuICogIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAqL1xyXG5Qb2ludDJELnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXHJcbiAgICAgICAgTWF0aC5taW4oIHRoaXMueCwgdGhhdC54ICksXHJcbiAgICAgICAgTWF0aC5taW4oIHRoaXMueSwgdGhhdC55IClcclxuICAgICk7XHJcbn07XHJcblxyXG4vKipcclxuICogIG1heFxyXG4gKlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSB0aGF0XHJcbiAqICBAcmV0dXJucyB7TnVtYmVyfVxyXG4gKi9cclxuUG9pbnQyRC5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIE1hdGgubWF4KCB0aGlzLngsIHRoYXQueCApLFxyXG4gICAgICAgIE1hdGgubWF4KCB0aGlzLnksIHRoYXQueSApXHJcbiAgICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICB0cmFuc2Zvcm1cclxuICpcclxuICogIEBwYXJhbSB7TWF0cml4MkR9XHJcbiAqICBAcmVzdWx0IHtQb2ludDJEfVxyXG4gKi9cclxuUG9pbnQyRC5wcm90b3R5cGUudHJhbnNmb3JtID0gZnVuY3Rpb24obWF0cml4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXHJcbiAgICAgICAgbWF0cml4LmEgKiB0aGlzLnggKyBtYXRyaXguYyAqIHRoaXMueSArIG1hdHJpeC5lLFxyXG4gICAgICAgIG1hdHJpeC5iICogdGhpcy54ICsgbWF0cml4LmQgKiB0aGlzLnkgKyBtYXRyaXguZlxyXG4gICAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgdG9TdHJpbmdcclxuICpcclxuICogIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAqL1xyXG5Qb2ludDJELnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFwicG9pbnQoXCIgKyB0aGlzLnggKyBcIixcIiArIHRoaXMueSArIFwiKVwiO1xyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gUG9pbnQyRDtcclxufVxyXG5cclxufSx7fV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKlxyXG4gKiAgIFZlY3RvcjJELmpzXHJcbiAqXHJcbiAqICAgY29weXJpZ2h0IDIwMDEtMjAwMiwgMjAxMyBLZXZpbiBMaW5kc2V5XHJcbiAqXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqICBWZWN0b3IyRFxyXG4gKlxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHhcclxuICogIEBwYXJhbSB7TnVtYmVyfSB5XHJcbiAqICBAcmV0dXJucyB7VmVjdG9yMkR9XHJcbiAqL1xyXG5mdW5jdGlvbiBWZWN0b3IyRCh4LCB5KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XHJcbiAgICAgICAgXCJ4XCI6IHtcclxuICAgICAgICAgICAgdmFsdWU6IHgsXHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJ5XCI6IHtcclxuICAgICAgICAgICAgdmFsdWU6IHksXHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gdGhpcy54ID0geDtcclxuICAgIC8vIHRoaXMueSA9IHk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAgZnJvbVBvaW50c1xyXG4gKlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMlxyXG4gKiAgQHJldHVybnMge1ZlY3RvcjJEfVxyXG4gKi9cclxuVmVjdG9yMkQuZnJvbVBvaW50cyA9IGZ1bmN0aW9uKHAxLCBwMikge1xyXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IyRChcclxuICAgICAgICBwMi54IC0gcDEueCxcclxuICAgICAgICBwMi55IC0gcDEueVxyXG4gICAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgbGVuZ3RoXHJcbiAqXHJcbiAqICBAcmV0dXJucyB7TnVtYmVyfVxyXG4gKi9cclxuVmVjdG9yMkQucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLngqdGhpcy54ICsgdGhpcy55KnRoaXMueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogIG1hZ25pdHVkZVxyXG4gKlxyXG4gKiAgQHJldHVybnMge051bWJlcn1cclxuICovXHJcblZlY3RvcjJELnByb3RvdHlwZS5tYWduaXR1ZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLngqdGhpcy54ICsgdGhpcy55KnRoaXMueTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgZG90XHJcbiAqXHJcbiAqICBAcGFyYW0ge1ZlY3RvcjJEfSB0aGF0XHJcbiAqICBAcmV0dXJucyB7TnVtYmVyfVxyXG4gKi9cclxuVmVjdG9yMkQucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHJldHVybiB0aGlzLngqdGhhdC54ICsgdGhpcy55KnRoYXQueTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgY3Jvc3NcclxuICpcclxuICogIEBwYXJhbSB7VmVjdG9yMkR9IHRoYXRcclxuICogIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAqL1xyXG5WZWN0b3IyRC5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICByZXR1cm4gdGhpcy54KnRoYXQueSAtIHRoaXMueSp0aGF0Lng7XHJcbn07XHJcblxyXG4vKipcclxuICogIGRldGVybWluYW50XHJcbiAqXHJcbiAqICBAcGFyYW0ge1ZlY3RvcjJEfSB0aGF0XHJcbiAqICBAcmV0dXJucyB7TnVtYmVyfVxyXG4gKi9cclxuVmVjdG9yMkQucHJvdG90eXBlLmRldGVybWluYW50ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgcmV0dXJuIHRoaXMueCp0aGF0LnkgLSB0aGlzLnkqdGhhdC54O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICB1bml0XHJcbiAqXHJcbiAqICBAcmV0dXJucyB7VmVjdG9yMkR9XHJcbiAqL1xyXG5WZWN0b3IyRC5wcm90b3R5cGUudW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGl2aWRlKCB0aGlzLmxlbmd0aCgpICk7XHJcbn07XHJcblxyXG4vKipcclxuICogIGFkZFxyXG4gKlxyXG4gKiAgQHBhcmFtIHtWZWN0b3IyRH0gdGhhdFxyXG4gKiAgQHJldHVybnMge1ZlY3RvcjJEfVxyXG4gKi9cclxuVmVjdG9yMkQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnggKyB0aGF0LngsIHRoaXMueSArIHRoYXQueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogIHN1YnRyYWN0XHJcbiAqXHJcbiAqICBAcGFyYW0ge1ZlY3RvcjJEfSB0aGF0XHJcbiAqICBAcmV0dXJucyB7VmVjdG9yMkR9XHJcbiAqL1xyXG5WZWN0b3IyRC5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy54IC0gdGhhdC54LCB0aGlzLnkgLSB0aGF0LnkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBtdWx0aXBseVxyXG4gKlxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHNjYWxhclxyXG4gKiAgQHJldHVybnMge1ZlY3RvcjJEfVxyXG4gKi9cclxuVmVjdG9yMkQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24oc2NhbGFyKSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy54ICogc2NhbGFyLCB0aGlzLnkgKiBzY2FsYXIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBkaXZpZGVcclxuICpcclxuICogIEBwYXJhbSB7TnVtYmVyfSBzY2FsYXJcclxuICogIEByZXR1cm5zIHtWZWN0b3IyRH1cclxuICovXHJcblZlY3RvcjJELnByb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbihzY2FsYXIpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnggLyBzY2FsYXIsIHRoaXMueSAvIHNjYWxhcik7XHJcbn07XHJcblxyXG4vKipcclxuICogIGFuZ2xlQmV0d2VlblxyXG4gKlxyXG4gKiAgQHBhcmFtIHtWZWN0b3IyRH0gdGhhdFxyXG4gKiAgQHJldHVybnMge051bWJlcn1cclxuICovXHJcblZlY3RvcjJELnByb3RvdHlwZS5hbmdsZUJldHdlZW4gPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB2YXIgY29zID0gdGhpcy5kb3QodGhhdCkgLyAodGhpcy5sZW5ndGgoKSAqIHRoYXQubGVuZ3RoKCkpO1xyXG4gICAgY29zID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKGNvcywgMSkpO1xyXG4gICAgdmFyIHJhZGlhbnMgPSBNYXRoLmFjb3MoY29zKTtcclxuXHJcbiAgICByZXR1cm4gKHRoaXMuY3Jvc3ModGhhdCkgPCAwLjApID8gLXJhZGlhbnMgOiByYWRpYW5zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBGaW5kIGEgdmVjdG9yIGlzIHRoYXQgaXMgcGVycGVuZGljdWxhciB0byB0aGlzIHZlY3RvclxyXG4gKlxyXG4gKiAgQHJldHVybnMge1ZlY3RvcjJEfVxyXG4gKi9cclxuVmVjdG9yMkQucHJvdG90eXBlLnBlcnAgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcigtdGhpcy55LCB0aGlzLngpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBGaW5kIHRoZSBjb21wb25lbnQgb2YgdGhlIHNwZWNpZmllZCB2ZWN0b3IgdGhhdCBpcyBwZXJwZW5kaWN1bGFyIHRvXHJcbiAqICB0aGlzIHZlY3RvclxyXG4gKlxyXG4gKiAgQHBhcmFtIHtWZWN0b3IyRH0gdGhhdFxyXG4gKiAgQHJldHVybnMge1ZlY3RvcjJEfVxyXG4gKi9cclxuVmVjdG9yMkQucHJvdG90eXBlLnBlcnBlbmRpY3VsYXIgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdWJ0cmFjdCh0aGlzLnByb2plY3QodGhhdCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBwcm9qZWN0XHJcbiAqXHJcbiAqICBAcGFyYW0ge1ZlY3RvcjJEfSB0aGF0XHJcbiAqICBAcmV0dXJucyB7VmVjdG9yMkR9XHJcbiAqL1xyXG5WZWN0b3IyRC5wcm90b3R5cGUucHJvamVjdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHZhciBwZXJjZW50ID0gdGhpcy5kb3QodGhhdCkgLyB0aGF0LmRvdCh0aGF0KTtcclxuXHJcbiAgICByZXR1cm4gdGhhdC5tdWx0aXBseShwZXJjZW50KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgdHJhbnNmb3JtXHJcbiAqXHJcbiAqICBAcGFyYW0ge01hdHJpeDJEfVxyXG4gKiAgQHJldHVybnMge1ZlY3RvcjJEfVxyXG4gKi9cclxuVmVjdG9yMkQucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uKG1hdHJpeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxyXG4gICAgICAgIG1hdHJpeC5hICogdGhpcy54ICsgbWF0cml4LmMgKiB0aGlzLnksXHJcbiAgICAgICAgbWF0cml4LmIgKiB0aGlzLnggKyBtYXRyaXguZCAqIHRoaXMueVxyXG4gICAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgZXF1YWxzXHJcbiAqXHJcbiAqICBAcGFyYW0ge1ZlY3RvcjJEfSB0aGF0XHJcbiAqICBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICovXHJcblZlY3RvcjJELnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMueCA9PT0gdGhhdC54ICYmXHJcbiAgICAgICAgdGhpcy55ID09PSB0aGF0LnlcclxuICAgICk7XHJcbn07XHJcblxyXG4vKipcclxuICogIHRvU3RyaW5nXHJcbiAqXHJcbiAqICBAcmV0dXJucyB7U3RyaW5nfVxyXG4gKi9cclxuVmVjdG9yMkQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gXCJ2ZWN0b3IoXCIgKyB0aGlzLnggKyBcIixcIiArIHRoaXMueSArIFwiKVwiO1xyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVjdG9yMkQ7XHJcbn1cclxuXHJcbn0se31dLDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xyXG4vLyBleHBvc2UgY2xhc3Nlc1xyXG5cclxuZXhwb3J0cy5Qb2x5bm9taWFsID0gcmVxdWlyZSgnLi9saWIvUG9seW5vbWlhbCcpO1xyXG5leHBvcnRzLlNxcnRQb2x5bm9taWFsID0gcmVxdWlyZSgnLi9saWIvU3FydFBvbHlub21pYWwnKTtcclxuXHJcbn0se1wiLi9saWIvUG9seW5vbWlhbFwiOjYsXCIuL2xpYi9TcXJ0UG9seW5vbWlhbFwiOjd9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqXHJcbiAqICAgUG9seW5vbWlhbC5qc1xyXG4gKlxyXG4gKiAgIGNvcHlyaWdodCAyMDAyLCAyMDEzIEtldmluIExpbmRzZXlcclxuICogXHJcbiAqICAgY29udHJpYnV0aW9uIHtAbGluayBodHRwOi8vZ2l0aHViLmNvbS9RdWF6aXN0YXgva2xkLXBvbHlub21pYWx9XHJcbiAqICAgICAgIEBjb3B5cmlnaHQgMjAxNSBSb2JlcnQgQmVua28gKFF1YXppc3RheCkgPHF1YXppc3RheEBnbWFpbC5jb20+XHJcbiAqICAgICAgIEBsaWNlbnNlIE1JVFxyXG4gKi9cclxuXHJcblBvbHlub21pYWwuVE9MRVJBTkNFID0gMWUtNjtcclxuUG9seW5vbWlhbC5BQ0NVUkFDWSAgPSAxNTtcclxuXHJcblxyXG4vKipcclxuICogIGludGVycG9sYXRlXHJcbiAqXHJcbiAqICBAcGFyYW0ge0FycmF5PE51bWJlcj59IHhzXHJcbiAqICBAcGFyYW0ge0FycmF5PE51bWJlcj59IHlzXHJcbiAqICBAcGFyYW0ge051bWJlcn0gblxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IG9mZnNldFxyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHhcclxuICpcclxuICogIEByZXR1cm5zIHt5Ok51bWJlciwgZHk6TnVtYmVyfVxyXG4gKi9cclxuUG9seW5vbWlhbC5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKHhzLCB5cywgbiwgb2Zmc2V0LCB4KSB7XHJcbiAgICBpZiAoIHhzLmNvbnN0cnVjdG9yICE9PSBBcnJheSB8fCB5cy5jb25zdHJ1Y3RvciAhPT0gQXJyYXkgKVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvbHlub21pYWwuaW50ZXJwb2xhdGU6IHhzIGFuZCB5cyBtdXN0IGJlIGFycmF5c1wiKTtcclxuICAgIGlmICggaXNOYU4obikgfHwgaXNOYU4ob2Zmc2V0KSB8fCBpc05hTih4KSApXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUG9seW5vbWlhbC5pbnRlcnBvbGF0ZTogbiwgb2Zmc2V0LCBhbmQgeCBtdXN0IGJlIG51bWJlcnNcIik7XHJcblxyXG4gICAgdmFyIHkgID0gMDtcclxuICAgIHZhciBkeSA9IDA7XHJcbiAgICB2YXIgYyA9IG5ldyBBcnJheShuKTtcclxuICAgIHZhciBkID0gbmV3IEFycmF5KG4pO1xyXG4gICAgdmFyIG5zID0gMDtcclxuICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgdmFyIGRpZmYgPSBNYXRoLmFicyh4IC0geHNbb2Zmc2V0XSk7XHJcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBuOyBpKysgKSB7XHJcbiAgICAgICAgdmFyIGRpZnQgPSBNYXRoLmFicyh4IC0geHNbb2Zmc2V0K2ldKTtcclxuXHJcbiAgICAgICAgaWYgKCBkaWZ0IDwgZGlmZiApIHtcclxuICAgICAgICAgICAgbnMgPSBpO1xyXG4gICAgICAgICAgICBkaWZmID0gZGlmdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY1tpXSA9IGRbaV0gPSB5c1tvZmZzZXQraV07XHJcbiAgICB9XHJcbiAgICB5ID0geXNbb2Zmc2V0K25zXTtcclxuICAgIG5zLS07XHJcblxyXG4gICAgZm9yICggdmFyIG0gPSAxOyBtIDwgbjsgbSsrICkge1xyXG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IG4tbTsgaSsrICkge1xyXG4gICAgICAgICAgICB2YXIgaG8gPSB4c1tvZmZzZXQraV0gLSB4O1xyXG4gICAgICAgICAgICB2YXIgaHAgPSB4c1tvZmZzZXQraSttXSAtIHg7XHJcbiAgICAgICAgICAgIHZhciB3ID0gY1tpKzFdLWRbaV07XHJcbiAgICAgICAgICAgIHZhciBkZW4gPSBobyAtIGhwO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBkZW4gPT0gMC4wICkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0geyB5OiAwLCBkeTogMH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGVuID0gdyAvIGRlbjtcclxuICAgICAgICAgICAgZFtpXSA9IGhwKmRlbjtcclxuICAgICAgICAgICAgY1tpXSA9IGhvKmRlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZHkgPSAoMioobnMrMSkgPCAobi1tKSkgPyBjW25zKzFdIDogZFtucy0tXTtcclxuICAgICAgICB5ICs9IGR5O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7IHk6IHksIGR5OiBkeSB9O1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiAgUG9seW5vbWlhbFxyXG4gKlxyXG4gKiAgQHJldHVybnMge1BvbHlub21pYWx9XHJcbiAqL1xyXG5mdW5jdGlvbiBQb2x5bm9taWFsKCkge1xyXG4gICAgdGhpcy5pbml0KCBhcmd1bWVudHMgKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiAgaW5pdFxyXG4gKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKGNvZWZzKSB7XHJcbiAgICB0aGlzLmNvZWZzID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgZm9yICggdmFyIGkgPSBjb2Vmcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSApXHJcbiAgICAgICAgdGhpcy5jb2Vmcy5wdXNoKCBjb2Vmc1tpXSApO1xyXG5cclxuICAgIHRoaXMuX3ZhcmlhYmxlID0gXCJ0XCI7XHJcbiAgICB0aGlzLl9zID0gMDtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogIGV2YWxcclxuICovXHJcblBvbHlub21pYWwucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbih4KSB7XHJcbiAgICBpZiAoIGlzTmFOKHgpIClcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb2x5bm9taWFsLmV2YWw6IHBhcmFtZXRlciBtdXN0IGJlIGEgbnVtYmVyXCIpO1xyXG5cclxuICAgIHZhciByZXN1bHQgPSAwO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gdGhpcy5jb2Vmcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSApXHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICogeCArIHRoaXMuY29lZnNbaV07XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogIGFkZFxyXG4gKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdmFyIHJlc3VsdCA9IG5ldyBQb2x5bm9taWFsKCk7XHJcbiAgICB2YXIgZDEgPSB0aGlzLmdldERlZ3JlZSgpO1xyXG4gICAgdmFyIGQyID0gdGhhdC5nZXREZWdyZWUoKTtcclxuICAgIHZhciBkbWF4ID0gTWF0aC5tYXgoZDEsZDIpO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8PSBkbWF4OyBpKysgKSB7XHJcbiAgICAgICAgdmFyIHYxID0gKGkgPD0gZDEpID8gdGhpcy5jb2Vmc1tpXSA6IDA7XHJcbiAgICAgICAgdmFyIHYyID0gKGkgPD0gZDIpID8gdGhhdC5jb2Vmc1tpXSA6IDA7XHJcblxyXG4gICAgICAgIHJlc3VsdC5jb2Vmc1tpXSA9IHYxICsgdjI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogIG11bHRpcGx5XHJcbiAqL1xyXG5Qb2x5bm9taWFsLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHZhciByZXN1bHQgPSBuZXcgUG9seW5vbWlhbCgpO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8PSB0aGlzLmdldERlZ3JlZSgpICsgdGhhdC5nZXREZWdyZWUoKTsgaSsrIClcclxuICAgICAgICByZXN1bHQuY29lZnMucHVzaCgwKTtcclxuXHJcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPD0gdGhpcy5nZXREZWdyZWUoKTsgaSsrIClcclxuICAgICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPD0gdGhhdC5nZXREZWdyZWUoKTsgaisrIClcclxuICAgICAgICAgICAgcmVzdWx0LmNvZWZzW2kral0gKz0gdGhpcy5jb2Vmc1tpXSAqIHRoYXQuY29lZnNbal07XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogIGRpdmlkZV9zY2FsYXJcclxuICovXHJcblBvbHlub21pYWwucHJvdG90eXBlLmRpdmlkZV9zY2FsYXIgPSBmdW5jdGlvbihzY2FsYXIpIHtcclxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuY29lZnMubGVuZ3RoOyBpKysgKVxyXG4gICAgICAgIHRoaXMuY29lZnNbaV0gLz0gc2NhbGFyO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiAgc2ltcGxpZnlcclxuICovXHJcblBvbHlub21pYWwucHJvdG90eXBlLnNpbXBsaWZ5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgVE9MRVJBTkNFID0gMWUtMTU7XHJcbiAgICBmb3IgKCB2YXIgaSA9IHRoaXMuZ2V0RGVncmVlKCk7IGkgPj0gMDsgaS0tICkge1xyXG4gICAgICAgIGlmICggTWF0aC5hYnMoIHRoaXMuY29lZnNbaV0gKSA8PSBUT0xFUkFOQ0UgKVxyXG4gICAgICAgICAgICB0aGlzLmNvZWZzLnBvcCgpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqICBiaXNlY3Rpb25cclxuICovXHJcblBvbHlub21pYWwucHJvdG90eXBlLmJpc2VjdGlvbiA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XHJcbiAgICB2YXIgbWluVmFsdWUgPSB0aGlzLmV2YWwobWluKTtcclxuICAgIHZhciBtYXhWYWx1ZSA9IHRoaXMuZXZhbChtYXgpO1xyXG4gICAgdmFyIHJlc3VsdDtcclxuXHJcbiAgICBpZiAoIE1hdGguYWJzKG1pblZhbHVlKSA8PSBQb2x5bm9taWFsLlRPTEVSQU5DRSApXHJcbiAgICAgICAgcmVzdWx0ID0gbWluO1xyXG4gICAgZWxzZSBpZiAoIE1hdGguYWJzKG1heFZhbHVlKSA8PSBQb2x5bm9taWFsLlRPTEVSQU5DRSApXHJcbiAgICAgICAgcmVzdWx0ID0gbWF4O1xyXG4gICAgZWxzZSBpZiAoIG1pblZhbHVlICogbWF4VmFsdWUgPD0gMCApIHtcclxuICAgICAgICB2YXIgdG1wMSAgPSBNYXRoLmxvZyhtYXggLSBtaW4pO1xyXG4gICAgICAgIHZhciB0bXAyICA9IE1hdGguTE4xMCAqIFBvbHlub21pYWwuQUNDVVJBQ1k7XHJcbiAgICAgICAgdmFyIGl0ZXJzID0gTWF0aC5jZWlsKCAodG1wMSt0bXAyKSAvIE1hdGguTE4yICk7XHJcblxyXG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGl0ZXJzOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IDAuNSAqIChtaW4gKyBtYXgpO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmV2YWwocmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIGlmICggTWF0aC5hYnModmFsdWUpIDw9IFBvbHlub21pYWwuVE9MRVJBTkNFICkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggdmFsdWUgKiBtaW5WYWx1ZSA8IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBtYXggPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICBtYXhWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWluID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgbWluVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiAgdG9TdHJpbmdcclxuICovXHJcblBvbHlub21pYWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgY29lZnMgPSBuZXcgQXJyYXkoKTtcclxuICAgIHZhciBzaWducyA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gdGhpcy5jb2Vmcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSApIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSBNYXRoLnJvdW5kKHRoaXMuY29lZnNbaV0qMTAwMCkvMTAwMDtcclxuICAgICAgICAvL3ZhciB2YWx1ZSA9IHRoaXMuY29lZnNbaV07XHJcblxyXG4gICAgICAgIGlmICggdmFsdWUgIT0gMCApIHtcclxuICAgICAgICAgICAgdmFyIHNpZ24gPSAoIHZhbHVlIDwgMCApID8gXCIgLSBcIiA6IFwiICsgXCI7XHJcblxyXG4gICAgICAgICAgICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKCBpID4gMCApXHJcbiAgICAgICAgICAgICAgICBpZiAoIHZhbHVlID09IDEgKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fdmFyaWFibGU7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gdGhpcy5fdmFyaWFibGU7XHJcbiAgICAgICAgICAgIGlmICggaSA+IDEgKSB2YWx1ZSArPSBcIl5cIiArIGk7XHJcblxyXG4gICAgICAgICAgICBzaWducy5wdXNoKCBzaWduICk7XHJcbiAgICAgICAgICAgIGNvZWZzLnB1c2goIHZhbHVlICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNpZ25zWzBdID0gKCBzaWduc1swXSA9PSBcIiArIFwiICkgPyBcIlwiIDogXCItXCI7XHJcblxyXG4gICAgdmFyIHJlc3VsdCA9IFwiXCI7XHJcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBjb2Vmcy5sZW5ndGg7IGkrKyApXHJcbiAgICAgICAgcmVzdWx0ICs9IHNpZ25zW2ldICsgY29lZnNbaV07XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogIHRyYXBlem9pZFxyXG4gKiAgQmFzZWQgb24gdHJhcHpkIGluIFwiTnVtZXJpY2FsIFJlY2lwZXMgaW4gQ1wiLCBwYWdlIDEzN1xyXG4gKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUudHJhcGV6b2lkID0gZnVuY3Rpb24obWluLCBtYXgsIG4pIHtcclxuICAgIGlmICggaXNOYU4obWluKSB8fCBpc05hTihtYXgpIHx8IGlzTmFOKG4pIClcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb2x5bm9taWFsLnRyYXBlem9pZDogcGFyYW1ldGVycyBtdXN0IGJlIG51bWJlcnNcIik7XHJcblxyXG4gICAgdmFyIHJhbmdlID0gbWF4IC0gbWluO1xyXG4gICAgdmFyIFRPTEVSQU5DRSA9IDFlLTc7XHJcblxyXG4gICAgaWYgKCBuID09IDEgKSB7XHJcbiAgICAgICAgdmFyIG1pblZhbHVlID0gdGhpcy5ldmFsKG1pbik7XHJcbiAgICAgICAgdmFyIG1heFZhbHVlID0gdGhpcy5ldmFsKG1heCk7XHJcbiAgICAgICAgdGhpcy5fcyA9IDAuNSpyYW5nZSooIG1pblZhbHVlICsgbWF4VmFsdWUgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGl0ID0gMSA8PCAobi0yKTtcclxuICAgICAgICB2YXIgZGVsdGEgPSByYW5nZSAvIGl0O1xyXG4gICAgICAgIHZhciB4ID0gbWluICsgMC41KmRlbHRhO1xyXG4gICAgICAgIHZhciBzdW0gPSAwO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBpdDsgaSsrICkge1xyXG4gICAgICAgICAgICBzdW0gKz0gdGhpcy5ldmFsKHgpO1xyXG4gICAgICAgICAgICB4ICs9IGRlbHRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zID0gMC41Kih0aGlzLl9zICsgcmFuZ2Uqc3VtL2l0KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIGlzTmFOKHRoaXMuX3MpIClcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb2x5bm9taWFsLnRyYXBlem9pZDogdGhpcy5fcyBpcyBOYU5cIik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3M7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqICBzaW1wc29uXHJcbiAqICBCYXNlZCBvbiB0cmFwemQgaW4gXCJOdW1lcmljYWwgUmVjaXBlcyBpbiBDXCIsIHBhZ2UgMTM5XHJcbiAqL1xyXG5Qb2x5bm9taWFsLnByb3RvdHlwZS5zaW1wc29uID0gZnVuY3Rpb24obWluLCBtYXgpIHtcclxuICAgIGlmICggaXNOYU4obWluKSB8fCBpc05hTihtYXgpIClcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb2x5bm9taWFsLnNpbXBzb246IHBhcmFtZXRlcnMgbXVzdCBiZSBudW1iZXJzXCIpO1xyXG5cclxuICAgIHZhciByYW5nZSA9IG1heCAtIG1pbjtcclxuICAgIHZhciBzdCA9IDAuNSAqIHJhbmdlICogKCB0aGlzLmV2YWwobWluKSArIHRoaXMuZXZhbChtYXgpICk7XHJcbiAgICB2YXIgdCA9IHN0O1xyXG4gICAgdmFyIHMgPSA0LjAqc3QvMy4wO1xyXG4gICAgdmFyIG9zID0gcztcclxuICAgIHZhciBvc3QgPSBzdDtcclxuICAgIHZhciBUT0xFUkFOQ0UgPSAxZS03O1xyXG5cclxuICAgIHZhciBpdCA9IDE7XHJcbiAgICBmb3IgKCB2YXIgbiA9IDI7IG4gPD0gMjA7IG4rKyApIHtcclxuICAgICAgICB2YXIgZGVsdGEgPSByYW5nZSAvIGl0O1xyXG4gICAgICAgIHZhciB4ICAgICA9IG1pbiArIDAuNSpkZWx0YTtcclxuICAgICAgICB2YXIgc3VtICAgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDE7IGkgPD0gaXQ7IGkrKyApIHtcclxuICAgICAgICAgICAgc3VtICs9IHRoaXMuZXZhbCh4KTtcclxuICAgICAgICAgICAgeCArPSBkZWx0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHQgPSAwLjUgKiAodCArIHJhbmdlICogc3VtIC8gaXQpO1xyXG4gICAgICAgIHN0ID0gdDtcclxuICAgICAgICBzID0gKDQuMCpzdCAtIG9zdCkvMy4wO1xyXG5cclxuICAgICAgICBpZiAoIE1hdGguYWJzKHMtb3MpIDwgVE9MRVJBTkNFKk1hdGguYWJzKG9zKSApXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBvcyA9IHM7XHJcbiAgICAgICAgb3N0ID0gc3Q7XHJcbiAgICAgICAgaXQgPDw9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHM7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqICByb21iZXJnXHJcbiAqL1xyXG5Qb2x5bm9taWFsLnByb3RvdHlwZS5yb21iZXJnID0gZnVuY3Rpb24obWluLCBtYXgpIHtcclxuICAgIGlmICggaXNOYU4obWluKSB8fCBpc05hTihtYXgpIClcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb2x5bm9taWFsLnJvbWJlcmc6IHBhcmFtZXRlcnMgbXVzdCBiZSBudW1iZXJzXCIpO1xyXG5cclxuICAgIHZhciBNQVggPSAyMDtcclxuICAgIHZhciBLID0gMztcclxuICAgIHZhciBUT0xFUkFOQ0UgPSAxZS02O1xyXG4gICAgdmFyIHMgPSBuZXcgQXJyYXkoTUFYKzEpO1xyXG4gICAgdmFyIGggPSBuZXcgQXJyYXkoTUFYKzEpO1xyXG4gICAgdmFyIHJlc3VsdCA9IHsgeTogMCwgZHk6IDAgfTtcclxuXHJcbiAgICBoWzBdID0gMS4wO1xyXG4gICAgZm9yICggdmFyIGogPSAxOyBqIDw9IE1BWDsgaisrICkge1xyXG4gICAgICAgIHNbai0xXSA9IHRoaXMudHJhcGV6b2lkKG1pbiwgbWF4LCBqKTtcclxuICAgICAgICBpZiAoIGogPj0gSyApIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gUG9seW5vbWlhbC5pbnRlcnBvbGF0ZShoLCBzLCBLLCBqLUssIDAuMCk7XHJcbiAgICAgICAgICAgIGlmICggTWF0aC5hYnMocmVzdWx0LmR5KSA8PSBUT0xFUkFOQ0UqcmVzdWx0LnkpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzW2pdID0gc1tqLTFdO1xyXG4gICAgICAgIGhbal0gPSAwLjI1ICogaFtqLTFdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQueTtcclxufTtcclxuXHJcbi8vIGdldHRlcnMgYW5kIHNldHRlcnNcclxuXHJcbi8qKlxyXG4gKiAgZ2V0IGRlZ3JlZVxyXG4gKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUuZ2V0RGVncmVlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb2Vmcy5sZW5ndGggLSAxO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiAgZ2V0RGVyaXZhdGl2ZVxyXG4gKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUuZ2V0RGVyaXZhdGl2ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGRlcml2YXRpdmUgPSBuZXcgUG9seW5vbWlhbCgpO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMTsgaSA8IHRoaXMuY29lZnMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgZGVyaXZhdGl2ZS5jb2Vmcy5wdXNoKGkqdGhpcy5jb2Vmc1tpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRlcml2YXRpdmU7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqICBnZXRSb290c1xyXG4gKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUuZ2V0Um9vdHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgdGhpcy5zaW1wbGlmeSgpO1xyXG4gICAgc3dpdGNoICggdGhpcy5nZXREZWdyZWUoKSApIHtcclxuICAgICAgICBjYXNlIDA6IHJlc3VsdCA9IG5ldyBBcnJheSgpOyAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOiByZXN1bHQgPSB0aGlzLmdldExpbmVhclJvb3QoKTsgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjogcmVzdWx0ID0gdGhpcy5nZXRRdWFkcmF0aWNSb290cygpOyBicmVhaztcclxuICAgICAgICBjYXNlIDM6IHJlc3VsdCA9IHRoaXMuZ2V0Q3ViaWNSb290cygpOyAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0OiByZXN1bHQgPSB0aGlzLmdldFF1YXJ0aWNSb290cygpOyAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICAvLyBzaG91bGQgdHJ5IE5ld3RvbidzIG1ldGhvZCBhbmQvb3IgYmlzZWN0aW9uXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogIGdldFJvb3RzSW5JbnRlcnZhbFxyXG4gKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUuZ2V0Um9vdHNJbkludGVydmFsID0gZnVuY3Rpb24obWluLCBtYXgpIHtcclxuICAgIHZhciByb290cyA9IG5ldyBBcnJheSgpO1xyXG4gICAgdmFyIHJvb3Q7XHJcblxyXG4gICAgaWYgKCB0aGlzLmdldERlZ3JlZSgpID09IDEgKSB7XHJcbiAgICAgICAgcm9vdCA9IHRoaXMuYmlzZWN0aW9uKG1pbiwgbWF4KTtcclxuICAgICAgICBpZiAoIHJvb3QgIT0gbnVsbCApIHJvb3RzLnB1c2gocm9vdCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGdldCByb290cyBvZiBkZXJpdmF0aXZlXHJcbiAgICAgICAgdmFyIGRlcml2ICA9IHRoaXMuZ2V0RGVyaXZhdGl2ZSgpO1xyXG4gICAgICAgIHZhciBkcm9vdHMgPSBkZXJpdi5nZXRSb290c0luSW50ZXJ2YWwobWluLCBtYXgpO1xyXG5cclxuICAgICAgICBpZiAoIGRyb290cy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAvLyBmaW5kIHJvb3Qgb24gW21pbiwgZHJvb3RzWzBdXVxyXG4gICAgICAgICAgICByb290ID0gdGhpcy5iaXNlY3Rpb24obWluLCBkcm9vdHNbMF0pO1xyXG4gICAgICAgICAgICBpZiAoIHJvb3QgIT0gbnVsbCApIHJvb3RzLnB1c2gocm9vdCk7XHJcblxyXG4gICAgICAgICAgICAvLyBmaW5kIHJvb3Qgb24gW2Ryb290c1tpXSxkcm9vdHNbaSsxXV0gZm9yIDAgPD0gaSA8PSBjb3VudC0yXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGRyb290cy5sZW5ndGgtMjsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgcm9vdCA9IHRoaXMuYmlzZWN0aW9uKGRyb290c1tpXSwgZHJvb3RzW2krMV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCByb290ICE9IG51bGwgKSByb290cy5wdXNoKHJvb3QpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBmaW5kIHJvb3Qgb24gW2Ryb290c1tjb3VudC0xXSx4bWF4XVxyXG4gICAgICAgICAgICByb290ID0gdGhpcy5iaXNlY3Rpb24oZHJvb3RzW2Ryb290cy5sZW5ndGgtMV0sIG1heCk7XHJcbiAgICAgICAgICAgIGlmICggcm9vdCAhPSBudWxsICkgcm9vdHMucHVzaChyb290KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBwb2x5bm9taWFsIGlzIG1vbm90b25lIG9uIFttaW4sbWF4XSwgaGFzIGF0IG1vc3Qgb25lIHJvb3RcclxuICAgICAgICAgICAgcm9vdCA9IHRoaXMuYmlzZWN0aW9uKG1pbiwgbWF4KTtcclxuICAgICAgICAgICAgaWYgKCByb290ICE9IG51bGwgKSByb290cy5wdXNoKHJvb3QpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcm9vdHM7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqICBnZXRMaW5lYXJSb290XHJcbiAqL1xyXG5Qb2x5bm9taWFsLnByb3RvdHlwZS5nZXRMaW5lYXJSb290ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCk7XHJcbiAgICB2YXIgYSA9IHRoaXMuY29lZnNbMV07XHJcblxyXG4gICAgaWYgKCBhICE9IDAgKVxyXG4gICAgICAgIHJlc3VsdC5wdXNoKCAtdGhpcy5jb2Vmc1swXSAvIGEgKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiAgZ2V0UXVhZHJhdGljUm9vdHNcclxuICovXHJcblBvbHlub21pYWwucHJvdG90eXBlLmdldFF1YWRyYXRpY1Jvb3RzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAgIGlmICggdGhpcy5nZXREZWdyZWUoKSA9PSAyICkge1xyXG4gICAgICAgIHZhciBhID0gdGhpcy5jb2Vmc1syXTtcclxuICAgICAgICB2YXIgYiA9IHRoaXMuY29lZnNbMV0gLyBhO1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5jb2Vmc1swXSAvIGE7XHJcbiAgICAgICAgdmFyIGQgPSBiKmIgLSA0KmM7XHJcblxyXG4gICAgICAgIGlmICggZCA+IDAgKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gTWF0aC5zcXJ0KGQpO1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKCAwLjUgKiAoLWIgKyBlKSApO1xyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goIDAuNSAqICgtYiAtIGUpICk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggZCA9PSAwICkge1xyXG4gICAgICAgICAgICAvLyByZWFsbHkgdHdvIHJvb3RzIHdpdGggc2FtZSB2YWx1ZSwgYnV0IHdlIG9ubHkgcmV0dXJuIG9uZVxyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goIDAuNSAqIC1iICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiAgZ2V0Q3ViaWNSb290c1xyXG4gKlxyXG4gKiAgVGhpcyBjb2RlIGlzIGJhc2VkIG9uIE1nY1BvbHlub21pYWwuY3BwIHdyaXR0ZW4gYnkgRGF2aWQgRWJlcmx5LiAgSGlzXHJcbiAqICBjb2RlIGFsb25nIHdpdGggbWFueSBvdGhlciBleGNlbGxlbnQgZXhhbXBsZXMgYXJlIGF2YWlhYmxlIGF0IGhpcyBzaXRlOlxyXG4gKiAgaHR0cDovL3d3dy5nZW9tZXRyaWN0b29scy5jb21cclxuICovXHJcblBvbHlub21pYWwucHJvdG90eXBlLmdldEN1YmljUm9vdHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgaWYgKCB0aGlzLmdldERlZ3JlZSgpID09IDMgKSB7XHJcbiAgICAgICAgdmFyIGMzID0gdGhpcy5jb2Vmc1szXTtcclxuICAgICAgICB2YXIgYzIgPSB0aGlzLmNvZWZzWzJdIC8gYzM7XHJcbiAgICAgICAgdmFyIGMxID0gdGhpcy5jb2Vmc1sxXSAvIGMzO1xyXG4gICAgICAgIHZhciBjMCA9IHRoaXMuY29lZnNbMF0gLyBjMztcclxuXHJcbiAgICAgICAgdmFyIGEgICAgICAgPSAoMypjMSAtIGMyKmMyKSAvIDM7XHJcbiAgICAgICAgdmFyIGIgICAgICAgPSAoMipjMipjMipjMiAtIDkqYzEqYzIgKyAyNypjMCkgLyAyNztcclxuICAgICAgICB2YXIgb2Zmc2V0ICA9IGMyIC8gMztcclxuICAgICAgICB2YXIgZGlzY3JpbSA9IGIqYi80ICsgYSphKmEvMjc7XHJcbiAgICAgICAgdmFyIGhhbGZCICAgPSBiIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIFpFUk9lcHNpbG9uID0gdGhpcy56ZXJvRXJyb3JFc3RpbWF0ZSgpO1xyXG4gICAgICAgIGlmIChNYXRoLmFicyhkaXNjcmltKSA8PSBaRVJPZXBzaWxvbikgZGlzY3JpbSA9IDA7XHJcblxyXG4gICAgICAgIGlmICggZGlzY3JpbSA+IDAgKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gTWF0aC5zcXJ0KGRpc2NyaW0pO1xyXG4gICAgICAgICAgICB2YXIgdG1wO1xyXG4gICAgICAgICAgICB2YXIgcm9vdDtcclxuXHJcbiAgICAgICAgICAgIHRtcCA9IC1oYWxmQiArIGU7XHJcbiAgICAgICAgICAgIGlmICggdG1wID49IDAgKVxyXG4gICAgICAgICAgICAgICAgcm9vdCA9IE1hdGgucG93KHRtcCwgMS8zKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcm9vdCA9IC1NYXRoLnBvdygtdG1wLCAxLzMpO1xyXG5cclxuICAgICAgICAgICAgdG1wID0gLWhhbGZCIC0gZTtcclxuICAgICAgICAgICAgaWYgKCB0bXAgPj0gMCApXHJcbiAgICAgICAgICAgICAgICByb290ICs9IE1hdGgucG93KHRtcCwgMS8zKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcm9vdCAtPSBNYXRoLnBvdygtdG1wLCAxLzMpO1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKCByb290IC0gb2Zmc2V0ICk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggZGlzY3JpbSA8IDAgKSB7XHJcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydCgtYS8zKTtcclxuICAgICAgICAgICAgdmFyIGFuZ2xlICAgID0gTWF0aC5hdGFuMiggTWF0aC5zcXJ0KC1kaXNjcmltKSwgLWhhbGZCKSAvIDM7XHJcbiAgICAgICAgICAgIHZhciBjb3MgICAgICA9IE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICAgICAgdmFyIHNpbiAgICAgID0gTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgICAgICAgICB2YXIgc3FydDMgICAgPSBNYXRoLnNxcnQoMyk7XHJcblxyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goIDIqZGlzdGFuY2UqY29zIC0gb2Zmc2V0ICk7XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCggLWRpc3RhbmNlICogKGNvcyArIHNxcnQzICogc2luKSAtIG9mZnNldCk7XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCggLWRpc3RhbmNlICogKGNvcyAtIHNxcnQzICogc2luKSAtIG9mZnNldCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRtcDtcclxuXHJcbiAgICAgICAgICAgIGlmICggaGFsZkIgPj0gMCApXHJcbiAgICAgICAgICAgICAgICB0bXAgPSAtTWF0aC5wb3coaGFsZkIsIDEvMyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRtcCA9IE1hdGgucG93KC1oYWxmQiwgMS8zKTtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCggMip0bXAgLSBvZmZzZXQgKTtcclxuICAgICAgICAgICAgLy8gcmVhbGx5IHNob3VsZCByZXR1cm4gbmV4dCByb290IHR3aWNlLCBidXQgd2UgcmV0dXJuIG9ubHkgb25lXHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCggLXRtcCAtIG9mZnNldCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0cztcclxufTtcclxuXHJcbi8qKlxyXG4gICAgU2lnbiBvZiBhIG51bWJlciAoKzEsIC0xLCArMCwgLTApLlxyXG4gKi9cclxudmFyIHNpZ24gPSBmdW5jdGlvbiAoeCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnbnVtYmVyJyA/IHggPyB4IDwgMCA/IC0xIDogMSA6IHggPT09IHggPyB4IDogTmFOIDogTmFOO1xyXG59O1xyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLyoqXHJcbiAgICBDYWxjdWxhdGVzIHJvb3RzIG9mIHF1YXJ0aWMgcG9seW5vbWlhbC4gPGJyLz5cclxuICAgIEZpcnN0LCBkZXJpdmF0aXZlIHJvb3RzIGFyZSBmb3VuZCwgdGhlbiB1c2VkIHRvIHNwbGl0IHF1YXJ0aWMgcG9seW5vbWlhbCBcclxuICAgIGludG8gc2VnbWVudHMsIGVhY2ggY29udGFpbmluZyBvbmUgcm9vdCBvZiBxdWFydGljIHBvbHlub21pYWwuXHJcbiAgICBTZWdtZW50cyBhcmUgdGhlbiBwYXNzZWQgdG8gbmV3dG9uJ3MgbWV0aG9kIHRvIGZpbmQgcm9vdHMuXHJcblxyXG4gICAgQHJldHVybnMge0FycmF5PE51bWJlcj59IHJvb3RzXHJcbiovXHJcblBvbHlub21pYWwucHJvdG90eXBlLmdldFF1YXJ0aWNSb290cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciByZXN1bHRzID0gW107XHJcblxyXG4gICAgdmFyIG4gPSB0aGlzLmdldERlZ3JlZSgpO1xyXG4gICAgaWYgKG4gPT0gNCkge1xyXG5cclxuICAgICAgICB2YXIgcG9seSA9IG5ldyBQb2x5bm9taWFsKCk7XHJcbiAgICAgICAgcG9seS5jb2VmcyA9IHRoaXMuY29lZnMuc2xpY2UoKTtcclxuICAgICAgICBwb2x5LmRpdmlkZV9zY2FsYXIocG9seS5jb2Vmc1tuXSk7XHJcbiAgICAgICAgdmFyIEVSUkYgPSAxZS0xNTtcclxuICAgICAgICBpZiAoTWF0aC5hYnMocG9seS5jb2Vmc1swXSkgPCAxMCAqIEVSUkYgKiBNYXRoLmFicyhwb2x5LmNvZWZzWzNdKSlcclxuICAgICAgICAgICAgcG9seS5jb2Vmc1swXSA9IDA7XHJcbiAgICAgICAgdmFyIHBvbHlfZCA9IHBvbHkuZ2V0RGVyaXZhdGl2ZSgpO1xyXG4gICAgICAgIHZhciBkZXJydCA9IHBvbHlfZC5nZXRSb290cygpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEgLSBiOyB9KTtcclxuICAgICAgICB2YXIgZGVyeSA9IFtdO1xyXG4gICAgICAgIHZhciBuciA9IGRlcnJ0Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgdmFyIHJiID0gdGhpcy5ib3VuZHMoKTtcclxuICAgICAgICBtYXhhYnNYID0gTWF0aC5tYXgoTWF0aC5hYnMocmIubWluWCksIE1hdGguYWJzKHJiLm1heFgpKTtcclxuICAgICAgICB2YXIgWkVST2Vwc2lsb24gPSB0aGlzLnplcm9FcnJvckVzdGltYXRlKG1heGFic1gpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPD0gbnI7IGkrKykge1xyXG4gICAgICAgICAgICBkZXJ5LnB1c2gocG9seS5ldmFsKGRlcnJ0W2ldKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDw9IG5yOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRlcnlbaV0pIDwgWkVST2Vwc2lsb24pXHJcbiAgICAgICAgICAgICAgICBkZXJ5W2ldID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGkgPSAwO1xyXG4gICAgICAgIHZhciBkeCA9IE1hdGgubWF4KDAuMSAqIChyYi5tYXhYIC0gcmIubWluWCkgLyBuLCBFUlJGKTtcclxuICAgICAgICB2YXIgZ3Vlc3NlcyA9IFtdO1xyXG4gICAgICAgIHZhciBtaW5tYXggPSBbXTtcclxuICAgICAgICBpZiAobnIgPiAtMSkge1xyXG4gICAgICAgICAgICBpZiAoZGVyeVswXSAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2lnbihkZXJ5WzBdKSAhPSBzaWduKHBvbHkuZXZhbChkZXJydFswXSAtIGR4KSAtIGRlcnlbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3Vlc3Nlcy5wdXNoKGRlcnJ0WzBdIC0gZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbm1heC5wdXNoKFtyYi5taW5YLCBkZXJydFswXV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGRlcnJ0WzBdLCBkZXJydFswXSk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoOyBpIDwgbnI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlcnlbaSArIDFdID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZGVycnRbaSArIDFdLCBkZXJydFtpICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNpZ24oZGVyeVtpXSkgIT0gc2lnbihkZXJ5W2kgKyAxXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBndWVzc2VzLnB1c2goKGRlcnJ0W2ldICsgZGVycnRbaSArIDFdKSAvIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbm1heC5wdXNoKFtkZXJydFtpXSwgZGVycnRbaSArIDFdXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRlcnlbbnJdICE9IDAgJiYgc2lnbihkZXJ5W25yXSkgIT0gc2lnbihwb2x5LmV2YWwoZGVycnRbbnJdICsgZHgpIC0gZGVyeVtucl0pKSB7XHJcbiAgICAgICAgICAgICAgICBndWVzc2VzLnB1c2goZGVycnRbbnJdICsgZHgpO1xyXG4gICAgICAgICAgICAgICAgbWlubWF4LnB1c2goW2RlcnJ0W25yXSwgcmIubWF4WF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZiA9IGZ1bmN0aW9uICh4KSB7IHJldHVybiBwb2x5LmV2YWwoeCk7IH07XHJcbiAgICAgICAgdmFyIGRmID0gZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHBvbHlfZC5ldmFsKHgpOyB9O1xyXG4gICAgICAgIGlmIChndWVzc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGd1ZXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGd1ZXNzZXNbaV0gPSBQb2x5bm9taWFsLm5ld3Rvbl9zZWNhbnRfYmlzZWN0aW9uKGd1ZXNzZXNbaV0sIGYsIGRmLCAzMiwgbWlubWF4W2ldWzBdLCBtaW5tYXhbaV1bMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQoZ3Vlc3Nlcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0cztcclxufTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLyoqXHJcbiAgICBFc3RpbWF0ZSB3aGF0IGlzIHRoZSBtYXhpbXVtIHBvbHlub21pYWwgZXZhbHVhdGlvbiBlcnJvciB2YWx1ZSB1bmRlciB3aGljaCBwb2x5bm9taWFsIGV2YWx1YXRpb24gY291bGQgYmUgaW4gZmFjdCAwLlxyXG4gICAgXHJcbiAgICBAcmV0dXJucyB7TnVtYmVyfSBcclxuKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUuemVyb0Vycm9yRXN0aW1hdGUgPSBmdW5jdGlvbiAobWF4YWJzWCkge1xyXG4gICAgdmFyIHBvbHkgPSB0aGlzO1xyXG4gICAgdmFyIEVSUkYgPSAxZS0xNTtcclxuICAgIGlmICh0eXBlb2YgbWF4YWJzWCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB2YXIgcmIgPSBwb2x5LmJvdW5kcygpO1xyXG4gICAgICAgIG1heGFic1ggPSBNYXRoLm1heChNYXRoLmFicyhyYi5taW5YKSwgTWF0aC5hYnMocmIubWF4WCkpO1xyXG4gICAgfVxyXG4gICAgaWYgKG1heGFic1ggPCAwLjAwMSkge1xyXG4gICAgICAgIHJldHVybiAyKk1hdGguYWJzKHBvbHkuZXZhbChFUlJGKSk7XHJcbiAgICB9XHJcbiAgICB2YXIgbiA9IHBvbHkuY29lZnMubGVuZ3RoIC0gMTtcclxuICAgIHZhciBhbiA9IHBvbHkuY29lZnNbbl07XHJcbiAgICByZXR1cm4gMTAgKiBFUlJGICogcG9seS5jb2Vmcy5yZWR1Y2UoZnVuY3Rpb24gKG0sIHYsIGkpIHtcclxuICAgICAgICB2YXIgbm0gPSB2IC8gYW4gKiBNYXRoLnBvdyhtYXhhYnNYLCBpKTtcclxuICAgICAgICByZXR1cm4gbm0gPiBtID8gbm0gOiBtO1xyXG4gICAgfSwgMCk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLyoqXHJcbiAgICBDYWxjdWxhdGVzIHVwcGVyIFJlYWwgcm9vdHMgYm91bmRzLiA8YnIvPlxyXG4gICAgUmVhbCByb290cyBhcmUgaW4gaW50ZXJ2YWwgW25lZ1gsIHBvc1hdLiBEZXRlcm1pbmVkIGJ5IEZ1aml3YXJhIG1ldGhvZC5cclxuICAgIEBzZWUge0BsaW5rIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUHJvcGVydGllc19vZl9wb2x5bm9taWFsX3Jvb3RzfVxyXG5cclxuICAgIEByZXR1cm5zIHt7IG5lZ1g6IE51bWJlciwgcG9zWDogTnVtYmVyIH19XHJcbiovXHJcblBvbHlub21pYWwucHJvdG90eXBlLmJvdW5kc19VcHBlclJlYWxfRnVqaXdhcmEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgYSA9IHRoaXMuY29lZnM7XHJcbiAgICB2YXIgbiA9IGEubGVuZ3RoIC0gMTtcclxuICAgIHZhciBhbiA9IGFbbl07XHJcbiAgICBpZiAoYW4gIT0gMSkge1xyXG4gICAgICAgIGEgPSB0aGlzLmNvZWZzLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gdiAvIGFuOyB9KTtcclxuICAgIH1cclxuICAgIHZhciBiID0gYS5tYXAoZnVuY3Rpb24gKHYsIGkpIHsgcmV0dXJuIChpIDwgbikgPyBNYXRoLnBvdyhNYXRoLmFicygoaSA9PSAwKSA/IHYgLyAyIDogdiksIDEgLyAobiAtIGkpKSA6IHY7IH0pO1xyXG5cclxuICAgIHZhciBjb2VmU2VsZWN0aW9uRnVuYztcclxuICAgIHZhciBmaW5kMk1heCA9IGZ1bmN0aW9uIChhY2MsIGJpLCBpKSB7XHJcbiAgICAgICAgaWYgKGNvZWZTZWxlY3Rpb25GdW5jKGkpKSB7XHJcbiAgICAgICAgICAgIGlmIChhY2MubWF4IDwgYmkpIHtcclxuICAgICAgICAgICAgICAgIGFjYy5uZWFybWF4ID0gYWNjLm1heDtcclxuICAgICAgICAgICAgICAgIGFjYy5tYXggPSBiaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChhY2MubmVhcm1heCA8IGJpKSB7XHJcbiAgICAgICAgICAgICAgICBhY2MubmVhcm1heCA9IGJpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvZWZTZWxlY3Rpb25GdW5jID0gZnVuY3Rpb24gKGkpIHsgcmV0dXJuIGkgPCBuICYmIGFbaV0gPCAwOyB9O1xyXG4gICAgdmFyIG1heF9uZWFybWF4X3BvcyA9IGIucmVkdWNlKGZpbmQyTWF4LCB7IG1heDogMCwgbmVhcm1heDogMCB9KTtcclxuXHJcbiAgICBjb2VmU2VsZWN0aW9uRnVuYyA9IGZ1bmN0aW9uIChpKSB7IHJldHVybiBpIDwgbiAmJiAoKG4gJSAyID09IGkgJSAyKSA/IGFbaV0gPCAwIDogYVtpXSA+IDApOyB9O1xyXG4gICAgdmFyIG1heF9uZWFybWF4X25lZyA9IGIucmVkdWNlKGZpbmQyTWF4LCB7IG1heDogMCwgbmVhcm1heDogMCB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5lZ1g6IC0yICogbWF4X25lYXJtYXhfbmVnLm1heCxcclxuICAgICAgICBwb3NYOiAyICogbWF4X25lYXJtYXhfcG9zLm1heFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8qKiBcclxuICAgIENhbGN1bGF0ZXMgbG93ZXIgUmVhbCByb290cyBib3VuZHMuIDxici8+XHJcbiAgICBUaGVyZSBhcmUgbm8gUmVhbCByb290cyBpbiBpbnRlcnZhbCA8bmVnWCwgcG9zWD4uIERldGVybWluZWQgYnkgRnVqaXdhcmEgbWV0aG9kLlxyXG4gICAgQHNlZSB7QGxpbmsgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Qcm9wZXJ0aWVzX29mX3BvbHlub21pYWxfcm9vdHN9XHJcblxyXG4gICAgQHJldHVybnMge3sgbmVnWDogTnVtYmVyLCBwb3NYOiBOdW1iZXIgfX1cclxuKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUuYm91bmRzX0xvd2VyUmVhbF9GdWppd2FyYSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwb2x5ID0gbmV3IFBvbHlub21pYWwoKTtcclxuICAgIHBvbHkuY29lZnMgPSB0aGlzLmNvZWZzLnNsaWNlKCkucmV2ZXJzZSgpO1xyXG4gICAgdmFyIHJlcyA9IHBvbHkuYm91bmRzX1VwcGVyUmVhbF9GdWppd2FyYSgpO1xyXG4gICAgcmVzLm5lZ1ggPSAxIC8gcmVzLm5lZ1g7XHJcbiAgICByZXMucG9zWCA9IDEgLyByZXMucG9zWDtcclxuICAgIHJldHVybiByZXM7XHJcbn07XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vKiogXHJcbiAgICBDYWxjdWxhdGVzIGxlZnQgYW5kIHJpZ2h0IFJlYWwgcm9vdHMgYm91bmRzLiA8YnIvPlxyXG4gICAgUmVhbCByb290cyBhcmUgaW4gaW50ZXJ2YWwgW21pblgsIG1heFhdLiBDb21iaW5lcyBGdWppd2FyYSBsb3dlciBhbmQgdXBwZXIgYm91bmRzIHRvIGdldCBtaW5pbWFsIGludGVydmFsLlxyXG4gICAgQHNlZSB7QGxpbmsgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Qcm9wZXJ0aWVzX29mX3BvbHlub21pYWxfcm9vdHN9XHJcblxyXG4gICAgQHJldHVybnMge3sgbWluWDogTnVtYmVyLCBtYXhYOiBOdW1iZXIgfX1cclxuKi9cclxuUG9seW5vbWlhbC5wcm90b3R5cGUuYm91bmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHVyYiA9IHRoaXMuYm91bmRzX1VwcGVyUmVhbF9GdWppd2FyYSgpO1xyXG4gICAgdmFyIHJiID0geyBtaW5YOiB1cmIubmVnWCwgbWF4WDogdXJiLnBvc1ggfTtcclxuICAgIGlmICh1cmIubmVnWCA9PT0gMCAmJiB1cmIucG9zWCA9PT0gMClcclxuICAgICAgICByZXR1cm4gcmI7XHJcbiAgICBpZiAodXJiLm5lZ1ggPT09IDApIHtcclxuICAgICAgICByYi5taW5YID0gdGhpcy5ib3VuZHNfTG93ZXJSZWFsX0Z1aml3YXJhKCkucG9zWDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVyYi5wb3NYID09PSAwKSB7XHJcbiAgICAgICAgcmIubWF4WCA9IHRoaXMuYm91bmRzX0xvd2VyUmVhbF9GdWppd2FyYSgpLm5lZ1g7XHJcbiAgICB9XHJcbiAgICBpZiAocmIubWluWCA+IHJiLm1heFgpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdQb2x5bm9taWFsLnByb3RvdHlwZS5ib3VuZHM6IHBvbHkgaGFzIG5vIHJlYWwgcm9vdHM/IG9yIGZsb2F0aW5nIHBvaW50IGVycm9yPycpO1xyXG4gICAgICAgIHJiLm1pblggPSByYi5tYXhYID0gMDtcclxuICAgIH1cclxuICAgIHJldHVybiByYjtcclxuICAgIC8vIFRPRE86IGlmIHN1cmUgdGhhdCB0aGVyZSBhcmUgbm8gY29tcGxleCByb290cyBcclxuICAgIC8vIChtYXliZSBieSB1c2luZyBTdHVybSdzIHRoZW9yZW0pIHVzZTpcclxuICAgIC8vcmV0dXJuIHRoaXMuYm91bmRzX1JlYWxfTGFndWVycmUoKTtcclxufTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIFxyXG4vKipcclxuICAgIE5ld3RvbidzIChOZXd0b24tUmFwaHNvbikgbWV0aG9kIGZvciBmaW5kaW5nIFJlYWwgcm9vdHMgb24gdW5pdmFyaWF0ZSBmdW5jdGlvbi4gPGJyLz5cclxuICAgIFdoZW4gdXNpbmcgYm91bmRzLCBhbGdvcml0aG0gZmFsbHMgYmFjayB0byBzZWNhbnQgaWYgbmV3dG9uIGdvZXMgb3V0IG9mIHJhbmdlLlxyXG4gICAgQmlzZWN0aW9uIGlzIGZhbGxiYWNrIGZvciBzZWNhbnQgd2hlbiBkZXRlcm1pbmVkIHNlY2FudCBpcyBub3QgZWZmaWNpZW50IGVub3VnaC5cclxuICAgIEBzZWUge0BsaW5rIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTmV3dG9uJTI3c19tZXRob2R9XHJcbiAgICBAc2VlIHtAbGluayBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NlY2FudF9tZXRob2R9XHJcbiAgICBAc2VlIHtAbGluayBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jpc2VjdGlvbl9tZXRob2R9XHJcblxyXG4gICAgQHBhcmFtIHtOdW1iZXJ9IHgwIC0gSW5pdGFsIHJvb3QgZ3Vlc3NcclxuICAgIEBwYXJhbSB7ZnVuY3Rpb24oeCl9IGYgLSBGdW5jdGlvbiB3aGljaCByb290IHdlIGFyZSB0cnlpbmcgdG8gZmluZFxyXG4gICAgQHBhcmFtIHtmdW5jdGlvbih4KX0gZGYgLSBEZXJpdmF0aXZlIG9mIGZ1bmN0aW9uIGZcclxuICAgIEBwYXJhbSB7TnVtYmVyfSBtYXhfaXRlcmF0aW9ucyAtIE1heGltdW0gbnVtYmVyIG9mIGFsZ29yaXRobSBpdGVyYXRpb25zXHJcbiAgICBAcGFyYW0ge051bWJlcn0gW21pbl94XSAtIExlZnQgYm91bmQgdmFsdWVcclxuICAgIEBwYXJhbSB7TnVtYmVyfSBbbWF4X3hdIC0gUmlnaHQgYm91bmQgdmFsdWVcclxuICAgIEByZXR1cm5zIHtOdW1iZXJ9IC0gcm9vdFxyXG4qL1xyXG5Qb2x5bm9taWFsLm5ld3Rvbl9zZWNhbnRfYmlzZWN0aW9uID0gZnVuY3Rpb24gKHgwLCBmLCBkZiwgbWF4X2l0ZXJhdGlvbnMsIG1pbiwgbWF4KSB7XHJcbiAgICB2YXIgeCwgcHJldl9kZnggPSAwLCBkZngsIHByZXZfeF9lZl9jb3JyZWN0aW9uID0gMCwgeF9jb3JyZWN0aW9uLCB4X25ldztcclxuICAgIHZhciB2LCB5X2F0bWluLCB5X2F0bWF4O1xyXG4gICAgeCA9IHgwO1xyXG4gICAgdmFyIEFDQ1VSQUNZID0gMTQ7XHJcbiAgICB2YXIgbWluX2NvcnJlY3Rpb25fZmFjdG9yID0gTWF0aC5wb3coMTAsIC1BQ0NVUkFDWSk7XHJcbiAgICB2YXIgaXNCb3VuZGVkID0gKHR5cGVvZiBtaW4gPT09ICdudW1iZXInICYmIHR5cGVvZiBtYXggPT09ICdudW1iZXInKTtcclxuICAgIGlmIChpc0JvdW5kZWQpIHtcclxuICAgICAgICBpZiAobWluID4gbWF4KVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJuZXd0b24gcm9vdCBmaW5kaW5nOiBtaW4gbXVzdCBiZSBncmVhdGVyIHRoYW4gbWF4XCIpO1xyXG4gICAgICAgIHlfYXRtaW4gPSBmKG1pbik7XHJcbiAgICAgICAgeV9hdG1heCA9IGYobWF4KTtcclxuICAgICAgICBpZiAoc2lnbih5X2F0bWluKSA9PSAgc2lnbih5X2F0bWF4KSlcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibmV3dG9uIHJvb3QgZmluZGluZzogeSB2YWx1ZXMgb2YgYm91bmRzIG11c3QgYmUgb2Ygb3Bwb3NpdGUgc2lnblwiKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNFbm91Z2hDb3JyZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIHN0b3AgaWYgY29ycmVjdGlvbiBpcyB0b28gc21hbGxcclxuICAgICAgICAvLyBvciBpZiBjb3JyZWN0aW9uIGlzIGluIHNpbXBsZSBsb29wXHJcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyh4X2NvcnJlY3Rpb24pIDw9IG1pbl9jb3JyZWN0aW9uX2ZhY3RvciAqIE1hdGguYWJzKHgpKVxyXG4gICAgICAgICAgICB8fCAocHJldl94X2VmX2NvcnJlY3Rpb24gPT0gKHggLSB4X2NvcnJlY3Rpb24pIC0geCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBpO1xyXG4gICAgLy92YXIgc3RlcE1ldGhvZDtcclxuICAgIC8vdmFyIGRldGFpbHMgPSBbXTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBtYXhfaXRlcmF0aW9uczsgaSsrKSB7XHJcbiAgICAgICAgZGZ4ID0gZGYoeCk7XHJcbiAgICAgICAgaWYgKGRmeCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmV2X2RmeCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlcnJvclxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibmV3dG9uIHJvb3QgZmluZGluZzogZGYoeCkgaXMgemVyb1wiKTtcclxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1c2UgcHJldmlvdXMgZGVyaXZhdGlvbiB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgZGZ4ID0gcHJldl9kZng7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gb3IgbW92ZSB4IGEgbGl0dGxlP1xyXG4gICAgICAgICAgICAvL2RmeCA9IGRmKHggIT0gMCA/IHggKyB4ICogMWUtMTUgOiAxZS0xNSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vc3RlcE1ldGhvZCA9ICduZXd0b24nO1xyXG4gICAgICAgIHByZXZfZGZ4ID0gZGZ4O1xyXG4gICAgICAgIHkgPSBmKHgpO1xyXG4gICAgICAgIHhfY29ycmVjdGlvbiA9IHkgLyBkZng7XHJcbiAgICAgICAgeF9uZXcgPSB4IC0geF9jb3JyZWN0aW9uO1xyXG4gICAgICAgIGlmIChpc0Vub3VnaENvcnJlY3Rpb24oKSkge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc0JvdW5kZWQpIHtcclxuICAgICAgICAgICAgaWYgKHNpZ24oeSkgPT0gc2lnbih5X2F0bWF4KSkge1xyXG4gICAgICAgICAgICAgICAgbWF4ID0geDtcclxuICAgICAgICAgICAgICAgIHlfYXRtYXggPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHNpZ24oeSkgPT0gc2lnbih5X2F0bWluKSkge1xyXG4gICAgICAgICAgICAgICAgbWluID0geDtcclxuICAgICAgICAgICAgICAgIHlfYXRtaW4gPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgeCA9IHhfbmV3O1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIm5ld3RvbiByb290IGZpbmRpbmc6IHNpZ24oeSkgbm90IG1hdGNoZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgoeF9uZXcgPCBtaW4pIHx8ICh4X25ldyA+IG1heCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaWduKHlfYXRtaW4pID09IHNpZ24oeV9hdG1heCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgUkFUSU9fTElNSVQgPSA1MDtcclxuICAgICAgICAgICAgICAgIHZhciBBSU1FRF9CSVNFQ1RfT0ZGU0VUID0gMC4yNTsgLy8gWzAsIDAuNSlcclxuICAgICAgICAgICAgICAgIHZhciBkeSA9IHlfYXRtYXggLSB5X2F0bWluO1xyXG4gICAgICAgICAgICAgICAgdmFyIGR4ID0gbWF4IC0gbWluO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkeSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9zdGVwTWV0aG9kID0gJ2Jpc2VjdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgeF9jb3JyZWN0aW9uID0geCAtIChtaW4gKyBkeCAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhkeSAvIE1hdGgubWluKHlfYXRtaW4sIHlfYXRtYXgpKSA+IFJBVElPX0xJTUlUKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9zdGVwTWV0aG9kID0gJ2FpbWVkIGJpc2VjdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgeF9jb3JyZWN0aW9uID0geCAtIChtaW4gKyBkeCAqICgwLjUgKyAoTWF0aC5hYnMoeV9hdG1pbikgPCBNYXRoLmFicyh5X2F0bWF4KSA/IC1BSU1FRF9CSVNFQ1RfT0ZGU0VUIDogQUlNRURfQklTRUNUX09GRlNFVCkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vc3RlcE1ldGhvZCA9ICdzZWNhbnQnOyBcclxuICAgICAgICAgICAgICAgICAgICB4X2NvcnJlY3Rpb24gPSB4IC0gKG1pbiAtIHlfYXRtaW4gLyBkeSAqIGR4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHhfbmV3ID0geCAtIHhfY29ycmVjdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNFbm91Z2hDb3JyZWN0aW9uKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2RldGFpbHMucHVzaChbc3RlcE1ldGhvZCwgaSwgeCwgeF9uZXcsIHhfY29ycmVjdGlvbiwgbWluLCBtYXgsIHldKTtcclxuICAgICAgICBwcmV2X3hfZWZfY29ycmVjdGlvbiA9IHggLSB4X25ldztcclxuICAgICAgICB4ID0geF9uZXc7XHJcbiAgICB9XHJcbiAgICAvL2RldGFpbHMucHVzaChbc3RlcE1ldGhvZCwgaSwgeCwgeF9uZXcsIHhfY29ycmVjdGlvbiwgbWluLCBtYXgsIHldKTtcclxuICAgIC8vY29uc29sZS5sb2coZGV0YWlscy5qb2luKCdcXHJcXG4nKSk7XHJcbiAgICAvL2lmIChpID09IG1heF9pdGVyYXRpb25zKVxyXG4gICAgLy8gICAgY29uc29sZS5sb2coJ25ld3Q6IHN0ZXBzPScgKyAoKGk9PW1heF9pdGVyYXRpb25zKT8gaTooaSArIDEpKSk7XHJcbiAgICByZXR1cm4geDtcclxufTtcclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFBvbHlub21pYWw7XHJcbn1cclxuXHJcbn0se31dLDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICpcclxuICogICBTcXJ0UG9seW5vbWlhbC5qc1xyXG4gKlxyXG4gKiAgIGNvcHlyaWdodCAyMDAzLCAyMDEzIEtldmluIExpbmRzZXlcclxuICpcclxuICovXHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgdmFyIFBvbHlub21pYWwgPSByZXF1aXJlKFwiLi9Qb2x5bm9taWFsXCIpO1xyXG59XHJcblxyXG4vKipcclxuICogICBjbGFzcyB2YXJpYWJsZXNcclxuICovXHJcblNxcnRQb2x5bm9taWFsLlZFUlNJT04gPSAxLjA7XHJcblxyXG4vLyBzZXR1cCBpbmhlcml0YW5jZVxyXG5TcXJ0UG9seW5vbWlhbC5wcm90b3R5cGUgICAgICAgICAgICAgPSBuZXcgUG9seW5vbWlhbCgpO1xyXG5TcXJ0UG9seW5vbWlhbC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTcXJ0UG9seW5vbWlhbDtcclxuU3FydFBvbHlub21pYWwuc3VwZXJjbGFzcyAgICAgICAgICAgID0gUG9seW5vbWlhbC5wcm90b3R5cGU7XHJcblxyXG5cclxuLyoqXHJcbiAqICBTcXJ0UG9seW5vbWlhbFxyXG4gKi9cclxuZnVuY3Rpb24gU3FydFBvbHlub21pYWwoKSB7XHJcbiAgICB0aGlzLmluaXQoIGFyZ3VtZW50cyApO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqICBldmFsXHJcbiAqXHJcbiAqICBAcGFyYW0ge051bWJlcn0geFxyXG4gKiAgQHJldHVybnMge051bWJlcn1cclxuICovXHJcblNxcnRQb2x5bm9taWFsLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oeCkge1xyXG4gICAgdmFyIFRPTEVSQU5DRSA9IDFlLTc7XHJcbiAgICB2YXIgcmVzdWx0ID0gU3FydFBvbHlub21pYWwuc3VwZXJjbGFzcy5ldmFsLmNhbGwodGhpcywgeCk7XHJcblxyXG4gICAgLy8gTk9URTogTWF5IG5lZWQgdG8gY2hhbmdlIHRoZSBmb2xsb3dpbmcuICBJIGFkZGVkIHRoZXNlIHRvIGNhcHR1cmVcclxuICAgIC8vIHNvbWUgcmVhbGx5IHNtYWxsIG5lZ2F0aXZlIHZhbHVlcyB0aGF0IHdlcmUgYmVpbmcgZ2VuZXJhdGVkIGJ5IG9uZVxyXG4gICAgLy8gb2YgbXkgQmV6aWVyIGFyY0xlbmd0aCBmdW5jdGlvbnNcclxuICAgIGlmICggTWF0aC5hYnMocmVzdWx0KSA8IFRPTEVSQU5DRSApIHJlc3VsdCA9IDA7XHJcbiAgICBpZiAoIHJlc3VsdCA8IDAgKVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNxcnRQb2x5bm9taWFsLmV2YWw6IGNhbm5vdCB0YWtlIHNxdWFyZSByb290IG9mIG5lZ2F0aXZlIG51bWJlclwiKTtcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHJlc3VsdCk7XHJcbn07XHJcblxyXG5TcXJ0UG9seW5vbWlhbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciByZXN1bHQgPSBTcXJ0UG9seW5vbWlhbC5zdXBlcmNsYXNzLnRvU3RyaW5nLmNhbGwodGhpcyk7XHJcblxyXG4gICAgcmV0dXJuIFwic3FydChcIiArIHJlc3VsdCArIFwiKVwiO1xyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gU3FydFBvbHlub21pYWw7XHJcbn1cclxuXHJcbn0se1wiLi9Qb2x5bm9taWFsXCI6Nn1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xyXG4vLyBleHBvc2UgbW9kdWxlIGNsYXNzZXNcclxuXHJcbmV4cG9ydHMuaW50ZXJzZWN0ID0gcmVxdWlyZSgnLi9saWIvaW50ZXJzZWN0Jyk7XHJcbmV4cG9ydHMuc2hhcGUgPSByZXF1aXJlKCcuL2xpYi9JbnRlcnNlY3Rpb25QYXJhbXMnKS5uZXdTaGFwZTtcclxufSx7XCIuL2xpYi9JbnRlcnNlY3Rpb25QYXJhbXNcIjoxMCxcIi4vbGliL2ludGVyc2VjdFwiOjEyfV0sOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiAgSW50ZXJzZWN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBJbnRlcnNlY3Rpb24oc3RhdHVzKSB7XHJcbiAgICB0aGlzLmluaXQoc3RhdHVzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqICBpbml0XHJcbiAqXHJcbiAqICBAcGFyYW0ge1N0cmluZ30gc3RhdHVzXHJcbiAqICBAcmV0dXJucyB7SW50ZXJzZWN0aW9ufVxyXG4gKi9cclxuSW50ZXJzZWN0aW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oc3RhdHVzKSB7XHJcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgIHRoaXMucG9pbnRzID0gW107XHJcbn07XHJcblxyXG4vKipcclxuICogIGFwcGVuZFBvaW50XHJcbiAqXHJcbiAqICBAcGFyYW0ge1BvaW50MkR9IHBvaW50XHJcbiAqL1xyXG5JbnRlcnNlY3Rpb24ucHJvdG90eXBlLmFwcGVuZFBvaW50ID0gZnVuY3Rpb24ocG9pbnQpIHtcclxuICAgIHRoaXMucG9pbnRzLnB1c2gocG9pbnQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBhcHBlbmRQb2ludHNcclxuICpcclxuICogIEBwYXJhbSB7QXJyYXk8UG9pbnQyRD59IHBvaW50c1xyXG4gKi9cclxuSW50ZXJzZWN0aW9uLnByb3RvdHlwZS5hcHBlbmRQb2ludHMgPSBmdW5jdGlvbihwb2ludHMpIHtcclxuICAgIHRoaXMucG9pbnRzID0gdGhpcy5wb2ludHMuY29uY2F0KHBvaW50cyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyc2VjdGlvbjtcclxuXHJcbn0se31dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcclxudmFyIFBvaW50MkQgPSByZXF1aXJlKCdrbGQtYWZmaW5lJykuUG9pbnQyRDtcclxuXHJcblxyXG4vKipcclxuICAgIGdldEFyY1BhcmFtZXRlcnNcclxuXHJcbiAgICBAcGFyYW0ge1BvaW50MkR9IHN0YXJ0UG9pbnRcclxuICAgIEBwYXJhbSB7UG9pbnQyRH0gZW5kUG9pbnRcclxuICAgIEBwYXJhbSB7TnVtYmVyfSByeFxyXG4gICAgQHBhcmFtIHtOdW1iZXJ9IHJ5XHJcbiAgICBAcGFyYW0ge051bWJlcn0gYW5nbGUgLSBpbiBkZWdyZWVzXHJcbiAgICBAcGFyYW0ge0Jvb2xlYW59IGFyY0ZsYWdcclxuICAgIEBwYXJhbSB7Qm9vbGVhbn0gc3dlZXBGbGFnXHJcbiAgICBAcmV0dXJucyB7eyBjZW50ZXI6IFBvaW50MkQsIHJ4OiBOdW1iZXIsIHJ5OiBOdW1iZXIsIHRoZXRhMTogTnVtYmVyLCBkZWx0YVRoZXRhOiBOdW1iZXIgfX1cclxuKi9cclxuZnVuY3Rpb24gZ2V0QXJjUGFyYW1ldGVycyhzdGFydFBvaW50LCBlbmRQb2ludCwgcngsIHJ5LCBhbmdsZSwgYXJjRmxhZywgc3dlZXBGbGFnKSB7XHJcbiAgICBmdW5jdGlvbiByYWRpYW4odXgsIHV5LCB2eCwgdnkpIHtcclxuICAgICAgICB2YXIgZG90ID0gdXggKiB2eCArIHV5ICogdnk7XHJcbiAgICAgICAgdmFyIG1vZCA9IE1hdGguc3FydCgodXggKiB1eCArIHV5ICogdXkpICogKHZ4ICogdnggKyB2eSAqIHZ5KSk7XHJcbiAgICAgICAgdmFyIHJhZCA9IE1hdGguYWNvcyhkb3QgLyBtb2QpO1xyXG4gICAgICAgIGlmICh1eCAqIHZ5IC0gdXkgKiB2eCA8IDAuMCkgcmFkID0gLXJhZDtcclxuICAgICAgICByZXR1cm4gcmFkO1xyXG4gICAgfVxyXG4gICAgYW5nbGUgPSBhbmdsZSAqIE1hdGguUEkgLyAxODA7XHJcbiAgICB2YXIgYyA9IE1hdGguY29zKGFuZ2xlKTtcclxuICAgIHZhciBzID0gTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgdmFyIFRPTEVSQU5DRSA9IDFlLTY7XHJcbiAgICB2YXIgaGFsZkRpZmYgPSBzdGFydFBvaW50LnN1YnRyYWN0KGVuZFBvaW50KS5kaXZpZGUoMik7XHJcbiAgICB2YXIgeDFwID0gaGFsZkRpZmYueCAqIGMgKyBoYWxmRGlmZi55ICogcztcclxuICAgIHZhciB5MXAgPSBoYWxmRGlmZi54ICogLXMgKyBoYWxmRGlmZi55ICogYztcclxuICAgIHZhciB4MXB4MXAgPSB4MXAgKiB4MXA7XHJcbiAgICB2YXIgeTFweTFwID0geTFwICogeTFwO1xyXG4gICAgdmFyIGxhbWJkYSA9ICh4MXB4MXAgLyAocnggKiByeCkpICsgKHkxcHkxcCAvIChyeSAqIHJ5KSk7XHJcbiAgICB2YXIgZmFjdG9yO1xyXG4gICAgaWYgKGxhbWJkYSA+IDEpIHtcclxuICAgICAgICBmYWN0b3IgPSBNYXRoLnNxcnQobGFtYmRhKTtcclxuICAgICAgICByeCAqPSBmYWN0b3I7XHJcbiAgICAgICAgcnkgKj0gZmFjdG9yO1xyXG4gICAgfVxyXG4gICAgdmFyIHJ4cnggPSByeCAqIHJ4O1xyXG4gICAgdmFyIHJ5cnkgPSByeSAqIHJ5O1xyXG4gICAgdmFyIHJ4eTEgPSByeHJ4ICogeTFweTFwO1xyXG4gICAgdmFyIHJ5eDEgPSByeXJ5ICogeDFweDFwO1xyXG4gICAgZmFjdG9yID0gKHJ4cnggKiByeXJ5IC0gcnh5MSAtIHJ5eDEpIC8gKHJ4eTEgKyByeXgxKTtcclxuICAgIGlmIChNYXRoLmFicyhmYWN0b3IpIDwgVE9MRVJBTkNFKSBmYWN0b3IgPSAwO1xyXG4gICAgdmFyIHNxID0gTWF0aC5zcXJ0KGZhY3Rvcik7XHJcbiAgICBpZiAoYXJjRmxhZyA9PSBzd2VlcEZsYWcpIHNxID0gLXNxO1xyXG4gICAgdmFyIG1pZCA9IHN0YXJ0UG9pbnQuYWRkKGVuZFBvaW50KS5kaXZpZGUoMik7XHJcbiAgICB2YXIgY3hwID0gc3EgKiByeCAqIHkxcCAvIHJ5O1xyXG4gICAgdmFyIGN5cCA9IHNxICogLXJ5ICogeDFwIC8gcng7XHJcbiAgICAvL3JldHVybiBuZXcgUG9pbnQyRChjeHAgKiBjIC0gY3lwICogcyArIG1pZC54LCBjeHAgKiBzICsgY3lwICogYyArIG1pZC55KTtcclxuXHJcbiAgICB2YXIgeGNyMSA9ICh4MXAgLSBjeHApIC8gcng7XHJcbiAgICB2YXIgeGNyMiA9ICh4MXAgKyBjeHApIC8gcng7XHJcbiAgICB2YXIgeWNyMSA9ICh5MXAgLSBjeXApIC8gcnk7XHJcbiAgICB2YXIgeWNyMiA9ICh5MXAgKyBjeXApIC8gcnk7XHJcblxyXG4gICAgdmFyIHRoZXRhMSA9IHJhZGlhbigxLjAsIDAuMCwgeGNyMSwgeWNyMSk7XHJcblxyXG4gICAgdmFyIGRlbHRhVGhldGEgPSByYWRpYW4oeGNyMSwgeWNyMSwgLXhjcjIsIC15Y3IyKTtcclxuICAgIHZhciBQSXgyID0gTWF0aC5QSSAqIDIuMDtcclxuICAgIHdoaWxlIChkZWx0YVRoZXRhID4gUEl4MikgZGVsdGFUaGV0YSAtPSBQSXgyO1xyXG4gICAgd2hpbGUgKGRlbHRhVGhldGEgPCAwLjApIGRlbHRhVGhldGEgKz0gUEl4MjtcclxuICAgIGlmIChzd2VlcEZsYWcgPT0gZmFsc2UpIGRlbHRhVGhldGEgLT0gUEl4MjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNlbnRlcjogbmV3IFBvaW50MkQoY3hwICogYyAtIGN5cCAqIHMgKyBtaWQueCwgY3hwICogcyArIGN5cCAqIGMgKyBtaWQueSksXHJcbiAgICAgICAgcng6IHJ4LFxyXG4gICAgICAgIHJ5OiByeSxcclxuICAgICAgICB0aGV0YTE6IHRoZXRhMSxcclxuICAgICAgICBkZWx0YVRoZXRhOiBkZWx0YVRoZXRhXHJcbiAgICB9O1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqICBJbnRlcnNlY3Rpb25QYXJhbXNcclxuICpcclxuICogIEBwYXJhbSB7U3RyaW5nfSBuYW1lXHJcbiAqICBAcGFyYW0ge0FycmF5PFBvaW50MkR9IHBhcmFtc1xyXG4gKiAgQHJldHVybnMge0ludGVyc2VjdGlvblBhcmFtc31cclxuICovXHJcbmZ1bmN0aW9uIEludGVyc2VjdGlvblBhcmFtcyhuYW1lLCBwYXJhbXMpIHtcclxuICAgIHRoaXMuaW5pdChuYW1lLCBwYXJhbXMpO1xyXG59XHJcblxyXG4vKipcclxuICogIGluaXRcclxuICpcclxuICogIEBwYXJhbSB7U3RyaW5nfSB0eXBlXHJcbiAqICBAcGFyYW0ge0FycmF5PFBvaW50MkQ+fSBwYXJhbXNcclxuICovXHJcbkludGVyc2VjdGlvblBhcmFtcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0eXBlLCBwYXJhbXMpIHtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMubWV0YSA9IHt9O1xyXG59O1xyXG5cclxuSW50ZXJzZWN0aW9uUGFyYW1zLlRZUEUgPSB7fTtcclxudmFyIElQVFlQRSA9IEludGVyc2VjdGlvblBhcmFtcy5UWVBFO1xyXG5JUFRZUEUuTElORSA9ICdMaW5lJztcclxuSVBUWVBFLlJFQ1QgPSAnUmVjdGFuZ2xlJztcclxuSVBUWVBFLlJPVU5EUkVDVCA9ICdSb3VuZFJlY3RhbmdsZSc7XHJcbklQVFlQRS5DSVJDTEUgPSAnQ2lyY2xlJztcclxuSVBUWVBFLkVMTElQU0UgPSAnRWxsaXBzZSc7XHJcbklQVFlQRS5QT0xZR09OID0gJ1BvbHlnb24nO1xyXG5JUFRZUEUuUE9MWUxJTkUgPSAnUG9seWxpbmUnO1xyXG5JUFRZUEUuUEFUSCA9ICdQYXRoJztcclxuSVBUWVBFLkFSQyA9ICdBcmMnO1xyXG5JUFRZUEUuQkVaSUVSMiA9ICdCZXppZXIyJztcclxuSVBUWVBFLkJFWklFUjMgPSAnQmV6aWVyMyc7XHJcblxyXG5cclxuZnVuY3Rpb24gcGFyc2VQb2ludHNTdHJpbmcocG9pbnRzKSB7XHJcbiAgICByZXR1cm4gcG9pbnRzLnNwbGl0KFwiIFwiKS5tYXAoZnVuY3Rpb24ocG9pbnQpIHtcclxuICAgICAgICBwb2ludCA9IHBvaW50LnNwbGl0KFwiLFwiKTtcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50MkQocG9pbnRbMF0sIHBvaW50WzFdKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5JbnRlcnNlY3Rpb25QYXJhbXMubmV3U2hhcGUgPSBmdW5jdGlvbihzdmdFbGVtZW50TmFtZSwgcHJvcHMpIHtcclxuICAgIHN2Z0VsZW1lbnROYW1lID0gc3ZnRWxlbWVudE5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBpZihzdmdFbGVtZW50TmFtZSA9PT0gXCJsaW5lXCIpIHtcclxuICAgICAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld0xpbmUoXHJcbiAgICAgICAgICAgIG5ldyBQb2ludDJEKHByb3BzLngxLCBwcm9wcy55MSksXHJcbiAgICAgICAgICAgIG5ldyBQb2ludDJEKHByb3BzLngyLCBwcm9wcy55MilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHN2Z0VsZW1lbnROYW1lID09PSBcInJlY3RcIikge1xyXG4gICAgICAgIGlmKHByb3BzLnJ4ID4gMCB8fCBwcm9wcy5yeSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIEludGVyc2VjdGlvblBhcmFtcy5uZXdSb3VuZFJlY3QoXHJcbiAgICAgICAgICAgICAgICBwcm9wcy54LCBwcm9wcy55LFxyXG4gICAgICAgICAgICAgICAgcHJvcHMud2lkdGgsIHByb3BzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHByb3BzLnJ4LCBwcm9wcy5yeVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBJbnRlcnNlY3Rpb25QYXJhbXMubmV3UmVjdChcclxuICAgICAgICAgICAgICAgIHByb3BzLngsIHByb3BzLnksXHJcbiAgICAgICAgICAgICAgICBwcm9wcy53aWR0aCwgcHJvcHMuaGVpZ2h0XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKHN2Z0VsZW1lbnROYW1lID09PSBcImNpcmNsZVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIEludGVyc2VjdGlvblBhcmFtcy5uZXdDaXJjbGUoXHJcbiAgICAgICAgICAgIG5ldyBQb2ludDJEKHByb3BzLmN4LCBwcm9wcy5jeSksXHJcbiAgICAgICAgICAgIHByb3BzLnJcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHN2Z0VsZW1lbnROYW1lID09PSBcImVsbGlwc2VcIikge1xyXG4gICAgICAgIHJldHVybiBJbnRlcnNlY3Rpb25QYXJhbXMubmV3RWxsaXBzZShcclxuICAgICAgICAgICAgbmV3IFBvaW50MkQocHJvcHMuY3gsIHByb3BzLmN5KSxcclxuICAgICAgICAgICAgcHJvcHMucngsIHByb3BzLnJ5XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZihzdmdFbGVtZW50TmFtZSA9PT0gXCJwb2x5Z29uXCIpIHtcclxuICAgICAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld1BvbHlnb24oXHJcbiAgICAgICAgICAgIHBhcnNlUG9pbnRzU3RyaW5nKHByb3BzLnBvaW50cylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHN2Z0VsZW1lbnROYW1lID09PSBcInBvbHlsaW5lXCIpIHtcclxuICAgICAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld1BvbHlsaW5lKFxyXG4gICAgICAgICAgICBwYXJzZVBvaW50c1N0cmluZyhwcm9wcy5wb2ludHMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZihzdmdFbGVtZW50TmFtZSA9PT0gXCJwYXRoXCIpIHtcclxuICAgICAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld1BhdGgoXHJcbiAgICAgICAgICAgIHByb3BzLmRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLyoqXHJcbiAgICBDcmVhdGVzIEludGVyc2VjdGlvblBhcmFtcyBmb3IgYXJjLlxyXG5cclxuICAgIEBwYXJhbSB7UG9pbnQyRH0gc3RhcnRQb2ludCAtIGFyYyBzdGFydCBwb2ludFxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBlbmRQb2ludCAtIGFyYyBlbmQgcG9pbnRcclxuICAgIEBwYXJhbSB7TnVtYmVyfSByeCAtIGFyYyBlbGxpcHNlIHggcmFkaXVzXHJcbiAgICBAcGFyYW0ge051bWJlcn0gcnkgLSBhcmMgZWxsaXBzZSB5IHJhZGl1c1xyXG4gICAgQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlIC0gYXJjIGVsbGlwc2Ugcm90YXRpb24gaW4gZGVncmVlc1xyXG4gICAgQHBhcmFtIHtCb29sZWFufSBsYXJnZUFyY0ZsYWdcclxuICAgIEBwYXJhbSB7Qm9vbGVhbn0gc3dlZXBGbGFnXHJcbiAgICBAcmV0dXJucyB7SW50ZXJzZWN0aW9uUGFyYW1zfVxyXG4qL1xyXG5JbnRlcnNlY3Rpb25QYXJhbXMubmV3QXJjID0gZnVuY3Rpb24gKHN0YXJ0UG9pbnQsIGVuZFBvaW50LCByeCwgcnksIGFuZ2xlLCBsYXJnZUFyY0ZsYWcsIHN3ZWVwRmxhZykge1xyXG4gICAgdmFyIHAgPSBnZXRBcmNQYXJhbWV0ZXJzKHN0YXJ0UG9pbnQsIGVuZFBvaW50LCByeCwgcnksIGFuZ2xlLCBsYXJnZUFyY0ZsYWcsIHN3ZWVwRmxhZyk7XHJcbiAgICByZXR1cm4gbmV3IEludGVyc2VjdGlvblBhcmFtcyhJUFRZUEUuQVJDLCBbcC5jZW50ZXIsIHAucngsIHAucnksIChhbmdsZSAqIE1hdGguUEkgLyAxODApLCBwLnRoZXRhMSwgcC5kZWx0YVRoZXRhXSk7XHJcbn07XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8qKlxyXG4gICAgQ3JlYXRlcyBJbnRlcnNlY3Rpb25QYXJhbXMgZm9yIGJlemllcjIuXHJcblxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBwMVxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBwMlxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBwM1xyXG4gICAgQHJldHVybnMge0ludGVyc2VjdGlvblBhcmFtc31cclxuKi9cclxuSW50ZXJzZWN0aW9uUGFyYW1zLm5ld0JlemllcjIgPSBmdW5jdGlvbiAocDEsIHAyLCBwMykge1xyXG4gICAgcmV0dXJuIG5ldyBJbnRlcnNlY3Rpb25QYXJhbXMoSVBUWVBFLkJFWklFUjIsIFtwMSwgcDIsIHAzXSk7XHJcbn07XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8qKlxyXG4gICAgQ3JlYXRlcyBJbnRlcnNlY3Rpb25QYXJhbXMgZm9yIGJlemllcjMuXHJcblxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBwMVxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBwMlxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBwM1xyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBwNFxyXG4gICAgQHJldHVybnMge0ludGVyc2VjdGlvblBhcmFtc31cclxuKi9cclxuSW50ZXJzZWN0aW9uUGFyYW1zLm5ld0JlemllcjMgPSBmdW5jdGlvbiAocDEsIHAyLCBwMywgcDQpIHtcclxuICAgIHJldHVybiBuZXcgSW50ZXJzZWN0aW9uUGFyYW1zKElQVFlQRS5CRVpJRVIzLCBbcDEsIHAyLCBwMywgcDRdKTtcclxufTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLyoqXHJcbiAgICBDcmVhdGVzIEludGVyc2VjdGlvblBhcmFtcyBmb3IgY2lyY2xlLlxyXG5cclxuICAgIEBwYXJhbSB7UG9pbnQyRH0gY1xyXG4gICAgQHBhcmFtIHtOdW1iZXJ9IHJcclxuICAgIEByZXR1cm5zIHtJbnRlcnNlY3Rpb25QYXJhbXN9XHJcbiovXHJcbkludGVyc2VjdGlvblBhcmFtcy5uZXdDaXJjbGUgPSBmdW5jdGlvbiAoYywgcikge1xyXG4gICAgcmV0dXJuIG5ldyBJbnRlcnNlY3Rpb25QYXJhbXMoSVBUWVBFLkNJUkNMRSwgW2MsIHJdKTtcclxufTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLyoqXHJcbiAgICBDcmVhdGVzIEludGVyc2VjdGlvblBhcmFtcyBmb3IgZWxsaXBzZS5cclxuXHJcbiAgICBAcGFyYW0ge1BvaW50MkR9IGNcclxuICAgIEBwYXJhbSB7TnVtYmVyfSByeFxyXG4gICAgQHBhcmFtIHtOdW1iZXJ9IHJ5XHJcbiAgICBAcmV0dXJucyB7SW50ZXJzZWN0aW9uUGFyYW1zfVxyXG4qL1xyXG5JbnRlcnNlY3Rpb25QYXJhbXMubmV3RWxsaXBzZSA9IGZ1bmN0aW9uIChjLCByeCwgcnkpIHtcclxuICAgIHJldHVybiBuZXcgSW50ZXJzZWN0aW9uUGFyYW1zKElQVFlQRS5FTExJUFNFLCBbYywgcngsIHJ5XSk7XHJcbn07XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8qKlxyXG4gICAgQ3JlYXRlcyBJbnRlcnNlY3Rpb25QYXJhbXMgZm9yIGxpbmUuXHJcblxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBhMVxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBhMlxyXG4gICAgQHJldHVybnMge0ludGVyc2VjdGlvblBhcmFtc31cclxuKi9cclxuSW50ZXJzZWN0aW9uUGFyYW1zLm5ld0xpbmUgPSBmdW5jdGlvbiAoYTEsIGEyKSB7XHJcbiAgICByZXR1cm4gbmV3IEludGVyc2VjdGlvblBhcmFtcyhJUFRZUEUuTElORSwgW2ExLCBhMl0pO1xyXG59O1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vKipcclxuICAgIENyZWF0ZXMgSW50ZXJzZWN0aW9uUGFyYW1zIGZvciBwb2x5Z29uLlxyXG5cclxuICAgIEBwYXJhbSB7QXJyYXk8UG9pbnQyRD59IHBvaW50c1xyXG4gICAgQHJldHVybnMge0ludGVyc2VjdGlvblBhcmFtc31cclxuKi9cclxuSW50ZXJzZWN0aW9uUGFyYW1zLm5ld1BvbHlnb24gPSBmdW5jdGlvbiAocG9pbnRzKSB7XHJcbiAgICByZXR1cm4gbmV3IEludGVyc2VjdGlvblBhcmFtcyhJUFRZUEUuUE9MWUdPTiwgW3BvaW50c10pO1xyXG59O1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vKipcclxuICAgIENyZWF0ZXMgSW50ZXJzZWN0aW9uUGFyYW1zIGZvciBwb2x5bGluZS5cclxuXHJcbiAgICAgQHBhcmFtIHtBcnJheTxQb2ludDJEPn0gcG9pbnRzXHJcbiAgICBAcmV0dXJucyB7SW50ZXJzZWN0aW9uUGFyYW1zfVxyXG4qL1xyXG5JbnRlcnNlY3Rpb25QYXJhbXMubmV3UG9seWxpbmUgPSBmdW5jdGlvbiAocG9pbnRzKSB7XHJcbiAgICByZXR1cm4gbmV3IEludGVyc2VjdGlvblBhcmFtcyhJUFRZUEUuUE9MWUxJTkUsIFtwb2ludHNdKTtcclxufTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8qKlxyXG4gICAgQ3JlYXRlcyBJbnRlcnNlY3Rpb25QYXJhbXMgZm9yIHJlY3RhbmdsZS5cclxuXHJcbiAgICBAcGFyYW0ge051bWJlcn0geFxyXG4gICAgQHBhcmFtIHtOdW1iZXJ9IHlcclxuICAgIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxyXG4gICAgQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxyXG4gICAgQHJldHVybnMge0ludGVyc2VjdGlvblBhcmFtc31cclxuKi9cclxuSW50ZXJzZWN0aW9uUGFyYW1zLm5ld1JlY3QgPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgdmFyIHBvaW50cyA9IFtdO1xyXG4gICAgcG9pbnRzLnB1c2gobmV3IFBvaW50MkQoeCwgeSkpO1xyXG4gICAgcG9pbnRzLnB1c2gobmV3IFBvaW50MkQoeCArIHdpZHRoLCB5KSk7XHJcbiAgICBwb2ludHMucHVzaChuZXcgUG9pbnQyRCh4ICsgd2lkdGgsIHkgKyBoZWlnaHQpKTtcclxuICAgIHBvaW50cy5wdXNoKG5ldyBQb2ludDJEKHgsIHkgKyBoZWlnaHQpKTtcclxuICAgIHJldHVybiBuZXcgSW50ZXJzZWN0aW9uUGFyYW1zKElQVFlQRS5SRUNULCBbcG9pbnRzXSk7XHJcbn07XHJcblxyXG52YXIgZGVncmVlc1RvUmFkaWFucyA9IGZ1bmN0aW9uIChhbmdsZSkge1xyXG4gICAgcmV0dXJuIGFuZ2xlICogTWF0aC5QSSAvIDE4MDtcclxufTtcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vKipcclxuICAgIENyZWF0ZXMgSW50ZXJzZWN0aW9uUGFyYW1zIGZvciByb3VuZCByZWN0YW5nbGUsIG9yIGZvciByZWN0YW5nbGUgaWYgcnggYW5kIHJ5IGFyZSAwLlxyXG5cclxuICAgIEBwYXJhbSB7TnVtYmVyfSB4XHJcbiAgICBAcGFyYW0ge051bWJlcn0geVxyXG4gICAgQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXHJcbiAgICBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XHJcbiAgICBAcGFyYW0ge051bWJlcn0gcnhcclxuICAgIEBwYXJhbSB7TnVtYmVyfSByeVxyXG4gICAgQHJldHVybnMge0ludGVyc2VjdGlvblBhcmFtc31cclxuKi9cclxuSW50ZXJzZWN0aW9uUGFyYW1zLm5ld1JvdW5kUmVjdCA9IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCByeCwgcnkpIHtcclxuICAgIGlmIChyeCA9PT0gMCAmJiByeSA9PT0gMClcclxuICAgICAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld1JlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICBpZiAocnggPT09IDApXHJcbiAgICAgICAgcnggPSByeTtcclxuICAgIGlmIChyeSA9PT0gMClcclxuICAgICAgICByeSA9IHJ4O1xyXG4gICAgaWYgKHJ4ID4gd2lkdGggLyAyKVxyXG4gICAgICAgIHJ4ID0gd2lkdGggLyAyO1xyXG4gICAgaWYgKHJ5ID4gaGVpZ2h0IC8gMilcclxuICAgICAgICByeCA9IGhlaWdodCAvIDI7XHJcbiAgICB2YXIgc2hhcGUgPSBbXTtcclxuICAgIHZhciB4MCA9IHgsIHgxID0geCArIHJ4LCB4MiA9IHggKyB3aWR0aCAtIHJ4LCB4MyA9IHggKyB3aWR0aDtcclxuICAgIHZhciB5MCA9IHksIHkxID0geSArIHJ5LCB5MiA9IHkgKyBoZWlnaHQgLSByeSwgeTMgPSB5ICsgaGVpZ2h0O1xyXG4gICAgc2hhcGUucHVzaChuZXcgSW50ZXJzZWN0aW9uUGFyYW1zKElQVFlQRS5BUkMsIFtuZXcgUG9pbnQyRCh4MSwgeTEpLCByeCwgcnksIDAsIGRlZ3JlZXNUb1JhZGlhbnMoMTgwKSwgZGVncmVlc1RvUmFkaWFucyg5MCldKSk7XHJcbiAgICBzaGFwZS5wdXNoKG5ldyBJbnRlcnNlY3Rpb25QYXJhbXMoSVBUWVBFLkxJTkUsIFtuZXcgUG9pbnQyRCh4MSwgeTApLCBuZXcgUG9pbnQyRCh4MiwgeTApXSkpO1xyXG4gICAgc2hhcGUucHVzaChuZXcgSW50ZXJzZWN0aW9uUGFyYW1zKElQVFlQRS5BUkMsIFtuZXcgUG9pbnQyRCh4MiwgeTEpLCByeCwgcnksIDAsIGRlZ3JlZXNUb1JhZGlhbnMoLTkwKSwgZGVncmVlc1RvUmFkaWFucyg5MCldKSk7XHJcbiAgICBzaGFwZS5wdXNoKG5ldyBJbnRlcnNlY3Rpb25QYXJhbXMoSVBUWVBFLkxJTkUsIFtuZXcgUG9pbnQyRCh4MywgeTEpLCBuZXcgUG9pbnQyRCh4MywgeTIpXSkpO1xyXG4gICAgc2hhcGUucHVzaChuZXcgSW50ZXJzZWN0aW9uUGFyYW1zKElQVFlQRS5BUkMsIFtuZXcgUG9pbnQyRCh4MiwgeTIpLCByeCwgcnksIDAsIGRlZ3JlZXNUb1JhZGlhbnMoMCksIGRlZ3JlZXNUb1JhZGlhbnMoOTApXSkpO1xyXG4gICAgc2hhcGUucHVzaChuZXcgSW50ZXJzZWN0aW9uUGFyYW1zKElQVFlQRS5MSU5FLCBbbmV3IFBvaW50MkQoeDIsIHkzKSwgbmV3IFBvaW50MkQoeDEsIHkzKV0pKTtcclxuICAgIHNoYXBlLnB1c2gobmV3IEludGVyc2VjdGlvblBhcmFtcyhJUFRZUEUuQVJDLCBbbmV3IFBvaW50MkQoeDEsIHkyKSwgcngsIHJ5LCAwLCBkZWdyZWVzVG9SYWRpYW5zKDkwKSwgZGVncmVlc1RvUmFkaWFucyg5MCldKSk7XHJcbiAgICBzaGFwZS5wdXNoKG5ldyBJbnRlcnNlY3Rpb25QYXJhbXMoSVBUWVBFLkxJTkUsIFtuZXcgUG9pbnQyRCh4MCwgeTIpLCBuZXcgUG9pbnQyRCh4MCwgeTEpXSkpO1xyXG4gICAgc2hhcGVbc2hhcGUubGVuZ3RoIC0gMV0ubWV0YS5jbG9zZVBhdGggPSB0cnVlO1xyXG4gICAgcmV0dXJuIG5ldyBJbnRlcnNlY3Rpb25QYXJhbXMoSVBUWVBFLlJPVU5EUkVDVCwgW3NoYXBlXSk7XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBUb2tlbih0eXBlLCB0ZXh0KSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmluaXQodHlwZSwgdGV4dCk7XHJcbiAgICB9XHJcbn1cclxuVG9rZW4ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0eXBlLCB0ZXh0KSB7XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcclxufTtcclxuVG9rZW4ucHJvdG90eXBlLnR5cGVpcyA9IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLnR5cGUgPT0gdHlwZTtcclxufVxyXG52YXIgUGF0aCA9IHt9O1xyXG5QYXRoLkNPTU1BTkQgPSAwO1xyXG5QYXRoLk5VTUJFUiA9IDE7XHJcblBhdGguRU9EID0gMjtcclxuUGF0aC5QQVJBTVMgPSB7XHJcbiAgICBBOiBbXCJyeFwiLCBcInJ5XCIsIFwieC1heGlzLXJvdGF0aW9uXCIsIFwibGFyZ2UtYXJjLWZsYWdcIiwgXCJzd2VlcC1mbGFnXCIsIFwieFwiLCBcInlcIl0sXHJcbiAgICBhOiBbXCJyeFwiLCBcInJ5XCIsIFwieC1heGlzLXJvdGF0aW9uXCIsIFwibGFyZ2UtYXJjLWZsYWdcIiwgXCJzd2VlcC1mbGFnXCIsIFwieFwiLCBcInlcIl0sXHJcbiAgICBDOiBbXCJ4MVwiLCBcInkxXCIsIFwieDJcIiwgXCJ5MlwiLCBcInhcIiwgXCJ5XCJdLFxyXG4gICAgYzogW1wieDFcIiwgXCJ5MVwiLCBcIngyXCIsIFwieTJcIiwgXCJ4XCIsIFwieVwiXSxcclxuICAgIEg6IFtcInhcIl0sXHJcbiAgICBoOiBbXCJ4XCJdLFxyXG4gICAgTDogW1wieFwiLCBcInlcIl0sXHJcbiAgICBsOiBbXCJ4XCIsIFwieVwiXSxcclxuICAgIE06IFtcInhcIiwgXCJ5XCJdLFxyXG4gICAgbTogW1wieFwiLCBcInlcIl0sXHJcbiAgICBROiBbXCJ4MVwiLCBcInkxXCIsIFwieFwiLCBcInlcIl0sXHJcbiAgICBxOiBbXCJ4MVwiLCBcInkxXCIsIFwieFwiLCBcInlcIl0sXHJcbiAgICBTOiBbXCJ4MlwiLCBcInkyXCIsIFwieFwiLCBcInlcIl0sXHJcbiAgICBzOiBbXCJ4MlwiLCBcInkyXCIsIFwieFwiLCBcInlcIl0sXHJcbiAgICBUOiBbXCJ4XCIsIFwieVwiXSxcclxuICAgIHQ6IFtcInhcIiwgXCJ5XCJdLFxyXG4gICAgVjogW1wieVwiXSxcclxuICAgIHY6IFtcInlcIl0sXHJcbiAgICBaOiBbXSxcclxuICAgIHo6IFtdXHJcbn07XHJcblxyXG5mdW5jdGlvbiB0b2tlbml6ZShkKSB7XHJcbiAgICB2YXIgdG9rZW5zID0gbmV3IEFycmF5KCk7XHJcbiAgICB3aGlsZSAoZCAhPSBcIlwiKSB7XHJcbiAgICAgICAgaWYgKGQubWF0Y2goL14oWyBcXHRcXHJcXG4sXSspLykpIHtcclxuICAgICAgICAgICAgZCA9IGQuc3Vic3RyKFJlZ0V4cC4kMS5sZW5ndGgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZC5tYXRjaCgvXihbYUFjQ2hIbExtTXFRc1N0VHZWelpdKS8pKSB7XHJcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbnMubGVuZ3RoXSA9IG5ldyBUb2tlbihQYXRoLkNPTU1BTkQsIFJlZ0V4cC4kMSk7XHJcbiAgICAgICAgICAgIGQgPSBkLnN1YnN0cihSZWdFeHAuJDEubGVuZ3RoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGQubWF0Y2goL14oKFstK10/WzAtOV0rKFxcLlswLTldKik/fFstK10/XFwuWzAtOV0rKShbZUVdWy0rXT9bMC05XSspPykvKSkge1xyXG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5zLmxlbmd0aF0gPSBuZXcgVG9rZW4oUGF0aC5OVU1CRVIsIHBhcnNlRmxvYXQoUmVnRXhwLiQxKSk7XHJcbiAgICAgICAgICAgIGQgPSBkLnN1YnN0cihSZWdFeHAuJDEubGVuZ3RoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnJlY29nbml6ZWQgc2VnbWVudCBjb21tYW5kOiBcIiArIGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRva2Vuc1t0b2tlbnMubGVuZ3RoXSA9IG5ldyBUb2tlbihQYXRoLkVPRCwgbnVsbCk7XHJcbiAgICByZXR1cm4gdG9rZW5zO1xyXG59XHJcblxyXG5JbnRlcnNlY3Rpb25QYXJhbXMubmV3UGF0aCA9IGZ1bmN0aW9uKGQpIHtcclxuICAgIHZhciB0b2tlbnMgPSB0b2tlbml6ZShkKTtcclxuICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICB2YXIgdG9rZW4gPSB0b2tlbnNbaW5kZXhdO1xyXG4gICAgdmFyIG1vZGUgPSBcIkJPRFwiO1xyXG4gICAgdmFyIHNlZ21lbnRzID0gW107XHJcblxyXG4gICAgd2hpbGUgKCF0b2tlbi50eXBlaXMoUGF0aC5FT0QpKSB7XHJcbiAgICAgICAgdmFyIHBhcmFtX2xlbmd0aDtcclxuICAgICAgICB2YXIgcGFyYW1zID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgaWYgKG1vZGUgPT0gXCJCT0RcIikge1xyXG4gICAgICAgICAgICBpZiAodG9rZW4udGV4dCA9PSBcIk1cIiB8fCB0b2tlbi50ZXh0ID09IFwibVwiKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1fbGVuZ3RoID0gUGF0aC5QQVJBTVNbdG9rZW4udGV4dF0ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgbW9kZSA9IHRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXRoIGRhdGEgbXVzdCBiZWdpbiB3aXRoIGEgbW92ZXRvIGNvbW1hbmRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodG9rZW4udHlwZWlzKFBhdGguTlVNQkVSKSkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1fbGVuZ3RoID0gUGF0aC5QQVJBTVNbbW9kZV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIHBhcmFtX2xlbmd0aCA9IFBhdGguUEFSQU1TW3Rva2VuLnRleHRdLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIG1vZGUgPSB0b2tlbi50ZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgoaW5kZXggKyBwYXJhbV9sZW5ndGgpIDwgdG9rZW5zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gaW5kZXg7IGkgPCBpbmRleCArIHBhcmFtX2xlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbnVtYmVyID0gdG9rZW5zW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bWJlci50eXBlaXMoUGF0aC5OVU1CRVIpKSBwYXJhbXNbcGFyYW1zLmxlbmd0aF0gPSBudW1iZXIudGV4dDtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKFwiUGFyYW1ldGVyIHR5cGUgaXMgbm90IGEgbnVtYmVyOiBcIiArIG1vZGUgKyBcIixcIiArIG51bWJlci50ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VnbWVudDtcclxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHNlZ21lbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzID0gKGxlbmd0aCA9PSAwKSA/IG51bGwgOiBzZWdtZW50c1tsZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgc3dpdGNoIChtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiQVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnQgPSBuZXcgQWJzb2x1dGVBcmNQYXRoKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIkNcIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbmV3IEFic29sdXRlQ3VydmV0bzMocGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnQgPSBuZXcgUmVsYXRpdmVDdXJ2ZXRvMyhwYXJhbXMsIHByZXZpb3VzKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJIXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudCA9IG5ldyBBYnNvbHV0ZUhMaW5ldG8ocGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiVlwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnQgPSBuZXcgQWJzb2x1dGVWTGluZXRvKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIkxcIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbmV3IEFic29sdXRlTGluZXRvKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImxcIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbmV3IFJlbGF0aXZlTGluZXRvKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIk1cIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbmV3IEFic29sdXRlTW92ZXRvKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1cIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbmV3IFJlbGF0aXZlTW92ZXRvKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIlFcIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbmV3IEFic29sdXRlQ3VydmV0bzIocGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwicVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnQgPSBuZXcgUmVsYXRpdmVDdXJ2ZXRvMihwYXJhbXMsIHByZXZpb3VzKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJTXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudCA9IG5ldyBBYnNvbHV0ZVNtb290aEN1cnZldG8zKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNcIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbmV3IFJlbGF0aXZlU21vb3RoQ3VydmV0bzMocGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiVFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnQgPSBuZXcgQWJzb2x1dGVTbW9vdGhDdXJ2ZXRvMihwYXJhbXMsIHByZXZpb3VzKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudCA9IG5ldyBSZWxhdGl2ZVNtb290aEN1cnZldG8yKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIlpcIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbmV3IFJlbGF0aXZlQ2xvc2VQYXRoKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInpcIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbmV3IFJlbGF0aXZlQ2xvc2VQYXRoKHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBzZWdtZW50IHR5cGU6IFwiICsgbW9kZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNlZ21lbnRzLnB1c2goc2VnbWVudCk7XHJcbiAgICAgICAgICAgIGluZGV4ICs9IHBhcmFtX2xlbmd0aDtcclxuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAobW9kZSA9PSBcIk1cIikgbW9kZSA9IFwiTFwiO1xyXG4gICAgICAgICAgICBpZiAobW9kZSA9PSBcIm1cIikgbW9kZSA9IFwibFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhdGggZGF0YSBlbmRlZCBiZWZvcmUgYWxsIHBhcmFtZXRlcnMgd2VyZSBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNlZ21lbnRQYXJhbXMgPSBbXTtcclxuICAgIGZvcihpPTA7IGk8c2VnbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgaXAgPSBzZWdtZW50c1tpXS5nZXRJbnRlcnNlY3Rpb25QYXJhbXMoKTtcclxuICAgICAgICBpZihpcCkge1xyXG4gICAgICAgICAgICBzZWdtZW50UGFyYW1zLnB1c2goaXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IEludGVyc2VjdGlvblBhcmFtcyhJUFRZUEUuUEFUSCwgW3NlZ21lbnRQYXJhbXNdKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIEFic29sdXRlUGF0aFNlZ21lbnQoY29tbWFuZCwgcGFyYW1zLCBwcmV2aW91cykge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB0aGlzLmluaXQoY29tbWFuZCwgcGFyYW1zLCBwcmV2aW91cyk7XHJcbn07XHJcbkFic29sdXRlUGF0aFNlZ21lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihjb21tYW5kLCBwYXJhbXMsIHByZXZpb3VzKSB7XHJcbiAgICB0aGlzLmNvbW1hbmQgPSBjb21tYW5kO1xyXG4gICAgdGhpcy5wcmV2aW91cyA9IHByZXZpb3VzO1xyXG4gICAgdGhpcy5wb2ludHMgPSBbXTtcclxuICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICB3aGlsZSAoaW5kZXggPCBwYXJhbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5wb2ludHMucHVzaChuZXcgUG9pbnQyRChwYXJhbXNbaW5kZXhdLCBwYXJhbXNbaW5kZXggKyAxXSkpO1xyXG4gICAgICAgIGluZGV4ICs9IDI7XHJcbiAgICB9XHJcbn07XHJcbkFic29sdXRlUGF0aFNlZ21lbnQucHJvdG90eXBlLmdldExhc3RQb2ludCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdO1xyXG59O1xyXG5BYnNvbHV0ZVBhdGhTZWdtZW50LnByb3RvdHlwZS5nZXRJbnRlcnNlY3Rpb25QYXJhbXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBBYnNvbHV0ZUFyY1BhdGgocGFyYW1zLCBwcmV2aW91cykge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KFwiQVwiLCBwYXJhbXMsIHByZXZpb3VzKTtcclxuICAgIH1cclxufVxyXG5BYnNvbHV0ZUFyY1BhdGgucHJvdG90eXBlID0gbmV3IEFic29sdXRlUGF0aFNlZ21lbnQoKTtcclxuQWJzb2x1dGVBcmNQYXRoLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFic29sdXRlQ3VydmV0bzI7XHJcbkFic29sdXRlQXJjUGF0aC5zdXBlcmNsYXNzID0gQWJzb2x1dGVQYXRoU2VnbWVudC5wcm90b3R5cGU7XHJcblxyXG5BYnNvbHV0ZUFyY1BhdGgucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihjb21tYW5kLCBwYXJhbXMsIHByZXZpb3VzKSB7XHJcbiAgICB2YXIgcG9pbnQgPSBuZXcgQXJyYXkoKTtcclxuICAgIHZhciB5ID0gcGFyYW1zLnBvcCgpO1xyXG4gICAgdmFyIHggPSBwYXJhbXMucG9wKCk7XHJcbiAgICBwb2ludC5wdXNoKHgsIHkpO1xyXG4gICAgQWJzb2x1dGVBcmNQYXRoLnN1cGVyY2xhc3MuaW5pdC5jYWxsKHRoaXMsIGNvbW1hbmQsIHBvaW50LCBwcmV2aW91cyk7XHJcbiAgICB0aGlzLnJ4ID0gcGFyc2VGbG9hdChwYXJhbXMuc2hpZnQoKSk7XHJcbiAgICB0aGlzLnJ5ID0gcGFyc2VGbG9hdChwYXJhbXMuc2hpZnQoKSk7XHJcbiAgICB0aGlzLmFuZ2xlID0gcGFyc2VGbG9hdChwYXJhbXMuc2hpZnQoKSk7XHJcbiAgICB0aGlzLmFyY0ZsYWcgPSBwYXJzZUZsb2F0KHBhcmFtcy5zaGlmdCgpKTtcclxuICAgIHRoaXMuc3dlZXBGbGFnID0gcGFyc2VGbG9hdChwYXJhbXMuc2hpZnQoKSk7XHJcbn07XHJcbkFic29sdXRlQXJjUGF0aC5wcm90b3R5cGUuZ2V0SW50ZXJzZWN0aW9uUGFyYW1zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld0FyYyh0aGlzLnByZXZpb3VzLmdldExhc3RQb2ludCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludHNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJ4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFyY0ZsYWcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN3ZWVwRmxhZyk7XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gQWJzb2x1dGVDdXJ2ZXRvMihwYXJhbXMsIHByZXZpb3VzKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmluaXQoXCJRXCIsIHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgfVxyXG59XHJcbkFic29sdXRlQ3VydmV0bzIucHJvdG90eXBlID0gbmV3IEFic29sdXRlUGF0aFNlZ21lbnQoKTtcclxuQWJzb2x1dGVDdXJ2ZXRvMi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBBYnNvbHV0ZUN1cnZldG8yO1xyXG5BYnNvbHV0ZUN1cnZldG8yLnN1cGVyY2xhc3MgPSBBYnNvbHV0ZVBhdGhTZWdtZW50LnByb3RvdHlwZTtcclxuXHJcbkFic29sdXRlQ3VydmV0bzIucHJvdG90eXBlLmdldEludGVyc2VjdGlvblBhcmFtcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIEludGVyc2VjdGlvblBhcmFtcy5uZXdCZXppZXIyKHRoaXMucHJldmlvdXMuZ2V0TGFzdFBvaW50KCksIHRoaXMucG9pbnRzWzBdLCB0aGlzLnBvaW50c1sxXSk7XHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIEFic29sdXRlQ3VydmV0bzMocGFyYW1zLCBwcmV2aW91cykge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KFwiQ1wiLCBwYXJhbXMsIHByZXZpb3VzKTtcclxuICAgIH1cclxufVxyXG5BYnNvbHV0ZUN1cnZldG8zLnByb3RvdHlwZSA9IG5ldyBBYnNvbHV0ZVBhdGhTZWdtZW50KCk7XHJcbkFic29sdXRlQ3VydmV0bzMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWJzb2x1dGVDdXJ2ZXRvMztcclxuQWJzb2x1dGVDdXJ2ZXRvMy5zdXBlcmNsYXNzID0gQWJzb2x1dGVQYXRoU2VnbWVudC5wcm90b3R5cGU7XHJcblxyXG5BYnNvbHV0ZUN1cnZldG8zLnByb3RvdHlwZS5nZXRMYXN0Q29udHJvbFBvaW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb2ludHNbMV07XHJcbn07XHJcbkFic29sdXRlQ3VydmV0bzMucHJvdG90eXBlLmdldEludGVyc2VjdGlvblBhcmFtcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIEludGVyc2VjdGlvblBhcmFtcy5uZXdCZXppZXIzKHRoaXMucHJldmlvdXMuZ2V0TGFzdFBvaW50KCksIHRoaXMucG9pbnRzWzBdLCB0aGlzLnBvaW50c1sxXSwgdGhpcy5wb2ludHNbMl0pO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIEFic29sdXRlSExpbmV0byhwYXJhbXMsIHByZXZpb3VzKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmluaXQoXCJIXCIsIHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgfVxyXG59XHJcbkFic29sdXRlSExpbmV0by5wcm90b3R5cGUgPSBuZXcgQWJzb2x1dGVQYXRoU2VnbWVudCgpO1xyXG5BYnNvbHV0ZUhMaW5ldG8ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWJzb2x1dGVITGluZXRvO1xyXG5BYnNvbHV0ZUhMaW5ldG8uc3VwZXJjbGFzcyA9IEFic29sdXRlUGF0aFNlZ21lbnQucHJvdG90eXBlO1xyXG5cclxuQWJzb2x1dGVITGluZXRvLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oY29tbWFuZCwgcGFyYW1zLCBwcmV2aW91cykge1xyXG4gICAgdmFyIHByZXZQb2ludCA9IHByZXZpb3VzLmdldExhc3RQb2ludCgpO1xyXG4gICAgdmFyIHBvaW50ID0gbmV3IEFycmF5KCk7XHJcbiAgICBwb2ludC5wdXNoKHBhcmFtcy5wb3AoKSwgcHJldlBvaW50LnkpO1xyXG4gICAgQWJzb2x1dGVITGluZXRvLnN1cGVyY2xhc3MuaW5pdC5jYWxsKHRoaXMsIGNvbW1hbmQsIHBvaW50LCBwcmV2aW91cyk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBBYnNvbHV0ZVZMaW5ldG8ocGFyYW1zLCBwcmV2aW91cykge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KFwiVlwiLCBwYXJhbXMsIHByZXZpb3VzKTtcclxuICAgIH1cclxufVxyXG5BYnNvbHV0ZVZMaW5ldG8ucHJvdG90eXBlID0gbmV3IEFic29sdXRlUGF0aFNlZ21lbnQoKTtcclxuQWJzb2x1dGVWTGluZXRvLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFic29sdXRlVkxpbmV0bztcclxuQWJzb2x1dGVWTGluZXRvLnN1cGVyY2xhc3MgPSBBYnNvbHV0ZVBhdGhTZWdtZW50LnByb3RvdHlwZTtcclxuXHJcbkFic29sdXRlVkxpbmV0by5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKGNvbW1hbmQsIHBhcmFtcywgcHJldmlvdXMpIHtcclxuICAgIHZhciBwcmV2UG9pbnQgPSBwcmV2aW91cy5nZXRMYXN0UG9pbnQoKTtcclxuICAgIHZhciBwb2ludCA9IG5ldyBBcnJheSgpO1xyXG4gICAgcG9pbnQucHVzaChwcmV2UG9pbnQueCwgcGFyYW1zLnBvcCgpKTtcclxuICAgIEFic29sdXRlVkxpbmV0by5zdXBlcmNsYXNzLmluaXQuY2FsbCh0aGlzLCBjb21tYW5kLCBwb2ludCwgcHJldmlvdXMpO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIEFic29sdXRlTGluZXRvKHBhcmFtcywgcHJldmlvdXMpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuaW5pdChcIkxcIiwgcGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICB9XHJcbn1cclxuQWJzb2x1dGVMaW5ldG8ucHJvdG90eXBlID0gbmV3IEFic29sdXRlUGF0aFNlZ21lbnQoKTtcclxuQWJzb2x1dGVMaW5ldG8ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWJzb2x1dGVMaW5ldG87XHJcbkFic29sdXRlTGluZXRvLnN1cGVyY2xhc3MgPSBBYnNvbHV0ZVBhdGhTZWdtZW50LnByb3RvdHlwZTtcclxuXHJcbkFic29sdXRlTGluZXRvLnByb3RvdHlwZS5nZXRJbnRlcnNlY3Rpb25QYXJhbXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBJbnRlcnNlY3Rpb25QYXJhbXMubmV3TGluZSh0aGlzLnByZXZpb3VzLmdldExhc3RQb2ludCgpLCB0aGlzLnBvaW50c1swXSk7XHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIEFic29sdXRlTW92ZXRvKHBhcmFtcywgcHJldmlvdXMpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuaW5pdChcIk1cIiwgcGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICB9XHJcbn1cclxuQWJzb2x1dGVNb3ZldG8ucHJvdG90eXBlID0gbmV3IEFic29sdXRlUGF0aFNlZ21lbnQoKTtcclxuQWJzb2x1dGVNb3ZldG8ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWJzb2x1dGVNb3ZldG87XHJcbkFic29sdXRlTW92ZXRvLnN1cGVyY2xhc3MgPSBBYnNvbHV0ZVBhdGhTZWdtZW50LnByb3RvdHlwZTtcclxuXHJcblxyXG5mdW5jdGlvbiBBYnNvbHV0ZVNtb290aEN1cnZldG8yKHBhcmFtcywgcHJldmlvdXMpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuaW5pdChcIlRcIiwgcGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICB9XHJcbn1cclxuQWJzb2x1dGVTbW9vdGhDdXJ2ZXRvMi5wcm90b3R5cGUgPSBuZXcgQWJzb2x1dGVQYXRoU2VnbWVudCgpO1xyXG5BYnNvbHV0ZVNtb290aEN1cnZldG8yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFic29sdXRlU21vb3RoQ3VydmV0bzI7XHJcbkFic29sdXRlU21vb3RoQ3VydmV0bzIuc3VwZXJjbGFzcyA9IEFic29sdXRlUGF0aFNlZ21lbnQucHJvdG90eXBlO1xyXG5cclxuQWJzb2x1dGVTbW9vdGhDdXJ2ZXRvMi5wcm90b3R5cGUuZ2V0Q29udHJvbFBvaW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbGFzdFBvaW50ID0gdGhpcy5wcmV2aW91cy5nZXRMYXN0UG9pbnQoKTtcclxuICAgIHZhciBwb2ludDtcclxuICAgIGlmICh0aGlzLnByZXZpb3VzLmNvbW1hbmQubWF0Y2goL15bUXFUdF0kLykpIHtcclxuICAgICAgICB2YXIgY3RybFBvaW50ID0gdGhpcy5wcmV2aW91cy5nZXRDb250cm9sUG9pbnQoKTtcclxuICAgICAgICB2YXIgZGlmZiA9IGN0cmxQb2ludC5zdWJ0cmFjdChsYXN0UG9pbnQpO1xyXG4gICAgICAgIHBvaW50ID0gbGFzdFBvaW50LnN1YnRyYWN0KGRpZmYpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwb2ludCA9IGxhc3RQb2ludDtcclxuICAgIH1cclxuICAgIHJldHVybiBwb2ludDtcclxufTtcclxuQWJzb2x1dGVTbW9vdGhDdXJ2ZXRvMi5wcm90b3R5cGUuZ2V0SW50ZXJzZWN0aW9uUGFyYW1zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld0JlemllcjIodGhpcy5wcmV2aW91cy5nZXRMYXN0UG9pbnQoKSwgdGhpcy5nZXRDb250cm9sUG9pbnQoKSwgdGhpcy5wb2ludHNbMF0pO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIEFic29sdXRlU21vb3RoQ3VydmV0bzMocGFyYW1zLCBwcmV2aW91cykge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KFwiU1wiLCBwYXJhbXMsIHByZXZpb3VzKTtcclxuICAgIH1cclxufVxyXG5BYnNvbHV0ZVNtb290aEN1cnZldG8zLnByb3RvdHlwZSA9IG5ldyBBYnNvbHV0ZVBhdGhTZWdtZW50KCk7XHJcbkFic29sdXRlU21vb3RoQ3VydmV0bzMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWJzb2x1dGVTbW9vdGhDdXJ2ZXRvMztcclxuQWJzb2x1dGVTbW9vdGhDdXJ2ZXRvMy5zdXBlcmNsYXNzID0gQWJzb2x1dGVQYXRoU2VnbWVudC5wcm90b3R5cGU7XHJcblxyXG5BYnNvbHV0ZVNtb290aEN1cnZldG8zLnByb3RvdHlwZS5nZXRGaXJzdENvbnRyb2xQb2ludCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGxhc3RQb2ludCA9IHRoaXMucHJldmlvdXMuZ2V0TGFzdFBvaW50KCk7XHJcbiAgICB2YXIgcG9pbnQ7XHJcbiAgICBpZiAodGhpcy5wcmV2aW91cy5jb21tYW5kLm1hdGNoKC9eW1NzQ2NdJC8pKSB7XHJcbiAgICAgICAgdmFyIGxhc3RDb250cm9sID0gdGhpcy5wcmV2aW91cy5nZXRMYXN0Q29udHJvbFBvaW50KCk7XHJcbiAgICAgICAgdmFyIGRpZmYgPSBsYXN0Q29udHJvbC5zdWJ0cmFjdChsYXN0UG9pbnQpO1xyXG4gICAgICAgIHBvaW50ID0gbGFzdFBvaW50LnN1YnRyYWN0KGRpZmYpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwb2ludCA9IGxhc3RQb2ludDtcclxuICAgIH1cclxuICAgIHJldHVybiBwb2ludDtcclxufTtcclxuQWJzb2x1dGVTbW9vdGhDdXJ2ZXRvMy5wcm90b3R5cGUuZ2V0TGFzdENvbnRyb2xQb2ludCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRzWzBdO1xyXG59O1xyXG5BYnNvbHV0ZVNtb290aEN1cnZldG8zLnByb3RvdHlwZS5nZXRJbnRlcnNlY3Rpb25QYXJhbXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBJbnRlcnNlY3Rpb25QYXJhbXMubmV3QmV6aWVyMyh0aGlzLnByZXZpb3VzLmdldExhc3RQb2ludCgpLCB0aGlzLmdldEZpcnN0Q29udHJvbFBvaW50KCksIHRoaXMucG9pbnRzWzBdLCB0aGlzLnBvaW50c1sxXSk7XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gUmVsYXRpdmVQYXRoU2VnbWVudChjb21tYW5kLCBwYXJhbXMsIHByZXZpb3VzKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHRoaXMuaW5pdChjb21tYW5kLCBwYXJhbXMsIHByZXZpb3VzKTtcclxufVxyXG5SZWxhdGl2ZVBhdGhTZWdtZW50LnByb3RvdHlwZSA9IG5ldyBBYnNvbHV0ZVBhdGhTZWdtZW50KCk7XHJcblJlbGF0aXZlUGF0aFNlZ21lbnQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmVsYXRpdmVQYXRoU2VnbWVudDtcclxuUmVsYXRpdmVQYXRoU2VnbWVudC5zdXBlcmNsYXNzID0gQWJzb2x1dGVQYXRoU2VnbWVudC5wcm90b3R5cGU7XHJcblxyXG5SZWxhdGl2ZVBhdGhTZWdtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oY29tbWFuZCwgcGFyYW1zLCBwcmV2aW91cykge1xyXG4gICAgdGhpcy5jb21tYW5kID0gY29tbWFuZDtcclxuICAgIHRoaXMucHJldmlvdXMgPSBwcmV2aW91cztcclxuICAgIHRoaXMucG9pbnRzID0gW107XHJcbiAgICB2YXIgbGFzdFBvaW50O1xyXG4gICAgaWYgKHRoaXMucHJldmlvdXMpIGxhc3RQb2ludCA9IHRoaXMucHJldmlvdXMuZ2V0TGFzdFBvaW50KCk7XHJcbiAgICBlbHNlIGxhc3RQb2ludCA9IG5ldyBQb2ludDJEKDAsIDApO1xyXG4gICAgdmFyIGluZGV4ID0gMDtcclxuICAgIHdoaWxlIChpbmRleCA8IHBhcmFtcy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgcG9pbnQgPSBuZXcgUG9pbnQyRChsYXN0UG9pbnQueCArIHBhcmFtc1tpbmRleF0sIGxhc3RQb2ludC55ICsgcGFyYW1zW2luZGV4ICsgMV0pO1xyXG4gICAgICAgIHRoaXMucG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgICAgIGluZGV4ICs9IDI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBSZWxhdGl2ZUNsb3NlUGF0aChwYXJhbXMsIHByZXZpb3VzKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmluaXQoXCJ6XCIsIHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgfVxyXG59XHJcblJlbGF0aXZlQ2xvc2VQYXRoLnByb3RvdHlwZSA9IG5ldyBSZWxhdGl2ZVBhdGhTZWdtZW50KCk7XHJcblJlbGF0aXZlQ2xvc2VQYXRoLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlbGF0aXZlQ2xvc2VQYXRoO1xyXG5SZWxhdGl2ZUNsb3NlUGF0aC5zdXBlcmNsYXNzID0gUmVsYXRpdmVQYXRoU2VnbWVudC5wcm90b3R5cGU7XHJcblJlbGF0aXZlQ2xvc2VQYXRoLnByb3RvdHlwZS5nZXRMYXN0UG9pbnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBjdXJyZW50ID0gdGhpcy5wcmV2aW91cztcclxuICAgIHZhciBwb2ludDtcclxuICAgIHdoaWxlIChjdXJyZW50KSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnQuY29tbWFuZC5tYXRjaCgvXlttTXpaXSQvKSkge1xyXG4gICAgICAgICAgICBwb2ludCA9IGN1cnJlbnQuZ2V0TGFzdFBvaW50KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wcmV2aW91cztcclxuICAgIH1cclxuICAgIHJldHVybiBwb2ludDtcclxufTtcclxuUmVsYXRpdmVDbG9zZVBhdGgucHJvdG90eXBlLmdldEludGVyc2VjdGlvblBhcmFtcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIEludGVyc2VjdGlvblBhcmFtcy5uZXdMaW5lKHRoaXMucHJldmlvdXMuZ2V0TGFzdFBvaW50KCksIHRoaXMuZ2V0TGFzdFBvaW50KCkpO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIFJlbGF0aXZlQ3VydmV0bzIocGFyYW1zLCBwcmV2aW91cykge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KFwicVwiLCBwYXJhbXMsIHByZXZpb3VzKTtcclxuICAgIH1cclxufVxyXG5SZWxhdGl2ZUN1cnZldG8yLnByb3RvdHlwZSA9IG5ldyBSZWxhdGl2ZVBhdGhTZWdtZW50KCk7XHJcblJlbGF0aXZlQ3VydmV0bzIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmVsYXRpdmVDdXJ2ZXRvMjtcclxuUmVsYXRpdmVDdXJ2ZXRvMi5zdXBlcmNsYXNzID0gUmVsYXRpdmVQYXRoU2VnbWVudC5wcm90b3R5cGU7XHJcblxyXG5SZWxhdGl2ZUN1cnZldG8yLnByb3RvdHlwZS5nZXRDb250cm9sUG9pbnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnBvaW50c1swXTtcclxufTtcclxuUmVsYXRpdmVDdXJ2ZXRvMi5wcm90b3R5cGUuZ2V0SW50ZXJzZWN0aW9uUGFyYW1zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld0JlemllcjIodGhpcy5wcmV2aW91cy5nZXRMYXN0UG9pbnQoKSwgdGhpcy5wb2ludHNbMF0sIHRoaXMucG9pbnRzWzFdKTtcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBSZWxhdGl2ZUN1cnZldG8zKHBhcmFtcywgcHJldmlvdXMpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuaW5pdChcImNcIiwgcGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICB9XHJcbn1cclxuUmVsYXRpdmVDdXJ2ZXRvMy5wcm90b3R5cGUgPSBuZXcgUmVsYXRpdmVQYXRoU2VnbWVudCgpO1xyXG5SZWxhdGl2ZUN1cnZldG8zLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlbGF0aXZlQ3VydmV0bzM7XHJcblJlbGF0aXZlQ3VydmV0bzMuc3VwZXJjbGFzcyA9IFJlbGF0aXZlUGF0aFNlZ21lbnQucHJvdG90eXBlO1xyXG5cclxuUmVsYXRpdmVDdXJ2ZXRvMy5wcm90b3R5cGUuZ2V0TGFzdENvbnRyb2xQb2ludCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRzWzFdO1xyXG59O1xyXG5SZWxhdGl2ZUN1cnZldG8zLnByb3RvdHlwZS5nZXRJbnRlcnNlY3Rpb25QYXJhbXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBJbnRlcnNlY3Rpb25QYXJhbXMubmV3QmV6aWVyMyh0aGlzLnByZXZpb3VzLmdldExhc3RQb2ludCgpLCB0aGlzLnBvaW50c1swXSwgdGhpcy5wb2ludHNbMV0sIHRoaXMucG9pbnRzWzJdKTtcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBSZWxhdGl2ZUxpbmV0byhwYXJhbXMsIHByZXZpb3VzKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmluaXQoXCJsXCIsIHBhcmFtcywgcHJldmlvdXMpO1xyXG4gICAgfVxyXG59XHJcblJlbGF0aXZlTGluZXRvLnByb3RvdHlwZSA9IG5ldyBSZWxhdGl2ZVBhdGhTZWdtZW50KCk7XHJcblJlbGF0aXZlTGluZXRvLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlbGF0aXZlTGluZXRvO1xyXG5SZWxhdGl2ZUxpbmV0by5zdXBlcmNsYXNzID0gUmVsYXRpdmVQYXRoU2VnbWVudC5wcm90b3R5cGU7XHJcblxyXG5SZWxhdGl2ZUxpbmV0by5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBwb2ludHMgPSBuZXcgQXJyYXkoKTtcclxuICAgIHZhciBjb21tYW5kID0gXCJcIjtcclxuICAgIHZhciBsYXN0UG9pbnQ7XHJcbiAgICB2YXIgcG9pbnQ7XHJcbiAgICBpZiAodGhpcy5wcmV2aW91cykgbGFzdFBvaW50ID0gdGhpcy5wcmV2aW91cy5nZXRMYXN0UG9pbnQoKTtcclxuICAgIGVsc2UgbGFzdFBvaW50ID0gbmV3IFBvaW50KDAsIDApO1xyXG4gICAgcG9pbnQgPSB0aGlzLnBvaW50c1swXS5zdWJ0cmFjdChsYXN0UG9pbnQpO1xyXG4gICAgaWYgKHRoaXMucHJldmlvdXMuY29uc3RydWN0b3IgIT0gdGhpcy5jb25zdHVjdG9yKVxyXG4gICAgICAgIGlmICh0aGlzLnByZXZpb3VzLmNvbnN0cnVjdG9yICE9IFJlbGF0aXZlTW92ZXRvKSBjbWQgPSB0aGlzLmNvbW1hbmQ7XHJcbiAgICByZXR1cm4gY21kICsgcG9pbnQudG9TdHJpbmcoKTtcclxufTtcclxuUmVsYXRpdmVMaW5ldG8ucHJvdG90eXBlLmdldEludGVyc2VjdGlvblBhcmFtcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIEludGVyc2VjdGlvblBhcmFtcy5uZXdMaW5lKHRoaXMucHJldmlvdXMuZ2V0TGFzdFBvaW50KCksIHRoaXMucG9pbnRzWzBdKTtcclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gUmVsYXRpdmVNb3ZldG8ocGFyYW1zLCBwcmV2aW91cykge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KFwibVwiLCBwYXJhbXMsIHByZXZpb3VzKTtcclxuICAgIH1cclxufVxyXG5SZWxhdGl2ZU1vdmV0by5wcm90b3R5cGUgPSBuZXcgUmVsYXRpdmVQYXRoU2VnbWVudCgpO1xyXG5SZWxhdGl2ZU1vdmV0by5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSZWxhdGl2ZU1vdmV0bztcclxuUmVsYXRpdmVNb3ZldG8uc3VwZXJjbGFzcyA9IFJlbGF0aXZlUGF0aFNlZ21lbnQucHJvdG90eXBlO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBSZWxhdGl2ZVNtb290aEN1cnZldG8yKHBhcmFtcywgcHJldmlvdXMpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuaW5pdChcInRcIiwgcGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICB9XHJcbn1cclxuUmVsYXRpdmVTbW9vdGhDdXJ2ZXRvMi5wcm90b3R5cGUgPSBuZXcgUmVsYXRpdmVQYXRoU2VnbWVudCgpO1xyXG5SZWxhdGl2ZVNtb290aEN1cnZldG8yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlbGF0aXZlU21vb3RoQ3VydmV0bzI7XHJcblJlbGF0aXZlU21vb3RoQ3VydmV0bzIuc3VwZXJjbGFzcyA9IFJlbGF0aXZlUGF0aFNlZ21lbnQucHJvdG90eXBlO1xyXG5cclxuUmVsYXRpdmVTbW9vdGhDdXJ2ZXRvMi5wcm90b3R5cGUuZ2V0Q29udHJvbFBvaW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbGFzdFBvaW50ID0gdGhpcy5wcmV2aW91cy5nZXRMYXN0UG9pbnQoKTtcclxuICAgIHZhciBwb2ludDtcclxuICAgIGlmICh0aGlzLnByZXZpb3VzLmNvbW1hbmQubWF0Y2goL15bUXFUdF0kLykpIHtcclxuICAgICAgICB2YXIgY3RybFBvaW50ID0gdGhpcy5wcmV2aW91cy5nZXRDb250cm9sUG9pbnQoKTtcclxuICAgICAgICB2YXIgZGlmZiA9IGN0cmxQb2ludC5zdWJ0cmFjdChsYXN0UG9pbnQpO1xyXG4gICAgICAgIHBvaW50ID0gbGFzdFBvaW50LnN1YnRyYWN0KGRpZmYpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwb2ludCA9IGxhc3RQb2ludDtcclxuICAgIH1cclxuICAgIHJldHVybiBwb2ludDtcclxufTtcclxuUmVsYXRpdmVTbW9vdGhDdXJ2ZXRvMi5wcm90b3R5cGUuZ2V0SW50ZXJzZWN0aW9uUGFyYW1zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld0JlemllcjIodGhpcy5wcmV2aW91cy5nZXRMYXN0UG9pbnQoKSwgdGhpcy5nZXRDb250cm9sUG9pbnQoKSwgdGhpcy5wb2ludHNbMF0pO1xyXG59O1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBSZWxhdGl2ZVNtb290aEN1cnZldG8zKHBhcmFtcywgcHJldmlvdXMpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuaW5pdChcInNcIiwgcGFyYW1zLCBwcmV2aW91cyk7XHJcbiAgICB9XHJcbn1cclxuUmVsYXRpdmVTbW9vdGhDdXJ2ZXRvMy5wcm90b3R5cGUgPSBuZXcgUmVsYXRpdmVQYXRoU2VnbWVudCgpO1xyXG5SZWxhdGl2ZVNtb290aEN1cnZldG8zLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlbGF0aXZlU21vb3RoQ3VydmV0bzM7XHJcblJlbGF0aXZlU21vb3RoQ3VydmV0bzMuc3VwZXJjbGFzcyA9IFJlbGF0aXZlUGF0aFNlZ21lbnQucHJvdG90eXBlO1xyXG5cclxuUmVsYXRpdmVTbW9vdGhDdXJ2ZXRvMy5wcm90b3R5cGUuZ2V0Rmlyc3RDb250cm9sUG9pbnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBsYXN0UG9pbnQgPSB0aGlzLnByZXZpb3VzLmdldExhc3RQb2ludCgpO1xyXG4gICAgdmFyIHBvaW50O1xyXG4gICAgaWYgKHRoaXMucHJldmlvdXMuY29tbWFuZC5tYXRjaCgvXltTc0NjXSQvKSkge1xyXG4gICAgICAgIHZhciBsYXN0Q29udHJvbCA9IHRoaXMucHJldmlvdXMuZ2V0TGFzdENvbnRyb2xQb2ludCgpO1xyXG4gICAgICAgIHZhciBkaWZmID0gbGFzdENvbnRyb2wuc3VidHJhY3QobGFzdFBvaW50KTtcclxuICAgICAgICBwb2ludCA9IGxhc3RQb2ludC5zdWJ0cmFjdChkaWZmKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcG9pbnQgPSBsYXN0UG9pbnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcG9pbnQ7XHJcbn07XHJcblJlbGF0aXZlU21vb3RoQ3VydmV0bzMucHJvdG90eXBlLmdldExhc3RDb250cm9sUG9pbnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnBvaW50c1swXTtcclxufTtcclxuUmVsYXRpdmVTbW9vdGhDdXJ2ZXRvMy5wcm90b3R5cGUuZ2V0SW50ZXJzZWN0aW9uUGFyYW1zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gSW50ZXJzZWN0aW9uUGFyYW1zLm5ld0JlemllcjModGhpcy5wcmV2aW91cy5nZXRMYXN0UG9pbnQoKSwgdGhpcy5nZXRGaXJzdENvbnRyb2xQb2ludCgpLCB0aGlzLnBvaW50c1swXSwgdGhpcy5wb2ludHNbMV0pO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZXJzZWN0aW9uUGFyYW1zO1xyXG5cclxufSx7XCJrbGQtYWZmaW5lXCI6MX1dLDExOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcclxudmFyIEludGVyc2VjdGlvbiA9IHJlcXVpcmUoJy4uL0ludGVyc2VjdGlvbicpO1xyXG5cclxudmFyIGFmZmluZSA9IHJlcXVpcmUoJ2tsZC1hZmZpbmUnKTtcclxudmFyIFBvaW50MkQgPSBhZmZpbmUuUG9pbnQyRDtcclxudmFyIFZlY3RvcjJEID0gYWZmaW5lLlZlY3RvcjJEO1xyXG5cclxudmFyIFBvbHlub21pYWwgPSByZXF1aXJlKCdrbGQtcG9seW5vbWlhbCcpLlBvbHlub21pYWw7XHJcblxyXG5mdW5jdGlvbiByZW1vdmVNdWx0aXBsZVJvb3RzSW4wMShyb290cykge1xyXG4gICAgdmFyIFpFUk9lcHNpbG9uID0gMWUtMTU7XHJcbiAgICByb290cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhIC0gYjsgfSk7XHJcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IHJvb3RzLmxlbmd0aDspIHtcclxuICAgICAgICBpZiAoTWF0aC5hYnMocm9vdHNbaV0gLSByb290c1tpIC0gMV0pIDwgWkVST2Vwc2lsb24pIHtcclxuICAgICAgICAgICAgcm9vdHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiAgaW50ZXJzZWN0QmV6aWVyMkJlemllcjJcclxuICpcclxuICogIEBwYXJhbSB7UG9pbnQyRH0gYTFcclxuICogIEBwYXJhbSB7UG9pbnQyRH0gYTJcclxuICogIEBwYXJhbSB7UG9pbnQyRH0gYTNcclxuICogIEBwYXJhbSB7UG9pbnQyRH0gYjFcclxuICogIEBwYXJhbSB7UG9pbnQyRH0gYjJcclxuICogIEBwYXJhbSB7UG9pbnQyRH0gYjNcclxuICogIEByZXR1cm5zIHtJbnRlcnNlY3Rpb259XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5pbnRlcnNlY3RCZXppZXIyQmV6aWVyMiA9IGZ1bmN0aW9uKGExLCBhMiwgYTMsIGIxLCBiMiwgYjMpIHtcclxuICAgIHZhciBhLCBiO1xyXG4gICAgdmFyIGMxMiwgYzExLCBjMTA7XHJcbiAgICB2YXIgYzIyLCBjMjEsIGMyMDtcclxuICAgIHZhciByZXN1bHQgPSBuZXcgSW50ZXJzZWN0aW9uKCk7XHJcbiAgICB2YXIgcG9seTtcclxuXHJcbiAgICBhID0gYTIubXVsdGlwbHkoLTIpO1xyXG4gICAgYzEyID0gYTEuYWRkKGEuYWRkKGEzKSk7XHJcblxyXG4gICAgYSA9IGExLm11bHRpcGx5KC0yKTtcclxuICAgIGIgPSBhMi5tdWx0aXBseSgyKTtcclxuICAgIGMxMSA9IGEuYWRkKGIpO1xyXG5cclxuICAgIGMxMCA9IG5ldyBQb2ludDJEKGExLngsIGExLnkpO1xyXG5cclxuICAgIGEgPSBiMi5tdWx0aXBseSgtMik7XHJcbiAgICBjMjIgPSBiMS5hZGQoYS5hZGQoYjMpKTtcclxuXHJcbiAgICBhID0gYjEubXVsdGlwbHkoLTIpO1xyXG4gICAgYiA9IGIyLm11bHRpcGx5KDIpO1xyXG4gICAgYzIxID0gYS5hZGQoYik7XHJcblxyXG4gICAgYzIwID0gbmV3IFBvaW50MkQoYjEueCwgYjEueSk7XHJcblxyXG4gICAgdmFyIHYwLCB2MSwgdjIsIHYzLCB2NCwgdjUsIHY2O1xyXG4gICAgaWYgKCBjMTIueSA9PT0gMCApIHtcclxuICAgICAgICB2MCA9IGMxMi54KihjMTAueSAtIGMyMC55KTtcclxuICAgICAgICB2MSA9IHYwIC0gYzExLngqYzExLnk7XHJcbiAgICAgICAgdjIgPSB2MCArIHYxO1xyXG4gICAgICAgIHYzID0gYzExLnkqYzExLnk7XHJcblxyXG4gICAgICAgIHBvbHkgPSBuZXcgUG9seW5vbWlhbChcclxuICAgICAgICAgICAgYzEyLngqYzIyLnkqYzIyLnksXHJcbiAgICAgICAgICAgIDIqYzEyLngqYzIxLnkqYzIyLnksXHJcbiAgICAgICAgICAgIGMxMi54KmMyMS55KmMyMS55IC0gYzIyLngqdjMgLSBjMjIueSp2MCAtIGMyMi55KnYxLFxyXG4gICAgICAgICAgICAtYzIxLngqdjMgLSBjMjEueSp2MCAtIGMyMS55KnYxLFxyXG4gICAgICAgICAgICAoYzEwLnggLSBjMjAueCkqdjMgKyAoYzEwLnkgLSBjMjAueSkqdjFcclxuICAgICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2MCA9IGMxMi54KmMyMi55IC0gYzEyLnkqYzIyLng7XHJcbiAgICAgICAgdjEgPSBjMTIueCpjMjEueSAtIGMyMS54KmMxMi55O1xyXG4gICAgICAgIHYyID0gYzExLngqYzEyLnkgLSBjMTEueSpjMTIueDtcclxuICAgICAgICB2MyA9IGMxMC55IC0gYzIwLnk7XHJcbiAgICAgICAgdjQgPSBjMTIueSooYzEwLnggLSBjMjAueCkgLSBjMTIueCp2MztcclxuICAgICAgICB2NSA9IC1jMTEueSp2MiArIGMxMi55KnY0O1xyXG4gICAgICAgIHY2ID0gdjIqdjI7XHJcblxyXG4gICAgICAgIHBvbHkgPSBuZXcgUG9seW5vbWlhbChcclxuICAgICAgICAgICAgdjAqdjAsXHJcbiAgICAgICAgICAgIDIqdjAqdjEsXHJcbiAgICAgICAgICAgICgtYzIyLnkqdjYgKyBjMTIueSp2MSp2MSArIGMxMi55KnYwKnY0ICsgdjAqdjUpIC8gYzEyLnksXHJcbiAgICAgICAgICAgICgtYzIxLnkqdjYgKyBjMTIueSp2MSp2NCArIHYxKnY1KSAvIGMxMi55LFxyXG4gICAgICAgICAgICAodjMqdjYgKyB2NCp2NSkgLyBjMTIueVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJvb3RzID0gcG9seS5nZXRSb290cygpO1xyXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgcm9vdHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgdmFyIHMgPSByb290c1tpXTtcclxuXHJcbiAgICAgICAgaWYgKCAwIDw9IHMgJiYgcyA8PSAxICkge1xyXG4gICAgICAgICAgICB2YXIgeFJvb3RzID0gbmV3IFBvbHlub21pYWwoXHJcbiAgICAgICAgICAgICAgICBjMTIueCxcclxuICAgICAgICAgICAgICAgIGMxMS54LFxyXG4gICAgICAgICAgICAgICAgYzEwLnggLSBjMjAueCAtIHMqYzIxLnggLSBzKnMqYzIyLnhcclxuICAgICAgICAgICAgKS5nZXRSb290cygpO1xyXG4gICAgICAgICAgICB2YXIgeVJvb3RzID0gbmV3IFBvbHlub21pYWwoXHJcbiAgICAgICAgICAgICAgICBjMTIueSxcclxuICAgICAgICAgICAgICAgIGMxMS55LFxyXG4gICAgICAgICAgICAgICAgYzEwLnkgLSBjMjAueSAtIHMqYzIxLnkgLSBzKnMqYzIyLnlcclxuICAgICAgICAgICAgKS5nZXRSb290cygpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCB4Um9vdHMubGVuZ3RoID4gMCAmJiB5Um9vdHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIHZhciBUT0xFUkFOQ0UgPSAxZS00O1xyXG5cclxuICAgICAgICAgICAgICAgIGNoZWNrUm9vdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGogPSAwOyBqIDwgeFJvb3RzLmxlbmd0aDsgaisrICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeFJvb3QgPSB4Um9vdHNbal07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIDAgPD0geFJvb3QgJiYgeFJvb3QgPD0gMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoIHZhciBrID0gMDsgayA8IHlSb290cy5sZW5ndGg7IGsrKyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIE1hdGguYWJzKCB4Um9vdCAtIHlSb290c1trXSApIDwgVE9MRVJBTkNFICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucG9pbnRzLnB1c2goIGMyMi5tdWx0aXBseShzKnMpLmFkZChjMjEubXVsdGlwbHkocykuYWRkKGMyMCkpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIGNoZWNrUm9vdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqICBpbnRlcnNlY3RCZXppZXIyQmV6aWVyM1xyXG4gKlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhMlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhM1xyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBiMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBiMlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBiM1xyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBiNFxyXG4gKiAgQHJldHVybnMge0ludGVyc2VjdGlvbn1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmludGVyc2VjdEJlemllcjJCZXppZXIzID0gZnVuY3Rpb24oYTEsIGEyLCBhMywgYjEsIGIyLCBiMywgYjQpIHtcclxuICAgIHZhciBhLCBiLGMsIGQ7XHJcbiAgICB2YXIgYzEyLCBjMTEsIGMxMDtcclxuICAgIHZhciBjMjMsIGMyMiwgYzIxLCBjMjA7XHJcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbigpO1xyXG5cclxuICAgIGEgPSBhMi5tdWx0aXBseSgtMik7XHJcbiAgICBjMTIgPSBhMS5hZGQoYS5hZGQoYTMpKTtcclxuXHJcbiAgICBhID0gYTEubXVsdGlwbHkoLTIpO1xyXG4gICAgYiA9IGEyLm11bHRpcGx5KDIpO1xyXG4gICAgYzExID0gYS5hZGQoYik7XHJcblxyXG4gICAgYzEwID0gbmV3IFBvaW50MkQoYTEueCwgYTEueSk7XHJcblxyXG4gICAgYSA9IGIxLm11bHRpcGx5KC0xKTtcclxuICAgIGIgPSBiMi5tdWx0aXBseSgzKTtcclxuICAgIGMgPSBiMy5tdWx0aXBseSgtMyk7XHJcbiAgICBkID0gYS5hZGQoYi5hZGQoYy5hZGQoYjQpKSk7XHJcbiAgICBjMjMgPSBuZXcgVmVjdG9yMkQoZC54LCBkLnkpO1xyXG5cclxuICAgIGEgPSBiMS5tdWx0aXBseSgzKTtcclxuICAgIGIgPSBiMi5tdWx0aXBseSgtNik7XHJcbiAgICBjID0gYjMubXVsdGlwbHkoMyk7XHJcbiAgICBkID0gYS5hZGQoYi5hZGQoYykpO1xyXG4gICAgYzIyID0gbmV3IFZlY3RvcjJEKGQueCwgZC55KTtcclxuXHJcbiAgICBhID0gYjEubXVsdGlwbHkoLTMpO1xyXG4gICAgYiA9IGIyLm11bHRpcGx5KDMpO1xyXG4gICAgYyA9IGEuYWRkKGIpO1xyXG4gICAgYzIxID0gbmV3IFZlY3RvcjJEKGMueCwgYy55KTtcclxuXHJcbiAgICBjMjAgPSBuZXcgVmVjdG9yMkQoYjEueCwgYjEueSk7XHJcblxyXG4gICAgdmFyIGMxMHgyID0gYzEwLngqYzEwLng7XHJcbiAgICB2YXIgYzEweTIgPSBjMTAueSpjMTAueTtcclxuICAgIHZhciBjMTF4MiA9IGMxMS54KmMxMS54O1xyXG4gICAgdmFyIGMxMXkyID0gYzExLnkqYzExLnk7XHJcbiAgICB2YXIgYzEyeDIgPSBjMTIueCpjMTIueDtcclxuICAgIHZhciBjMTJ5MiA9IGMxMi55KmMxMi55O1xyXG4gICAgdmFyIGMyMHgyID0gYzIwLngqYzIwLng7XHJcbiAgICB2YXIgYzIweTIgPSBjMjAueSpjMjAueTtcclxuICAgIHZhciBjMjF4MiA9IGMyMS54KmMyMS54O1xyXG4gICAgdmFyIGMyMXkyID0gYzIxLnkqYzIxLnk7XHJcbiAgICB2YXIgYzIyeDIgPSBjMjIueCpjMjIueDtcclxuICAgIHZhciBjMjJ5MiA9IGMyMi55KmMyMi55O1xyXG4gICAgdmFyIGMyM3gyID0gYzIzLngqYzIzLng7XHJcbiAgICB2YXIgYzIzeTIgPSBjMjMueSpjMjMueTtcclxuXHJcbiAgICB2YXIgcG9seSA9IG5ldyBQb2x5bm9taWFsKFxyXG4gICAgICAgIC0yKmMxMi54KmMxMi55KmMyMy54KmMyMy55ICsgYzEyeDIqYzIzeTIgKyBjMTJ5MipjMjN4MixcclxuICAgICAgICAtMipjMTIueCpjMTIueSpjMjIueCpjMjMueSAtIDIqYzEyLngqYzEyLnkqYzIyLnkqYzIzLnggKyAyKmMxMnkyKmMyMi54KmMyMy54ICtcclxuICAgICAgICAgICAgMipjMTJ4MipjMjIueSpjMjMueSxcclxuICAgICAgICAtMipjMTIueCpjMjEueCpjMTIueSpjMjMueSAtIDIqYzEyLngqYzEyLnkqYzIxLnkqYzIzLnggLSAyKmMxMi54KmMxMi55KmMyMi54KmMyMi55ICtcclxuICAgICAgICAgICAgMipjMjEueCpjMTJ5MipjMjMueCArIGMxMnkyKmMyMngyICsgYzEyeDIqKDIqYzIxLnkqYzIzLnkgKyBjMjJ5MiksXHJcbiAgICAgICAgMipjMTAueCpjMTIueCpjMTIueSpjMjMueSArIDIqYzEwLnkqYzEyLngqYzEyLnkqYzIzLnggKyBjMTEueCpjMTEueSpjMTIueCpjMjMueSArXHJcbiAgICAgICAgICAgIGMxMS54KmMxMS55KmMxMi55KmMyMy54IC0gMipjMjAueCpjMTIueCpjMTIueSpjMjMueSAtIDIqYzEyLngqYzIwLnkqYzEyLnkqYzIzLnggLVxyXG4gICAgICAgICAgICAyKmMxMi54KmMyMS54KmMxMi55KmMyMi55IC0gMipjMTIueCpjMTIueSpjMjEueSpjMjIueCAtIDIqYzEwLngqYzEyeTIqYzIzLnggLVxyXG4gICAgICAgICAgICAyKmMxMC55KmMxMngyKmMyMy55ICsgMipjMjAueCpjMTJ5MipjMjMueCArIDIqYzIxLngqYzEyeTIqYzIyLnggLVxyXG4gICAgICAgICAgICBjMTF5MipjMTIueCpjMjMueCAtIGMxMXgyKmMxMi55KmMyMy55ICsgYzEyeDIqKDIqYzIwLnkqYzIzLnkgKyAyKmMyMS55KmMyMi55KSxcclxuICAgICAgICAyKmMxMC54KmMxMi54KmMxMi55KmMyMi55ICsgMipjMTAueSpjMTIueCpjMTIueSpjMjIueCArIGMxMS54KmMxMS55KmMxMi54KmMyMi55ICtcclxuICAgICAgICAgICAgYzExLngqYzExLnkqYzEyLnkqYzIyLnggLSAyKmMyMC54KmMxMi54KmMxMi55KmMyMi55IC0gMipjMTIueCpjMjAueSpjMTIueSpjMjIueCAtXHJcbiAgICAgICAgICAgIDIqYzEyLngqYzIxLngqYzEyLnkqYzIxLnkgLSAyKmMxMC54KmMxMnkyKmMyMi54IC0gMipjMTAueSpjMTJ4MipjMjIueSArXHJcbiAgICAgICAgICAgIDIqYzIwLngqYzEyeTIqYzIyLnggLSBjMTF5MipjMTIueCpjMjIueCAtIGMxMXgyKmMxMi55KmMyMi55ICsgYzIxeDIqYzEyeTIgK1xyXG4gICAgICAgICAgICBjMTJ4MiooMipjMjAueSpjMjIueSArIGMyMXkyKSxcclxuICAgICAgICAyKmMxMC54KmMxMi54KmMxMi55KmMyMS55ICsgMipjMTAueSpjMTIueCpjMjEueCpjMTIueSArIGMxMS54KmMxMS55KmMxMi54KmMyMS55ICtcclxuICAgICAgICAgICAgYzExLngqYzExLnkqYzIxLngqYzEyLnkgLSAyKmMyMC54KmMxMi54KmMxMi55KmMyMS55IC0gMipjMTIueCpjMjAueSpjMjEueCpjMTIueSAtXHJcbiAgICAgICAgICAgIDIqYzEwLngqYzIxLngqYzEyeTIgLSAyKmMxMC55KmMxMngyKmMyMS55ICsgMipjMjAueCpjMjEueCpjMTJ5MiAtXHJcbiAgICAgICAgICAgIGMxMXkyKmMxMi54KmMyMS54IC0gYzExeDIqYzEyLnkqYzIxLnkgKyAyKmMxMngyKmMyMC55KmMyMS55LFxyXG4gICAgICAgIC0yKmMxMC54KmMxMC55KmMxMi54KmMxMi55IC0gYzEwLngqYzExLngqYzExLnkqYzEyLnkgLSBjMTAueSpjMTEueCpjMTEueSpjMTIueCArXHJcbiAgICAgICAgICAgIDIqYzEwLngqYzEyLngqYzIwLnkqYzEyLnkgKyAyKmMxMC55KmMyMC54KmMxMi54KmMxMi55ICsgYzExLngqYzIwLngqYzExLnkqYzEyLnkgK1xyXG4gICAgICAgICAgICBjMTEueCpjMTEueSpjMTIueCpjMjAueSAtIDIqYzIwLngqYzEyLngqYzIwLnkqYzEyLnkgLSAyKmMxMC54KmMyMC54KmMxMnkyICtcclxuICAgICAgICAgICAgYzEwLngqYzExeTIqYzEyLnggKyBjMTAueSpjMTF4MipjMTIueSAtIDIqYzEwLnkqYzEyeDIqYzIwLnkgLVxyXG4gICAgICAgICAgICBjMjAueCpjMTF5MipjMTIueCAtIGMxMXgyKmMyMC55KmMxMi55ICsgYzEweDIqYzEyeTIgKyBjMTB5MipjMTJ4MiArXHJcbiAgICAgICAgICAgIGMyMHgyKmMxMnkyICsgYzEyeDIqYzIweTJcclxuICAgICk7XHJcbiAgICB2YXIgcm9vdHMgPSBwb2x5LmdldFJvb3RzSW5JbnRlcnZhbCgwLDEpO1xyXG4gICAgcmVtb3ZlTXVsdGlwbGVSb290c0luMDEocm9vdHMpO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHJvb3RzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgIHZhciBzID0gcm9vdHNbaV07XHJcbiAgICAgICAgdmFyIHhSb290cyA9IG5ldyBQb2x5bm9taWFsKFxyXG4gICAgICAgICAgICBjMTIueCxcclxuICAgICAgICAgICAgYzExLngsXHJcbiAgICAgICAgICAgIGMxMC54IC0gYzIwLnggLSBzKmMyMS54IC0gcypzKmMyMi54IC0gcypzKnMqYzIzLnhcclxuICAgICAgICApLmdldFJvb3RzKCk7XHJcbiAgICAgICAgdmFyIHlSb290cyA9IG5ldyBQb2x5bm9taWFsKFxyXG4gICAgICAgICAgICBjMTIueSxcclxuICAgICAgICAgICAgYzExLnksXHJcbiAgICAgICAgICAgIGMxMC55IC0gYzIwLnkgLSBzKmMyMS55IC0gcypzKmMyMi55IC0gcypzKnMqYzIzLnlcclxuICAgICAgICApLmdldFJvb3RzKCk7XHJcblxyXG4gICAgICAgIGlmICggeFJvb3RzLmxlbmd0aCA+IDAgJiYgeVJvb3RzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgIHZhciBUT0xFUkFOQ0UgPSAxZS00O1xyXG5cclxuICAgICAgICAgICAgY2hlY2tSb290czpcclxuICAgICAgICAgICAgICAgIGZvciAoIHZhciBqID0gMDsgaiA8IHhSb290cy5sZW5ndGg7IGorKyApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeFJvb3QgPSB4Um9vdHNbal07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggMCA8PSB4Um9vdCAmJiB4Um9vdCA8PSAxICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgayA9IDA7IGsgPCB5Um9vdHMubGVuZ3RoOyBrKysgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIE1hdGguYWJzKCB4Um9vdCAtIHlSb290c1trXSApIDwgVE9MRVJBTkNFICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gYzIzLm11bHRpcGx5KHMgKiBzICogcykuYWRkKGMyMi5tdWx0aXBseShzICogcykuYWRkKGMyMS5tdWx0aXBseShzKS5hZGQoYzIwKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wb2ludHMucHVzaChuZXcgUG9pbnQyRCh2LngsIHYueSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIGNoZWNrUm9vdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqICBpbnRlcnNlY3RCZXppZXIyRWxsaXBzZVxyXG4gKlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwM1xyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBlY1xyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHJ4XHJcbiAqICBAcGFyYW0ge051bWJlcn0gcnlcclxuICogIEByZXR1cm5zIHtJbnRlcnNlY3Rpb259XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5pbnRlcnNlY3RCZXppZXIyRWxsaXBzZSA9IGZ1bmN0aW9uKHAxLCBwMiwgcDMsIGVjLCByeCwgcnkpIHtcclxuICAgIHZhciBhLCBiOyAgICAgICAvLyB0ZW1wb3JhcnkgdmFyaWFibGVzXHJcbiAgICB2YXIgYzIsIGMxLCBjMDsgLy8gY29lZmZpY2llbnRzIG9mIHF1YWRyYXRpY1xyXG4gICAgdmFyIHJlc3VsdCA9IG5ldyBJbnRlcnNlY3Rpb24oKTtcclxuXHJcbiAgICBhID0gcDIubXVsdGlwbHkoLTIpO1xyXG4gICAgYzIgPSBwMS5hZGQoYS5hZGQocDMpKTtcclxuXHJcbiAgICBhID0gcDEubXVsdGlwbHkoLTIpO1xyXG4gICAgYiA9IHAyLm11bHRpcGx5KDIpO1xyXG4gICAgYzEgPSBhLmFkZChiKTtcclxuXHJcbiAgICBjMCA9IG5ldyBQb2ludDJEKHAxLngsIHAxLnkpO1xyXG5cclxuICAgIHZhciByeHJ4ICA9IHJ4KnJ4O1xyXG4gICAgdmFyIHJ5cnkgID0gcnkqcnk7XHJcbiAgICB2YXIgcm9vdHMgPSBuZXcgUG9seW5vbWlhbChcclxuICAgICAgICByeXJ5KmMyLngqYzIueCArIHJ4cngqYzIueSpjMi55LFxyXG4gICAgICAgIDIqKHJ5cnkqYzIueCpjMS54ICsgcnhyeCpjMi55KmMxLnkpLFxyXG4gICAgICAgIHJ5cnkqKDIqYzIueCpjMC54ICsgYzEueCpjMS54KSArIHJ4cngqKDIqYzIueSpjMC55K2MxLnkqYzEueSkgLVxyXG4gICAgICAgICAgICAyKihyeXJ5KmVjLngqYzIueCArIHJ4cngqZWMueSpjMi55KSxcclxuICAgICAgICAyKihyeXJ5KmMxLngqKGMwLngtZWMueCkgKyByeHJ4KmMxLnkqKGMwLnktZWMueSkpLFxyXG4gICAgICAgIHJ5cnkqKGMwLngqYzAueCtlYy54KmVjLngpICsgcnhyeCooYzAueSpjMC55ICsgZWMueSplYy55KSAtXHJcbiAgICAgICAgICAgIDIqKHJ5cnkqZWMueCpjMC54ICsgcnhyeCplYy55KmMwLnkpIC0gcnhyeCpyeXJ5XHJcbiAgICApLmdldFJvb3RzKCk7XHJcblxyXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgcm9vdHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgdmFyIHQgPSByb290c1tpXTtcclxuXHJcbiAgICAgICAgaWYgKCAwIDw9IHQgJiYgdCA8PSAxIClcclxuICAgICAgICAgICAgcmVzdWx0LnBvaW50cy5wdXNoKCBjMi5tdWx0aXBseSh0KnQpLmFkZChjMS5tdWx0aXBseSh0KS5hZGQoYzApKSApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqICBpbnRlcnNlY3RCZXppZXIyTGluZVxyXG4gKlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwM1xyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhMlxyXG4gKiAgQHJldHVybnMge0ludGVyc2VjdGlvbn1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmludGVyc2VjdEJlemllcjJMaW5lID0gZnVuY3Rpb24ocDEsIHAyLCBwMywgYTEsIGEyKSB7XHJcbiAgICB2YXIgYSwgYjsgICAgICAgICAgICAgLy8gdGVtcG9yYXJ5IHZhcmlhYmxlc1xyXG4gICAgdmFyIGMyLCBjMSwgYzA7ICAgICAgIC8vIGNvZWZmaWNpZW50cyBvZiBxdWFkcmF0aWNcclxuICAgIHZhciBjbDsgICAgICAgICAgICAgICAvLyBjIGNvZWZmaWNpZW50IGZvciBub3JtYWwgZm9ybSBvZiBsaW5lXHJcbiAgICB2YXIgbjsgICAgICAgICAgICAgICAgLy8gbm9ybWFsIGZvciBub3JtYWwgZm9ybSBvZiBsaW5lXHJcbiAgICB2YXIgbWluID0gYTEubWluKGEyKTsgLy8gdXNlZCB0byBkZXRlcm1pbmUgaWYgcG9pbnQgaXMgb24gbGluZSBzZWdtZW50XHJcbiAgICB2YXIgbWF4ID0gYTEubWF4KGEyKTsgLy8gdXNlZCB0byBkZXRlcm1pbmUgaWYgcG9pbnQgaXMgb24gbGluZSBzZWdtZW50XHJcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbigpO1xyXG5cclxuICAgIGEgPSBwMi5tdWx0aXBseSgtMik7XHJcbiAgICBjMiA9IHAxLmFkZChhLmFkZChwMykpO1xyXG5cclxuICAgIGEgPSBwMS5tdWx0aXBseSgtMik7XHJcbiAgICBiID0gcDIubXVsdGlwbHkoMik7XHJcbiAgICBjMSA9IGEuYWRkKGIpO1xyXG5cclxuICAgIGMwID0gbmV3IFBvaW50MkQocDEueCwgcDEueSk7XHJcblxyXG4gICAgLy8gQ29udmVydCBsaW5lIHRvIG5vcm1hbCBmb3JtOiBheCArIGJ5ICsgYyA9IDBcclxuICAgIC8vIEZpbmQgbm9ybWFsIHRvIGxpbmU6IG5lZ2F0aXZlIGludmVyc2Ugb2Ygb3JpZ2luYWwgbGluZSdzIHNsb3BlXHJcbiAgICBuID0gbmV3IFZlY3RvcjJEKGExLnkgLSBhMi55LCBhMi54IC0gYTEueCk7XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIG5ldyBjIGNvZWZmaWNpZW50XHJcbiAgICBjbCA9IGExLngqYTIueSAtIGEyLngqYTEueTtcclxuXHJcbiAgICAvLyBUcmFuc2Zvcm0gY3ViaWMgY29lZmZpY2llbnRzIHRvIGxpbmUncyBjb29yZGluYXRlIHN5c3RlbSBhbmQgZmluZCByb290c1xyXG4gICAgLy8gb2YgY3ViaWNcclxuICAgIHJvb3RzID0gbmV3IFBvbHlub21pYWwoXHJcbiAgICAgICAgbi5kb3QoYzIpLFxyXG4gICAgICAgIG4uZG90KGMxKSxcclxuICAgICAgICBuLmRvdChjMCkgKyBjbFxyXG4gICAgKS5nZXRSb290cygpO1xyXG5cclxuICAgIC8vIEFueSByb290cyBpbiBjbG9zZWQgaW50ZXJ2YWwgWzAsMV0gYXJlIGludGVyc2VjdGlvbnMgb24gQmV6aWVyLCBidXRcclxuICAgIC8vIG1pZ2h0IG5vdCBiZSBvbiB0aGUgbGluZSBzZWdtZW50LlxyXG4gICAgLy8gRmluZCBpbnRlcnNlY3Rpb25zIGFuZCBjYWxjdWxhdGUgcG9pbnQgY29vcmRpbmF0ZXNcclxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHJvb3RzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgIHZhciB0ID0gcm9vdHNbaV07XHJcblxyXG4gICAgICAgIGlmICggMCA8PSB0ICYmIHQgPD0gMSApIHtcclxuICAgICAgICAgICAgLy8gV2UncmUgd2l0aGluIHRoZSBCZXppZXIgY3VydmVcclxuICAgICAgICAgICAgLy8gRmluZCBwb2ludCBvbiBCZXppZXJcclxuICAgICAgICAgICAgdmFyIHA0ID0gcDEubGVycChwMiwgdCk7XHJcbiAgICAgICAgICAgIHZhciBwNSA9IHAyLmxlcnAocDMsIHQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHA2ID0gcDQubGVycChwNSwgdCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZWUgaWYgcG9pbnQgaXMgb24gbGluZSBzZWdtZW50XHJcbiAgICAgICAgICAgIC8vIEhhZCB0byBtYWtlIHNwZWNpYWwgY2FzZXMgZm9yIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIGxpbmVzIGR1ZVxyXG4gICAgICAgICAgICAvLyB0byBzbGlnaHQgZXJyb3JzIGluIGNhbGN1bGF0aW9uIG9mIHA2XHJcbiAgICAgICAgICAgIGlmICggYTEueCA9PSBhMi54ICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBtaW4ueSA8PSBwNi55ICYmIHA2LnkgPD0gbWF4LnkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFwcGVuZFBvaW50KCBwNiApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBhMS55ID09IGEyLnkgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIG1pbi54IDw9IHA2LnggJiYgcDYueCA8PSBtYXgueCApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYXBwZW5kUG9pbnQoIHA2ICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWluLnggPD0gcDYueCAmJiBwNi54IDw9IG1heC54ICYmIG1pbi55IDw9IHA2LnkgJiYgcDYueSA8PSBtYXgueSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmFwcGVuZFBvaW50KCBwNiApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqICBpbnRlcnNlY3RCZXppZXIzQmV6aWVyM1xyXG4gKlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhMlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhM1xyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhNFxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBiMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBiMlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBiM1xyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBiNFxyXG4gKiAgQHJldHVybnMge0ludGVyc2VjdGlvbn1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmludGVyc2VjdEJlemllcjNCZXppZXIzID0gZnVuY3Rpb24oYTEsIGEyLCBhMywgYTQsIGIxLCBiMiwgYjMsIGI0KSB7XHJcbiAgICB2YXIgYSwgYiwgYywgZDsgICAgICAgICAvLyB0ZW1wb3JhcnkgdmFyaWFibGVzXHJcbiAgICB2YXIgYzEzLCBjMTIsIGMxMSwgYzEwOyAvLyBjb2VmZmljaWVudHMgb2YgY3ViaWNcclxuICAgIHZhciBjMjMsIGMyMiwgYzIxLCBjMjA7IC8vIGNvZWZmaWNpZW50cyBvZiBjdWJpY1xyXG4gICAgdmFyIHJlc3VsdCA9IG5ldyBJbnRlcnNlY3Rpb24oKTtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgdGhlIGNvZWZmaWNpZW50cyBvZiBjdWJpYyBwb2x5bm9taWFsXHJcbiAgICBhID0gYTEubXVsdGlwbHkoLTEpO1xyXG4gICAgYiA9IGEyLm11bHRpcGx5KDMpO1xyXG4gICAgYyA9IGEzLm11bHRpcGx5KC0zKTtcclxuICAgIGQgPSBhLmFkZChiLmFkZChjLmFkZChhNCkpKTtcclxuICAgIGMxMyA9IG5ldyBWZWN0b3IyRChkLngsIGQueSk7XHJcblxyXG4gICAgYSA9IGExLm11bHRpcGx5KDMpO1xyXG4gICAgYiA9IGEyLm11bHRpcGx5KC02KTtcclxuICAgIGMgPSBhMy5tdWx0aXBseSgzKTtcclxuICAgIGQgPSBhLmFkZChiLmFkZChjKSk7XHJcbiAgICBjMTIgPSBuZXcgVmVjdG9yMkQoZC54LCBkLnkpO1xyXG5cclxuICAgIGEgPSBhMS5tdWx0aXBseSgtMyk7XHJcbiAgICBiID0gYTIubXVsdGlwbHkoMyk7XHJcbiAgICBjID0gYS5hZGQoYik7XHJcbiAgICBjMTEgPSBuZXcgVmVjdG9yMkQoYy54LCBjLnkpO1xyXG5cclxuICAgIGMxMCA9IG5ldyBWZWN0b3IyRChhMS54LCBhMS55KTtcclxuXHJcbiAgICBhID0gYjEubXVsdGlwbHkoLTEpO1xyXG4gICAgYiA9IGIyLm11bHRpcGx5KDMpO1xyXG4gICAgYyA9IGIzLm11bHRpcGx5KC0zKTtcclxuICAgIGQgPSBhLmFkZChiLmFkZChjLmFkZChiNCkpKTtcclxuICAgIGMyMyA9IG5ldyBWZWN0b3IyRChkLngsIGQueSk7XHJcblxyXG4gICAgYSA9IGIxLm11bHRpcGx5KDMpO1xyXG4gICAgYiA9IGIyLm11bHRpcGx5KC02KTtcclxuICAgIGMgPSBiMy5tdWx0aXBseSgzKTtcclxuICAgIGQgPSBhLmFkZChiLmFkZChjKSk7XHJcbiAgICBjMjIgPSBuZXcgVmVjdG9yMkQoZC54LCBkLnkpO1xyXG5cclxuICAgIGEgPSBiMS5tdWx0aXBseSgtMyk7XHJcbiAgICBiID0gYjIubXVsdGlwbHkoMyk7XHJcbiAgICBjID0gYS5hZGQoYik7XHJcbiAgICBjMjEgPSBuZXcgVmVjdG9yMkQoYy54LCBjLnkpO1xyXG5cclxuICAgIGMyMCA9IG5ldyBWZWN0b3IyRChiMS54LCBiMS55KTtcclxuXHJcbiAgICB2YXIgYzEweDIgPSBjMTAueCpjMTAueDtcclxuICAgIHZhciBjMTB4MyA9IGMxMC54KmMxMC54KmMxMC54O1xyXG4gICAgdmFyIGMxMHkyID0gYzEwLnkqYzEwLnk7XHJcbiAgICB2YXIgYzEweTMgPSBjMTAueSpjMTAueSpjMTAueTtcclxuICAgIHZhciBjMTF4MiA9IGMxMS54KmMxMS54O1xyXG4gICAgdmFyIGMxMXgzID0gYzExLngqYzExLngqYzExLng7XHJcbiAgICB2YXIgYzExeTIgPSBjMTEueSpjMTEueTtcclxuICAgIHZhciBjMTF5MyA9IGMxMS55KmMxMS55KmMxMS55O1xyXG4gICAgdmFyIGMxMngyID0gYzEyLngqYzEyLng7XHJcbiAgICB2YXIgYzEyeDMgPSBjMTIueCpjMTIueCpjMTIueDtcclxuICAgIHZhciBjMTJ5MiA9IGMxMi55KmMxMi55O1xyXG4gICAgdmFyIGMxMnkzID0gYzEyLnkqYzEyLnkqYzEyLnk7XHJcbiAgICB2YXIgYzEzeDIgPSBjMTMueCpjMTMueDtcclxuICAgIHZhciBjMTN4MyA9IGMxMy54KmMxMy54KmMxMy54O1xyXG4gICAgdmFyIGMxM3kyID0gYzEzLnkqYzEzLnk7XHJcbiAgICB2YXIgYzEzeTMgPSBjMTMueSpjMTMueSpjMTMueTtcclxuICAgIHZhciBjMjB4MiA9IGMyMC54KmMyMC54O1xyXG4gICAgdmFyIGMyMHgzID0gYzIwLngqYzIwLngqYzIwLng7XHJcbiAgICB2YXIgYzIweTIgPSBjMjAueSpjMjAueTtcclxuICAgIHZhciBjMjB5MyA9IGMyMC55KmMyMC55KmMyMC55O1xyXG4gICAgdmFyIGMyMXgyID0gYzIxLngqYzIxLng7XHJcbiAgICB2YXIgYzIxeDMgPSBjMjEueCpjMjEueCpjMjEueDtcclxuICAgIHZhciBjMjF5MiA9IGMyMS55KmMyMS55O1xyXG4gICAgdmFyIGMyMngyID0gYzIyLngqYzIyLng7XHJcbiAgICB2YXIgYzIyeDMgPSBjMjIueCpjMjIueCpjMjIueDtcclxuICAgIHZhciBjMjJ5MiA9IGMyMi55KmMyMi55O1xyXG4gICAgdmFyIGMyM3gyID0gYzIzLngqYzIzLng7XHJcbiAgICB2YXIgYzIzeDMgPSBjMjMueCpjMjMueCpjMjMueDtcclxuICAgIHZhciBjMjN5MiA9IGMyMy55KmMyMy55O1xyXG4gICAgdmFyIGMyM3kzID0gYzIzLnkqYzIzLnkqYzIzLnk7XHJcbiAgICB2YXIgcG9seSA9IG5ldyBQb2x5bm9taWFsKFxyXG4gICAgICAgIC1jMTN4MypjMjN5MyArIGMxM3kzKmMyM3gzIC0gMypjMTMueCpjMTN5MipjMjN4MipjMjMueSArXHJcbiAgICAgICAgICAgIDMqYzEzeDIqYzEzLnkqYzIzLngqYzIzeTIsXHJcbiAgICAgICAgLTYqYzEzLngqYzIyLngqYzEzeTIqYzIzLngqYzIzLnkgKyA2KmMxM3gyKmMxMy55KmMyMi55KmMyMy54KmMyMy55ICsgMypjMjIueCpjMTN5MypjMjN4MiAtXHJcbiAgICAgICAgICAgIDMqYzEzeDMqYzIyLnkqYzIzeTIgLSAzKmMxMy54KmMxM3kyKmMyMi55KmMyM3gyICsgMypjMTN4MipjMjIueCpjMTMueSpjMjN5MixcclxuICAgICAgICAtNipjMjEueCpjMTMueCpjMTN5MipjMjMueCpjMjMueSAtIDYqYzEzLngqYzIyLngqYzEzeTIqYzIyLnkqYzIzLnggKyA2KmMxM3gyKmMyMi54KmMxMy55KmMyMi55KmMyMy55ICtcclxuICAgICAgICAgICAgMypjMjEueCpjMTN5MypjMjN4MiArIDMqYzIyeDIqYzEzeTMqYzIzLnggKyAzKmMyMS54KmMxM3gyKmMxMy55KmMyM3kyIC0gMypjMTMueCpjMjEueSpjMTN5MipjMjN4MiAtXHJcbiAgICAgICAgICAgIDMqYzEzLngqYzIyeDIqYzEzeTIqYzIzLnkgKyBjMTN4MipjMTMueSpjMjMueCooNipjMjEueSpjMjMueSArIDMqYzIyeTIpICsgYzEzeDMqKC1jMjEueSpjMjN5MiAtXHJcbiAgICAgICAgICAgIDIqYzIyeTIqYzIzLnkgLSBjMjMueSooMipjMjEueSpjMjMueSArIGMyMnkyKSksXHJcbiAgICAgICAgYzExLngqYzEyLnkqYzEzLngqYzEzLnkqYzIzLngqYzIzLnkgLSBjMTEueSpjMTIueCpjMTMueCpjMTMueSpjMjMueCpjMjMueSArIDYqYzIxLngqYzIyLngqYzEzeTMqYzIzLnggK1xyXG4gICAgICAgICAgICAzKmMxMS54KmMxMi54KmMxMy54KmMxMy55KmMyM3kyICsgNipjMTAueCpjMTMueCpjMTN5MipjMjMueCpjMjMueSAtIDMqYzExLngqYzEyLngqYzEzeTIqYzIzLngqYzIzLnkgLVxyXG4gICAgICAgICAgICAzKmMxMS55KmMxMi55KmMxMy54KmMxMy55KmMyM3gyIC0gNipjMTAueSpjMTN4MipjMTMueSpjMjMueCpjMjMueSAtIDYqYzIwLngqYzEzLngqYzEzeTIqYzIzLngqYzIzLnkgK1xyXG4gICAgICAgICAgICAzKmMxMS55KmMxMi55KmMxM3gyKmMyMy54KmMyMy55IC0gMipjMTIueCpjMTJ5MipjMTMueCpjMjMueCpjMjMueSAtIDYqYzIxLngqYzEzLngqYzIyLngqYzEzeTIqYzIzLnkgLVxyXG4gICAgICAgICAgICA2KmMyMS54KmMxMy54KmMxM3kyKmMyMi55KmMyMy54IC0gNipjMTMueCpjMjEueSpjMjIueCpjMTN5MipjMjMueCArIDYqYzIxLngqYzEzeDIqYzEzLnkqYzIyLnkqYzIzLnkgK1xyXG4gICAgICAgICAgICAyKmMxMngyKmMxMi55KmMxMy55KmMyMy54KmMyMy55ICsgYzIyeDMqYzEzeTMgLSAzKmMxMC54KmMxM3kzKmMyM3gyICsgMypjMTAueSpjMTN4MypjMjN5MiArXHJcbiAgICAgICAgICAgIDMqYzIwLngqYzEzeTMqYzIzeDIgKyBjMTJ5MypjMTMueCpjMjN4MiAtIGMxMngzKmMxMy55KmMyM3kyIC0gMypjMTAueCpjMTN4MipjMTMueSpjMjN5MiArXHJcbiAgICAgICAgICAgIDMqYzEwLnkqYzEzLngqYzEzeTIqYzIzeDIgLSAyKmMxMS54KmMxMi55KmMxM3gyKmMyM3kyICsgYzExLngqYzEyLnkqYzEzeTIqYzIzeDIgLSBjMTEueSpjMTIueCpjMTN4MipjMjN5MiArXHJcbiAgICAgICAgICAgIDIqYzExLnkqYzEyLngqYzEzeTIqYzIzeDIgKyAzKmMyMC54KmMxM3gyKmMxMy55KmMyM3kyIC0gYzEyLngqYzEyeTIqYzEzLnkqYzIzeDIgLVxyXG4gICAgICAgICAgICAzKmMyMC55KmMxMy54KmMxM3kyKmMyM3gyICsgYzEyeDIqYzEyLnkqYzEzLngqYzIzeTIgLSAzKmMxMy54KmMyMngyKmMxM3kyKmMyMi55ICtcclxuICAgICAgICAgICAgYzEzeDIqYzEzLnkqYzIzLngqKDYqYzIwLnkqYzIzLnkgKyA2KmMyMS55KmMyMi55KSArIGMxM3gyKmMyMi54KmMxMy55Kig2KmMyMS55KmMyMy55ICsgMypjMjJ5MikgK1xyXG4gICAgICAgICAgICBjMTN4MyooLTIqYzIxLnkqYzIyLnkqYzIzLnkgLSBjMjAueSpjMjN5MiAtIGMyMi55KigyKmMyMS55KmMyMy55ICsgYzIyeTIpIC0gYzIzLnkqKDIqYzIwLnkqYzIzLnkgKyAyKmMyMS55KmMyMi55KSksXHJcbiAgICAgICAgNipjMTEueCpjMTIueCpjMTMueCpjMTMueSpjMjIueSpjMjMueSArIGMxMS54KmMxMi55KmMxMy54KmMyMi54KmMxMy55KmMyMy55ICsgYzExLngqYzEyLnkqYzEzLngqYzEzLnkqYzIyLnkqYzIzLnggLVxyXG4gICAgICAgICAgICBjMTEueSpjMTIueCpjMTMueCpjMjIueCpjMTMueSpjMjMueSAtIGMxMS55KmMxMi54KmMxMy54KmMxMy55KmMyMi55KmMyMy54IC0gNipjMTEueSpjMTIueSpjMTMueCpjMjIueCpjMTMueSpjMjMueCAtXHJcbiAgICAgICAgICAgIDYqYzEwLngqYzIyLngqYzEzeTMqYzIzLnggKyA2KmMyMC54KmMyMi54KmMxM3kzKmMyMy54ICsgNipjMTAueSpjMTN4MypjMjIueSpjMjMueSArIDIqYzEyeTMqYzEzLngqYzIyLngqYzIzLnggLVxyXG4gICAgICAgICAgICAyKmMxMngzKmMxMy55KmMyMi55KmMyMy55ICsgNipjMTAueCpjMTMueCpjMjIueCpjMTN5MipjMjMueSArIDYqYzEwLngqYzEzLngqYzEzeTIqYzIyLnkqYzIzLnggK1xyXG4gICAgICAgICAgICA2KmMxMC55KmMxMy54KmMyMi54KmMxM3kyKmMyMy54IC0gMypjMTEueCpjMTIueCpjMjIueCpjMTN5MipjMjMueSAtIDMqYzExLngqYzEyLngqYzEzeTIqYzIyLnkqYzIzLnggK1xyXG4gICAgICAgICAgICAyKmMxMS54KmMxMi55KmMyMi54KmMxM3kyKmMyMy54ICsgNCpjMTEueSpjMTIueCpjMjIueCpjMTN5MipjMjMueCAtIDYqYzEwLngqYzEzeDIqYzEzLnkqYzIyLnkqYzIzLnkgLVxyXG4gICAgICAgICAgICA2KmMxMC55KmMxM3gyKmMyMi54KmMxMy55KmMyMy55IC0gNipjMTAueSpjMTN4MipjMTMueSpjMjIueSpjMjMueCAtIDQqYzExLngqYzEyLnkqYzEzeDIqYzIyLnkqYzIzLnkgLVxyXG4gICAgICAgICAgICA2KmMyMC54KmMxMy54KmMyMi54KmMxM3kyKmMyMy55IC0gNipjMjAueCpjMTMueCpjMTN5MipjMjIueSpjMjMueCAtIDIqYzExLnkqYzEyLngqYzEzeDIqYzIyLnkqYzIzLnkgK1xyXG4gICAgICAgICAgICAzKmMxMS55KmMxMi55KmMxM3gyKmMyMi54KmMyMy55ICsgMypjMTEueSpjMTIueSpjMTN4MipjMjIueSpjMjMueCAtIDIqYzEyLngqYzEyeTIqYzEzLngqYzIyLngqYzIzLnkgLVxyXG4gICAgICAgICAgICAyKmMxMi54KmMxMnkyKmMxMy54KmMyMi55KmMyMy54IC0gMipjMTIueCpjMTJ5MipjMjIueCpjMTMueSpjMjMueCAtIDYqYzIwLnkqYzEzLngqYzIyLngqYzEzeTIqYzIzLnggLVxyXG4gICAgICAgICAgICA2KmMyMS54KmMxMy54KmMyMS55KmMxM3kyKmMyMy54IC0gNipjMjEueCpjMTMueCpjMjIueCpjMTN5MipjMjIueSArIDYqYzIwLngqYzEzeDIqYzEzLnkqYzIyLnkqYzIzLnkgK1xyXG4gICAgICAgICAgICAyKmMxMngyKmMxMi55KmMxMy54KmMyMi55KmMyMy55ICsgMipjMTJ4MipjMTIueSpjMjIueCpjMTMueSpjMjMueSArIDIqYzEyeDIqYzEyLnkqYzEzLnkqYzIyLnkqYzIzLnggK1xyXG4gICAgICAgICAgICAzKmMyMS54KmMyMngyKmMxM3kzICsgMypjMjF4MipjMTN5MypjMjMueCAtIDMqYzEzLngqYzIxLnkqYzIyeDIqYzEzeTIgLSAzKmMyMXgyKmMxMy54KmMxM3kyKmMyMy55ICtcclxuICAgICAgICAgICAgYzEzeDIqYzIyLngqYzEzLnkqKDYqYzIwLnkqYzIzLnkgKyA2KmMyMS55KmMyMi55KSArIGMxM3gyKmMxMy55KmMyMy54Kig2KmMyMC55KmMyMi55ICsgMypjMjF5MikgK1xyXG4gICAgICAgICAgICBjMjEueCpjMTN4MipjMTMueSooNipjMjEueSpjMjMueSArIDMqYzIyeTIpICsgYzEzeDMqKC0yKmMyMC55KmMyMi55KmMyMy55IC0gYzIzLnkqKDIqYzIwLnkqYzIyLnkgKyBjMjF5MikgLVxyXG4gICAgICAgICAgICBjMjEueSooMipjMjEueSpjMjMueSArIGMyMnkyKSAtIGMyMi55KigyKmMyMC55KmMyMy55ICsgMipjMjEueSpjMjIueSkpLFxyXG4gICAgICAgIGMxMS54KmMyMS54KmMxMi55KmMxMy54KmMxMy55KmMyMy55ICsgYzExLngqYzEyLnkqYzEzLngqYzIxLnkqYzEzLnkqYzIzLnggKyBjMTEueCpjMTIueSpjMTMueCpjMjIueCpjMTMueSpjMjIueSAtXHJcbiAgICAgICAgICAgIGMxMS55KmMxMi54KmMyMS54KmMxMy54KmMxMy55KmMyMy55IC0gYzExLnkqYzEyLngqYzEzLngqYzIxLnkqYzEzLnkqYzIzLnggLSBjMTEueSpjMTIueCpjMTMueCpjMjIueCpjMTMueSpjMjIueSAtXHJcbiAgICAgICAgICAgIDYqYzExLnkqYzIxLngqYzEyLnkqYzEzLngqYzEzLnkqYzIzLnggLSA2KmMxMC54KmMyMS54KmMxM3kzKmMyMy54ICsgNipjMjAueCpjMjEueCpjMTN5MypjMjMueCArXHJcbiAgICAgICAgICAgIDIqYzIxLngqYzEyeTMqYzEzLngqYzIzLnggKyA2KmMxMC54KmMyMS54KmMxMy54KmMxM3kyKmMyMy55ICsgNipjMTAueCpjMTMueCpjMjEueSpjMTN5MipjMjMueCArXHJcbiAgICAgICAgICAgIDYqYzEwLngqYzEzLngqYzIyLngqYzEzeTIqYzIyLnkgKyA2KmMxMC55KmMyMS54KmMxMy54KmMxM3kyKmMyMy54IC0gMypjMTEueCpjMTIueCpjMjEueCpjMTN5MipjMjMueSAtXHJcbiAgICAgICAgICAgIDMqYzExLngqYzEyLngqYzIxLnkqYzEzeTIqYzIzLnggLSAzKmMxMS54KmMxMi54KmMyMi54KmMxM3kyKmMyMi55ICsgMipjMTEueCpjMjEueCpjMTIueSpjMTN5MipjMjMueCArXHJcbiAgICAgICAgICAgIDQqYzExLnkqYzEyLngqYzIxLngqYzEzeTIqYzIzLnggLSA2KmMxMC55KmMyMS54KmMxM3gyKmMxMy55KmMyMy55IC0gNipjMTAueSpjMTN4MipjMjEueSpjMTMueSpjMjMueCAtXHJcbiAgICAgICAgICAgIDYqYzEwLnkqYzEzeDIqYzIyLngqYzEzLnkqYzIyLnkgLSA2KmMyMC54KmMyMS54KmMxMy54KmMxM3kyKmMyMy55IC0gNipjMjAueCpjMTMueCpjMjEueSpjMTN5MipjMjMueCAtXHJcbiAgICAgICAgICAgIDYqYzIwLngqYzEzLngqYzIyLngqYzEzeTIqYzIyLnkgKyAzKmMxMS55KmMyMS54KmMxMi55KmMxM3gyKmMyMy55IC0gMypjMTEueSpjMTIueSpjMTMueCpjMjJ4MipjMTMueSArXHJcbiAgICAgICAgICAgIDMqYzExLnkqYzEyLnkqYzEzeDIqYzIxLnkqYzIzLnggKyAzKmMxMS55KmMxMi55KmMxM3gyKmMyMi54KmMyMi55IC0gMipjMTIueCpjMjEueCpjMTJ5MipjMTMueCpjMjMueSAtXHJcbiAgICAgICAgICAgIDIqYzEyLngqYzIxLngqYzEyeTIqYzEzLnkqYzIzLnggLSAyKmMxMi54KmMxMnkyKmMxMy54KmMyMS55KmMyMy54IC0gMipjMTIueCpjMTJ5MipjMTMueCpjMjIueCpjMjIueSAtXHJcbiAgICAgICAgICAgIDYqYzIwLnkqYzIxLngqYzEzLngqYzEzeTIqYzIzLnggLSA2KmMyMS54KmMxMy54KmMyMS55KmMyMi54KmMxM3kyICsgNipjMjAueSpjMTN4MipjMjEueSpjMTMueSpjMjMueCArXHJcbiAgICAgICAgICAgIDIqYzEyeDIqYzIxLngqYzEyLnkqYzEzLnkqYzIzLnkgKyAyKmMxMngyKmMxMi55KmMyMS55KmMxMy55KmMyMy54ICsgMipjMTJ4MipjMTIueSpjMjIueCpjMTMueSpjMjIueSAtXHJcbiAgICAgICAgICAgIDMqYzEwLngqYzIyeDIqYzEzeTMgKyAzKmMyMC54KmMyMngyKmMxM3kzICsgMypjMjF4MipjMjIueCpjMTN5MyArIGMxMnkzKmMxMy54KmMyMngyICtcclxuICAgICAgICAgICAgMypjMTAueSpjMTMueCpjMjJ4MipjMTN5MiArIGMxMS54KmMxMi55KmMyMngyKmMxM3kyICsgMipjMTEueSpjMTIueCpjMjJ4MipjMTN5MiAtXHJcbiAgICAgICAgICAgIGMxMi54KmMxMnkyKmMyMngyKmMxMy55IC0gMypjMjAueSpjMTMueCpjMjJ4MipjMTN5MiAtIDMqYzIxeDIqYzEzLngqYzEzeTIqYzIyLnkgK1xyXG4gICAgICAgICAgICBjMTJ4MipjMTIueSpjMTMueCooMipjMjEueSpjMjMueSArIGMyMnkyKSArIGMxMS54KmMxMi54KmMxMy54KmMxMy55Kig2KmMyMS55KmMyMy55ICsgMypjMjJ5MikgK1xyXG4gICAgICAgICAgICBjMjEueCpjMTN4MipjMTMueSooNipjMjAueSpjMjMueSArIDYqYzIxLnkqYzIyLnkpICsgYzEyeDMqYzEzLnkqKC0yKmMyMS55KmMyMy55IC0gYzIyeTIpICtcclxuICAgICAgICAgICAgYzEwLnkqYzEzeDMqKDYqYzIxLnkqYzIzLnkgKyAzKmMyMnkyKSArIGMxMS55KmMxMi54KmMxM3gyKigtMipjMjEueSpjMjMueSAtIGMyMnkyKSArXHJcbiAgICAgICAgICAgIGMxMS54KmMxMi55KmMxM3gyKigtNCpjMjEueSpjMjMueSAtIDIqYzIyeTIpICsgYzEwLngqYzEzeDIqYzEzLnkqKC02KmMyMS55KmMyMy55IC0gMypjMjJ5MikgK1xyXG4gICAgICAgICAgICBjMTN4MipjMjIueCpjMTMueSooNipjMjAueSpjMjIueSArIDMqYzIxeTIpICsgYzIwLngqYzEzeDIqYzEzLnkqKDYqYzIxLnkqYzIzLnkgKyAzKmMyMnkyKSArXHJcbiAgICAgICAgICAgIGMxM3gzKigtMipjMjAueSpjMjEueSpjMjMueSAtIGMyMi55KigyKmMyMC55KmMyMi55ICsgYzIxeTIpIC0gYzIwLnkqKDIqYzIxLnkqYzIzLnkgKyBjMjJ5MikgLVxyXG4gICAgICAgICAgICBjMjEueSooMipjMjAueSpjMjMueSArIDIqYzIxLnkqYzIyLnkpKSxcclxuICAgICAgICAtYzEwLngqYzExLngqYzEyLnkqYzEzLngqYzEzLnkqYzIzLnkgKyBjMTAueCpjMTEueSpjMTIueCpjMTMueCpjMTMueSpjMjMueSArIDYqYzEwLngqYzExLnkqYzEyLnkqYzEzLngqYzEzLnkqYzIzLnggLVxyXG4gICAgICAgICAgICA2KmMxMC55KmMxMS54KmMxMi54KmMxMy54KmMxMy55KmMyMy55IC0gYzEwLnkqYzExLngqYzEyLnkqYzEzLngqYzEzLnkqYzIzLnggKyBjMTAueSpjMTEueSpjMTIueCpjMTMueCpjMTMueSpjMjMueCArXHJcbiAgICAgICAgICAgIGMxMS54KmMxMS55KmMxMi54KmMxMi55KmMxMy54KmMyMy55IC0gYzExLngqYzExLnkqYzEyLngqYzEyLnkqYzEzLnkqYzIzLnggKyBjMTEueCpjMjAueCpjMTIueSpjMTMueCpjMTMueSpjMjMueSArXHJcbiAgICAgICAgICAgIGMxMS54KmMyMC55KmMxMi55KmMxMy54KmMxMy55KmMyMy54ICsgYzExLngqYzIxLngqYzEyLnkqYzEzLngqYzEzLnkqYzIyLnkgKyBjMTEueCpjMTIueSpjMTMueCpjMjEueSpjMjIueCpjMTMueSAtXHJcbiAgICAgICAgICAgIGMyMC54KmMxMS55KmMxMi54KmMxMy54KmMxMy55KmMyMy55IC0gNipjMjAueCpjMTEueSpjMTIueSpjMTMueCpjMTMueSpjMjMueCAtIGMxMS55KmMxMi54KmMyMC55KmMxMy54KmMxMy55KmMyMy54IC1cclxuICAgICAgICAgICAgYzExLnkqYzEyLngqYzIxLngqYzEzLngqYzEzLnkqYzIyLnkgLSBjMTEueSpjMTIueCpjMTMueCpjMjEueSpjMjIueCpjMTMueSAtIDYqYzExLnkqYzIxLngqYzEyLnkqYzEzLngqYzIyLngqYzEzLnkgLVxyXG4gICAgICAgICAgICA2KmMxMC54KmMyMC54KmMxM3kzKmMyMy54IC0gNipjMTAueCpjMjEueCpjMjIueCpjMTN5MyAtIDIqYzEwLngqYzEyeTMqYzEzLngqYzIzLnggKyA2KmMyMC54KmMyMS54KmMyMi54KmMxM3kzICtcclxuICAgICAgICAgICAgMipjMjAueCpjMTJ5MypjMTMueCpjMjMueCArIDIqYzIxLngqYzEyeTMqYzEzLngqYzIyLnggKyAyKmMxMC55KmMxMngzKmMxMy55KmMyMy55IC0gNipjMTAueCpjMTAueSpjMTMueCpjMTN5MipjMjMueCArXHJcbiAgICAgICAgICAgIDMqYzEwLngqYzExLngqYzEyLngqYzEzeTIqYzIzLnkgLSAyKmMxMC54KmMxMS54KmMxMi55KmMxM3kyKmMyMy54IC0gNCpjMTAueCpjMTEueSpjMTIueCpjMTN5MipjMjMueCArXHJcbiAgICAgICAgICAgIDMqYzEwLnkqYzExLngqYzEyLngqYzEzeTIqYzIzLnggKyA2KmMxMC54KmMxMC55KmMxM3gyKmMxMy55KmMyMy55ICsgNipjMTAueCpjMjAueCpjMTMueCpjMTN5MipjMjMueSAtXHJcbiAgICAgICAgICAgIDMqYzEwLngqYzExLnkqYzEyLnkqYzEzeDIqYzIzLnkgKyAyKmMxMC54KmMxMi54KmMxMnkyKmMxMy54KmMyMy55ICsgMipjMTAueCpjMTIueCpjMTJ5MipjMTMueSpjMjMueCArXHJcbiAgICAgICAgICAgIDYqYzEwLngqYzIwLnkqYzEzLngqYzEzeTIqYzIzLnggKyA2KmMxMC54KmMyMS54KmMxMy54KmMxM3kyKmMyMi55ICsgNipjMTAueCpjMTMueCpjMjEueSpjMjIueCpjMTN5MiArXHJcbiAgICAgICAgICAgIDQqYzEwLnkqYzExLngqYzEyLnkqYzEzeDIqYzIzLnkgKyA2KmMxMC55KmMyMC54KmMxMy54KmMxM3kyKmMyMy54ICsgMipjMTAueSpjMTEueSpjMTIueCpjMTN4MipjMjMueSAtXHJcbiAgICAgICAgICAgIDMqYzEwLnkqYzExLnkqYzEyLnkqYzEzeDIqYzIzLnggKyAyKmMxMC55KmMxMi54KmMxMnkyKmMxMy54KmMyMy54ICsgNipjMTAueSpjMjEueCpjMTMueCpjMjIueCpjMTN5MiAtXHJcbiAgICAgICAgICAgIDMqYzExLngqYzIwLngqYzEyLngqYzEzeTIqYzIzLnkgKyAyKmMxMS54KmMyMC54KmMxMi55KmMxM3kyKmMyMy54ICsgYzExLngqYzExLnkqYzEyeTIqYzEzLngqYzIzLnggLVxyXG4gICAgICAgICAgICAzKmMxMS54KmMxMi54KmMyMC55KmMxM3kyKmMyMy54IC0gMypjMTEueCpjMTIueCpjMjEueCpjMTN5MipjMjIueSAtIDMqYzExLngqYzEyLngqYzIxLnkqYzIyLngqYzEzeTIgK1xyXG4gICAgICAgICAgICAyKmMxMS54KmMyMS54KmMxMi55KmMyMi54KmMxM3kyICsgNCpjMjAueCpjMTEueSpjMTIueCpjMTN5MipjMjMueCArIDQqYzExLnkqYzEyLngqYzIxLngqYzIyLngqYzEzeTIgLVxyXG4gICAgICAgICAgICAyKmMxMC54KmMxMngyKmMxMi55KmMxMy55KmMyMy55IC0gNipjMTAueSpjMjAueCpjMTN4MipjMTMueSpjMjMueSAtIDYqYzEwLnkqYzIwLnkqYzEzeDIqYzEzLnkqYzIzLnggLVxyXG4gICAgICAgICAgICA2KmMxMC55KmMyMS54KmMxM3gyKmMxMy55KmMyMi55IC0gMipjMTAueSpjMTJ4MipjMTIueSpjMTMueCpjMjMueSAtIDIqYzEwLnkqYzEyeDIqYzEyLnkqYzEzLnkqYzIzLnggLVxyXG4gICAgICAgICAgICA2KmMxMC55KmMxM3gyKmMyMS55KmMyMi54KmMxMy55IC0gYzExLngqYzExLnkqYzEyeDIqYzEzLnkqYzIzLnkgLSAyKmMxMS54KmMxMXkyKmMxMy54KmMxMy55KmMyMy54ICtcclxuICAgICAgICAgICAgMypjMjAueCpjMTEueSpjMTIueSpjMTN4MipjMjMueSAtIDIqYzIwLngqYzEyLngqYzEyeTIqYzEzLngqYzIzLnkgLSAyKmMyMC54KmMxMi54KmMxMnkyKmMxMy55KmMyMy54IC1cclxuICAgICAgICAgICAgNipjMjAueCpjMjAueSpjMTMueCpjMTN5MipjMjMueCAtIDYqYzIwLngqYzIxLngqYzEzLngqYzEzeTIqYzIyLnkgLSA2KmMyMC54KmMxMy54KmMyMS55KmMyMi54KmMxM3kyICtcclxuICAgICAgICAgICAgMypjMTEueSpjMjAueSpjMTIueSpjMTN4MipjMjMueCArIDMqYzExLnkqYzIxLngqYzEyLnkqYzEzeDIqYzIyLnkgKyAzKmMxMS55KmMxMi55KmMxM3gyKmMyMS55KmMyMi54IC1cclxuICAgICAgICAgICAgMipjMTIueCpjMjAueSpjMTJ5MipjMTMueCpjMjMueCAtIDIqYzEyLngqYzIxLngqYzEyeTIqYzEzLngqYzIyLnkgLSAyKmMxMi54KmMyMS54KmMxMnkyKmMyMi54KmMxMy55IC1cclxuICAgICAgICAgICAgMipjMTIueCpjMTJ5MipjMTMueCpjMjEueSpjMjIueCAtIDYqYzIwLnkqYzIxLngqYzEzLngqYzIyLngqYzEzeTIgLSBjMTF5MipjMTIueCpjMTIueSpjMTMueCpjMjMueCArXHJcbiAgICAgICAgICAgIDIqYzIwLngqYzEyeDIqYzEyLnkqYzEzLnkqYzIzLnkgKyA2KmMyMC55KmMxM3gyKmMyMS55KmMyMi54KmMxMy55ICsgMipjMTF4MipjMTEueSpjMTMueCpjMTMueSpjMjMueSArXHJcbiAgICAgICAgICAgIGMxMXgyKmMxMi54KmMxMi55KmMxMy55KmMyMy55ICsgMipjMTJ4MipjMjAueSpjMTIueSpjMTMueSpjMjMueCArIDIqYzEyeDIqYzIxLngqYzEyLnkqYzEzLnkqYzIyLnkgK1xyXG4gICAgICAgICAgICAyKmMxMngyKmMxMi55KmMyMS55KmMyMi54KmMxMy55ICsgYzIxeDMqYzEzeTMgKyAzKmMxMHgyKmMxM3kzKmMyMy54IC0gMypjMTB5MipjMTN4MypjMjMueSArXHJcbiAgICAgICAgICAgIDMqYzIweDIqYzEzeTMqYzIzLnggKyBjMTF5MypjMTN4MipjMjMueCAtIGMxMXgzKmMxM3kyKmMyMy55IC0gYzExLngqYzExeTIqYzEzeDIqYzIzLnkgK1xyXG4gICAgICAgICAgICBjMTF4MipjMTEueSpjMTN5MipjMjMueCAtIDMqYzEweDIqYzEzLngqYzEzeTIqYzIzLnkgKyAzKmMxMHkyKmMxM3gyKmMxMy55KmMyMy54IC0gYzExeDIqYzEyeTIqYzEzLngqYzIzLnkgK1xyXG4gICAgICAgICAgICBjMTF5MipjMTJ4MipjMTMueSpjMjMueCAtIDMqYzIxeDIqYzEzLngqYzIxLnkqYzEzeTIgLSAzKmMyMHgyKmMxMy54KmMxM3kyKmMyMy55ICsgMypjMjB5MipjMTN4MipjMTMueSpjMjMueCArXHJcbiAgICAgICAgICAgIGMxMS54KmMxMi54KmMxMy54KmMxMy55Kig2KmMyMC55KmMyMy55ICsgNipjMjEueSpjMjIueSkgKyBjMTJ4MypjMTMueSooLTIqYzIwLnkqYzIzLnkgLSAyKmMyMS55KmMyMi55KSArXHJcbiAgICAgICAgICAgIGMxMC55KmMxM3gzKig2KmMyMC55KmMyMy55ICsgNipjMjEueSpjMjIueSkgKyBjMTEueSpjMTIueCpjMTN4MiooLTIqYzIwLnkqYzIzLnkgLSAyKmMyMS55KmMyMi55KSArXHJcbiAgICAgICAgICAgIGMxMngyKmMxMi55KmMxMy54KigyKmMyMC55KmMyMy55ICsgMipjMjEueSpjMjIueSkgKyBjMTEueCpjMTIueSpjMTN4MiooLTQqYzIwLnkqYzIzLnkgLSA0KmMyMS55KmMyMi55KSArXHJcbiAgICAgICAgICAgIGMxMC54KmMxM3gyKmMxMy55KigtNipjMjAueSpjMjMueSAtIDYqYzIxLnkqYzIyLnkpICsgYzIwLngqYzEzeDIqYzEzLnkqKDYqYzIwLnkqYzIzLnkgKyA2KmMyMS55KmMyMi55KSArXHJcbiAgICAgICAgICAgIGMyMS54KmMxM3gyKmMxMy55Kig2KmMyMC55KmMyMi55ICsgMypjMjF5MikgKyBjMTN4MyooLTIqYzIwLnkqYzIxLnkqYzIyLnkgLSBjMjB5MipjMjMueSAtXHJcbiAgICAgICAgICAgIGMyMS55KigyKmMyMC55KmMyMi55ICsgYzIxeTIpIC0gYzIwLnkqKDIqYzIwLnkqYzIzLnkgKyAyKmMyMS55KmMyMi55KSksXHJcbiAgICAgICAgLWMxMC54KmMxMS54KmMxMi55KmMxMy54KmMxMy55KmMyMi55ICsgYzEwLngqYzExLnkqYzEyLngqYzEzLngqYzEzLnkqYzIyLnkgKyA2KmMxMC54KmMxMS55KmMxMi55KmMxMy54KmMyMi54KmMxMy55IC1cclxuICAgICAgICAgICAgNipjMTAueSpjMTEueCpjMTIueCpjMTMueCpjMTMueSpjMjIueSAtIGMxMC55KmMxMS54KmMxMi55KmMxMy54KmMyMi54KmMxMy55ICsgYzEwLnkqYzExLnkqYzEyLngqYzEzLngqYzIyLngqYzEzLnkgK1xyXG4gICAgICAgICAgICBjMTEueCpjMTEueSpjMTIueCpjMTIueSpjMTMueCpjMjIueSAtIGMxMS54KmMxMS55KmMxMi54KmMxMi55KmMyMi54KmMxMy55ICsgYzExLngqYzIwLngqYzEyLnkqYzEzLngqYzEzLnkqYzIyLnkgK1xyXG4gICAgICAgICAgICBjMTEueCpjMjAueSpjMTIueSpjMTMueCpjMjIueCpjMTMueSArIGMxMS54KmMyMS54KmMxMi55KmMxMy54KmMyMS55KmMxMy55IC0gYzIwLngqYzExLnkqYzEyLngqYzEzLngqYzEzLnkqYzIyLnkgLVxyXG4gICAgICAgICAgICA2KmMyMC54KmMxMS55KmMxMi55KmMxMy54KmMyMi54KmMxMy55IC0gYzExLnkqYzEyLngqYzIwLnkqYzEzLngqYzIyLngqYzEzLnkgLSBjMTEueSpjMTIueCpjMjEueCpjMTMueCpjMjEueSpjMTMueSAtXHJcbiAgICAgICAgICAgIDYqYzEwLngqYzIwLngqYzIyLngqYzEzeTMgLSAyKmMxMC54KmMxMnkzKmMxMy54KmMyMi54ICsgMipjMjAueCpjMTJ5MypjMTMueCpjMjIueCArIDIqYzEwLnkqYzEyeDMqYzEzLnkqYzIyLnkgLVxyXG4gICAgICAgICAgICA2KmMxMC54KmMxMC55KmMxMy54KmMyMi54KmMxM3kyICsgMypjMTAueCpjMTEueCpjMTIueCpjMTN5MipjMjIueSAtIDIqYzEwLngqYzExLngqYzEyLnkqYzIyLngqYzEzeTIgLVxyXG4gICAgICAgICAgICA0KmMxMC54KmMxMS55KmMxMi54KmMyMi54KmMxM3kyICsgMypjMTAueSpjMTEueCpjMTIueCpjMjIueCpjMTN5MiArIDYqYzEwLngqYzEwLnkqYzEzeDIqYzEzLnkqYzIyLnkgK1xyXG4gICAgICAgICAgICA2KmMxMC54KmMyMC54KmMxMy54KmMxM3kyKmMyMi55IC0gMypjMTAueCpjMTEueSpjMTIueSpjMTN4MipjMjIueSArIDIqYzEwLngqYzEyLngqYzEyeTIqYzEzLngqYzIyLnkgK1xyXG4gICAgICAgICAgICAyKmMxMC54KmMxMi54KmMxMnkyKmMyMi54KmMxMy55ICsgNipjMTAueCpjMjAueSpjMTMueCpjMjIueCpjMTN5MiArIDYqYzEwLngqYzIxLngqYzEzLngqYzIxLnkqYzEzeTIgK1xyXG4gICAgICAgICAgICA0KmMxMC55KmMxMS54KmMxMi55KmMxM3gyKmMyMi55ICsgNipjMTAueSpjMjAueCpjMTMueCpjMjIueCpjMTN5MiArIDIqYzEwLnkqYzExLnkqYzEyLngqYzEzeDIqYzIyLnkgLVxyXG4gICAgICAgICAgICAzKmMxMC55KmMxMS55KmMxMi55KmMxM3gyKmMyMi54ICsgMipjMTAueSpjMTIueCpjMTJ5MipjMTMueCpjMjIueCAtIDMqYzExLngqYzIwLngqYzEyLngqYzEzeTIqYzIyLnkgK1xyXG4gICAgICAgICAgICAyKmMxMS54KmMyMC54KmMxMi55KmMyMi54KmMxM3kyICsgYzExLngqYzExLnkqYzEyeTIqYzEzLngqYzIyLnggLSAzKmMxMS54KmMxMi54KmMyMC55KmMyMi54KmMxM3kyIC1cclxuICAgICAgICAgICAgMypjMTEueCpjMTIueCpjMjEueCpjMjEueSpjMTN5MiArIDQqYzIwLngqYzExLnkqYzEyLngqYzIyLngqYzEzeTIgLSAyKmMxMC54KmMxMngyKmMxMi55KmMxMy55KmMyMi55IC1cclxuICAgICAgICAgICAgNipjMTAueSpjMjAueCpjMTN4MipjMTMueSpjMjIueSAtIDYqYzEwLnkqYzIwLnkqYzEzeDIqYzIyLngqYzEzLnkgLSA2KmMxMC55KmMyMS54KmMxM3gyKmMyMS55KmMxMy55IC1cclxuICAgICAgICAgICAgMipjMTAueSpjMTJ4MipjMTIueSpjMTMueCpjMjIueSAtIDIqYzEwLnkqYzEyeDIqYzEyLnkqYzIyLngqYzEzLnkgLSBjMTEueCpjMTEueSpjMTJ4MipjMTMueSpjMjIueSAtXHJcbiAgICAgICAgICAgIDIqYzExLngqYzExeTIqYzEzLngqYzIyLngqYzEzLnkgKyAzKmMyMC54KmMxMS55KmMxMi55KmMxM3gyKmMyMi55IC0gMipjMjAueCpjMTIueCpjMTJ5MipjMTMueCpjMjIueSAtXHJcbiAgICAgICAgICAgIDIqYzIwLngqYzEyLngqYzEyeTIqYzIyLngqYzEzLnkgLSA2KmMyMC54KmMyMC55KmMxMy54KmMyMi54KmMxM3kyIC0gNipjMjAueCpjMjEueCpjMTMueCpjMjEueSpjMTN5MiArXHJcbiAgICAgICAgICAgIDMqYzExLnkqYzIwLnkqYzEyLnkqYzEzeDIqYzIyLnggKyAzKmMxMS55KmMyMS54KmMxMi55KmMxM3gyKmMyMS55IC0gMipjMTIueCpjMjAueSpjMTJ5MipjMTMueCpjMjIueCAtXHJcbiAgICAgICAgICAgIDIqYzEyLngqYzIxLngqYzEyeTIqYzEzLngqYzIxLnkgLSBjMTF5MipjMTIueCpjMTIueSpjMTMueCpjMjIueCArIDIqYzIwLngqYzEyeDIqYzEyLnkqYzEzLnkqYzIyLnkgLVxyXG4gICAgICAgICAgICAzKmMxMS55KmMyMXgyKmMxMi55KmMxMy54KmMxMy55ICsgNipjMjAueSpjMjEueCpjMTN4MipjMjEueSpjMTMueSArIDIqYzExeDIqYzExLnkqYzEzLngqYzEzLnkqYzIyLnkgK1xyXG4gICAgICAgICAgICBjMTF4MipjMTIueCpjMTIueSpjMTMueSpjMjIueSArIDIqYzEyeDIqYzIwLnkqYzEyLnkqYzIyLngqYzEzLnkgKyAyKmMxMngyKmMyMS54KmMxMi55KmMyMS55KmMxMy55IC1cclxuICAgICAgICAgICAgMypjMTAueCpjMjF4MipjMTN5MyArIDMqYzIwLngqYzIxeDIqYzEzeTMgKyAzKmMxMHgyKmMyMi54KmMxM3kzIC0gMypjMTB5MipjMTN4MypjMjIueSArIDMqYzIweDIqYzIyLngqYzEzeTMgK1xyXG4gICAgICAgICAgICBjMjF4MipjMTJ5MypjMTMueCArIGMxMXkzKmMxM3gyKmMyMi54IC0gYzExeDMqYzEzeTIqYzIyLnkgKyAzKmMxMC55KmMyMXgyKmMxMy54KmMxM3kyIC1cclxuICAgICAgICAgICAgYzExLngqYzExeTIqYzEzeDIqYzIyLnkgKyBjMTEueCpjMjF4MipjMTIueSpjMTN5MiArIDIqYzExLnkqYzEyLngqYzIxeDIqYzEzeTIgKyBjMTF4MipjMTEueSpjMjIueCpjMTN5MiAtXHJcbiAgICAgICAgICAgIGMxMi54KmMyMXgyKmMxMnkyKmMxMy55IC0gMypjMjAueSpjMjF4MipjMTMueCpjMTN5MiAtIDMqYzEweDIqYzEzLngqYzEzeTIqYzIyLnkgKyAzKmMxMHkyKmMxM3gyKmMyMi54KmMxMy55IC1cclxuICAgICAgICAgICAgYzExeDIqYzEyeTIqYzEzLngqYzIyLnkgKyBjMTF5MipjMTJ4MipjMjIueCpjMTMueSAtIDMqYzIweDIqYzEzLngqYzEzeTIqYzIyLnkgKyAzKmMyMHkyKmMxM3gyKmMyMi54KmMxMy55ICtcclxuICAgICAgICAgICAgYzEyeDIqYzEyLnkqYzEzLngqKDIqYzIwLnkqYzIyLnkgKyBjMjF5MikgKyBjMTEueCpjMTIueCpjMTMueCpjMTMueSooNipjMjAueSpjMjIueSArIDMqYzIxeTIpICtcclxuICAgICAgICAgICAgYzEyeDMqYzEzLnkqKC0yKmMyMC55KmMyMi55IC0gYzIxeTIpICsgYzEwLnkqYzEzeDMqKDYqYzIwLnkqYzIyLnkgKyAzKmMyMXkyKSArXHJcbiAgICAgICAgICAgIGMxMS55KmMxMi54KmMxM3gyKigtMipjMjAueSpjMjIueSAtIGMyMXkyKSArIGMxMS54KmMxMi55KmMxM3gyKigtNCpjMjAueSpjMjIueSAtIDIqYzIxeTIpICtcclxuICAgICAgICAgICAgYzEwLngqYzEzeDIqYzEzLnkqKC02KmMyMC55KmMyMi55IC0gMypjMjF5MikgKyBjMjAueCpjMTN4MipjMTMueSooNipjMjAueSpjMjIueSArIDMqYzIxeTIpICtcclxuICAgICAgICAgICAgYzEzeDMqKC0yKmMyMC55KmMyMXkyIC0gYzIweTIqYzIyLnkgLSBjMjAueSooMipjMjAueSpjMjIueSArIGMyMXkyKSksXHJcbiAgICAgICAgLWMxMC54KmMxMS54KmMxMi55KmMxMy54KmMyMS55KmMxMy55ICsgYzEwLngqYzExLnkqYzEyLngqYzEzLngqYzIxLnkqYzEzLnkgKyA2KmMxMC54KmMxMS55KmMyMS54KmMxMi55KmMxMy54KmMxMy55IC1cclxuICAgICAgICAgICAgNipjMTAueSpjMTEueCpjMTIueCpjMTMueCpjMjEueSpjMTMueSAtIGMxMC55KmMxMS54KmMyMS54KmMxMi55KmMxMy54KmMxMy55ICsgYzEwLnkqYzExLnkqYzEyLngqYzIxLngqYzEzLngqYzEzLnkgLVxyXG4gICAgICAgICAgICBjMTEueCpjMTEueSpjMTIueCpjMjEueCpjMTIueSpjMTMueSArIGMxMS54KmMxMS55KmMxMi54KmMxMi55KmMxMy54KmMyMS55ICsgYzExLngqYzIwLngqYzEyLnkqYzEzLngqYzIxLnkqYzEzLnkgK1xyXG4gICAgICAgICAgICA2KmMxMS54KmMxMi54KmMyMC55KmMxMy54KmMyMS55KmMxMy55ICsgYzExLngqYzIwLnkqYzIxLngqYzEyLnkqYzEzLngqYzEzLnkgLSBjMjAueCpjMTEueSpjMTIueCpjMTMueCpjMjEueSpjMTMueSAtXHJcbiAgICAgICAgICAgIDYqYzIwLngqYzExLnkqYzIxLngqYzEyLnkqYzEzLngqYzEzLnkgLSBjMTEueSpjMTIueCpjMjAueSpjMjEueCpjMTMueCpjMTMueSAtIDYqYzEwLngqYzIwLngqYzIxLngqYzEzeTMgLVxyXG4gICAgICAgICAgICAyKmMxMC54KmMyMS54KmMxMnkzKmMxMy54ICsgNipjMTAueSpjMjAueSpjMTN4MypjMjEueSArIDIqYzIwLngqYzIxLngqYzEyeTMqYzEzLnggKyAyKmMxMC55KmMxMngzKmMyMS55KmMxMy55IC1cclxuICAgICAgICAgICAgMipjMTJ4MypjMjAueSpjMjEueSpjMTMueSAtIDYqYzEwLngqYzEwLnkqYzIxLngqYzEzLngqYzEzeTIgKyAzKmMxMC54KmMxMS54KmMxMi54KmMyMS55KmMxM3kyIC1cclxuICAgICAgICAgICAgMipjMTAueCpjMTEueCpjMjEueCpjMTIueSpjMTN5MiAtIDQqYzEwLngqYzExLnkqYzEyLngqYzIxLngqYzEzeTIgKyAzKmMxMC55KmMxMS54KmMxMi54KmMyMS54KmMxM3kyICtcclxuICAgICAgICAgICAgNipjMTAueCpjMTAueSpjMTN4MipjMjEueSpjMTMueSArIDYqYzEwLngqYzIwLngqYzEzLngqYzIxLnkqYzEzeTIgLSAzKmMxMC54KmMxMS55KmMxMi55KmMxM3gyKmMyMS55ICtcclxuICAgICAgICAgICAgMipjMTAueCpjMTIueCpjMjEueCpjMTJ5MipjMTMueSArIDIqYzEwLngqYzEyLngqYzEyeTIqYzEzLngqYzIxLnkgKyA2KmMxMC54KmMyMC55KmMyMS54KmMxMy54KmMxM3kyICtcclxuICAgICAgICAgICAgNCpjMTAueSpjMTEueCpjMTIueSpjMTN4MipjMjEueSArIDYqYzEwLnkqYzIwLngqYzIxLngqYzEzLngqYzEzeTIgKyAyKmMxMC55KmMxMS55KmMxMi54KmMxM3gyKmMyMS55IC1cclxuICAgICAgICAgICAgMypjMTAueSpjMTEueSpjMjEueCpjMTIueSpjMTN4MiArIDIqYzEwLnkqYzEyLngqYzIxLngqYzEyeTIqYzEzLnggLSAzKmMxMS54KmMyMC54KmMxMi54KmMyMS55KmMxM3kyICtcclxuICAgICAgICAgICAgMipjMTEueCpjMjAueCpjMjEueCpjMTIueSpjMTN5MiArIGMxMS54KmMxMS55KmMyMS54KmMxMnkyKmMxMy54IC0gMypjMTEueCpjMTIueCpjMjAueSpjMjEueCpjMTN5MiArXHJcbiAgICAgICAgICAgIDQqYzIwLngqYzExLnkqYzEyLngqYzIxLngqYzEzeTIgLSA2KmMxMC54KmMyMC55KmMxM3gyKmMyMS55KmMxMy55IC0gMipjMTAueCpjMTJ4MipjMTIueSpjMjEueSpjMTMueSAtXHJcbiAgICAgICAgICAgIDYqYzEwLnkqYzIwLngqYzEzeDIqYzIxLnkqYzEzLnkgLSA2KmMxMC55KmMyMC55KmMyMS54KmMxM3gyKmMxMy55IC0gMipjMTAueSpjMTJ4MipjMjEueCpjMTIueSpjMTMueSAtXHJcbiAgICAgICAgICAgIDIqYzEwLnkqYzEyeDIqYzEyLnkqYzEzLngqYzIxLnkgLSBjMTEueCpjMTEueSpjMTJ4MipjMjEueSpjMTMueSAtIDQqYzExLngqYzIwLnkqYzEyLnkqYzEzeDIqYzIxLnkgLVxyXG4gICAgICAgICAgICAyKmMxMS54KmMxMXkyKmMyMS54KmMxMy54KmMxMy55ICsgMypjMjAueCpjMTEueSpjMTIueSpjMTN4MipjMjEueSAtIDIqYzIwLngqYzEyLngqYzIxLngqYzEyeTIqYzEzLnkgLVxyXG4gICAgICAgICAgICAyKmMyMC54KmMxMi54KmMxMnkyKmMxMy54KmMyMS55IC0gNipjMjAueCpjMjAueSpjMjEueCpjMTMueCpjMTN5MiAtIDIqYzExLnkqYzEyLngqYzIwLnkqYzEzeDIqYzIxLnkgK1xyXG4gICAgICAgICAgICAzKmMxMS55KmMyMC55KmMyMS54KmMxMi55KmMxM3gyIC0gMipjMTIueCpjMjAueSpjMjEueCpjMTJ5MipjMTMueCAtIGMxMXkyKmMxMi54KmMyMS54KmMxMi55KmMxMy54ICtcclxuICAgICAgICAgICAgNipjMjAueCpjMjAueSpjMTN4MipjMjEueSpjMTMueSArIDIqYzIwLngqYzEyeDIqYzEyLnkqYzIxLnkqYzEzLnkgKyAyKmMxMXgyKmMxMS55KmMxMy54KmMyMS55KmMxMy55ICtcclxuICAgICAgICAgICAgYzExeDIqYzEyLngqYzEyLnkqYzIxLnkqYzEzLnkgKyAyKmMxMngyKmMyMC55KmMyMS54KmMxMi55KmMxMy55ICsgMipjMTJ4MipjMjAueSpjMTIueSpjMTMueCpjMjEueSArXHJcbiAgICAgICAgICAgIDMqYzEweDIqYzIxLngqYzEzeTMgLSAzKmMxMHkyKmMxM3gzKmMyMS55ICsgMypjMjB4MipjMjEueCpjMTN5MyArIGMxMXkzKmMyMS54KmMxM3gyIC0gYzExeDMqYzIxLnkqYzEzeTIgLVxyXG4gICAgICAgICAgICAzKmMyMHkyKmMxM3gzKmMyMS55IC0gYzExLngqYzExeTIqYzEzeDIqYzIxLnkgKyBjMTF4MipjMTEueSpjMjEueCpjMTN5MiAtIDMqYzEweDIqYzEzLngqYzIxLnkqYzEzeTIgK1xyXG4gICAgICAgICAgICAzKmMxMHkyKmMyMS54KmMxM3gyKmMxMy55IC0gYzExeDIqYzEyeTIqYzEzLngqYzIxLnkgKyBjMTF5MipjMTJ4MipjMjEueCpjMTMueSAtIDMqYzIweDIqYzEzLngqYzIxLnkqYzEzeTIgK1xyXG4gICAgICAgICAgICAzKmMyMHkyKmMyMS54KmMxM3gyKmMxMy55LFxyXG4gICAgICAgIGMxMC54KmMxMC55KmMxMS54KmMxMi55KmMxMy54KmMxMy55IC0gYzEwLngqYzEwLnkqYzExLnkqYzEyLngqYzEzLngqYzEzLnkgKyBjMTAueCpjMTEueCpjMTEueSpjMTIueCpjMTIueSpjMTMueSAtXHJcbiAgICAgICAgICAgIGMxMC55KmMxMS54KmMxMS55KmMxMi54KmMxMi55KmMxMy54IC0gYzEwLngqYzExLngqYzIwLnkqYzEyLnkqYzEzLngqYzEzLnkgKyA2KmMxMC54KmMyMC54KmMxMS55KmMxMi55KmMxMy54KmMxMy55ICtcclxuICAgICAgICAgICAgYzEwLngqYzExLnkqYzEyLngqYzIwLnkqYzEzLngqYzEzLnkgLSBjMTAueSpjMTEueCpjMjAueCpjMTIueSpjMTMueCpjMTMueSAtIDYqYzEwLnkqYzExLngqYzEyLngqYzIwLnkqYzEzLngqYzEzLnkgK1xyXG4gICAgICAgICAgICBjMTAueSpjMjAueCpjMTEueSpjMTIueCpjMTMueCpjMTMueSAtIGMxMS54KmMyMC54KmMxMS55KmMxMi54KmMxMi55KmMxMy55ICsgYzExLngqYzExLnkqYzEyLngqYzIwLnkqYzEyLnkqYzEzLnggK1xyXG4gICAgICAgICAgICBjMTEueCpjMjAueCpjMjAueSpjMTIueSpjMTMueCpjMTMueSAtIGMyMC54KmMxMS55KmMxMi54KmMyMC55KmMxMy54KmMxMy55IC0gMipjMTAueCpjMjAueCpjMTJ5MypjMTMueCArXHJcbiAgICAgICAgICAgIDIqYzEwLnkqYzEyeDMqYzIwLnkqYzEzLnkgLSAzKmMxMC54KmMxMC55KmMxMS54KmMxMi54KmMxM3kyIC0gNipjMTAueCpjMTAueSpjMjAueCpjMTMueCpjMTN5MiArXHJcbiAgICAgICAgICAgIDMqYzEwLngqYzEwLnkqYzExLnkqYzEyLnkqYzEzeDIgLSAyKmMxMC54KmMxMC55KmMxMi54KmMxMnkyKmMxMy54IC0gMipjMTAueCpjMTEueCpjMjAueCpjMTIueSpjMTN5MiAtXHJcbiAgICAgICAgICAgIGMxMC54KmMxMS54KmMxMS55KmMxMnkyKmMxMy54ICsgMypjMTAueCpjMTEueCpjMTIueCpjMjAueSpjMTN5MiAtIDQqYzEwLngqYzIwLngqYzExLnkqYzEyLngqYzEzeTIgK1xyXG4gICAgICAgICAgICAzKmMxMC55KmMxMS54KmMyMC54KmMxMi54KmMxM3kyICsgNipjMTAueCpjMTAueSpjMjAueSpjMTN4MipjMTMueSArIDIqYzEwLngqYzEwLnkqYzEyeDIqYzEyLnkqYzEzLnkgK1xyXG4gICAgICAgICAgICAyKmMxMC54KmMxMS54KmMxMXkyKmMxMy54KmMxMy55ICsgMipjMTAueCpjMjAueCpjMTIueCpjMTJ5MipjMTMueSArIDYqYzEwLngqYzIwLngqYzIwLnkqYzEzLngqYzEzeTIgLVxyXG4gICAgICAgICAgICAzKmMxMC54KmMxMS55KmMyMC55KmMxMi55KmMxM3gyICsgMipjMTAueCpjMTIueCpjMjAueSpjMTJ5MipjMTMueCArIGMxMC54KmMxMXkyKmMxMi54KmMxMi55KmMxMy54ICtcclxuICAgICAgICAgICAgYzEwLnkqYzExLngqYzExLnkqYzEyeDIqYzEzLnkgKyA0KmMxMC55KmMxMS54KmMyMC55KmMxMi55KmMxM3gyIC0gMypjMTAueSpjMjAueCpjMTEueSpjMTIueSpjMTN4MiArXHJcbiAgICAgICAgICAgIDIqYzEwLnkqYzIwLngqYzEyLngqYzEyeTIqYzEzLnggKyAyKmMxMC55KmMxMS55KmMxMi54KmMyMC55KmMxM3gyICsgYzExLngqYzIwLngqYzExLnkqYzEyeTIqYzEzLnggLVxyXG4gICAgICAgICAgICAzKmMxMS54KmMyMC54KmMxMi54KmMyMC55KmMxM3kyIC0gMipjMTAueCpjMTJ4MipjMjAueSpjMTIueSpjMTMueSAtIDYqYzEwLnkqYzIwLngqYzIwLnkqYzEzeDIqYzEzLnkgLVxyXG4gICAgICAgICAgICAyKmMxMC55KmMyMC54KmMxMngyKmMxMi55KmMxMy55IC0gMipjMTAueSpjMTF4MipjMTEueSpjMTMueCpjMTMueSAtIGMxMC55KmMxMXgyKmMxMi54KmMxMi55KmMxMy55IC1cclxuICAgICAgICAgICAgMipjMTAueSpjMTJ4MipjMjAueSpjMTIueSpjMTMueCAtIDIqYzExLngqYzIwLngqYzExeTIqYzEzLngqYzEzLnkgLSBjMTEueCpjMTEueSpjMTJ4MipjMjAueSpjMTMueSArXHJcbiAgICAgICAgICAgIDMqYzIwLngqYzExLnkqYzIwLnkqYzEyLnkqYzEzeDIgLSAyKmMyMC54KmMxMi54KmMyMC55KmMxMnkyKmMxMy54IC0gYzIwLngqYzExeTIqYzEyLngqYzEyLnkqYzEzLnggK1xyXG4gICAgICAgICAgICAzKmMxMHkyKmMxMS54KmMxMi54KmMxMy54KmMxMy55ICsgMypjMTEueCpjMTIueCpjMjB5MipjMTMueCpjMTMueSArIDIqYzIwLngqYzEyeDIqYzIwLnkqYzEyLnkqYzEzLnkgLVxyXG4gICAgICAgICAgICAzKmMxMHgyKmMxMS55KmMxMi55KmMxMy54KmMxMy55ICsgMipjMTF4MipjMTEueSpjMjAueSpjMTMueCpjMTMueSArIGMxMXgyKmMxMi54KmMyMC55KmMxMi55KmMxMy55IC1cclxuICAgICAgICAgICAgMypjMjB4MipjMTEueSpjMTIueSpjMTMueCpjMTMueSAtIGMxMHgzKmMxM3kzICsgYzEweTMqYzEzeDMgKyBjMjB4MypjMTN5MyAtIGMyMHkzKmMxM3gzIC1cclxuICAgICAgICAgICAgMypjMTAueCpjMjB4MipjMTN5MyAtIGMxMC54KmMxMXkzKmMxM3gyICsgMypjMTB4MipjMjAueCpjMTN5MyArIGMxMC55KmMxMXgzKmMxM3kyICtcclxuICAgICAgICAgICAgMypjMTAueSpjMjB5MipjMTN4MyArIGMyMC54KmMxMXkzKmMxM3gyICsgYzEweDIqYzEyeTMqYzEzLnggLSAzKmMxMHkyKmMyMC55KmMxM3gzIC0gYzEweTIqYzEyeDMqYzEzLnkgK1xyXG4gICAgICAgICAgICBjMjB4MipjMTJ5MypjMTMueCAtIGMxMXgzKmMyMC55KmMxM3kyIC0gYzEyeDMqYzIweTIqYzEzLnkgLSBjMTAueCpjMTF4MipjMTEueSpjMTN5MiArXHJcbiAgICAgICAgICAgIGMxMC55KmMxMS54KmMxMXkyKmMxM3gyIC0gMypjMTAueCpjMTB5MipjMTN4MipjMTMueSAtIGMxMC54KmMxMXkyKmMxMngyKmMxMy55ICsgYzEwLnkqYzExeDIqYzEyeTIqYzEzLnggLVxyXG4gICAgICAgICAgICBjMTEueCpjMTF5MipjMjAueSpjMTN4MiArIDMqYzEweDIqYzEwLnkqYzEzLngqYzEzeTIgKyBjMTB4MipjMTEueCpjMTIueSpjMTN5MiArXHJcbiAgICAgICAgICAgIDIqYzEweDIqYzExLnkqYzEyLngqYzEzeTIgLSAyKmMxMHkyKmMxMS54KmMxMi55KmMxM3gyIC0gYzEweTIqYzExLnkqYzEyLngqYzEzeDIgKyBjMTF4MipjMjAueCpjMTEueSpjMTN5MiAtXHJcbiAgICAgICAgICAgIDMqYzEwLngqYzIweTIqYzEzeDIqYzEzLnkgKyAzKmMxMC55KmMyMHgyKmMxMy54KmMxM3kyICsgYzExLngqYzIweDIqYzEyLnkqYzEzeTIgLSAyKmMxMS54KmMyMHkyKmMxMi55KmMxM3gyICtcclxuICAgICAgICAgICAgYzIwLngqYzExeTIqYzEyeDIqYzEzLnkgLSBjMTEueSpjMTIueCpjMjB5MipjMTN4MiAtIGMxMHgyKmMxMi54KmMxMnkyKmMxMy55IC0gMypjMTB4MipjMjAueSpjMTMueCpjMTN5MiArXHJcbiAgICAgICAgICAgIDMqYzEweTIqYzIwLngqYzEzeDIqYzEzLnkgKyBjMTB5MipjMTJ4MipjMTIueSpjMTMueCAtIGMxMXgyKmMyMC55KmMxMnkyKmMxMy54ICsgMipjMjB4MipjMTEueSpjMTIueCpjMTN5MiArXHJcbiAgICAgICAgICAgIDMqYzIwLngqYzIweTIqYzEzeDIqYzEzLnkgLSBjMjB4MipjMTIueCpjMTJ5MipjMTMueSAtIDMqYzIweDIqYzIwLnkqYzEzLngqYzEzeTIgKyBjMTJ4MipjMjB5MipjMTIueSpjMTMueFxyXG4gICAgKTtcclxuICAgIHZhciByb290cyA9IHBvbHkuZ2V0Um9vdHNJbkludGVydmFsKDAsMSk7XHJcbiAgICByZW1vdmVNdWx0aXBsZVJvb3RzSW4wMShyb290cyk7XHJcblxyXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgcm9vdHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgdmFyIHMgPSByb290c1tpXTtcclxuICAgICAgICB2YXIgeFJvb3RzID0gbmV3IFBvbHlub21pYWwoXHJcbiAgICAgICAgICAgIGMxMy54LFxyXG4gICAgICAgICAgICBjMTIueCxcclxuICAgICAgICAgICAgYzExLngsXHJcbiAgICAgICAgICAgIGMxMC54IC0gYzIwLnggLSBzKmMyMS54IC0gcypzKmMyMi54IC0gcypzKnMqYzIzLnhcclxuICAgICAgICApLmdldFJvb3RzKCk7XHJcbiAgICAgICAgdmFyIHlSb290cyA9IG5ldyBQb2x5bm9taWFsKFxyXG4gICAgICAgICAgICBjMTMueSxcclxuICAgICAgICAgICAgYzEyLnksXHJcbiAgICAgICAgICAgIGMxMS55LFxyXG4gICAgICAgICAgICBjMTAueSAtIGMyMC55IC0gcypjMjEueSAtIHMqcypjMjIueSAtIHMqcypzKmMyMy55XHJcbiAgICAgICAgKS5nZXRSb290cygpO1xyXG5cclxuICAgICAgICBpZiAoIHhSb290cy5sZW5ndGggPiAwICYmIHlSb290cy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICB2YXIgVE9MRVJBTkNFID0gMWUtNDtcclxuXHJcbiAgICAgICAgICAgIGNoZWNrUm9vdHM6XHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCB4Um9vdHMubGVuZ3RoOyBqKysgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHhSb290ID0geFJvb3RzW2pdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIDAgPD0geFJvb3QgJiYgeFJvb3QgPD0gMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGsgPSAwOyBrIDwgeVJvb3RzLmxlbmd0aDsgaysrICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBNYXRoLmFicyggeFJvb3QgLSB5Um9vdHNba10gKSA8IFRPTEVSQU5DRSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IGMyMy5tdWx0aXBseShzICogcyAqIHMpLmFkZChjMjIubXVsdGlwbHkocyAqIHMpLmFkZChjMjEubXVsdGlwbHkocykuYWRkKGMyMCkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucG9pbnRzLnB1c2gobmV3IFBvaW50MkQodi54LCB2LnkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhayBjaGVja1Jvb3RzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICBpbnRlcnNlY3RCZXppZXIzRWxsaXBzZVxyXG4gKlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwM1xyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwNFxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBlY1xyXG4gKiAgQHBhcmFtIHtOdW1iZXJ9IHJ4XHJcbiAqICBAcGFyYW0ge051bWJlcn0gcnlcclxuICogIEByZXR1cm5zIHtJbnRlcnNlY3Rpb259XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5pbnRlcnNlY3RCZXppZXIzRWxsaXBzZSA9IGZ1bmN0aW9uKHAxLCBwMiwgcDMsIHA0LCBlYywgcngsIHJ5KSB7XHJcbiAgICB2YXIgYSwgYiwgYywgZDsgICAgICAgLy8gdGVtcG9yYXJ5IHZhcmlhYmxlc1xyXG4gICAgdmFyIGMzLCBjMiwgYzEsIGMwOyAgIC8vIGNvZWZmaWNpZW50cyBvZiBjdWJpY1xyXG4gICAgdmFyIHJlc3VsdCA9IG5ldyBJbnRlcnNlY3Rpb24oKTtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgdGhlIGNvZWZmaWNpZW50cyBvZiBjdWJpYyBwb2x5bm9taWFsXHJcbiAgICBhID0gcDEubXVsdGlwbHkoLTEpO1xyXG4gICAgYiA9IHAyLm11bHRpcGx5KDMpO1xyXG4gICAgYyA9IHAzLm11bHRpcGx5KC0zKTtcclxuICAgIGQgPSBhLmFkZChiLmFkZChjLmFkZChwNCkpKTtcclxuICAgIGMzID0gbmV3IFZlY3RvcjJEKGQueCwgZC55KTtcclxuXHJcbiAgICBhID0gcDEubXVsdGlwbHkoMyk7XHJcbiAgICBiID0gcDIubXVsdGlwbHkoLTYpO1xyXG4gICAgYyA9IHAzLm11bHRpcGx5KDMpO1xyXG4gICAgZCA9IGEuYWRkKGIuYWRkKGMpKTtcclxuICAgIGMyID0gbmV3IFZlY3RvcjJEKGQueCwgZC55KTtcclxuXHJcbiAgICBhID0gcDEubXVsdGlwbHkoLTMpO1xyXG4gICAgYiA9IHAyLm11bHRpcGx5KDMpO1xyXG4gICAgYyA9IGEuYWRkKGIpO1xyXG4gICAgYzEgPSBuZXcgVmVjdG9yMkQoYy54LCBjLnkpO1xyXG5cclxuICAgIGMwID0gbmV3IFZlY3RvcjJEKHAxLngsIHAxLnkpO1xyXG5cclxuICAgIHZhciByeHJ4ICA9IHJ4KnJ4O1xyXG4gICAgdmFyIHJ5cnkgID0gcnkqcnk7XHJcbiAgICB2YXIgcG9seSA9IG5ldyBQb2x5bm9taWFsKFxyXG4gICAgICAgIGMzLngqYzMueCpyeXJ5ICsgYzMueSpjMy55KnJ4cngsXHJcbiAgICAgICAgMiooYzMueCpjMi54KnJ5cnkgKyBjMy55KmMyLnkqcnhyeCksXHJcbiAgICAgICAgMiooYzMueCpjMS54KnJ5cnkgKyBjMy55KmMxLnkqcnhyeCkgKyBjMi54KmMyLngqcnlyeSArIGMyLnkqYzIueSpyeHJ4LFxyXG4gICAgICAgIDIqYzMueCpyeXJ5KihjMC54IC0gZWMueCkgKyAyKmMzLnkqcnhyeCooYzAueSAtIGVjLnkpICtcclxuICAgICAgICAgICAgMiooYzIueCpjMS54KnJ5cnkgKyBjMi55KmMxLnkqcnhyeCksXHJcbiAgICAgICAgMipjMi54KnJ5cnkqKGMwLnggLSBlYy54KSArIDIqYzIueSpyeHJ4KihjMC55IC0gZWMueSkgK1xyXG4gICAgICAgICAgICBjMS54KmMxLngqcnlyeSArIGMxLnkqYzEueSpyeHJ4LFxyXG4gICAgICAgIDIqYzEueCpyeXJ5KihjMC54IC0gZWMueCkgKyAyKmMxLnkqcnhyeCooYzAueSAtIGVjLnkpLFxyXG4gICAgICAgIGMwLngqYzAueCpyeXJ5IC0gMipjMC55KmVjLnkqcnhyeCAtIDIqYzAueCplYy54KnJ5cnkgK1xyXG4gICAgICAgICAgICBjMC55KmMwLnkqcnhyeCArIGVjLngqZWMueCpyeXJ5ICsgZWMueSplYy55KnJ4cnggLSByeHJ4KnJ5cnlcclxuICAgICk7XHJcbiAgICB2YXIgcm9vdHMgPSBwb2x5LmdldFJvb3RzSW5JbnRlcnZhbCgwLDEpO1xyXG4gICAgcmVtb3ZlTXVsdGlwbGVSb290c0luMDEocm9vdHMpO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHJvb3RzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgIHZhciB0ID0gcm9vdHNbaV07XHJcbiAgICAgICAgdmFyIHYgPSBjMy5tdWx0aXBseSh0ICogdCAqIHQpLmFkZChjMi5tdWx0aXBseSh0ICogdCkuYWRkKGMxLm11bHRpcGx5KHQpLmFkZChjMCkpKTtcclxuICAgICAgICByZXN1bHQucG9pbnRzLnB1c2gobmV3IFBvaW50MkQodi54LCB2LnkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiAgaW50ZXJzZWN0QmV6aWVyM0xpbmVcclxuICpcclxuICogIE1hbnkgdGhhbmtzIHRvIERhbiBTdW5kYXkgYXQgU29mdFN1cmZlci5jb20uICBIZSBnYXZlIG1lIGEgdmVyeSB0aG9yb3VnaFxyXG4gKiAgc2tldGNoIG9mIHRoZSBhbGdvcml0aG0gdXNlZCBoZXJlLiAgV2l0aG91dCBoaXMgaGVscCwgSSdtIG5vdCBzdXJlIHdoZW4gSVxyXG4gKiAgd291bGQgaGF2ZSBmaWd1cmVkIG91dCB0aGlzIGludGVyc2VjdGlvbiBwcm9ibGVtLlxyXG4gKlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwMlxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwM1xyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBwNFxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhMVxyXG4gKiAgQHBhcmFtIHtQb2ludDJEfSBhMlxyXG4gKiAgQHJldHVybnMge0ludGVyc2VjdGlvbn1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmludGVyc2VjdEJlemllcjNMaW5lID0gZnVuY3Rpb24ocDEsIHAyLCBwMywgcDQsIGExLCBhMikge1xyXG4gICAgdmFyIGEsIGIsIGMsIGQ7ICAgICAgIC8vIHRlbXBvcmFyeSB2YXJpYWJsZXNcclxuICAgIHZhciBjMywgYzIsIGMxLCBjMDsgICAvLyBjb2VmZmljaWVudHMgb2YgY3ViaWNcclxuICAgIHZhciBjbDsgICAgICAgICAgICAgICAvLyBjIGNvZWZmaWNpZW50IGZvciBub3JtYWwgZm9ybSBvZiBsaW5lXHJcbiAgICB2YXIgbjsgICAgICAgICAgICAgICAgLy8gbm9ybWFsIGZvciBub3JtYWwgZm9ybSBvZiBsaW5lXHJcbiAgICB2YXIgbWluID0gYTEubWluKGEyKTsgLy8gdXNlZCB0byBkZXRlcm1pbmUgaWYgcG9pbnQgaXMgb24gbGluZSBzZWdtZW50XHJcbiAgICB2YXIgbWF4ID0gYTEubWF4KGEyKTsgLy8gdXNlZCB0byBkZXRlcm1pbmUgaWYgcG9pbnQgaXMgb24gbGluZSBzZWdtZW50XHJcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbigpO1xyXG5cclxuICAgIC8vIFN0YXJ0IHdpdGggQmV6aWVyIHVzaW5nIEJlcm5zdGVpbiBwb2x5bm9taWFscyBmb3Igd2VpZ2h0aW5nIGZ1bmN0aW9uczpcclxuICAgIC8vICAgICAoMS10XjMpUDEgKyAzdCgxLXQpXjJQMiArIDN0XjIoMS10KVAzICsgdF4zUDRcclxuICAgIC8vXHJcbiAgICAvLyBFeHBhbmQgYW5kIGNvbGxlY3QgdGVybXMgdG8gZm9ybSBsaW5lYXIgY29tYmluYXRpb25zIG9mIG9yaWdpbmFsIEJlemllclxyXG4gICAgLy8gY29udHJvbHMuICBUaGlzIGVuZHMgdXAgd2l0aCBhIHZlY3RvciBjdWJpYyBpbiB0OlxyXG4gICAgLy8gICAgICgtUDErM1AyLTNQMytQNCl0XjMgKyAoM1AxLTZQMiszUDMpdF4yICsgKC0zUDErM1AyKXQgKyBQMVxyXG4gICAgLy8gICAgICAgICAgICAgL1xcICAgICAgICAgICAgICAgICAgL1xcICAgICAgICAgICAgICAgIC9cXCAgICAgICAvXFxcclxuICAgIC8vICAgICAgICAgICAgIHx8ICAgICAgICAgICAgICAgICAgfHwgICAgICAgICAgICAgICAgfHwgICAgICAgfHxcclxuICAgIC8vICAgICAgICAgICAgIGMzICAgICAgICAgICAgICAgICAgYzIgICAgICAgICAgICAgICAgYzEgICAgICAgYzBcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgdGhlIGNvZWZmaWNpZW50c1xyXG4gICAgYSA9IHAxLm11bHRpcGx5KC0xKTtcclxuICAgIGIgPSBwMi5tdWx0aXBseSgzKTtcclxuICAgIGMgPSBwMy5tdWx0aXBseSgtMyk7XHJcbiAgICBkID0gYS5hZGQoYi5hZGQoYy5hZGQocDQpKSk7XHJcbiAgICBjMyA9IG5ldyBWZWN0b3IyRChkLngsIGQueSk7XHJcblxyXG4gICAgYSA9IHAxLm11bHRpcGx5KDMpO1xyXG4gICAgYiA9IHAyLm11bHRpcGx5KC02KTtcclxuICAgIGMgPSBwMy5tdWx0aXBseSgzKTtcclxuICAgIGQgPSBhLmFkZChiLmFkZChjKSk7XHJcbiAgICBjMiA9IG5ldyBWZWN0b3IyRChkLngsIGQueSk7XHJcblxyXG4gICAgYSA9IHAxLm11bHRpcGx5KC0zKTtcclxuICAgIGIgPSBwMi5tdWx0aXBseSgzKTtcclxuICAgIGMgPSBhLmFkZChiKTtcclxuICAgIGMxID0gbmV3IFZlY3RvcjJEKGMueCwgYy55KTtcclxuXHJcbiAgICBjMCA9IG5ldyBWZWN0b3IyRChwMS54LCBwMS55KTtcclxuXHJcbiAgICAvLyBDb252ZXJ0IGxpbmUgdG8gbm9ybWFsIGZvcm06IGF4ICsgYnkgKyBjID0gMFxyXG4gICAgLy8gRmluZCBub3JtYWwgdG8gbGluZTogbmVnYXRpdmUgaW52ZXJzZSBvZiBvcmlnaW5hbCBsaW5lJ3Mgc2xvcGVcclxuICAgIG4gPSBuZXcgVmVjdG9yMkQoYTEueSAtIGEyLnksIGEyLnggLSBhMS54KTtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgbmV3IGMgY29lZmZpY2llbnRcclxuICAgIGNsID0gYTEueCphMi55IC0gYTIueCphMS55O1xyXG5cclxuICAgIC8vID9Sb3RhdGUgZWFjaCBjdWJpYyBjb2VmZmljaWVudCB1c2luZyBsaW5lIGZvciBuZXcgY29vcmRpbmF0ZSBzeXN0ZW0/XHJcbiAgICAvLyBGaW5kIHJvb3RzIG9mIHJvdGF0ZWQgY3ViaWNcclxuICAgIHZhciByb290cyA9IG5ldyBQb2x5bm9taWFsKFxyXG4gICAgICAgIG4uZG90KGMzKSxcclxuICAgICAgICBuLmRvdChjMiksXHJcbiAgICAgICAgbi5kb3QoYzEpLFxyXG4gICAgICAgIG4uZG90KGMwKSArIGNsXHJcbiAgICApLmdldFJvb3RzKCk7XHJcblxyXG4gICAgLy8gQW55IHJvb3RzIGluIGNsb3NlZCBpbnRlcnZhbCBbMCwxXSBhcmUgaW50ZXJzZWN0aW9ucyBvbiBCZXppZXIsIGJ1dFxyXG4gICAgLy8gbWlnaHQgbm90IGJlIG9uIHRoZSBsaW5lIHNlZ21lbnQuXHJcbiAgICAvLyBGaW5kIGludGVyc2VjdGlvbnMgYW5kIGNhbGN1bGF0ZSBwb2ludCBjb29yZGluYXRlc1xyXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgcm9vdHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgdmFyIHQgPSByb290c1tpXTtcclxuXHJcbiAgICAgICAgaWYgKCAwIDw9IHQgJiYgdCA8PSAxICkge1xyXG4gICAgICAgICAgICAvLyBXZSdyZSB3aXRoaW4gdGhlIEJlemllciBjdXJ2ZVxyXG4gICAgICAgICAgICAvLyBGaW5kIHBvaW50IG9uIEJlemllclxyXG4gICAgICAgICAgICB2YXIgcDUgPSBwMS5sZXJwKHAyLCB0KTtcclxuICAgICAgICAgICAgdmFyIHA2ID0gcDIubGVycChwMywgdCk7XHJcbiAgICAgICAgICAgIHZhciBwNyA9IHAzLmxlcnAocDQsIHQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHA4ID0gcDUubGVycChwNiwgdCk7XHJcbiAgICAgICAgICAgIHZhciBwOSA9IHA2LmxlcnAocDcsIHQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHAxMCA9IHA4LmxlcnAocDksIHQpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2VlIGlmIHBvaW50IGlzIG9uIGxpbmUgc2VnbWVudFxyXG4gICAgICAgICAgICAvLyBIYWQgdG8gbWFrZSBzcGVjaWFsIGNhc2VzIGZvciB2ZXJ0aWNhbCBhbmQgaG9yaXpvbnRhbCBsaW5lcyBkdWVcclxuICAgICAgICAgICAgLy8gdG8gc2xpZ2h0IGVycm9ycyBpbiBjYWxjdWxhdGlvbiBvZiBwMTBcclxuICAgICAgICAgICAgaWYgKCBhMS54ID09IGEyLnggKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIG1pbi55IDw9IHAxMC55ICYmIHAxMC55IDw9IG1heC55ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hcHBlbmRQb2ludCggcDEwICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGExLnkgPT0gYTIueSApIHtcclxuICAgICAgICAgICAgICAgIGlmICggbWluLnggPD0gcDEwLnggJiYgcDEwLnggPD0gbWF4LnggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFwcGVuZFBvaW50KCBwMTAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChtaW4ueCA8PSBwMTAueCAmJiBwMTAueCA8PSBtYXgueCAmJiBtaW4ueSA8PSBwMTAueSAmJiBwMTAueSA8PSBtYXgueSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmFwcGVuZFBvaW50KCBwMTAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXHJcbn0se1wiLi4vSW50ZXJzZWN0aW9uXCI6OSxcImtsZC1hZmZpbmVcIjoxLFwia2xkLXBvbHlub21pYWxcIjo1fV0sMTI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICpcclxuICogIEludGVyc2VjdGlvbi5qc1xyXG4gKlxyXG4gKiAgY29weXJpZ2h0IDIwMDIsIDIwMTMgS2V2aW4gTGluZHNleVxyXG4gKlxyXG4gKiAgY29udHJpYnV0aW9uIHtAbGluayBodHRwOi8vZ2l0aHViLmNvbS9RdWF6aXN0YXgva2xkLWludGVyc2VjdGlvbnN9XHJcbiAqICAgICAgQGNvcHlyaWdodCAyMDE1IFJvYmVydCBCZW5rbyAoUXVhemlzdGF4KSA8cXVhemlzdGF4QGdtYWlsLmNvbT5cclxuICogICAgICBAbGljZW5zZSBNSVRcclxuICovXHJcblxyXG52YXIgUG9pbnQyRCA9IHJlcXVpcmUoJ2tsZC1hZmZpbmUnKS5Qb2ludDJEO1xyXG52YXIgVmVjdG9yMkQgPSByZXF1aXJlKCdrbGQtYWZmaW5lJykuVmVjdG9yMkQ7XHJcbnZhciBNYXRyaXgyRCA9IHJlcXVpcmUoJ2tsZC1hZmZpbmUnKS5NYXRyaXgyRDtcclxudmFyIFBvbHlub21pYWwgPSByZXF1aXJlKCdrbGQtcG9seW5vbWlhbCcpLlBvbHlub21pYWw7XHJcbnZhciBJbnRlcnNlY3Rpb25QYXJhbXMgPSByZXF1aXJlKCcuL0ludGVyc2VjdGlvblBhcmFtcycpO1xyXG52YXIgSW50ZXJzZWN0aW9uID0gcmVxdWlyZSgnLi9JbnRlcnNlY3Rpb24nKTtcclxudmFyIGJlemllckludGVyc2VjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2JlemllcicpXHJcblxyXG52YXIgSVBUWVBFID0gSW50ZXJzZWN0aW9uUGFyYW1zLlRZUEU7XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiAgYmV6b3V0XHJcbiAqXHJcbiAqICBUaGlzIGNvZGUgaXMgYmFzZWQgb24gTWdjSW50cjJERWxwRWxwLmNwcCB3cml0dGVuIGJ5IERhdmlkIEViZXJseS4gIEhpc1xyXG4gKiAgY29kZSBhbG9uZyB3aXRoIG1hbnkgb3RoZXIgZXhjZWxsZW50IGV4YW1wbGVzIGFyZSBhdmFpYWJsZSBhdCBoaXMgc2l0ZTpcclxuICogIGh0dHA6Ly93d3cuZ2VvbWV0cmljdG9vbHMuY29tXHJcbiAqXHJcbiAqICBAcGFyYW0ge0FycmF5PFBvaW50MkQ+fSBlMVxyXG4gKiAgQHBhcmFtIHtBcnJheTxQb2ludDJEPn0gZTJcclxuICogIEByZXR1cm5zIHtQb2x5bm9taWFsfVxyXG4gKi9cclxuZnVuY3Rpb24gYmV6b3V0KGUxLCBlMikge1xyXG4gICAgdmFyIEFCICAgID0gZTFbMF0qZTJbMV0gLSBlMlswXSplMVsxXTtcclxuICAgIHZhciBBQyAgICA9IGUxWzBdKmUyWzJdIC0gZTJbMF0qZTFbMl07XHJcbiAgICB2YXIgQUQgICAgPSBlMVswXSplMlszXSAtIGUyWzBdKmUxWzNdO1xyXG4gICAgdmFyIEFFICAgID0gZTFbMF0qZTJbNF0gLSBlMlswXSplMVs0XTtcclxuICAgIHZhciBBRiAgICA9IGUxWzBdKmUyWzVdIC0gZTJbMF0qZTFbNV07XHJcbiAgICB2YXIgQkMgICAgPSBlMVsxXSplMlsyXSAtIGUyWzFdKmUxWzJdO1xyXG4gICAgdmFyIEJFICAgID0gZTFbMV0qZTJbNF0gLSBlMlsxXSplMVs0XTtcclxuICAgIHZhciBCRiAgICA9IGUxWzFdKmUyWzVdIC0gZTJbMV0qZTFbNV07XHJcbiAgICB2YXIgQ0QgICAgPSBlMVsyXSplMlszXSAtIGUyWzJdKmUxWzNdO1xyXG4gICAgdmFyIERFICAgID0gZTFbM10qZTJbNF0gLSBlMlszXSplMVs0XTtcclxuICAgIHZhciBERiAgICA9IGUxWzNdKmUyWzVdIC0gZTJbM10qZTFbNV07XHJcbiAgICB2YXIgQkZwREUgPSBCRiArIERFO1xyXG4gICAgdmFyIEJFbUNEID0gQkUgLSBDRDtcclxuXHJcbiAgICByZXR1cm4gbmV3IFBvbHlub21pYWwoXHJcbiAgICAgICAgQUIqQkMgLSBBQypBQyxcclxuICAgICAgICBBQipCRW1DRCArIEFEKkJDIC0gMipBQypBRSxcclxuICAgICAgICBBQipCRnBERSArIEFEKkJFbUNEIC0gQUUqQUUgLSAyKkFDKkFGLFxyXG4gICAgICAgIEFCKkRGICsgQUQqQkZwREUgLSAyKkFFKkFGLFxyXG4gICAgICAgIEFEKkRGIC0gQUYqQUZcclxuICAgICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgUmVtb3ZlcyBmcm9tIGludGVyc2VjdGlvbiBwb2ludHMgdGhvc2UgcG9pbnRzIHRoYXQgYXJlIG5vdCBiZXR3ZWVuIHR3byByYXlzIGRldGVybWluZWQgYnkgYXJjIHBhcmFtZXRlcnMuXHJcbiAgICBSYXlzIGJlZ2luIGF0IGVsbGlwc2UgY2VudGVyIGFuZCBnbyB0aHJvdWdoIGFyYyBzdGFydFBvaW50L2VuZFBvaW50LlxyXG5cclxuICAgIEBwYXJhbSB7SW50ZXJzZWN0aW9ufSBpbnRlcnNlY3Rpb24gLSB3aWxsIGJlIG1vZGlmaWVkIGFuZCByZXR1cm5lZFxyXG4gICAgQHBhcmFtIHtQb2ludDJEfSBjIC0gY2VudGVyIG9mIGFyYyBlbGxpcHNlXHJcbiAgICBAcGFyYW0ge051bWJlcn0gcnhcclxuICAgIEBwYXJhbSB7TnVtYmVyfSByeVxyXG4gICAgQHBhcmFtIHtOdW1iZXJ9IHBoaSAtIGluIHJhZGlhbnNcclxuICAgIEBwYXJhbSB7TnVtYmVyfSB0aDEgLSBpbiByYWRpYW5zXHJcbiAgICBAcGFyYW0ge051bWJlcn0gZHRoIC0gaW4gcmFkaWFuc1xyXG4gICAgQHBhcmFtIHtNYXRyaXgyRH0gW21dIC0gYXJjIHRyYW5zZm9ybWF0aW9uIG1hdHJpeFxyXG4gICAgQHJldHVybnMge0ludGVyc2VjdGlvbn1cclxuKi9cclxuZnVuY3Rpb24gcmVtb3ZlUG9pbnRzTm90SW5BcmMoaW50ZXJzZWN0aW9uLCBjLCByeCwgcnksIHBoaSwgdGgxLCBkdGgsIG0pIHtcclxuICAgIGlmIChpbnRlcnNlY3Rpb24ucG9pbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGludGVyc2VjdGlvbjtcclxuICAgIGlmIChtICYmICFtLmlzSWRlbnRpdHkoKSlcclxuICAgICAgICB2YXIgbXAgPSBtLmludmVyc2UoKTtcclxuICAgIHZhciBucCA9IFtdO1xyXG4gICAgdmFyIHZ4ID0gbmV3IFZlY3RvcjJEKDEsIDApO1xyXG4gICAgdmFyIHBpMiA9IE1hdGguUEkgKiAyO1xyXG4gICAgdmFyIHdhc05lZyA9IGR0aCA8IDA7XHJcbiAgICB2YXIgd2FzQmlnID0gTWF0aC5hYnMoZHRoKSA+IE1hdGguUEk7XHJcbiAgICB2YXIgbTEgPSBuZXcgTWF0cml4MkQoKS5zY2FsZU5vblVuaWZvcm0oMSwgcnkgLyByeCkucm90YXRlKHRoMSk7XHJcbiAgICB2YXIgbTIgPSBuZXcgTWF0cml4MkQoKS5zY2FsZU5vblVuaWZvcm0oMSwgcnkgLyByeCkucm90YXRlKHRoMSArIGR0aCk7XHJcblxyXG4gICAgdGgxID0gKHZ4LmFuZ2xlQmV0d2Vlbih2eC50cmFuc2Zvcm0obTEpKSArIHBpMikgJSBwaTI7XHJcbiAgICBkdGggPSB2eC50cmFuc2Zvcm0obTEpLmFuZ2xlQmV0d2Vlbih2eC50cmFuc2Zvcm0obTIpKTtcclxuICAgIGR0aCA9ICh3YXNCaWcgPyBwaTIgLSBNYXRoLmFicyhkdGgpIDogTWF0aC5hYnMoZHRoKSkgKiAod2FzTmVnID8gLTEgOiAxKTtcclxuICAgIHZhciBtMyA9IG5ldyBNYXRyaXgyRCgpLnJvdGF0ZShwaGkpLm11bHRpcGx5KG0xKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMCwgcCwgYTsgaSA8IGludGVyc2VjdGlvbi5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBwID0gaW50ZXJzZWN0aW9uLnBvaW50c1tpXTtcclxuICAgICAgICBhID0gdngudHJhbnNmb3JtKG0zKS5hbmdsZUJldHdlZW4oVmVjdG9yMkQuZnJvbVBvaW50cyhjLCAobXApID8gcC50cmFuc2Zvcm0obXApIDogcCkpO1xyXG4gICAgICAgIGlmIChkdGggPj0gMCkge1xyXG4gICAgICAgICAgICBhID0gKGEgKyAyICogcGkyKSAlIHBpMjtcclxuICAgICAgICAgICAgaWYgKGEgPD0gZHRoKVxyXG4gICAgICAgICAgICAgICAgbnAucHVzaChwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhID0gKGEgLSAyICogcGkyKSAlIHBpMjtcclxuICAgICAgICAgICAgaWYgKGEgPj0gZHRoKVxyXG4gICAgICAgICAgICAgICAgbnAucHVzaChwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbnRlcnNlY3Rpb24ucG9pbnRzID0gbnA7XHJcbiAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xyXG59O1xyXG5cclxuLyoqXHJcbiAgICBwb2ludHMxIHdpbGwgYmUgbW9kaWZpZWQsIHBvaW50cyBjbG9zZSAoYWxtb3N0IGlkZW50aWNhbCkgdG8gYW55IHBvaW50IGluIHBvaW50czIgd2lsbCBiZSByZW1vdmVkXHJcblxyXG4gICAgQHBhcmFtIHtBcnJheTxQb2ludDJEPn0gcG9pbnRzMSAtIHdpbGwgYmUgbW9kaWZpZWQsIHBvaW50cyBjbG9zZSB0byBhbnkgcG9pbnQgaW4gcG9pbnRzMiB3aWxsIGJlIHJlbW92ZWRcclxuICAgIEBwYXJhbSB7QXJyYXk8UG9pbnQyRD59IHBvaW50czJcclxuKi9cclxuZnVuY3Rpb24gcmVtb3ZlQ2xvc2VQb2ludHMocG9pbnRzMSwgcG9pbnRzMikge1xyXG4gICAgaWYgKHBvaW50czEubGVuZ3RoID09PSAwIHx8IHBvaW50czIubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIHZhciBtYXhmID0gZnVuY3Rpb24gKHAsIHYpIHsgaWYgKHAgPCB2LngpIHAgPSB2Lng7IGlmIChwIDwgdi55KSBwID0gdi55OyByZXR1cm4gcDsgfTtcclxuICAgIHZhciBtYXggPSBwb2ludHMxLnJlZHVjZShtYXhmLCAwKTtcclxuICAgIG1heCA9IHBvaW50czIucmVkdWNlKG1heGYsIG1heCk7XHJcbiAgICB2YXIgRVJSRiA9IDFlLTE1O1xyXG4gICAgdmFyIFpFUk9lcHNpbG9uID0gMTAwICogbWF4ICogRVJSRiAqIE1hdGguU1FSVDI7XHJcbiAgICB2YXIgajtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzMS5sZW5ndGg7KSB7XHJcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHBvaW50czIubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKHBvaW50czFbaV0uZGlzdGFuY2VGcm9tKHBvaW50czJbal0pIDw9IFpFUk9lcHNpbG9uKSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMxLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChqID09IHBvaW50czIubGVuZ3RoKVxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICB9XHJcbn1cclxuXHJcbnZhciBpbnRlcnNlY3Rpb25GdW5jdGlvbnMgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgaW50ZXJzZWN0UGF0aFNoYXBlXHJcblxyXG4gICAgICAgIEBwYXJhbSB7SW50ZXJzZWN0aW9uUGFyYW1zfSBwYXRoXHJcbiAgICAgICAgQHBhcmFtIHtJbnRlcnNlY3Rpb25QYXJhbXN9IHNoYXBlXHJcbiAgICAgICAgQHBhcmFtIHtNYXRyaXgyRH0gW20xXVxyXG4gICAgICAgIEBwYXJhbSB7TWF0cml4MkR9IFttMl1cclxuICAgICAgICBAcmV0dXJucyB7SW50ZXJzZWN0aW9ufVxyXG4gICAgKi9cclxuICAgIGludGVyc2VjdFBhdGhTaGFwZTogZnVuY3Rpb24gKHBhdGgsIHNoYXBlLCBtMSwgbTIpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbigpO1xyXG4gICAgICAgIHZhciBwYXRoUGFyYW1zID0gcGF0aC5wYXJhbXNbMF07XHJcbiAgICAgICAgdmFyIGludGVyMDtcclxuICAgICAgICB2YXIgcHJldmludGVyO1xyXG4gICAgICAgIGZvciAodmFyIGludGVyLCBpID0gMDsgaSA8IHBhdGhQYXJhbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaW50ZXIgPSBpbnRlcnNlY3QocGF0aFBhcmFtc1tpXSwgc2hhcGUsIG0xLCBtMik7XHJcbiAgICAgICAgICAgIGlmICghaW50ZXIwKVxyXG4gICAgICAgICAgICAgICAgaW50ZXIwID0gaW50ZXI7XHJcbiAgICAgICAgICAgIGlmIChwcmV2aW50ZXIpIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUNsb3NlUG9pbnRzKHByZXZpbnRlci5wb2ludHMsIGludGVyLnBvaW50cyk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuYXBwZW5kUG9pbnRzKHByZXZpbnRlci5wb2ludHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByZXZpbnRlciA9IGludGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocHJldmludGVyKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5hcHBlbmRQb2ludHMocHJldmludGVyLnBvaW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAgICBpbnRlcnNlY3RMaW5lc1NoYXBlXHJcblxyXG4gICAgICAgIEBwYXJhbSB7SW50ZXJzZWN0aW9uUGFyYW1zfSBsaW5lcyAtIEludGVyc2VjdGlvblBhcmFtcyB3aXRoIHBvaW50cyBhcyBmaXJzdCBwYXJhbWV0ZXIgKGxpa2UgdHlwZXMgUkVDVCwgUE9MWUxJTkUgb3IgUE9MWUdPTilcclxuICAgICAgICBAcGFyYW0ge0ludGVyc2VjdGlvblBhcmFtc30gc2hhcGUgLSBJbnRlcnNlY3Rpb25QYXJhbXMgb2Ygb3RoZXIgc2hhcGVcclxuICAgICAgICBAcGFyYW0ge01hdHJpeDJEfSBbbTFdXHJcbiAgICAgICAgQHBhcmFtIHtNYXRyaXgyRH0gW20yXVxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb3NlZF0gLSBpZiBzZXQsIGRldGVybWluZXMgaWYgbGluZSBiZXR3ZWVuIGZpcnN0IGFuZCBsYXN0IHBvaW50IHdpbGwgYmUgdGFrZW4gaW50byBjYWxsY3VsYXRpb24gdG9vLiBJZiBub3Qgc2V0LCBpdCdzIHRydWUgZm9yIFJFQ1QgYW5kIFBPTFlHT04sIGZhbHNlIGZvciBvdGhlciA8Yj5saW5lczwvYj4gdHlwZXMuXHJcbiAgICAgICAgQHJldHVybnMge0ludGVyc2VjdGlvbn1cclxuICAgICovXHJcbiAgICBpbnRlcnNlY3RMaW5lc1NoYXBlOiBmdW5jdGlvbiAobGluZXMsIHNoYXBlLCBtMSwgbTIsIGNsb3NlZCkge1xyXG4gICAgICAgIHZhciBJUFRZUEUgPSBJbnRlcnNlY3Rpb25QYXJhbXMuVFlQRTtcclxuICAgICAgICB2YXIgbGluZV9wb2ludHMgPSBsaW5lcy5wYXJhbXNbMF07XHJcbiAgICAgICAgdmFyIGlwID0gbmV3IEludGVyc2VjdGlvblBhcmFtcyhJUFRZUEUuTElORSwgWzAsIDBdKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbigpO1xyXG4gICAgICAgIHZhciBpbnRlciwgaTtcclxuICAgICAgICB2YXIgaW50ZXJzZWN0TGluZSA9IGZ1bmN0aW9uIChpMSwgaTIpIHtcclxuICAgICAgICAgICAgaXAucGFyYW1zWzBdID0gbGluZV9wb2ludHNbaTFdO1xyXG4gICAgICAgICAgICBpcC5wYXJhbXNbMV0gPSBsaW5lX3BvaW50c1tpMl07XHJcbiAgICAgICAgICAgIGludGVyID0gaW50ZXJzZWN0KGlwLCBzaGFwZSwgbTEsIG0yKTtcclxuICAgICAgICAgICAgcmVtb3ZlQ2xvc2VQb2ludHMoaW50ZXIucG9pbnRzLCBbbGluZV9wb2ludHNbaTJdXSk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5hcHBlbmRQb2ludHMoaW50ZXIucG9pbnRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpbmVfcG9pbnRzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICBpbnRlcnNlY3RMaW5lKGksIGkgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjbG9zZWQgIT09ICd1bmRlZmluZWQnICYmIGNsb3NlZCB8fCBsaW5lcy50eXBlID09PSBJUFRZUEUuUkVDVCB8fCBsaW5lcy50eXBlID09PSBJUFRZUEUuUE9MWUdPTikge1xyXG4gICAgICAgICAgICBpbnRlcnNlY3RMaW5lKGxpbmVfcG9pbnRzLmxlbmd0aCAtIDEsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvKipcclxuICAgICAgICBpbnRlcnNlY3RBcmNTaGFwZVxyXG5cclxuICAgICAgICBAcGFyYW0ge0ludGVyc2VjdGlvblBhcmFtc30gYXJjXHJcbiAgICAgICAgQHBhcmFtIHtJbnRlcnNlY3Rpb25QYXJhbXN9IHNoYXBlXHJcbiAgICAgICAgQHBhcmFtIHtNYXRyaXgyRH0gW20xXVxyXG4gICAgICAgIEBwYXJhbSB7TWF0cml4MkR9IFttMl1cclxuICAgICAgICBAcmV0dXJucyB7SW50ZXJzZWN0aW9ufVxyXG4gICAgKi9cclxuICAgIGludGVyc2VjdEFyY1NoYXBlOiBmdW5jdGlvbiAoYXJjLCBzaGFwZSwgbTEsIG0yKSB7XHJcbiAgICAgICAgbTEgPSBtMSB8fCBNYXRyaXgyRC5JREVOVElUWTtcclxuICAgICAgICBtMiA9IG0yIHx8IE1hdHJpeDJELklERU5USVRZO1xyXG4gICAgICAgIHZhciBjMSA9IGFyYy5wYXJhbXNbMF0sXHJcbiAgICAgICAgICAgIHJ4MSA9IGFyYy5wYXJhbXNbMV0sXHJcbiAgICAgICAgICAgIHJ5MSA9IGFyYy5wYXJhbXNbMl0sXHJcbiAgICAgICAgICAgIHBoaTEgPSBhcmMucGFyYW1zWzNdLFxyXG4gICAgICAgICAgICB0aDEgPSBhcmMucGFyYW1zWzRdLFxyXG4gICAgICAgICAgICBkdGgxID0gYXJjLnBhcmFtc1s1XTtcclxuXHJcbiAgICAgICAgdmFyIHJlcztcclxuICAgICAgICBpZiAobTEuaXNJZGVudGl0eSgpICYmIHBoaTEgPT09IDApIHtcclxuICAgICAgICAgICAgcmVzID0gaW50ZXJzZWN0KEludGVyc2VjdGlvblBhcmFtcy5uZXdFbGxpcHNlKGMxLCByeDEsIHJ5MSksIHNoYXBlLCBtMSwgbTIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbTEgPSBtMS5tdWx0aXBseShNYXRyaXgyRC5JREVOVElUWS50cmFuc2xhdGUoYzEueCwgYzEueSkucm90YXRlKHBoaTEpKTtcclxuICAgICAgICAgICAgYzEgPSBuZXcgUG9pbnQyRCgwLCAwKTtcclxuICAgICAgICAgICAgcGhpMSA9IDA7XHJcbiAgICAgICAgICAgIHJlcyA9IGludGVyc2VjdChJbnRlcnNlY3Rpb25QYXJhbXMubmV3RWxsaXBzZShjMSwgcngxLCByeTEpLCBzaGFwZSwgbTEsIG0yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzID0gcmVtb3ZlUG9pbnRzTm90SW5BcmMocmVzLCBjMSwgcngxLCByeTEsIHBoaTEsIHRoMSwgZHRoMSwgbTEpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIEZpbmRzIGludGVyc2VjdGlvbiBwb2ludHMgb2YgdHdvIGVsbGlwc2VzLiA8YnIvPlxyXG4gICAgICpcclxuICAgICAqICBUaGlzIGNvZGUgaXMgYmFzZWQgb24gTWdjSW50cjJERWxwRWxwLmNwcCB3cml0dGVuIGJ5IERhdmlkIEViZXJseS4gSGlzXHJcbiAgICAgKiAgY29kZSBhbG9uZyB3aXRoIG1hbnkgb3RoZXIgZXhjZWxsZW50IGV4YW1wbGVzIGFyZSBhdmFpYWJsZSBhdCBoaXMgc2l0ZTpcclxuICAgICAqICBodHRwOi8vd3d3Lmdlb21ldHJpY3Rvb2xzLmNvbVxyXG4gICAgICpcclxuICAgICAqICBDaGFuZ2VzIC0gMjAxNSBSb2JlcnQgQmVua28gKFF1YXppc3RheClcclxuICAgICAqXHJcbiAgICAgKiAgQHBhcmFtIHtQb2ludDJEfSBjMVxyXG4gICAgICogIEBwYXJhbSB7TnVtYmVyfSByeDFcclxuICAgICAqICBAcGFyYW0ge051bWJlcn0gcnkxXHJcbiAgICAgKiAgQHBhcmFtIHtQb2ludDJEfSBjMlxyXG4gICAgICogIEBwYXJhbSB7TnVtYmVyfSByeDJcclxuICAgICAqICBAcGFyYW0ge051bWJlcn0gcnkyXHJcbiAgICAgKiAgQHJldHVybnMge0ludGVyc2VjdGlvbn1cclxuICAgICAqL1xyXG4gICAgaW50ZXJzZWN0RWxsaXBzZUVsbGlwc2U6IGZ1bmN0aW9uIChjMSwgcngxLCByeTEsIGMyLCByeDIsIHJ5Mikge1xyXG4gICAgICAgIHZhciBhID0gW1xyXG4gICAgICAgICAgICByeTEgKiByeTEsIDAsIHJ4MSAqIHJ4MSwgLTIgKiByeTEgKiByeTEgKiBjMS54LCAtMiAqIHJ4MSAqIHJ4MSAqIGMxLnksXHJcbiAgICAgICAgICAgIHJ5MSAqIHJ5MSAqIGMxLnggKiBjMS54ICsgcngxICogcngxICogYzEueSAqIGMxLnkgLSByeDEgKiByeDEgKiByeTEgKiByeTFcclxuICAgICAgICBdO1xyXG4gICAgICAgIHZhciBiID0gW1xyXG4gICAgICAgICAgICByeTIgKiByeTIsIDAsIHJ4MiAqIHJ4MiwgLTIgKiByeTIgKiByeTIgKiBjMi54LCAtMiAqIHJ4MiAqIHJ4MiAqIGMyLnksXHJcbiAgICAgICAgICAgIHJ5MiAqIHJ5MiAqIGMyLnggKiBjMi54ICsgcngyICogcngyICogYzIueSAqIGMyLnkgLSByeDIgKiByeDIgKiByeTIgKiByeTJcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB2YXIgeVBvbHkgPSBiZXpvdXQoYSwgYik7XHJcbiAgICAgICAgdmFyIHlSb290cyA9IHlQb2x5LmdldFJvb3RzKCk7XHJcbiAgICAgICAgdmFyIGVwc2lsb24gPSAxZS0zO1xyXG4gICAgICAgIHZhciBub3JtMCA9IChhWzBdICogYVswXSArIDIgKiBhWzFdICogYVsxXSArIGFbMl0gKiBhWzJdKSAqIGVwc2lsb247XHJcbiAgICAgICAgdmFyIG5vcm0xID0gKGJbMF0gKiBiWzBdICsgMiAqIGJbMV0gKiBiWzFdICsgYlsyXSAqIGJbMl0pICogZXBzaWxvbjtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICAvL0hhbmRsaW5nIHJvb3QgY2FsY3VsYXRpb24gZXJyb3IgY2F1c2luZyBub3QgZGV0ZWN0aW5nIGludGVyc2VjdGlvblxyXG4gICAgICAgIHZhciBjbGlwID0gZnVuY3Rpb24gKHZhbCwgbWluLCBtYXgpIHsgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCB2YWwpKTsgfTtcclxuICAgICAgICBmb3IgKGkgPSAwIDsgaSA8IHlSb290cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB5Um9vdHNbaV0gPSBjbGlwKHlSb290c1tpXSwgYzEueSAtIHJ5MSwgYzEueSArIHJ5MSk7XHJcbiAgICAgICAgICAgIHlSb290c1tpXSA9IGNsaXAoeVJvb3RzW2ldLCBjMi55IC0gcnkyLCBjMi55ICsgcnkyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vRm9yIGRldGVjdGlvbiBvZiBtdWx0aXBsaWNhdGVkIGludGVyc2VjdGlvbiBwb2ludHNcclxuICAgICAgICB5Um9vdHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSAtIGI7IH0pO1xyXG4gICAgICAgIHZhciByb290UG9pbnRzTiA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHlSb290cy5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgICAgICB2YXIgeFBvbHkgPSBuZXcgUG9seW5vbWlhbChcclxuICAgICAgICAgICAgICAgIGFbMF0sXHJcbiAgICAgICAgICAgICAgICBhWzNdICsgeVJvb3RzW3ldICogYVsxXSxcclxuICAgICAgICAgICAgICAgIGFbNV0gKyB5Um9vdHNbeV0gKiAoYVs0XSArIHlSb290c1t5XSAqIGFbMl0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHZhciBFUlJGID0gMWUtMTU7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh4UG9seS5jb2Vmc1swXSkgPCAxMCAqIEVSUkYgKiBNYXRoLmFicyh4UG9seS5jb2Vmc1syXSkpXHJcbiAgICAgICAgICAgICAgICB4UG9seS5jb2Vmc1swXSA9IDA7XHJcbiAgICAgICAgICAgIHZhciB4Um9vdHMgPSB4UG9seS5nZXRSb290cygpO1xyXG5cclxuICAgICAgICAgICAgcm9vdFBvaW50c04ucHVzaCgwKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB4Um9vdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXN0ID1cclxuICAgICAgICAgICAgICAgICAgICAoYVswXSAqIHhSb290c1t4XSArIGFbMV0gKiB5Um9vdHNbeV0gKyBhWzNdKSAqIHhSb290c1t4XSArXHJcbiAgICAgICAgICAgICAgICAgICAgKGFbMl0gKiB5Um9vdHNbeV0gKyBhWzRdKSAqIHlSb290c1t5XSArIGFbNV07XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModGVzdCkgPCBub3JtMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlc3QgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYlswXSAqIHhSb290c1t4XSArIGJbMV0gKiB5Um9vdHNbeV0gKyBiWzNdKSAqIHhSb290c1t4XSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChiWzJdICogeVJvb3RzW3ldICsgYls0XSkgKiB5Um9vdHNbeV0gKyBiWzVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh0ZXN0KSA8IG5vcm0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hcHBlbmRQb2ludChuZXcgUG9pbnQyRCh4Um9vdHNbeF0sIHlSb290c1t5XSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb290UG9pbnRzTlt5XSArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5wb2ludHMubGVuZ3RoIDw9IDApXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgICAgIC8vUmVtb3ZhbCBvZiBtdWx0aXBsaWNhdGVkIGludGVyc2VjdGlvbiBwb2ludHNcclxuICAgICAgICB2YXIgcHRzID0gcmVzdWx0LnBvaW50cztcclxuICAgICAgICBpZiAocHRzLmxlbmd0aCA9PSA4KSB7XHJcbiAgICAgICAgICAgIHB0cyA9IHB0cy5zcGxpY2UoMCwgNik7XHJcbiAgICAgICAgICAgIHB0cy5zcGxpY2UoMiwgMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHB0cy5sZW5ndGggPT0gNykge1xyXG4gICAgICAgICAgICBwdHMgPSBwdHMuc3BsaWNlKDAsIDYpO1xyXG4gICAgICAgICAgICBwdHMuc3BsaWNlKDIsIDIpO1xyXG4gICAgICAgICAgICBwdHMuc3BsaWNlKHJvb3RQb2ludHNOLmluZGV4T2YoMSksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwdHMubGVuZ3RoID09IDYpIHtcclxuICAgICAgICAgICAgcHRzLnNwbGljZSgyLCAyKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnRWxFbCA2cHRzOiBOOiAnICsgcm9vdFBvaW50c04udG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGlmIChyb290UG9pbnRzTi5pbmRleE9mKDApID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwdHNbMF0uZGlzdGFuY2VGcm9tKHB0c1sxXSkgPCBwdHNbMl0uZGlzdGFuY2VGcm9tKHB0c1szXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwdHMuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHRzLnNwbGljZSgyLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChyb290UG9pbnRzTlswXSA9PSByb290UG9pbnRzTlszXSkge1xyXG4gICAgICAgICAgICAgICAgcHRzLnNwbGljZSgxLCAyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwdHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgKHlSb290cy5sZW5ndGggPT0gMilcclxuICAgICAgICAgICAgfHwgKHlSb290cy5sZW5ndGggPT0gNCAmJiAocm9vdFBvaW50c05bMF0gPT0gMiAmJiByb290UG9pbnRzTlsxXSA9PSAyIHx8IHJvb3RQb2ludHNOWzJdID09IDIgJiYgcm9vdFBvaW50c05bM10gPT0gMikpXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcHRzLnNwbGljZSgyLCAyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwdHMubGVuZ3RoID09IDMgfHwgcHRzLmxlbmd0aCA9PSA1KSB7XHJcbiAgICAgICAgICAgIGkgPSByb290UG9pbnRzTi5pbmRleE9mKDIpO1xyXG4gICAgICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHRzLmxlbmd0aCA9PSAzKVxyXG4gICAgICAgICAgICAgICAgICAgIGkgPSBpICUgMjtcclxuICAgICAgICAgICAgICAgIHZhciBpaSA9IGkgKyAoaSAlIDIgPyAtMSA6IDIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQxLCBkMiwgZDM7XHJcbiAgICAgICAgICAgICAgICBkMSA9IHB0c1tpXS5kaXN0YW5jZUZyb20ocHRzW2kgKyAxXSk7XHJcbiAgICAgICAgICAgICAgICBkMiA9IHB0c1tpXS5kaXN0YW5jZUZyb20ocHRzW2lpXSk7XHJcbiAgICAgICAgICAgICAgICBkMyA9IHB0c1tpICsgMV0uZGlzdGFuY2VGcm9tKHB0c1tpaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQxIDwgZDIgJiYgZDEgPCBkMykge1xyXG4gICAgICAgICAgICAgICAgICAgIHB0cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwdHMuc3BsaWNlKGlpLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBvbHkgPSB5UG9seTtcclxuICAgICAgICB2YXIgWkVST2Vwc2lsb24gPSB5UG9seS56ZXJvRXJyb3JFc3RpbWF0ZSgpO1xyXG4gICAgICAgIFpFUk9lcHNpbG9uICo9IDEwMCAqIE1hdGguU1FSVDI7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHB0cy5sZW5ndGggLSAxOykge1xyXG4gICAgICAgICAgICBpZiAocHRzW2ldLmRpc3RhbmNlRnJvbShwdHNbaSArIDFdKSA8IFpFUk9lcHNpbG9uKSB7XHJcbiAgICAgICAgICAgICAgICBwdHMuc3BsaWNlKGkgKyAxLCAxKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3VsdC5wb2ludHMgPSBwdHM7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIGludGVyc2VjdEVsbGlwc2VMaW5lXHJcbiAgICAgKlxyXG4gICAgICogIE5PVEU6IFJvdGF0aW9uIHdpbGwgbmVlZCB0byBiZSBhZGRlZCB0byB0aGlzIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogIEBwYXJhbSB7UG9pbnQyRH0gY1xyXG4gICAgICogIEBwYXJhbSB7TnVtYmVyfSByeFxyXG4gICAgICogIEBwYXJhbSB7TnVtYmVyfSByeVxyXG4gICAgICogIEBwYXJhbSB7UG9pbnQyRH0gYTFcclxuICAgICAqICBAcGFyYW0ge1BvaW50MkR9IGEyXHJcbiAgICAgKiAgQHJldHVybnMge0ludGVyc2VjdGlvbn1cclxuICAgICAqL1xyXG4gICAgaW50ZXJzZWN0RWxsaXBzZUxpbmU6IGZ1bmN0aW9uKGMsIHJ4LCByeSwgYTEsIGEyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICB2YXIgb3JpZ2luID0gbmV3IFZlY3RvcjJEKGExLngsIGExLnkpO1xyXG4gICAgICAgIHZhciBkaXIgICAgPSBWZWN0b3IyRC5mcm9tUG9pbnRzKGExLCBhMik7XHJcbiAgICAgICAgdmFyIGNlbnRlciA9IG5ldyBWZWN0b3IyRChjLngsIGMueSk7XHJcbiAgICAgICAgdmFyIGRpZmYgICA9IG9yaWdpbi5zdWJ0cmFjdChjZW50ZXIpO1xyXG4gICAgICAgIHZhciBtRGlyICAgPSBuZXcgVmVjdG9yMkQoIGRpci54LyhyeCpyeCksICBkaXIueS8ocnkqcnkpICApO1xyXG4gICAgICAgIHZhciBtRGlmZiAgPSBuZXcgVmVjdG9yMkQoIGRpZmYueC8ocngqcngpLCBkaWZmLnkvKHJ5KnJ5KSApO1xyXG5cclxuICAgICAgICB2YXIgYSA9IGRpci5kb3QobURpcik7XHJcbiAgICAgICAgdmFyIGIgPSBkaXIuZG90KG1EaWZmKTtcclxuICAgICAgICB2YXIgYyA9IGRpZmYuZG90KG1EaWZmKSAtIDEuMDtcclxuICAgICAgICB2YXIgZCA9IGIqYiAtIGEqYztcclxuXHJcbiAgICAgICAgdmFyIEVSUkYgPSAxZS0xNTtcclxuICAgICAgICB2YXIgWkVST2Vwc2lsb24gPSAxMCAqIE1hdGgubWF4KE1hdGguYWJzKGEpLCBNYXRoLmFicyhiKSwgTWF0aC5hYnMoYykpICogRVJSRjtcclxuICAgICAgICBpZiAoTWF0aC5hYnMoZCkgPCBaRVJPZXBzaWxvbikge1xyXG4gICAgICAgICAgICBkID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggZCA8IDAgKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBJbnRlcnNlY3Rpb24oXCJPdXRzaWRlXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIGQgPiAwICkge1xyXG4gICAgICAgICAgICB2YXIgcm9vdCA9IE1hdGguc3FydChkKTtcclxuICAgICAgICAgICAgdmFyIHRfYSAgPSAoLWIgLSByb290KSAvIGE7XHJcbiAgICAgICAgICAgIHZhciB0X2IgID0gKC1iICsgcm9vdCkgLyBhO1xyXG5cclxuICAgICAgICAgICAgdF9iID0gKHRfYiA+IDEpID8gdF9iIC0gRVJSRiA6ICh0X2IgPCAwKSA/IHRfYiArIEVSUkYgOiB0X2I7XHJcbiAgICAgICAgICAgIHRfYSA9ICh0X2EgPiAxKSA/IHRfYSAtIEVSUkYgOiAodF9hIDwgMCkgPyB0X2EgKyBFUlJGIDogdF9hO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAodF9hIDwgMCB8fCAxIDwgdF9hKSAmJiAodF9iIDwgMCB8fCAxIDwgdF9iKSApIHtcclxuICAgICAgICAgICAgICAgIGlmICggKHRfYSA8IDAgJiYgdF9iIDwgMCkgfHwgKHRfYSA+IDEgJiYgdF9iID4gMSkgKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBJbnRlcnNlY3Rpb24oXCJPdXRzaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBJbnRlcnNlY3Rpb24oXCJJbnNpZGVcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBuZXcgSW50ZXJzZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIDAgPD0gdF9hICYmIHRfYSA8PSAxIClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYXBwZW5kUG9pbnQoIGExLmxlcnAoYTIsIHRfYSkgKTtcclxuICAgICAgICAgICAgICAgIGlmICggMCA8PSB0X2IgJiYgdF9iIDw9IDEgKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hcHBlbmRQb2ludCggYTEubGVycChhMiwgdF9iKSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHQgPSAtYi9hO1xyXG4gICAgICAgICAgICBpZiAoIDAgPD0gdCAmJiB0IDw9IDEgKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBuZXcgSW50ZXJzZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuYXBwZW5kUG9pbnQoIGExLmxlcnAoYTIsIHQpICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBuZXcgSW50ZXJzZWN0aW9uKFwiT3V0c2lkZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIGludGVyc2VjdExpbmVMaW5lXHJcbiAgICAgKlxyXG4gICAgICogIEBwYXJhbSB7UG9pbnQyRH0gYTFcclxuICAgICAqICBAcGFyYW0ge1BvaW50MkR9IGEyXHJcbiAgICAgKiAgQHBhcmFtIHtQb2ludDJEfSBiMVxyXG4gICAgICogIEBwYXJhbSB7UG9pbnQyRH0gYjJcclxuICAgICAqICBAcmV0dXJucyB7SW50ZXJzZWN0aW9ufVxyXG4gICAgICovXHJcbiAgICBpbnRlcnNlY3RMaW5lTGluZTogZnVuY3Rpb24oYTEsIGEyLCBiMSwgYjIpIHtcclxuICAgICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICAgIHZhciB1YV90ID0gKGIyLnggLSBiMS54KSAqIChhMS55IC0gYjEueSkgLSAoYjIueSAtIGIxLnkpICogKGExLnggLSBiMS54KTtcclxuICAgICAgICB2YXIgdWJfdCA9IChhMi54IC0gYTEueCkgKiAoYTEueSAtIGIxLnkpIC0gKGEyLnkgLSBhMS55KSAqIChhMS54IC0gYjEueCk7XHJcbiAgICAgICAgdmFyIHVfYiAgPSAoYjIueSAtIGIxLnkpICogKGEyLnggLSBhMS54KSAtIChiMi54IC0gYjEueCkgKiAoYTIueSAtIGExLnkpO1xyXG5cclxuICAgICAgICBpZiAoIHVfYiAhPT0gMCApIHtcclxuICAgICAgICAgICAgdmFyIHVhID0gdWFfdCAvIHVfYjtcclxuICAgICAgICAgICAgdmFyIHViID0gdWJfdCAvIHVfYjtcclxuXHJcbiAgICAgICAgICAgIGlmICggMCA8PSB1YSAmJiB1YSA8PSAxICYmIDAgPD0gdWIgJiYgdWIgPD0gMSApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBJbnRlcnNlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wb2ludHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQyRChcclxuICAgICAgICAgICAgICAgICAgICAgICAgYTEueCArIHVhICogKGEyLnggLSBhMS54KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYTEueSArIHVhICogKGEyLnkgLSBhMS55KVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBuZXcgSW50ZXJzZWN0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIHVhX3QgPT09IDAgfHwgdWJfdCA9PT0gMCApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBJbnRlcnNlY3Rpb24oXCJDb2luY2lkZW50XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbihcIlBhcmFsbGVsXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAgaW50ZXJzZWN0UmF5UmF5XHJcbiAgICAgKlxyXG4gICAgICogIEBwYXJhbSB7UG9pbnQyRH0gYTFcclxuICAgICAqICBAcGFyYW0ge1BvaW50MkR9IGEyXHJcbiAgICAgKiAgQHBhcmFtIHtQb2ludDJEfSBiMVxyXG4gICAgICogIEBwYXJhbSB7UG9pbnQyRH0gYjJcclxuICAgICAqICBAcmV0dXJucyB7SW50ZXJzZWN0aW9ufVxyXG4gICAgICovXHJcbiAgICBpbnRlcnNlY3RSYXlSYXk6IGZ1bmN0aW9uKGExLCBhMiwgYjEsIGIyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuXHJcbiAgICAgICAgdmFyIHVhX3QgPSAoYjIueCAtIGIxLngpICogKGExLnkgLSBiMS55KSAtIChiMi55IC0gYjEueSkgKiAoYTEueCAtIGIxLngpO1xyXG4gICAgICAgIHZhciB1Yl90ID0gKGEyLnggLSBhMS54KSAqIChhMS55IC0gYjEueSkgLSAoYTIueSAtIGExLnkpICogKGExLnggLSBiMS54KTtcclxuICAgICAgICB2YXIgdV9iICA9IChiMi55IC0gYjEueSkgKiAoYTIueCAtIGExLngpIC0gKGIyLnggLSBiMS54KSAqIChhMi55IC0gYTEueSk7XHJcblxyXG4gICAgICAgIGlmICggdV9iICE9PSAwICkge1xyXG4gICAgICAgICAgICB2YXIgdWEgPSB1YV90IC8gdV9iO1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbigpO1xyXG4gICAgICAgICAgICByZXN1bHQucG9pbnRzLnB1c2goXHJcbiAgICAgICAgICAgICAgICBuZXcgUG9pbnQyRChcclxuICAgICAgICAgICAgICAgICAgICBhMS54ICsgdWEgKiAoYTIueCAtIGExLngpLFxyXG4gICAgICAgICAgICAgICAgICAgIGExLnkgKyB1YSAqIChhMi55IC0gYTEueSlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIHVhX3QgPT09IDAgfHwgdWJfdCA9PT0gMCApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBJbnRlcnNlY3Rpb24oXCJDb2luY2lkZW50XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbihcIlBhcmFsbGVsXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGNvbXBvc2VkU2hhcGVNZXRob2RzID0ge307XHJcbmNvbXBvc2VkU2hhcGVNZXRob2RzW0lQVFlQRS5QQVRIXSA9IGludGVyc2VjdGlvbkZ1bmN0aW9ucy5pbnRlcnNlY3RQYXRoU2hhcGU7XHJcbmNvbXBvc2VkU2hhcGVNZXRob2RzW0lQVFlQRS5QT0xZTElORV0gPSBpbnRlcnNlY3Rpb25GdW5jdGlvbnMuaW50ZXJzZWN0TGluZXNTaGFwZTtcclxuY29tcG9zZWRTaGFwZU1ldGhvZHNbSVBUWVBFLlBPTFlHT05dID0gaW50ZXJzZWN0aW9uRnVuY3Rpb25zLmludGVyc2VjdExpbmVzU2hhcGU7XHJcbmNvbXBvc2VkU2hhcGVNZXRob2RzW0lQVFlQRS5SRUNUXSA9IGludGVyc2VjdGlvbkZ1bmN0aW9ucy5pbnRlcnNlY3RMaW5lc1NoYXBlO1xyXG5jb21wb3NlZFNoYXBlTWV0aG9kc1tJUFRZUEUuUk9VTkRSRUNUXSA9IGludGVyc2VjdGlvbkZ1bmN0aW9ucy5pbnRlcnNlY3RQYXRoU2hhcGU7XHJcbmNvbXBvc2VkU2hhcGVNZXRob2RzW0lQVFlQRS5BUkNdID0gaW50ZXJzZWN0aW9uRnVuY3Rpb25zLmludGVyc2VjdEFyY1NoYXBlO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBpbnRlcnNlY3Qoc2hhcGUxLCBzaGFwZTIsIG0xLCBtMikge1xyXG4gICAgdmFyIGlwMSA9IHNoYXBlMTtcclxuICAgIHZhciBpcDIgPSBzaGFwZTI7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG5cclxuICAgIGlmIChpcDEgIT09IG51bGwgJiYgaXAyICE9PSBudWxsKSB7XHJcbiAgICAgICAgdmFyIG1ldGhvZDtcclxuICAgICAgICBpZiAobWV0aG9kID0gY29tcG9zZWRTaGFwZU1ldGhvZHNbaXAxLnR5cGVdKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG1ldGhvZChpcDEsIGlwMiwgbTEsIG0yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobWV0aG9kID0gY29tcG9zZWRTaGFwZU1ldGhvZHNbaXAyLnR5cGVdKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG1ldGhvZChpcDIsIGlwMSwgbTIsIG0xKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXM7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyYW1zMSwgcGFyYW1zMiwgdHlwZTEsIHR5cGUyO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlwMS50eXBlID09PSBJUFRZUEUuQ0lSQ0xFKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMxID0gW2lwMS5wYXJhbXNbMF0sIGlwMS5wYXJhbXNbMV0sIGlwMS5wYXJhbXNbMV1dO1xyXG4gICAgICAgICAgICAgICAgdHlwZTEgPSBJUFRZUEUuRUxMSVBTRTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtczEgPSBpcDEucGFyYW1zLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICB0eXBlMSA9IGlwMS50eXBlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXAyLnR5cGUgPT09IElQVFlQRS5DSVJDTEUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtczIgPSBbaXAyLnBhcmFtc1swXSwgaXAyLnBhcmFtc1sxXSwgaXAyLnBhcmFtc1sxXV07XHJcbiAgICAgICAgICAgICAgICB0eXBlMiA9IElQVFlQRS5FTExJUFNFO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zMiA9IGlwMi5wYXJhbXMuc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgIHR5cGUyID0gaXAyLnR5cGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vdmFyIG0xID0gbmV3IE1hdHJpeDJEKCksIG0yID0gbmV3IE1hdHJpeDJEKCk7XHJcbiAgICAgICAgICAgIHZhciBTTUYgPSAxO1xyXG4gICAgICAgICAgICB2YXIgaXRtO1xyXG4gICAgICAgICAgICB2YXIgdXNlQ1RNID0gKG0xIGluc3RhbmNlb2YgTWF0cml4MkQgJiYgbTIgaW5zdGFuY2VvZiBNYXRyaXgyRCk7Ly8gJiYgKCFtMS5pc0lkZW50aXR5KCkgfHwgIW0yLmlzSWRlbnRpdHkoKSkpO1xyXG4gICAgICAgICAgICBpZiAodXNlQ1RNKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZTEgPT09IElQVFlQRS5FTExJUFNFICYmIHR5cGUyID09PSBJUFRZUEUuRUxMSVBTRSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtMV8sIG0yXztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZDI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMxID0gcGFyYW1zMVswXSwgcngxID0gcGFyYW1zMVsxXSwgcnkxID0gcGFyYW1zMVsyXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYzIgPSBwYXJhbXMyWzBdLCByeDIgPSBwYXJhbXMyWzFdLCByeTIgPSBwYXJhbXMyWzJdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtMSA9IG0xLm11bHRpcGx5KE1hdHJpeDJELklERU5USVRZLnRyYW5zbGF0ZShjMS54LCBjMS55KS5zY2FsZU5vblVuaWZvcm0ocngxIC8gU01GLCByeTEgLyBTTUYpKTtcclxuICAgICAgICAgICAgICAgICAgICBjMSA9IG5ldyBQb2ludDJEKDAsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJ4MSA9IHJ5MSA9IFNNRjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbTIgPSBtMi5tdWx0aXBseShNYXRyaXgyRC5JREVOVElUWS50cmFuc2xhdGUoYzIueCwgYzIueSkuc2NhbGVOb25Vbmlmb3JtKHJ4MiwgcnkyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYzIgPSBuZXcgUG9pbnQyRCgwLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICByeDIgPSByeTIgPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkMiA9IG0xLmludmVyc2UoKS5tdWx0aXBseShtMikuZ2V0RGVjb21wb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIG0xXyA9IGQyLnJvdGF0aW9uLmludmVyc2UoKS5tdWx0aXBseShkMi50cmFuc2xhdGlvbi5pbnZlcnNlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIG0yXyA9IGQyLnNjYWxlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByeDIgPSBtMl8uYTtcclxuICAgICAgICAgICAgICAgICAgICByeTIgPSBtMl8uZDtcclxuICAgICAgICAgICAgICAgICAgICBjMSA9IGMxLnRyYW5zZm9ybShtMV8pO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0bSA9IG0xLm11bHRpcGx5KG0xXy5pbnZlcnNlKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMxWzBdID0gYzE7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zMVsxXSA9IHJ4MTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMxWzJdID0gcnkxO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczJbMF0gPSBjMjtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMyWzFdID0gcngyO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczJbMl0gPSByeTI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNQYXJhbXMgPSBmdW5jdGlvbiAodHlwZSwgcGFyYW1zLCBtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc1BhcmFtID0gZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1tpXSA9IHBhcmFtc1tpXS50cmFuc2Zvcm0obSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBJUFRZUEUuTElORSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNQYXJhbSgwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zUGFyYW0oMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gSVBUWVBFLkJFWklFUjIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zUGFyYW0oMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc1BhcmFtKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNQYXJhbSgyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBJUFRZUEUuQkVaSUVSMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNQYXJhbSgwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zUGFyYW0oMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc1BhcmFtKDIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNQYXJhbSgzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBzaGFwZTogJyArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZTIgPT09IElQVFlQRS5FTExJUFNFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcCA9IHBhcmFtczI7IHBhcmFtczIgPSBwYXJhbXMxOyBwYXJhbXMxID0gdG1wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0bXAgPSB0eXBlMjsgdHlwZTIgPSB0eXBlMTsgdHlwZTEgPSB0bXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcCA9IG0yOyBtMiA9IG0xOyBtMSA9IHRtcDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlMSA9PT0gSVBUWVBFLkVMTElQU0UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGMxID0gcGFyYW1zMVswXSwgcngxID0gcGFyYW1zMVsxXSwgcnkxID0gcGFyYW1zMVsyXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0xID0gbTEubXVsdGlwbHkoTWF0cml4MkQuSURFTlRJVFkudHJhbnNsYXRlKGMxLngsIGMxLnkpLnNjYWxlTm9uVW5pZm9ybShyeDEgLyBTTUYsIHJ5MSAvIFNNRikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjMSA9IG5ldyBQb2ludDJEKDAsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByeDEgPSByeTEgPSBTTUY7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtMl8gPSBtMS5pbnZlcnNlKCkubXVsdGlwbHkobTIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc1BhcmFtcyh0eXBlMiwgcGFyYW1zMiwgbTJfKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0bSA9IG0xO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zMVswXSA9IGMxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMxWzFdID0gcngxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMxWzJdID0gcnkxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNQYXJhbXModHlwZTEsIHBhcmFtczEsIG0xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNQYXJhbXModHlwZTIsIHBhcmFtczIsIG0yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRtID0gTWF0cml4MkQuSURFTlRJVFk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZTEgPCB0eXBlMikge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gXCJpbnRlcnNlY3RcIiArIHR5cGUxICsgdHlwZTI7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMxLmNvbmNhdChwYXJhbXMyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IFwiaW50ZXJzZWN0XCIgKyB0eXBlMiArIHR5cGUxO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zMi5jb25jYXQocGFyYW1zMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGludGVyc2VjdGlvbkZ1bmN0aW9uc1ttZXRob2RdLmFwcGx5KG51bGwsIHBhcmFtcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXNlQ1RNKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucG9pbnRzW2ldID0gcmVzdWx0LnBvaW50c1tpXS50cmFuc2Zvcm0oaXRtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbmV3IEludGVyc2VjdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZvcih2YXIga2V5IGluIGJlemllckludGVyc2VjdGlvbkZ1bmN0aW9ucykge1xyXG4gICAgaWYoYmV6aWVySW50ZXJzZWN0aW9uRnVuY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICBpbnRlcnNlY3Rpb25GdW5jdGlvbnNba2V5XSA9IGJlemllckludGVyc2VjdGlvbkZ1bmN0aW9uc1trZXldO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGludGVyc2VjdDtcclxuXHJcbn0se1wiLi9JbnRlcnNlY3Rpb25cIjo5LFwiLi9JbnRlcnNlY3Rpb25QYXJhbXNcIjoxMCxcIi4vZnVuY3Rpb25zL2JlemllclwiOjExLFwia2xkLWFmZmluZVwiOjEsXCJrbGQtcG9seW5vbWlhbFwiOjV9XX0se30sWzhdKSg4KVxyXG59KTtcclxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0ICogYXMgaW50ZXIgZnJvbSBcIi4vaW50ZXJzZWN0aW9ucy5qc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3JkZXIge1xyXG4gICAgLy8gb2Qga2R5IHNlIHphY25lIGplZG5vIG9zYSBwcmlibGl6b3ZhdCBrIGRydWhlLCBuZWJvIGplZG5hIG9kZGFsb3ZhdCBvZCBkcnVoZVxyXG4gICAgcGF0aFNoaWZ0ID0gNTA7XHJcbiAgICAvLyByb3pkaWwgbWV6aSB1bWlzdGVuaW0gb3NcclxuICAgIGRpZmYgPSAxNTA7XHJcbiAgICAvL1xyXG4gICAgY29ublNoaWZ0ID0gMjU7XHJcbiAgICAvLyBtaW5pbWFsbmkgZGF0dW1cclxuICAgIG1pbiA9IDA7XHJcbiAgICAvLyBtYXhpbWFsbmkgZGF0dW1cclxuICAgIG1heCA9IDA7XHJcbiAgICAvLyB6YXRpbSBidWRvdSB0YWtlIG5la29uZWNuZSB2c2VjaG55LCBUT0RPOiBkb2RlbGF0IG1ldG9keSBtYWtlUGF0aEkuLi4gbWFrZVBhdGhPdGhlclxyXG4gICAgZXh0ZW5kID0gMzAwMDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdnJhdCBlbGVtZW50LCBrdGVyeSBieWwgdW1pc3RlbiBqYWtvIHBydm5pIGRvIHZpenVhbGl6YWNlXHJcbiAgICBnZXRNaW5JZHhGcm9tKGNvbW1vbiwgcGxhY2VkQ29tbW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHBsYWNlZENvbW1vbi5pbmRleE9mKGNvbW1vbi5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcclxuICAgICAgICAgICAgbGV0IHByZXZJID0gcGxhY2VkQ29tbW9uLmluZGV4T2YocHJldik7XHJcbiAgICAgICAgICAgIGxldCBjdXJySSA9IHBsYWNlZENvbW1vbi5pbmRleE9mKGN1cnIpO1xyXG4gICAgICAgICAgICBsZXQgcmVzO1xyXG4gICAgICAgICAgICBpZiAocHJldkkgPT09IC0xICYmIGN1cnJJID09PSAtMSlcclxuICAgICAgICAgICAgICAgIHJlcyA9IHByZXY7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHByZXZJICE9PSAtMSAmJiBjdXJySSA9PT0gLTEgfHwgcHJldkkgPT09IC0xICYmIGN1cnJJICE9PSAtMSlcclxuICAgICAgICAgICAgICAgIHJlcyA9IChwcmV2SSA9PT0gLTEpID8gY3VyciA6IHByZXY7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlcyA9IChwcmV2SSA8IGN1cnJJKSA/IHByZXYgOiBjdXJyO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBaIGRhdCB0eXB1IHByZWRtZXQgb3NvYm5vc3QgenZpcmUgdWRlbGEgc3BlY2lhbG5lIGNlc3R5XHJcbiAgICBtYWtlUGF0aEl0ZW1QZXJzb24oKSB7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gcHJvIHZzZWNobnkgb3N0YXRuaSB0YWd5XHJcbiAgICBtYWtlUGF0aE90aGVyKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyB2eXR2b3Igb3N1IG5hIHpha2xhZGUgdWRhbG9zdGksIGt0ZXJlIHNlIG5hIG5pIG9kZWhyYXZhamkgYSBqZWppY2ggc291dmlzbG9zdGkgcyBvc3RhdG5pbWkgb3NhbWlcclxuICAgIG1ha2VQYXRoRXZlbnRzKGl0ZW0sIGxldmVscywgbmFtZXMsIHN0YXJ0LCBkYXR1bSwgZXZlbnRzLCBjb21tb25FdmVudHMpIHtcclxuICAgICAgICAvLyBwcm9qZGkgdnNlY2hueSB1ZGFsb3N0aSBkYW5lIG9zeVxyXG4gICAgICAgIGZvciAobGV0IGV2ZW50IG9mIGl0ZW0uZXZlbnRzKSB7XHJcbiAgICAgICAgICAgIC8vIHpqaXN0aSBzIGt5bSBzb3V2aXNpIGEgamVzdGUgbmVuaSB1bWlzdGVuXHJcbiAgICAgICAgICAgIGxldCBjb21tb24gPSBldmVudC5maWx0ZXJzLm1hcCgoaXRlbSkgPT4gaXRlbS5uYW1lKTtcclxuICAgICAgICAgICAgLy8gc291dmlzaSBzIHRlbWl0byB1bWlzdGVueW1pXHJcbiAgICAgICAgICAgIGxldCBwbGFjZWRDb21tb24gPSBsZXZlbHMubWFwKChpdGVtKSA9PiBpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICAvLyBtaW5pbWFsbmkgaW5kZXgsIGtlIGt0ZXJlbXUgc2UgcHJpYmxpemkgZGFuYSBvc2EgdmUgemtvdW1hbmUgdWRhbG9zdGlcclxuICAgICAgICAgICAgbGV0IG1pbklkeCA9IHRoaXMuZ2V0TWluSWR4RnJvbShjb21tb24sIHBsYWNlZENvbW1vbik7XHJcbiAgICAgICAgICAgIC8vIHZ5dHZvciBwcmlzbHVzbnkgZXZlbnRcclxuICAgICAgICAgICAgbGV0IHRtcEV2ID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGV2ZW50LmlkLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogZXZlbnQubmFtZSxcclxuICAgICAgICAgICAgICAgIGRlc2M6IGV2ZW50LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgaWNvbjogZXZlbnQuaWNvbi5wYXRoLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyczogY29tbW9uLFxyXG4gICAgICAgICAgICAgICAgY2xzOiBpdGVtLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBiY2tfeDogZXZlbnQuYmVnaW4sXHJcbiAgICAgICAgICAgICAgICB5OiB1bmRlZmluZWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBzZGlsaSBuZWtkbyBrZG8gdXogamUgdW1pc3RlbiB0dXRvIHVkYWxvc3Q/IEEgbmVrZG8geiBjZWthamljaWNoPyBORXwgbmlrZG8geiB1bWlzdGVueWNoIGFuaSBjZWthamljaWNoIGppIG5lbWFcclxuICAgICAgICAgICAgaWYgKGNvbW1vbi5zb21lKHIgPT4gcGxhY2VkQ29tbW9uLmluZGV4T2YocikgPj0gMCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlbGthIGRhbmUgdWRhbG9zdGlcclxuICAgICAgICAgICAgICAgIGxldCBkdXIgPSBldmVudC5lbmQgIT09IHVuZGVmaW5lZCA/IGV2ZW50LmVuZCAtIGV2ZW50LmJlZ2luIDogMTtcclxuICAgICAgICAgICAgICAgIC8vIGt0ZXJ5bSBzbWVyZW0gamUgbnV0bmUgcG9zbGF0IG9zdVxyXG4gICAgICAgICAgICAgICAgbGV0IGRpciA9IChsZXZlbHNbbWluSWR4XS5zdGFydCA+IHN0YXJ0ID8gLTEgOiAxKTtcclxuICAgICAgICAgICAgICAgIC8vIHprb25zdHJ1dWogb2Jsb3VrXHJcbiAgICAgICAgICAgICAgICBkYXR1bS5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHt4OiBldmVudC5iZWdpbiAtIHRoaXMucGF0aFNoaWZ0LCB5OiBzdGFydH0sXHJcbiAgICAgICAgICAgICAgICAgICAge3g6IGV2ZW50LmJlZ2luLCB5OiBsZXZlbHNbbWluSWR4XS5zdGFydCArIGRpciAqIHRoaXMuY29ublNoaWZ0fSxcclxuICAgICAgICAgICAgICAgICAgICB7eDogZXZlbnQuYmVnaW4gKyBkdXIsIHk6IGxldmVsc1ttaW5JZHhdLnN0YXJ0ICsgZGlyICogdGhpcy5jb25uU2hpZnR9LFxyXG4gICAgICAgICAgICAgICAgICAgIHt4OiBldmVudC5iZWdpbiArIGR1ciArIHRoaXMucGF0aFNoaWZ0LCB5OiBzdGFydH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gdXByYXYga29uZWMgYSB6YWNhdGVrIG9zeVxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmJlZ2luICsgdGhpcy5wYXRoU2hpZnQgPiB0aGlzLm1heClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1heCA9IGV2ZW50LmJlZ2luICsgdGhpcy5wYXRoU2hpZnQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYmVnaW4gLSB0aGlzLnBhdGhTaGlmdCA8IHRoaXMubWluKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWluID0gZXZlbnQuYmVnaW4gLSB0aGlzLnBhdGhTaGlmdDtcclxuICAgICAgICAgICAgICAgIC8vIHByaSB1bWlzdGVuaSB1ZGFsb3N0aSBidWRlIGppbmUgeSwgcHJvdG96ZSB1eiBqaSBuZWtkbyBzZSBtbm91IHNkaWxpIGEgamEgc2UgbXVzaW0gZG9zdGF0IGsgbmVtdVxyXG4gICAgICAgICAgICAgICAgaWYgKCghY29tbW9uLnNvbWUociA9PiBuYW1lcy5pbmRleE9mKHIpID49IDApKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB5U2hpZnQgPSBsZXZlbHNbbWluSWR4XS5zdGFydCArICgoZGlyID09PSAtMSkgPyBkaXIgKiB0aGlzLmNvbm5TaGlmdCAqIDMgOiB0aGlzLmNvbm5TaGlmdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlcyA9IGNvbW1vbkV2ZW50cy5maW5kKChlbCkgPT4gZWwueCA9PT0gdG1wRXYuYmVnaW4gJiYgZWwueSA9PT0geVNoaWZ0ICYmIGVsLmlkICE9PSBldmVudC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG1wRXYueSA9IHlTaGlmdDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbkV2ZW50cy5wdXNoKHt4OmV2ZW50LmJlZ2luLCB5OnlTaGlmdCwgZXZlbnRsaXN0Olt0bXBFdl19KTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5ldmVudGxpc3QucHVzaCh0bXBFdik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7Ly8gbmljIHNwb2xlY25laG9cclxuICAgICAgICAgICAgICAgIC8vIHBva3VkIG5lbmkgemFkbnkgZGFsc2kgc3BvbGVjbnkgdW1pc3RpLCBqaW5hayBuZWNoIG5hIGRhbHNpbVxyXG4gICAgICAgICAgICAgICAgaWYgKCFjb21tb24uc29tZShyID0+IG5hbWVzLmluZGV4T2YocikgPj0gMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0bXBFdi55ID0gc3RhcnQgLSB0aGlzLmNvbm5TaGlmdDtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaCh0bXBFdik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4vLyB2ZXptZSBwcmVkYXZhbmEgZGF0YSBhIHVkZWxhIHBydWJlaCBjZXN0eSBwcm8gamVkbm90bGl2ZSBvc3ksIHBva3VkIG1hamkgYWxlc3BvbiBuZWpha2UgdWRhbG9zdGlcclxuICAgIG1ha2VWaWV3KCkge1xyXG4gICAgICAgIC8vIHBvbGUgdWRhbG9zdGlcclxuICAgICAgICBsZXQgZXZlbnRzID0gW107XHJcbiAgICAgICAgLy8gcG9sZSB1cm92bmkgamVkbm90bGl2eWNoIGNhc292eWNoIG9zXHJcbiAgICAgICAgbGV0IGxldmVscyA9IFtdO1xyXG4gICAgICAgIC8vIGtkZSBzZSBtYSB6YWNpdFxyXG4gICAgICAgIGxldCBzdGFydCA9IGQzLnNlbGVjdChcIi5jYW52YXNEcmF3XCIpLm5vZGUoKS5jbGllbnRIZWlnaHQgLyAyO1xyXG4gICAgICAgIC8vIHNwb2xlY25lIHVkYWxvc3RpXHJcbiAgICAgICAgbGV0IGNvbW1vbkV2ZW50cyA9IFtdO1xyXG4gICAgICAgIC8vIHBvcmFkaSBwcm8gcHJvaGF6b3Zhbmkgb3NcclxuICAgICAgICB0aGlzLmNvbnRleHQuYWN0aXZlT3JkZXIgPSBbXTtcclxuICAgICAgICAvLyBzZXpuYW0gam1lbiBvcywga3RlcmUgc2UgYnVkb3UgdnlrcmVzbG92YXRcclxuICAgICAgICBsZXQgbmFtZXMgPSB0aGlzLmNvbnRleHQuYWN0aXZlLm1hcCgoaXRlbSkgPT4gaXRlbS5uYW1lKTtcclxuICAgICAgICAvLyBwcm9qZGkgdnNlY2h5IGFrdGl2bmkgb3N5XHJcbiAgICAgICAgZm9yIChsZXQgW2lkeCxpdGVtXSBvZiB0aGlzLmNvbnRleHQuYWN0aXZlLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgICAvLyB6amlzdGkgemFjYXRreSBhIGtvbmNlXHJcbiAgICAgICAgICAgIHRoaXMubWluID0gdGhpcy5jb250ZXh0Lm1pbkRhdGUgLSB0aGlzLnBhdGhTaGlmdDtcclxuICAgICAgICAgICAgdGhpcy5tYXggPSB0aGlzLmNvbnRleHQubWF4RGF0ZSArIHRoaXMucGF0aFNoaWZ0O1xyXG4gICAgICAgICAgICAvLyBvZHN0cmFuIHogY2VrYWppY2ljaCBuYSB6cHJhY292YW5pXHJcbiAgICAgICAgICAgIG5hbWVzLnNwbGljZShuYW1lcy5pbmRleE9mKGl0ZW0ubmFtZSksIDEpO1xyXG4gICAgICAgICAgICAvLyBrZGUgYnVkZSBkYW5hIG9zYSB6YWNpbmF0P1xyXG4gICAgICAgICAgICBzdGFydCArPSAoKChpZHggJSAyKSA9PT0gMCkgPyBpZHggOiAtaWR4KSAqIHRoaXMuZGlmZjtcclxuICAgICAgICAgICAgLy8gcHJpZGVqIGRhbm91IG9zdSBkbyBwb2xlIG5hIHByb2hhem92YW5pXHJcbiAgICAgICAgICAgIChpZHggJSAyKSA9PT0gMCA/IHRoaXMuY29udGV4dC5hY3RpdmVPcmRlci5wdXNoKGl0ZW0uY2xzTmFtZSkgOiB0aGlzLmNvbnRleHQuYWN0aXZlT3JkZXIudW5zaGlmdChpdGVtLmNsc05hbWUpO1xyXG4gICAgICAgICAgICAvLyB1cmNpIHBvY2F0ZWNuaSBib2QgY2Fzb3ZlIG9zeVxyXG4gICAgICAgICAgICBsZXQgZGF0dW0gPSBbe3g6IHRoaXMubWluIC0gdGhpcy5leHRlbmQsIHk6IHN0YXJ0fV07XHJcbiAgICAgICAgICAgIC8vIHByb2pkaSBldmVudHkgYSB6amlzdGkgamFrIGplIHNwcmF2bmUgdW1pc3RpdFxyXG4gICAgICAgICAgICB0aGlzLm1ha2VQYXRoRXZlbnRzKGl0ZW0sIGxldmVscywgbmFtZXMsIHN0YXJ0LCBkYXR1bSwgZXZlbnRzLCBjb21tb25FdmVudHMpO1xyXG4gICAgICAgICAgICAvLyB2bG96IHBvc2xlZG5pIGJvZCBjYXNvdmUgb3N5XHJcbiAgICAgICAgICAgIGRhdHVtLnB1c2goe3g6IHRoaXMubWF4ICsgdGhpcy5leHRlbmQsIHk6IHN0YXJ0fSk7XHJcbiAgICAgICAgICAgIC8vIHVsb3ogdnNlY2hueSBkdWxleml0ZSBjYXN0aSBkbyBsZXZlbHNcclxuICAgICAgICAgICAgbGV2ZWxzLnB1c2goe25hbWU6IGl0ZW0ubmFtZSwgY2xzTmFtZTogaXRlbS5jbHNOYW1lLCBzdGFydDogc3RhcnQsIGRhdHVtOiBkYXR1bSwgY29sb3I6IGl0ZW0uY29sb3IsIGltZ1BhdGg6aXRlbS5pY29uUGF0aH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3BhdGhzOiBsZXZlbHMsIGV2ZW50czogZXZlbnRzLCBjb21tb25FdmVudHM6IGNvbW1vbkV2ZW50c307XHJcbiAgICB9XHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gbWV0b2RhIHBybyBuYWhvZG5lIHBvcmFkaSBvc1xyXG4gICAgcmFuZG9tT3JkZXIoYikge1xyXG4gICAgICAgIHRoaXMuY29udGV4dC51cGRhdGVTY2FsZXMoKTtcclxuICAgICAgICBjb25zdCBlbnRyaWVzQ291bnQgPSB0aGlzLmNvbnRleHQuYWN0aXZlLmxlbmd0aDtcclxuICAgICAgICBsZXQgaWR4cyA9IFsuLi5BcnJheShlbnRyaWVzQ291bnQpLmtleXMoKV07XHJcbiAgICAgICAgaWR4cyA9IHRoaXMuY29udGV4dC5zaHVmZmVsQXJyYXkoaWR4cyk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LmFjdGl2ZSA9IGlkeHMubWFwKGkgPT4gdGhpcy5jb250ZXh0LmFjdGl2ZVtpXSk7XHJcbiAgICAgICAgYi5kcmF3UmVzKHRoaXMubWFrZVZpZXcoKSk7XHJcbiAgICB9XHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gdmV6bWUgcG9sZSBpbmRleHUgYSB2cmF0aSB2c2VjaG55IG1vem5lIHBlcm11dGFjZVxyXG4gICAgcGVybXV0YXRlKGlkeEFycmF5LCBpZHhDb3VudCkge1xyXG4gICAgICAgIGxldCBjID0gbmV3IEFycmF5KGlkeENvdW50KS5maWxsKDApO1xyXG4gICAgICAgIGxldCByZXMgPSBbWy4uLmlkeEFycmF5XV07XHJcbiAgICAgICAgbGV0IGkgPSAxO1xyXG4gICAgICAgIHdoaWxlIChpIDwgaWR4Q291bnQpIHtcclxuICAgICAgICAgICAgaWYgKGNbaV0gPCBpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAlIDIgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgW2lkeEFycmF5WzBdLCBpZHhBcnJheVtpXV0gPSBbaWR4QXJyYXlbaV0sIGlkeEFycmF5WzBdXTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBbaWR4QXJyYXlbY1tpXV0sIGlkeEFycmF5W2ldXSA9IFtpZHhBcnJheVtpXSwgaWR4QXJyYXlbY1tpXV1dO1xyXG4gICAgICAgICAgICAgICAgcmVzLnB1c2goWy4uLmlkeEFycmF5XSk7XHJcbiAgICAgICAgICAgICAgICBjW2ldKys7XHJcbiAgICAgICAgICAgICAgICBpID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNbaV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3BvY3RpIGtvbGlrIG1hamkgemFkYW5lIG9zeSBwcnVzZWNpa3VcclxuICAgIGdldE51bWJlck9mSW50ZXJzZWN0aW9uKGRhdGEpIHtcclxuICAgICAgICBsZXQgcGF0aHMgPSBkYXRhLm1hcChpdGVtID0+IGl0ZW0uZGF0dW0pO1xyXG4gICAgICAgIGxldCBwYWlycyA9IFtdO1xyXG4gICAgICAgIGxldCBudW1JbnQgPSAwO1xyXG4gICAgICAgIC8vIHppc2tlaiB2c2VjaG55IGR2b2ppY2VcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBwYXRocy5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAgICAgIHBhaXJzLnB1c2goW2ksal0pO1xyXG4gICAgICAgIC8vIHNwb2NpdGVqIHZzZWNobnkgcHJ1c2VjaWt5XHJcbiAgICAgICAgZm9yIChsZXQgW2ksal0gb2YgcGFpcnMpe1xyXG4gICAgICAgICAgICBsZXQgcmVzID0gaW50ZXIuaW50ZXJzZWN0KGludGVyLnNoYXBlKFwicGF0aFwiLCB7ZDogdGhpcy5jb250ZXh0LmFyZWEocGF0aHNbaV0pfSksXHJcbiAgICAgICAgICAgICAgICBpbnRlci5zaGFwZShcInBhdGhcIiwge2Q6IHRoaXMuY29udGV4dC5hcmVhKHBhdGhzW2pdKX0pKTtcclxuICAgICAgICAgICAgbnVtSW50ICs9IHJlcy5wb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVtSW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG1ldG9kYSBwcm8gemppc3Rlbmkgb3B0aW1hbG5paG8gcG9yYWRpIG9zLCBicnV0ZSBmb3JjZSB2ZXJ6ZVxyXG4gICAgYnJ1dGVGb3JjZU9yZGVyKGIpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQudXBkYXRlU2NhbGVzKCk7XHJcbiAgICAgICAgY29uc3QgZW50cmllc0NvdW50ID0gdGhpcy5jb250ZXh0LmFjdGl2ZS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgaWR4cyA9IFsuLi5BcnJheShlbnRyaWVzQ291bnQpLmtleXMoKV07XHJcbiAgICAgICAgY29uc3QgcGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRhdGUoaWR4cywgZW50cmllc0NvdW50KTtcclxuICAgICAgICAvLyBvYnNhaHVqZSBuZWpsZXBzaSBwZXJtdXRhY2kgdiBwb2N0dSBrcml6ZW5pXHJcbiAgICAgICAgbGV0IGJlc3RQZXJtID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIC8vIHpqaXN0aSBrdGVyYSBwZXJtdXRhY2UgbWEgbmVqbWVuZSBwcnVuaWt1XHJcbiAgICAgICAgZm9yIChsZXQgcGVybSBvZiBwZXJtdXRhdGlvbnMpIHtcclxuICAgICAgICAgICAgLy8gbWFtIG5vdmUgcG9yYWRpXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hY3RpdmUgPSBwZXJtLm1hcChyID0+IHRoaXMuY29udGV4dC5hY3RpdmVbcl0pO1xyXG4gICAgICAgICAgICAvLyB6amlzdGkgcHJ1YmVoIGNlc3QgcHJvIGRhbmUgcG9yYWRpXHJcbiAgICAgICAgICAgIGxldCB0bXBQYXRocyA9IHRoaXMubWFrZVZpZXcodGhpcy5jb250ZXh0LmFjdGl2ZSk7XHJcbiAgICAgICAgICAgIC8vIHpqaXN0aSAjIHBydXNlY2lrdSBwcm8gYWt0dWFsbmkgcHJ1YmVoeVxyXG4gICAgICAgICAgICBsZXQgbnVtSW50ID0gdGhpcy5nZXROdW1iZXJPZkludGVyc2VjdGlvbih0bXBQYXRocy5wYXRocyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBlcm0sIG51bUludCk7XHJcbiAgICAgICAgICAgIC8vIHVyY2kgbm92bm91IG5lamxlcHNpIHBlcm11dGFjaSBuZWJvIHphY2hvdmVqIHB1dm9kbmlcclxuICAgICAgICAgICAgaWYgKGJlc3RQZXJtID09PSB1bmRlZmluZWQgfHwgYmVzdFBlcm0ubnVtSW50ID4gbnVtSW50KVxyXG4gICAgICAgICAgICAgICAgYmVzdFBlcm0gPSB7bnVtSW50OiBudW1JbnQsIHBlcm06IHBlcm0sIHJlczogdG1wUGF0aHN9O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB6cHJlaGF6ZWogb3N5XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LmFjdGl2ZSA9IGJlc3RQZXJtLnBlcm0ubWFwKHIgPT4gdGhpcy5jb250ZXh0LmFjdGl2ZVtyXSk7XHJcbiAgICAgICAgLy8gdnlrcmVzbGlcclxuICAgICAgICBiLmRyYXdSZXMoYmVzdFBlcm0ucmVzKTtcclxuICAgIH1cclxuXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gdnl0dm9yIHZ6dGFoeSBtZXppIG9zYW1pXHJcbiAgICBnZXRFZGdlcyhmaWx0RXZlbnRzLCBuYW1lcykge1xyXG4gICAgICAgIC8vIHZ5c2xlZG5lIGhyYW55XHJcbiAgICAgICAgbGV0IGVkZ2VzID0gW11cclxuICAgICAgICAvLyBwcm9qZGkgdWRhbG9zdGlcclxuICAgICAgICBmaWx0RXZlbnRzLmZvckVhY2goIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSBldmVudC5maWx0ZXJzLm1hcCggaXRlbSA9PiBpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICAvLyBwcm9qZGkgZmlsdHJ5IGEgdnl0dm9yIHNwb2puaWNlXHJcbiAgICAgICAgICAgIGZpbHRlcnMuZm9yRWFjaCggKHNvdXJjZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVycy5mb3JFYWNoKCAodGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZSAhPT0gdGFyZ2V0ICYmIG5hbWVzLmluZGV4T2Yoc291cmNlKSAhPT0gLTEgJiYgbmFtZXMuaW5kZXhPZih0YXJnZXQpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlcy5wdXNoKHtcInNvdXJjZVwiOm5hbWVzLmluZGV4T2Yoc291cmNlKSwgXCJ0YXJnZXRcIjpuYW1lcy5pbmRleE9mKHRhcmdldCl9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBlZGdlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyB6aXNrZWogdnNlY2hueSBldmVudHkgYSBuZWNoIHphIGthemR5IGR1cGxpY2l0bmkgamVuIGplZGVuXHJcbiAgICBnZXRFdmVudHMoYnVmZmVyKSB7XHJcbiAgICAgICAgbGV0IGV2ZW50cyA9IGJ1ZmZlci5tYXAociA9PiByLmV2ZW50cykuZmxhdCgpO1xyXG4gICAgICAgIGV2ZW50cyA9IGV2ZW50cy5maWx0ZXIoKHZhbHVlLCBpbmRleCwgc2VsZikgPT4gaW5kZXggPT09IHNlbGYuZmluZEluZGV4KFxyXG4gICAgICAgICAgICAodCkgPT4gdC5wbGFjZSA9PT0gdmFsdWUucGxhY2UgJiYgdC5pZCA9PT0gdmFsdWUuaWQpKTtcclxuICAgICAgICByZXR1cm4gZXZlbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZ5dHZvciBmcmVrdmVuY25pIHRhYnVsa3VcclxuICAgIG1ha2VGcmVxdWVuY3lUYWJsZShuYW1lcykge1xyXG4gICAgICAgIC8vIGRhdGEgZnJla3ZlbmNpIHZ5c2t5dHVcclxuICAgICAgICBsZXQgZnJlcURhdGEgPSBbXTtcclxuICAgICAgICAvLyB6aXNrZWogdnNlY2hueSBldmVudHlcclxuICAgICAgICBsZXQgZmlsdEV2ZW50cyA9IHRoaXMuZ2V0RXZlbnRzKHRoaXMuY29udGV4dC5hY3RpdmUpO1xyXG4gICAgICAgIC8vIHZ5dHZvciBmcmVrdmVuY25pIHRhYnVsa3UgcHJvIGRhbmUgb3N5XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LmFjdGl2ZS5mb3JFYWNoKChpdGVtKSA9PiBmcmVxRGF0YS5wdXNoKHtcImlkeFwiOiB0aGlzLmNvbnRleHQuYWN0aXZlLmluZGV4T2YoaXRlbSksIFwiZnJlcVwiOiBBcnJheShuYW1lcy5sZW5ndGggKyAxKS5maWxsKDApfSkpO1xyXG4gICAgICAgIC8vIG5hamRpIHNwb2plbmkgb3NcclxuICAgICAgICBsZXQgZWRnZXMgPSB0aGlzLmdldEVkZ2VzKGZpbHRFdmVudHMsIG5hbWVzKTtcclxuICAgICAgICAvLyBzcG9jaXRlaiBmcmVrdmVuY2VcclxuICAgICAgICBlZGdlcy5mb3JFYWNoKGl0ZW0gPT4ge2ZyZXFEYXRhW2l0ZW0uc291cmNlXS5mcmVxW2l0ZW0udGFyZ2V0XSsrOyBmcmVxRGF0YVtpdGVtLnRhcmdldF0uZnJlcVtuYW1lcy5sZW5ndGhdKyt9KTtcclxuICAgICAgICByZXR1cm4gZnJlcURhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZnJla3ZlbmNuaSBtZXRvZGFcclxuICAgIGZyZXF1ZW5jeVRhYmxlKGIpIHtcclxuICAgICAgICAvLyB6YWt0dWFsaXp1aiByb3pzYWh5XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LnVwZGF0ZVNjYWxlcygpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY29udGV4dC5hY3RpdmUpO1xyXG4gICAgICAgIC8vIG5hY3RpIGptZW5hXHJcbiAgICAgICAgY29uc3QgbmFtZXMgPSB0aGlzLmNvbnRleHQuYWN0aXZlLm1hcCgoaXRlbSkgPT4gaXRlbS5uYW1lKTtcclxuICAgICAgICAvLyBwb2xlIDJkIHMgbnVsYW1pLCB2IGRhdGVjaCBhIGptZW5hIGJ1ZG91IGptZW5hIHogdGhpcy5jb250ZXh0LmFjdGl2ZVxyXG4gICAgICAgIGxldCBmcmVxRGF0YSA9IHRoaXMubWFrZUZyZXF1ZW5jeVRhYmxlKG5hbWVzKTtcclxuICAgICAgICAvLyBzZXJhemVuaSB2eXNsZWRuZSB0YWJ1bGt5XHJcbiAgICAgICAgZnJlcURhdGEuc29ydCgoYSxiKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhLmZyZXFbbmFtZXMubGVuZ3RoXSA8IGIuZnJlcVtuYW1lcy5sZW5ndGhdKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGEuZnJlcVtuYW1lcy5sZW5ndGhdID09PSBiLmZyZXFbbmFtZXMubGVuZ3RoXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgbmFtZXMubGVuZ3RoOyBpZHgrKylcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYS5mcmVxW2lkeF0gIT09IGIuZnJlcVtpZHhdICYmIGZyZXFEYXRhLmluZGV4T2YoYSkgIT09IGlkeCAmJiBmcmVxRGF0YS5pbmRleE9mKGIpICE9PSBpZHgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLmZyZXFbaWR4XSA+IGIuZnJlcVtpZHhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHZ5dHZvciBub3ZlIHBvcmFkaSBhIGFwbGlrdWogaG9cclxuICAgICAgICBjb25zdCBvcmRlciA9IGZyZXFEYXRhLm1hcCggKGl0ZW0pID0+IGl0ZW0uaWR4KTtcclxuICAgICAgICB0aGlzLmNvbnRleHQuYWN0aXZlID0gb3JkZXIubWFwKGkgPT4gdGhpcy5jb250ZXh0LmFjdGl2ZVtpXSk7XHJcbiAgICAgICAgLy8gemppc3RpIHBydWJlaCBjZXN0IHBybyBkYW5lIHBvcmFkaSBhIHZ5a3Jlc2xpXHJcbiAgICAgICAgYi5kcmF3UmVzKHRoaXMubWFrZVZpZXcoKSk7XHJcbiAgICB9XHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gdnJhdCBuYWhvZG5lIGNpc2xvIG1lemkgbWluIGEgbWF4XHJcbiAgICBnZXRSbmROdW1iZXIobWluLCBtYXgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbjtcclxuICAgIH1cclxuICAgIC8vIGh0dHBzOi8vb2JzZXJ2YWJsZWhxLmNvbS9AYmVuLXRhbmVuL2EtdHV0b3JpYWwtdG8tdXNpbmctZDMtZm9yY2UtZnJvbS1zb21lb25lLXdoby1qdXN0LWxlYXJuZWQtaG9cclxuXHJcbiAgICAvLyBwb21vY25hIGZ1bmtjZSBwcm8gdml6dWFsaXphY2kgcHJhY2Ugc2lsb3ZlIG1ldG9keVxyXG4gICAgZHJhd05vZGVzID0gKHN2Zywgbm9kZV9kYXRhLCBlZGdlX2RhdGEpID0+IHtcclxuICAgICAgICBsZXQgZWRnZSA9IG51bGw7XHJcbiAgICAgICAgaWYgKGVkZ2VfZGF0YSkge1xyXG4gICAgICAgICAgICBlZGdlID0gc3ZnLnNlbGVjdEFsbChcIi5lZGdlXCIpXHJcbiAgICAgICAgICAgICAgICAuZGF0YShlZGdlX2RhdGEpLmVudGVyKClcclxuICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJsaW5lXCIpXHJcbiAgICAgICAgICAgICAgICAuY2xhc3NlZChcImVkZ2VcIiwgdHJ1ZSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieDFcIiwgZCA9PiBub2RlX2RhdGFbZC5zb3VyY2VdLngpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInkxXCIsIGQgPT4gbm9kZV9kYXRhW2Quc291cmNlXS55KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCBkID0+IG5vZGVfZGF0YVtkLnRhcmdldF0ueClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieTJcIiwgZCA9PiBub2RlX2RhdGFbZC50YXJnZXRdLnkpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjYmJiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IHN2Zy5zZWxlY3RBbGwoXCIubm9kZVwiKVxyXG4gICAgICAgICAgICAuZGF0YShub2RlX2RhdGEpLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChcIm5vZGVcIiwgdHJ1ZSlcclxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBkID0+IGQueClcclxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBkID0+IGQueSlcclxuICAgICAgICAgICAgLmF0dHIoXCJyXCIsIFwiMTBcIik7XHJcblxyXG4gICAgICAgIHJldHVybiBbbm9kZSwgZWRnZV07XHJcbiAgICB9XHJcblxyXG4gICAgLy9odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzQ2MzA1My9jYWxtLWRvd24taW5pdGlhbC10aWNrLW9mLWEtZm9yY2UtbGF5b3V0XHJcbiAgICAvL2h0dHBzOi8vd3d3LmFpcnBhaXIuY29tL2phdmFzY3JpcHQvcG9zdHMvZDMtZm9yY2UtbGF5b3V0LWludGVybmFsc1xyXG4gICAgLy9odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zOTM3OTI5OS9ob3ctZG8teW91LWN1c3RvbWl6ZS10aGUtZDMtbGluay1zdHJlbmd0aC1hcy1hLWZ1bmN0aW9uLW9mLXRoZS1saW5rcy1hbmQtbm9kZXMtY1xyXG4gICAgLy9odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDQwNzA2OS9ob3ctZmluZC1vdXQtaWYtZm9yY2UtbGF5b3V0LWRvbmUtcGxhY2luZy10aGUtbm9kZXNcclxuICAgIC8vIGF1dG9sYXlvdXQsbGF5ZXJlZCBkaWdyYXBoIGxheW91dCwgc2lsb3ZhIG1ldG9kYSBzIHZ5dXppdGltIGtuaWhvdm55IGQzXHJcbiAgICBmb3JjZU1ldGhvZChiKSB7XHJcbiAgICAgICAgLy8gYWt0dWFsaXphY2Ugcm96bWVydVxyXG4gICAgICAgIHRoaXMuY29udGV4dC51cGRhdGVTY2FsZXMoKTtcclxuICAgICAgICAvLyB6aXNrZWogcHJpdG9tbmUgb3N5XHJcbiAgICAgICAgY29uc3QgbmFtZXMgPSB0aGlzLmNvbnRleHQuYWN0aXZlLm1hcCgoaXRlbSkgPT4gaXRlbS5uYW1lKTtcclxuICAgICAgICAvLyBqZWRub3RsaXZlIG9zeSBqYWtvIHV6bHlcclxuICAgICAgICBsZXQgbm9kZXMgPSBbXTtcclxuICAgICAgICAvLyB2eXR2b3IgcmVwcmV6ZW50YWNpIHV6bHVcclxuICAgICAgICBuYW1lcy5mb3JFYWNoKGl0ZW0gPT4gbm9kZXMucHVzaCh7XCJpZFwiOml0ZW0uaW5kZXgsIFwieFwiOiAxNTAsIFwieVwiOnRoaXMuZ2V0Um5kTnVtYmVyKDIwMCw2MDApfSkpO1xyXG4gICAgICAgIC8vIHppc2tlaiB6YWtsYWQgdGVjaHRvIHV6bHVcclxuICAgICAgICBsZXQgZnJlcURhdGEgPSB0aGlzLm1ha2VGcmVxdWVuY3lUYWJsZShuYW1lcyk7XHJcbiAgICAgICAgLy8gc3Bvam5pY2UgbWV6aSB1emx5XHJcbiAgICAgICAgbGV0IGxpbmtzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuYW1lcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZyZXFEYXRhW2ldLmZyZXFbal0pXHJcbiAgICAgICAgICAgICAgICAgICAgbGlua3MucHVzaCh7c291cmNlOiBpLCB0YXJnZXQ6IGosIHdlaWdodDogZnJlcURhdGFbaV0uZnJlcVtqXX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHVyY2kgdmFoeSBqZWRub3RsaXZ5Y2ggc3BvanVcclxuICAgICAgICBsZXQgd2VpZ2h0U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAgICAgICAgIC5kb21haW4oZDMuZXh0ZW50KGxpbmtzLCAgKGQpID0+IHsgcmV0dXJuIGQud2VpZ2h0IH0pKVxyXG4gICAgICAgICAgICAucmFuZ2UoWy4xLCAxXSlcclxuICAgICAgICAvLyB6YWNuaSBzaW11bGFjaVxyXG4gICAgICAgIGQzLmZvcmNlU2ltdWxhdGlvbigpLm5vZGVzKG5vZGVzKVxyXG4gICAgICAgICAgICAuZm9yY2UoXCJsaW5rXCIsZDMuZm9yY2VMaW5rKGxpbmtzKS5zdHJlbmd0aCgoZSkgPT4gd2VpZ2h0U2NhbGUoZS53ZWlnaHQpKS5kaXN0YW5jZSgwKSlcclxuICAgICAgICAgICAgLmZvcmNlKFwieFwiLCBkMy5mb3JjZVgoMTUwKSlcclxuICAgICAgICAgICAgLmZvcmNlKFwiY29sbGlkZVwiLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMoMTApKVxyXG4gICAgICAgICAgICAuZm9yY2UoXCJjaGFyZ2VcIiwgZDMuZm9yY2VNYW55Qm9keSgpLnN0cmVuZ3RoKDEpKVxyXG4gICAgICAgICAgICAub24oXCJlbmRcIiwgKCkgPT4geyAvLyBwbyBza29uY2VuaSB1ZGVsZWogbmFzbGVkdWppY2lcclxuICAgICAgICAgICAgICAgIC8vIHNlcmFkIHV6bHkgZGxlIHlcclxuICAgICAgICAgICAgICAgIG5vZGVzLnNvcnQoKGEsYikgPT4gYS55IC0gYi55KTtcclxuICAgICAgICAgICAgICAgIC8vIHppc2tlaiBkYW5lIHBvcmFkaVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXIgPSBub2Rlcy5tYXAoaXRlbSA9PiBpdGVtLmluZGV4KTtcclxuICAgICAgICAgICAgICAgIC8vIG5hIGplaG8gemFrbGFkZSB1cHJhdiBha3Rpdm5pIHV6bHlcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5hY3RpdmUgPSBvcmRlci5tYXAoaSA9PiB0aGlzLmNvbnRleHQuYWN0aXZlW2ldKTtcclxuICAgICAgICAgICAgICAgIC8vIHpqaXN0aSBwcnViZWggY2VzdCBwcm8gZGFuZSBwb3JhZGkgYSB2eWtyZXNsaVxyXG4gICAgICAgICAgICAgICAgYi5kcmF3UmVzKHRoaXMubWFrZVZpZXcoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiaW1wb3J0IFwiLi9zdHlsZXMuY3NzXCI7XHJcbmltcG9ydCBDb250ZXh0IGZyb20gXCIuL2NvbnRleHQuanNcIjtcclxuaW1wb3J0IEJ1aWxkIGZyb20gXCIuL2J1aWxkLmpzXCJcclxuaW1wb3J0IE9yZGVyIGZyb20gXCIuL29yZGVyLmpzXCJcclxuaW1wb3J0IENvbW11bmljYXRpb24gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi5qc1wiO1xyXG5pbXBvcnQgZGF0ZVV0aWxzIGZyb20gJy4vY3VycmVudFZlci9EYXRlVXRpbHMuanMnO1xyXG5cclxuLy8gVGVudG8gc291Ym9yIG9ic2FodWplIHZlc2tlcmEgenBldG5hIHZvbGFuaVxyXG4vLyBuYXN0YXYgcG90cmVibmUgcHJvbWVubmUgcHJvIHZzZWNobnkgY2FzdGkgaW50ZXJha2NpXHJcbi8vIGFrdHVhbG5pIHZ5YmVyXHJcbmxldCBzZWxlY3Rpb24gPSBudWxsO1xyXG4vLyBvdmxhZGFuaSB6IGtsYXZlc25pY2VcclxubGV0IGtleXMgPSB7c2hpZnQ6IGZhbHNlLCBjdHJsOmZhbHNlLCB1cDogZmFsc2UsIGRvd246IGZhbHNlLCBkOmZhbHNlLCBhOmZhbHNlLCBlc2M6ZmFsc2V9O1xyXG4vLyBwcm9tZW5uYSBkcnppY2kgdmVza2VyZSBwb3RyZWJuZSBpbmZvcm1hY2VcclxubGV0IGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xyXG4vLyB2eXBvY3R5IHBvcmFkaSBvc1xyXG5sZXQgb3JkZXIgPSBuZXcgT3JkZXIoY29udGV4dCk7XHJcbi8vIHZ5c3RhdmJhIGNlbGUgdml6dWFsaXphY2VcclxubGV0IGJ1aWxkID0gbmV3IEJ1aWxkKGNvbnRleHQsIG9yZGVyKTtcclxuLy8ga29tdW5pa2FjZSBzZSBzZXJ2ZXJlbVxyXG5sZXQgY29tbSA9IG5ldyBDb21tdW5pY2F0aW9uKGNvbnRleHQpO1xyXG4vLyBtb2RhbG5pIG9rbm9cclxubGV0IG1vZGFsID0gYnVpbGQuZ2V0RWxlbWVudChcIiNtb2RhbF9tZW51XCIpO1xyXG5sZXQgbW9kYWxBY3RpdmUgPSBmYWxzZTtcclxuXHJcbi8vIG5hc3RhdmVuaSBjYWxsYmFja3VcclxuYnVpbGQuc2V0Q2FsbEJhY2soXCIuZm9ybV9jb250cm9sXCJcclxuICAgICxcImtleXVwXCIsIChlKSA9PiB7XHJcbiAgICBpZiAoZS5rZXkgIT09IFwiRXNjYXBlXCIgJiYgZS5rZXkgIT09IFwiQXJyb3dVcFwiICYmIGUua2V5ICE9PSBcIkFycm93RG93blwiXHJcbiAgICAgICAgJiYgZS5rZXkgIT09IFwiQXJyb3dMZWZ0XCIgJiYgZS5rZXkgIT09IFwiQXJyb3dSaWdodFwiICYmIGUua2V5ICE9PSBcIkVudGVyXCIpXHJcbiAgICAgICAgY29tbS5zZWFyY2hDYXRzKCk7XHJcbn0pO1xyXG5cclxuLy9jYWxsYmFjayBwcm8ga2zDoXZlc25pY2kva2zDoXZlc292w6kgemtyYXRreVxyXG5idWlsZC5zZXRDYWxsQmFjayhcIi5kcm9wZG93blwiLFwia2V5dXBcIiwgZHJvcERvd25LZXlzKTtcclxuYnVpbGQuc2V0Q2FsbEJhY2soXCIjbW9kYWxfbWVudVwiLFwia2V5dXBcIiwgKGUpID0+IHtcclxuICAgIGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIikge1xyXG4gICAgICAgIGJ1aWxkLnNldFN0eWxlKFwiI2NvbnRlbnRcIixcInZpc2liaWxpdHlcIiwgXCJoaWRkZW5cIik7XHJcbiAgICB9XHJcbn0pXHJcblxyXG4vLyBuYXN0YXYgY2FsbGJhY2sgcHJvIHBydm5pIHRsYWNpdGtvIC0gdXByYXZ5XHJcbmJ1aWxkLnNldENhbGxCYWNrKFwiI2FkZFwiLFwiY2xpY2tcIiwoKSA9PiB7XHJcbiAgICBhY3RpdmF0ZU1vZGFsKCk7XHJcbiAgICBzaG93QWRkKCk7XHJcbn0pO1xyXG5cclxuLy8gb3ZsYWRhbmkgcG9tb2NpIGtsYXZlc25pY2VcclxuYnVpbGQuc2V0Q2FsbEJhY2soXCJib2R5XCIsIFwia2V5ZG93blwiLCBrZXlib2FyZENvbnRyb2xEb3duKVxyXG5idWlsZC5zZXRDYWxsQmFjayhcImJvZHlcIiwgXCJrZXl1cFwiLCBrZXlib2FyZENvbnRyb2xVcClcclxuLy8gcHJpcmFkIGNhbGxiYWNreSBtb2RhbG5pbXUgb2tudVxyXG5idWlsZC5zZXRDYWxsQmFjayhcIiNidXR0b25zIC5jbG9zZVwiLFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XHJcbmJ1aWxkLnNldENhbGxCYWNrKFwiI2FkZF9jb25maXJtXCIsXCJjbGlja1wiLCBhZGRQYXRoKTsgLy8gcHVqZGUgZG8ga29tdW5pa2FjZVxyXG5idWlsZC5zZXRDYWxsQmFjayhcIiNmcmVxdWVuY3lcIixcImNsaWNrXCIsIGNhbGNGUlFTaG93UGF0aHMpOyAvLyBwcmVwb2NpdGVqIGRsZSBkYW5lIG1ldG9keSAtIGZyZWt2ZW5jbmlcclxuYnVpbGQuc2V0Q2FsbEJhY2soXCIjZm9yY2VcIixcImNsaWNrXCIsIGNhbGNGTVNob3dQYXRocyk7IC8vIHByZXBvY2l0ZWogZGxlIGRhbmUgbWV0b2R5IC0gc2lsb3ZhXHJcbmJ1aWxkLnNldENhbGxCYWNrKFwiI3JhbmRvbV9vcmRlclwiLFwiY2xpY2tcIiwgZ2V0UmFuZG9tT3JkZXJTaG93UGF0aHMpOyAvLyBwcmVwb2NpdGVqIGRsZSBkYW5lIG1ldG9keSAtIG5haG9kbmUgcG9yYWRpXHJcbmJ1aWxkLnNldENhbGxCYWNrKFwiI2FkZF9leGFtcGxlXCIsIFwiY2xpY2tcIiwgYXV0b2ZpbGwpOyAvLyBzYW1vIHBsbmljaSBtZXRvZGEgcHJvIHVrYXprdVxyXG5idWlsZC5zZXRDYWxsQmFjayhcIiNyZW1vdmVcIiwgXCJjbGlja1wiLCBkZWxldGVBbGxUaW1lTGluZXMpOyAvLyBvZHN0cmFuIHZzZVxyXG5cclxuLy8gdnlrcmVzbGVuaSBlbG1lbnR1IHZpenVhbGl6YWNlLCBwcmlwYWRuZSB2eWNpc3Rlbmkgem9icmF6b3ZhY2kgcGxvY2h5XHJcbmZ1bmN0aW9uIG9yZGVyQ2JzKCkge1xyXG4gICAgaWYgKGNvbnRleHQuYWN0aXZlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjYWxjRlJRU2hvd1BhdGhzKCk7XHJcbiAgICAgICAgYnVpbGQuZ2V0QWxsRWxlbWVudHMoXCIjZW1ibGVtcyAuaXRlbVwiKS5ub2RlcygpLmZvckVhY2goKGVsKSA9PiBidWlsZC5zZXRDYWxsQmFjayhlbCxcImNsaWNrXCIsIHNlbGVjdEl0ZW0pKTtcclxuICAgICAgICBidWlsZC5nZXRBbGxFbGVtZW50cyhcIiNlbWJsZW1zIC51cFwiKS5ub2RlcygpLmZvckVhY2goKGVsKSA9PiBidWlsZC5zZXRDYWxsQmFjayhlbCxcImNsaWNrXCIsIG1vdmVVcCkpO1xyXG4gICAgICAgIGJ1aWxkLmdldEFsbEVsZW1lbnRzKFwiI2VtYmxlbXMgLmRvd25cIikubm9kZXMoKS5mb3JFYWNoKChlbCkgPT4gYnVpbGQuc2V0Q2FsbEJhY2soZWwsXCJjbGlja1wiLCBtb3ZlRG93bikpO1xyXG4gICAgICAgIGJ1aWxkLmdldEFsbEVsZW1lbnRzKFwiI2VtYmxlbXMgLnJlbW92ZVwiKS5ub2RlcygpLmZvckVhY2goKGVsKSA9PiBidWlsZC5zZXRDYWxsQmFjayhlbCxcImNsaWNrXCIsIGRlbGV0ZVRpbWVMaW5lKSk7XHJcbiAgICAgICAgYnVpbGQuZ2V0QWxsRWxlbWVudHMoXCIuY29sb3JQaWNrZXJcIikubm9kZXMoKS5mb3JFYWNoKChlbCkgPT4gYnVpbGQuc2V0Q2FsbEJhY2soZWwsIFwiY2xpY2tcIiwgZWRpdENvbG9yKSk7XHJcbiAgICAgICAgYnVpbGQuZ2V0QWxsRWxlbWVudHMoXCIuaW5wdXRQaWNrZXJcIikubm9kZXMoKS5mb3JFYWNoKChlbCkgPT4gYnVpbGQuc2V0Q2FsbEJhY2soZWwsIFwiaW5wdXRcIiwgY2hhbmdlQ29sb3IpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGJ1aWxkLnJlbW92ZUl0ZW1zKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHByaWRhbmkgYWt0dWFsbmUgaGxlZGFuZSBvc3kgZG8gdml6dWFsaXphY2UgYSB6b2JyYXplbmlcclxuYXN5bmMgZnVuY3Rpb24gYWRkUGF0aCgpIHtcclxuICAgIC8vIG5hY3R1IHogcmVwcmUgY28gY2hjaSBwcmlkYXRcclxuICAgIGF3YWl0IGNvbW0uc2F2ZVRvQnVmZmVyKCk7XHJcbiAgICAvLyBuZWNoYW0gc3BvY2l0YXQgcG9yYWRpIGEgbmVjaGFtIHpvYnJheml0XHJcbiAgICBvcmRlckNicygpO1xyXG59XHJcblxyXG4vLyB2eWNpc3RlbmkgY2VsZSB2aXp1YWxpemFjZVxyXG5mdW5jdGlvbiBkZWxldGVBbGxUaW1lTGluZXMoKSB7XHJcbiAgICBidWlsZC5yZW1vdmVJdGVtcygpO1xyXG4gICAgY29udGV4dC5yZW1vdmVBbGwoKTtcclxufVxyXG5cclxuLy8gb2RzdHJhbmVuaSBqZWRuZSBjYXNvdmUgb3N5XHJcbmZ1bmN0aW9uIGRlbGV0ZVRpbWVMaW5lKGV2ZW50KSB7XHJcbiAgICBsZXQgaXRlbUNsYXNzID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWw7XHJcbiAgICBjb250ZXh0LnJlbW92ZVNlbGVjdGVkKGl0ZW1DbGFzcyk7XHJcbiAgICBidWlsZC5yZW1vdmVTcGVjaWZpY0l0ZW1zKFtgLmlucHV0UGlja2VyLiR7aXRlbUNsYXNzfWBdKTtcclxuICAgIGlmIChzZWxlY3Rpb24/LmNsYXNzTmFtZS5iYXNlVmFsID09PSBpdGVtQ2xhc3MpXHJcbiAgICAgICAgdW5zZWxlY3RJdGVtKCk7XHJcbiAgICBvcmRlckNicygpO1xyXG59XHJcblxyXG4vLyB6bWVuYSBiYXJ2eSB1IG9zeVxyXG5mdW5jdGlvbiBlZGl0Q29sb3IoZXZlbnQpIHtcclxuICAgIGxldCBjbHNOYW1lID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuYXR0cmlidXRlc1tcImNsYXNzXCJdLnZhbHVlO1xyXG4gICAgLy8gY29uc29sZS5sb2coYnVpbGQuZ2V0RWxlbWVudChgLmlucHV0UGlja2VyLiR7Y2xzTmFtZX1gKSk7XHJcbiAgICBsZXQgcGlja2VyID0gYnVpbGQuZ2V0RWxlbWVudChgLmlucHV0UGlja2VyLiR7Y2xzTmFtZX1gKTtcclxuICAgIHBpY2tlci5hdHRyKFwidmFsdWVcIiwgZXZlbnQudGFyZ2V0LmF0dHJpYnV0ZXNbXCJmaWxsXCJdLnZhbHVlKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKHBpY2tlcik7XHJcbiAgICBwaWNrZXIubm9kZSgpLmNsaWNrKCk7XHJcbn1cclxuXHJcbi8vIHBvc3R1cG5hIGFrdHVhbGl6YWNlIGJhcnZ5IHZzZWNoIGVsZW1lbnR1IG1lbmVuZWhvIHBydmt1XHJcbmZ1bmN0aW9uIGNoYW5nZUNvbG9yKGV2ZW50KSB7XHJcbiAgICAvLyBuYWN0aSBub3ZvdSBiYXJ2dVxyXG4gICAgbGV0IG5ld0NvbG9yID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgLy8gbWVuZW55IHBydmVrXHJcbiAgICBsZXQgY2xzTmFtZSA9IGV2ZW50LnRhcmdldC5jbGFzc0xpc3RbZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5sZW5ndGggLSAxXTtcclxuICAgIC8vIHptZW5hIGJhcmV2IHYgZGF0ZWNoXHJcbiAgICBjb250ZXh0LmNoYW5nZUNvbG9yKGV2ZW50LnRhcmdldC5kZWZhdWx0VmFsdWUsIG5ld0NvbG9yKTtcclxuICAgIC8vIHptZW5hIGJhcnZ5IHZlIHZzZWNoIGRpbGNpY2ggY2FzdGVjaFxyXG4gICAgZXZlbnQudGFyZ2V0LmRlZmF1bHRWYWx1ZSA9IG5ld0NvbG9yO1xyXG4gICAgbGV0IGlkeCA9IGNvbnRleHQuYWN0aXZlLmZpbmRJbmRleChkID0+IGQubmFtZSA9PT0gY2xzTmFtZSk7XHJcbiAgICBjb250ZXh0LmFjdGl2ZVtpZHhdLmNvbG9yID0gbmV3Q29sb3I7XHJcbiAgICBidWlsZC5nZXRBbGxFbGVtZW50cyhgLm1pbmltYXBEcmF3IC4ke2Nsc05hbWV9YCkubm9kZXMoKS5mb3JFYWNoKChkKSA9PiB7YnVpbGQuc2V0QXR0cmliKGQsXCJmaWxsXCIsIG5ld0NvbG9yKX0pO1xyXG4gICAgYnVpbGQuZ2V0QWxsRWxlbWVudHMoYCNwYXRocyAuJHtjbHNOYW1lfWApLm5vZGVzKCkuZm9yRWFjaCgoZCkgPT4ge2J1aWxkLnNldEF0dHJpYihkLFwic3Ryb2tlXCIsIG5ld0NvbG9yKX0pO1xyXG4gICAgYnVpbGQuc2V0QXR0cmliKGAjZW1ibGVtcyAuJHtjbHNOYW1lfSAuY29sb3JQaWNrZXJgLFwiZmlsbFwiLG5ld0NvbG9yKTtcclxufVxyXG5cclxuLy8gb3ZsYWRhbmkgbW9kYWxuaWhvIG9rbmEgcyBtb3pub3N0bWkgbmEgcHJpZGFuaSBuZWJvIHZ5dHZvcmVuaSB1a2F6a3lcclxuZnVuY3Rpb24gYWN0aXZhdGVNb2RhbCgpIHtcclxuICAgIG1vZGFsQWN0aXZlID0gdHJ1ZTtcclxuICAgIG1vZGFsLnN0eWxlKFwiZGlzcGxheVwiLFwiaW5oZXJpdFwiKTtcclxufVxyXG5cclxuLy8gemF2cmVuaSBtb2RhbG5paG8gb2tuYVxyXG5mdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xyXG4gICAgYnVpbGQuZ2V0RWxlbWVudChcIi5kcm9wZG93biAuZm9ybV9jb250cm9sXCIpLm5vZGUoKS52YWx1ZSA9IFwiXCI7XHJcbiAgICBtb2RhbEFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgbW9kYWwuc3R5bGUoXCJkaXNwbGF5XCIsXCJub25lXCIpO1xyXG59XHJcblxyXG4vLyBwb2xvemthIG5hIHByaWRhdmFuaVxyXG5mdW5jdGlvbiBzaG93QWRkKCkge1xyXG4gICAgYnVpbGQuc2V0U3R5bGUoXCIjbW9kYWxfYWRkXCIsXCJ2aXNpYmlsaXR5XCIsIFwiaW5oZXJpdFwiKTtcclxuICAgIGJ1aWxkLnNldFN0eWxlKFwiI2FkZF9jb25maXJtXCIsXCJ2aXNpYmlsaXR5XCIsIFwiaW5oZXJpdFwiKTtcclxuICAgIGJ1aWxkLnNldFN0eWxlKFwiI2FkZF9leGFtcGxlXCIsXCJ2aXNpYmlsaXR5XCIsIFwiaW5oZXJpdFwiKTtcclxufVxyXG5cclxuLy8gYnJ1c2ggZXZlbnQgY2FsbGJhY2tcclxuZnVuY3Rpb24gYnJ1c2hlZChldmVudCkgeyAvLyBtb3ZlXHJcbiAgICBpZiAoZXZlbnQuc291cmNlRXZlbnQgJiYgZXZlbnQuc291cmNlRXZlbnQudHlwZSA9PT0gXCJ6b29tXCIpIHJldHVybjsgLy8gaWdub3JlIGJydXNoLWJ5LXpvb21cclxuICAgIC8vIHppc2tlaiB2eWJlclxyXG4gICAgbGV0IHMgPSBldmVudC5zZWxlY3Rpb24gfHwgY29udGV4dC54dC5yYW5nZSgpO1xyXG4gICAgLy8gemppc3RpIHptZW55IHZlIHZ5YmVydVxyXG4gICAgcyA9IHMubWFwKHZhbHVlID0+IHZhbHVlIC0gYnVpbGQubWluaW1hcFgpO1xyXG4gICAgY29udGV4dC54dDIuZG9tYWluKHMubWFwKGNvbnRleHQueHQuaW52ZXJ0LCBjb250ZXh0Lnh0KSk7XHJcbiAgICAvLyBha3R1YWxpenVqIGNlc3R5XHJcbiAgICBmb3IobGV0IGNoaWxkIG9mIGJ1aWxkLmdldEVsZW1lbnQoXCIjcGF0aHNcIikubm9kZSgpLmNoaWxkcmVuKVxyXG4gICAgICAgIGJ1aWxkLmdldEVsZW1lbnQoY2hpbGQpLmF0dHIoXCJkXCIsIGNvbnRleHQuYXJlYSk7XHJcbiAgICAvLyBwcmVwb2NpdGVqIHZpenVhbGl6YWNpIGEgemF2b2xlaiB6b29tXHJcbiAgICBidWlsZC5yZXNjYWxlVGltZWxpbmUoKTtcclxuICAgIGJ1aWxkLmdldEVsZW1lbnQoXCIjdGltZXN0YW1wc1wiKS5jYWxsKGNvbnRleHQuYXhpcyk7XHJcbiAgICBidWlsZC5nZXRFbGVtZW50KFwiI3pvb21cIikuY2FsbChjb250ZXh0Lnpvb20udHJhbnNmb3JtLFxyXG4gICAgICAgIGQzLnpvb21JZGVudGl0eVxyXG4gICAgICAgIC5zY2FsZSgoYnVpbGQubWluaW1hcFcpIC8gKChzWzFdKSAtIChzWzBdKSkpXHJcbiAgICAgICAgLnRyYW5zbGF0ZSgtc1swXSwgMCksXHJcbiAgICAgICAgbnVsbCxcclxuICAgICAgICBldmVudCk7XHJcbn1cclxuLy8gem9vbSBldmVudCBjYWxsYmFja1xyXG5mdW5jdGlvbiB6b29tZWQoZXZlbnQpIHsgLy8gem9vbVxyXG4gICAgaWYgKGV2ZW50LnNvdXJjZUV2ZW50ICYmIGV2ZW50LnNvdXJjZUV2ZW50LnR5cGUgPT09IFwiYnJ1c2hcIikgcmV0dXJuO1xyXG4gICAgLy8gbmFjdGkgdHJhbnNmb3JtYWNpXHJcbiAgICBsZXQgdCA9IGV2ZW50LnRyYW5zZm9ybTtcclxuICAgIC8vIHNwb2NpdGVqIHptZW51XHJcbiAgICBjb250ZXh0Lnh0Mi5kb21haW4odC5yZXNjYWxlWChjb250ZXh0Lnh0KS5kb21haW4oKSk7XHJcbiAgICAvLyB1cHJhdiBjZXN0eVxyXG4gICAgZm9yKGxldCBjaGlsZCBvZiBidWlsZC5nZXRFbGVtZW50KFwiI3BhdGhzXCIpLm5vZGUoKS5jaGlsZHJlbilcclxuICAgICAgICBidWlsZC5nZXRFbGVtZW50KGNoaWxkKS5hdHRyKFwiZFwiLCBjb250ZXh0LmFyZWEpO1xyXG4gICAgLy8gcG9zdW4gY28gamUgdHJlYmFcclxuICAgIGlmIChldmVudC5zb3VyY2VFdmVudCkge1xyXG4gICAgICAgIGxldCBwYXIgPSBidWlsZC5nZXRFbGVtZW50KGJ1aWxkLmdldEVsZW1lbnQoXCIjdGltZWxpbmVzXCIpLm5vZGUoKS5wYXJlbnROb2RlKTtcclxuICAgICAgICBsZXQgeSA9IE51bWJlcihwYXIubm9kZSgpLnRyYW5zZm9ybS5iYXNlVmFsLmNvbnNvbGlkYXRlKCkubWF0cml4LmYpO1xyXG4gICAgICAgIHBhci5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwke3kgKyBldmVudC5zb3VyY2VFdmVudC5tb3ZlbWVudFl9KWApO1xyXG4gICAgfVxyXG4gICAgLy8gcHJlcG9jaXRlaiB2aXp1YWxpemFjaSBhIHphdm9sZWogYnJ1c2hcclxuICAgIGJ1aWxkLnJlc2NhbGVUaW1lbGluZSgpO1xyXG4gICAgYnVpbGQuZ2V0RWxlbWVudChcIiN0aW1lc3RhbXBzXCIpLmNhbGwoY29udGV4dC5heGlzKTtcclxuICAgIGJ1aWxkLmdldEVsZW1lbnQoXCIjZ2JcIikuY2FsbChjb250ZXh0LmJydXNoLm1vdmUsIGNvbnRleHQueHQucmFuZ2UoKS5tYXAodC5pbnZlcnRYLCB0KS5tYXAodmFsdWUgPT4gdmFsdWUgKyBidWlsZC5taW5pbWFwWCksIGV2ZW50KTtcclxufVxyXG5cclxuLy8gdnliZXIgdXJjaXRvdSBjYXNvdm91IG9zdVxyXG5mdW5jdGlvbiBzZWxlY3RJdGVtKGV2ZW50KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICBjb25zdCBzZWxJY29uID0gYnVpbGQuZ2V0RWxlbWVudChcIiNzZWxlY3RlZFwiKTtcclxuICAgIGlmIChzZWxlY3Rpb24gPT09IG51bGwpXHJcbiAgICAgICAgc2VsSWNvbi5zdHlsZShcImRpc3BsYXlcIiwgXCJpbmhlcml0XCIpXHJcbiAgICBzZWxlY3Rpb24gPSBidWlsZC5nZXRFbGVtZW50KHRoaXMucGFyZW50Tm9kZSkubm9kZSgpO1xyXG4gICAgY29uc3QgblkgPSBOdW1iZXIoc2VsZWN0aW9uLnRyYW5zZm9ybS5iYXNlVmFsLmNvbnNvbGlkYXRlKCkubWF0cml4LmYpOyAvLyBub3ZhIHkgc291cmFkbmljZVxyXG4gICAgc2VsSWNvbi5hdHRyKFwieVwiLCBgJHtuWSAtIDMwfWApO1xyXG59XHJcbi8vIHpydXMgdnliZXJcclxuZnVuY3Rpb24gdW5zZWxlY3RJdGVtKCkge1xyXG4gICAgc2VsZWN0aW9uID0gbnVsbDtcclxuICAgIGJ1aWxkLnNldFN0eWxlKFwiI3NlbGVjdGVkXCIsXCJkaXNwbGF5XCIsXCJub25lXCIpO1xyXG59XHJcblxyXG4vLyBwcm9ob2QgZHZlIHNrdXBpbnkgdiByZXByZXplbnRhY2lcclxuZnVuY3Rpb24gc3dhcEdyb3VwcyhpZHgsIG90aGVySWR4KSB7XHJcbiAgICBsZXQgY2xpY2tlZCA9IGNvbnRleHQuYWN0aXZlT3JkZXJbaWR4XTtcclxuICAgIGxldCBvdGhlciA9IGNvbnRleHQuYWN0aXZlT3JkZXJbb3RoZXJJZHhdO1xyXG4gICAgbGV0IHNlbCA9IHNlbGVjdGlvbiA/IHNlbGVjdGlvbi5jbGFzc05hbWUuYmFzZVZhbCA6IHVuZGVmaW5lZDtcclxuICAgIGxldCBjbGtlZEFJZHggPSBjb250ZXh0LmFjdGl2ZS5maW5kSW5kZXgoZSA9PiBlLmNsc05hbWUgPT09IGNsaWNrZWQpO1xyXG4gICAgbGV0IGFidkFJZHggPSBjb250ZXh0LmFjdGl2ZS5maW5kSW5kZXgoZSA9PiBlLmNsc05hbWUgPT09IG90aGVyKTtcclxuICAgIC8vIHByb2hvZCBkdmUgY2Fzb3ZlIG9zeVxyXG4gICAgW2NvbnRleHQuYWN0aXZlW2Nsa2VkQUlkeF0sIGNvbnRleHQuYWN0aXZlW2FidkFJZHhdXSA9IFtjb250ZXh0LmFjdGl2ZVthYnZBSWR4XSwgY29udGV4dC5hY3RpdmVbY2xrZWRBSWR4XV07XHJcbiAgICBbY29udGV4dC5hY3RpdmVPcmRlcltpZHhdLCBjb250ZXh0LmFjdGl2ZU9yZGVyW290aGVySWR4XV0gPSBbY29udGV4dC5hY3RpdmVPcmRlcltvdGhlcklkeF0sIGNvbnRleHQuYWN0aXZlT3JkZXJbaWR4XV07XHJcbiAgICAvLyBwcmVrcmVzbGlcclxuICAgIGJ1aWxkLmRyYXdSZXMob3JkZXIubWFrZVZpZXcoKSk7XHJcbiAgICBpZiAoc2VsID09PSBjbGlja2VkKVxyXG4gICAgICAgIG1vdmVTZWxlY3Rpb25UbyhjbGlja2VkKTtcclxuICAgIGlmIChzZWwgPT09IG90aGVyKVxyXG4gICAgICAgIG1vdmVTZWxlY3Rpb25UbyhvdGhlcik7XHJcbn1cclxuXHJcbi8vIHBvaG51IHV6bGVtLCBwb3N1bnUgaG8gbyBqZWRudSBuYWhvcnUgdiBha3Rpdm5pbSBsaXN0dSwgcHJla3Jlc2xpbVxyXG5mdW5jdGlvbiBtb3ZlVXAoKSB7XHJcbiAgICBsZXQgaWR4ID0gY29udGV4dC5hY3RpdmVPcmRlci5maW5kSW5kZXgoZSA9PiBlID09PSB0aGlzLnBhcmVudE5vZGUuY2xhc3NOYW1lLmJhc2VWYWwpO1xyXG4gICAgaWYgKGlkeCAhPT0gMClcclxuICAgICAgICBzd2FwR3JvdXBzKGlkeCwgaWR4IC0gMSk7XHJcbn1cclxuXHJcbi8vIHBvaG51IHV6bGVtLCBwb3N1bnUgaG8gbyBqZWRudSBkb2x1IHYgYWt0aXZuaW0gbGlzdHUsIHByZWtyZXNsaW1cclxuZnVuY3Rpb24gbW92ZURvd24oKSB7XHJcbiAgICBsZXQgaWR4ID0gY29udGV4dC5hY3RpdmVPcmRlci5maW5kSW5kZXgoZSA9PiBlID09PSB0aGlzLnBhcmVudE5vZGUuY2xhc3NOYW1lLmJhc2VWYWwpO1xyXG4gICAgaWYgKGlkeCAhPT0gY29udGV4dC5hY3RpdmUubGVuZ3RoIC0gMSlcclxuICAgICAgICBzd2FwR3JvdXBzKGlkeCwgaWR4ICsgMSk7XHJcbn1cclxuXHJcbi8vIHBvaG51IHMgdnliZXJlbSBsaW5reVxyXG5mdW5jdGlvbiBtb3ZlU2VsZWN0aW9uVG8oY2xzcykge1xyXG4gICAgaWYgKHNlbGVjdGlvbiAhPT0gbnVsbClcclxuICAgICAgICBidWlsZC5nZXRFbGVtZW50KGAjZW1ibGVtcyAuJHtjbHNzfSAuaXRlbWApLmRpc3BhdGNoKFwiY2xpY2tcIik7XHJcbn1cclxuXHJcbi8vIHZlem1lIGRhdGEgeiBkYXRhYnVmZmVydSBhIHprdXNpIGplIHpvYnJheml0XHJcbmZ1bmN0aW9uIHNob3dQYXRocyAoKSB7XHJcbiAgICBjb250ZXh0LnVwZGF0ZVNjYWxlcygpO1xyXG4gICAgYnVpbGQuZHJhd1JlcyhvcmRlci5tYWtlVmlldygpKTtcclxufVxyXG5cclxuLy8gbWV0b2RhIGhydWJlIHNpbHlcclxuYXN5bmMgZnVuY3Rpb24gY2FsY0JGU2hvd1BhdGhzKCkge1xyXG4gICAgb3JkZXIuYnJ1dGVGb3JjZU9yZGVyKGJ1aWxkKTtcclxufVxyXG5cclxuLy8gbmFob2RuZSBwb3JhZGlcclxuYXN5bmMgZnVuY3Rpb24gZ2V0UmFuZG9tT3JkZXJTaG93UGF0aHMoKSB7XHJcbiAgICBsZXQgdG1wQ2xzID0gc2VsZWN0aW9uPy5jbGFzc05hbWUuYmFzZVZhbDtcclxuICAgIG9yZGVyLnJhbmRvbU9yZGVyKGJ1aWxkKTtcclxuICAgIGlmICh0bXBDbHMpXHJcbiAgICAgICAgY2xpY2tFbWJsZW1JdGVtKHRtcENscyk7XHJcbn1cclxuXHJcbi8vIGZyZWt2ZW5jbmkgdGFidWxrYVxyXG5hc3luYyBmdW5jdGlvbiBjYWxjRlJRU2hvd1BhdGhzKCkge1xyXG4gICAgbGV0IHRtcENscyA9IHNlbGVjdGlvbj8uY2xhc3NOYW1lLmJhc2VWYWw7XHJcbiAgICBvcmRlci5mcmVxdWVuY3lUYWJsZShidWlsZCk7XHJcbiAgICBpZih0bXBDbHMpXHJcbiAgICAgICAgY2xpY2tFbWJsZW1JdGVtKHRtcENscyk7XHJcbn1cclxuXHJcbi8vIHNpbG92YSBtZXRvZGFcclxuYXN5bmMgZnVuY3Rpb24gY2FsY0ZNU2hvd1BhdGhzKCkge1xyXG4gICAgbGV0IHRtcENscyA9IHNlbGVjdGlvbj8uY2xhc3NOYW1lLmJhc2VWYWw7XHJcbiAgICBvcmRlci5mb3JjZU1ldGhvZChidWlsZCk7XHJcbiAgICBpZiAodG1wQ2xzKVxyXG4gICAgICAgIGNsaWNrRW1ibGVtSXRlbSh0bXBDbHMpO1xyXG59XHJcblxyXG4vLyBhdXRvbWF0aWNrw6kgdGVzdG92YW5pIC8gcHJpa2xhZCB2aXp1YWxpemFjZVxyXG5hc3luYyBmdW5jdGlvbiBhdXRvZmlsbCgpIHtcclxuICAgIGNvbnN0IGlkcyA9IFszLDE5LDg4LDcxLDQwLDEzLDY5LDIxXTtcclxuICAgIGNvbnN0IG5hbWVzID0gW1wiQWxtZW5kb3JcIiwgXCJEYW7DqXJpZVwiLCBcIlN0b3JhYnNrb1wiLCBcIlBvZHplbW7DrSDFmcOtxaFlXCIsIFwiS2VsZWRvclwiLCBcIkJvxaFldmFsXCIsIFwiUGxhdmVuYVwiLCBcIkRldHJlb25cIl07XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29tbS5zZWFyY2hJdGVtLmlkID0gaWRzW2ldO1xyXG4gICAgICAgIGNvbW0uc2VhcmNoSXRlbS5uYW1lID0gbmFtZXNbaV07XHJcbiAgICAgICAgYXdhaXQgY29tbS5mZXRjaFRhZ3MobmFtZXNbaV0sW10pO1xyXG4gICAgICAgIGF3YWl0IGFkZFBhdGgoKTtcclxuICAgIH1cclxuICAgIGNvbW0uc2VhcmNoSXRlbS5pZCA9IC0xO1xyXG4gICAgY29tbS5zZWFyY2hJdGVtLm5hbWUgPSBcIlwiO1xyXG59XHJcblxyXG4vLyBjYWxsYmFjayBwcm8ga2xpa251dGkgbmEgZW1ibGVtIGRhbmVobyBwcnZrdVxyXG5mdW5jdGlvbiBjbGlja0VtYmxlbUl0ZW0oY2xzKSB7XHJcbiAgICBidWlsZC5nZXRFbGVtZW50KGAjZW1ibGVtcyAuJHtjbHN9IC5pdGVtYCkuZGlzcGF0Y2goXCJjbGlja1wiKTtcclxufVxyXG5cclxuLy8gb3ZsYWRhbmkga2xhdmVzbmljZVxyXG5mdW5jdGlvbiBrZXlib2FyZENvbnRyb2xEb3duKGUpIHtcclxuICAgIGlmIChlLmtleSA9PT0gXCJTaGlmdFwiKVxyXG4gICAgICAgIGtleXMuc2hpZnQgPSB0cnVlO1xyXG4gICAgaWYgKGUua2V5ID09PSBcIkNvbnRyb2xcIilcclxuICAgICAgICBrZXlzLmN0cmwgPSB0cnVlO1xyXG4gICAgaWYgKGUua2V5ID09PSBcIkFycm93VXBcIilcclxuICAgICAgICBrZXlzLnVwID0gdHJ1ZTtcclxuICAgIGlmIChlLmtleSA9PT0gXCJBcnJvd0Rvd25cIilcclxuICAgICAgICBrZXlzLmRvd24gPSB0cnVlO1xyXG4gICAgaWYgKGUua2V5ID09PSBcImFcIilcclxuICAgICAgICBrZXlzLmEgPSB0cnVlO1xyXG4gICAgaWYgKGUua2V5ID09PSBcImRcIilcclxuICAgICAgICBrZXlzLmQgPSB0cnVlO1xyXG4gICAgaWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKVxyXG4gICAgICAgIGtleXMuZXNjID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoa2V5cy5lc2MgJiYgbW9kYWxBY3RpdmUgJiYgYnVpbGQuZ2V0U3R5bGUoXCIjY29udGVudFwiLFwidmlzaWJpbGl0eVwiKSA9PT0gXCJoaWRkZW5cIil7XHJcbiAgICAgICAgY2xvc2VNb2RhbCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoa2V5cy5lc2MgJiYgc2VsZWN0aW9uICE9PSBudWxsICYmIGJ1aWxkLmdldFN0eWxlKFwiI2NvbnRlbnRcIixcInZpc2liaWxpdHlcIikgPT09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgICB1bnNlbGVjdEl0ZW0oKTtcclxuICAgIH1cclxuICAgIGlmIChrZXlzLnNoaWZ0ICYmIGtleXMudXAgJiYgc2VsZWN0aW9uICE9PSBudWxsICYmIGJ1aWxkLmdldFN0eWxlKFwiI2NvbnRlbnRcIixcInZpc2liaWxpdHlcIikgPT09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgYnVpbGQuZ2V0RWxlbWVudChzZWxlY3Rpb24pLnNlbGVjdChcIi51cFwiKS5kaXNwYXRjaChcImNsaWNrXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKGtleXMuc2hpZnQgJiYga2V5cy5kb3duICYmIHNlbGVjdGlvbiAhPT0gbnVsbCAmJiBidWlsZC5nZXRTdHlsZShcIiNjb250ZW50XCIsXCJ2aXNpYmlsaXR5XCIpID09PSBcImhpZGRlblwiKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGJ1aWxkLmdldEVsZW1lbnQoc2VsZWN0aW9uKS5zZWxlY3QoXCIuZG93blwiKS5kaXNwYXRjaChcImNsaWNrXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKGtleXMuY3RybCAmJiBrZXlzLmEpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgYWN0aXZhdGVNb2RhbCgpO1xyXG4gICAgICAgIHNob3dBZGQoKTtcclxuICAgIH1cclxuICAgIGlmIChrZXlzLnVwICYmICFrZXlzLnNoaWZ0ICYmIHNlbGVjdGlvbiAhPT0gbnVsbCAmJiBidWlsZC5nZXRTdHlsZShcIiNjb250ZW50XCIsXCJ2aXNpYmlsaXR5XCIpID09PSBcImhpZGRlblwiKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuYWN0aXZlT3JkZXIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbCA9IGNvbnRleHQuYWN0aXZlT3JkZXIuZmluZEluZGV4KGUgPT4gZSA9PT0gc2VsZWN0aW9uLmNsYXNzTmFtZS5iYXNlVmFsKSAtIDE7XHJcbiAgICAgICAgICAgIGlmIChzZWwgIT09IC0xKVxyXG4gICAgICAgICAgICAgICAgYnVpbGQuZ2V0RWxlbWVudChgI2VtYmxlbXMgLiR7Y29udGV4dC5hY3RpdmVPcmRlcltzZWxdfSAuaXRlbWApLmRpc3BhdGNoKFwiY2xpY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGtleXMudXAgJiYgIWtleXMuc2hpZnQgJiYgc2VsZWN0aW9uID09PSBudWxsICYmIGJ1aWxkLmdldFN0eWxlKFwiI2NvbnRlbnRcIixcInZpc2liaWxpdHlcIikgPT09IFwiaGlkZGVuXCIpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAoY29udGV4dC5hY3RpdmVPcmRlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2VsID0gY29udGV4dC5hY3RpdmVPcmRlci5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICBidWlsZC5nZXRFbGVtZW50KGAjZW1ibGVtcyAuJHtjb250ZXh0LmFjdGl2ZU9yZGVyW3NlbF19IC5pdGVtYCkuZGlzcGF0Y2goXCJjbGlja1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoa2V5cy5kb3duICYmICFrZXlzLnNoaWZ0ICYmIHNlbGVjdGlvbiAhPT0gbnVsbCAmJiBidWlsZC5nZXRTdHlsZShcIiNjb250ZW50XCIsXCJ2aXNpYmlsaXR5XCIpID09PSBcImhpZGRlblwiKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuYWN0aXZlT3JkZXIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbCA9IGNvbnRleHQuYWN0aXZlT3JkZXIuZmluZEluZGV4KGUgPT4gZSA9PT0gc2VsZWN0aW9uLmNsYXNzTmFtZS5iYXNlVmFsKSArIDE7XHJcbiAgICAgICAgICAgIGlmIChzZWwgIT09IGNvbnRleHQuYWN0aXZlT3JkZXIubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgYnVpbGQuZ2V0RWxlbWVudChgI2VtYmxlbXMgLiR7Y29udGV4dC5hY3RpdmVPcmRlcltzZWxdfSAuaXRlbWApLmRpc3BhdGNoKFwiY2xpY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGtleXMuZG93biAmJiAha2V5cy5zaGlmdCAmJiBzZWxlY3Rpb24gPT09IG51bGwgJiYgYnVpbGQuZ2V0U3R5bGUoXCIjY29udGVudFwiLFwidmlzaWJpbGl0eVwiKSA9PT0gXCJoaWRkZW5cIil7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmIChjb250ZXh0LmFjdGl2ZU9yZGVyLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBidWlsZC5nZXRFbGVtZW50KGAjZW1ibGVtcyAuJHtjb250ZXh0LmFjdGl2ZU9yZGVyWzBdfSAuaXRlbWApLmRpc3BhdGNoKFwiY2xpY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBrZXlib2FyZENvbnRyb2xVcChlKSB7XHJcbiAgICBpZiAoZS5rZXkgPT09IFwiU2hpZnRcIilcclxuICAgICAgICBrZXlzLnNoaWZ0ID0gZmFsc2U7XHJcbiAgICBpZiAoZS5rZXkgPT09IFwiQ29udHJvbFwiKVxyXG4gICAgICAgIGtleXMuY3RybCA9IGZhbHNlO1xyXG4gICAgaWYgKGUua2V5ID09PSBcIkFycm93VXBcIilcclxuICAgICAgICBrZXlzLnVwID0gZmFsc2U7XHJcbiAgICBpZiAoZS5rZXkgPT09IFwiQXJyb3dEb3duXCIpXHJcbiAgICAgICAga2V5cy5kb3duID0gZmFsc2U7XHJcbiAgICBpZiAoZS5rZXkgPT09IFwiYVwiKVxyXG4gICAgICAgIGtleXMuYSA9IGZhbHNlO1xyXG4gICAgaWYgKGUua2V5ID09PSBcImRcIilcclxuICAgICAgICBrZXlzLmQgPSBmYWxzZTtcclxuICAgIGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIilcclxuICAgICAgICBrZXlzLmVzYyA9IGZhbHNlO1xyXG59XHJcblxyXG4vLyBvdmxhZGFuaSBkcm9wZG93biBuYWJpZGt5IHByaSBwcmlkYXZhbmkgamVkbm90bGl2eWNoIHBvbG96ZWtcclxuZnVuY3Rpb24gZHJvcERvd25LZXlzIChlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmIChidWlsZC5nZXRFbGVtZW50KFwiLmZvcm1fY29udHJvbFwiKS5ub2RlKCkudmFsdWUgIT09IFwiXCIgJiZcclxuICAgICAgICAoZS5rZXkgPT09IFwiQXJyb3dVcFwiIHx8IGUua2V5ID09PSBcIkFycm93RG93blwiIHx8IGUua2V5ID09PSBcIkVudGVyXCIpKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IGJ1aWxkLmdldEVsZW1lbnQoXCIjY29udGVudFwiKS5ub2RlKCk7XHJcbiAgICAgICAgbGV0IHNlbCA9IGJ1aWxkLmdldEVsZW1lbnQoXCIjY29udGVudCAuc2VhcmNoU2VsXCIpLm5vZGUoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhzZWwpO1xyXG4gICAgICAgIGlmIChlLmtleSA9PT0gXCJBcnJvd1VwXCIpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZS5rZXkpO1xyXG4gICAgICAgICAgICBpZiAoIXNlbCl7XHJcbiAgICAgICAgICAgICAgICBsaXN0Lmxhc3RFbGVtZW50Q2hpbGQuYXR0cmlidXRlc1tcImNsYXNzXCJdLnZhbHVlID0gXCJzZWFyY2hTZWxcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbC5hdHRyaWJ1dGVzW1wiY2xhc3NcIl0udmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmF0dHJpYnV0ZXNbXCJjbGFzc1wiXS52YWx1ZSA9IFwic2VhcmNoU2VsXCI7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5sYXN0RWxlbWVudENoaWxkLmF0dHJpYnV0ZXNbXCJjbGFzc1wiXS52YWx1ZSA9IFwic2VhcmNoU2VsXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsID0gYnVpbGQuZ2V0RWxlbWVudChcIiNjb250ZW50IC5zZWFyY2hTZWxcIikubm9kZSgpO1xyXG4gICAgICAgICAgICBzZWwuc2Nyb2xsSW50b1ZpZXcodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLmtleSA9PT0gXCJBcnJvd0Rvd25cIikge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlLmtleSk7XHJcbiAgICAgICAgICAgIGlmICghc2VsKXtcclxuICAgICAgICAgICAgICAgIGxpc3QuZmlyc3RFbGVtZW50Q2hpbGQuYXR0cmlidXRlc1tcImNsYXNzXCJdLnZhbHVlID0gXCJzZWFyY2hTZWxcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbC5hdHRyaWJ1dGVzW1wiY2xhc3NcIl0udmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbC5uZXh0RWxlbWVudFNpYmxpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsLm5leHRFbGVtZW50U2libGluZy5hdHRyaWJ1dGVzW1wiY2xhc3NcIl0udmFsdWUgPSBcInNlYXJjaFNlbFwiO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QuZmlyc3RFbGVtZW50Q2hpbGQuYXR0cmlidXRlc1tcImNsYXNzXCJdLnZhbHVlID0gXCJzZWFyY2hTZWxcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWwgPSBidWlsZC5nZXRFbGVtZW50KFwiI2NvbnRlbnQgLnNlYXJjaFNlbFwiKS5ub2RlKCk7XHJcbiAgICAgICAgICAgIHNlbC5zY3JvbGxJbnRvVmlldyh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZS5rZXkpO1xyXG4gICAgICAgICAgICBidWlsZC5nZXRFbGVtZW50KHNlbCkuZGlzcGF0Y2goXCJjbGlja1wiKTtcclxuICAgICAgICAgICAgYnVpbGQuc2V0U3R5bGUoXCIjY29udGVudFwiLFwidmlzaWJpbGl0eVwiLCBcImhpZGRlblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIG5hc3RhcnRvdmFuaSB2c2VjaCBwb2RjYXN0aSAtIHZ5a3Jlc2xlbmksIHppc2thbmkgcG9yYWRpIGJhcmV2LCBpbmZvcm1hY2kgbyBtaW5pbWFwZSwgLi4uXHJcbmxldCBpbmZvID0gYnVpbGQuZ2V0TWluaW1hcEluZm8oKTtcclxuY29udGV4dC5zaHVmZmVsQ29sb3JzKCk7XHJcblxyXG5jb250ZXh0LnNldEJydXNoKGluZm8sIGJydXNoZWQpO1xyXG5jb250ZXh0LnNldFpvb20oaW5mbywgem9vbWVkKTtcclxuXHJcbmNvbnRleHQuYXhpcy50aWNrRm9ybWF0KChkKSA9PiB7cmV0dXJuIGRhdGVVdGlscy5nZXREYXRlTmFtZShkKX0pO1xyXG5jb250ZXh0LnVwZGF0ZUJydXNoWm9vbUF4aXMoaW5mbyk7XHJcbmJ1aWxkLmdldEVsZW1lbnQoXCIjdGltZXN0YW1wc1wiKS5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwke2J1aWxkLmdldEVsZW1lbnQoXCIuY2FudmFzRHJhd1wiKS5ub2RlKCkuY2xpZW50SGVpZ2h0IC0gMTYwfSlgKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9