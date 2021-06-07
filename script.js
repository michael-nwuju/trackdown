const trackerbtn = document.querySelector('.btn-tracker');
const input  = document.querySelector('input');
const alerts = document.querySelector('.tracker-alerts-wrap');
const trackerHead = document.querySelector('.tracker-head');
const overlay = document.querySelector('.overlay')
const mapContainer = document.querySelector('.tracker-map');
const Api_Key = 'at_aAuE8NMENuw9jnUePzWKyHuXJJipV'
const domains = ['https://', 'http://', 'www.', 'https://www.', 'http://www.']
const token = 'pk.eyJ1IjoibWlsZXhwcm8iLCJhIjoiY2twZHljaWk2MGVuZTMwbzE5ZTZtenloZCJ9.Bs1DiQOKMbHXaFEI8tb5QA'

function trackme(region, country, zone, provider){
    const infowrap = document.querySelector('.tracker-info-wrap');
    infowrap.style.transition = 'all 200ms ease-in-out';
    const info = document.createElement('div');
    info.classList.add('tracker-info');
    info.classList.add('fade-in');
    info.classList.remove('fade-out');

    const ipaddress_wrap = document.createElement('div');
    const ipaddress_div = document.createElement('div');
    ipaddress_wrap.classList.add('tracker-container');
    const ipaddress_head = document.createElement('p');
    const ipaddress = document.createElement('p');
    ipaddress.textContent = input.value;
    ipaddress.style.maxWidth = '200%'
    ipaddress.classList.add('tracker-content');
    ipaddress_head.innerHTML = 'IP Address'
    const ip_divider = document.createElement('span');
    ip_divider.classList.add('divider');
    ipaddress_div.appendChild(ipaddress_head)
    ipaddress_div.appendChild(ipaddress);
    ipaddress_wrap.appendChild(ipaddress_div);
    ipaddress_wrap.appendChild(ip_divider)
    info.appendChild(ipaddress_wrap);

    const location_wrap = document.createElement('div');
    const location_div = document.createElement('div');
    location_wrap.classList.add('tracker-container');
    const location_head = document.createElement('p');
    const location = document.createElement('p');
    location.textContent = region + ', ' + country;
    location.classList.add('tracker-content');
    location.style.maxWidth = '200%'
    location_head.innerHTML = 'Location';
    const location_divider = document.createElement('span');
    location_divider.classList.add('divider');
    location_div.appendChild(location_head)
    location_div.appendChild(location);
    location_wrap.appendChild(location_div);
    location_wrap.appendChild(location_divider);
    info.appendChild(location_wrap);

    const timezone_wrap = document.createElement('div');
    const timezone_div = document.createElement('div');
    timezone_wrap.classList.add('tracker-container');
    const timezone_head = document.createElement('p');
    const timezone = document.createElement('p');
    timezone.textContent = "UTC -" + zone;
    timezone.classList.add('tracker-content');
    timezone.style.paddingTop = '10%';
    timezone.style.maxWidth = '200%';
    timezone_head.innerHTML = 'Timezone';
    const timezone_divider = document.createElement('span');
    timezone_divider.classList.add('divider');
    timezone_div.appendChild(timezone_head)
    timezone_div.appendChild(timezone);
    timezone_wrap.appendChild(timezone_div);
    timezone_wrap.appendChild(timezone_divider);
    info.appendChild(timezone_wrap);

    const isp_div = document.createElement('div');
    const isp_head = document.createElement('p');
    const isp = document.createElement('p');
    isp.textContent = provider;
    isp.style.maxWidth = '200%';
    isp.classList.add('tracker-content');
    isp_head.innerHTML = 'ISP';
    isp_div.appendChild(isp_head)
    isp_div.appendChild(isp);
    info.appendChild(isp_div);
    
    const closer = document.createElement('button');
    const closer_class = document.createElement('i');
    closer_class.classList.add('fa');
    closer_class.classList.add('fa-times');
    closer.classList.add('closer');
    closer.appendChild(closer_class);
    info.appendChild(closer);
    
    infowrap.appendChild(info);

    closer.addEventListener('click', ()=>{
        info.classList.remove('fade-in');
        info.classList.add('fade-out');
        setTimeout(()=>{
        infowrap.removeChild(info);
        }, 1000)
    })
    if (input.value.substr(0, 8) === domains[0] || input.value.substr(0, 7) === domains[1] || input.value.substr(0, 4) === domains[2] || input.value.substr(0, 12) === domains[3] || input.value.substr(0, 11) === domains[4]) {
        ipaddress_head.innerHTML = 'Domain'
    }
    if(input.value.substr(0, 8) === domains[0]){
        ipaddress.innerHTML = input.value.substring(8);
    }
    if (input.value.substr(0, 7) === domains[1]) {
        ipaddress.innerHTML = input.value.substring(7);
    }
    if (input.value.substr(0, 4) === domains[2]) {
        ipaddress.innerHTML = input.value.substring(4);
    }
    if (input.value.substr(0, 12) === domains[3]) {
        ipaddress.innerHTML = input.value.substring(12);
    }
    if (input.value.substr(0, 11) === domains[4]) {
        ipaddress.innerHTML = input.value.substring(11);
    }    
}

let proxyURL = 'https://cors-anywhere.herokuapp.com/'

function fetchUrl() {
    fetch(proxyURL+'https://geo.ipify.org/api/v1?apiKey='+Api_Key+'&ipAddress='+input.value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function(res){
            res.json();
        })
        .then(function(data){
            trackme(data.location.region, data.location.country, data.location.timzone, data.isp);
            if (data.ip === undefined) {
                console.log(data.ip);
                return
            }
            /*Script for Mapping
            mapboxgl.accessToken = token;
            let map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                zoom: 12,
                center: [data.location.lng, data.location.lat]
            });

            let geojson = [
                {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        geometry:{
                            type: 'Point',
                            coordinates: [data.location.lng, data.location.lat]
                        },
                        properties:{
                            title: data.as.name,
                            description: data.isp
                        }
                    }]
                }
            ];
            geojson.features.forEach(function(marker){
                let mark = document.createElement('div');
                mark.classList.add('marker');
                new mapboxgl.Marker(mark)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({
                    offset: 25
                }))
                .setHTML(`<h3>`+marker.properties.title+`</h3> <p>`+marker.properties.description+`</p>`)
                .addTo(map)
            })*/
        })
        .catch(function(err){
            mapContainer.classList.remove('seemap')
            alert(err)
        })
}

function tracker() {
    if (input.value==="" || input.value === null) {
        input.classList.add('disappear');
        trackerbtn.classList.add('disappear');
        mapContainer.classList.add('disappear');
        trackerHead.classList.add('enabled');
        overlay.classList.add('enabled');
        const alertOne = document.createElement('div');
        const alertOneIcon = document.createElement('i');
        const alertOneInfo = document.createElement('p');
        const alertOneHead = document.createElement('h5');
        const alertOneCta = document.createElement('button');
        alertOne.classList.add('fade-in');
        alertOneIcon.classList.add('fa');
        alertOneIcon.classList.add('fa-warning');
        alertOneHead.innerHTML = 'Trackdown says:'
        alertOne.classList.add('tracker-alert');
        alertOneInfo.innerHTML = 'Please enter the IP Address you want to track down.';
        alertOneCta.innerHTML = 'Got it'
        alertOneCta.classList.add('tracker-cta');
        alertOne.appendChild(alertOneIcon);
        alertOne.appendChild(alertOneHead);
        alertOne.appendChild(alertOneInfo);
        alertOne.appendChild(alertOneCta);
        alerts.appendChild(alertOne);

        alertOneCta.addEventListener('click', ()=>{
            alertOne.classList.remove('fade-in');
            alertOne.classList.add('fade-out');
            setTimeout(()=>{
                alerts.removeChild(alertOne);
            }, 1000)
            input.classList.remove('disappear');
            trackerbtn.classList.remove('disappear');
            mapContainer.classList.remove('disappear');
            trackerHead.classList.remove('enabled');
            overlay.classList.remove('enabled');
        })
    }
    else if(input.value.substr(0, 8) !== domains[0] && input.value.substr(0, 7) !== domains[1] && input.value.substr(0, 4) !== domains[2] && input.value.substr(0, 12) !== domains[3] && input.value.substr(0, 11) !== domains[4]){
        let checkip =  /[.]/
        if (checkip.test(input.value) === false) {
        input.value = '';
        input.classList.add('disappear');
        trackerbtn.classList.add('disappear');
        mapContainer.classList.add('disappear');
        trackerHead.classList.add('enabled');
        overlay.classList.add('enabled');
        const alertTwo = document.createElement('div');
        const alertTwoIcon = document.createElement('i');
        const alertTwoInfo = document.createElement('p');
        const alertTwoHead = document.createElement('h5');
        const alertTwoCta = document.createElement('button');
        alertTwo.classList.add('fade-in');
        alertTwoIcon.classList.add('fa');
        alertTwoIcon.classList.add('fa-warning');
        alertTwoHead.innerHTML = 'Trackdown says:'
        alertTwo.classList.add('tracker-alert');
        alertTwoInfo.innerHTML = 'Please enter a correct IP Address.';
        alertTwoCta.innerHTML = 'Got it'
        alertTwoCta.classList.add('tracker-cta');
        alertTwo.appendChild(alertTwoIcon);
        alertTwo.appendChild(alertTwoHead);
        alertTwo.appendChild(alertTwoInfo);
        alertTwo.appendChild(alertTwoCta);
        alerts.appendChild(alertTwo);
        alertTwoCta.addEventListener('click', ()=>{
            alertTwo.classList.remove('fade-in');
            alertTwo.classList.add('fade-out');
            setTimeout(()=>{
                alerts.removeChild(alertTwo);
            }, 1000)
            input.classList.remove('disappear');
            trackerbtn.classList.remove('disappear');
            mapContainer.classList.remove('disappear');
            trackerHead.classList.remove('enabled');
            overlay.classList.remove('enabled');
        })
        }
        else{
            fetchUrl();
        }
    }
    else{
        fetchUrl();        
    }
}

trackerbtn.addEventListener('click', ()=>{
    tracker();
    mapContainer.classList.add('seemap')
});
input.addEventListener('keyup', event=>{
    if (event.keyCode === 13) {
        tracker();
        mapContainer.classList.add('seemap')
    }
})
