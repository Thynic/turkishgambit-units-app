const results = document.querySelector('#results')   

fetch('/metadata').then((response) => {
    response.json().then((nicknames) => {   
        nicknames.forEach((nick, index) => {
            const nickname = document.createElement('p')

            if (index === 0) {
                nickname.innerHTML = '<span id="unit-name">' + nick  + '</span>'
            } else {
                nickname.textContent = nick
            }

            results.append(nickname)
            results.style.display = "block";
        })
    })
})






