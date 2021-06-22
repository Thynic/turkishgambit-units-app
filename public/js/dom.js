const results = document.querySelector('#results')
const nicknameDiv = document.querySelector('#nickname')
// const patchNicknameDiv = document.querySelector('#patch-nickname-div')
const patchInput = document.querySelector('#patch-input')
const patchButton = document.querySelector('#submit-button-patch')
const nickLabel = document.querySelector('#nick-label')

results.style.display = "none";

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

fetch('/patch-metadata').then((response) => {
    response.json().then((patchNick) => {
        if (patchNick[0]) {
            patchInput.defaultValue = patchNick[0][0]
            patchInput.style.color = "#af1a1a"
        } 
    })
})






