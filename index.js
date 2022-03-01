const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace('{%tempVal%}', orgVal.main.temp);
    temperature = temperature.replace('{%tempMin%}', orgVal.main.temp_min);
    temperature = temperature.replace('{%tempMax%}', orgVal.main.temp_max);
    temperature = temperature.replace('{%location%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    temperature = temperature.replace('{%tempStatus%}', orgVal.weather[0].main);

    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == '/'){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Raipur&units=metric&appid=fca65b99f944af316b41c55c937d467d"
        )
        .on('data', (chunk) =>{
            const objData = JSON.parse(chunk);
            const arrayData = [objData];
            // console.log(arrayData[0].main.temp);

            const realTimeData = arrayData.map((val) => replaceVal(homeFile, val))
            .join('');
            res.write(realTimeData);

        })
        .on('end', (err) =>{
            if(err) return console.log('connection closed due to error', err);

            res.end();
        });
    }
});

server.listen(8000, '127.0.0.1');
