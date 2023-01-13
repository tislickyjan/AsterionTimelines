// trida pro komunikaci se serverovou casti

export default class Communication {
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