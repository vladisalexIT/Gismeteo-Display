const apiKey = 'ZT2F2DW4WMZT7PZ42223YU4FL';
        let currentWeatherData = null;
        let isExpanded = false;

        async function updateWeather() {
            const city = document.getElementById('citySelect').value;
            const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json&lang=ru`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Город не найден');
                const data = await response.json();
                currentWeatherData = data;

                const currentZone = document.getElementById('currentWeather');
                currentZone.innerHTML = `
                    <div class="city">${data.resolvedAddress}</div>
                    <div class="temp">${Math.round(data.currentConditions.temp)}°C</div>
                    <div class="desc">${data.currentConditions.conditions}</div>
                `;

                const forecastZone = document.getElementById('forecast');
                forecastZone.innerHTML = '';

                const nextDays = data.days.slice(1, 9); 
                
                nextDays.forEach(day => {
                    const date = new Date(day.datetime).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
                    forecastZone.innerHTML += `
                        <div class="forecast-item">
                            <div class="forecast-date">${date}</div>
                            <div class="forecast-temp">${Math.round(day.temp)}°C</div>
                            <div style="font-size: 0.7rem">${day.conditions}</div>
                        </div>
                    `;
                });

                if (isExpanded) {
                    collapseDetails();
                }

            } catch (error) {
                alert(error.message);
            }
        }

        function showDetails() {
            if (!currentWeatherData) return;
            
            const currentZone = document.getElementById('currentWeather');
            const forecastZone = document.getElementById('forecast');
            
            currentZone.classList.add('expanded');
            forecastZone.classList.add('hidden');
            
            const conditions = currentWeatherData.currentConditions;
            currentZone.innerHTML = `
                <div class="city">${currentWeatherData.resolvedAddress}</div>
                <div class="temp">${Math.round(conditions.temp)}°C</div>
                <div class="desc">${conditions.conditions}</div>
                
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">Ощущается как</div>
                        <div class="detail-value">${Math.round(conditions.feelslike)}°C</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Влажность</div>
                        <div class="detail-value">${conditions.humidity}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Ветер</div>
                        <div class="detail-value">${Math.round(conditions.windspeed)} м/с</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Давление</div>
                        <div class="detail-value">${Math.round(conditions.pressure)} гПа</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Видимость</div>
                        <div class="detail-value">${Math.round(conditions.visibility)} км</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">УФ-индекс</div>
                        <div class="detail-value">${conditions.uvindex}</div>
                    </div>
                </div>
                
                <button id="backBtn" class="back-btn">Назад</button>
            `;
            
            document.getElementById('backBtn').addEventListener('click', collapseDetails);
            
            isExpanded = true;
        }

        function collapseDetails() {
            const currentZone = document.getElementById('currentWeather');
            const forecastZone = document.getElementById('forecast');
            
            currentZone.classList.remove('expanded');
            forecastZone.classList.remove('hidden');
            
            if (currentWeatherData) {
                currentZone.innerHTML = `
                    <div class="city">${currentWeatherData.resolvedAddress}</div>
                    <div class="temp">${Math.round(currentWeatherData.currentConditions.temp)}°C</div>
                    <div class="desc">${currentWeatherData.currentConditions.conditions}</div>
                `;
            }
            
            isExpanded = false;
        }

        document.getElementById('citySelect').addEventListener('change', updateWeather);
        document.getElementById('searchBtn').addEventListener('click', showDetails);

        updateWeather();