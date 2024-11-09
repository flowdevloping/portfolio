
// Variables

const priceSpan = document.getElementById('price-span');
const dateSpan = document.getElementById('date-span');
const timeSpan = document.getElementById('time-span');
const clockDiv = document.getElementById('clock');
const daySpan = document.getElementById('day');
const monthSpan = document.getElementById('month');
const yearSpan = document.getElementById('year');
const timeDiv = document.getElementById('time');
const hourSpan = document.getElementById('hour');
const minuteSpan = document.getElementById('minute');
const secondsSpan = document.getElementById('seconds');
const chartContainer = document.getElementById('chart-container');
const chartButtons = document.querySelectorAll('.chart-button');

const updateButton = document.getElementById('update-price-btn');

// LIVE CLOCK
let date = new Date();
let sec = date.getSeconds();

// Ticker Symbol
let ticker; 

// STOCK TRACKER
const stockInput = document.getElementById('stock-input');
const stockSearchResults = document.getElementById('stock-search-results');
let stockItems = document.querySelectorAll('.stock-search-item');

let stockSymbolText = document.querySelector('.stock-symbol');
let stockSymbol = stockSymbolText.id;
let stockNameText = document.querySelector('.stock-name');
let stockName = stockNameText.id;


// HIDE
function hide(element){
    element.classList.add('hidden');
}

// LIVE PRICE
function getCurrentPrice(stockSymbol) {
    console.log(`Trying to get current price of ${stockSymbol}`);
    fetch(`https://irp3olgj53.execute-api.eu-central-1.amazonaws.com/dev/get_price_live?symbol=${stockSymbol}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error whereas fetch. Status: ${response.status}`);
        }
        return response.json()
    })
    .then(data => {
        console.log(data);

        if (!data) {
            throw new Error(`No Data found`);
        }

        
        const date = new Date(data[0]['date']).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        time = new Date(data[0]['date']).toLocaleTimeString()

        priceSpan.innerHTML = data[0]['close'];
        dateSpan.innerHTML = date;
        timeSpan.innerHTML = time;   

        stockSymbolText.innerHTML = stockSymbol;
        stockSymbolText.id = stockSymbol;

        stockName = data[0]['name'];
        stockNameText.innerHTML = stockName;
        stockNameText.id = stockName;

        const stock = {
            symbol: stockSymbol,
            name: stockName,
            price: data[0]['close'],
        };

        saveStockToLocalStorage(stock);
    })
    .catch(error => {
        console.log(error);
    })
};


// FETCH DIAGRAM DATA
async function getData(symbol, time_frame) {
    try {
        const response = await fetch(`https://irp3olgj53.execute-api.eu-central-1.amazonaws.com/dev/get_price_${time_frame}?symbol=${symbol}`);
        if (!response.ok) {
            throw new Error(`Error during fetch. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('DATA FROM getData');
        console.log(data);

        if (!data) {
            throw new Error(`No Data found`);
        }
        return data;
    } catch (error) {
        console.log(error);
    }
}


// DIAGRAMS
async function plotlyChart(symbol, time_frame) {
    ticker = await getData(symbol, time_frame);
    ticker.forEach(d => {
        d.date = new Date(d.date);
    });

    function unpack(objects, key) {
        return objects.map(function(object) {
        return object[key];
        });
    }

    let typeValue = 'candlestick';
    var trace;

    if (time_frame === '1d' || time_frame === '7d') {
        typeValue = "scatter";

        trace = {
            x: unpack(ticker, 'date'),
            y: unpack(ticker, 'close'), // Stelle sicher, dass y definiert ist
            type: typeValue,
            xaxis: 'x',
            yaxis: 'y',
            line: {color: 'orange'},
        };
    } else {
        trace = {
            x: unpack(ticker, 'date'),
            close: unpack(ticker, 'close'),
            high: unpack(ticker, 'high'),
            low: unpack(ticker, 'low'),
            open: unpack(ticker, 'open'),
            stock_splits: unpack(ticker, 'stock_splits'),
            volume: unpack(ticker, 'volume'),
        
            // cutomise colors
            increasing: {line: {color: 'orange'}},
            decreasing: {line: {color: 'black'}},
            
            type: typeValue,
            xaxis: 'x',
            yaxis: 'y'
        };
    };

    var data = [trace];

    var layout = {
        dragmode: 'zoom',
        showlegend: false,
        autosize: true,
        xaxis: {
        rangeslider: {
                visible: false
            }
        },
        margin: { l: 30, r: 30, t:  10, b: 50 },
    };

    var config = {responsive: true};
    
    Plotly.newPlot('chart-container', data, layout, config);
};


// LIVE CLOCK
function updateTime() {
    date = new Date();

    day = date.getDate();
    month = date.getMonth()+1 ;
    year = date.getFullYear();
    hour = date.getHours();
    minute = date.getMinutes();
    seconds = date.getSeconds();

    daySpan.innerHTML = String(day + '.').padStart(3, '0');
    monthSpan.innerHTML = String(month + '.').padStart(3, '0');
    yearSpan.innerHTML = String(year).padStart(4, '0');
    hourSpan.innerHTML = String(hour + ':').padStart(3, '0');
    minuteSpan.innerHTML = String(minute + ':').padStart(3, '0');
    secondsSpan.innerHTML = String(seconds).padStart(2, '0');
};


function addClicked(clickedBtn, otherBtns) {
    otherBtns.forEach(btn => {
        btn.classList.remove('clicked');
    });
    clickedBtn.classList.add('clicked');
}


// STOCK TRACKER
stockInput.addEventListener('input', function(event) {
    event.preventDefault(); 

    const KEYWORD_SEARCH = stockInput.value;

    if (!KEYWORD_SEARCH) {
        stockSearchResults.innerHTML ="";
        hide(stockSearchResults);
        return
    }
    else {
        // Fetching stock symbols with API
        fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${KEYWORD_SEARCH}&apikey=9H9ZDBG6PJ46643K`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data = data['bestMatches'];
            stockSearchResults.innerHTML = "";

            // Looping over all findings of stock symbols and adding them to stockSearchResults (ul)
            for (let i=0; i<data.length; i++) {

                let li = document.createElement('li');
                let symbol = document.createElement('span');
                let name = document.createElement('span');
                
                symbol.innerHTML = data[i]['1. symbol'];
                name.innerHTML = data[i]['2. name'];

                li.append(symbol);
                li.append(name);

                // Adding id & class to list item
                li.id = data[i]['1. symbol']
                li.classList.add('stock-search-item');

                // Adding EventListener to every stock element found
                li.addEventListener('click', function() {
                    stockSymbol = data[i]['1. symbol'];
                    stockSymbolText.id = stockSymbol;
                    stockName = data[i]['2. name'];
                    stockNameText.id = stockName;

                    getCurrentPrice(stockSymbol);
                    plotlyChart(stockSymbol, '1mo');
                });

                stockSearchResults.appendChild(li);
            }
            stockSearchResults.classList.remove('hidden');
        })
        .catch(error => {
            console.log(error);
        });
    }
});

stockInput.addEventListener('change', function(event) {
    getCurrentPrice(element.innerHTML);
    plotlyChart(element.innerHTML, '1mo');
});


// LOCALSTORAGE
const localStorageKey = 'watchedStock';

function loadWatchedStock() {
    const storedStock = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    console.log("storedStock");
    console.log(storedStock);
    getCurrentPrice(storedStock.symbol);
    plotlyChart(storedStock.symbol, '1mo');
};

function saveStockToLocalStorage(stock) {
    let storedStock = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    storedStock = stock;
    localStorage.setItem(localStorageKey, JSON.stringify(storedStock));
};


updateButton.addEventListener('click', () => getCurrentPrice(stockSymbol));

setInterval(updateTime, 1000);

// UPDATE PRICE
window.onload = setTimeout(setInterval(getCurrentPrice(stockSymbol), 60*1000), (60-sec)*1000);

chartButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        plotlyChart(stockSymbol, btn.id);
        addClicked(btn, chartButtons);
    });
});


window.onload = loadWatchedStock;

