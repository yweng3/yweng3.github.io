
let publications;
let condition = null;

// Transfer Month
let months = {"1":"Jan", "2":"Feb", "3":"Mar", "4":"Apr", "5":"May", "6":"Jun", "7":"Jul", "8":"Aug", "9":"Sep", "10":"Oct", "11":"Nov", "12":"Dec", "13":"Accepted"};

// Transfer name to Given name
let PaperCate = {
    "Book": "Books and Book Chapters",
    "Journal": "Peer Reviewed Journal Articles",
    "Conference": "Conference Proceedings",
    "Patent": "Patents",
    "state estimation": "State estimation",
    "topology identification": "Topology identification",
    "renewable energy intergration":"Renewable energy intergration",
    "grid resilience and security": "Grid resilience and security",
    "smart grid control": "Smart grid control",
    "fault detection": "Fault detection",
    "electric vehicles":"Electric vehicles",
    "others": "Others",
    "2024": "2024",
    "2023": "2023",
    "2022": "2022",
    "2021": "2021",
    "2020": "2020",
    "2019": "2019",
    "2018": "2018",
    "2017": "2017",
    "2016": "2016",
    "2015": "2015",
    "2014": "2014",
    "2013": "2013",
    "2012": "2012",
    "2011": "2011",
    "2010": "2010",
    "2009": "2009",
    "2008": "2008",
    "2007": "2007",
    "2006": "2006"
}

// Only For Google Drive URLs
function getURL(path){
    if (path.startsWith("http") && path.includes("drive.google.com")){
        const url = new URL(path); 
        const urlParams = new URLSearchParams(url.search);
        if (urlParams.get("id")){
            return `https://drive.google.com/uc?export=view&id=${urlParams.get("id")}`;
        }else{
            const id = path.split('/').slice(-2)[0];// second from last
            return `Image/Publication/${id}.png`;
            // return `https://drive.google.com/uc?export=view&id=${id}`;
        }
    }else{
        return path;
    }
}

function getURL2(path){
    if (path.startsWith("http") && path.includes("drive.google.com")){
        const url = new URL(path); 
        const urlParams = new URLSearchParams(url.search);
        if (urlParams.get("id")){
            return `https://drive.google.com/uc?export=view&id=${urlParams.get("id")}`;
        }else{
            const id = path.split('/').slice(-2)[0];// second from last
            return `https://drive.google.com/uc?export=view&id=${id}`;
        }
    }else{
        return path;
    }
}


function getUniqueId(d){
    let uniqueid = d.authors.split(". ")[1] + d.year.substring(2, 4) + d.venue.substring(0,6) + d.title.substring(0,6);
    uniqueid = uniqueid.replaceAll(" ", "").replace(",","").replace("-","").replace(":","")
    return uniqueid;
}

Promise.all([
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPMWaiCEPwokej5W3_mN6MLWhnTjQPpFjnQS7iNo8oDyRUNO1y80T8-Pqwq7x7cUL19ji652qomLOv/pub?output=csv',
].map(url=>{
    return fetch(url).then(res=>
        res.ok ? res.text() : Promise.reject(res.status))
        .then(text=>d3.csvParse(text, d=>{
            const record = {...d};
            for (const prop in record){
                record[prop] = record[prop]==="" || record[prop]==="na"? null: record[prop];
            }
            return record;
        }))
})).then(value=>{
    publications = value[0];
    let filter = document.querySelector('.chip.selected');
    condition = filter.dataset.cond;
    renderPubs(publications, condition);
});


function renderPubs(pubs, cond){
    let filtered;
    let by_areas = false;
    switch(cond){
        case 'pub-all': 
            filtered = pubs; break;
        case 'pub-book':
            filtered = pubs.filter(item=>item.type.toLowerCase()=='book'); break;
        case 'pub-journal':
            filtered = pubs.filter(item=>item.type.toLowerCase()=='journal'); break;
        case 'pub-conference':
            filtered = pubs.filter(item=>item.type.toLowerCase()=='conference'); break;
        case 'pub-patent':
            filtered = pubs.filter(item=>item.type.toLowerCase()=='patent'); break;
        case 'pub-awards':
            filtered = pubs.filter(item=>item.award); break;
        case 'pub-stateEst':
            filtered = pubs.filter(item=>item.area.toLowerCase()=='state estimation'); by_areas = true; break;
        case 'pub-topIden':
            filtered = pubs.filter(item=>item.area.toLowerCase()=='topology identification'); by_areas = true; break;
        case 'pub-renew':
            filtered = pubs.filter(item=>item.area.toLowerCase()=='renewable energy intergration'); by_areas = true; break;
        case 'pub-cyber':
            filtered = pubs.filter(item=>item.area.toLowerCase()=='grid resilience and security'); by_areas = true; break;
        case 'pub-control':
            filtered = pubs.filter(item=>item.area.toLowerCase()=='smart grid control'); by_areas = true; break;
        case 'pub-detection':
            filtered = pubs.filter(item=>item.area.toLowerCase()=='fault detection'); by_areas = true; break;
        case 'pub-ev':
            filtered = pubs.filter(item=>item.area.toLowerCase()=='electric vehicles'); by_areas = true; break;
        case 'pub-others':
            filtered = pubs.filter(item=>item.area.toLowerCase()=='others'); by_areas = true; break;
            
        // case 'pub-recent':// up to five years
        // let currentYear = (new Date()).getFullYear();
        // filtered = pubs.filter(item=>parseInt(item.year)>=(currentYear-3)); break;
        
        default:
            filtered = pubs;
    }

    // Filter by Time
    let byTime = document.querySelector('#by-time');
    let sort_style = 'title';

    if (byTime.checked){
        document.getElementById("sort_label").innerText = "By Time";
        filtered = filtered.reduce((acc, d)=>{
            if (!acc[d.year]){
                acc[d.year] = [];
            }
            acc[d.year].push(d);
            return acc;
        }, {});
        
        filtered = Object.entries(filtered).map(group=>{
            // group[1].sort((a,b)=>b.title.localeCompare(a.title));
            group[1].sort((a,b)=>parseInt(b.month)-parseInt(a.month));
            return group;
        });
        filtered.sort((a,b)=>b[0]-a[0]);
        document.querySelector("#by-time-switch").setAttribute("aria-pressed", true);

    }else{
        document.getElementById("sort_label").innerText = "By Category";
        sort_style = 'title2';
        if(by_areas){
            filtered = filtered.reduce((acc, d)=>{
                if (!acc[d.area]){
                    acc[d.area] = [];
                }
                acc[d.area].push(d);
                return acc;
            }, {});
            filtered = Object.entries(filtered).map(group=>{
                // group[1].sort((a,b)=>parseInt(b.year)-parseInt(a.year));
                group[1].sort((a,b)=>13*(parseInt(b.year)-parseInt(a.year))+parseInt(b.month)-parseInt(a.month));
                return group;
            });
        }else{
            filtered = filtered.reduce((acc, d)=>{
                if (!acc[d.type]){
                    acc[d.type] = [];
                }
                acc[d.type].push(d);
                return acc;
            }, {});
            filtered = Object.entries(filtered).map(group=>{
                // group[1].sort((a,b)=>parseInt(b.year)-parseInt(a.year));
                group[1].sort((a,b)=>13*(parseInt(b.year)-parseInt(a.year))+parseInt(b.month)-parseInt(a.month));
                return group;
            });
        }
        document.querySelector("#by-time-switch").setAttribute("aria-pressed", false); 
    }

    // featured.map(d=>d.key)
    let container = document.querySelector('.pubs');
    container.innerHTML='';

    let num = filtered.length;
    let index = 0;
    filtered.forEach(group=>{
        let html = group[1].reduce((html, d)=>{
            index = index + 1;
            let volume = /volume=\{([^\}]*)\}/g.exec(d.bibtex);
            let number = /number=\{([^\}]*)\}/g.exec(d.bibtex);
            let pages = /pages=\{([^\}]*)\}/g.exec(d.bibtex);
            return html + `<div class='pub' role="listitem">
                <div class='pub-teaser'
                    style='background-image:url(${getURL(d.teaser)});'>
                </div>
                <div class='pub-detail'>
                    <div class='pub-title'><strong>${index}. ${d.title}</strong></div>
                    <div class='pub-authors'>${d.authors.replace('Y. Weng', '<strong>Y. Weng</strong>')}</div>
                    <div class='pub-venue'><em>${d.venue}${d.venue_abbreviation?` (<strong>${d.venue_abbreviation}</strong>)`:''}</em>,${volume?` vol. ${volume[1]},`:''}${number?` no. ${number[1]},`:''}${pages?` pp. ${pages[1]},`:''}${d.location?` ${d.location},`:''} ${d.month? months[d.month]:""}${d.software&&d.software.includes("Accepted")? "":` ${d.year}`}. ${d.info?d.info:""}</div>
                    <div class='pub-award'><strong>${d.award?d.award:""}</strong></div>
                    <div class='pub-materials' role="list" aria-label="Publication Materials">
                        ${renderPubMaterials(d)}
                    </div>
                    <div class='bibContent' id=${getUniqueId(d)}>
                        <div class="copybib">
                            <i class="fas fa-copy" style="margin-top: 4px; color: black;"></i>
                            <button class="copy-button" onclick="copy2board(this)">Copy Bibtex</button>
                        </div>
                        <pre>${d.bibtex}</pre>
                    </div>
                </div>
            </div>`
        }, '');
        let elem = document.createElement('div');
        console.log(group[0])
        elem.innerHTML = `<h3 class='${sort_style}' aria-hidden="true">${PaperCate[group[0]]}</h3>
            <div role="list" aria-label="${group[0]} Publications">${html}
            </div>`;
        elem.classList.add('pub-group');
        container.appendChild(elem);
    });
}
function renderPubMaterials(d){
    // let path = `/files/publications/${group.key.toLowerCase()}/${d.title.replace(/\s/g, '-').replace(/:/g, '').toLowerCase()}`;
    let generate = (icon, link, label)=>`<div class='item' role="listitem">
        <i class="${icon}"></i>
        <a href='${link}' target='_blank'>${label}</a>
    </div>`
    let html = '';
    if (d.link) {html+= generate('fas fa-link', `${getURL(d.link)}`, 'Link');}
    if (d.paper){
        html+= generate('fas fa-download', `${getURL2(d.paper)}`, 'Download');
        // if (!d.type.toLowerCase().localeCompare("patent")){
        //     html+= generate('fas fa-download', `${getURL(d.paper)}`, 'PATENT');
        // }
        // else if (!d.type.toLowerCase().localeCompare("book")){
        //     if (d.title.toLowerCase().includes("chapter"))
        //         html+= generate('fas fa-download', `${getURL(d.paper)}`, 'CHAPTER');
        //     else
        //         html+= generate('fas fa-download', `${getURL(d.paper)}`, 'BOOK');
        // }
        // else
        //     html+= generate('fas fa-download', `${getURL(d.paper)}`, 'PAPER');
    }
    if (d.bibtex) {
        html += `<div class='item' role='listitem'>
        <i class='far fa-file-alt'></i>
        <a role="button" onclick='toggleDiv(${getUniqueId(d)})'>BibTeX</a>
    </div>`
    }

    return html;
}

// If Another Condition is Clicked
let conds = document.querySelectorAll('.filter .chip');
conds.forEach(cond=>cond.addEventListener('click', function(event){
    if (this.classList.contains('selected')==false){
        let selected = document.querySelector('.chip.selected');
        selected.classList.remove('selected');
        this.classList.add('selected');   
        console.log('filter', this.dataset.cond);
        condition = this.dataset.cond;
        renderPubs(publications, condition);
    }
}));
document.querySelector('#by-time').addEventListener('change', function(){
    renderPubs(publications, condition);
});

// User Search
let pubSearch = document.querySelector('.search input[name="publication"');
pubSearch.addEventListener('input', function(event){
    if (this.value!=''){
        let filtered = publications.filter(d=>{
            return d.title.toLowerCase().includes(this.value.toLowerCase());
        })
        renderPubs(filtered);
    }else{
        renderPubs(publications);
    }
});




