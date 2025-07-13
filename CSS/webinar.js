
let webinars;

// Only For Google Drive URLs
function getURL(path){
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

Promise.all([
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRReTl2c_WO2_ygpzD7FQ6CYOCZvoB5mV63EZbMOPUoEfSWy4aLUm06L3nZy70rjC2Db7i02Fkh8wH5/pub?output=csv',
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
    webinars = value[0];
    renderWebinars(webinars);
});


function renderWebinars(webs){

    let container = document.querySelector('.webs');
    
    webs.forEach(d=>{
        let html = "";
        if (d.upcoming.localeCompare("0")){
            html = html + `\n<div style="position: absolute; margin-left:40px; margin-top:20px;">
                        <h2 style="padding: 1rem; box-shadow: 4px 4px 4px 2px rgba(0, 0, 0, 0.2); background-color: var(--color0_dark);border-radius:20px;">Upcoming</h2>
                    </div>\n`
        }
        html = html + `<div class='web' style='background-color: var(--color${d.color})'><div class='speaker'>`
        
        let names = d.author_name.split(";");
        let schools = d.author_school.split(";");
        let photos = d.author_photo.split(";");
        let htmlname = d.title.split(" ")[0] + "_" + d.time.replaceAll(' ', '').replace(',','_');
        for(let i=0;i<names.length;i++){
            html = html + `<div class='speaker-content'>
                            <div class='speaker-photo' style='background-image:url(${getURL(photos[i])});'></div>
                            <div class='speaker-name'>${names[i]}</div>
                            <div class='speaker-school'>${schools[i]}</div>
                        </div>`
        }

        html = html + `</div><div class='content'>
                        <div class='web-info'>
                            <b>${d.type}</b> <i class="far fa-clock"></i> <span>${d.time}</span>
                        </div>`
        if (d.upcoming.localeCompare("1")){
            html = html + `<h2><a style="color:black;" target='_blank' href="Links/Webinar/${htmlname}.html">${d.title}</a></h2>
                        <p>${d.abstract}</p>`
        }
        else{
            html = html + `<h2>${d.title}</h2>
                        <p>${d.abstract}</p>`
        }

        if(d.flyer) html = html + `<a href='${d.flyer}' target='_blank' class="flyer"><span>Flyer</span></a>`;
        if(d.slides) html = html + `<a href='${d.slides}' target='_blank' class="flyer"><span>Slides</span></a>`;
        if(d.video){
            if(d.video.includes("resourcecenter.ieee-pes.org"))
                html = html + `<a href='${d.video.split(";")[0]}' target='_blank' class="flyer"><span>Video</span></a>`;
            else
                html = html + `<a href='${d.video}' target='_blank' class="flyer"><span>Video</span></a>`;
        }
        if (d.upcoming.localeCompare("1")){
            html = html + `<a href='Links/Webinar/${htmlname}.html' target='_blank' class="flyer"><span>Talk Page</span></a>`;
        }
        html = html + `</div></div>`;

        let elem = document.createElement('div');
        elem.innerHTML = html;
        container.appendChild(elem);
    });
}

