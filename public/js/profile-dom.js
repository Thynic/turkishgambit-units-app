const profileResults = document.querySelector('#profile-results')


fetch('/inquire-by-nick-metadata').then((response) => {
    response.json().then((profile) => {
        profile.forEach((data, index) => {
            const unitData = document.createElement('p')
            unitData.textContent = data

            if (index === 0 && data !== 'Oyuncu bulunamadı!') {
                unitData.style.fontSize = "25px";
                unitData.style.color = "#af1a1a";
            } else if (index === 1) {
                unitData.style.fontSize = "20px";
                unitData.style.marginTop = "-10px";
                unitData.style.color = "#af1a1a";
            } 

            profileResults.append(unitData)
            profileResults.style.display = "block";
        })
    })
})