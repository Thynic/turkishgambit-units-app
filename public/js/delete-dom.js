const feedbackDiv = document.querySelector('#delete-feedback')

fetch('/deleted-metadata').then((response) => {
    response.json().then((delFeedback) => {
        const fback = document.createElement('p')
        fback.textContent = delFeedback[0]

        feedbackDiv.append(fback)
        feedbackDiv.style.display = "block"
    })
})